'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Leaf, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useApp } from '@/lib/store';
import { generateId } from '@/lib/utils';

export default function SignupPage() {
  const router = useRouter();
  const { dispatch } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // For MVP: create user locally and proceed to onboarding
      // In production: this would call Supabase Auth
      const userId = generateId();
      dispatch({
        type: 'SET_USER',
        payload: {
          id: userId,
          email: email.trim(),
          name: name.trim(),
          city: '',
          state: '',
          lifestyle: 'urban',
          dietType: 'vegetarian',
          transportModes: [],
          energyType: 'lpg',
          monthlyElectricityUnits: 150,
          hasAC: false,
          familySize: 4,
          baselineFootprint: null,
          monthlyBudgetKg: 150,
          createdAt: new Date().toISOString(),
          onboardingCompleted: false,
        },
      });

      router.push('/onboarding');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
            style={{ background: 'var(--gradient-primary)' }}
            whileHover={{ scale: 1.05 }}
          >
            <Leaf className="w-7 h-7 text-white" />
          </motion.div>
          <h1 className="font-display text-2xl font-bold mb-1">Create Account</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Join CarbonSense and start your green journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="glass-card-static p-6 space-y-4">
          {error && (
            <div
              className="text-xs font-medium p-3 rounded-lg"
              style={{
                background: 'rgba(220, 38, 38, 0.1)',
                color: 'var(--carbon-red)',
                border: '1px solid rgba(220, 38, 38, 0.2)',
              }}
            >
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Deepak"
                className="input-field pl-10"
                autoComplete="name"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field pl-10"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="input-field pl-10 pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-2"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <button
            onClick={() => router.push('/auth/login')}
            className="font-semibold"
            style={{ color: 'var(--forest-green)' }}
          >
            Sign In
          </button>
        </p>
      </motion.div>
    </div>
  );
}
