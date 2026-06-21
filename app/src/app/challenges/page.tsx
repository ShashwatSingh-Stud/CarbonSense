'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy, Users, Clock, TrendingUp, Medal } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Navbar } from '@/components/layout/navbar';
import { GlassCard } from '@/components/ui/glass-card';

// Mock leaderboard data
const mockLeaderboard = [
  { rank: 1, name: 'Ananya S.', reduction: 32, avatar: '👩‍💻', city: 'Bangalore' },
  { rank: 2, name: 'Rohan K.', reduction: 28, avatar: '👨‍🎓', city: 'Mumbai' },
  { rank: 3, name: 'Priya M.', reduction: 24, avatar: '👩‍🔬', city: 'Delhi' },
  { rank: 4, name: 'Arjun D.', reduction: 21, avatar: '👨‍💼', city: 'Pune' },
  { rank: 5, name: 'Sneha R.', reduction: 19, avatar: '👩‍🏫', city: 'Chennai' },
  { rank: 6, name: 'Vikram P.', reduction: 17, avatar: '👨‍🎨', city: 'Hyderabad' },
  { rank: 7, name: 'Kavya L.', reduction: 15, avatar: '👩‍⚕️', city: 'Bhopal' },
  { rank: 8, name: 'Aditya G.', reduction: 12, avatar: '👨‍🚀', city: 'Jaipur' },
  { rank: 9, name: 'Meera V.', reduction: 10, avatar: '👩‍🎤', city: 'Kochi' },
  { rank: 10, name: 'Rahul S.', reduction: 8, avatar: '👨‍🔧', city: 'Indore' },
];

const rankBadges: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function ChallengesPage() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<'challenges' | 'leaderboard'>('challenges');

  const handleJoin = (challengeId: string) => {
    dispatch({ type: 'JOIN_CHALLENGE', payload: challengeId });
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  };

  return (
    <>
      <Navbar />

      <div className="page-container" style={{ paddingTop: '72px' }}>
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-xl font-bold mb-1">Green Challenges</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Join community challenges and compete on the leaderboard
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {['challenges', 'leaderboard'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'challenges' | 'leaderboard')}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: activeTab === tab ? 'var(--gradient-primary)' : 'var(--glass-bg)',
                color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${activeTab === tab ? 'transparent' : 'var(--border-color)'}`,
              }}
            >
              {tab === 'challenges' ? (
                <span className="flex items-center justify-center gap-1">
                  <Trophy className="w-4 h-4" /> Challenges
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1">
                  <Medal className="w-4 h-4" /> Leaderboard
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <div className="space-y-4">
            {state.challenges.map((challenge, i) => {
              const daysLeft = getDaysRemaining(challenge.endDate);
              const progress = challenge.joined
                ? Math.min((challenge.userReductionKg / challenge.targetReductionKg) * 100, 100)
                : 0;

              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <GlassCard
                    variant={challenge.joined ? 'highlighted' : 'default'}
                    hoverable={!challenge.joined}
                    className="p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-display text-sm font-bold">{challenge.title}</h3>
                        <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {challenge.description}
                        </p>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 mb-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {challenge.participantCount} joined
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {daysLeft} days left
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {challenge.targetReductionKg} kg target
                      </span>
                    </div>

                    {/* Progress Ring */}
                    {challenge.joined && (
                      <div className="flex items-center gap-4 mb-3">
                        {/* Mini progress ring */}
                        <div className="relative w-14 h-14">
                          <svg width="56" height="56" viewBox="0 0 56 56">
                            <circle
                              cx="28" cy="28" r="22"
                              fill="none"
                              stroke="var(--border-color)"
                              strokeWidth="4"
                            />
                            <circle
                              cx="28" cy="28" r="22"
                              fill="none"
                              stroke="var(--forest-green)"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeDasharray={`${2 * Math.PI * 22}`}
                              strokeDashoffset={`${2 * Math.PI * 22 * (1 - progress / 100)}`}
                              transform="rotate(-90 28 28)"
                              style={{ filter: 'drop-shadow(0 0 4px var(--forest-green))' }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-mono-data text-xs font-bold" style={{ color: 'var(--forest-green)' }}>
                              {progress.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-medium">Your Progress</div>
                          <div className="font-mono-data text-sm font-bold" style={{ color: 'var(--forest-green)' }}>
                            {challenge.userReductionKg.toFixed(1)} / {challenge.targetReductionKg} kg
                          </div>
                          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                            CO₂ reduced
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Join button */}
                    {!challenge.joined ? (
                      <motion.button
                        onClick={() => handleJoin(challenge.id)}
                        className="btn-primary w-full text-sm py-2.5"
                        whileTap={{ scale: 0.97 }}
                      >
                        Join Challenge
                      </motion.button>
                    ) : (
                      <div
                        className="text-center text-xs font-semibold py-2 rounded-lg"
                        style={{
                          background: 'rgba(var(--forest-green-rgb), 0.08)',
                          color: 'var(--forest-green)',
                        }}
                      >
                        ✅ You&apos;re participating! Log activities to make progress.
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-2">
            {/* Current user banner */}
            <GlassCard variant="highlighted" hoverable={false} className="p-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background: 'var(--gradient-primary)' }}>
                  😊
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold flex items-center gap-2">
                    {state.user?.name || 'You'}
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-normal"
                      style={{ background: 'rgba(var(--forest-green-rgb), 0.15)', color: 'var(--forest-green)' }}
                    >
                      YOU
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{state.user?.city}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono-data text-lg font-bold" style={{ color: 'var(--forest-green)' }}>
                    --
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>% reduction</div>
                </div>
              </div>
            </GlassCard>

            {/* Leaderboard list */}
            {mockLeaderboard.map((user, i) => (
              <motion.div
                key={user.rank}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{
                  background: user.rank <= 3 ? 'rgba(var(--forest-green-rgb), 0.04)' : 'var(--glass-bg)',
                  border: `1px solid ${user.rank <= 3 ? 'rgba(var(--forest-green-rgb), 0.12)' : 'var(--border-color)'}`,
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="w-8 text-center">
                  {rankBadges[user.rank] || (
                    <span className="font-mono-data text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
                      {user.rank}
                    </span>
                  )}
                </div>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)' }}>
                  {user.avatar}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{user.city}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono-data text-sm font-bold" style={{ color: 'var(--forest-green)' }}>
                    {user.reduction}%
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>reduction</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
