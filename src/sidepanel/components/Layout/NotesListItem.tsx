import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import PublicIcon from '@mui/icons-material/Public';
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Tooltip from '@mui/material/Tooltip';
import { Note, NoteIdentifier } from '../../types/note';
import { MessageType } from '../../../types/messages';
import { getRelativeTime } from '../../utils/time';
import { getNoteDisplayTitle } from '../../utils/title';

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

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (note.url) {
      chrome.runtime.sendMessage({ type: MessageType.OPEN_URL, url: note.url });
    }
  };

  return (
    <ListItemButton
      selected={selected}
      onClick={() => onSelect(note.id)}
      divider
      sx={{
        alignItems: 'center',
        position: 'relative',
        pr: 5, // Make room for delete button
      }}
    >
      <ListItemAvatar>
        <Tooltip title={`Visit ${note.url || '#'}`}>
          <IconButton onClick={handleIconClick} size="small" sx={{ mr: 1 }}>
            <Avatar
              src={note.icon || undefined}
              sx={{
                width: 24,
                height: 24,
                bgcolor: note.icon ? 'transparent' : 'primary.main',
              }}
              variant="rounded"
            >
              <PublicIcon fontSize="small" />
            </Avatar>
          </IconButton>
        </Tooltip>
      </ListItemAvatar>
      <ListItemText
        primary={getNoteDisplayTitle(note)}
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
