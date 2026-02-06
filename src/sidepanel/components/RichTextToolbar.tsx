import React from 'react';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';

/**
 * Styled ToggleButtonGroup for the rich text toolbar.
 */
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButton-root': {
    border: 'none',
    borderRadius: theme.shape.borderRadius,
    padding: 6,
    color: theme.palette.text.secondary,
    '&.Mui-selected': {
      backgroundColor: theme.palette.action.selected,
      color: theme.palette.primary.main,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

/**
 * Toolbar component offering rich text formatting options.
 * Executes document commands for editing.
 */
export const RichTextToolbar: React.FC = () => {


  const exec = (command: string, value = '') => {
    document.execCommand(command, false, value);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent losing focus from editor
  };

  return (
    <StyledToggleButtonGroup
      size="small"
      aria-label="text formatting"
      exclusive={false}
    >
      <ToggleButton
        value="bold"
        aria-label="bold"
        onMouseDown={handleMouseDown}
        onClick={() => exec('bold')}
      >
        <FormatBoldIcon fontSize="small" />
      </ToggleButton>
      <ToggleButton
        value="italic"
        aria-label="italic"
        onMouseDown={handleMouseDown}
        onClick={() => exec('italic')}
      >
        <FormatItalicIcon fontSize="small" />
      </ToggleButton>
      <ToggleButton
        value="underlined"
        aria-label="underlined"
        onMouseDown={handleMouseDown}
        onClick={() => exec('underline')}
      >
        <FormatUnderlinedIcon fontSize="small" />
      </ToggleButton>
      <ToggleButton
        value="bulleted-list"
        aria-label="bulleted list"
        onMouseDown={handleMouseDown}
        onClick={() => exec('insertUnorderedList')}
      >
        <FormatListBulletedIcon fontSize="small" />
      </ToggleButton>
      <ToggleButton
        value="numbered-list"
        aria-label="numbered list"
        onMouseDown={handleMouseDown}
        onClick={() => exec('insertOrderedList')}
      >
        <FormatListNumberedIcon fontSize="small" />
      </ToggleButton>
    </StyledToggleButtonGroup>
  );
};
