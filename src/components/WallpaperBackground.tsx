import { getWallpaperById } from '@/data/wallpapers';

interface WallpaperBackgroundProps {
  wallpaperId: string;
}

export const WallpaperBackground = ({ wallpaperId }: WallpaperBackgroundProps) => {
  const wallpaper = getWallpaperById(wallpaperId);

  if (!wallpaper) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{ 
          backgroundImage: `url(${wallpaper.path})`,
          zIndex: -2,
        }}
      />
      <div 
        className="fixed inset-0 bg-background/40 backdrop-blur-[2px] transition-all duration-1000"
        style={{ zIndex: -1 }}
      />
    </>
  );
};
