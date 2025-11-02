import { useState, useEffect, useRef, useCallback } from 'react';

export type Phase = 'work' | 'shortBreak' | 'longBreak';

export interface TimerSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStartNextPhase: boolean;
  brownNoiseEnabled: boolean;
  workSessionsBeforeLongBreak: number;
  autoDarkMode: boolean;
  screenDimming: boolean;
}

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartNextPhase: true,
  brownNoiseEnabled: false,
  workSessionsBeforeLongBreak: 2,
  autoDarkMode: true,
  screenDimming: true,
};

export const useTimer = () => {
  const [phase, setPhase] = useState<Phase>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [workSessionsCompleted, setWorkSessionsCompleted] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [sessionsSkipped, setSessionsSkipped] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onPhaseChangeRef = useRef<((newPhase: Phase) => void) | null>(null);

  // Load settings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('focusflow-settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      setSettings(parsed);
      setTimeLeft(parsed.workDuration * 60);
    }
  }, []);

  // Save settings to localStorage
  const updateSettings = useCallback((newSettings: TimerSettings) => {
    setSettings(newSettings);
    localStorage.setItem('focusflow-settings', JSON.stringify(newSettings));
    
    // Update time if not running
    if (!isRunning) {
      const duration = 
        phase === 'work' ? newSettings.workDuration :
        phase === 'shortBreak' ? newSettings.shortBreakDuration :
        newSettings.longBreakDuration;
      setTimeLeft(duration * 60);
    }
  }, [isRunning, phase]);

  const getDuration = useCallback((phaseType: Phase) => {
    return phaseType === 'work' ? settings.workDuration :
           phaseType === 'shortBreak' ? settings.shortBreakDuration :
           settings.longBreakDuration;
  }, [settings]);

  const getNextPhase = useCallback((): Phase => {
    if (phase === 'work') {
      const nextSession = workSessionsCompleted + 1;
      return nextSession % settings.workSessionsBeforeLongBreak === 0 ? 'longBreak' : 'shortBreak';
    }
    return 'work';
  }, [phase, workSessionsCompleted, settings.workSessionsBeforeLongBreak]);

  const switchPhase = useCallback((newPhase: Phase, autoStart: boolean = false) => {
    // Increment work sessions when work phase COMPLETES
    if (phase === 'work' && newPhase !== 'work') {
      setWorkSessionsCompleted(prev => prev + 1);
    }

    setPhase(newPhase);
    const duration = getDuration(newPhase);
    setTimeLeft(duration * 60);

    if (onPhaseChangeRef.current) {
      onPhaseChangeRef.current(newPhase);
    }

    if (autoStart && settings.autoStartNextPhase) {
      setIsRunning(true);
      setStartTime(new Date());
    } else {
      setIsRunning(false);
      setStartTime(null);
    }
  }, [phase, getDuration, settings.autoStartNextPhase]);

  const start = useCallback(() => {
    setIsRunning(true);
    if (!startTime) {
      setStartTime(new Date());
    }
  }, [startTime]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setStartTime(null);
    setWorkSessionsCompleted(0);
    setSessionsSkipped(false);
    setPhase('work');
    const duration = settings.workDuration;
    setTimeLeft(duration * 60);
  }, [settings.workDuration]);

  const skip = useCallback(() => {
    setSessionsSkipped(true);
    const nextPhase = getNextPhase();
    switchPhase(nextPhase, false);
  }, [getNextPhase, switchPhase]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Phase completed
            const nextPhase = getNextPhase();
            setTimeout(() => switchPhase(nextPhase, true), 100);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, getNextPhase, switchPhase]);

  const registerPhaseChangeCallback = useCallback((callback: (newPhase: Phase) => void) => {
    onPhaseChangeRef.current = callback;
  }, []);

  const getEndTime = useCallback(() => {
    if (!startTime || !isRunning) return null;
    const end = new Date(startTime);
    end.setSeconds(end.getSeconds() + timeLeft);
    return end;
  }, [startTime, timeLeft, isRunning]);

  return {
    phase,
    timeLeft,
    isRunning,
    settings,
    workSessionsCompleted,
    startTime,
    sessionsSkipped,
    start,
    pause,
    reset,
    skip,
    updateSettings,
    switchPhase,
    registerPhaseChangeCallback,
    getEndTime,
    getDuration,
  };
};
