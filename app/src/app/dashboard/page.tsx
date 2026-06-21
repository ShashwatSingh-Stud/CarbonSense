'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Flame, TrendingDown, TrendingUp, Sparkles } from 'lucide-react';
import { useApp } from '@/lib/store';
import { CarbonGauge } from '@/components/ui/carbon-gauge';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { CarbonEquivalentDisplay } from '@/components/ui/carbon-equivalent';
import { BudgetBar } from '@/components/ui/budget-bar';
import { Navbar } from '@/components/layout/navbar';
import { FabButton } from '@/components/layout/fab-button';
import { categoryInfo } from '@/lib/utils';

// Generate mock weekly data for demo
function generateWeeklyData(logs: { loggedAt: string; co2Kg: number }[]) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const now = new Date();
  const dayOfWeek = now.getDay();

  return days.map((day, i) => {
    const adjustedIndex = i === 6 ? 0 : i + 1; // Mon=1, Sun=0
    const dayDate = new Date(now);
    dayDate.setDate(now.getDate() - ((dayOfWeek === 0 ? 7 : dayOfWeek) - adjustedIndex - (adjustedIndex === 0 ? -7 : 0)));
    dayDate.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dayDate);
    dayEnd.setHours(23, 59, 59, 999);

    const dayLogs = logs.filter((l) => {
      const d = new Date(l.loggedAt);
      return d >= dayDate && d <= dayEnd;
    });

    const thisWeek = dayLogs.reduce((s, l) => s + l.co2Kg, 0);
    // Simulated last week data for comparison
    const lastWeek = Math.max(0.5, thisWeek * (0.8 + Math.random() * 0.5));

    return {
      day,
      thisWeek: Math.round(thisWeek * 100) / 100,
      lastWeek: Math.round(lastWeek * 100) / 100,
    };
  });
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) => {
  if (!active || !payload) return null;
  const thisWeek = payload.find((p) => p.dataKey === 'thisWeek');
  const lastWeek = payload.find((p) => p.dataKey === 'lastWeek');
  const diff = thisWeek && lastWeek ? thisWeek.value - lastWeek.value : 0;

  return (
    <div
      className="glass-card-static p-3 text-xs"
      style={{ minWidth: '140px' }}
    >
      <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{label}</div>
      <div className="flex justify-between">
        <span style={{ color: 'var(--forest-green)' }}>This week:</span>
        <span className="font-mono-data">{thisWeek?.value.toFixed(1)} kg</span>
      </div>
      <div className="flex justify-between">
        <span style={{ color: 'var(--text-muted)' }}>Last week:</span>
        <span className="font-mono-data">{lastWeek?.value.toFixed(1)} kg</span>
      </div>
      {diff !== 0 && (
        <div className="flex items-center gap-1 mt-1 pt-1" style={{ borderTop: '1px solid var(--border-color)' }}>
          {diff < 0 ? (
            <TrendingDown className="w-3 h-3" style={{ color: 'var(--gauge-green)' }} />
          ) : (
            <TrendingUp className="w-3 h-3" style={{ color: 'var(--carbon-red)' }} />
          )}
          <span
            className="font-mono-data font-semibold"
            style={{ color: diff < 0 ? 'var(--gauge-green)' : 'var(--carbon-red)' }}
          >
            {diff > 0 ? '+' : ''}{diff.toFixed(1)} kg
          </span>
        </div>
      )}
    </div>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const {
    state,
    todayTotal,
    weeklyTotal,
    monthlyTotal,
    currentStreak,
    categoryBreakdown,
    budgetUsedPercent,
  } = useApp();

  useEffect(() => {
    if (!state.isAuthenticated) {
      router.replace('/');
    } else if (!state.user?.onboardingCompleted) {
      router.replace('/onboarding');
    }
  }, [state.isAuthenticated, state.user, router]);

  if (!state.user) return null;

  const weeklyData = generateWeeklyData(state.logs);
  const dailyMax = state.user.baselineFootprint?.dailyKg
    ? state.user.baselineFootprint.dailyKg * 1.5
    : 10;

  // Nudge message
  const nudgeMessages = [
    `🚇 Try taking the metro today — save ~2.3 kg CO₂ vs driving!`,
    `🥬 A veg meal today could save you 1.6 kg CO₂ compared to chicken biryani.`,
    `💡 Switch off that AC for 2 hours — save ~2.5 kg CO₂.`,
    `🚶 Walk for short trips under 2 km — zero emissions and good exercise!`,
    `☕ Making chai at home? It's just 0.05 kg CO₂ — vs 0.3 kg for a café latte.`,
  ];
  const todayNudge = nudgeMessages[new Date().getDay() % nudgeMessages.length];

  return (
    <>
      <Navbar />
      <FabButton />

      <div className="page-container" style={{ paddingTop: '72px' }}>
        {/* Greeting */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-xl font-bold">
            Hello, {state.user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
        </motion.div>

        {/* Nudge Banner */}
        <motion.div
          className="p-3 rounded-xl mb-5 flex items-start gap-2"
          style={{
            background: 'rgba(var(--deep-teal-rgb), 0.08)',
            border: '1px solid rgba(var(--deep-teal-rgb), 0.15)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--deep-teal)' }} />
          <span className="text-xs" style={{ color: 'var(--deep-teal)' }}>
            {todayNudge}
          </span>
        </motion.div>

        {/* Carbon Gauge */}
        <motion.div
          className="flex flex-col items-center mb-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <CarbonGauge
            value={todayTotal}
            max={dailyMax}
            label="today's CO₂"
            size={220}
          />
        </motion.div>

        {/* Carbon Equivalent Translator */}
        <motion.div
          className="mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <CarbonEquivalentDisplay co2Kg={todayTotal || 0.5} />
        </motion.div>

        {/* Streak */}
        <motion.div
          className="flex items-center justify-center gap-2 mb-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: 'rgba(var(--forest-green-rgb), 0.08)',
              border: '1px solid var(--border-color)',
            }}
          >
            <Flame className="w-4 h-4" style={{ color: currentStreak > 0 ? '#F97316' : 'var(--text-muted)' }} />
            <span className="font-mono-data text-sm font-bold" style={{ color: 'var(--forest-green)' }}>
              {currentStreak}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              day streak
            </span>
          </div>
        </motion.div>

        {/* Budget Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard hoverable={false} className="p-4 mb-5">
            <BudgetBar used={monthlyTotal} total={state.user.monthlyBudgetKg} />
          </GlassCard>
        </motion.div>

        {/* Weekly Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard hoverable={false} className="p-4 mb-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-sm font-semibold">Weekly Trend</h3>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--forest-green)' }} />
                  <span style={{ color: 'var(--text-muted)' }}>This week</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--text-muted)', opacity: 0.4 }} />
                  <span style={{ color: 'var(--text-muted)' }}>Last week</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--forest-green)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--forest-green)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="grayGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--text-muted)" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="var(--text-muted)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="lastWeek"
                  stroke="var(--text-muted)"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fill="url(#grayGrad)"
                  strokeOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="thisWeek"
                  stroke="var(--forest-green)"
                  strokeWidth={2}
                  fill="url(#greenGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          className="grid grid-cols-2 gap-3 mb-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {Object.entries(categoryBreakdown).map(([key, value], i) => {
            const info = categoryInfo[key];
            const totalAll = Object.values(categoryBreakdown).reduce((s, v) => s + v, 0);
            const percent = totalAll > 0 ? Math.round((value / totalAll) * 100) : 0;

            return (
              <GlassCard key={key} className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{info.icon}</span>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {info.label}
                  </span>
                </div>
                <AnimatedCounter
                  value={value}
                  suffix=" kg"
                  decimals={1}
                  className="text-lg"
                />
                <div className="flex items-center gap-1 mt-1">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${Math.max(percent, 5)}%`,
                      background: info.color,
                      maxWidth: '100%',
                    }}
                  />
                  <span className="text-[10px] font-mono-data" style={{ color: 'var(--text-muted)' }}>
                    {percent}%
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <GlassCard hoverable={false} className="p-4 mb-5">
            <h3 className="font-display text-sm font-semibold mb-3">Quick Stats</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="font-mono-data text-lg font-bold" style={{ color: 'var(--forest-green)' }}>
                  {todayTotal.toFixed(1)}
                </div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Today (kg)</div>
              </div>
              <div className="text-center">
                <div className="font-mono-data text-lg font-bold" style={{ color: 'var(--deep-teal)' }}>
                  {weeklyTotal.toFixed(1)}
                </div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>This Week (kg)</div>
              </div>
              <div className="text-center">
                <div className="font-mono-data text-lg font-bold" style={{ color: 'var(--earth-amber)' }}>
                  {monthlyTotal.toFixed(1)}
                </div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>This Month (kg)</div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* AI Insight Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <GlassCard
            variant="highlighted"
            className="p-4 cursor-pointer"
            onClick={() => router.push('/coach')}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <span className="text-lg">🌱</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1">AI Carbon Coach</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {monthlyTotal > 0
                    ? `You've logged ${monthlyTotal.toFixed(1)} kg CO₂ this month. Tap to get personalized reduction tips from your AI coach.`
                    : `Start logging your activities to get personalized AI-powered reduction insights.`}
                </p>
                <span
                  className="text-xs font-semibold mt-2 inline-block"
                  style={{ color: 'var(--forest-green)' }}
                >
                  Chat with Coach →
                </span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </>
  );
}
