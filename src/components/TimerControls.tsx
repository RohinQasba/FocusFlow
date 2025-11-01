import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Phase } from '@/hooks/useTimer';

interface TimerControlsProps {
  isRunning: boolean;
  phase: Phase;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const TimerControls = ({ 
  isRunning, 
  phase, 
  onStart, 
  onPause,
  onReset
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
        className="relative group transition-all duration-300 font-semibold"
        style={{
          backgroundColor: `hsl(var(--${phaseColors[phase]}))`,
          color: 'black',
          textShadow: '0 1px 2px rgba(255, 255, 255, 0.3)',
          boxShadow: `0 0 15px hsl(var(--${phaseColors[phase]}) / 0.4), 0 2px 8px rgba(0, 0, 0, 0.1)`,
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
            boxShadow: `0 0 25px hsl(var(--${phaseColors[phase]}) / 0.6), 0 0 50px hsl(var(--${phaseColors[phase]}) / 0.3)`,
          }}
        />
      </Button>
      
      <Button
        size="icon"
        onClick={onReset}
        variant="outline"
        className="relative group transition-all duration-300 h-11 w-11"
      >
        <RotateCcw className="h-5 w-5" />
      </Button>
    </div>
  );
};
