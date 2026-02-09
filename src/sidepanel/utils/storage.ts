import { BucketLocation, NotesBucket } from '../types/database';
import { Note, NoteIdentifier } from '../types/note';

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

/**
 * Retrieves notes for a specific location from storage.
 * @param location - The location to fetch notes for.
 * @returns {Promise<NotesBucket>} A promise resolving to the notes bucket.
 */
export const getBucket = async (location: BucketLocation): Promise<NotesBucket> => {
  const key = resolveKeyFromLocation(location);
  const result = await chrome.storage.local.get(key);
  return result[key] || {};
};

/**
 * Creates a new note in storage.
 * @param noteData - The initial data for the note.
 * @param location - The location to store the note in.
 * @returns {Promise<Note>} A promise resolving to the created note.
 */
export const createNote = async (
  noteData: Omit<Note, 'id' | 'updatedAt' | 'createdAt'>,
  location: BucketLocation,
): Promise<Note> => {
  const createdAt = Date.now();
  const newNote: Note = {
    ...noteData,
    id: crypto.randomUUID(),
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
 * @param note - The note with updated fields.
 * @param location - The location of the note.
 * @returns {Promise<Note>} A promise resolving to the updated note.
 */
export const updateNote = async (note: Note, location: BucketLocation): Promise<Note> => {
  const key = resolveKeyFromLocation(location);
  const result = await chrome.storage.local.get(key);
  const bucket: NotesBucket = result[key] || {};

  bucket[note.id] = note;
  await chrome.storage.local.set({ [key]: bucket });

  return note;
};

/**
 * Deletes a note from storage.
 * @param id - The ID of the note to delete.
 * @param location - The location of the note.
 * @returns {Promise<void>}
 */
export const deleteNote = async (id: NoteIdentifier, location: BucketLocation): Promise<void> => {
  const key = resolveKeyFromLocation(location);
  const result = await chrome.storage.local.get(key);
  const bucket: NotesBucket = result[key] || {};

  if (bucket[id]) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete bucket[id];
    await chrome.storage.local.set({ [key]: bucket });
  }
};

/**
 * Subscribes to changes for a specific bucket.
 * @param location - The location to watch.
 * @param callback - Function called with the updated list of notes.
 * @returns {Function} Unsubscribe function.
 */
export const subscribeToBucket = (
  location: BucketLocation,
  callback: (notes: Note[]) => void,
): (() => void) => {
  const key = resolveKeyFromLocation(location);

  const listener = (changes: Record<string, chrome.storage.StorageChange>, areaName: string) => {
    if (areaName === 'local' && changes[key]) {
      const newBucket: NotesBucket = changes[key].newValue || {};
      callback(Object.values(newBucket));
    }
  };

  chrome.storage.onChanged.addListener(listener);

  return () => {
    chrome.storage.onChanged.removeListener(listener);
  };
};
