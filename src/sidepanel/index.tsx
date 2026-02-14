import React from 'react';
import { createRoot } from 'react-dom/client';
import { mountApp } from '../utils/dom';
import '../styles/sidepanel.scss';
import App from './App';
import { ActiveTabProvider } from './hooks/useActiveTab';

/**
 * Entry point for the Sidepanel application.
 * Initializes the React root and wraps the App with necessary providers.
 */
const app = (
  <React.StrictMode>
    <ActiveTabProvider>
      <App />
    </ActiveTabProvider>
  </React.StrictMode>
);

mountApp(app);
