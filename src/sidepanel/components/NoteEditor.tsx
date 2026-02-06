import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useNotesStore } from '../state/notesStore';
import { RichTextToolbar } from './RichTextToolbar';
import { getRelativeTime } from '../utils/time';

/**
 * Component for editing a selected note.
 * Handles title and HTML content updates, as well as deletion.
 */
export const NoteEditor: React.FC = () => {
  const store = useNotesStore();
  const selectedNoteId = store.getSelectedNoteId();
  const note = store.getNote(selectedNoteId || '');
  const contentRef = useRef<HTMLDivElement>(null);
  const [localTitle, setLocalTitle] = useState(note?.title || '');

  // Initialize HTML content on mount or when note changes
  useEffect(() => {
    if (note && contentRef.current) {
      contentRef.current.innerHTML = note.html;
    }
  }, [note?.id]); // Re-run when note ID changes

  // Sync local title state when note changes via other means (or switch)
  useEffect(() => {
      if (note) {
          setLocalTitle(note.title);
      }
  }, [note?.id, note?.title]);


  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setLocalTitle(newTitle);
    if (note) {
      store.updateNote(note.id, { title: newTitle });
    }
  };

  const handleContentInput = () => {
    if (contentRef.current && note) {
      const html = contentRef.current.innerHTML;
      store.updateNote(note.id, { html });
    }
  };

  const handleDelete = () => {
    if (note) {
      store.deleteNote(note.id);
    }
  };

  const handleCopy = () => {
    if (note && contentRef.current) {
      const text = `${note.title}\n\n${contentRef.current.innerText}`;
      navigator.clipboard.writeText(text);
    }
  };

  if (!note) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          color: 'text.secondary',
          textAlign: 'center',
        }}
      >
        <Typography variant="body1" gutterBottom>
          No note selected.
        </Typography>
        <Button
           variant="text"
           startIcon={<AddIcon />}
           onClick={() => store.createNote(store.getCurrentScope())}
        >
          Create one
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2, overflow: 'hidden' }}>
      {/* Header: Title + Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
        <TextField
          value={localTitle}
          onChange={handleTitleChange}
          placeholder="Untitled note"
          variant="standard"
          fullWidth
          InputProps={{
            style: { fontSize: '1.2rem', fontWeight: 600 },
            disableUnderline: true,
          }}
        />
        <Box sx={{ display: 'flex', ml: 1 }}>
          <Tooltip title="Copy to clipboard">
            <IconButton size="small" onClick={handleCopy}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete note">
            <IconButton size="small" onClick={handleDelete} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Toolbar */}
      <Box sx={{ mb: 1 }}>
        <RichTextToolbar />
      </Box>

      {/* Editor Content */}
      <Paper
        variant="outlined"
        sx={{
          flexGrow: 1,
          p: 1.5,
          overflowY: 'auto',
          backgroundColor: '#fafafa',
          cursor: 'text',
          '&:focus-within': {
            borderColor: 'primary.main',
            backgroundColor: '#fff',
          },
        }}
        onClick={() => contentRef.current?.focus()}
      >
        <div
          ref={contentRef}
          contentEditable
          onInput={handleContentInput}
          style={{
            outline: 'none',
            minHeight: '100%',
            fontFamily: 'sans-serif',
            fontSize: '0.95rem',
            lineHeight: 1.6,
          }}
          suppressContentEditableWarning
        />
      </Paper>

      {/* Footer Status */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 1,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Saved locally • {getRelativeTime(note.updatedAt)}
        </Typography>
      </Box>
    </Box>
  );
};
