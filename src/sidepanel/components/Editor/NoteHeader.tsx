import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import PublicIcon from '@mui/icons-material/Public';
import PrintIcon from '@mui/icons-material/Print';
import { Note } from '../../types/note';
import { MessageType } from '../../../types/messages';
import { getNoteDisplayTitle } from '../../utils/title';
import { AlternateEmail } from '@mui/icons-material';
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

  const handleEmail = () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = note.content;
    const bodyText = tempDiv.textContent || tempDiv.innerText || '';

    // Construct mailto link
    // Use encodeURIComponent to ensure special characters are handled correctly
    const subject = encodeURIComponent(getNoteDisplayTitle(note));
    const body = encodeURIComponent(`${bodyText}\n\nLink: ${note.url}`);

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${getNoteDisplayTitle(note)}</title>
            <style>
              body { font-family: sans-serif; padding: 20px; }
              h1 { margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <h1>${getNoteDisplayTitle(note)}</h1>
            <div>${note.content}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

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
        <Tooltip title="Send via email">
          <IconButton size="small" onClick={handleEmail}>
            <AlternateEmail fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Print note">
          <IconButton size="small" onClick={handlePrint}>
            <PrintIcon fontSize="small" />
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
