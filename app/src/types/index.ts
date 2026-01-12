export type Status = 'none' | 'partial' | 'complete';

export interface DayEntry {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  status: Status;
  description: string;
  achievement: string;
  duration?: number; // in minutes
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  completedDays: number;
  partialDays: number;
  completionRate: number;
}
