import { useState } from 'react';
import { Check, ChevronLeft, Type, Image, Palette } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { FontFamily, WallpaperCategory, AccentColor, FONT_NAMES, CATEGORY_NAMES, ACCENT_COLOR_VALUES } from '@/types/theme';
import { getWallpapersByCategory } from '@/data/wallpapers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

type ViewMode = 'menu' | 'fonts' | 'wallpapers' | 'accent-colors';

export const AppearanceSettings = () => {
  const { theme, updateFont, updateWallpaper, updateAccentColor } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('menu');
  const [selectedCategory, setSelectedCategory] = useState<WallpaperCategory>('soft-gradients');

  const fonts: FontFamily[] = ['inter', 'poppins', 'manrope', 'space-grotesk', 'orbitron', 'exo-2'];
  const categories: WallpaperCategory[] = ['soft-gradients', 'peaceful-minimal', 'dark-radiant', 'geometric-abstract', 'nature-organic', 'solid-colors'];
  const accentColors: AccentColor[] = ['red', 'blue', 'light-blue', 'green', 'purple', 'orange', 'pink', 'yellow', 'black'];

  // Menu view - choose between fonts, wallpapers, or accent colors
  if (viewMode === 'menu') {
    return (
      <div className="space-y-4 py-6">
        <h3 className="text-lg font-semibold mb-6 text-center">What would you like to customize?</h3>
        <div className="grid gap-3">
          <Button
            onClick={() => setViewMode('fonts')}
            variant="outline"
            size="lg"
            className="h-20 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
          >
            <Type className="h-6 w-6" />
            <div>
              <div className="font-semibold text-sm">Font Style</div>
              <div className="text-xs text-muted-foreground">Current: {FONT_NAMES[theme.font]}</div>
            </div>
          </Button>
          
          <Button
            onClick={() => setViewMode('wallpapers')}
            variant="outline"
            size="lg"
            className="h-20 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
          >
            <Image className="h-6 w-6" />
            <div>
              <div className="font-semibold text-sm">Background Wallpaper</div>
              <div className="text-xs text-muted-foreground">Customize your backdrop</div>
            </div>
          </Button>

          <Button
            onClick={() => setViewMode('accent-colors')}
            variant="outline"
            size="lg"
            className="h-20 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
          >
            <Palette className="h-6 w-6" />
            <div>
              <div className="font-semibold text-sm">Accent Color</div>
              <div className="text-xs text-muted-foreground">Current: {ACCENT_COLOR_VALUES[theme.accentColor].name}</div>
            </div>
          </Button>
        </div>
      </div>
    );
  }

  // Font selection view
  if (viewMode === 'fonts') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('menu')}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h3 className="text-lg font-semibold">Choose Font Style</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-3 pb-4">
          {fonts.map((font) => {
            const fontClass = `font-${font}`;
            return (
              <button
                key={font}
                onClick={() => updateFont(font)}
                className={`p-5 rounded-lg border-2 transition-all duration-300 hover:scale-[1.02] ${
                  theme.font === font
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-semibold text-base ${fontClass}`}>{FONT_NAMES[font]}</span>
                  {theme.font === font && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </div>
                <p className={`${fontClass} text-sm text-muted-foreground text-left`}>
                  The quick brown fox jumps over the lazy dog. 1234567890
                </p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Accent color selection view
  if (viewMode === 'accent-colors') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('menu')}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h3 className="text-lg font-semibold">Choose Accent Color</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-3 pb-4">
          {accentColors.map((color) => {
            const colorData = ACCENT_COLOR_VALUES[color];
            return (
              <button
                key={color}
                onClick={() => updateAccentColor(color)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                  theme.accentColor === color
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div 
                    className="w-12 h-12 rounded-full border-2 border-border"
                    style={{ backgroundColor: `hsl(${colorData.hsl})` }}
                  />
                  <span className="text-xs font-medium">{colorData.name}</span>
                  {theme.accentColor === color && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Wallpaper selection view
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewMode('menu')}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h3 className="text-lg font-semibold">Choose Wallpaper</h3>
      </div>
      
      <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as WallpaperCategory)}>
        <TabsList className="w-full grid grid-cols-2 h-auto gap-1">
          {categories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="text-[10px] px-1 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
            >
              {CATEGORY_NAMES[category]}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="mt-4">
          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid grid-cols-2 gap-3 pb-4">
                {getWallpapersByCategory(category).map((wallpaper) => {
                  // Check if this solid color matches the current accent color
                  const isSolidColor = wallpaper.category === 'solid-colors';
                  const matchesAccent = isSolidColor && wallpaper.color?.toLowerCase().includes(theme.accentColor === 'black' ? '#0a0a0a' : '');
                  
                  return (
                    <button
                      key={wallpaper.id}
                      onClick={() => updateWallpaper(wallpaper.id)}
                      disabled={matchesAccent}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 group ${
                        theme.wallpaper === wallpaper.id
                          ? 'border-primary ring-2 ring-primary/20'
                          : matchesAccent 
                            ? 'border-border opacity-40 cursor-not-allowed hover:scale-100'
                            : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="aspect-video relative">
                        {isSolidColor ? (
                          <div 
                            className="w-full h-full"
                            style={{ backgroundColor: wallpaper.color }}
                          />
                        ) : (
                          <img
                            src={wallpaper.path}
                            alt={wallpaper.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                        {theme.wallpaper === wallpaper.id && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <Check className="h-8 w-8 text-primary drop-shadow-lg" />
                          </div>
                        )}
                      </div>
                      <div className="p-2 bg-card/90 backdrop-blur-sm">
                        <p className="text-xs font-medium truncate">{wallpaper.name}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};
