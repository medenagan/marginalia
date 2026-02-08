/**
 * Utility functions for deriving scope keys from the current URL.
 * In a production environment, these would parse the active tab's URL.
 */

// Placeholder URL used for mocking purposes during development.
const MOCK_URL = new URL('https://example.com/some/article');

/**
 * Gets the unique key for the current page scope.
 * @returns {string} The full URL of the page.
 */
export const getPageKey = (): string => {
  return MOCK_URL.href;
};

/**
 * Gets the unique key for the site scope.
 * @returns {string} The domain of the site.
 */
export const getSiteKey = (): string => {
  return MOCK_URL.hostname; // This returns the domain
};

/**
 * Gets the constant key for the global scope.
 * @returns {string} The global scope key.
 */
export const getGlobalKey = (): string => {
  return 'global';
};
