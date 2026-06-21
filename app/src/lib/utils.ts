import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format CO₂ value with unit
 */
export function formatCO2(kg: number, decimals: number = 2): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)} tonnes CO₂`;
  }
  return `${kg.toFixed(decimals)} kg CO₂`;
}

/**
 * Format CO₂ value as just a number (for display with separate unit)
 */
export function formatCO2Value(kg: number): string {
  if (kg >= 1000) {
    return (kg / 1000).toFixed(1);
  }
  if (kg >= 100) {
    return kg.toFixed(0);
  }
  return kg.toFixed(2);
}

/**
 * Format a date relative to now
 */
export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/**
 * Format a date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Get the start of today
 */
export function startOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the start of this week (Monday)
 */
export function startOfWeek(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the start of this month
 */
export function startOfMonth(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Generate a simple unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Category display info
 */
export const categoryInfo: Record<
  string,
  { label: string; icon: string; color: string }
> = {
  food: { label: 'Food', icon: '🍽️', color: '#22c55e' },
  transport: { label: 'Transport', icon: '🚗', color: '#3b82f6' },
  energy: { label: 'Energy', icon: '⚡', color: '#f59e0b' },
  shopping: { label: 'Shopping', icon: '🛍️', color: '#a855f7' },
};

/**
 * Calculate streak from an array of log dates
 */
export function calculateStreak(logDates: Date[]): number {
  if (logDates.length === 0) return 0;

  const uniqueDays = new Set(
    logDates.map((d) => startOfDay(d).toISOString())
  );

  let streak = 0;
  const today = startOfDay();

  // Check if logged today
  if (!uniqueDays.has(today.toISOString())) {
    // Check yesterday (grace period)
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (!uniqueDays.has(yesterday.toISOString())) {
      return 0;
    }
  }

  // Count consecutive days backwards from today
  const checkDate = new Date(today);
  while (uniqueDays.has(checkDate.toISOString())) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}

/**
 * Delay utility for animations
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
