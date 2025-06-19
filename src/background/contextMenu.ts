import { folderService } from '../services/folderService';
import { noteService } from '../services/noteService';
import { auth } from '../config/firebase';

// Create context menu items when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'saveToDefault',
    title: 'Save to Default',
    contexts: ['selection'],
  });

  chrome.contextMenus.create({
    id: 'saveToImportant',
    title: 'Save to Important',
    contexts: ['selection'],
  });

  chrome.contextMenus.create({
    id: 'summarizeToDefault',
    title: 'Summarize & Save to Default',
    contexts: ['selection'],
  });

  chrome.contextMenus.create({
    id: 'summarizeToImportant',
    title: 'Summarize & Save to Important',
    contexts: ['selection'],
  });
});

// Function to show loading state in active tab
const showLoadingState = async (tabId: number, isSummarizing: boolean = false) => {
  await chrome.scripting.insertCSS({
    target: { tabId },
    css: `
      .giggle-loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999999;
      }
      .giggle-loading-content {
        background: white;
        padding: 24px 32px;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        font-family: system-ui, -apple-system, sans-serif;
      }
      .giggle-loading-spinner {
        width: 32px;
        height: 32px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #3498db;
        border-radius: 50%;
        animation: giggle-spin 1s linear infinite;
      }
      @keyframes giggle-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .giggle-loading-text {
        color: #333;
        font-size: 16px;
        font-weight: 500;
      }
    `,
  });

  await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const overlay = document.createElement('div');
      overlay.className = 'giggle-loading-overlay';
      overlay.id = 'giggle-loading';

      const content = document.createElement('div');
      content.className = 'giggle-loading-content';

      const spinner = document.createElement('div');
      spinner.className = 'giggle-loading-spinner';

      const text = document.createElement('div');
      text.className = 'giggle-loading-text';
      text.textContent = isSummarizing ? 'Summarizing and saving note...' : 'Saving note...';

      content.appendChild(spinner);
      content.appendChild(text);

      overlay.appendChild(content);
      document.body.appendChild(overlay);
    },
  });
};

// Function to remove loading state
const removeLoadingState = async (tabId: number) => {
  await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const overlay = document.getElementById('giggle-loading');
      if (overlay) {
        overlay.remove();
      }
    },
  });
};

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!info.selectionText || !tab?.url || !tab.id) return;

  const user = auth.currentUser;
  if (!user) {
    // If user is not logged in, open the extension popup
    chrome.action.openPopup();
    return;
  }

  try {
    const shouldSummarize =
      typeof info.menuItemId === 'string' && info.menuItemId.startsWith('summarize');
    await showLoadingState(tab.id, shouldSummarize);

    // Get user's folders
    const folders = await folderService.getUserFolders(user.uid);

    // Find the target folder based on the menu item clicked
    const targetFolder = folders.find(folder => {
      const folderName =
        typeof info.menuItemId === 'string' && info.menuItemId.includes('Default')
          ? 'Default'
          : 'Important';
      return folder.name === folderName;
    });

    if (!targetFolder) {
      console.error('Target folder not found');
      return;
    }

    // Check if this is a summarize action
    let content = info.selectionText;

    if (shouldSummarize) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer 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`,
            // 'HTTP-Referer': window.location.origin,
            'HTTP-Referer': chrome.runtime.getURL(''),
            'X-Title': 'Giggle Notes',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek/deepseek-r1-0528:free',
            messages: [
              {
                role: 'user',
                content: `Please provide a nice detailed summary and include all the important points of the following text:\n\n${content}`,
              },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.choices || !data.choices[0]?.message?.content) {
          throw new Error('Invalid response format from API');
        }

        content = data.choices[0].message.content.trim();

        if (!content) {
          throw new Error('Received empty summary from API');
        }
      } catch (error) {
        console.error('Error summarizing text:', error);
        chrome.notifications.create({
          type: 'basic',
          iconUrl: '/icon-48.png',
          title: 'Summarization Failed',
          message: 'Could not summarize the text. Saving original text instead.',
        });
        // Continue with original text if summarization fails
      }
    }

    // Create a new note with the selected text or summary
    await noteService.createNote({
      userId: user.uid,
      folderId: targetFolder.folderId,
      title: `${shouldSummarize ? 'Summary of: ' : ''}${tab.title || 'Saved Note'}`,
      content: content,
      tags: [],
      isArchived: false,
      isPinned: false,
      url: tab.url,
    });

    // Remove loading state
    await removeLoadingState(tab.id);

    // Show success notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '/icon-48.png',
      title: 'Note Saved',
      message: `Text saved to ${targetFolder.name} folder`,
    });
  } catch (error) {
    console.error('Error saving note:', error);

    // Remove loading state on error
    if (tab.id) {
      await removeLoadingState(tab.id);
    }

    chrome.notifications.create({
      type: 'basic',
      iconUrl: '/icon-48.png',
      title: 'Error',
      message:
        (error as Error).message === 'Failed to summarize text'
          ? 'Failed to summarize and save note. Please try again.'
          : 'Failed to save note. Please try again.',
    });
  }
});
