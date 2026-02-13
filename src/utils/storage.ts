import DOMPurify from 'dompurify';
import { BucketLocation, NotesBucket } from '../types/database';
import { getNoteIdentifier, Note, NoteIdentifier } from '../types/note';

/**
 * Key prefix for domain-specific notes buckets.
 */
const STORAGE_PREFIX_DOMAIN = 'notes_domain';

/**
 * Generates a BucketLocation from a context URL.
 * @param href - The URL to derive the location from.
 * @returns {Readonly<BucketLocation>} The resolved location.
 */
export const resolveBucketLocation = (href: string): BucketLocation => {
  try {
    const url = new URL(href);
    return url.hostname as BucketLocation;
  } catch {
    return `*` as BucketLocation;
  }
};

/**
 * Resolves the storage key for a given location.
 * @param location - The location to resolve.
 * @returns {string} The storage key.
 */
const resolveKeyFromLocation = (location: BucketLocation): string => {
  return `${STORAGE_PREFIX_DOMAIN}:${location}`;
};

const getStorageKeyFromNoteId = (id: NoteIdentifier): string => {
  const location = id.split(':')[0] as BucketLocation;
  return resolveKeyFromLocation(location);
};

/**
 * Retrieves notes from storage, optionally filtering by specific locations.
 * @param locations - Optional array of locations to fetch notes for. If undefined, fetches all notes.
 * @returns {Promise<Record<NoteIdentifier, Note>>} A promise resolving to a record of notes.
 */
export const getNotes = async (
  locations?: BucketLocation[],
): Promise<Record<NoteIdentifier, Note>> => {
  if (locations && locations.length > 0) {
    const keys = locations.map(resolveKeyFromLocation);
    const result = await chrome.storage.local.get(keys);

    return Object.values(result).reduce(
      (acc, bucket) => ({
        ...acc,
        ...(bucket as NotesBucket),
      }),
      {} as Record<NoteIdentifier, Note>,
    );
  }

  // Fetch all notes if no specific locations provided
  const result = await chrome.storage.local.get(null);
  return Object.entries(result)
    .filter(([key]) => key.startsWith(STORAGE_PREFIX_DOMAIN))
    .map(([, bucket]) => bucket as NotesBucket)
    .reduce(
      (acc, bucket) => ({
        ...acc,
        ...bucket,
      }),
      {} as Record<NoteIdentifier, Note>,
    );
};

const isDOMAvailable = typeof window !== 'undefined' && typeof window.document !== 'undefined';

/**
 * Sanitizes HTML content using DOMPurify if DOM is available.
 * @param content - The HTML content to sanitize.
 * @returns {string} The sanitized content, or original content if DOM is unavailable.
 */
const sanitizeDom = (content: string): string => {
  if (isDOMAvailable) {
    return DOMPurify.sanitize(content);
  }
  return content;
};

// ... existing code ...

/**
 * Creates a new note in storage.
 * @param noteData - The initial data for the note.
 * @param location - The location to store the note in.
 * @returns {Promise<Note>} A promise resolving to the created note.
 */
export const createNote = async (
  noteData: Omit<Note, 'id' | 'updatedAt' | 'createdAt'>,
): Promise<Note> => {
  const createdAt = Date.now();
  const location = resolveBucketLocation(noteData.url);
  const id = getNoteIdentifier(location);
  const newNote: Note = {
    ...noteData,
    content: sanitizeDom(noteData.content),
    id,
    createdAt,
    updatedAt: createdAt,
  };

  const key = resolveKeyFromLocation(location);
  const result = await chrome.storage.local.get(key);
  const bucket: NotesBucket = result[key] || {};

  bucket[newNote.id] = newNote;
  await chrome.storage.local.set({ [key]: bucket });

  return newNote;
};

/**
 * Updates an existing note in storage.
 * @param id - The ID of the note to update.
 * @param updates - The fields to update.
 * @returns {Promise<Note>} A promise resolving to the updated note.
 */
export const updateNote = async (
  id: NoteIdentifier,
  updates: Omit<Partial<Note>, 'id' | 'updatedAt' | 'createdAt'>,
): Promise<Note> => {
  const key = getStorageKeyFromNoteId(id);
  const result = await chrome.storage.local.get(key);
  const bucket: NotesBucket = result[key] || {};

  const currentNote = bucket[id];
  if (!currentNote) {
    throw new Error(`Note with id ${id} not found in bucket ${key}`);
  }

  const updatedNote: Note = {
    ...currentNote,
    ...updates,
    updatedAt: Date.now(),
  };

  if (updates.content) {
    updatedNote.content = sanitizeDom(updates.content);
  }

  bucket[id] = updatedNote;
  await chrome.storage.local.set({ [key]: bucket });

  return updatedNote;
};

/**
 * Deletes a note from storage.
 * @param id - The ID of the note to delete.
 * @returns {Promise<boolean>}
 */
export const deleteNote = async (id: NoteIdentifier): Promise<boolean> => {
  const key = getStorageKeyFromNoteId(id);
  const result = await chrome.storage.local.get(key);
  const bucket: NotesBucket = result[key] || {};

  if (bucket[id]) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete bucket[id];
    await chrome.storage.local.set({ [key]: bucket });
    return true;
  }

  return false;
};

/**
 * Subscribes to changes for notes.
 * @param callback - Function called with the updated record of notes.
 * @param locations - Optional array of locations to watch. If undefined, watches all notes.
 * @returns {Function} Unsubscribe function.
 */
export const subscribeToNotes = (
  callback: (notes: Record<NoteIdentifier, Note>) => void,
  locations?: BucketLocation[],
): (() => void) => {
  const interestedKeys = locations ? new Set(locations.map(resolveKeyFromLocation)) : null;

  const listener = async (
    changes: Record<string, chrome.storage.StorageChange>,
    areaName: string,
  ) => {
    if (areaName !== 'local') return;

    let shouldUpdate = false;
    for (const key of Object.keys(changes)) {
      if (!key.startsWith(STORAGE_PREFIX_DOMAIN)) continue;

      if (interestedKeys) {
        if (interestedKeys.has(key)) {
          shouldUpdate = true;
          break;
        }
      } else {
        shouldUpdate = true;
        break;
      }
    }

    if (shouldUpdate) {
      const notes = await getNotes(locations);
      callback(notes);
    }
  };

  chrome.storage.onChanged.addListener(listener);

  return () => {
    chrome.storage.onChanged.removeListener(listener);
  };
};
