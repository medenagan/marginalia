import { getNoteIdentifier, Note } from '../types/note';
import { resolveBucketLocation } from '../utils/storage';

const getFaviconUrl = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return `https://www.google.com/s2/favicons?domain=example.com&sz=64`;
  }
};

const OPEN_SOURCE_URLS = [
  'https://github.com/facebook/react',
  'https://github.com/microsoft/TypeScript',
  'https://github.com/torvalds/linux',
  'https://developer.mozilla.org/en-US/',
  'https://webpack.js.org/',
  'https://nodejs.org/en/',
  'https://www.rust-lang.org/',
  'https://go.dev/',
  'https://kubernetes.io/',
  'https://www.postgresql.org/',
  'https://redis.io/',
  'https://www.docker.com/',
  'https://www.python.org/',
  'https://git-scm.com/',
  'https://code.visualstudio.com/',
];

const LOREM_TITLES = [
  '', // Intentionally empty to test dynamic titles
  'Refactoring the core module',
  'Fixing memory leak in worker',
  'Meeting notes',
  'Ideas for new feature',
  'Quick scratchpad',
  '',
  'Documentation update',
  'Investigation report',
  '',
];

const LOREM_CONTENT = [
  '<p>Remember to check the pull request #123.</p>',
  '<p>Need to update dependencies.</p>',
  '<p>The bug seems to be in the <b>parsing logic</b>.</p>',
  '<p><ul><li>Step 1: Install</li><li>Step 2: Run</li></ul></p>',
  '<p>This is a <i>crucial</i> fix for the next release.</p>',
  '<p>Check performance metrics.</p>',
];

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const getRandomDate = (): number => {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const r = Math.random();

  if (r < 0.2) {
    // Today
    return now - Math.floor(Math.random() * (12 * 60 * 60 * 1000));
  } else if (r < 0.4) {
    // Yesterday
    return now - oneDay - Math.floor(Math.random() * (12 * 60 * 60 * 1000));
  } else if (r < 0.7) {
    // Last week (2-6 days ago)
    const daysAgo = 2 + Math.floor(Math.random() * 5);
    return now - daysAgo * oneDay;
  } else {
    // Older (up to 1 year ago)
    const daysAgo = 7 + Math.floor(Math.random() * 360);
    return now - daysAgo * oneDay;
  }
};

export const storeMockNotes = async (count = 100): Promise<void> => {
  console.log(`Generating ${count} mock notes...`);
  const notesByStorageKey: Record<string, Record<string, Note>> = {};

  for (let i = 0; i < count; i++) {
    const url = getRandomElement(OPEN_SOURCE_URLS);
    const location = resolveBucketLocation(url);
    const id = getNoteIdentifier(location);

    // Logic to resolve key manually
    const storageKey = `notes_domain:${location}`;

    const createdAt = getRandomDate();
    const note: Note = {
      id,
      title: getRandomElement(LOREM_TITLES),
      content: getRandomElement(LOREM_CONTENT),
      url,
      icon: getFaviconUrl(url),
      createdAt: createdAt,
      updatedAt: createdAt,
    };

    if (!notesByStorageKey[storageKey]) {
      notesByStorageKey[storageKey] = {};
    }
    notesByStorageKey[storageKey][note.id] = note;
  }

  // Batch save
  await chrome.storage.local.set(notesByStorageKey);
  console.log('Mock notes generated.');
};
