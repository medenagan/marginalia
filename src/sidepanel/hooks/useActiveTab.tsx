import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * Interface defining the shape of the ActiveTabContext.
 */
export interface ActiveTabContextType {
  activeTab: chrome.tabs.Tab | null;
}

/**
 * Context to provide the currently active tab information.
 */
export const ActiveTabContext = createContext<ActiveTabContextType | undefined>(undefined);

/**
 * Provider component that tracks the active tab and exposes it via context.
 * Listens for tab activation and updates.
 */
export const ActiveTabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | null>(null);

  useEffect(() => {
    const fetchActiveTab = async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
          setActiveTab(tab);
      }
    };

    fetchActiveTab();

    const handleActivated = (activeInfo: chrome.tabs.TabActiveInfo) => {
      chrome.tabs.get(activeInfo.tabId, (tab) => {
        setActiveTab(tab);
      });
    };

    const handleUpdated = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
      if (tab.active) {
        setActiveTab(currentActiveTab => currentActiveTab && tabId === currentActiveTab.id ? tab : currentActiveTab);
      }
    };

    chrome.tabs.onActivated.addListener(handleActivated);
    chrome.tabs.onUpdated.addListener(handleUpdated);

    return () => {
      chrome.tabs.onActivated.removeListener(handleActivated);
      chrome.tabs.onUpdated.removeListener(handleUpdated);
    };
  }, []);

  return (
    <ActiveTabContext.Provider value={{ activeTab }}>
      {children}
    </ActiveTabContext.Provider>
  );
};

/**
 * Hook to access the current active tab context.
 * @returns {ActiveTabContextType} The active tab context.
 */
export const useActiveTabContext = () => {
  const context = useContext(ActiveTabContext);
  return context as ActiveTabContextType;
};
