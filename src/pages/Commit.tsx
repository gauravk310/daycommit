import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Category, Status, CATEGORIES } from '@/types';
import { formatDate, formatDisplayDate } from '@/lib/dateUtils';
import { CheckCircle2, CircleDot, XCircle, ArrowLeft, GitCommitHorizontal, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const Commit = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [status, setStatus] = useState<Status>('complete');
  const [description, setDescription] = useState('');
  const [achievement, setAchievement] = useState('');
  const [category, setCategory] = useState<Category>('coding');
  const [duration, setDuration] = useState('60');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      toast({
        title: "Description required",
        description: "Please describe what you worked on today.",
        variant: "destructive",
      });
      return;
    }

    // Store in localStorage for now (will be replaced with database)
    const entry = {
      id: `entry-${Date.now()}`,
      date: formatDate(date),
      status,
      description: description.trim(),
      achievement: achievement.trim(),
      category,
      duration: parseInt(duration) || 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existingEntries = JSON.parse(localStorage.getItem('daycommit-entries') || '[]');
    const filteredEntries = existingEntries.filter((e: any) => e.date !== entry.date);
    localStorage.setItem('daycommit-entries', JSON.stringify([...filteredEntries, entry]));

    toast({
      title: "Commit saved! 🎉",
      description: `Your progress for ${format(date, 'MMMM d')} has been logged.`,
    });

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className="hover:bg-secondary"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center glow-primary">
                <GitCommitHorizontal className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">New Commit</h1>
                <p className="text-xs text-muted-foreground">Log your daily progress</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Commit Message Card */}
          <div className="glass-card rounded-2xl p-8 animate-fade-up">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">What did you accomplish?</h2>
            </div>

            {/* Date Picker */}
            <div className="mb-6">
              <Label className="text-sm font-medium mb-2 block">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-secondary border-border"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, 'EEEE, MMMM d, yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    disabled={(d) => d > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Description */}
            <div className="mb-6">
              <Label htmlFor="description" className="text-sm font-medium mb-2 block">
                Commit Message *
              </Label>
              <Textarea
                id="description"
                placeholder="e.g., Completed React tutorial, built dashboard component..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-secondary border-border resize-none text-lg"
                rows={4}
              />
            </div>

            {/* Achievement */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="achievement" className="text-sm font-medium mb-2 block">
                  Achievement
                </Label>
                <Input
                  id="achievement"
                  placeholder="e.g., 3 hours, 5 tasks"
                  value={achievement}
                  onChange={(e) => setAchievement(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <Label htmlFor="duration" className="text-sm font-medium mb-2 block">
                  Duration (minutes)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="60"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>
            </div>
          </div>

          {/* Status Selection */}
          <div className="glass-card rounded-2xl p-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
            <h3 className="text-lg font-semibold text-foreground mb-4">Progress Status</h3>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setStatus('complete')}
                className={cn(
                  'flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all',
                  status === 'complete' 
                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' 
                    : 'border-border hover:border-primary/50'
                )}
              >
                <CheckCircle2 className={cn(
                  'w-10 h-10',
                  status === 'complete' ? 'text-primary' : 'text-muted-foreground'
                )} />
                <span className="text-sm font-medium">Complete</span>
                <span className="text-xs text-muted-foreground">Fully done</span>
              </button>
              
              <button
                type="button"
                onClick={() => setStatus('partial')}
                className={cn(
                  'flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all',
                  status === 'partial' 
                    ? 'border-warning bg-warning/10 shadow-lg shadow-warning/20' 
                    : 'border-border hover:border-warning/50'
                )}
              >
                <CircleDot className={cn(
                  'w-10 h-10',
                  status === 'partial' ? 'text-warning' : 'text-muted-foreground'
                )} />
                <span className="text-sm font-medium">Partial</span>
                <span className="text-xs text-muted-foreground">Some progress</span>
              </button>
              
              <button
                type="button"
                onClick={() => setStatus('none')}
                className={cn(
                  'flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all',
                  status === 'none' 
                    ? 'border-destructive bg-destructive/10 shadow-lg shadow-destructive/20' 
                    : 'border-border hover:border-destructive/50'
                )}
              >
                <XCircle className={cn(
                  'w-10 h-10',
                  status === 'none' ? 'text-destructive' : 'text-muted-foreground'
                )} />
                <span className="text-sm font-medium">Rest Day</span>
                <span className="text-xs text-muted-foreground">No work</span>
              </button>
            </div>
          </div>

          {/* Category Selection */}
          <div className="glass-card rounded-2xl p-8 animate-fade-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-lg font-semibold text-foreground mb-4">Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left',
                    category === cat.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 glow-primary animate-fade-up"
            style={{ animationDelay: '300ms' }}
          >
            <GitCommitHorizontal className="w-5 h-5 mr-2" />
            Save Commit
          </Button>
        </form>
      </main>
    </div>
  );
};

export default Commit;
