import { getWallpaperById } from '@/data/wallpapers';

interface WallpaperBackgroundProps {
  wallpaperId: string;
}

export const WallpaperBackground = ({ wallpaperId }: WallpaperBackgroundProps) => {
  const wallpaper = getWallpaperById(wallpaperId);

  if (!wallpaper) return null;

  // For solid colors, use the color directly instead of an image
  const isSolidColor = wallpaper.category === 'solid-colors';

  return (
    <>
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{ 
          backgroundColor: isSolidColor ? wallpaper.color : undefined,
          backgroundImage: isSolidColor ? undefined : `url(${wallpaper.path})`,
          zIndex: -2,
        }}
      />
      <div 
        className="fixed inset-0 bg-background/60 backdrop-blur-[3px] transition-all duration-1000"
        style={{ zIndex: -1 }}
      />
    </>
  );
};
