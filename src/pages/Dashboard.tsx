import { useState } from 'react';
import { Header } from '@/components/Header';
import { ContributionGrid } from '@/components/ContributionGrid';
import { StatsCards } from '@/components/StatsCards';
import { DayEntryModal } from '@/components/DayEntryModal';
import { RecentActivity } from '@/components/RecentActivity';
import { AnalyticsCharts } from '@/components/AnalyticsCharts';
import { useEntries } from '@/hooks/useEntries';
import { DayEntry } from '@/types';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const {
    entries,
    entriesMap,
    getStatusForDate,
    addEntry,
    updateEntry,
    deleteEntry,
    stats,
  } = useEntries();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<DayEntry | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDayClick = (date: Date, entry?: DayEntry) => {
    setSelectedDate(date);
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const handleSaveEntry = (entryData: Omit<DayEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedEntry) {
      updateEntry(selectedEntry.id, entryData);
    } else {
      addEntry(entryData);
    }
  };

  const handleDeleteEntry = (id: string) => {
    deleteEntry(id);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Header stats={stats} />

        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="mb-8 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Your Progress Dashboard
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Track your daily achievements, build consistency, and turn your work into a visual journey.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-8">
            <StatsCards stats={stats} />
          </div>

          {/* Tabs for Grid & Analytics */}
          <Tabs defaultValue="grid" className="mb-8">
            <TabsList className="bg-secondary/50 p-1 mb-6">
              <TabsTrigger value="grid" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <LayoutGrid className="w-4 h-4 mr-2" />
                Contribution Grid
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="space-y-8">
              {/* Contribution Grid */}
              <ContributionGrid
                entriesMap={entriesMap}
                getStatusForDate={getStatusForDate}
                onDayClick={handleDayClick}
              />

              {/* Bottom Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentActivity entries={entries} />

                {/* Quick Tips Card */}
                <div className="glass-card rounded-2xl p-6 animate-fade-up" style={{ animationDelay: '300ms' }}>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Tips for Success</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary">🎯</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Set Daily Goals</p>
                        <p className="text-xs text-muted-foreground">
                          Start with small, achievable goals and build up momentum.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-warning">🔥</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Maintain Streaks</p>
                        <p className="text-xs text-muted-foreground">
                          Consistency beats intensity. Even partial progress counts!
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-success">📊</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Review Weekly</p>
                        <p className="text-xs text-muted-foreground">
                          Check your patterns to understand when you're most productive.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsCharts entries={entries} />
            </TabsContent>
          </Tabs>
        </main>

        <DayEntryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          date={selectedDate}
          entry={selectedEntry}
          onSave={handleSaveEntry}
          onDelete={handleDeleteEntry}
        />
      </div>
    </TooltipProvider>
  );
};

export default Dashboard;
