import { DayEntry, CATEGORIES } from '@/types';
import { formatShortDate } from '@/lib/dateUtils';
import { CheckCircle2, CircleDot, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecentActivityProps {
  entries: DayEntry[];
}

export const RecentActivity = ({ entries }: RecentActivityProps) => {
  const recentEntries = [...entries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getCategoryInfo = (category: string) => {
    return CATEGORIES.find(c => c.value === category) || CATEGORIES[5];
  };

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
      
      <div className="space-y-3">
        {recentEntries.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No entries yet. Start logging your days!
          </p>
        ) : (
          recentEntries.map((entry, index) => {
            const categoryInfo = getCategoryInfo(entry.category);
            
            return (
              <div
                key={entry.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors animate-slide-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                  entry.status === 'complete' ? 'bg-primary/20' : 'bg-warning/20'
                )}>
                  {entry.status === 'complete' ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <CircleDot className="w-5 h-5 text-warning" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground truncate">
                      {entry.description || 'No description'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      {categoryInfo.icon} {categoryInfo.label}
                    </span>
                    {entry.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {Math.floor(entry.duration / 60)}h {entry.duration % 60}m
                      </span>
                    )}
                  </div>
                </div>
                
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {formatShortDate(entry.date)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
