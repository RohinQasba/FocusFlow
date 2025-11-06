import { useState } from 'react';
import { Check, ChevronLeft, Type, Image } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { FontFamily, WallpaperCategory, FONT_NAMES, CATEGORY_NAMES } from '@/types/theme';
import { getWallpapersByCategory } from '@/data/wallpapers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

type ViewMode = 'menu' | 'fonts' | 'wallpapers';

export const AppearanceSettings = () => {
  const { theme, updateFont, updateWallpaper } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('menu');
  const [selectedCategory, setSelectedCategory] = useState<WallpaperCategory>('soft-gradients');

  const fonts: FontFamily[] = ['inter', 'poppins', 'manrope', 'space-grotesk', 'orbitron', 'exo-2'];
  const categories: WallpaperCategory[] = ['soft-gradients', 'peaceful-minimal', 'dark-radiant', 'geometric-abstract', 'nature-organic'];

  // Menu view - choose between fonts or wallpapers
  if (viewMode === 'menu') {
    return (
      <div className="space-y-4 py-6">
        <h3 className="text-lg font-semibold mb-6 text-center">What would you like to customize?</h3>
        <div className="grid gap-4">
          <Button
            onClick={() => setViewMode('fonts')}
            variant="outline"
            size="lg"
            className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
          >
            <Type className="h-8 w-8" />
            <div>
              <div className="font-semibold">Font Style</div>
              <div className="text-xs text-muted-foreground">Current: {FONT_NAMES[theme.font]}</div>
            </div>
          </Button>
          
          <Button
            onClick={() => setViewMode('wallpapers')}
            variant="outline"
            size="lg"
            className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
          >
            <Image className="h-8 w-8" />
            <div>
              <div className="font-semibold">Background Wallpaper</div>
              <div className="text-xs text-muted-foreground">Customize your backdrop</div>
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
          {fonts.map((font) => (
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
                <span className={`font-semibold text-base font-${font}`}>{FONT_NAMES[font]}</span>
                {theme.font === font && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
              <p className={`font-${font} text-sm text-muted-foreground text-left`}>
                The quick brown fox jumps over the lazy dog. 1234567890
              </p>
            </button>
          ))}
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
        <TabsList className="w-full grid grid-cols-3 h-auto">
          {categories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="text-xs px-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {CATEGORY_NAMES[category]}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="mt-4">
          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid grid-cols-2 gap-3 pb-4">
                {getWallpapersByCategory(category).map((wallpaper) => (
                  <button
                    key={wallpaper.id}
                    onClick={() => updateWallpaper(wallpaper.id)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 group ${
                      theme.wallpaper === wallpaper.id
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="aspect-video relative">
                      <img
                        src={wallpaper.path}
                        alt={wallpaper.name}
                        className="w-full h-full object-cover"
                      />
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
                ))}
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};
