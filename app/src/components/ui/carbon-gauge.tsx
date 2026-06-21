'use client';

import { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface CarbonGaugeProps {
  value: number;        // current CO₂ in kg
  max: number;          // max value for full gauge
  label?: string;       // label below value
  size?: number;        // diameter in px
  showAnimation?: boolean;
}

export function CarbonGauge({
  value,
  max,
  label = "today's CO₂",
  size = 220,
  showAnimation = true,
}: CarbonGaugeProps) {
  const percent = Math.min((value / max) * 100, 100);

  // Determine color based on percentage
  const getColor = (p: number) => {
    if (p < 40) return { stroke: 'var(--gauge-green)', glow: 'rgba(34, 197, 94, 0.3)' };
    if (p < 75) return { stroke: 'var(--gauge-amber)', glow: 'rgba(245, 158, 11, 0.3)' };
    return { stroke: 'var(--gauge-red)', glow: 'rgba(239, 68, 68, 0.3)' };
  };

  const color = getColor(percent);

  // SVG arc calculation (270° arc)
  const strokeWidth = 12;
  const radius = (size - strokeWidth * 2) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75; // 270 degrees
  const startAngle = 135; // Start from bottom-left

  // Animated progress
  const springValue = useSpring(0, {
    stiffness: 60,
    damping: 15,
    mass: 1,
  });

  const animatedOffset = useTransform(springValue, (v: number) => {
    return arcLength - (v / 100) * arcLength;
  });

  const displayValue = useTransform(springValue, (v: number) => {
    return ((v / 100) * max).toFixed(1);
  });

  const displayValueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (showAnimation) {
      springValue.set(percent);
    } else {
      springValue.jump(percent);
    }
  }, [percent, showAnimation, springValue]);

  useEffect(() => {
    const unsubscribe = displayValue.on('change', (v) => {
      if (displayValueRef.current) {
        displayValueRef.current.textContent = v;
      }
    });
    return unsubscribe;
  }, [displayValue]);

  const describeArc = () => {
    const start = (startAngle * Math.PI) / 180;
    const end = ((startAngle + 270) * Math.PI) / 180;
    const x1 = center + radius * Math.cos(start);
    const y1 = center + radius * Math.sin(start);
    const x2 = center + radius * Math.cos(end);
    const y2 = center + radius * Math.sin(end);
    return `M ${x1} ${y1} A ${radius} ${radius} 0 1 1 ${x2} ${y2}`;
  };

  return (
    <div className="relative flex flex-col items-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-0"
      >
        {/* Background arc */}
        <path
          d={describeArc()}
          fill="none"
          stroke="var(--border-color)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Animated progress arc */}
        <motion.path
          d={describeArc()}
          fill="none"
          stroke={color.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={arcLength}
          style={{ strokeDashoffset: animatedOffset }}
          filter={`drop-shadow(0 0 8px ${color.glow})`}
        />

        {/* Glow effect */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingTop: size * 0.05 }}>
        <span
          ref={displayValueRef}
          className="font-mono-data text-4xl font-bold"
          style={{ color: color.stroke, fontSize: size * 0.17 }}
        >
          {value.toFixed(1)}
        </span>
        <span
          className="font-mono-data text-sm"
          style={{ color: 'var(--text-secondary)', fontSize: size * 0.06 }}
        >
          kg CO₂
        </span>
        <span
          className="text-xs mt-1"
          style={{ color: 'var(--text-muted)', fontSize: size * 0.05 }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
