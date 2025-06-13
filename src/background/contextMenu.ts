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
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!info.selectionText || !tab?.url) return;

  const user = auth.currentUser;
  if (!user) {
    // If user is not logged in, open the extension popup
    chrome.action.openPopup();
    return;
  }

  try {
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

    // Create a new note with the selected text
    await noteService.createNote({
      userId: user.uid,
      folderId: targetFolder.folderId,
      title: tab.title || 'Saved Note',
      content: info.selectionText,
      tags: [],
      isArchived: false,
      isPinned: false,
      url: tab.url,
    });

    // Show success notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '/icon-48.png',
      title: 'Note Saved',
      message: `Text saved to ${targetFolder.name} folder`,
    });
  } catch (error) {
    console.error('Error saving note:', error);
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '/icon-48.png',
      title: 'Error',
      message: 'Failed to save note. Please try again.',
    });
  }
});
