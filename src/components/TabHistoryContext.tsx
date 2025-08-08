// src/components/TabHistoryContext.tsx
import React, {createContext, useContext, useState} from 'react';

interface TabHistoryContextType {
  history: string[];
  pushTab: (tab: string) => void;
  popTab: () => string | null;
  getLastTab: () => string | null;
  clearHistory: () => void;
}

const TabHistoryContext = createContext<TabHistoryContextType | undefined>(
  undefined,
);

export const TabHistoryProvider = ({children}: {children: React.ReactNode}) => {
  const [history, setHistory] = useState<string[]>([]);

  const pushTab = (tab: string) => {
    setHistory(prev => [...prev, tab]);
  };

  const popTab = () => {
    let last = null;
    setHistory(prev => {
      if (prev.length > 0) {
        last = prev[prev.length - 1];
        return prev.slice(0, -1);
      }
      return prev;
    });
    return last;
  };

  const getLastTab = () =>
    history.length > 0 ? history[history.length - 1] : null;

  const clearHistory = () => setHistory([]);

  return (
    <TabHistoryContext.Provider
      value={{history, pushTab, popTab, getLastTab, clearHistory}}>
      {children}
    </TabHistoryContext.Provider>
  );
};

export const useTabHistory = () => {
  const context = useContext(TabHistoryContext);
  if (!context)
    throw new Error('useTabHistory must be used within a TabHistoryProvider');
  return context;
};
