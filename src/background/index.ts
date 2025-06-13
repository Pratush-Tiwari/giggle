import './contextMenu';

// Handle extension icon click
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: 'index.html',
    active: true,
  });
});
