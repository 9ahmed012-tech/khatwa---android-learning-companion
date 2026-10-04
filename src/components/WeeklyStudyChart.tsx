import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LabelList,
} from 'recharts';
import { BookOpen, Clock, TrendingUp, CheckCircle, Zap } from 'lucide-react';
import { DailyStudyStat } from '../types';

interface WeeklyStudyChartProps {
  stats?: DailyStudyStat[];
  todayMinutes?: number;
  todayLessons?: number;
}

const DEFAULT_WEEKLY_STATS: DailyStudyStat[] = [
  { dayNameAr: 'الأحد', dateString: '2026-09-27', studyMinutes: 45, completedLessonsCount: 2 },
  { dayNameAr: 'الإثنين', dateString: '2026-09-28', studyMinutes: 60, completedLessonsCount: 3 },
  { dayNameAr: 'الثلاثاء', dateString: '2026-09-29', studyMinutes: 30, completedLessonsCount: 1 },
  { dayNameAr: 'الأربعاء', dateString: '2026-09-30', studyMinutes: 50, completedLessonsCount: 2 },
  { dayNameAr: 'الخميس', dateString: '2026-10-01', studyMinutes: 40, completedLessonsCount: 2 },
  { dayNameAr: 'الجمعة', dateString: '2026-10-02', studyMinutes: 25, completedLessonsCount: 1 },
  { dayNameAr: 'السبت', dateString: '2026-10-03', studyMinutes: 20, completedLessonsCount: 2, isToday: true },
];

