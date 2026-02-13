import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import WarningIcon from '@mui/icons-material/Warning';
import { useTranslation } from '../../hooks/useTranslation';

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  noteTitle: string;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  noteTitle,
}) => {
  const { t } = useTranslation();

  const dialogTitle = t('delete_dialog_title');
  const dialogContent = t('delete_dialog_content', [noteTitle]);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          {dialogTitle}
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {dialogContent}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t('button_cancel')}
        </Button>
        <Button onClick={onConfirm} color="error" autoFocus>
           {t('button_delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
