'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Leaf } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Navbar } from '@/components/layout/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { generateId } from '@/lib/utils';

const promptChips = [
  { label: '🎯 My biggest impact?', prompt: 'What is my biggest carbon impact area this week and what can I do about it?' },
  { label: '🏆 Easiest wins', prompt: 'What are the easiest wins I can achieve this week to reduce my carbon footprint?' },
  { label: '📅 Monthly plan', prompt: 'Create a realistic monthly plan to reduce my carbon footprint by 15%.' },
  { label: '📊 Compare weeks', prompt: 'How does my carbon footprint this week compare to last week? What changed?' },
  { label: '🇮🇳 India tips', prompt: 'Give me India-specific tips for reducing my carbon footprint in daily life.' },
];

export default function CoachPage() {
  const router = useRouter();
  const { state, dispatch, todayTotal, weeklyTotal, monthlyTotal, categoryBreakdown, currentStreak } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!state.isAuthenticated) {
      router.replace('/');
    }
  }, [state.isAuthenticated, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.chatMessages, isTyping]);

  const buildContext = () => {
    const user = state.user;
    return `User: ${user?.name}, lives in ${user?.city}, ${user?.state}.
Diet: ${user?.dietType}. Transport: ${user?.transportModes?.join(', ')}.
Today's CO₂: ${todayTotal.toFixed(1)} kg. This week: ${weeklyTotal.toFixed(1)} kg. This month: ${monthlyTotal.toFixed(1)} kg.
Category breakdown this month - Food: ${categoryBreakdown.food.toFixed(1)}kg, Transport: ${categoryBreakdown.transport.toFixed(1)}kg, Energy: ${categoryBreakdown.energy.toFixed(1)}kg, Shopping: ${categoryBreakdown.shopping.toFixed(1)}kg.
Current streak: ${currentStreak} days. Monthly budget: ${user?.monthlyBudgetKg}kg.
Recent logs: ${state.logs.slice(0, 10).map(l => `${l.itemName}(${l.co2Kg}kg)`).join(', ')}.`;
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || isTyping) return;

    // Add user message
    const userMsg = {
      id: generateId(),
      role: 'user' as const,
      content: message.trim(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMsg });
    setInput('');
    setIsTyping(true);

    try {
      // Call Gemini API via our API route
      const response = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.trim(),
          context: buildContext(),
          history: state.chatMessages.slice(-10),
        }),
      });

      if (!response.ok) throw new Error('API error');

      const data = await response.json();

      const aiMsg = {
        id: generateId(),
        role: 'assistant' as const,
        content: data.response || "I'm here to help you reduce your carbon footprint! Ask me anything about your habits, and I'll give you personalized advice based on your data.",
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: aiMsg });
    } catch {
      // Fallback to local response if API fails
      const fallbackResponses = [
        `Based on your data, your biggest impact area is **${Object.entries(categoryBreakdown).sort(([,a],[,b]) => b - a)[0]?.[0] || 'food'}**. Here are 3 quick wins:\n\n1. 🚇 **Switch to metro** on your next commute — saves ~2.3 kg CO₂ per trip\n2. 🥬 **Try a veg meal** today — chicken biryani is 2.1 kg vs veg thali at 0.45 kg\n3. ❄️ **Reduce AC by 1 hour** daily — saves 1.23 kg CO₂\n\nSmall changes compound into big impact! Your ${currentStreak}-day streak is impressive — keep it going! 💪`,
        `Great question! Looking at your ${state.user?.city} lifestyle:\n\n📊 **This week's snapshot:**\n- You've logged ${weeklyTotal.toFixed(1)} kg CO₂\n- Food accounts for ${categoryBreakdown.food.toFixed(1)} kg\n- Transport: ${categoryBreakdown.transport.toFixed(1)} kg\n\n🎯 **Easiest wins for you:**\n1. Making chai at home (0.05 kg) vs café coffee (0.3 kg)\n2. Walking for trips under 2 km\n3. Batch cooking reduces per-meal emissions by ~15%\n\nYou're doing great tracking your footprint! 🌱`,
        `Here's a personalized 4-week plan for you:\n\n**Week 1:** 🥬 Replace 3 non-veg meals with veg alternatives. Target: save 5 kg CO₂\n**Week 2:** 🚌 Use public transport 2 extra days. Target: save 4 kg CO₂\n**Week 3:** ⚡ Reduce AC usage by 2 hrs/day. Target: save 8 kg CO₂\n**Week 4:** 🛍️ No new clothing purchases. Target: save 10 kg CO₂\n\n**Total potential savings: ~27 kg CO₂/month** (18% reduction!)\n\nI'll send you reminders based on your patterns. Let's do this! 🌍`,
      ];

      const aiMsg = {
        id: generateId(),
        role: 'assistant' as const,
        content: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: aiMsg });
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      <Navbar />

      <div className="page-container flex flex-col" style={{ paddingTop: '72px', paddingBottom: '140px' }}>
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-xl font-bold mb-1">AI Carbon Coach</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Powered by Google Gemini — personalized for your data
          </p>
        </motion.div>

        {/* Prompt Chips */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4" style={{ scrollbarWidth: 'none' }}>
          {promptChips.map((chip) => (
            <motion.button
              key={chip.label}
              onClick={() => sendMessage(chip.prompt)}
              className="px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all"
              style={{
                background: 'rgba(var(--forest-green-rgb), 0.08)',
                border: '1px solid var(--border-color)',
                color: 'var(--forest-green)',
              }}
              whileTap={{ scale: 0.95 }}
              disabled={isTyping}
            >
              {chip.label}
            </motion.button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 space-y-4">
          {state.chatMessages.length === 0 && (
            <div className="text-center py-12">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{ background: 'var(--gradient-primary)' }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="text-2xl">🌱</span>
              </motion.div>
              <h3 className="font-display text-base font-semibold mb-2">Hi {state.user?.name?.split(' ')[0]}! 👋</h3>
              <p className="text-sm max-w-xs mx-auto" style={{ color: 'var(--text-secondary)' }}>
                I&apos;m your AI Carbon Coach. Ask me anything about reducing your footprint — I have access to all your logged data!
              </p>
            </div>
          )}

          {state.chatMessages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {msg.role === 'assistant' && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  <Leaf className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.content.split(/(\*\*.*?\*\*)/).map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={i}>{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  })}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              className="flex items-start gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <div className="chat-bubble-ai">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ background: 'var(--forest-green)' }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          className="fixed bottom-16 left-0 right-0 px-4 py-3"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid var(--glass-border)',
          }}
        >
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your AI Coach..."
              className="input-field flex-1"
              disabled={isTyping}
            />
            <motion.button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-3 rounded-xl"
              style={{
                background: input.trim() ? 'var(--gradient-primary)' : 'var(--glass-bg)',
                border: `1px solid ${input.trim() ? 'transparent' : 'var(--border-color)'}`,
                color: input.trim() ? 'white' : 'var(--text-muted)',
                opacity: input.trim() ? 1 : 0.5,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </form>
        </div>
      </div>
    </>
  );
}
