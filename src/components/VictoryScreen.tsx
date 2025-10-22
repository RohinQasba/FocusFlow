import { Button } from '@/components/ui/button';
import { Trophy, Sparkles } from 'lucide-react';

interface VictoryScreenProps {
  totalSessions: number;
  onRestart: () => void;
}

const victoryMessages = [
  "Amazing work! You crushed it! 🎯",
  "Incredible focus! You're unstoppable! ⚡",
  "Victory is yours! Keep the momentum! 🚀",
  "Outstanding dedication! You nailed it! 💪",
  "Phenomenal effort! You're on fire! 🔥",
  "Brilliant work! You conquered it! ⭐",
  "Superb focus! You're a champion! 🏆",
  "Exceptional performance! Keep shining! ✨",
];

export const VictoryScreen = ({ totalSessions, onRestart }: VictoryScreenProps) => {
  const randomMessage = victoryMessages[Math.floor(Math.random() * victoryMessages.length)];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm animate-fade-in">
      <div className="text-center space-y-8 px-4 animate-scale-in">
        {/* Trophy Icon */}
        <div className="relative inline-block">
          <Trophy 
            className="w-32 h-32 text-primary animate-pulse"
            style={{
              filter: 'drop-shadow(0 0 40px hsl(var(--primary))) drop-shadow(0 0 80px hsl(var(--primary)))',
            }}
          />
          <Sparkles 
            className="absolute -top-4 -right-4 w-12 h-12 text-primary animate-pulse"
            style={{ animationDelay: '0.3s' }}
          />
          <Sparkles 
            className="absolute -bottom-4 -left-4 w-12 h-12 text-primary animate-pulse"
            style={{ animationDelay: '0.6s' }}
          />
        </div>

        {/* Victory Message */}
        <div className="space-y-4">
          <h1 
            className="text-5xl md:text-6xl font-bold"
            style={{
              color: 'hsl(var(--primary))',
              textShadow: '0 0 20px hsl(var(--primary))',
            }}
          >
            You Did It!
          </h1>
          <p className="text-2xl md:text-3xl text-foreground">
            {randomMessage}
          </p>
          <p className="text-lg text-muted-foreground">
            Completed {totalSessions} focus session{totalSessions !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Restart Button */}
        <Button
          size="lg"
          onClick={onRestart}
          className="px-8 py-6 text-lg font-semibold"
          style={{
            background: 'hsl(var(--primary))',
            boxShadow: '0 0 30px hsl(var(--primary) / 0.5)',
          }}
        >
          Start New Session
        </Button>
      </div>
    </div>
  );
};
