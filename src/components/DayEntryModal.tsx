import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DayEntry, Category, Status, CATEGORIES } from '@/types';
import { formatDisplayDate, formatDate } from '@/lib/dateUtils';
import { CheckCircle2, CircleDot, XCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DayEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  entry?: DayEntry;
  onSave: (entry: Omit<DayEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDelete?: (id: string) => void;
}

export const DayEntryModal = ({
  isOpen,
  onClose,
  date,
  entry,
  onSave,
  onDelete,
}: DayEntryModalProps) => {
  const [status, setStatus] = useState<Status>('complete');
  const [description, setDescription] = useState('');
  const [achievement, setAchievement] = useState('');
  const [category, setCategory] = useState<Category>('coding');
  const [duration, setDuration] = useState('60');

  useEffect(() => {
    if (entry) {
      setStatus(entry.status);
      setDescription(entry.description);
      setAchievement(entry.achievement);
      setCategory(entry.category);
      setDuration(String(entry.duration || 60));
    } else {
      setStatus('complete');
      setDescription('');
      setAchievement('');
      setCategory('coding');
      setDuration('60');
    }
  }, [entry, isOpen]);

  const handleSave = () => {
    if (!date) return;
    
    onSave({
      date: formatDate(date),
      status,
      description,
      achievement,
      category,
      duration: parseInt(duration) || 60,
    });
    onClose();
  };

  const handleDelete = () => {
    if (entry && onDelete) {
      onDelete(entry.id);
      onClose();
    }
  };

  if (!date) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {entry ? 'Edit Entry' : 'Log Your Day'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {formatDisplayDate(date)}
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">How was your day?</Label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setStatus('complete')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  status === 'complete' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                )}
              >
                <CheckCircle2 className={cn(
                  'w-8 h-8',
                  status === 'complete' ? 'text-primary' : 'text-muted-foreground'
                )} />
                <span className="text-sm font-medium">Complete</span>
              </button>
              
              <button
                onClick={() => setStatus('partial')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  status === 'partial' 
                    ? 'border-warning bg-warning/10' 
                    : 'border-border hover:border-warning/50'
                )}
              >
                <CircleDot className={cn(
                  'w-8 h-8',
                  status === 'partial' ? 'text-warning' : 'text-muted-foreground'
                )} />
                <span className="text-sm font-medium">Partial</span>
              </button>
              
              <button
                onClick={() => setStatus('none')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  status === 'none' 
                    ? 'border-destructive bg-destructive/10' 
                    : 'border-border hover:border-destructive/50'
                )}
              >
                <XCircle className={cn(
                  'w-8 h-8',
                  status === 'none' ? 'text-destructive' : 'text-muted-foreground'
                )} />
                <span className="text-sm font-medium">None</span>
              </button>
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Category</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all',
                    category === cat.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  )}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              What did you work on?
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your activities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-secondary border-border resize-none"
              rows={3}
            />
          </div>

          {/* Achievement */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="achievement" className="text-sm font-medium">
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
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">
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

        <DialogFooter className="flex gap-2">
          {entry && onDelete && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="mr-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            {entry ? 'Update' : 'Save Entry'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
