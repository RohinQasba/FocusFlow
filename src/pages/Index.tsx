import { useEffect, useState } from 'react';
import { useTimer } from '@/hooks/useTimer';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { TimerArc } from '@/components/TimerArc';
import { TimerControls } from '@/components/TimerControls';
import { PhaseIndicator } from '@/components/PhaseIndicator';
import { MotivationalQuote } from '@/components/MotivationalQuote';
import { SettingsDialog } from '@/components/SettingsDialog';
import { TimeRange } from '@/components/TimeRange';
import { VictoryScreen } from '@/components/VictoryScreen';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';

const Index = () => {
  const timer = useTimer();
  const { playBrownNoise, stopBrownNoise, playPhaseTransition } = useSoundEffects();
  const [, setForceUpdate] = useState(0);
  const [showVictory, setShowVictory] = useState(false);

  // Check if all sessions are completed
  const allSessionsComplete = timer.workSessionsCompleted >= timer.settings.workSessionsBeforeLongBreak && timer.phase !== 'work' && !timer.isRunning;

  // Auto dark mode after 10 seconds
  useEffect(() => {
    if (timer.isRunning && timer.settings.autoDarkMode) {
      const timeout = setTimeout(() => {
        if (!document.documentElement.classList.contains('dark')) {
          document.documentElement.classList.add('dark');
        }
      }, 10000);
      return () => clearTimeout(timeout);
    } else {
      // Remove dark mode when timer stops
      document.documentElement.classList.remove('dark');
    }
  }, [timer.isRunning, timer.settings.autoDarkMode]);

  // Screen dimming effect
  useEffect(() => {
    if (timer.isRunning && timer.settings.screenDimming && timer.settings.autoDarkMode) {
      const timeout = setTimeout(() => {
        document.body.style.filter = 'brightness(0.4)';
        document.body.style.transition = 'filter 1s ease-in-out';
      }, 10000);
      return () => {
        clearTimeout(timeout);
        document.body.style.filter = '';
      };
    } else {
      document.body.style.filter = '';
    }
  }, [timer.isRunning, timer.settings.screenDimming, timer.settings.autoDarkMode]);

  // Handle brown noise for work phase
  useEffect(() => {
    if (timer.isRunning && timer.phase === 'work' && timer.settings.brownNoiseEnabled) {
      playBrownNoise();
    } else {
      stopBrownNoise();
    }
  }, [timer.isRunning, timer.phase, timer.settings.brownNoiseEnabled, playBrownNoise, stopBrownNoise]);

  // Register phase change callback for sound effects
  useEffect(() => {
    timer.registerPhaseChangeCallback((newPhase) => {
      playPhaseTransition(newPhase);
      setForceUpdate(prev => prev + 1);
    });
  }, [timer, playPhaseTransition]);

  // Show victory screen when all sessions complete
  useEffect(() => {
    if (allSessionsComplete) {
      setShowVictory(true);
    }
  }, [allSessionsComplete]);

  const handleRestart = () => {
    setShowVictory(false);
    timer.reset();
  };

  const handleCompleteReset = () => {
    // Clear all localStorage
    localStorage.clear();
    // Reset all state
    setShowVictory(false);
    // Reload the page to get fresh default settings
    window.location.reload();
  };

  const phaseColors = {
    work: 'hsl(var(--work))',
    shortBreak: 'hsl(var(--short-break))',
    longBreak: 'hsl(var(--long-break))',
  };

  return (
    <>
      {showVictory && (
        <VictoryScreen 
          totalSessions={timer.settings.workSessionsBeforeLongBreak}
          onRestart={handleRestart}
        />
      )}

      <div 
        className="min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-[1500ms] ease-in-out"
        style={{
          background: `linear-gradient(135deg, hsl(var(--background)) 0%, ${phaseColors[timer.phase]}15 100%)`,
        }}
      >
      {/* Header */}
      <header className="absolute top-6 left-0 right-0 flex items-center justify-between px-6 max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          FocusFlow
        </h1>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full hover:bg-card transition-colors duration-300"
            onClick={() => timer.updateSettings({ ...timer.settings, brownNoiseEnabled: !timer.settings.brownNoiseEnabled })}
          >
            {timer.settings.brownNoiseEnabled ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full hover:bg-card transition-colors duration-300"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Everything?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will clear all your settings, progress, and stored data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleCompleteReset}>
                  Yes, reset everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <SettingsDialog 
            settings={timer.settings}
            onSave={timer.updateSettings}
            phase={timer.phase}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center gap-8 max-w-2xl w-full">
        <PhaseIndicator 
          phase={timer.phase}
          workSessionsCompleted={timer.workSessionsCompleted}
          totalSessionsBeforeLongBreak={timer.settings.workSessionsBeforeLongBreak}
        />

        <div className="animate-scale-in">
          <TimerArc
            phase={timer.phase}
            timeLeft={timer.timeLeft}
            totalTime={timer.getDuration(timer.phase) * 60}
          />
        </div>

        <TimeRange 
          startTime={timer.startTime}
          endTime={timer.getEndTime()}
        />

        <TimerControls
          isRunning={timer.isRunning}
          phase={timer.phase}
          onStart={timer.start}
          onPause={timer.pause}
          onReset={timer.reset}
        />

        <div className="mt-8">
          <MotivationalQuote 
            phase={timer.phase}
            workSessionsCompleted={timer.workSessionsCompleted}
          />
        </div>
      </main>

        {/* Footer */}
        <footer className="absolute bottom-6 text-center text-muted-foreground text-sm">
          <p>Built with focus and flow</p>
        </footer>
      </div>
    </>
  );
};

export default Index;
