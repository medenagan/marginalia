import React from 'react';
import { createRoot } from 'react-dom/client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import DescriptionIcon from '@mui/icons-material/Description';
import SecurityIcon from '@mui/icons-material/Security';
import './welcome.scss';
import ScreenExample from '../../assets/sceenshots/screen-example.png';

import { useTranslation } from '../../sidepanel/hooks/useTranslation';

/**
 * Localizes the HTML page by finding all elements with 'data-i18n' attribute
 * and replacing their content with the localized string.
 */
const localizeHtmlPage = (): void => {
  const elements = document.querySelectorAll('[data-i18n]');

  elements.forEach((element) => {
    const key = element.getAttribute('data-i18n');
    if (key) {
      const message = chrome.i18n.getMessage(key);
      if (message) {
        element.textContent = message;
      }
    }
  });
};

// Localize the HTML elements (like <title>) when the script loads
localizeHtmlPage();

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <Paper elevation={0} sx={{ p: 3, height: '100%', border: '1px solid rgba(0,0,0,0.12)' }}>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <Box sx={{ color: 'primary.main', mb: 2 }}>{icon}</Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  </Paper>
);

const Welcome = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {t('welcome_title')}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          {t('welcome_description')}
        </Typography>
         <Button variant="contained" size="large" onClick={async () => {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tab.id) {
              await chrome.sidePanel.open({ tabId: tab.id });
            }
         }}>
          {t('welcome_button_start')}
        </Button>
      </Box>

      <Box sx={{ mt: 6, mb: 8, display: 'flex', justifyContent: 'center' }}>
        <Box
          component="img"
          src={ScreenExample}
          alt="Marginalia Screenshot"
          sx={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: 2,
            boxShadow: 3,
            maxHeight: 500,
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          <FeatureCard
            icon={<DescriptionIcon sx={{ fontSize: 40 }} />}
            title={t('welcome_feature_context_title')}
            description={t('welcome_feature_context_desc')}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <FeatureCard
            icon={<SecurityIcon sx={{ fontSize: 40 }} />}
            title={t('welcome_feature_privacy_title')}
            description={t('welcome_feature_privacy_desc')}
          />
        </Box>
      </Box>
    </Box>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Welcome />
    </ThemeProvider>
  );
}
