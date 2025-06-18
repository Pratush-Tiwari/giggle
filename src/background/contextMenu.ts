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
const showLoadingState = async (tabId: number) => {
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
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
    `
  });

  await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const overlay = document.createElement('div');
      overlay.className = 'giggle-loading-overlay';
      overlay.id = 'giggle-loading';
      
      const content = document.createElement('div');
      content.className = 'giggle-loading-content';
      content.textContent = 'Saving note...';
      
      overlay.appendChild(content);
      document.body.appendChild(overlay);
    }
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
    }
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
    await showLoadingState(tab.id);
    
    // Get user's folders
    const folders = await folderService.getUserFolders(user.uid);

    // Find the target folder based on the menu item clicked
    const targetFolder = folders.find(
      folder => folder.name === (info.menuItemId === 'saveToDefault' ? 'Default' : 'Important'),
    );

    if (!targetFolder) {
      console.error('Target folder not found');
      return;
    }

    // Check if this is a summarize action
    const shouldSummarize =
      typeof info.menuItemId === 'string' && info.menuItemId.startsWith('summarize');
    let content = info.selectionText;

    if (shouldSummarize) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer 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`,
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

        const data = await response.json();
        if (data.choices && data.choices[0]?.message?.content) {
          content = data.choices[0].message.content;
        }
      } catch (error) {
        console.error('Error summarizing text:', error);
        throw new Error('Failed to summarize text');
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
      message: 'Failed to save note. Please try again.',
    });
  }
});
