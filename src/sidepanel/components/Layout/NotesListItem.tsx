import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { Note, NoteIdentifier } from '../../types/note';
import { getRelativeTime } from '../../utils/time';

interface NotesListItemProps {
  note: Note;
  selected: boolean;
  onSelect: (id: NoteIdentifier) => void;
  onDelete: (id: NoteIdentifier) => void;
}

export const NotesListItem: React.FC<NotesListItemProps> = ({
  note,
  selected,
  onSelect,
  onDelete,
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(note.id);
  };

  return (
    <ListItemButton
      selected={selected}
      onClick={() => onSelect(note.id)}
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
          onClick={handleDelete}
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
  );
};
