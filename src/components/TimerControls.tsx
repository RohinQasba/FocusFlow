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
        className="relative group transition-all duration-300"
        style={{
          backgroundColor: `hsl(var(--${phaseColors[phase]}))`,
          color: 'white',
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
            <Play className="mr-2 h-5 w-5 fill-white" />
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

      <Button
        size="lg"
        variant="outline"
        onClick={onReset}
        className="border-muted-foreground/30 hover:border-foreground/50 hover:bg-card transition-all duration-300"
      >
        <RotateCcw className="mr-2 h-5 w-5" />
        Reset
      </Button>
    </div>
  );
};
