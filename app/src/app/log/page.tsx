'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, Trash2, X } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Navbar } from '@/components/layout/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { LeafBurstOverlay, useLeafBurst } from '@/components/ui/leaf-burst';
import {
  quickLogPresets,
  searchEmissions,
  getItemsByCategory,
  calculateCO2,
  type EmissionCategory,
  type EmissionItem,
} from '@/lib/emission-factors';
import { generateId, formatRelativeDate, categoryInfo } from '@/lib/utils';

const categories: { id: EmissionCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: '📋' },
  { id: 'food', label: 'Food', icon: '🍽️' },
  { id: 'transport', label: 'Travel', icon: '🚗' },
  { id: 'energy', label: 'Energy', icon: '⚡' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
];

export default function LogPage() {
  const router = useRouter();
  const { state, dispatch, todayLogs } = useApp();
  const { leaves, triggerBurst } = useLeafBurst();

  const [activeCategory, setActiveCategory] = useState<EmissionCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<EmissionItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Search results
  const searchResults = useMemo(() => {
    if (searchQuery.trim()) {
      return searchEmissions(
        searchQuery,
        activeCategory === 'all' ? undefined : activeCategory
      );
    }
    if (activeCategory !== 'all') {
      return getItemsByCategory(activeCategory);
    }
    return [];
  }, [searchQuery, activeCategory]);

  const handleQuickLog = (item: EmissionItem) => {
    const co2 = calculateCO2(item.id, 1);
    const log = {
      id: generateId(),
      userId: state.user?.id ?? '',
      category: item.category,
      itemId: item.id,
      itemName: item.name,
      itemIcon: item.icon,
      quantity: 1,
      unit: item.unit,
      co2Kg: co2,
      loggedAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_LOG', payload: log });
    triggerBurst();
    showLogToast(`${item.icon} ${item.name} — ${co2} kg CO₂`);
  };

  const handleDetailLog = () => {
    if (!selectedItem) return;

    const co2 = calculateCO2(selectedItem.id, quantity);
    const log = {
      id: generateId(),
      userId: state.user?.id ?? '',
      category: selectedItem.category,
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      itemIcon: selectedItem.icon,
      quantity,
      unit: selectedItem.unit,
      co2Kg: co2,
      loggedAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_LOG', payload: log });
    triggerBurst();
    showLogToast(`${selectedItem.icon} ${selectedItem.name} × ${quantity} — ${co2} kg CO₂`);
    setSelectedItem(null);
    setQuantity(1);
    setSearchQuery('');
  };

  const showLogToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDeleteLog = (logId: string) => {
    dispatch({ type: 'DELETE_LOG', payload: logId });
  };

  return (
    <>
      <Navbar />
      <LeafBurstOverlay leaves={leaves} />

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            className="fixed top-20 left-1/2 z-50 -translate-x-1/2"
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
          >
            <div
              className="glass-card-static px-4 py-2.5 flex items-center gap-2 text-sm font-medium"
              style={{ color: 'var(--forest-green)', whiteSpace: 'nowrap' }}
            >
              <span>✅</span>
              {toastMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="page-container" style={{ paddingTop: '72px' }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-xl font-bold mb-1">Log Activity</h1>
          <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
            Quick-log or search to track your carbon impact
          </p>
        </motion.div>

        {/* Quick-Log Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
            <Clock className="w-3 h-3" />
            Quick Log — One Tap
          </h3>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {quickLogPresets.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleQuickLog(item)}
                className="p-3 rounded-xl text-center transition-all"
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--border-color)',
                }}
                whileTap={{ scale: 0.92 }}
                whileHover={{ borderColor: 'var(--forest-green)' }}
              >
                <div className="text-xl mb-1">{item.icon}</div>
                <div className="text-[10px] font-medium leading-tight" style={{ color: 'var(--text-primary)' }}>
                  {item.name}
                </div>
                <div className="text-[9px] font-mono-data mt-0.5" style={{ color: 'var(--forest-green)' }}>
                  {item.co2PerUnit} kg
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 'biryani', 'metro', 'AC'..."
              className="input-field pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
              style={{
                background: activeCategory === cat.id ? 'rgba(var(--forest-green-rgb), 0.15)' : 'var(--glass-bg)',
                border: `1px solid ${activeCategory === cat.id ? 'var(--forest-green)' : 'var(--border-color)'}`,
                color: activeCategory === cat.id ? 'var(--forest-green)' : 'var(--text-secondary)',
              }}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Results / Category Items */}
        {searchResults.length > 0 && (
          <div className="space-y-2 mb-6">
            {searchResults.slice(0, 15).map((item) => (
              <motion.button
                key={item.id}
                onClick={() => {
                  setSelectedItem(item);
                  setQuantity(1);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                style={{
                  background: selectedItem?.id === item.id
                    ? 'rgba(var(--forest-green-rgb), 0.12)'
                    : 'var(--glass-bg)',
                  border: `1px solid ${
                    selectedItem?.id === item.id ? 'var(--forest-green)' : 'var(--border-color)'
                  }`,
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    per {item.unit}
                  </div>
                </div>
                <div className="font-mono-data text-sm font-semibold" style={{ color: 'var(--forest-green)' }}>
                  {item.co2PerUnit} kg
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Detail Form */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <GlassCard variant="highlighted" hoverable={false} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedItem.icon}</span>
                    <div>
                      <div className="text-sm font-semibold">{selectedItem.name}</div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {selectedItem.co2PerUnit} kg CO₂ per {selectedItem.unit}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedItem(null)} style={{ color: 'var(--text-muted)' }}>
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3 mb-3">
                  <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Quantity:
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(0.5, quantity - 0.5))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                      style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)' }}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(0.1, Number(e.target.value)))}
                      className="w-16 text-center input-field font-mono-data font-bold"
                      step={0.5}
                      min={0.1}
                    />
                    <button
                      onClick={() => setQuantity(quantity + 0.5)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                      style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)' }}
                    >
                      +
                    </button>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {selectedItem.unit}
                    </span>
                  </div>
                </div>

                {/* CO₂ Preview */}
                <div
                  className="p-3 rounded-lg mb-3 text-center"
                  style={{ background: 'rgba(var(--forest-green-rgb), 0.06)' }}
                >
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Estimated impact:
                  </span>
                  <div className="font-mono-data text-2xl font-bold" style={{ color: 'var(--forest-green)' }}>
                    {calculateCO2(selectedItem.id, quantity)} kg CO₂
                  </div>
                </div>

                <motion.button
                  onClick={handleDetailLog}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.97 }}
                >
                  🍃 Log Activity
                </motion.button>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Today's Logs */}
        {todayLogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xs font-semibold mb-2 flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
              <span>Today&apos;s Logs ({todayLogs.length})</span>
              <span className="font-mono-data" style={{ color: 'var(--forest-green)' }}>
                {todayLogs.reduce((s, l) => s + l.co2Kg, 0).toFixed(2)} kg total
              </span>
            </h3>
            <div className="space-y-2">
              {todayLogs.map((log) => (
                <motion.div
                  key={log.id}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--border-color)',
                  }}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <span className="text-lg">{log.itemIcon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{log.itemName}</div>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {log.quantity} {log.unit} · {formatRelativeDate(new Date(log.loggedAt))}
                    </div>
                  </div>
                  <div className="font-mono-data text-sm font-semibold" style={{ color: 'var(--forest-green)' }}>
                    {log.co2Kg} kg
                  </div>
                  <button
                    onClick={() => handleDeleteLog(log.id)}
                    className="p-1 rounded"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {todayLogs.length === 0 && !searchQuery && activeCategory === 'all' && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🌍</div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              No activities logged today
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Tap a quick-log button or search for an activity above
            </p>
          </div>
        )}
      </div>
    </>
  );
}
