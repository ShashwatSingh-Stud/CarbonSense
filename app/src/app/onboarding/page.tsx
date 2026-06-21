'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Leaf, Car, Bus, Train, Bike, PersonStanding,
  Zap, Flame, ArrowRight, ArrowLeft, Check,
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { CarbonGauge } from '@/components/ui/carbon-gauge';
import {
  calculateBaseline,
  indianCities,
  type DietType,
  type LifestyleType,
  type EnergyType,
  type TransportMode,
} from '@/lib/baseline-calculator';

const transportOptions: { id: TransportMode; label: string; icon: string }[] = [
  { id: 'car-petrol', label: 'Car (Petrol)', icon: '🚗' },
  { id: 'car-diesel', label: 'Car (Diesel)', icon: '🚙' },
  { id: 'car-ev', label: 'Electric Car', icon: '⚡' },
  { id: 'bike', label: 'Bike/Scooter', icon: '🏍️' },
  { id: 'auto-rickshaw', label: 'Auto-Rickshaw', icon: '🛺' },
  { id: 'bus', label: 'Bus', icon: '🚌' },
  { id: 'metro', label: 'Metro', icon: '🚇' },
  { id: 'cycle', label: 'Bicycle', icon: '🚲' },
  { id: 'walk', label: 'Walking', icon: '🚶' },
  { id: 'wfh', label: 'Work from Home', icon: '🏠' },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export default function OnboardingPage() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Form state
  const [selectedCity, setSelectedCity] = useState('Bhopal');
  const [selectedState, setSelectedState] = useState('Madhya Pradesh');
  const [lifestyle, setLifestyle] = useState<LifestyleType>('urban');
  const [dietType, setDietType] = useState<DietType>('vegetarian');
  const [transportModes, setTransportModes] = useState<TransportMode[]>([]);
  const [monthlyUnits, setMonthlyUnits] = useState(150);
  const [energyType, setEnergyType] = useState<EnergyType>('lpg');
  const [hasAC, setHasAC] = useState(false);
  const [familySize, setFamilySize] = useState(4);

  const totalSteps = 4; // 3 quiz steps + 1 result

  const goNext = () => {
    if (step < totalSteps - 1) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const goBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const toggleTransport = (mode: TransportMode) => {
    setTransportModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    const found = indianCities.find((c) => c.city === city);
    if (found) setSelectedState(found.state);
  };

  const handleComplete = () => {
    const baseline = calculateBaseline({
      city: selectedCity,
      state: selectedState,
      lifestyle,
      dietType,
      transportModes,
      monthlyElectricityUnits: monthlyUnits,
      energyType,
      hasAC,
      familySize,
    });

    dispatch({
      type: 'UPDATE_USER',
      payload: {
        city: selectedCity,
        state: selectedState,
        lifestyle,
        dietType,
        transportModes,
        energyType,
        monthlyElectricityUnits: monthlyUnits,
        hasAC,
        familySize,
        baselineFootprint: baseline,
        monthlyBudgetKg: baseline.suggestedMonthlyBudget,
        onboardingCompleted: true,
      },
    });

    router.push('/dashboard');
  };

  const baseline = step === 3
    ? calculateBaseline({
        city: selectedCity,
        state: selectedState,
        lifestyle,
        dietType,
        transportModes,
        monthlyElectricityUnits: monthlyUnits,
        energyType,
        hasAC,
        familySize,
      })
    : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Progress Dots */}
      <div className="flex items-center gap-2 mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === step ? '32px' : '8px',
              background:
                i <= step ? 'var(--forest-green)' : 'var(--border-color)',
              boxShadow:
                i === step ? '0 0 8px rgba(var(--forest-green-rgb), 0.4)' : 'none',
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md">
        <AnimatePresence mode="wait" custom={direction}>
          {/* Step 1: Location & Lifestyle */}
          {step === 0 && (
            <motion.div
              key="step-0"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="glass-card-static p-6"
            >
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-5 h-5" style={{ color: 'var(--forest-green)' }} />
                <h2 className="font-display text-xl font-bold">Where do you live?</h2>
              </div>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                We use state-specific electricity emission factors for accuracy.
              </p>

              {/* City selector */}
              <div className="mb-4">
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="input-field"
                >
                  {indianCities.map((c) => (
                    <option key={c.city} value={c.city}>
                      {c.city}, {c.state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lifestyle */}
              <div className="mb-4">
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Lifestyle</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['urban', 'semi-urban', 'rural'] as LifestyleType[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLifestyle(l)}
                      className="py-2.5 px-3 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: lifestyle === l ? 'rgba(var(--forest-green-rgb), 0.15)' : 'var(--glass-bg)',
                        border: `1px solid ${lifestyle === l ? 'var(--forest-green)' : 'var(--border-color)'}`,
                        color: lifestyle === l ? 'var(--forest-green)' : 'var(--text-secondary)',
                      }}
                    >
                      {l === 'semi-urban' ? 'Semi-Urban' : l.charAt(0).toUpperCase() + l.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Diet */}
              <div className="mb-4">
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Diet Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { id: 'vegetarian' as DietType, label: '🥬 Veg', },
                    { id: 'eggetarian' as DietType, label: '🥚 Eggetarian' },
                    { id: 'non-vegetarian' as DietType, label: '🍗 Non-Veg' },
                  ]).map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDietType(d.id)}
                      className="py-2.5 px-3 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: dietType === d.id ? 'rgba(var(--forest-green-rgb), 0.15)' : 'var(--glass-bg)',
                        border: `1px solid ${dietType === d.id ? 'var(--forest-green)' : 'var(--border-color)'}`,
                        color: dietType === d.id ? 'var(--forest-green)' : 'var(--text-secondary)',
                      }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Family Size */}
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Family Size: <span className="font-mono-data" style={{ color: 'var(--forest-green)' }}>{familySize}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={familySize}
                  onChange={(e) => setFamilySize(Number(e.target.value))}
                  className="w-full accent-[var(--forest-green)]"
                />
                <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>1</span><span>10</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Transport */}
          {step === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="glass-card-static p-6"
            >
              <div className="flex items-center gap-2 mb-1">
                <Car className="w-5 h-5" style={{ color: 'var(--forest-green)' }} />
                <h2 className="font-display text-xl font-bold">How do you commute?</h2>
              </div>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                Select all transport modes you use regularly.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {transportOptions.map((t) => {
                  const selected = transportModes.includes(t.id);
                  return (
                    <motion.button
                      key={t.id}
                      onClick={() => toggleTransport(t.id)}
                      className="flex items-center gap-3 p-3 rounded-xl transition-all text-left"
                      style={{
                        background: selected ? 'rgba(var(--forest-green-rgb), 0.15)' : 'var(--glass-bg)',
                        border: `1px solid ${selected ? 'var(--forest-green)' : 'var(--border-color)'}`,
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="text-xl">{t.icon}</span>
                      <div>
                        <span
                          className="text-sm font-medium block"
                          style={{ color: selected ? 'var(--forest-green)' : 'var(--text-primary)' }}
                        >
                          {t.label}
                        </span>
                      </div>
                      {selected && (
                        <Check className="w-4 h-4 ml-auto" style={{ color: 'var(--forest-green)' }} />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 3: Energy */}
          {step === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="glass-card-static p-6"
            >
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-5 h-5" style={{ color: 'var(--forest-green)' }} />
                <h2 className="font-display text-xl font-bold">Home Energy</h2>
              </div>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                Tell us about your electricity and cooking energy usage.
              </p>

              {/* Electricity */}
              <div className="mb-6">
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Monthly Electricity: <span className="font-mono-data" style={{ color: 'var(--forest-green)' }}>{monthlyUnits} kWh</span>
                </label>
                <input
                  type="range"
                  min={30}
                  max={800}
                  step={10}
                  value={monthlyUnits}
                  onChange={(e) => setMonthlyUnits(Number(e.target.value))}
                  className="w-full accent-[var(--forest-green)]"
                />
                <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>30 kWh</span><span>400 kWh (avg)</span><span>800 kWh</span>
                </div>
              </div>

              {/* Cooking Energy */}
              <div className="mb-6">
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Cooking Energy</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { id: 'lpg' as EnergyType, label: '🔥 LPG Gas' },
                    { id: 'induction' as EnergyType, label: '🍳 Induction' },
                    { id: 'both' as EnergyType, label: '🔄 Both' },
                  ]).map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setEnergyType(e.id)}
                      className="py-2.5 px-3 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: energyType === e.id ? 'rgba(var(--forest-green-rgb), 0.15)' : 'var(--glass-bg)',
                        border: `1px solid ${energyType === e.id ? 'var(--forest-green)' : 'var(--border-color)'}`,
                        color: energyType === e.id ? 'var(--forest-green)' : 'var(--text-secondary)',
                      }}
                    >
                      {e.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* AC */}
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Do you use Air Conditioning?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: true, label: '❄️ Yes' },
                    { val: false, label: '🌀 No (Fan only)' },
                  ].map((o) => (
                    <button
                      key={String(o.val)}
                      onClick={() => setHasAC(o.val)}
                      className="py-2.5 px-3 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: hasAC === o.val ? 'rgba(var(--forest-green-rgb), 0.15)' : 'var(--glass-bg)',
                        border: `1px solid ${hasAC === o.val ? 'var(--forest-green)' : 'var(--border-color)'}`,
                        color: hasAC === o.val ? 'var(--forest-green)' : 'var(--text-secondary)',
                      }}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Result */}
          {step === 3 && baseline && (
            <motion.div
              key="step-3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="glass-card-static p-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
              >
                <h2 className="font-display text-xl font-bold mb-2">Your Carbon Footprint</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  Based on your lifestyle in {selectedCity}
                </p>
              </motion.div>

              {/* Gauge */}
              <div className="flex justify-center mb-4">
                <CarbonGauge
                  value={baseline.dailyKg}
                  max={15}
                  label="estimated daily avg"
                  size={200}
                />
              </div>

              {/* Annual estimate */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="font-mono-data text-3xl font-bold" style={{ color: 'var(--forest-green)' }}>
                  {(baseline.annualKg / 1000).toFixed(1)}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  tonnes CO₂ / year
                </div>
              </motion.div>

              {/* Comparison */}
              <motion.div
                className="p-4 rounded-xl mb-4"
                style={{
                  background: 'rgba(var(--forest-green-rgb), 0.06)',
                  border: '1px solid var(--border-color)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>You</span>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>India Avg (1.9t)</span>
                </div>
                <div className="flex gap-2 h-3">
                  <div
                    className="rounded-full transition-all"
                    style={{
                      width: `${Math.min((baseline.annualKg / 3800) * 100, 100)}%`,
                      background: baseline.comparisonPercent > 0 ? 'var(--earth-amber)' : 'var(--gauge-green)',
                    }}
                  />
                  <div
                    className="rounded-full"
                    style={{
                      width: `${(1900 / 3800) * 100}%`,
                      background: 'var(--border-color)',
                    }}
                  />
                </div>
                <p className="text-xs mt-2 font-medium" style={{
                  color: baseline.comparisonPercent > 0 ? 'var(--earth-amber)' : 'var(--gauge-green)',
                }}>
                  {baseline.comparisonPercent > 0
                    ? `${baseline.comparisonPercent}% above national average`
                    : `${Math.abs(baseline.comparisonPercent)}% below national average`}
                </p>
              </motion.div>

              {/* Category breakdown */}
              <motion.div
                className="grid grid-cols-4 gap-2 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                {[
                  { label: 'Food', icon: '🍽️', value: baseline.breakdown.food },
                  { label: 'Transport', icon: '🚗', value: baseline.breakdown.transport },
                  { label: 'Energy', icon: '⚡', value: baseline.breakdown.energy },
                  { label: 'Shopping', icon: '🛍️', value: baseline.breakdown.shopping },
                ].map((cat) => (
                  <div key={cat.label} className="text-center p-2 rounded-lg" style={{ background: 'var(--glass-bg)' }}>
                    <div className="text-lg mb-1">{cat.icon}</div>
                    <div className="font-mono-data text-xs font-bold" style={{ color: 'var(--forest-green)' }}>
                      {cat.value} kg
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{cat.label}/yr</div>
                  </div>
                ))}
              </motion.div>

              {/* Monthly budget suggestion */}
              <motion.div
                className="text-xs p-3 rounded-lg"
                style={{
                  background: 'rgba(var(--deep-teal-rgb), 0.08)',
                  border: '1px solid rgba(var(--deep-teal-rgb), 0.15)',
                  color: 'var(--deep-teal)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                💡 Suggested monthly budget: <strong>{baseline.suggestedMonthlyBudget} kg CO₂</strong> (10% below your average)
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6">
          {step > 0 ? (
            <motion.button
              onClick={goBack}
              className="btn-secondary flex items-center gap-2 text-sm"
              whileTap={{ scale: 0.97 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </motion.button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <motion.button
              onClick={goNext}
              className="btn-primary flex items-center gap-2 text-sm"
              whileTap={{ scale: 0.97 }}
              disabled={step === 1 && transportModes.length === 0}
              style={{
                opacity: step === 1 && transportModes.length === 0 ? 0.5 : 1,
              }}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              onClick={handleComplete}
              className="btn-primary flex items-center gap-2 text-sm"
              whileTap={{ scale: 0.97 }}
            >
              Start Tracking
              <Leaf className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
