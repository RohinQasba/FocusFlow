import { useEffect, useRef } from 'react';
import { Phase } from './useTimer';

export const useSoundEffects = () => {
  const brownNoiseRef = useRef<HTMLAudioElement | null>(null);
  const phaseTransitionRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create brown noise audio element
    brownNoiseRef.current = new Audio();
    brownNoiseRef.current.loop = true;
    brownNoiseRef.current.volume = 0.15;
    
    return () => {
      if (brownNoiseRef.current) {
        brownNoiseRef.current.pause();
        brownNoiseRef.current = null;
      }
    };
  }, []);

  const playBrownNoise = () => {
    if (brownNoiseRef.current) {
      // Using a simple brown noise generator URL or data URL
      // For now, we'll use a silent audio as placeholder
      brownNoiseRef.current.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
      brownNoiseRef.current.play().catch(() => {
        console.log('Brown noise playback prevented by browser');
      });
    }
  };

  const stopBrownNoise = () => {
    if (brownNoiseRef.current) {
      brownNoiseRef.current.pause();
      brownNoiseRef.current.currentTime = 0;
    }
  };

  const playPhaseTransition = (phase: Phase) => {
    // Create audio context for beep sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different frequencies and patterns for each phase
    if (phase === 'work') {
      // Alert, focus-boosting tone (sharp beep)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } else if (phase === 'shortBreak') {
      // Relieving, refreshing sound (two-tone beep)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(700, audioContext.currentTime + 0.1);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
    } else {
      // Calm, soothing tone (low, gentle beep)
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.6);
    }
  };

  return {
    playBrownNoise,
    stopBrownNoise,
    playPhaseTransition,
  };
};
