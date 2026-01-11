import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Category, Status, CATEGORIES } from '@/types';
import { formatDate } from '@/lib/dateUtils';
import { CheckCircle2, CircleDot, XCircle, ArrowLeft, GitCommitHorizontal, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, isAfter, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface DayEntry {
  date: string;
  status: Status;
  description: string;
  achievement: string;
  category: Category;
  duration: number;
}

const Commit = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [entries, setEntries] = useState<DayEntry[]>([]);

  // Form state
  const [status, setStatus] = useState<Status>('complete');
  const [description, setDescription] = useState('');
  const [achievement, setAchievement] = useState('');
  const [category, setCategory] = useState<Category>('coding');
  const [duration, setDuration] = useState('60');

  useEffect(() => {
    // Load entries from localStorage
    const storedEntries = JSON.parse(localStorage.getItem('daycommit-entries') || '[]');
    setEntries(storedEntries);
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEntryForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return entries.find(entry => entry.date === dateStr);
  };

  const getDayStatus = (date: Date) => {
    const entry = getEntryForDate(date);
    if (!entry) return null;
    return entry.status;
  };

  const handleDayClick = (date: Date) => {
    if (isSameDay(date, today)) {
      setSelectedDate(date);
      const existingEntry = getEntryForDate(date);
      if (existingEntry) {
        setStatus(existingEntry.status);
        setDescription(existingEntry.description);
        setAchievement(existingEntry.achievement);
        setCategory(existingEntry.category);
        setDuration(existingEntry.duration.toString());
      } else {
        // Reset form
        setStatus('complete');
        setDescription('');
        setAchievement('');
        setCategory('coding');
        setDuration('60');
      }
      setShowModal(true);
    }
  };

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

    if (!selectedDate) return;

    const entry = {
      id: `entry-${Date.now()}`,
      date: formatDate(selectedDate),
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
    const newEntries = [...filteredEntries, entry];
    localStorage.setItem('daycommit-entries', JSON.stringify(newEntries));
    setEntries(newEntries);

    toast({
      title: "Commit saved! 🎉",
      description: `Your progress for ${format(selectedDate, 'MMMM d')} has been logged.`,
    });

    setShowModal(false);
    setSelectedDate(null);
  };

  const getDayClasses = (date: Date) => {
    const isToday = isSameDay(date, today);
    const isPast = isBefore(date, today);
    const isFuture = isAfter(date, today);
    const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
    const dayStatus = getDayStatus(date);

    let classes = 'calendar-day aspect-square flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-200 relative ';

    if (!isCurrentMonth) {
      classes += 'opacity-30 ';
    }

    if (isFuture) {
      classes += 'border-border/30 bg-secondary/20 cursor-not-allowed opacity-50 ';
    } else if (isToday) {
      classes += 'border-primary bg-primary/10 cursor-pointer hover:bg-primary/20 hover:scale-105 ring-2 ring-primary/50 ';
    } else if (isPast) {
      if (dayStatus) {
        if (dayStatus === 'complete') {
          classes += 'border-success bg-success/20 ';
        } else if (dayStatus === 'partial') {
          classes += 'border-warning bg-warning/20 ';
        } else if (dayStatus === 'none') {
          classes += 'border-destructive bg-destructive/20 ';
        }
      } else {
        classes += 'border-border/50 bg-secondary/50 ';
      }
      classes += 'cursor-default ';
    }

    return classes;
  };

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
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
