'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, PlusCircle, MessageCircle, Trophy, User, Sun, Moon, Leaf } from 'lucide-react';
import { useTheme } from '@/components/providers/theme-provider';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/log', icon: PlusCircle, label: 'Log' },
  { href: '/coach', icon: MessageCircle, label: 'Coach' },
  { href: '/challenges', icon: Trophy, label: 'Challenges' },
  { href: '/carbon-card', icon: User, label: 'Card' },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // Don't show navbar on auth/onboarding pages
  if (
    pathname === '/' ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/onboarding')
  ) {
    return null;
  }

  return (
    <>
      {/* Top Bar */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--glass-border)',
        }}
      >
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5" style={{ color: 'var(--forest-green)' }} />
          <span className="font-display text-lg font-bold text-gradient">
            CarbonSense
          </span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full transition-all"
          style={{
            background: 'rgba(var(--forest-green-rgb), 0.1)',
            color: 'var(--forest-green)',
          }}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center gap-1 py-1 px-3 min-w-[60px]"
              >
                <div className="relative">
                  <Icon
                    className="w-5 h-5 transition-colors"
                    style={{
                      color: isActive ? 'var(--forest-green)' : 'var(--text-muted)',
                    }}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-1/2 w-1 h-1 rounded-full"
                      style={{
                        background: 'var(--forest-green)',
                        transform: 'translateX(-50%)',
                        boxShadow: '0 0 6px var(--forest-green)',
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
                </div>
                <span
                  className="text-[10px] font-medium"
                  style={{
                    color: isActive ? 'var(--forest-green)' : 'var(--text-muted)',
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
