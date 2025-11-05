import { useState } from 'react';
import { Check } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { FontFamily, WallpaperCategory, FONT_NAMES, CATEGORY_NAMES } from '@/types/theme';
import { getWallpapersByCategory } from '@/data/wallpapers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

export const AppearanceSettings = () => {
  const { theme, updateFont, updateWallpaper } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<WallpaperCategory>('soft-gradients');

  const fonts: FontFamily[] = ['inter', 'poppins', 'manrope', 'space-grotesk', 'orbitron', 'exo-2'];
  const categories: WallpaperCategory[] = ['soft-gradients', 'peaceful-minimal', 'dark-radiant', 'geometric-abstract', 'nature-organic'];

  return (
    <div className="space-y-6">
      {/* Font Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Font Style</h3>
        <div className="grid grid-cols-2 gap-3">
          {fonts.map((font) => (
            <button
              key={font}
              onClick={() => updateFont(font)}
              className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                theme.font === font
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">{FONT_NAMES[font]}</span>
                {theme.font === font && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
              <p className={`font-${font} text-sm text-muted-foreground`}>
                The quick brown fox jumps
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Wallpaper Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Background Wallpaper</h3>
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
          
          <ScrollArea className="h-[300px] mt-4">
            {categories.map((category) => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="grid grid-cols-2 gap-3 pr-4">
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
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
};
