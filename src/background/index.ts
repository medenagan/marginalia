/**
 * Background service worker.
 * Handles extension installation and side panel behavior.
 */
import { MessageType, isAppMessage } from '../types/messages';
import { createNote } from '../utils/storage';
import { Note } from '../types/note';

const CONTEXT_MENU_ID = 'create-marginalia-note';

const generateWelcomingNote = async () => {
  const { welcoming_note_created } = await chrome.storage.local.get('welcoming_note_created');
  if (!welcoming_note_created) {
    const url = chrome.runtime.getURL('welcome.html');
    const title = chrome.i18n.getMessage('welcome_note_title');
    const content = chrome.i18n.getMessage('welcome_note_content');
    const icon = chrome.runtime.getURL('icons/icon-48.png');

    await createNote({
      title,
      content,
      url,
      icon,
    });

    await chrome.storage.local.set({ welcoming_note_created: true });
  }
};

chrome.runtime.onInstalled.addListener(async (details) => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

  if (details.reason === 'install' || details.reason === 'update') {
    await generateWelcomingNote();
    chrome.tabs.create({ url: 'welcome.html' });
  }

  // Set the uninstall URL
  chrome.runtime.setUninstallURL('https://medenagan.github.io/marginalia/goodbye.html', () => {
    if (chrome.runtime.lastError) {
      console.warn('Failed to set uninstall URL:', chrome.runtime.lastError);
    }
  });

  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: chrome.i18n.getMessage('contextMenu_addNote'),
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === CONTEXT_MENU_ID && info.selectionText && tab && tab.id && tab.url) {
    const noteData: Omit<Note, 'id' | 'updatedAt' | 'createdAt'> = {
      title: tab.title || 'New Note',
      content: info.selectionText,
      url: tab.url,
      icon: tab.favIconUrl || '',
    };

    // 1. Open Side Panel immediately (requires user gesture)
    await chrome.sidePanel.open({ tabId: tab.id });

    // 2. Create Note (async)
    const newNote = await createNote(noteData);

    // 3. Send Message to Side Panel
    // Wait briefly for side panel to initialize
    setTimeout(() => {
      chrome.runtime
        .sendMessage({
          type: MessageType.SELECT_NOTE,
          noteId: newNote.id,
        })
        .catch(() => {
          // Ignore errors if side panel is not ready to receive message immediately
        });
    }, 500);
  }
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
