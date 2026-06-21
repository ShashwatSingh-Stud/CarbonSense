'use client';

import { motion } from 'framer-motion';

interface BudgetBarProps {
  used: number;        // kg CO₂ used this month
  total: number;       // monthly budget in kg CO₂
  className?: string;
}

export function BudgetBar({ used, total, className = '' }: BudgetBarProps) {
  const percent = Math.min((used / total) * 100, 100);
  const remaining = Math.max(total - used, 0);
  const isOverspent = used > total;

  const getBarColor = () => {
    if (percent < 50) return 'var(--gauge-green)';
    if (percent < 80) return 'var(--gauge-amber)';
    return 'var(--gauge-red)';
  };

  const getBarGradient = () => {
    if (percent < 50) return 'linear-gradient(90deg, #22C55E, #4ADE80)';
    if (percent < 80) return 'linear-gradient(90deg, #22C55E, #F59E0B)';
    return 'linear-gradient(90deg, #F59E0B, #EF4444)';
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Labels */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            Monthly Carbon Budget
          </span>
        </div>
        <span
          className="font-mono-data text-xs font-semibold"
          style={{ color: isOverspent ? 'var(--carbon-red)' : 'var(--text-secondary)' }}
        >
          {used.toFixed(1)} / {total.toFixed(0)} kg
        </span>
      </div>

      {/* Bar track */}
      <div
        className="relative w-full h-3 rounded-full overflow-hidden"
        style={{ background: 'var(--border-color)' }}
      >
        {/* Animated fill */}
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            background: getBarGradient(),
            boxShadow: isOverspent
              ? `0 0 12px rgba(239, 68, 68, 0.5)`
              : `0 0 8px ${getBarColor()}40`,
          }}
        />

        {/* Overspend pulse effect */}
        {isOverspent && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ background: 'rgba(239, 68, 68, 0.2)' }}
          />
        )}
      </div>

      {/* Remaining */}
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {percent.toFixed(0)}% used
        </span>
        {isOverspent ? (
          <span className="text-xs font-semibold" style={{ color: 'var(--carbon-red)' }}>
            ⚠️ Over budget by {(used - total).toFixed(1)} kg!
          </span>
        ) : (
          <span className="text-xs" style={{ color: 'var(--gauge-green)' }}>
            {remaining.toFixed(1)} kg remaining
          </span>
        )}
      </div>
    </div>
  );
}
