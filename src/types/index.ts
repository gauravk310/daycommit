export type Category = 'coding' | 'study' | 'fitness' | 'work' | 'creative' | 'other';

export type Status = 'none' | 'partial' | 'complete';

export interface DayEntry {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  status: Status;
  description: string;
  achievement: string;
  category: Category;
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

export const CATEGORIES: { value: Category; label: string; icon: string; color: string }[] = [
  { value: 'coding', label: 'Coding', icon: '💻', color: 'hsl(142 76% 45%)' },
  { value: 'study', label: 'Study', icon: '📚', color: 'hsl(217 91% 60%)' },
  { value: 'fitness', label: 'Fitness', icon: '💪', color: 'hsl(0 72% 51%)' },
  { value: 'work', label: 'Work', icon: '💼', color: 'hsl(38 92% 50%)' },
  { value: 'creative', label: 'Creative', icon: '🎨', color: 'hsl(280 65% 60%)' },
  { value: 'other', label: 'Other', icon: '✨', color: 'hsl(180 60% 50%)' },
];
