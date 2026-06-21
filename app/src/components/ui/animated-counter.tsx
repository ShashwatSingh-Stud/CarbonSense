'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
  triggerOnView?: boolean;
}

export function AnimatedCounter({
  value,
  duration = 1.5,
  suffix = '',
  prefix = '',
  decimals = 1,
  className = '',
  triggerOnView = true,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [hasAnimated, setHasAnimated] = useState(false);

  const spring = useSpring(0, {
    stiffness: 50,
    damping: 20,
    duration: duration * 1000,
  });

  const display = useTransform(spring, (v: number) => {
    return v.toFixed(decimals);
  });

  useEffect(() => {
    if (triggerOnView && isInView && !hasAnimated) {
      spring.set(value);
      setHasAnimated(true);
    } else if (!triggerOnView) {
      spring.set(value);
    }
  }, [value, isInView, triggerOnView, hasAnimated, spring]);

  // Update display manually for performance
  useEffect(() => {
    const unsubscribe = display.on('change', (v) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${v}${suffix}`;
      }
    });
    return unsubscribe;
  }, [display, prefix, suffix]);

  return (
    <motion.span
      ref={ref}
      className={`font-mono-data font-bold ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3 }}
    >
      {prefix}{value.toFixed(decimals)}{suffix}
    </motion.span>
  );
}
