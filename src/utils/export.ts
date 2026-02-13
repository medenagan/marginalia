import { Note } from '../types/note';
import { getNoteDisplayTitle } from './title';

/**
 * The separator used for CSV fields.
 * Using tab (\t) to avoid issues with content containing commas.
 */
const FIELD_SEPARATOR = '\t';

/**
 * The newline character used for CSV rows.
 */
const NEWLINE = '\n';

/**
 * Shared DOMParser instance to avoid overhead in large loops.
 */
const parser = new DOMParser();

/**
 * Regex to identify characters that require CSV escaping according to RFC 4180.
 * Matches double quotes, the field separator itself, tabs (explicitly), newlines, or carriage returns.
 */
const SPECIAL_CHARACTERS_REGEX = new RegExp(`["${FIELD_SEPARATOR}\t\n\r]`);

/**
 * Strips HTML tags from a string, returning only text content.
 *
 * @param html - The HTML string to strip.
 * @returns The plain text content of the HTML.
 */
const stripHtml = (html: string): string => {
  if (!html) return '';
  const doc = parser.parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

/**
 * Escapes a string for CSV format based on RFC 4180 rules.
 *
 * If the value contains special characters (double quotes, field separator, newline, etc.),
 * the entire value is wrapped in double quotes.
 * Inside the quoted value, existing double quotes are escaped by doubling them (" -> "").
 *
 * @param cell - The string content of the cell.
 * @returns The escaped CSV cell string.
 */
const escapeCsvCell = (cell: string): string => {
  if (SPECIAL_CHARACTERS_REGEX.test(cell)) {
    return `"${cell.replace(/"/g, '""')}"`;
  }
  return cell;
};

/**
 * Generates a CSV Blob from a list of notes.
 *
 * @param notes - Array of Note objects to include in the CSV.
 * @returns A Blob containing the CSV data.
 */
const generateCsvBlob = (notes: Note[]): Blob => {
  const HEADERS = [
    chrome.i18n.getMessage('export_header_title'),
    chrome.i18n.getMessage('export_header_content'),
    chrome.i18n.getMessage('export_header_url'),
    chrome.i18n.getMessage('export_header_created_at'),
    chrome.i18n.getMessage('export_header_updated_at'),
  ];
  // Pre-allocate array for performance: +1 for header line
  const lines = new Array(notes.length + 1);

  // Set Header as the first line
  lines[0] = HEADERS.map(escapeCsvCell).join(FIELD_SEPARATOR);

  // Use a simple loop for maximum performance
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    // Build row array inline and join immediately to minimize intermediate objects
    lines[i + 1] = [
      escapeCsvCell(getNoteDisplayTitle(note)),
      escapeCsvCell(stripHtml(note.content)),
      escapeCsvCell(note.url),
      escapeCsvCell(new Date(note.createdAt).toLocaleString()),
      escapeCsvCell(new Date(note.updatedAt).toLocaleString()),
    ].join(FIELD_SEPARATOR);
  }

  // Join all lines with newline
  const csvContent = lines.join(NEWLINE);

  // Return Blob with correct MIME type
  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
};

/**
 * Triggers a browser download for the given Blob.
 *
 * @param blob - The file data to download.
 * @param filename - The name of the file to save as.
 */
const triggerCsvDownload = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // Cleanup
};

/**
 * Exports a list of notes to a CSV file.
 * The CSV includes columns: Title, Content (Text-only), URL, Created At, Updated At.
 * The file is generated with a Tab delimiter for better compatibility with content containing commas.
 *
 * @param notes - The list of notes to export.
 */
export const exportToCsv = (notes: Note[]): void => {
  const filename = `marginalia_notes_${new Date().toISOString().slice(0, 10)}.csv`;
  const csvBlob = generateCsvBlob(notes);
  triggerCsvDownload(csvBlob, filename);
};
