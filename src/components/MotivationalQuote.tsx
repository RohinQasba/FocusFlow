import { useEffect, useState } from 'react';
import { Phase } from '@/hooks/useTimer';

const quotes = {
  work: [
    'Stay sharp',
    'Focus is power',
    'You\'ve got this',
    'Deep work, deep results',
    'One task at a time',
    'Flow state activated',
    'Make every minute count',
    'Eliminate distractions',
  ],
  shortBreak: [
    'Breathe and recharge',
    'Quick reset, big impact',
    'Rest is productive',
    'Refresh your mind',
    'Stretch and relax',
    'Step away, come back stronger',
  ],
  longBreak: [
    'Well deserved break',
    'You earned this',
    'Recharge fully',
    'Rest deeply, work better',
    'Take your time',
    'Celebrate your progress',
  ],
};

interface MotivationalQuoteProps {
  phase: Phase;
  workSessionsCompleted: number;
}

export const MotivationalQuote = ({ phase, workSessionsCompleted }: MotivationalQuoteProps) => {
  const [quote, setQuote] = useState('');
  const [key, setKey] = useState(0);

  useEffect(() => {
    const phaseQuotes = quotes[phase];
    const randomQuote = phaseQuotes[Math.floor(Math.random() * phaseQuotes.length)];
    setQuote(randomQuote);
    setKey(prev => prev + 1);
  }, [phase, workSessionsCompleted]);

  return (
    <div 
      key={key}
      className="text-center text-xl md:text-2xl font-light text-muted-foreground animate-fade-in"
    >
      "{quote}"
    </div>
  );
};
