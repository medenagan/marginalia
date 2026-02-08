const initializeChromeMock = () => {
  if (typeof window === 'undefined') return;

  // Do not mock if the Chrome runtime is already present
  if (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).chrome &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).chrome.runtime &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).chrome.runtime.id
  ) {
    return;
  }

  console.log('--- Initializing Chrome API Mock ---');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const store: Record<string, any> = {};

  const mockStorage = {
    local: {
      get: (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        keys: string | string[] | Record<string, any> | null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback?: (items: any) => void,
      ) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let result: Record<string, any> = {};
        if (typeof keys === 'string') {
          result[keys] = store[keys];
        } else if (Array.isArray(keys)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          keys.forEach((k: any) => {
            result[k] = store[k];
          });
        } else {
          // Return everything for null/empty
          result = { ...store };
        }

        // Simulate async behavior
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new Promise<any>((resolve) => {
          setTimeout(() => {
            if (callback) callback(result);
            resolve(result);
          }, 10);
        });
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set: (items: Record<string, any>, callback?: () => void) => {
        Object.assign(store, items);
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            if (callback) callback();
            resolve();
          }, 10);
        });
      },
    },
  };

  const mockRuntime = {
    id: 'mock-extension-id',
    getURL: (path: string) => path,
    onMessage: {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      addListener: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      removeListener: () => {},
    },
    sendMessage: () => Promise.resolve(),
  };

  const mockTabs = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: (_queryInfo: any, callback?: (result: any[]) => void) => {
      const result = [{ id: 1, url: 'http://localhost/mock-page', title: 'Mock Page' }];
      if (callback) callback(result);
      return Promise.resolve(result);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get: (tabId: number, callback?: (tab: any) => void) => {
      const tab = { id: tabId, url: 'http://example.com/new-tab', title: 'New Tab' };
      if (callback) callback(tab);
      return Promise.resolve(tab);
    },
    onActivated: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: [] as any[],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      addListener: (callback: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).chrome.tabs.onActivated.items.push(callback);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      removeListener: (callback: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items = (window as any).chrome.tabs.onActivated.items;
        const index = items.indexOf(callback);
        if (index > -1) items.splice(index, 1);
      },
    },
    onUpdated: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: [] as any[],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      addListener: (callback: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).chrome.tabs.onUpdated.items.push(callback);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      removeListener: (callback: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items = (window as any).chrome.tabs.onUpdated.items;
        const index = items.indexOf(callback);
        if (index > -1) items.splice(index, 1);
      },
    },
  };

  /**
   * Helper to trigger tab switch events for testing.
   * Exposed on window for console usage.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).mockTriggerTabSwitch = (tabId: number, title: string, url: string) => {
    // 1. Mock 'get' to return this new tab info
    mockTabs.get = (_id, cb) => {
      const t = { id: tabId, title, url };
      if (cb) cb(t);
      return Promise.resolve(t);
    };

    // 2. Trigger onActivated
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).chrome.tabs.onActivated.items.forEach((cb: any) => cb({ tabId }));
  };

  const mockSidePanel = {
    setOptions: () => Promise.resolve(),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).chrome = (window as any).chrome || {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).chrome.runtime = (window as any).chrome.runtime || mockRuntime;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).chrome.storage = (window as any).chrome.storage || mockStorage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).chrome.tabs = (window as any).chrome.tabs || mockTabs;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).chrome.sidePanel = (window as any).chrome.sidePanel || mockSidePanel;
};

// Auto-initialize on import
initializeChromeMock();
