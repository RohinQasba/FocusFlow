export type FontFamily = 'inter' | 'poppins' | 'manrope' | 'space-grotesk' | 'orbitron' | 'exo-2';

export type WallpaperCategory = 'soft-gradients' | 'peaceful-minimal' | 'dark-radiant' | 'geometric-abstract' | 'nature-organic';

export interface Wallpaper {
  id: string;
  name: string;
  category: WallpaperCategory;
  path: string;
}

export interface ThemeSettings {
  font: FontFamily;
  wallpaper: string; // wallpaper id
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
};
