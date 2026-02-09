import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';

interface NoteHeaderProps {
  title: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCopy: () => void;
  onDelete: () => void;
}

export const NoteHeader: React.FC<NoteHeaderProps> = ({
  title,
  onTitleChange,
  onCopy,
  onDelete,
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
      <TextField
        value={title}
        onChange={onTitleChange}
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
