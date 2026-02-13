/**
 * Formats a timestamp into a relative time string (e.g. "12 minutes ago").
 * @param timestamp - The timestamp in milliseconds.
 * @returns A relative time string.
 */
export const getRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return chrome.i18n.getMessage('time_just_now');
  } else if (minutes < 60) {
    if (minutes === 1) {
      return chrome.i18n.getMessage('time_minute_ago');
    }
    return chrome.i18n.getMessage('time_minutes_ago', [minutes.toString()]);
  } else if (hours < 24) {
    if (hours === 1) {
      return chrome.i18n.getMessage('time_hour_ago');
    }
    return chrome.i18n.getMessage('time_hours_ago', [hours.toString()]);
  } else if (days < 7) {
    if (days === 1) {
      return chrome.i18n.getMessage('time_day_ago');
    }
    return chrome.i18n.getMessage('time_days_ago', [days.toString()]);
  } else {
    return new Date(timestamp).toLocaleDateString();
  }
};
