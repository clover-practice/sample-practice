// context/TabBarVisibilityContext.tsx
import React, { createContext, useContext } from 'react';
import { SharedValue, useSharedValue } from 'react-native-reanimated';

type ContextType = {
  translateY: SharedValue<number>;
};

const TabBarVisibilityContext = createContext<ContextType | null>(null);

export const TabBarVisibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const translateY = useSharedValue(0);

  return (
    <TabBarVisibilityContext.Provider value={{ translateY }}>
      {children}
    </TabBarVisibilityContext.Provider>
  );
};

export const useTabBarVisibility = (): ContextType => {
  const context = useContext(TabBarVisibilityContext);
  if (!context) throw new Error('TabBarVisibilityContext not found!');
  return context;
};
