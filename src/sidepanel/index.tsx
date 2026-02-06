import React from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/sidepanel.scss';
import App from './App';
import { ActiveTabProvider } from './hooks/useActiveTab';

/**
 * Entry point for the Sidepanel application.
 * Initializes the React root and wraps the App with necessary providers.
 */
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ActiveTabProvider>
        <App />
      </ActiveTabProvider>
    </React.StrictMode>
  );
}
