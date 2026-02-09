/**
 * Background service worker.
 * Handles extension installation and side panel behavior.
 */
import { MessageType, isAppMessage } from '../types/messages';

import { storeMockNotes } from '../mock/notes';

const generateMockNotes = async () => {
  const { mock_notes_generated } = await chrome.storage.local.get('mock_notes_generated');
  if (!mock_notes_generated) {
    await storeMockNotes(1000);
    await chrome.storage.local.set({ mock_notes_generated: true });
  }
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  void generateMockNotes();
});

/**
 * Listen for messages from the side panel.
 */
chrome.runtime.onMessage.addListener((message) => {
  if (!isAppMessage(message)) return;

  if (message.type === MessageType.OPEN_URL) {
    chrome.tabs.query({ url: message.url }, (tabs) => {
      if (tabs.some((t) => t.active)) return;

      if (!tabs.length) {
        chrome.tabs.create({ url: message.url, active: true });
      } else if (tabs[0].id) {
        chrome.tabs.update(tabs[0].id, { active: true });
      }
    });
  }
});
