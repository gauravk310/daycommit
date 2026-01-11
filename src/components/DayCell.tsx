import { cn } from '@/lib/utils';
import { DayEntry, Status } from '@/types';
import { isToday, isFuture } from '@/lib/dateUtils';

interface DayCellProps {
  date: Date;
  status: Status;
  entry?: DayEntry;
  isActive?: boolean;
  onClick?: () => void;
}

const getContributionLevel = (entry?: DayEntry): number => {
  if (!entry) return 0;
  if (entry.status === 'none') return 0;
  if (entry.status === 'partial') return 2;

  // For complete entries, determine level based on duration
  const duration = entry.duration || 60;
  if (duration < 60) return 1;
  if (duration < 120) return 2;
  if (duration < 240) return 3;
  return 4;
};

export const DayCell = ({ date, status, entry, isActive = true, onClick }: DayCellProps) => {
  const today = isToday(date);
  const future = isFuture(date);
  const level = getContributionLevel(entry);

  const getCellClass = () => {
    if (!isActive || future) return 'contribution-0 opacity-30';

    if (status === 'none' && !future) {
      // Past day with no entry - show as empty (not red for better UX)
      return 'contribution-0';
    }

    if (entry) {
      if (entry.status === 'partial') {
        return 'bg-warning/60';
      }
      return `contribution-${level}`;
    }

    return 'contribution-0';
  };

  return (
    <div
      className={cn(
        'w-3 h-3 contribution-cell',
        getCellClass(),
        today && 'ring-2 ring-primary ring-offset-1 ring-offset-background',
        future && 'opacity-50'
      )}
      aria-label={`${date.toDateString()}${entry ? `: ${entry.description}` : ''}`}
    />
  );
};
