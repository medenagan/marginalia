import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import PublicIcon from '@mui/icons-material/Public';
import { Note } from '../../types/note';
import { MessageType } from '../../../types/messages';
import { getNoteDisplayTitle } from '../../utils/title';
interface NoteHeaderProps {
  note: Note;
  onTitleChange: (newTitle: string) => void;
  onCopy: () => void;
  onDelete: () => void;
}

export const NoteHeader: React.FC<NoteHeaderProps> = ({
  note,
  onTitleChange,
  onCopy,
  onDelete,
}) => {
  const handleIconClick = () => {
    if (note.url) {
      chrome.runtime.sendMessage({ type: MessageType.OPEN_URL, url: note.url });
    }
  };

  const [localTitle, setLocalTitle] = useState(note.title);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setLocalTitle(newTitle);
    onTitleChange(newTitle);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalTitle(note.title);
  }, [note.title]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
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
      <TextField
        value={localTitle}
        onChange={handleTitleChange}
        placeholder={getNoteDisplayTitle(note)}
        variant="standard"
        fullWidth
        InputProps={{
          style: { fontSize: '1.2rem', fontWeight: 600 },
          disableUnderline: true,
        }}
      />
      <Box sx={{ display: 'flex', ml: 1 }}>
        <Tooltip title="Copy to clipboard">
          <IconButton size="small" onClick={onCopy}>
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
  );
};
