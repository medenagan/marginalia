import React from 'react';
import Tab, { TabProps } from '@mui/material/Tab';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

export type TooltipTabProps = TabProps & {
  tooltip: string;
  fullWidth?: boolean;
};

// Wrapper component to handle Tooltip + Tab integration
// This is needed because Tabs clones children and injects props, which Tooltip blocks
// We extend TabProps with fullWidth which is injected by Tabs but not in TabProps by default
export const TooltipTab: React.FC<TooltipTabProps> = (props) => {
  const { tooltip, fullWidth, ...other } = props;
  return (
    <Tooltip title={tooltip} arrow>
      {/* Box wrapper ensures Tooltip can attach ref and events correctly */}
      <Box
        component="span"
        sx={{
          // Ensure the wrapper takes full width if fullWidth prop is passed
          // This fixes the issue where tabs are aligned to the left because the wrapper doesn't grow
          width: fullWidth ? '100%' : 'auto',
          maxWidth: fullWidth ? 'none' : undefined,
          flexGrow: fullWidth ? 1 : undefined,
          flexBasis: fullWidth ? 0 : undefined,
        }}
      >
        <Tab
          {...other}
          // Ensure Tab takes full width of the Box
          sx={{ width: '100%', maxWidth: 'none', ...other.sx }}
        />
      </Box>
    </Tooltip>
  );
};
