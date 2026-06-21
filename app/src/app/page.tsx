'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Leaf, ArrowRight, BarChart3, Brain, Users, Share2 } from 'lucide-react';
import { useApp } from '@/lib/store';

const features = [
  {
    icon: BarChart3,
    title: 'Real-Time Dashboard',
    description: 'Animated carbon gauge, weekly trends, and category breakdown with India-specific data.',
  },
  {
    icon: Brain,
    title: 'AI Carbon Coach',
    description: 'Gemini-powered personalized insights. Get weekly reduction plans based on your actual habits.',
  },
  {
    icon: Users,
    title: 'Green Challenges',
    description: 'Join community challenges like Meat-Free Week. Compete on leaderboards with friends.',
  },
  {
    icon: Share2,
    title: 'Carbon Card',
    description: 'Auto-generated shareable card with your carbon score. One-tap share to social media.',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { state } = useApp();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Hero */}
      <motion.div
        className="text-center max-w-lg mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Logo */}
        <motion.div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-8"
          style={{
            background: 'var(--gradient-primary)',
            boxShadow: '0 0 40px rgba(var(--forest-green-rgb), 0.3)',
          }}
          animate={{
            boxShadow: [
              '0 0 40px rgba(var(--forest-green-rgb), 0.3)',
              '0 0 60px rgba(var(--forest-green-rgb), 0.5)',
              '0 0 40px rgba(var(--forest-green-rgb), 0.3)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Leaf className="w-10 h-10 text-white" />
        </motion.div>

        <h1 className="font-display text-5xl font-extrabold mb-4 tracking-tight">
          <span className="text-gradient">Carbon</span>
          <span style={{ color: 'var(--text-primary)' }}>Sense</span>
        </h1>

        <p className="text-xl mb-2 font-display font-semibold" style={{ color: 'var(--text-primary)' }}>
          Track. Reduce. Share.
        </p>

        <p className="text-base mb-10 max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Your personal AI-powered carbon footprint tracker with India-specific emission data and gamified challenges.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {!state.isAuthenticated ? (
            <>
              <motion.button
                className="btn-primary text-base px-8 py-3.5 flex items-center justify-center gap-2"
                onClick={() => router.push('/auth/signup')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Create Account
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                className="btn-secondary text-base px-8 py-3.5"
                onClick={() => router.push('/auth/login')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Sign In
              </motion.button>
            </>
          ) : (
            <motion.button
              className="btn-primary text-base px-8 py-3.5 flex items-center justify-center gap-2"
              onClick={() => router.push(state.user?.onboardingCompleted ? '/dashboard' : '/onboarding')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mt-16 w-full"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            className="glass-card p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <feature.icon
              className="w-6 h-6 mb-3"
              style={{ color: 'var(--forest-green)' }}
            />
            <h3 className="font-display text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              {feature.title}
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* India badge */}
      <motion.div
        className="mt-10 flex items-center gap-2 px-4 py-2 rounded-full"
        style={{
          background: 'rgba(var(--forest-green-rgb), 0.08)',
          border: '1px solid var(--border-color)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span className="text-lg">🇮🇳</span>
        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
          Built with India-specific emission factors
        </span>
      </motion.div>
    </div>
  );
}
