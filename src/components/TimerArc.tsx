import { Phase } from '@/hooks/useTimer';
import { useTheme } from '@/contexts/ThemeContext';

interface TimerArcProps {
  phase: Phase;
  timeLeft: number;
  totalTime: number;
}

export const TimerArc = ({ phase, timeLeft, totalTime }: TimerArcProps) => {
  const { theme } = useTheme();
  const progress = (timeLeft / totalTime) * 100;
  const radius = 140;
  const strokeWidth = 16;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  // Arc that curves downward (180 degrees)
  const arcLength = circumference * 0.75; // 270 degrees for more visual arc
  const strokeDashoffset = arcLength - (progress / 100) * arcLength;

  const phaseColors = {
    work: 'hsl(var(--work))',
    shortBreak: 'hsl(var(--short-break))',
    longBreak: 'hsl(var(--long-break))',
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform rotate-[135deg]"
      >
        {/* Background arc */}
        <circle
          stroke="hsl(var(--muted))"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeLinecap="round"
          opacity={0.2}
        />
        {/* Progress arc */}
        <circle
          stroke={phaseColors[phase]}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          style={{
            strokeDashoffset,
            transition: 'stroke-dashoffset 1s linear, stroke 0.6s ease-in-out',
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Timer display in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div 
            className={`font-bold tabular-nums transition-colors duration-600 ${
              theme.font === 'orbitron' ? 'text-5xl md:text-6xl' : 'text-6xl md:text-7xl'
            }`}
            style={{ color: phaseColors[phase] }}
          >
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>
      </div>
    </div>
  );
};
