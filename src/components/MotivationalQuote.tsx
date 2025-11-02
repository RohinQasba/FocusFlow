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
    'Try a 5-minute stretch',
    'Look at something 20 feet away',
    'Bathroom break',
    'Walk around for a bit',
    'Grab some water',
    'Do some eye exercises',
    'Take deep breaths',
  ],
  longBreak: [
    'Take a short walk',
    'Grab a healthy snack',
    'Step outside for fresh air',
    'Do some light exercise',
    'Meditate for a few minutes',
    'Call a friend or family',
    'Listen to your favorite song',
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
