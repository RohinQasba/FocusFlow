import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { Phase } from '@/hooks/useTimer';

interface TimerControlsProps {
  isRunning: boolean;
  phase: Phase;
  onStart: () => void;
  onPause: () => void;
}

export const TimerControls = ({ 
  isRunning, 
  phase, 
  onStart, 
  onPause
}: TimerControlsProps) => {
  const phaseColors = {
    work: 'work',
    shortBreak: 'short-break',
    longBreak: 'long-break',
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        size="lg"
        onClick={isRunning ? onPause : onStart}
        className="relative group transition-all duration-300"
        style={{
          backgroundColor: `hsl(var(--${phaseColors[phase]}))`,
          color: 'black',
          boxShadow: `0 0 20px hsl(var(--${phaseColors[phase]}) / 0.5)`,
        }}
      >
        {isRunning ? (
          <>
            <Pause className="mr-2 h-5 w-5" />
            Pause
          </>
        ) : (
          <>
            <Play className="mr-2 h-5 w-5 fill-black" />
            Start
          </>
        )}
        <div 
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            boxShadow: `0 0 30px hsl(var(--${phaseColors[phase]}) / 0.8), 0 0 60px hsl(var(--${phaseColors[phase]}) / 0.4)`,
          }}
        />
      </Button>
    </div>
  );
};
