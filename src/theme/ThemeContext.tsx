import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { LightTheme, DarkTheme, AppTheme } from '../theme/themes';

interface ThemeContextProps {
  theme: AppTheme;
  mode: ColorSchemeName;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ColorSchemeName>(Appearance.getColorScheme() || 'light');

  useEffect(() => {
    const listener = ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
      setMode(colorScheme || 'light');
    };

    const subscription = Appearance.addChangeListener(listener);

    return () => subscription.remove();
  }, []);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = mode === 'dark' ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
