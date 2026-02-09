import { Note } from '../types/note';

const TEMPLATES = {
  TODAY: "Today's note at {time}",
  YESTERDAY: 'Yesterday Note',
  LAST_WEEK: '{dayName} Note',
  OLDER: 'Note {month} {day}',
  OLDER_WITH_YEAR: 'Note {month} {day} {year}',
};

/**
 * Helper to replace variables in a template string.
 */
const formatTitle = (template: string, variables: Record<string, string>): string => {
  return template.replace(/{(\w+)}/g, (_, key) => variables[key] || `{${key}}`);
};

/**
 * Generates a display title for a note based on its creation/update time.
 * @param note - The note object
 * @returns A string to be displayed as the title
 */
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
    return formatTitle(TEMPLATES.TODAY, { time });
  }

  // Yesterday
  if (diffDays === 1) {
    return TEMPLATES.YESTERDAY;
  }

  // Last 6 days
  if (diffDays > 1 && diffDays < 7) {
    const dayName = new Intl.DateTimeFormat('default', {
      weekday: 'long',
    }).format(noteDate);
    return formatTitle(TEMPLATES.LAST_WEEK, { dayName });
  }

  // Older
  const day = new Intl.DateTimeFormat('default', { day: 'numeric' }).format(noteDate);
  const month = new Intl.DateTimeFormat('default', { month: 'short' }).format(noteDate);
  const year = noteDate.getFullYear().toString();

  if (noteDate.getFullYear() !== now.getFullYear()) {
    return formatTitle(TEMPLATES.OLDER_WITH_YEAR, { day, month, year });
  }

  return formatTitle(TEMPLATES.OLDER, { day, month });
};
