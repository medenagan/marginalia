import { createTheme } from '@mui/material/styles';

/**
 * Custom Material UI theme configuration for the extension.
 * Defines palette, typography, and component overrides.
 */
export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Default MUI blue
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#333333',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontSize: 13, // Slightly smaller for dense UI
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          minHeight: 48,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          paddingTop: 8,
          paddingBottom: 8,
          '&.Mui-selected': {
            backgroundColor: 'rgba(25, 118, 210, 0.12)',
          },
        },
      },
    },
  },
});
