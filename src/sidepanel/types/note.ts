import { BucketLocation } from './database';

export enum Scope {
  Page = 'page',
  Domain = 'domain',
  Global = 'global',
}

type RandomUUID = ReturnType<typeof crypto.randomUUID>;

/**
 * Unique identifier for a note.
 */
export type NoteIdentifier = `${BucketLocation}:${RandomUUID}` & {
  __brand: 'NoteIdentifier';
};

export const getNoteIdentifier = (location: BucketLocation): NoteIdentifier => {
  return `${location}:${crypto.randomUUID()}` as NoteIdentifier;
};

/**
 * Represents a single note.
 */
export interface Note {
  id: NoteIdentifier;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  url: string;
  icon: string | null;
}