export const WeeklyStudyChart: React.FC<WeeklyStudyChartProps> = ({
  stats = DEFAULT_WEEKLY_STATS,
  todayMinutes,
  todayLessons,
}) => {
  // Default to 'lessons' as requested to highlight completed lessons progress
  const [metric, setMetric] = useState<'lessons' | 'minutes'>('lessons');

  // Dynamically overlay today's active progress on the current day
  const chartData = stats.map((item, index) => {
    const isToday = item.isToday || index === stats.length - 1;
    return {
      ...item,
      displayLessons: isToday && todayLessons !== undefined ? Math.max(item.completedLessonsCount, todayLessons) : item.completedLessonsCount,
      displayMinutes: isToday && todayMinutes !== undefined ? Math.max(item.studyMinutes, todayMinutes) : item.studyMinutes,
      isToday,
    };
  });

  // Calculate totals and statistics
  const totalLessons = chartData.reduce((acc, curr) => acc + curr.displayLessons, 0);
  const totalMinutes = chartData.reduce((acc, curr) => acc + curr.displayMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const dailyAverageLessons = (totalLessons / chartData.length).toFixed(1);

  // Custom RTL Tooltip styled with Khatwa's brand palette
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-emerald-500/40 rounded-2xl p-3 shadow-2xl text-right z-50 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 mb-1.5 border-b border-slate-800 pb-1">
            <span className="text-xs font-bold text-slate-100">{data.dayNameAr}</span>
            {data.isToday && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full font-semibold">
                اليوم
              </span>
            )}
          </div>
          <div className="text-[11px] space-y-1">
            <p className="text-emerald-400 font-semibold flex items-center justify-between gap-3">
              <span>الدروس المكتملة:</span>
              <span className="font-mono font-bold text-slate-100">{data.displayLessons} دروس</span>
            </p>
            <p className="text-teal-300 font-medium flex items-center justify-between gap-3">
              <span>وقت الاستذكار:</span>
              <span className="font-mono text-slate-300">{data.displayMinutes} دقيقة</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="p-4 rounded-3xl bg-slate-800/40 border border-slate-700/60 space-y-3.5 shadow-sm">
      {/* Header with Title and Segmented Metric Filter */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-bold shadow-sm">
            <BookOpen size={16} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100">إنجاز الدروس خلال 7 أيام</h3>
            <span className="text-[10px] text-slate-400 block -mt-0.5">مخطط المتابعة الأسبوعي (Recharts)</span>
          </div>
        </div>

        {/* Segmented Control Buttons (Zero-pill discipline) */}
        <div className="flex items-center p-0.5 bg-slate-900/90 rounded-xl border border-slate-700/60">
          <button
            onClick={() => setMetric('lessons')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              metric === 'lessons'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle size={12} />
            <span>الدروس المكتملة</span>
          </button>

          <button
            onClick={() => setMetric('minutes')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              metric === 'minutes'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock size={12} />
            <span>الوقت (دقائق)</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Summary Cards in Brand Colors */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-right">
          <span className="text-[10px] text-emerald-400/90 font-medium block">إجمالي الدروس</span>
          <span className="text-sm font-black text-emerald-400 font-mono">
            {totalLessons}
          </span>
          <span className="text-[9px] text-slate-400 block">دروس منجزة</span>
        </div>

        <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 text-right">
          <span className="text-[10px] text-slate-400 block">المعدل اليومي</span>
          <span className="text-sm font-black text-amber-400 font-mono">
            {dailyAverageLessons}
          </span>
          <span className="text-[9px] text-slate-400 block">درس / يوم</span>
        </div>

        <div className="p-2.5 rounded-2xl bg-teal-950/20 border border-teal-500/30 text-right">
          <span className="text-[10px] text-teal-400/90 font-medium block">وقت الاستذكار</span>
          <span className="text-sm font-black text-teal-300 font-mono">
            {totalHours} س
          </span>
          <span className="text-[9px] text-slate-400 block">({totalMinutes} دقيقة)</span>
        </div>
      </div>

      {/* Recharts Bar Chart Container */}
      <div className="w-full h-48 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 18, right: 4, left: -24, bottom: 0 }}>
            {/* Brand Gradients for Bars */}
            <defs>
              {/* Primary Emerald/Teal Gradient for Completed Lessons */}
              <linearGradient id="khatwaLessonsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                <stop offset="100%" stopColor="#0d9488" stopOpacity={0.85} />
              </linearGradient>

              {/* Glowing Highlight Gradient for Today */}
              <linearGradient id="khatwaTodayGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
                <stop offset="100%" stopColor="#059669" stopOpacity={0.95} />
              </linearGradient>

              {/* Alternative Gradient for Study Minutes */}
              <linearGradient id="khatwaMinutesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity={1} />
                <stop offset="100%" stopColor="#0f766e" stopOpacity={0.8} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="dayNameAr"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b' }}
              allowDecimals={false}
              domain={[0, metric === 'lessons' ? 'dataMax + 1' : 'dataMax + 15']}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }} />

            <Bar
              dataKey={metric === 'lessons' ? 'displayLessons' : 'displayMinutes'}
              radius={[8, 8, 0, 0]}
              maxBarSize={32}
              animationDuration={800}
            >
              {/* Values shown clearly above bars */}
              <LabelList
                dataKey={metric === 'lessons' ? 'displayLessons' : 'displayMinutes'}
                position="top"
                fill="#cbd5e1"
                fontSize={10}
                formatter={(val: any) => (metric === 'lessons' ? `${val}` : `${val}د`)}
              />

              {chartData.map((entry, index) => {
                const isToday = entry.isToday;
                let fillUrl = 'url(#khatwaLessonsGradient)';
                if (metric === 'lessons') {
                  fillUrl = isToday ? 'url(#khatwaTodayGradient)' : 'url(#khatwaLessonsGradient)';
                } else {
                  fillUrl = isToday ? 'url(#khatwaTodayGradient)' : 'url(#khatwaMinutesGradient)';
                }

                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={fillUrl}
                    stroke={isToday ? '#6ee7b7' : 'transparent'}
                    strokeWidth={isToday ? 1.5 : 0}
                    className="transition-all hover:opacity-90"
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info & Legend */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-700/40">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block ring-2 ring-emerald-500/20" />
          <span className="font-medium text-slate-300">العمود المميز يمثل نشاط اليوم</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 font-medium">
          <TrendingUp size={12} />
          <span>التزام أسبوعي مستمر</span>
        </div>
      </div>
    </section>
  );
};
