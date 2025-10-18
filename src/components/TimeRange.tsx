interface TimeRangeProps {
  startTime: Date | null;
  endTime: Date | null;
}

export const TimeRange = ({ startTime, endTime }: TimeRangeProps) => {
  if (!startTime || !endTime) {
    return null;
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="text-center text-muted-foreground text-sm md:text-base">
      {formatTime(startTime)} – {formatTime(endTime)}
    </div>
  );
};
