/**
 * Background service worker.
 * Handles extension installation and side panel behavior.
 */
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});
