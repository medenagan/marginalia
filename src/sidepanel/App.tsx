import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import { NotesLayout } from './components/Layout/NotesLayout';

/**
 * Root component of the Sidepanel application.
 * Sets up the theme and global CSS baseline.
 */
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotesLayout />
    </ThemeProvider>
  );
};

export default App;
