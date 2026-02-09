import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface ScopeTabLabelProps {
  label: string;
  subLabel: string;
}

export const ScopeTabLabel: React.FC<ScopeTabLabelProps> = ({ label, subLabel }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
        {label}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          fontSize: '0.7rem',
          opacity: 0.7,
          maxWidth: '80px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {subLabel}
      </Typography>
    </Box>
  );
};
