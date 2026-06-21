'use client';

import { cn } from '@/lib/utils';
import { type ReactNode, type HTMLAttributes } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'highlighted' | 'danger';
  hoverable?: boolean;
  className?: string;
}

export function GlassCard({
  children,
  variant = 'default',
  hoverable = true,
  className,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        hoverable ? 'glass-card' : 'glass-card-static',
        variant === 'highlighted' && 'border-[rgba(var(--forest-green-rgb),0.25)]',
        variant === 'danger' && 'border-[rgba(220,38,38,0.25)]',
        className
      )}
      style={{
        background:
          variant === 'highlighted'
            ? 'rgba(var(--forest-green-rgb), 0.08)'
            : variant === 'danger'
              ? 'rgba(220, 38, 38, 0.06)'
              : undefined,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
