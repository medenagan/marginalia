import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { RichTextToolbar } from './RichTextToolbar';
import { getRelativeTime } from '../utils/time';
import { Note } from '../types/note';

interface NoteEditorProps {
  note: Note;
  onUpdate: (updates: Partial<Note>) => void;
  onDelete: () => void;
}

/**
 * Editor component for a single note.
 * Handles content and title updates.
 */
export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onUpdate,
  onDelete,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [localTitle, setLocalTitle] = useState(note?.title || '');
  const [previousNoteId, setPreviousNoteId] = useState(note.id);

  const hasNoteChanged = note.id !== previousNoteId;

  useEffect(() => {
    if (hasNoteChanged && contentRef.current) {
      contentRef.current.innerHTML = note.html;
    }
  }, [hasNoteChanged, note.html]);

  // Sync local title
  if (hasNoteChanged) {
     setPreviousNoteId(note.id);
     setLocalTitle(note.title);
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setLocalTitle(newTitle);
    onUpdate({ title: newTitle });
  };

  const handleContentInput = () => {
    if (contentRef.current) {
      const html = contentRef.current.innerHTML;
      onUpdate({ html });
    }
  };

  const handleCopy = () => {
    if (contentRef.current) {
      const text = `${note.title}\n\n${contentRef.current.innerText}`;
      navigator.clipboard.writeText(text);
    }
  };

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
            <IconButton size="small" onClick={onDelete} color="error">
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
