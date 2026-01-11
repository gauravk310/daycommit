import { useState, useCallback, useMemo, useEffect } from 'react';
import { DayEntry, Status, UserStats } from '@/types';
import { formatDate, isPast, isToday } from '@/lib/dateUtils';
import { apiService } from '@/services/api';

// For now, using a hardcoded userId. In production, this should come from authentication
const CURRENT_USER_ID = 'user_default';

export const useEntries = () => {
  const [entries, setEntries] = useState<DayEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch entries from MongoDB
  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getEntries(CURRENT_USER_ID);

      if (response.success && response.data) {
        // Transform MongoDB entries to match our DayEntry interface
        const transformedEntries = (response.data as any[]).map((entry: any) => ({
          id: entry._id,
          date: entry.date,
          status: entry.status,
          description: entry.description,
          achievement: entry.achievement,
          duration: entry.duration,
          createdAt: entry.createdAt,
          updatedAt: entry.updatedAt,
        }));
        setEntries(transformedEntries);
      }
    } catch (err) {
      console.error('Error fetching entries:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch entries');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

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

  const addEntry = useCallback(async (entry: Omit<DayEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await apiService.createEntry({
        userId: CURRENT_USER_ID,
        date: entry.date,
        status: entry.status,
        description: entry.description,
        achievement: entry.achievement,
        duration: entry.duration,
      });

      if (response.success && response.data) {
        const newEntry: DayEntry = {
          id: (response.data as any)._id,
          date: (response.data as any).date,
          status: (response.data as any).status,
          description: (response.data as any).description,
          achievement: (response.data as any).achievement,
          duration: (response.data as any).duration,
          createdAt: (response.data as any).createdAt,
          updatedAt: (response.data as any).updatedAt,
        };

        setEntries(prev => [...prev.filter(e => e.date !== entry.date), newEntry]);
        return newEntry;
      }
    } catch (err) {
      console.error('Error adding entry:', err);
      setError(err instanceof Error ? err.message : 'Failed to add entry');
      throw err;
    }
  }, []);

  const updateEntry = useCallback(async (id: string, updates: Partial<DayEntry>) => {
    try {
      const response = await apiService.updateEntry(id, {
        status: updates.status,
        description: updates.description,
        achievement: updates.achievement,
        duration: updates.duration,
      });

      if (response.success && response.data) {
        setEntries(prev => prev.map(entry =>
          entry.id === id
            ? {
              ...entry,
              ...(response.data as any),
              id: (response.data as any)._id,
            }
            : entry
        ));
      }
    } catch (err) {
      console.error('Error updating entry:', err);
      setError(err instanceof Error ? err.message : 'Failed to update entry');
      throw err;
    }
  }, []);

  const deleteEntry = useCallback(async (id: string) => {
    try {
      const response = await apiService.deleteEntry(id);

      if (response.success) {
        setEntries(prev => prev.filter(entry => entry.id !== id));
      }
    } catch (err) {
      console.error('Error deleting entry:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete entry');
      throw err;
    }
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
        checkDate = new Date(checkDate);
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (isToday(checkDate)) {
        checkDate = new Date(checkDate);
        checkDate.setDate(checkDate.getDate() - 1);
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
          const prevDate = new Date(sortedDates[i - 1]);
          const currDate = new Date(sortedDates[i]);
          const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
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
    loading,
    error,
    refetch: fetchEntries,
  };
};
