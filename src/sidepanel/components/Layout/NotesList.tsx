import React from 'react';
import List from '@mui/material/List';
import { NotesListItem } from './NotesListItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';

import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import DownloadIcon from '@mui/icons-material/Download';
import { NoteIdentifier, Scope, Note } from '../../../types/note';
import { exportToCsv } from '../../../utils/export';
import { useTranslation } from '../../hooks/useTranslation';

interface NotesListProps {
  notes: Note[];
  selectedNoteId: NoteIdentifier | null;
  onSelectNote: (id: NoteIdentifier) => void;
  onDeleteNote: (id: NoteIdentifier) => void;
  currentScope: Scope;
  isLoading?: boolean;
}

const NotesListSkeleton = () => (
  <>
    {Array.from(new Array(6)).map((_, index) => (
      <ListItem key={index} divider>
        <ListItemAvatar>
          <Skeleton variant="circular" width={40} height={40} />
        </ListItemAvatar>
        <ListItemText
          primary={<Skeleton variant="text" width="60%" />}
          secondary={<Skeleton variant="text" width="40%" />}
        />
      </ListItem>
    ))}
  </>
);

/**
 * Component that displays a scrollable list of notes for the current scope.
 */
export const NotesList: React.FC<NotesListProps> = ({
  notes,
  selectedNoteId,
  onSelectNote,
  onDeleteNote,
  currentScope,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  const handleExport = () => {
    exportToCsv(notes);
  };

  const getScopeLabel = (scope: Scope): string => {
    switch (scope) {
      case Scope.Page:
        return t('scope_page');
      case Scope.Domain:
        return t('scope_site');
      case Scope.Global:
        return t('scope_global');
      default:
        return '';
    }
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
          label={getScopeLabel(currentScope)}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 500 }}
        />
        <Typography variant="caption" color="text.secondary">
          {t('notes_count', notes.length.toString())}
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
        {isLoading ? (
          <NotesListSkeleton />
        ) : notes.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('no_notes')}
            </Typography>
          </Box>
        ) : (
          notes.map((note) => (
            <NotesListItem
              key={note.id}
              id={note.id}
              title={note.title}
              updatedAt={note.updatedAt}
              url={note.url}
              icon={note.icon}
              selected={selectedNoteId === note.id}
              onSelect={onSelectNote}
              onDelete={onDeleteNote}
            />
          ))
        )}
      </List>

      {/* Bottom Add Button */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
        <Tooltip title={notes.length === 0 ? t('tooltip_no_notes_export') : t('tooltip_export', notes.length.toString())}>
          <span>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              disabled={notes.length === 0}
            >
              {t('button_export')}
            </Button>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};
