import { useMemo, useState } from 'react';
import { DayCell } from './DayCell';
import { getYearDays, organizeByWeeks, getMonthLabels, formatDate } from '@/lib/dateUtils';
import { DayEntry, Status } from '@/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ContributionGridProps {
  year?: number;
  entriesMap: Map<string, DayEntry>;
  getStatusForDate: (date: Date) => Status;
  onDayClick: (date: Date, entry?: DayEntry) => void;
}

export const ContributionGrid = ({
  year = new Date().getFullYear(),
  entriesMap,
  getStatusForDate,
  onDayClick,
}: ContributionGridProps) => {
  const days = useMemo(() => getYearDays(year), [year]);
  const weeks = useMemo(() => organizeByWeeks(days), [days]);
  const monthLabels = useMemo(() => getMonthLabels(year), [year]);

  const weekdayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  return (
    <div className="grid-container animate-fade-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">{year} Contributions</h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm contribution-0" />
            <div className="w-3 h-3 rounded-sm contribution-1" />
            <div className="w-3 h-3 rounded-sm contribution-2" />
            <div className="w-3 h-3 rounded-sm contribution-3" />
            <div className="w-3 h-3 rounded-sm contribution-4" />
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="inline-flex flex-col gap-1">
          {/* Month labels */}
          <div className="flex ml-8 mb-2">
            {monthLabels.map((month, index) => (
              <div
                key={month.name + index}
                className="text-xs text-muted-foreground"
                style={{
                  width: `${(weeks.length / 12) * 13}px`,
                  minWidth: '40px',
                }}
              >
                {month.name}
              </div>
            ))}
          </div>

          <div className="flex gap-1">
            {/* Weekday labels */}
            <div className="flex flex-col gap-1 mr-2">
              {weekdayLabels.map((label, index) => (
                <div
                  key={index}
                  className="h-3 text-xs text-muted-foreground flex items-center justify-end pr-1"
                  style={{ fontSize: '10px' }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex gap-[3px]">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIndex) => {
                    const dateStr = formatDate(day);
                    const entry = entriesMap.get(dateStr);
                    const status = getStatusForDate(day);
                    const isCurrentYear = day.getFullYear() === year;

                    return (
                      <Tooltip key={dateStr} delayDuration={0}>
                        <TooltipTrigger asChild>
                          <div>
                            <DayCell
                              date={day}
                              status={status}
                              entry={entry}
                              isActive={isCurrentYear}
                              onClick={() => onDayClick(day, entry)}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent 
                          side="top" 
                          className="bg-popover border-border text-popover-foreground max-w-xs"
                        >
                          <DayCellTooltip date={day} entry={entry} />
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DayCellTooltip = ({ date, entry }: { date: Date; entry?: DayEntry }) => {
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (!entry) {
    return (
      <div className="p-1">
        <p className="font-medium text-sm">{formattedDate}</p>
        <p className="text-xs text-muted-foreground mt-1">No activity logged</p>
      </div>
    );
  }

  return (
    <div className="p-1">
      <p className="font-medium text-sm">{formattedDate}</p>
      <div className="mt-2 space-y-1">
        <p className="text-xs">
          <span className="text-muted-foreground">Status:</span>{' '}
          <span className={
            entry.status === 'complete' ? 'text-primary' : 
            entry.status === 'partial' ? 'text-warning' : 'text-destructive'
          }>
            {entry.status === 'complete' ? '✓ Completed' : 
             entry.status === 'partial' ? '◐ Partial' : '✗ None'}
          </span>
        </p>
        {entry.description && (
          <p className="text-xs text-foreground">{entry.description}</p>
        )}
        {entry.achievement && (
          <p className="text-xs text-muted-foreground">
            Achievement: {entry.achievement}
          </p>
        )}
      </div>
    </div>
  );
};
