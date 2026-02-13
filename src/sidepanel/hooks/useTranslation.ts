import { useCallback } from 'react';

/**
 * Hook to access Chrome's i18n API in React components.
 * wrappers chrome.i18n.getMessage for easy usage.
 */
export const useTranslation = () => {
  /**
   * Translates a message key.
   * @param key - The key of the message in messages.json.
   * @param substitutions - Optional substitutions for placeholders.
   * @returns {string} The translated message.
   */
  const t = useCallback((key: string, substitutions?: string | string[]) => {
    return chrome.i18n.getMessage(key, substitutions);
  }, []);

  return { t };
};
