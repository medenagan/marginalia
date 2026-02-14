import { createRoot } from 'react-dom/client';
import React from 'react';

/**
 * Mounts the React application to the DOM.
 * Ensures the root element exists and sets the document title if an i18n key is provided.
 *
 * @param component The root React component to render.
 * @param titleI18nKey Optional i18n key for the document title.
 * @param rootId The ID of the root element (default: 'root').
 */
export const mountApp = (component: React.ReactNode, titleI18nKey?: string, rootId: string = 'root'): void => {
  // Set the document title with localization if key is provided
  if (titleI18nKey) {
    const title = chrome.i18n.getMessage(titleI18nKey);
    if (title) {
      document.title = title;
    }
  }

  // Ensure root element exists
  let rootElement = document.getElementById(rootId);
  if (!rootElement) {
    rootElement = document.createElement('div');
    rootElement.id = rootId;
    document.body.appendChild(rootElement);
  }

  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(component);
  }
};

/**
 * Localizes the HTML page by finding all elements with 'data-i18n' attribute
 * and replacing their content with the localized string.
 */
export const localizeHtmlPage = (): void => {
  const elements = document.querySelectorAll('[data-i18n]');

  elements.forEach((element) => {
    const key = element.getAttribute('data-i18n');
    if (key) {
      const message = chrome.i18n.getMessage(key);
      if (message) {
        element.textContent = message;
      }
    }
  });
};
