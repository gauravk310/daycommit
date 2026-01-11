import { useState, useCallback, useMemo } from 'react';
import { DayEntry, Status, UserStats } from '@/types';
import { formatDate, isPast, isToday } from '@/lib/dateUtils';
import { differenceInDays, parseISO, subDays } from 'date-fns';

// Demo data for showcase
const generateDemoData = (): DayEntry[] => {
  const entries: DayEntry[] = [];
  const today = new Date();
  const categories = ['coding', 'study', 'fitness', 'work', 'creative'] as const;
  const descriptions = [
    'Built new feature for the dashboard',
    'Completed algorithm practice',
    'Morning workout routine',
    'Client meeting and planning',
    'Designed new UI components',
    'Code review and refactoring',
    'Learned new framework concepts',
    'Team standup and sprint planning',
  ];
  
  // Generate random entries for the past 180 days
  for (let i = 0; i < 180; i++) {
    const date = subDays(today, i);
    const random = Math.random();
    
    // 70% chance of having an entry
    if (random > 0.3) {
      const status: Status = random > 0.5 ? 'complete' : 'partial';
      entries.push({
        id: `demo-${i}`,
        date: formatDate(date),
        status,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        achievement: `${Math.floor(Math.random() * 8) + 1} hours`,
        category: categories[Math.floor(Math.random() * categories.length)],
        duration: Math.floor(Math.random() * 480) + 60,
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
      });
    }
  }
  
  return entries;
};

export const useEntries = () => {
  const [entries, setEntries] = useState<DayEntry[]>(() => generateDemoData());

  const entriesMap = useMemo(() => {
    const map = new Map<string, DayEntry>();
    entries.forEach(entry => map.set(entry.date, entry));
    return map;
  }, [entries]);

  const getEntryForDate = useCallback((date: Date | string): DayEntry | undefined => {
    const dateStr = typeof date === 'string' ? date : formatDate(date);
    return entriesMap.get(dateStr);
  }, [entriesMap]);

  const getStatusForDate = useCallback((date: Date): Status => {
    const entry = getEntryForDate(date);
    if (entry) return entry.status;
    if (isPast(date) && !isToday(date)) return 'none';
    return 'none';
  }, [getEntryForDate]);

  const addEntry = useCallback((entry: Omit<DayEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newEntry: DayEntry = {
      ...entry,
      id: `entry-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setEntries(prev => [...prev.filter(e => e.date !== entry.date), newEntry]);
    return newEntry;
  }, []);

  const updateEntry = useCallback((id: string, updates: Partial<DayEntry>) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id 
        ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
        : entry
    ));
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  }, []);

  const stats = useMemo((): UserStats => {
    const today = new Date();
    const completedEntries = entries.filter(e => e.status === 'complete');
    const partialEntries = entries.filter(e => e.status === 'partial');
    
    // Calculate current streak
    let currentStreak = 0;
    let checkDate = today;
    
    while (true) {
      const entry = entriesMap.get(formatDate(checkDate));
      if (entry && (entry.status === 'complete' || entry.status === 'partial')) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
      } else if (isToday(checkDate)) {
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    const sortedDates = [...entriesMap.keys()].sort();
    
    for (let i = 0; i < sortedDates.length; i++) {
      const entry = entriesMap.get(sortedDates[i]);
      if (entry && (entry.status === 'complete' || entry.status === 'partial')) {
        if (i === 0) {
          tempStreak = 1;
        } else {
          const prevDate = parseISO(sortedDates[i - 1]);
          const currDate = parseISO(sortedDates[i]);
          if (differenceInDays(currDate, prevDate) === 1) {
            tempStreak++;
          } else {
            tempStreak = 1;
          }
        }
        longestStreak = Math.max(longestStreak, tempStreak);
      }
    }

    const totalDays = entries.length;
    const completedDays = completedEntries.length;
    const partialDays = partialEntries.length;
    const completionRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

    return {
      currentStreak,
      longestStreak,
      totalDays,
      completedDays,
      partialDays,
      completionRate,
    };
  }, [entries, entriesMap]);

  return {
    entries,
    entriesMap,
    getEntryForDate,
    getStatusForDate,
    addEntry,
    updateEntry,
    deleteEntry,
    stats,
  };
};
