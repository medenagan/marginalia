import React from 'react';

import Tabs from '@mui/material/Tabs';
import Paper from '@mui/material/Paper';
import DescriptionIcon from '@mui/icons-material/Description';
import DnsIcon from '@mui/icons-material/Dns';
import PublicIcon from '@mui/icons-material/Public';
import { Scope } from '../../../types/note';
import { useActiveTabContext } from '../../hooks/useActiveTab';
import { TooltipTab } from './TooltipTab';

interface NotesScopeTabsProps {
  currentScope: Scope;
  onScopeChange: (event: React.SyntheticEvent, newValue: Scope) => void;
}

export const NotesScopeTabs: React.FC<NotesScopeTabsProps> = ({
  currentScope,
  onScopeChange,
}) => {
  const { activeTab } = useActiveTabContext();
  return (
    <Paper square elevation={1}>
      <Tabs
        value={currentScope}
        onChange={onScopeChange}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
        aria-label="scope tabs"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <TooltipTab
          tooltip="Show notes for this specific page"
          icon={<DescriptionIcon />}
          iconPosition="start"
          label="This page"
          value={Scope.Page}
        />
        <TooltipTab
          tooltip={`Show notes for ${activeTab?.url ? new URL(activeTab.url).hostname : 'this domain'}`}
          icon={<DnsIcon />}
          iconPosition="start"
          label="This site"
          value={Scope.Domain}
        />
        <TooltipTab
          tooltip="Show all notes from everywhere"
          icon={<PublicIcon />}
          iconPosition="start"
          label="Everywhere"
          value={Scope.Global}
        />
      </Tabs>
    </Paper>
  );
};
