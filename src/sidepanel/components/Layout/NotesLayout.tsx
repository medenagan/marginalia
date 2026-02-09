import React, { useMemo, useState } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');


  const location = useMemo(() => resolveBucketLocation(currentScope === Scope.Global ? '*' : activeTab?.url ?? ''), [currentScope, activeTab?.url]);

  const { notes, createNote, updateNote, deleteNote } = useNotes(location);

  const handleScopeChange = (event: React.SyntheticEvent, newValue: Scope) => {
    setCurrentScope(newValue);
    setSelectedNoteId(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleNewNote = async () => {
    const newNote = await createNote();
    setSelectedNoteId(newNote.id);
  };

  const filteredNotes = useMemo(() => notes.filter((n) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q)
    );
  }).sort((a, b) => b.updatedAt - a.updatedAt), [notes, searchQuery]);

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
      <NotesHeader
        searchQuery={searchQuery}
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
            onDeleteNote={(id) => deleteNote(id)}
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
