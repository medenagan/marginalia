import { useState, useEffect, useCallback } from 'react';
import { Note, NoteIdentifier } from '../types/note';
import { BucketLocation } from '../types/database';
import * as storage from '../utils/storage';
import { useActiveTabContext } from './useActiveTab';

export interface UseNotesResult {
  notes: Note[];
  isLoading: boolean;
  createNote: () => Promise<Note>;
  updateNote: (id: NoteIdentifier, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: NoteIdentifier) => Promise<void>;
}

/**
 * Manages notes, optionally restricted to a specific domain.
 * Syncs state with storage changes.
 * @param limitedDomain - Optional domain to restrict notes to. If undefined, fetches all notes.
 * @returns {UseNotesResult} Note management methods and state.
 */
export const useNotes = (limitedDomain?: BucketLocation): UseNotesResult => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { activeTab } = useActiveTabContext();

  const url = activeTab?.url ?? '';
  const icon = activeTab?.favIconUrl ?? null;

  useEffect(() => {
    let isMounted = true;
    const locations = limitedDomain ? [limitedDomain] : undefined;

    storage.getNotes(locations).then((fetchedNotes) => {
      if (isMounted) {
        setNotes(fetchedNotes);
        setIsLoading(false);
      }
    });

    const unsubscribe = storage.subscribeToNotes((updatedNotes) => {
      if (isMounted) {
        setNotes(updatedNotes);
      }
    }, locations);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [limitedDomain]);

  const createNote = useCallback(async () => {
    const noteData = {
      title: '',
      content: '<p></p>',
      url,
      icon,
    };
    // Always use the current tab's URL to determine the bucket location
    // even if we are viewing "All Notes"
    const note = await storage.createNote(noteData);
    setNotes((prevNotes) => [...prevNotes, note]);
    return note;
  }, [url, icon]);

  const updateNote = async (id: NoteIdentifier, updates: Partial<Note>) => {
    const updatedNote = await storage.updateNote(id, updates);
    setNotes((prevNotes) => prevNotes.map((n) => (n.id === id ? updatedNote : n)));
  };

  const deleteNote = async (id: NoteIdentifier) => {
    const deleted = await storage.deleteNote(id);
    if (deleted) {
      setNotes((prevNotes) => prevNotes.filter((n) => n.id !== id));
    }
  };

  return {
    notes,
    isLoading,
    createNote,
    updateNote,
    deleteNote,
  };
};
