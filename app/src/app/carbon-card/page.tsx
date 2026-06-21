'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, ExternalLink, MessageCircle, Copy, Check, Leaf, TreePine } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Navbar } from '@/components/layout/navbar';
import { GlassCard } from '@/components/ui/glass-card';

type CardTheme = 'dark' | 'light' | 'gradient';

const confettiColors = ['#22C55E', '#4ADE80', '#0D9488', '#2DD4BF', '#F59E0B', '#06B6D4'];

export default function CarbonCardPage() {
  const router = useRouter();
  const { state, monthlyTotal } = useApp();
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardTheme, setCardTheme] = useState<CardTheme>('dark');
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const user = state.user;
  const baseline = user?.baselineFootprint;
  const reductionPercent = baseline
    ? Math.max(0, Math.round(((baseline.monthlyKg - monthlyTotal) / baseline.monthlyKg) * 100))
    : 0;
  const treesEquivalent = Math.round(monthlyTotal / 22 * 10) / 10; // 1 tree absorbs ~22kg/year

  const handleReveal = () => {
    setRevealed(true);
    if (reductionPercent > 10) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  };

  const getThemeStyles = (theme: CardTheme) => {
    switch (theme) {
      case 'dark':
        return {
          background: 'linear-gradient(135deg, #0D1117 0%, #161B22 50%, #1A2332 100%)',
          textColor: '#E6EDF3',
          accentColor: '#4ADE80',
          mutedColor: '#8B949E',
          borderColor: 'rgba(74, 222, 128, 0.2)',
        };
      case 'light':
        return {
          background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 50%, #D1FAE5 100%)',
          textColor: '#1C1C1C',
          accentColor: '#1A6B3C',
          mutedColor: '#6B7280',
          borderColor: 'rgba(26, 107, 60, 0.2)',
        };
      case 'gradient':
        return {
          background: 'linear-gradient(135deg, #1A6B3C 0%, #0D9488 50%, #06B6D4 100%)',
          textColor: '#FFFFFF',
          accentColor: '#FFFFFF',
          mutedColor: 'rgba(255,255,255,0.7)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
        };
    }
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `carbonsense-${user?.name?.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 7)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to generate image:', error);
    }
  };

  const shareToWhatsApp = () => {
    const text = `🌱 My CarbonSense Report:\n📊 Monthly footprint: ${monthlyTotal.toFixed(1)} kg CO₂\n📉 Reduction: ${reductionPercent}%\n🌳 Trees needed: ${treesEquivalent}\n\nTrack yours at CarbonSense!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareToLinkedIn = () => {
    const text = `I reduced my carbon footprint by ${reductionPercent}% this month using CarbonSense! 🌱\n\nMy monthly CO₂: ${monthlyTotal.toFixed(1)} kg\n\n#CarbonSense #Sustainability #ClimateAction #GreenLiving`;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://carbonsense.app')}&summary=${encodeURIComponent(text)}`, '_blank');
  };

  const copyStats = async () => {
    const text = `🌱 CarbonSense Report — ${new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}\n📊 Monthly: ${monthlyTotal.toFixed(1)} kg CO₂\n📉 Reduction: ${reductionPercent}%\n🌳 Trees equivalent: ${treesEquivalent}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const theme = getThemeStyles(cardTheme);

  return (
    <>
      <Navbar />

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti &&
          Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                background: confettiColors[i % confettiColors.length],
                animationDelay: `${Math.random() * 1.5}s`,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                width: `${6 + Math.random() * 8}px`,
                height: `${6 + Math.random() * 8}px`,
              }}
            />
          ))}
      </AnimatePresence>

      <div className="page-container" style={{ paddingTop: '72px' }}>
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-xl font-bold mb-1">Carbon Card</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Your shareable monthly carbon score card
          </p>
        </motion.div>

        {/* Theme Selector */}
        <div className="flex gap-2 mb-5">
          {(['dark', 'light', 'gradient'] as CardTheme[]).map((t) => (
            <button
              key={t}
              onClick={() => setCardTheme(t)}
              className="flex-1 py-2 rounded-xl text-xs font-medium transition-all capitalize"
              style={{
                background: cardTheme === t ? 'rgba(var(--forest-green-rgb), 0.15)' : 'var(--glass-bg)',
                border: `1px solid ${cardTheme === t ? 'var(--forest-green)' : 'var(--border-color)'}`,
                color: cardTheme === t ? 'var(--forest-green)' : 'var(--text-secondary)',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Card Preview */}
        {!revealed ? (
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.button
              onClick={handleReveal}
              className="w-full max-w-sm aspect-[1.6] rounded-2xl flex flex-col items-center justify-center gap-3"
              style={{
                background: theme.background,
                border: `2px solid ${theme.borderColor}`,
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              }}
              whileHover={{ scale: 1.02, rotateY: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Leaf className="w-10 h-10" style={{ color: theme.accentColor }} />
              <span style={{ color: theme.mutedColor, fontSize: '14px' }}>
                Tap to reveal your Carbon Card
              </span>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            className="flex justify-center mb-6"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
            style={{ perspective: '1000px' }}
          >
            <div
              ref={cardRef}
              className="w-full max-w-sm rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: theme.background,
                border: `2px solid ${theme.borderColor}`,
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                aspectRatio: '1.6',
              }}
            >
              {/* Card content */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5" style={{ color: theme.accentColor }} />
                  <span style={{ color: theme.accentColor, fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-sora)' }}>
                    CarbonSense
                  </span>
                </div>
                <span style={{ color: theme.mutedColor, fontSize: '11px' }}>
                  {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </span>
              </div>

              <div style={{ color: theme.textColor, fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                {user?.name || 'CarbonSense User'}
              </div>
              <div style={{ color: theme.mutedColor, fontSize: '11px', marginBottom: '16px' }}>
                📍 {user?.city}, {user?.state}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div style={{
                    fontFamily: 'var(--font-jetbrains)',
                    fontSize: '24px',
                    fontWeight: 700,
                    color: theme.accentColor,
                  }}>
                    {monthlyTotal.toFixed(1)}
                  </div>
                  <div style={{ color: theme.mutedColor, fontSize: '10px' }}>kg CO₂ / month</div>
                </div>
                <div className="text-center">
                  <div style={{
                    fontFamily: 'var(--font-jetbrains)',
                    fontSize: '24px',
                    fontWeight: 700,
                    color: reductionPercent > 0 ? '#22C55E' : theme.textColor,
                  }}>
                    {reductionPercent > 0 ? `↓${reductionPercent}` : '—'}%
                  </div>
                  <div style={{ color: theme.mutedColor, fontSize: '10px' }}>reduction</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1" style={{
                    fontFamily: 'var(--font-jetbrains)',
                    fontSize: '24px',
                    fontWeight: 700,
                    color: theme.accentColor,
                  }}>
                    {treesEquivalent}
                  </div>
                  <div style={{ color: theme.mutedColor, fontSize: '10px' }}>
                    <TreePine className="w-3 h-3 inline" /> trees needed
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div
                className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full opacity-10"
                style={{ background: theme.accentColor }}
              />
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        {revealed && (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={downloadCard}
              className="btn-primary w-full flex items-center justify-center gap-2"
              whileTap={{ scale: 0.97 }}
            >
              <Download className="w-4 h-4" />
              Download as PNG
            </motion.button>

            <div className="grid grid-cols-3 gap-2">
              <motion.button
                onClick={shareToWhatsApp}
                className="btn-secondary flex items-center justify-center gap-1 py-3"
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">WhatsApp</span>
              </motion.button>
              <motion.button
                onClick={shareToLinkedIn}
                className="btn-secondary flex items-center justify-center gap-1 py-3"
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-xs">LinkedIn</span>
              </motion.button>
              <motion.button
                onClick={copyStats}
                className="btn-secondary flex items-center justify-center gap-1 py-3"
                whileTap={{ scale: 0.95 }}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
