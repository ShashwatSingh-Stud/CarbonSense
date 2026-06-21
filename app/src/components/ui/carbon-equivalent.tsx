'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllEquivalents, type CarbonEquivalent } from '@/lib/carbon-equivalents';

interface CarbonEquivalentDisplayProps {
  co2Kg: number;
  autoRotate?: boolean;
  rotateInterval?: number; // ms
  className?: string;
}

export function CarbonEquivalentDisplay({
  co2Kg,
  autoRotate = true,
  rotateInterval = 3000,
  className = '',
}: CarbonEquivalentDisplayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const equivalents = getAllEquivalents(co2Kg);

  useEffect(() => {
    if (!autoRotate || equivalents.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % equivalents.length);
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotateInterval, equivalents.length]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [co2Kg]);

  if (equivalents.length === 0 || co2Kg <= 0) {
    return null;
  }

  const current = equivalents[currentIndex];

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
        =
      </span>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-1.5"
        >
          <span className="text-lg">{current.icon}</span>
          <span className="font-mono-data text-sm font-semibold" style={{ color: 'var(--forest-green)' }}>
            {current.value.toLocaleString()}
          </span>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {current.unit} {current.label.toLowerCase()}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/**
 * Single static equivalent display
 */
export function CarbonEquivalentBadge({ equivalent }: { equivalent: CarbonEquivalent }) {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
      style={{
        background: 'rgba(var(--forest-green-rgb), 0.08)',
        border: '1px solid var(--border-color)',
      }}
    >
      <span>{equivalent.icon}</span>
      <span className="font-mono-data font-semibold" style={{ color: 'var(--forest-green)' }}>
        {equivalent.value.toLocaleString()}
      </span>
      <span style={{ color: 'var(--text-secondary)' }}>
        {equivalent.unit}
      </span>
    </div>
  );
}
