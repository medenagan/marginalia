import { Note } from '../types/note';

const getLocalizedWeekday = (date: Date): string => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return chrome.i18n.getMessage(`weekday_${days[date.getDay()]}`);
};

const getLocalizedMonth = (date: Date): string => {
  const months = [
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
  ];
  return chrome.i18n.getMessage(`month_${months[date.getMonth()]}`);
};

export const getNoteDisplayTitle = (note: Note): string => {
  const title = note.title?.trim();
  if (title.length > 0) {
    return title;
  }

  const noteDate = new Date(note.updatedAt);
  const now = new Date();

  // Reset hours to compare dates only
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfNoteDate = new Date(noteDate.getFullYear(), noteDate.getMonth(), noteDate.getDate());

  const diffTime = startOfToday.getTime() - startOfNoteDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Today
  if (diffDays === 0) {
    const time = new Intl.DateTimeFormat('default', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(noteDate);
    return chrome.i18n.getMessage('template_title_today', [time]);
  }

  // Yesterday
  if (diffDays === 1) {
    return chrome.i18n.getMessage('template_title_yesterday');
  }

  // Last 6 days
  if (diffDays > 1 && diffDays < 7) {
    const dayName = getLocalizedWeekday(noteDate);
    return chrome.i18n.getMessage('template_title_last_week', [dayName]);
  }

  // Older
  const day = noteDate.getDate().toString();
  const month = getLocalizedMonth(noteDate);
  const year = noteDate.getFullYear().toString();

  if (noteDate.getFullYear() !== now.getFullYear()) {
    return chrome.i18n.getMessage('template_title_older_year', [month, day, year]);
  }

  return chrome.i18n.getMessage('template_title_older', [month, day]);
};
