import { useEffect, useRef } from 'react';
import { Phase } from './useTimer';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const useSoundEffects = () => {
  const playerRef = useRef<any>(null);
  const isPlayerReadyRef = useRef(false);

  useEffect(() => {
    const initializePlayer = () => {
      // Create hidden iframe container if it doesn't exist
      let container = document.getElementById('youtube-brown-noise');
      if (!container) {
        container = document.createElement('div');
        container.id = 'youtube-brown-noise';
        container.style.position = 'fixed';
        container.style.top = '-9999px';
        container.style.left = '-9999px';
        container.style.width = '1px';
        container.style.height = '1px';
        container.style.opacity = '0';
        container.style.pointerEvents = 'none';
        document.body.appendChild(container);
      }

      try {
        playerRef.current = new window.YT.Player('youtube-brown-noise', {
          height: '1',
          width: '1',
          videoId: 'ca3fBRmmrBA',
          playerVars: {
            autoplay: 0,
            controls: 0,
            loop: 1,
            playlist: 'ca3fBRmmrBA',
          },
          events: {
            onReady: () => {
              console.log('YouTube player ready');
              isPlayerReadyRef.current = true;
              playerRef.current.setVolume(25);
            },
            onError: (e: any) => {
              console.error('YouTube player error:', e);
            },
          },
        });
      } catch (error) {
        console.error('Error creating YouTube player:', error);
      }
    };

    // Check if API already loaded
    if (window.YT && window.YT.Player) {
      initializePlayer();
      return;
    }

    // Load YouTube IFrame API if not already loaded
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      console.log('YouTube API ready');
      initializePlayer();
    };

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.log('Error destroying player:', e);
        }
      }
      const el = document.getElementById('youtube-brown-noise');
      if (el) el.remove();
    };
  }, []);

  const playBrownNoise = async () => {
    console.log('Attempting to play brown noise, ready:', isPlayerReadyRef.current);
    if (playerRef.current && isPlayerReadyRef.current) {
      try {
        await playerRef.current.playVideo();
      } catch (error) {
        console.log('Failed to play brown noise:', error);
      }
    }
  };

  const stopBrownNoise = () => {
    if (playerRef.current && isPlayerReadyRef.current) {
      try {
        playerRef.current.pauseVideo();
      } catch (error) {
        console.log('Failed to stop brown noise:', error);
      }
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