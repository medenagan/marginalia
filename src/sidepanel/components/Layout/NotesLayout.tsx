import React, { useMemo, useState, useCallback, useDeferredValue } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';

import { NotesHeader } from './NotesHeader';
import { NotesScopeTabs } from './NotesScopeTabs';
import { resolveBucketLocation } from '../../utils/storage';
import { Scope, NoteIdentifier } from '../../types/note';
import { useActiveTabContext } from '../../hooks/useActiveTab';
import { useNotes } from '../../hooks/useNotes';
import { NotesList } from './NotesList';
import { NoteEditor } from '../Editor/NoteEditor';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { getNoteDisplayTitle } from '../../utils/title';
import { normalizeUrl } from '../../utils/urlScope';



/**
 * Sidepanel layout component.
 * Manages scope selection, search, and note list display.
 */
export const NotesLayout: React.FC = () => {
  const { activeTab } = useActiveTabContext();
  const contextUrl = activeTab?.url;

  const [currentScope, setCurrentScope] = useState<Scope>(Scope.Page);
  const [selectedNoteId, setSelectedNoteId] = useState<NoteIdentifier | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<NoteIdentifier | null>(null);
  const [query, setQuery] = useState('');
  const cleanQuery = query.trim().toLowerCase();
  const deferredQuery = useDeferredValue(cleanQuery);
  const isStale = cleanQuery !== deferredQuery;


  const location = currentScope === Scope.Global ? undefined : resolveBucketLocation(contextUrl ?? '');
  const { notes, isLoading, createNote, updateNote, deleteNote } = useNotes(location);


  const handleScopeChange = (event: React.SyntheticEvent, newValue: Scope) => {
    setCurrentScope(newValue);
    setSelectedNoteId(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setQuery('');
  };

  const handleNewNote = useCallback(async () => {
    const newNote = await createNote();
    setSelectedNoteId(newNote.id);
  }, [createNote]);

  const handleDeleteNote = useCallback((id: NoteIdentifier) => {
    setDeletingNoteId(id);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deletingNoteId) {
      deleteNote(deletingNoteId);
      if (selectedNoteId === deletingNoteId) {
        setSelectedNoteId(null);
      }
      setDeletingNoteId(null);
    }
  }, [deletingNoteId, deleteNote, selectedNoteId]);

  const cancelDelete = useCallback(() => {
    setDeletingNoteId(null);
  }, []);

  const filteredNotes = useMemo(() => {
    let result = Object.values(notes);

    // 1. Filter by Scope
    // Note: 'Site' and 'Global' scopes are handled by useNotes hook via location param
    if (currentScope === Scope.Page && contextUrl) {
      const normalizedContextUrl = normalizeUrl(contextUrl);
      result = result.filter((note) => normalizeUrl(note.url) === normalizedContextUrl);
    }

    // 2. Filter by Search Query
    if (deferredQuery) {
      result = result.filter((note) =>
        note.title.toLowerCase().includes(deferredQuery) ||
        note.content.toLowerCase().includes(deferredQuery)
      );
    }

    return result.sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, deferredQuery, currentScope, contextUrl]);

  const selectedNote = selectedNoteId ? notes[selectedNoteId] : null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
      <NotesHeader
        searchQuery={query}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        onNewNote={handleNewNote}
      />

      <NotesScopeTabs
        currentScope={currentScope}
        onScopeChange={handleScopeChange}
      />

      {isStale && <LinearProgress sx={{ width: '100%', position: 'absolute', zIndex: 1,bottom:0 }} />}

      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden', position: 'relative' }}>
        <Box
          sx={{
            width: { xs: selectedNoteId ? 0 : '100%', sm: 280 },
            flexShrink: 0,
            borderRight: '1px solid rgba(0,0,0,0.12)',
            display: { xs: selectedNoteId ? 'none' : 'block', sm: 'block' },
            opacity: isStale ? 0.6 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          <NotesList
            notes={filteredNotes}
            selectedNoteId={selectedNoteId}
            onSelectNote={setSelectedNoteId}
            onDeleteNote={handleDeleteNote}
            currentScope={currentScope}
            isLoading={isLoading && !isStale}
          />
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            display: { xs: !selectedNoteId ? 'none' : 'flex', sm: 'flex' },
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {selectedNote ? (
             <NoteEditor
                key={selectedNote.id}
                note={selectedNote}
                onUpdate={(updates) => updateNote(selectedNote.id, updates)}
                onDelete={() => handleDeleteNote(selectedNote.id)}
             />
          ) : (
             <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary', mt: 5 }}>
                <Typography>Select a note to view</Typography>
             </Box>
          )}
        </Box>
      </Box>

      <Divider />
      <Box sx={{ p: 0.5, px: 2, display: 'flex', justifyContent: 'space-between', bgcolor: '#f0f0f0' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
          SCOPE: {currentScope.toUpperCase()}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {chrome.runtime?.id === 'mock-extension-id' ? 'v0 mock' : ''}
        </Typography>
      </Box>
      <DeleteConfirmDialog
        open={!!deletingNoteId}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Note"
        content={`Are you sure you want to delete the note "${deletingNoteId ? getNoteDisplayTitle(notes[deletingNoteId]) : ''}"? This action cannot be undone.`}
      />
    </Box>
  );
};
