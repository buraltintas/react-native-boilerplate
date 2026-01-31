/**
 * Shared - Theme - Context
 * 
 * Theme context provider for accessing theme values
 */

import React, {createContext, useContext, useMemo} from 'react';
import {useColorScheme} from 'react-native';
import {useUIStore} from '@shared/store';
import {theme, darkTheme, Theme} from './tokens';

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  colors: Theme['colors'];
  spacing: Theme['spacing'];
  typography: Theme['typography'];
  borderRadius: Theme['borderRadius'];
  shadows: Theme['shadows'];
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({children}: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const themeMode = useUIStore(state => state.theme);

  // Determine if dark mode is active
  const isDark = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  // Select appropriate theme
  const currentTheme = isDark ? darkTheme : theme;

  const value: ThemeContextValue = useMemo(
    () => ({
      theme: currentTheme,
      isDark,
      colors: currentTheme.colors,
      spacing: currentTheme.spacing,
      typography: currentTheme.typography,
      borderRadius: currentTheme.borderRadius,
      shadows: currentTheme.shadows,
    }),
    [currentTheme, isDark],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to access theme
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export default ThemeProvider;
