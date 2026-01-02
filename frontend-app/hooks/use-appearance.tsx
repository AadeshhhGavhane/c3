import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import * as SystemUI from 'expo-system-ui';

type ColorScheme = 'light' | 'dark' | 'auto';

interface AppearanceContextType {
  colorScheme: 'light' | 'dark';
  setColorScheme: (scheme: ColorScheme) => void;
  toggleAppearance: () => void;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useRNColorScheme();
  const [preference, setPreference] = useState<ColorScheme>('auto');
  
  const colorScheme = preference === 'auto' 
    ? (systemColorScheme ?? 'light')
    : preference;

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(
      colorScheme === 'dark' ? '#1a1614' : '#fcfaf8'
    );
  }, [colorScheme]);

  const toggleAppearance = () => {
    setPreference((prev) => {
      if (prev === 'auto') {
        return systemColorScheme === 'dark' ? 'light' : 'dark';
      }
      return prev === 'dark' ? 'light' : 'dark';
    });
  };

  const setColorScheme = (scheme: ColorScheme) => {
    setPreference(scheme);
  };

  return (
    <AppearanceContext.Provider value={{ colorScheme, setColorScheme, toggleAppearance }}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error('useAppearance must be used within AppearanceProvider');
  }
  return context;
}

