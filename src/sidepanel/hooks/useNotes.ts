import { useState, useEffect, useCallback } from 'react';
import { Note, NoteIdentifier } from '../types/note';
import { BucketLocation } from '../types/database';
import * as storage from '../utils/storage';
import DOMPurify from 'dompurify';
import { useActiveTabContext } from './useActiveTab';

export interface UseNotesResult {
  notes: Note[];
  isLoading: boolean;
  createNote: () => Promise<Note>;
  updateNote: (id: NoteIdentifier, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: NoteIdentifier) => Promise<void>;
}

/**
 * Manages notes for a specific storage location.
 * Syncs state with storage changes.
 * @param location - The target storage location.
 * @returns {UseNotesResult} Note management methods and state.
 */
export const useNotes = (location: BucketLocation): UseNotesResult => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { activeTab } = useActiveTabContext();

  useEffect(() => {
    let isMounted = true;

    storage.getBucket(location).then((bucket) => {
      if (isMounted) {
        setNotes(Object.values(bucket));
        setIsLoading(false);
      }
    });

    const unsubscribe = storage.subscribeToBucket(location, (updatedNotes) => {
      if (isMounted) {
        setNotes(updatedNotes);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [location]);

  const createNote = useCallback(async () => {
    const noteData = {
      title: '',
      content: DOMPurify.sanitize('<p></p>'),
      url: activeTab?.url ?? '',
      icon: activeTab?.favIconUrl ?? null,
    };
    return await storage.createNote(noteData, location);
  }, [location, activeTab]);

  const updateNote = useCallback(
    async (id: NoteIdentifier, updates: Partial<Note>) => {
      const currentNote = notes.find((n) => n.id === id);
      if (!currentNote) return;

      const updatedNote: Note = {
        ...currentNote,
        ...updates,
        content: updates.content ? DOMPurify.sanitize(updates.content) : currentNote.content,
        updatedAt: Date.now(),
      };

      await storage.updateNote(updatedNote, location);
    },
    [notes, location],
  );

  const deleteNote = useCallback(
    async (id: NoteIdentifier) => {
      await storage.deleteNote(id, location);
    },
    [location],
  );

  return {
    notes,
    isLoading,
    createNote,
    updateNote,
    deleteNote,
  };
};
