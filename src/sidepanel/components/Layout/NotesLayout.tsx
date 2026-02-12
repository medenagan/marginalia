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



/**
 * Sidepanel layout component.
 * Manages scope selection, search, and note list display.
 */
export const NotesLayout: React.FC = () => {
  const { activeTab } = useActiveTabContext();

  const [currentScope, setCurrentScope] = useState<Scope>(Scope.Page);
  const [selectedNoteId, setSelectedNoteId] = useState<NoteIdentifier | null>(null);
  const [query, setQuery] = useState('');
  const cleanQuery = query.trim().toLowerCase();
  const deferredQuery = useDeferredValue(cleanQuery);
  const isStale = cleanQuery !== deferredQuery;


  const location = currentScope === Scope.Global ? undefined : resolveBucketLocation(activeTab?.url ?? '');
  const { notes, isLoading, createNote, updateNote, deleteNote } = useNotes(location);


  const handleScopeChange = (event: React.SyntheticEvent, newValue: Scope) => {
    setCurrentScope(newValue);
    setSelectedNoteId(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleNewNote = useCallback(async () => {
    const newNote = await createNote();
    setSelectedNoteId(newNote.id);
  }, [createNote]);

  const handleDeleteNote = useCallback((id: NoteIdentifier) => {
    deleteNote(id);
  }, [deleteNote]);


  const filteredNotes = useMemo(() => {
    const noteList = Object.values(notes);
    return noteList.filter((note) => {
      if (!deferredQuery) return true;
      return (
        note.title.toLowerCase().includes(deferredQuery) ||
        note.content.toLowerCase().includes(deferredQuery)
      );
    }).sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, deferredQuery]);

  const selectedNote = selectedNoteId ? notes[selectedNoteId] : null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
      <NotesHeader
        searchQuery={query}
        onSearchChange={handleSearchChange}
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
            onCreateNote={handleNewNote}
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
                onDelete={() => {
                    deleteNote(selectedNote.id);
                    setSelectedNoteId(null);
                }}
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
    </Box>
  );
};
