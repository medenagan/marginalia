import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import Tooltip from '@mui/material/Tooltip';
import { NoteHeader } from './NoteHeader';
import { RichTextToolbar } from './RichTextToolbar';
import { getRelativeTime } from '../../utils/time';
import { Note } from '../../types/note';

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
  const [previousNoteId, setPreviousNoteId] = useState<string | null>(null);

  useEffect(() => {
    if (previousNoteId !== note.id) {
      setPreviousNoteId(note.id);
      if (contentRef.current) {
        contentRef.current.innerHTML = note.content;
      }
    }
  }, [previousNoteId, note.id]);

  const handleTitleChange = (title: string) => {
    onUpdate({ title });
  };

  const handleContentInput = () => {
    if (contentRef.current) {
      const content = contentRef.current.innerHTML;
      onUpdate({ content });
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
      {/* Header: Title + Actions */}
      <NoteHeader
        note={note}
        onTitleChange={handleTitleChange}
        onCopy={handleCopy}
        onDelete={onDelete}
      />

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
          Saved locally •{' '}
          <Tooltip title={`Last modified: ${new Date(note.updatedAt).toLocaleString('locale', { dateStyle: 'medium', timeStyle: 'short' })}`}>
            <span>{getRelativeTime(note.updatedAt)}</span>
          </Tooltip>
        </Typography>
      </Box>
    </Box>
  );
};
