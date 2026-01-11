import { GitCommitHorizontal, Flame, BarChart3, Plus, LogOut } from 'lucide-react';
import { UserStats } from '@/types';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface HeaderProps {
  stats: UserStats;
}

export const Header = ({ stats }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center glow-primary">
                <GitCommitHorizontal className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">DayCommit</h1>
                <p className="text-xs text-muted-foreground">Track your daily progress</p>
              </div>
            </button>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1 ml-4">
              <button
                onClick={() => navigate('/')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === '/'
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                )}
              >
                Home
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === '/dashboard'
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                )}
              >
                Dashboard
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50">
                <Flame className="w-5 h-5 text-warning" />
                <span className="font-mono font-semibold text-foreground">{stats.currentStreak}</span>
                <span className="text-sm text-muted-foreground hidden lg:inline">day streak</span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span className="font-mono font-semibold text-foreground">{stats.completionRate}%</span>
                <span className="text-sm text-muted-foreground hidden lg:inline">completion</span>
              </div>
            </div>

            {user && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-foreground">{user.name}</span>
              </div>
            )}

            {user && (
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="hidden sm:flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
