import { format, startOfYear, endOfYear, eachDayOfInterval, getDay, startOfWeek, addDays, subDays, differenceInDays, isSameDay, parseISO } from 'date-fns';

export const getYearDays = (year: number = new Date().getFullYear()) => {
  const start = startOfYear(new Date(year, 0, 1));
  const end = endOfYear(new Date(year, 0, 1));
  return eachDayOfInterval({ start, end });
};

export const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy-MM-dd');
};

export const formatDisplayDate = (date: Date | string) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMMM d, yyyy');
};

export const formatShortDate = (date: Date | string) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d');
};

export const getWeekdayName = (day: number) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[day];
};

export const getMonthLabels = (year: number = new Date().getFullYear()) => {
  const months = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(year, i, 1);
    const firstDay = startOfWeek(date);
    const weekIndex = Math.floor(differenceInDays(date, startOfYear(new Date(year, 0, 1))) / 7);
    months.push({
      name: format(date, 'MMM'),
      weekIndex,
    });
  }
  return months;
};

export const organizeByWeeks = (days: Date[]) => {
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  // Add empty cells for the first week if it doesn't start on Sunday
  const firstDayOfWeek = getDay(days[0]);
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(subDays(days[0], firstDayOfWeek - i));
  }
  
  days.forEach((day) => {
    currentWeek.push(day);
    if (getDay(day) === 6) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  
  // Add remaining days
  if (currentWeek.length > 0) {
    // Fill the last week
    while (currentWeek.length < 7) {
      currentWeek.push(addDays(currentWeek[currentWeek.length - 1], 1));
    }
    weeks.push(currentWeek);
  }
  
  return weeks;
};

export const isToday = (date: Date | string) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isSameDay(d, new Date());
};

export const isPast = (date: Date | string) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
};

export const isFuture = (date: Date | string) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return d > today;
};
