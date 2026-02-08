import React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { getRelativeTime } from '../utils/time';
import { NoteIdentifier, Scope, Note } from '../types/note';

const scopeLabels: Record<Scope, string> = {
  [Scope.Page]: 'This page',
  [Scope.Domain]: 'This site',
  [Scope.Global]: 'All sites',
};

interface NotesListProps {
  notes: Note[];
  selectedNoteId: NoteIdentifier | null;
  onSelectNote: (id: NoteIdentifier) => void;
  onDeleteNote: (id: NoteIdentifier) => void;
  onCreateNote: () => void;
  currentScope: Scope;
}

/**
 * Component that displays a scrollable list of notes for the current scope.
 */
export const NotesList: React.FC<NotesListProps> = ({
  notes,
  selectedNoteId,
  onSelectNote,
  onDeleteNote,
  onCreateNote,
  currentScope
}) => {
  const handleDelete = (e: React.MouseEvent, id: NoteIdentifier) => {
    e.stopPropagation();
    onDeleteNote(id);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header Row */}
      <Box
        sx={{
          p: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <Chip
          label={scopeLabels[currentScope]}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 500 }}
        />
        <Typography variant="caption" color="text.secondary">
          {notes.length} notes
        </Typography>
      </Box>

      {/* List */}
      <List
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 0
        }}
        disablePadding
      >
        {notes.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No notes found.
            </Typography>
          </Box>
        ) : (
          notes.map((note) => (
            <ListItemButton
              key={note.id}
              selected={selectedNoteId === note.id}
              onClick={() => onSelectNote(note.id)}
              divider
              sx={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                position: 'relative',
                pr: 5, // Make room for delete button
              }}
            >
              <ListItemText
                primary={note.title || 'Untitled'}
                primaryTypographyProps={{
                  variant: 'body2',
                  fontWeight: 600,
                  noWrap: true,
                }}
                secondary={getRelativeTime(note.updatedAt)}
                secondaryTypographyProps={{
                  variant: 'caption',
                  noWrap: true,
                }}
                sx={{ width: '100%', m: 0 }}
              />
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  onClick={(e) => handleDelete(e, note.id)}
                  sx={{
                    position: 'absolute',
                    right: 4,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    opacity: 0.6,
                    '&:hover': { opacity: 1, color: 'error.main' },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </ListItemButton>
          ))
        )}
      </List>

      {/* Bottom Add Button */}
      <Box sx={{ p: 1, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={onCreateNote}
        >
          Add note
        </Button>
      </Box>
    </Box>
  );
};
