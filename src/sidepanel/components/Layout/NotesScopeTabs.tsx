import React from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import { Scope } from '../../types/note';
import { ScopeTabLabel } from './ScopeTabLabel';

interface NotesScopeTabsProps {
  currentScope: Scope;
  onScopeChange: (event: React.SyntheticEvent, newValue: Scope) => void;
  activeTab: chrome.tabs.Tab | null;
}

export const NotesScopeTabs: React.FC<NotesScopeTabsProps> = ({
  currentScope,
  onScopeChange,
  activeTab,
}) => {
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
        <Tab
          label={<ScopeTabLabel label="Page" subLabel={activeTab?.title || 'Current'} />}
          value={Scope.Page}
        />
        <Tab
          label={<ScopeTabLabel label="Site" subLabel={activeTab?.url ? new URL(activeTab.url).hostname : 'Domain'} />}
          value={Scope.Domain}
        />
        <Tab
          label={<ScopeTabLabel label="Global" subLabel="All Sites" />}
          value={Scope.Global}
        />
      </Tabs>
    </Paper>
  );
};
