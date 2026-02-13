import React from 'react';

import Tabs from '@mui/material/Tabs';
import Paper from '@mui/material/Paper';
import DescriptionIcon from '@mui/icons-material/Description';
import DnsIcon from '@mui/icons-material/Dns';
import PublicIcon from '@mui/icons-material/Public';
import { Scope } from '../../../types/note';
import { useActiveTabContext } from '../../hooks/useActiveTab';
import { useTranslation } from '../../hooks/useTranslation';
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
  const { t } = useTranslation();
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
          tooltip={t('tooltip_scope_page')}
          icon={<DescriptionIcon />}
          iconPosition="start"
          label={t('scope_page')}
          value={Scope.Page}
        />
        <TooltipTab
          tooltip={activeTab?.url ? t('tooltip_scope_site', new URL(activeTab.url).hostname) : t('tooltip_scope_site_fallback')}
          icon={<DnsIcon />}
          iconPosition="start"
          label={t('scope_site')}
          value={Scope.Domain}
        />
        <TooltipTab
          tooltip={t('tooltip_scope_global')}
          icon={<PublicIcon />}
          iconPosition="start"
          label={t('scope_global')}
          value={Scope.Global}
        />
      </Tabs>
    </Paper>
  );
};
