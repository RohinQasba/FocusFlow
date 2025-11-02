import { useEffect, useState, useCallback, useRef } from 'react';
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
import { Volume2, VolumeX, Maximize } from 'lucide-react';

const Index = () => {
  const timer = useTimer();
  const { playBrownNoise, stopBrownNoise, playPhaseTransition } = useSoundEffects();
  const [, setForceUpdate] = useState(0);
  const [showVictory, setShowVictory] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Check if all sessions are completed
  const allSessionsComplete = timer.workSessionsCompleted >= timer.settings.workSessionsBeforeLongBreak && timer.phase !== 'work' && !timer.isRunning;

  // Wake Lock - prevent device from sleeping
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator && timer.isRunning) {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
          console.log('Wake Lock activated - screen will not sleep');
        }
      } catch (err) {
        console.error('Wake Lock error:', err);
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLockRef.current) {
        try {
          await wakeLockRef.current.release();
          wakeLockRef.current = null;
          console.log('Wake Lock released');
        } catch (err) {
          console.error('Wake Lock release error:', err);
        }
      }
    };

    if (timer.isRunning) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    // Handle visibility change (re-acquire wake lock when page becomes visible)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && timer.isRunning) {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      releaseWakeLock();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [timer.isRunning]);

  // Auto dark mode after 10 seconds
  useEffect(() => {
    const autoDarkEnabled = timer.settings.autoDarkMode !== false; // Default to true if not set
    
    if (timer.isRunning && autoDarkEnabled) {
      console.log('Starting dark mode timer - will activate in 10 seconds');
      const timeout = setTimeout(() => {
        console.log('Activating dark mode now');
        document.documentElement.classList.add('dark');
      }, 10000);
      return () => {
        console.log('Cleaning up dark mode timer');
        clearTimeout(timeout);
      };
    } else {
      // Remove dark mode when timer stops
      console.log('Removing dark mode');
      document.documentElement.classList.remove('dark');
    }
  }, [timer.isRunning, timer.settings.autoDarkMode]);

  // Screen dimming effect
  const [isDimmed, setIsDimmed] = useState(false);

  useEffect(() => {
    const autoDarkEnabled = timer.settings.autoDarkMode !== false;
    const dimmingEnabled = timer.settings.screenDimming !== false;
    
    if (timer.isRunning && dimmingEnabled && autoDarkEnabled) {
      console.log('Starting dimming timer - will dim in 15 seconds');
      const timeout = setTimeout(() => {
        console.log('Dimming screen now');
        document.body.style.filter = 'brightness(0.4)';
        document.body.style.transition = 'filter 1s ease-in-out';
        setIsDimmed(true);
      }, 15000);
      return () => {
        clearTimeout(timeout);
        if (!isDimmed) {
          document.body.style.filter = '';
          document.body.style.transition = '';
        }
      };
    } else if (!timer.isRunning) {
      document.body.style.filter = '';
      document.body.style.transition = '';
      setIsDimmed(false);
    }
  }, [timer.isRunning, timer.settings.screenDimming, timer.settings.autoDarkMode, isDimmed]);

  // Handle click to restore brightness (but keep dark mode)
  const handleScreenClick = useCallback(() => {
    if (isDimmed && timer.isRunning) {
      console.log('Restoring brightness on click');
      document.body.style.filter = '';
      setIsDimmed(false);
    }
  }, [isDimmed, timer.isRunning]);

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

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          if (timer.isRunning) {
            timer.pause();
          } else {
            timer.start();
          }
          break;
        case 'r':
          e.preventDefault();
          timer.reset();
          break;
        case 's':
          e.preventDefault();
          timer.skip();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [timer]);

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
        className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 transition-all duration-[1500ms] ease-in-out"
        style={{
          background: `linear-gradient(135deg, hsl(var(--background)) 0%, ${phaseColors[timer.phase]}15 100%)`,
        }}
        onClick={handleScreenClick}
      >
      {/* Header */}
      <header className="absolute top-4 sm:top-6 left-0 right-0 flex items-center justify-between px-4 sm:px-6 max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          FocusFlow
        </h1>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full hover:bg-card transition-colors duration-300 h-9 w-9 sm:h-10 sm:w-10"
            onClick={() => timer.updateSettings({ ...timer.settings, brownNoiseEnabled: !timer.settings.brownNoiseEnabled })}
          >
            {timer.settings.brownNoiseEnabled ? (
              <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full hover:bg-card transition-colors duration-300 h-9 w-9 sm:h-10 sm:w-10"
            onClick={handleFullscreen}
          >
            <Maximize className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <SettingsDialog 
            settings={timer.settings}
            onSave={timer.updateSettings}
            phase={timer.phase}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 max-w-2xl w-full mt-16 sm:mt-0 mb-20">
        <PhaseIndicator 
          phase={timer.phase}
          workSessionsCompleted={timer.workSessionsCompleted}
          totalSessionsBeforeLongBreak={timer.settings.workSessionsBeforeLongBreak}
        />

        <div className="animate-scale-in scale-75 sm:scale-90 md:scale-100">
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
          onSkip={timer.skip}
        />

        <div className="mt-4 sm:mt-6 md:mt-8 px-4 sm:px-0 mb-8">
          <MotivationalQuote 
            phase={timer.phase}
            workSessionsCompleted={timer.workSessionsCompleted}
          />
        </div>

        {/* Footer */}
        <footer className="text-center text-muted-foreground text-xs sm:text-sm mt-6">
          <p>Built with focus and flow</p>
        </footer>
      </main>
      </div>
    </>
  );
};

export default Index;
