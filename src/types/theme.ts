export type FontFamily = 'inter' | 'poppins' | 'manrope' | 'space-grotesk' | 'orbitron' | 'exo-2';

export type WallpaperCategory = 'soft-gradients' | 'peaceful-minimal' | 'dark-radiant' | 'geometric-abstract' | 'nature-organic' | 'solid-colors';

export type AccentColor = 'red' | 'blue' | 'light-blue' | 'green' | 'purple' | 'orange' | 'pink' | 'yellow' | 'black';

export interface Wallpaper {
  id: string;
  name: string;
  category: WallpaperCategory;
  path: string;
  color?: string; // For solid color wallpapers
}

export interface ThemeSettings {
  font: FontFamily;
  wallpaper: string; // wallpaper id
  accentColor: AccentColor;
}

export const FONT_NAMES: Record<FontFamily, string> = {
  'inter': 'Inter',
  'poppins': 'Poppins',
  'manrope': 'Manrope',
  'space-grotesk': 'Space Grotesk',
  'orbitron': 'Orbitron',
  'exo-2': 'Exo 2',
};

export const CATEGORY_NAMES: Record<WallpaperCategory, string> = {
  'soft-gradients': 'Soft Gradients',
  'peaceful-minimal': 'Peaceful Minimal',
  'dark-radiant': 'Dark Radiant',
  'geometric-abstract': 'Geometric Abstract',
  'nature-organic': 'Nature Organic',
  'solid-colors': 'Solid Colors',
};

export const ACCENT_COLOR_VALUES: Record<AccentColor, { hsl: string; name: string }> = {
  'red': { hsl: '349 100% 55%', name: 'Red' },
  'blue': { hsl: '217 91% 60%', name: 'Blue' },
  'light-blue': { hsl: '199 100% 50%', name: 'Light Blue' },
  'green': { hsl: '145 100% 45%', name: 'Green' },
  'purple': { hsl: '271 81% 56%', name: 'Purple' },
  'orange': { hsl: '25 95% 53%', name: 'Orange' },
  'pink': { hsl: '330 81% 60%', name: 'Pink' },
  'yellow': { hsl: '48 96% 53%', name: 'Yellow' },
  'black': { hsl: '0 0% 0%', name: 'Black' },
};
