import { Flame, Trophy, Calendar, CheckCircle2, CircleDot, TrendingUp } from 'lucide-react';
import { UserStats } from '@/types';
import { cn } from '@/lib/utils';

interface StatsCardsProps {
  stats: UserStats;
}

const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  subValue,
  color,
  delay 
}: { 
  icon: React.ElementType;
  label: string; 
  value: string | number; 
  subValue?: string;
  color: string;
  delay: number;
}) => (
  <div 
    className="stat-card animate-fade-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-3xl font-bold font-mono text-foreground">{value}</p>
        {subValue && (
          <p className="text-xs text-muted-foreground mt-1">{subValue}</p>
        )}
      </div>
      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', color)}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

export const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        icon={Flame}
        label="Current Streak"
        value={stats.currentStreak}
        subValue="consecutive days"
        color="bg-warning/20 text-warning"
        delay={0}
      />
      <StatCard
        icon={Trophy}
        label="Longest Streak"
        value={stats.longestStreak}
        subValue="personal best"
        color="bg-primary/20 text-primary"
        delay={100}
      />
      <StatCard
        icon={TrendingUp}
        label="Completion Rate"
        value={`${stats.completionRate}%`}
        subValue="of logged days"
        color="bg-success/20 text-success"
        delay={200}
      />
      <StatCard
        icon={Calendar}
        label="Total Days"
        value={stats.totalDays}
        subValue="entries logged"
        color="bg-secondary text-foreground"
        delay={300}
      />
      <StatCard
        icon={CheckCircle2}
        label="Completed"
        value={stats.completedDays}
        subValue="full days"
        color="bg-primary/20 text-primary"
        delay={400}
      />
      <StatCard
        icon={CircleDot}
        label="Partial"
        value={stats.partialDays}
        subValue="partial progress"
        color="bg-warning/20 text-warning"
        delay={500}
      />
    </div>
  );
};
