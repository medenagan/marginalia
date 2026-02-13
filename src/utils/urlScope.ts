/**
 * Utility functions for deriving scope keys from the current URL.
 * In a production environment, these would parse the active tab's URL.
 */

// Placeholder URL used for mocking purposes during development.
const MOCK_URL = new URL('https://example.com/some/article');

/**
 * Normalizes a URL for comparison by removing query parameters, hash fragments,
 * and trailing slashes.
 *
 * Example:
 * Input: "https://example.com/page/?ref=123#section"
 * Output: "https://example.com/page"
 *
 * Input: "https://example.com/page/"
 * Output: "https://example.com/page"
 *
 * @param urlStr - The URL string to normalize.
 * @returns {string} The normalized URL string.
 */
export const normalizeUrl = (urlStr: string): string => {
  try {
    const url = new URL(urlStr);
    // Remove trailing slash from pathname if present (and not root)
    const pathname =
      url.pathname.endsWith('/') && url.pathname.length > 1
        ? url.pathname.slice(0, -1)
        : url.pathname;

    // Return origin + normalized pathname, explicitly excluding search (?) and hash (#)
    return `${url.origin}${pathname}`;
  } catch {
    // If invalid URL, return as is (or handle as needed)
    return urlStr;
  }
};

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
