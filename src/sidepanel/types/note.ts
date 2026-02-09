export enum Scope {
  Page = 'page',
  Domain = 'domain',
  Global = 'global',
}

/**
 * Unique identifier for a note.
 */
export type NoteIdentifier = string;

/**
 * Represents a single note.
 */
export interface Note {
  id: NoteIdentifier;
  title: string;
  content: string;
  updatedAt: number;
  url: string;
  icon: string | null;
}
