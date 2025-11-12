import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeSettings, FontFamily, AccentColor, ACCENT_COLOR_VALUES } from '@/types/theme';

interface ThemeContextType {
  theme: ThemeSettings;
  updateFont: (font: FontFamily) => void;
  updateWallpaper: (wallpaperId: string) => void;
  updateAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_THEME: ThemeSettings = {
  font: 'inter',
  wallpaper: 'soft-gradient-1',
  accentColor: 'red',
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeSettings>(DEFAULT_THEME);

  // Load theme from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('focusflow-theme');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure accentColor exists, fallback to default if not
        setTheme({
          ...DEFAULT_THEME,
          ...parsed,
          accentColor: parsed.accentColor || DEFAULT_THEME.accentColor,
        });
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

  // Apply accent color to CSS variables
  useEffect(() => {
    const colorData = ACCENT_COLOR_VALUES[theme.accentColor];
    if (colorData) {
      const accentHsl = colorData.hsl;
      // Determine foreground color based on accent color brightness
      const darkColors = ['black', 'blue', 'purple'];
      const accentForeground = darkColors.includes(theme.accentColor) ? '0 0% 100%' : '0 0% 0%';
      
      document.documentElement.style.setProperty('--accent', accentHsl);
      document.documentElement.style.setProperty('--accent-foreground', accentForeground);
      document.documentElement.style.setProperty('--ring', accentHsl);
      document.documentElement.style.setProperty('--work', accentHsl);
      document.documentElement.style.setProperty('--work-glow', accentHsl);
    }
  }, [theme.accentColor]);

  const updateFont = (font: FontFamily) => {
    setTheme(prev => ({ ...prev, font }));
  };

  const updateWallpaper = (wallpaperId: string) => {
    setTheme(prev => ({ ...prev, wallpaper: wallpaperId }));
  };

  const updateAccentColor = (accentColor: AccentColor) => {
    setTheme(prev => ({ ...prev, accentColor }));
  };

  return (
    <ThemeContext.Provider value={{ theme, updateFont, updateWallpaper, updateAccentColor }}>
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
