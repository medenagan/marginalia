# Project: Marginalia (demo-highlight)

## 1. Overview
Marginalia is a Chrome Extension built with React and TypeScript. This document serves as the primary reference for the codebase structure, development workflow, and mandatory coding standards.

## 2. Architecture & Organization

### Tech Stack
-   **Core**: React 19, TypeScript
-   **UI Library**: Material UI (@mui/material) + Emotion
-   **Styling**: SCSS, Emotion
-   **Build Tool**: Webpack
-   **Manifest**: V3

### Directory Structure
```text
/
├── dist/               # Compiled extension output
├── src/
│   ├── assets/         # Static assets (images, manifest.json)
│   ├── icons/          # Extension icons
│   ├── sidepanel/      # Sidepanel UI Feature
│   │   ├── components/ # Reusable UI components
│   │   ├── hooks/      # Custom hooks (e.g., useActiveTab)
│   │   ├── state/      # Global state management
│   │   ├── utils/      # Utility helpers
│   │   ├── App.tsx     # Main React component
│   │   └── index.tsx   # Entry point
│   ├── background/     # Service Worker logic
│   ├── mock/           # Chrome API mocks for development
│   └── sidepanel.html  # HTML entry for sidepanel
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── webpack.config.js   # Webpack configuration
```

### Key Entry Points
-   **Sidepanel**: Logic in `src/sidepanel/index.tsx`, HTML in `src/sidepanel.html`.
-   **Background**: Service worker logic in `src/background/index.ts`.

## 3. Development Workflow

### Scripts
-   `npm run build`: Build the extension for production (outputs to `dist/`).
-   `npm run build-mock`: Build with mocked Chrome APIs for browser testing.
-   `npm run watch`: Build in development mode and watch for changes.
-   `npm run fmt`: Format code using Prettier.
-   `npm run lint`: Lint code with strict TypeScript rules.

### Strict Build Process
Critically, this project enforces a verified Build Loop:
1.  **Format**: `npm run fmt` (Prettier)
2.  **Lint**: `npm run lint` (ESLint with strict type checking)
3.  **Build**: `npm run build` (Webpack with `strictExportPresence`)
4.  **Fix & Repeat**: If any step fails, fix the issue and start from step 1.

### Mock Mode & Browser Testing
The application includes a **Mock Mode** to simulate Chrome APIs (`chrome.storage`, `chrome.runtime`, `chrome.tabs`) in a standard browser environment.
1.  Run `npm run build-mock`.
2.  Open `dist/sidepanel.html` in your browser.
3.  **Verify**: Look for the "v0 mock" indicator in the bottom-right and test UI interactivity.

## 4. Coding Standards & Guidelines

### General
-   **Function Style**: **ALWAYS** use arrow functions (`const App = () => {}`). **NEVER** use the `function` keyword.
-   **Styling**: Use SCSS or Emotion. Prioritize Material UI components.
-   **Formatting**: Maintain Prettier formatting at all times.

### Security & Safety
-   **HTML Sanitization**: **MANDATORY**. All user-generated or stored HTML must be sanitized using `dompurify` before storage and upon retrieval. Never dangerously set HTML without sanitization.
-   **ID Generation**: Use `crypto.randomUUID()` for robust, unique identifiers. Do NOT use `Math.random()`.

### Chrome Extension Patterns
-   **Global Chrome Object**: Assume `chrome` is available globally (mocked or real). Do NOT use `typeof chrome` checks or cast `window.chrome`.
-   **Tab Tracking**: Use `ActiveTabContext` for accessing current tab information.

### Documentation & Comments
-   **JSDoc**: All classes, methods, components, and exported functions MUST have concise JSDoc comments describing their purpose, parameters, and return values.
-   **No Agentic Commentary**: Do NOT include internal reasoning, "Agent notes", or personal thoughts in the source code.
    -   *Guideline*: Instructions for the agent belong in `AGENTS.md`, not the codebase.
    -   *Guideline*: Comments must describe code behavior only.
