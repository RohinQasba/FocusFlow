import { Wallpaper } from '@/types/theme';

export const wallpapers: Wallpaper[] = [
  // Soft Gradients
  { id: 'soft-gradient-1', name: 'Blue to Purple Waves', category: 'soft-gradients', path: '/wallpapers/soft-gradient-1.jpg' },
  { id: 'soft-gradient-2', name: 'Peach to Pink', category: 'soft-gradients', path: '/wallpapers/soft-gradient-2.jpg' },
  { id: 'soft-gradient-3', name: 'Mint to Teal', category: 'soft-gradients', path: '/wallpapers/soft-gradient-3.jpg' },
  { id: 'soft-gradient-4', name: 'Lavender to Blue', category: 'soft-gradients', path: '/wallpapers/soft-gradient-4.jpg' },
  { id: 'soft-gradient-5', name: 'Sunrise Orange', category: 'soft-gradients', path: '/wallpapers/soft-gradient-5.jpg' },
  
  // Peaceful Minimal
  { id: 'peaceful-minimal-1', name: 'White Space', category: 'peaceful-minimal', path: '/wallpapers/peaceful-minimal-1.jpg' },
  { id: 'peaceful-minimal-2', name: 'Soft Beige', category: 'peaceful-minimal', path: '/wallpapers/peaceful-minimal-2.jpg' },
  { id: 'peaceful-minimal-3', name: 'Gray Shapes', category: 'peaceful-minimal', path: '/wallpapers/peaceful-minimal-3.jpg' },
  { id: 'peaceful-minimal-4', name: 'Pastel Geometric', category: 'peaceful-minimal', path: '/wallpapers/peaceful-minimal-4.jpg' },
  { id: 'peaceful-minimal-5', name: 'Zen Composition', category: 'peaceful-minimal', path: '/wallpapers/peaceful-minimal-5.jpg' },
  
  // Dark Radiant
  { id: 'dark-radiant-1', name: 'Deep Blue Glow', category: 'dark-radiant', path: '/wallpapers/dark-radiant-1.jpg' },
  { id: 'dark-radiant-2', name: 'Purple Nebula', category: 'dark-radiant', path: '/wallpapers/dark-radiant-2.jpg' },
  { id: 'dark-radiant-3', name: 'Midnight Stars', category: 'dark-radiant', path: '/wallpapers/dark-radiant-3.jpg' },
  { id: 'dark-radiant-4', name: 'Teal Luminescence', category: 'dark-radiant', path: '/wallpapers/dark-radiant-4.jpg' },
  { id: 'dark-radiant-5', name: 'Accent Glow', category: 'dark-radiant', path: '/wallpapers/dark-radiant-5.jpg' },
  
  // Geometric Abstract
  { id: 'geometric-abstract-1', name: 'Clean Patterns', category: 'geometric-abstract', path: '/wallpapers/geometric-abstract-1.jpg' },
  { id: 'geometric-abstract-2', name: 'Polygon Design', category: 'geometric-abstract', path: '/wallpapers/geometric-abstract-2.jpg' },
  { id: 'geometric-abstract-3', name: 'Abstract Lines', category: 'geometric-abstract', path: '/wallpapers/geometric-abstract-3.jpg' },
  { id: 'geometric-abstract-4', name: 'Modern Composition', category: 'geometric-abstract', path: '/wallpapers/geometric-abstract-4.jpg' },
  { id: 'geometric-abstract-5', name: 'Triangular Patterns', category: 'geometric-abstract', path: '/wallpapers/geometric-abstract-5.jpg' },
  
  // Nature Organic
  { id: 'nature-organic-1', name: 'Mountain Dawn', category: 'nature-organic', path: '/wallpapers/nature-organic-1.jpg' },
  { id: 'nature-organic-2', name: 'Fluid Water', category: 'nature-organic', path: '/wallpapers/nature-organic-2.jpg' },
  { id: 'nature-organic-3', name: 'Forest Atmosphere', category: 'nature-organic', path: '/wallpapers/nature-organic-3.jpg' },
  { id: 'nature-organic-4', name: 'Cloud Formations', category: 'nature-organic', path: '/wallpapers/nature-organic-4.jpg' },
  { id: 'nature-organic-5', name: 'Flowing Curves', category: 'nature-organic', path: '/wallpapers/nature-organic-5.jpg' },
  
  // Solid Colors
  { id: 'solid-black', name: 'Black', category: 'solid-colors', path: '', color: '#0A0A0A' },
  { id: 'solid-dark-gray', name: 'Dark Gray', category: 'solid-colors', path: '', color: '#1A1A1A' },
  { id: 'solid-charcoal', name: 'Charcoal', category: 'solid-colors', path: '', color: '#2D2D2D' },
  { id: 'solid-navy', name: 'Navy', category: 'solid-colors', path: '', color: '#0F1729' },
  { id: 'solid-deep-blue', name: 'Deep Blue', category: 'solid-colors', path: '', color: '#1A2332' },
  { id: 'solid-dark-teal', name: 'Dark Teal', category: 'solid-colors', path: '', color: '#0D1F1F' },
  { id: 'solid-forest', name: 'Forest', category: 'solid-colors', path: '', color: '#0F1F0F' },
  { id: 'solid-burgundy', name: 'Burgundy', category: 'solid-colors', path: '', color: '#2D1420' },
  { id: 'solid-deep-purple', name: 'Deep Purple', category: 'solid-colors', path: '', color: '#1A0F2E' },
  { id: 'solid-midnight-blue', name: 'Midnight Blue', category: 'solid-colors', path: '', color: '#0A1628' },
];

export const getWallpapersByCategory = (category: string) => {
  return wallpapers.filter(w => w.category === category);
};

export const getWallpaperById = (id: string) => {
  return wallpapers.find(w => w.id === id);
};
