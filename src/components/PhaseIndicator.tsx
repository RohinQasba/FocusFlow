import { Phase } from '@/hooks/useTimer';

interface PhaseIndicatorProps {
  phase: Phase;
  workSessionsCompleted: number;
}

export const PhaseIndicator = ({ phase, workSessionsCompleted }: PhaseIndicatorProps) => {
  const phaseNames = {
    work: 'Focus Time',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
  };

  const phaseColors = {
    work: 'hsl(var(--work))',
    shortBreak: 'hsl(var(--short-break))',
    longBreak: 'hsl(var(--long-break))',
  };

  return (
    <div className="text-center space-y-2">
      <h2 
        className="text-3xl md:text-4xl font-bold transition-colors duration-600"
        style={{ color: phaseColors[phase] }}
      >
        {phaseNames[phase]}
      </h2>
      <div className="flex items-center justify-center gap-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i < workSessionsCompleted % 4 ? phaseColors.work : 'hsl(var(--muted))',
              boxShadow: i < workSessionsCompleted % 4 ? `0 0 8px ${phaseColors.work}` : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
};
