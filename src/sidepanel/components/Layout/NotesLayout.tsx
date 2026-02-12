import React, { useMemo, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

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


  const location = currentScope === Scope.Global ? undefined : resolveBucketLocation(activeTab?.url ?? '');

  const { notes, createNote, updateNote, deleteNote } = useNotes(location);

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

  const cleanQuery = query.trim().toLowerCase();

  const filteredNotes = useMemo(() => {
    const noteList = Object.values(notes);
    return noteList.filter((note) => {
      if (!cleanQuery) return true;
      return (
        note.title.toLowerCase().includes(cleanQuery) ||
        note.content.toLowerCase().includes(cleanQuery)
      );
    }).sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, cleanQuery]);

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

      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Box
          sx={{
            width: { xs: selectedNoteId ? 0 : '100%', sm: 280 },
            flexShrink: 0,
            borderRight: '1px solid rgba(0,0,0,0.12)',
            display: { xs: selectedNoteId ? 'none' : 'block', sm: 'block' }
          }}
        >
          <NotesList
            notes={filteredNotes}
            selectedNoteId={selectedNoteId}
            onSelectNote={setSelectedNoteId}
            onDeleteNote={handleDeleteNote}
            onCreateNote={handleNewNote}
            currentScope={currentScope}
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
