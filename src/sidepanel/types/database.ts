import { Note, NoteIdentifier } from './note';

/**
 * Represents a location for storing notes.
 * @property domain - The domain name if applicable.
 * @property hasHostname - Whether the location is tied to a specific hostname.
 */
export type BucketLocation =
  | { domain: string; hasHostname: true }
  | { domain: null; hasHostname: false };

/**
 * Dictionary of notes keyed by their unique ID.
 * Used for efficient key-value storage within a bucket (domain or global).
 */
/* eslint-disable-next-line
  @typescript-eslint/consistent-type-definitions,
  @typescript-eslint/consistent-indexed-object-style
*/
export type NotesBucket = {
  [id: NoteIdentifier]: Note;
};
