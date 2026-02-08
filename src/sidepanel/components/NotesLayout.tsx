import React, { useState } from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description'; // Placeholder icon
import { styled, alpha } from '@mui/material/styles';
import { Scope, NoteIdentifier } from '../types/note';
import { useActiveTabContext } from '../hooks/useActiveTab';
import { useNotes } from '../hooks/useNotes';
import { NotesList } from './NotesList';
import { NoteEditor } from './NoteEditor';
import { resolveBucketLocation } from '../utils/storage';

// Styled Components for Search (unchanged)
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(1),
  marginLeft: theme.spacing(1),
  flexGrow: 1,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

/**
 * Sidepanel layout component.
 * Manages scope selection, search, and note list display.
 */
export const NotesLayout: React.FC = () => {
  const { activeTab } = useActiveTabContext();

  const [currentScope, setCurrentScope] = useState<Scope>(Scope.Page);
  const [selectedNoteId, setSelectedNoteId] = useState<NoteIdentifier | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const location = resolveBucketLocation(currentScope === Scope.Global ? '*' : activeTab?.url ?? '');

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

  const filteredNotes = notes.filter((n) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.html.toLowerCase().includes(q)
    );
  }).sort((a, b) => b.updatedAt - a.updatedAt);

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar variant="dense">
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 1 }}>
             <DescriptionIcon fontSize="small" />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div" sx={{ display: { xs: 'none', sm: 'block' }, mr: 1, fontSize: '1rem' }}>
            Marginalia
          </Typography>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search..."
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Search>

          <Button
            color="inherit"
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleNewNote}
            sx={{ borderColor: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', minWidth: 'auto' }}
          >
            New
          </Button>
        </Toolbar>
      </AppBar>

      <Paper square elevation={1}>
        <Tabs
          value={currentScope}
          onChange={handleScopeChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="scope tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Page</Typography>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.7, maxWidth: '80px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activeTab?.title || 'Current'}
                </Typography>
              </Box>
            }
            value={Scope.Page}
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Site</Typography>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.7, maxWidth: '80px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activeTab?.url ? new URL(activeTab.url).hostname : 'Domain'}
                </Typography>
              </Box>
            }
            value={Scope.Domain}
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Global</Typography>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.7, maxWidth: '80px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  All Sites
                </Typography>
              </Box>
            }
            value={Scope.Global}
          />
        </Tabs>
      </Paper>

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
