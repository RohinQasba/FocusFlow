import { useEffect, useRef } from 'react';
import { Phase } from './useTimer';

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const brownNoiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    // Lazily initialize AudioContext on user gesture to satisfy autoplay policies
    // Initialization happens in ensureAudioContext(); we only clean up below if created.
    
    return () => {
      if (brownNoiseNodeRef.current) {
        try {
          brownNoiseNodeRef.current.stop();
          brownNoiseNodeRef.current.disconnect();
        } catch (error) {
          // Already stopped, ignore
        }
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Ensure AudioContext is created and resumed on user gesture
  const ensureAudioContext = async () => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }
    if (audioContextRef.current.state === 'suspended') {
      try { await audioContextRef.current.resume(); } catch {}
    }
    if (!gainNodeRef.current) {
      gainNodeRef.current = audioContextRef.current.createGain();
      // start muted; we'll fade in when starting noise
      gainNodeRef.current.gain.value = 0;
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
  };

  const playBrownNoise = async () => {
    await ensureAudioContext();
    if (!audioContextRef.current || !gainNodeRef.current) return;
  
    // Stop existing noise if playing
    if (brownNoiseNodeRef.current) {
      try {
        brownNoiseNodeRef.current.stop();
        brownNoiseNodeRef.current.disconnect();
      } catch (error) {
        // Already stopped, ignore
      }
    }
    
    // Create new buffer source and loop it
    const bufferSize = audioContextRef.current.sampleRate * 2;
    const buffer = audioContextRef.current.createBuffer(1, bufferSize, audioContextRef.current.sampleRate);
    const output = buffer.getChannelData(0);

    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    brownNoiseNodeRef.current = audioContextRef.current.createBufferSource();
    brownNoiseNodeRef.current.buffer = buffer;
    brownNoiseNodeRef.current.loop = true;
    brownNoiseNodeRef.current.connect(gainNodeRef.current);

    const now = audioContextRef.current.currentTime;
    gainNodeRef.current.gain.cancelScheduledValues(now);
    gainNodeRef.current.gain.setValueAtTime(0, now);
    gainNodeRef.current.gain.linearRampToValueAtTime(0.15, now + 0.5);

    brownNoiseNodeRef.current.start();
  };

  const stopBrownNoise = () => {
    if (brownNoiseNodeRef.current && audioContextRef.current && gainNodeRef.current) {
      const now = audioContextRef.current.currentTime;
      try {
        // Smooth fade-out then stop
        gainNodeRef.current.gain.cancelScheduledValues(now);
        gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, now);
        gainNodeRef.current.gain.linearRampToValueAtTime(0, now + 0.3);
        brownNoiseNodeRef.current.stop(now + 0.35);
        brownNoiseNodeRef.current.disconnect();
      } catch (error) {
        // Already stopped, ignore
      }
      brownNoiseNodeRef.current = null;
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
