import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { DayEntry } from '@/types';
import { format, subDays, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

interface AnalyticsChartsProps {
  entries: DayEntry[];
}

export const AnalyticsCharts = ({ entries }: AnalyticsChartsProps) => {
  // Weekly activity data (last 12 weeks)
  const weeklyData = useMemo(() => {
    const weeks = [];
    const today = new Date();

    for (let i = 11; i >= 0; i--) {
      const weekStart = startOfWeek(subDays(today, i * 7));
      const weekEnd = endOfWeek(subDays(today, i * 7));
      const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

      let completed = 0;
      let partial = 0;
      let totalMinutes = 0;

      weekDays.forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const entry = entries.find(e => e.date === dateStr);
        if (entry) {
          if (entry.status === 'complete') completed++;
          else if (entry.status === 'partial') partial++;
          totalMinutes += entry.duration || 0;
        }
      });

      weeks.push({
        week: format(weekStart, 'MMM d'),
        completed,
        partial,
        hours: Math.round(totalMinutes / 60 * 10) / 10,
      });
    }

    return weeks;
  }, [entries]);



  // Daily hours for last 30 days
  const dailyHours = useMemo(() => {
    const data = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const entry = entries.find(e => e.date === dateStr);

      data.push({
        date: format(date, 'MMM d'),
        hours: entry ? Math.round((entry.duration || 0) / 60 * 10) / 10 : 0,
        status: entry?.status || 'none',
      });
    }

    return data;
  }, [entries]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-xl">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} className="text-xs text-muted-foreground">
              {item.name}: {item.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Progress Chart */}
      <div className="glass-card rounded-2xl p-6 animate-fade-up">
        <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Progress</h3>
        <p className="text-sm text-muted-foreground mb-4">Completed vs partial days per week</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis
                dataKey="week"
                tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }}
                axisLine={{ stroke: 'hsl(217 33% 17%)' }}
              />
              <YAxis
                tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }}
                axisLine={{ stroke: 'hsl(217 33% 17%)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="completed" stackId="a" fill="hsl(142 76% 45%)" radius={[0, 0, 0, 0]} name="Completed" />
              <Bar dataKey="partial" stackId="a" fill="hsl(38 92% 50%)" radius={[4, 4, 0, 0]} name="Partial" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Hours Trend */}
      <div className="glass-card rounded-2xl p-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
        <h3 className="text-lg font-semibold text-foreground mb-4">Daily Hours (30 days)</h3>
        <p className="text-sm text-muted-foreground mb-4">Time invested each day</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyHours}>
              <defs>
                <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142 76% 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142 76% 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }}
                axisLine={{ stroke: 'hsl(217 33% 17%)' }}
                interval={6}
              />
              <YAxis
                tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }}
                axisLine={{ stroke: 'hsl(217 33% 17%)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="hsl(142 76% 45%)"
                strokeWidth={2}
                fill="url(#hoursGradient)"
                name="Hours"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>



      {/* Hours by Week */}
      <div className="glass-card rounded-2xl p-6 animate-fade-up" style={{ animationDelay: '300ms' }}>
        <h3 className="text-lg font-semibold text-foreground mb-4">Hours by Week</h3>
        <p className="text-sm text-muted-foreground mb-4">Total hours invested weekly</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="weeklyHoursGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="week"
                tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }}
                axisLine={{ stroke: 'hsl(217 33% 17%)' }}
              />
              <YAxis
                tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }}
                axisLine={{ stroke: 'hsl(217 33% 17%)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="hsl(217 91% 60%)"
                strokeWidth={2}
                fill="url(#weeklyHoursGradient)"
                name="Hours"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
