import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeSettings, FontFamily } from '@/types/theme';

interface ThemeContextType {
  theme: ThemeSettings;
  updateFont: (font: FontFamily) => void;
  updateWallpaper: (wallpaperId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_THEME: ThemeSettings = {
  font: 'inter',
  wallpaper: 'soft-gradient-1',
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeSettings>(DEFAULT_THEME);

  // Load theme from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('focusflow-theme');
      if (stored) {
        const parsed = JSON.parse(stored);
        setTheme(parsed);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  }, []);

  // Save theme to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('focusflow-theme', JSON.stringify(theme));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, [theme]);

  // Apply font to body
  useEffect(() => {
    document.body.className = document.body.className.replace(/font-\S+/g, '');
    document.body.classList.add(`font-${theme.font}`);
  }, [theme.font]);

  const updateFont = (font: FontFamily) => {
    setTheme(prev => ({ ...prev, font }));
  };

  const updateWallpaper = (wallpaperId: string) => {
    setTheme(prev => ({ ...prev, wallpaper: wallpaperId }));
  };

  return (
    <ThemeContext.Provider value={{ theme, updateFont, updateWallpaper }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
