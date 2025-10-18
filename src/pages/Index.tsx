import { useEffect, useState } from 'react';
import { useTimer } from '@/hooks/useTimer';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { TimerArc } from '@/components/TimerArc';
import { TimerControls } from '@/components/TimerControls';
import { PhaseIndicator } from '@/components/PhaseIndicator';
import { MotivationalQuote } from '@/components/MotivationalQuote';
import { SettingsDialog } from '@/components/SettingsDialog';
import { TimeRange } from '@/components/TimeRange';

const Index = () => {
  const timer = useTimer();
  const { playBrownNoise, stopBrownNoise, playPhaseTransition } = useSoundEffects();
  const [, setForceUpdate] = useState(0);

  // Auto dark mode after 30 seconds
  useEffect(() => {
    if (timer.isRunning) {
      const timeout = setTimeout(() => {
        document.documentElement.classList.add('dark');
      }, 30000);
      return () => clearTimeout(timeout);
    }
  }, [timer.isRunning]);

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

  const phaseColors = {
    work: 'hsl(var(--work))',
    shortBreak: 'hsl(var(--short-break))',
    longBreak: 'hsl(var(--long-break))',
  };

  return (
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
        <SettingsDialog 
          settings={timer.settings}
          onSave={timer.updateSettings}
          phase={timer.phase}
        />
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center gap-8 max-w-2xl w-full">
        <PhaseIndicator 
          phase={timer.phase}
          workSessionsCompleted={timer.workSessionsCompleted}
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
  );
};

export default Index;
