import DOMPurify from 'dompurify';

export type Scope = 'page' | 'site' | 'global';

export interface Note {
  id: string;
  scope: Scope;
  title: string;
  html: string;
  updatedAt: number;
}

type Listener = () => void;

class NotesStore {
  private notes: Note[] = [];
  private listeners = new Set<Listener>();
  private selectedNoteId: string | null = null;
  private currentScope: Scope = 'page';
  private searchQuery = '';

  constructor() {
    // Seed with some initial data
    this.createNote('page', {
      title: 'Welcome to Marginalia',
      html: '<p>This is a note for the current page.</p>',
      updatedAt: Date.now() - 1000 * 60 * 5, // 5 mins ago
    });
    this.createNote('site', {
      title: 'Site-wide Reminder',
      html: '<p>Remember to check the footer.</p>',
      updatedAt: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    });

    // Reset selection after seeding
    this.selectedNoteId = null;
  }

  // --- State Accessors ---

  getNotes(scope: Scope, query: string): Note[] {
    let filtered = this.notes.filter((n) => n.scope === scope);
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (n) => n.title.toLowerCase().includes(q) || n.html.toLowerCase().includes(q), // Simple HTML search for MVP
      );
    }
    // Sort by newest first
    // Sort by newest first and sanitize on retrieval
    return filtered
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .map((note) => ({
        ...note,
        html: DOMPurify.sanitize(note.html),
      }));
  }

  getNote(id: string): Note | undefined {
    const note = this.notes.find((n) => n.id === id);
    return note ? { ...note, html: DOMPurify.sanitize(note.html) } : undefined;
  }

  getSelectedNoteId(): string | null {
    return this.selectedNoteId;
  }

  getCurrentScope(): Scope {
    return this.currentScope;
  }

  getSearchQuery(): string {
    return this.searchQuery;
  }

  // --- Actions ---

  setScope(scope: Scope) {
    this.currentScope = scope;
    this.selectedNoteId = null; // Reset selection on scope switch
    this.notify();
  }

  setSearchQuery(query: string) {
    this.searchQuery = query;
    this.notify();
  }

  selectNote(id: string | null) {
    this.selectedNoteId = id;
    this.notify();
  }

  createNote(scope: Scope, initialData?: Partial<Omit<Note, 'id' | 'scope'>>): Note {
    const newNote: Note = {
      id: crypto.randomUUID(),
      scope,
      title: initialData?.title || 'Untitled note',
      html: DOMPurify.sanitize(initialData?.html || '<p></p>'),
      updatedAt: initialData?.updatedAt || Date.now(),
    };
    this.notes.push(newNote);
    this.selectedNoteId = newNote.id;
    this.notify();
    return newNote;
  }

  updateNote(id: string, patch: Partial<Omit<Note, 'id' | 'scope'>>) {
    const index = this.notes.findIndex((n) => n.id === id);
    if (index !== -1) {
      const sanitizedPatch = { ...patch };
      if (sanitizedPatch.html) {
        sanitizedPatch.html = DOMPurify.sanitize(sanitizedPatch.html);
      }
      this.notes[index] = {
        ...this.notes[index],
        ...sanitizedPatch,
        updatedAt: Date.now(),
      };
      this.notify();
    }
  }

  deleteNote(id: string) {
    const index = this.notes.findIndex((n) => n.id === id);
    if (index !== -1) {
      this.notes.splice(index, 1);
      if (this.selectedNoteId === id) {
        this.selectedNoteId = null;
      }
      this.notify();
    }
  }

  // --- Subscription ---

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

export const notesStore = new NotesStore();

import { useState, useEffect } from 'react';

export const useNotesStore = () => {
  const [, setVersion] = useState(0);
  useEffect(() => {
    return notesStore.subscribe(() => setVersion((v) => v + 1));
  }, []);
  return notesStore;
};
