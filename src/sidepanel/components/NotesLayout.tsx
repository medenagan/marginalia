import React from 'react';
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
import { useNotesStore, Scope } from '../state/notesStore';
import { useActiveTabContext } from '../hooks/useActiveTab';
import { NotesList } from './NotesList';
import { NoteEditor } from './NoteEditor';

// Styled Components for Search
/**
 * Search container component.
 */
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

/**
 * Wrapper for the search icon.
 */
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

/**
 * Styled input base for search field.
 */
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
 * Main layout component for the Sidepanel.
 */
export const NotesLayout: React.FC = () => {
  const { activeTabContext } = useActiveTabContext();
  const store = useNotesStore();
  const currentScope = store.getCurrentScope();
  const selectedNoteId = store.getSelectedNoteId();
  const search = store.getSearchQuery();

  const handleScopeChange = (event: React.SyntheticEvent, newValue: Scope) => {
    store.setScope(newValue);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    store.setSearchQuery(e.target.value);
  };

  const handleNewNote = () => {
    store.createNote(currentScope);
  };

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
              value={search}
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
                  {activeTabContext?.title || 'Current'}
                </Typography>
              </Box>
            }
            value="page"
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Site</Typography>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.7, maxWidth: '80px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activeTabContext?.url ? new URL(activeTabContext.url).hostname : 'Domain'}
                </Typography>
              </Box>
            }
            value="site"
          />
          <Tab label="Global" value="global" />
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
          <NotesList />
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            display: { xs: !selectedNoteId ? 'none' : 'flex', sm: 'flex' },
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <NoteEditor key={selectedNoteId || 'empty'} />
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
