// CarbonSense — Carbon Equivalent Translator
// Converts abstract CO₂ kg values into relatable, visceral equivalents

export interface CarbonEquivalent {
  icon: string;
  label: string;
  value: number;
  unit: string;
  description: string;
}

/**
 * Convert kg CO₂ to km driven in a petrol car
 * Average petrol car emits ~0.17 kg CO₂/km
 */
export function toKmDriven(kgCO2: number): CarbonEquivalent {
  const km = Math.round(kgCO2 / 0.17);
  return {
    icon: '🚗',
    label: 'Driving',
    value: km,
    unit: 'km',
    description: `driving ${km} km in a petrol car`,
  };
}

/**
 * Convert kg CO₂ to number of phone charges
 * Charging a phone uses ~0.0082 kg CO₂
 */
export function toPhoneCharges(kgCO2: number): CarbonEquivalent {
  const charges = Math.round(kgCO2 / 0.0082);
  return {
    icon: '📱',
    label: 'Phone charges',
    value: charges,
    unit: 'times',
    description: `charging your phone ${charges} times`,
  };
}

/**
 * Convert kg CO₂ to hours of AC usage
 * 1.5 ton split AC uses ~1.23 kg CO₂/hour
 */
export function toACHours(kgCO2: number): CarbonEquivalent {
  const hours = Math.round(kgCO2 / 1.23 * 10) / 10;
  return {
    icon: '❄️',
    label: 'AC usage',
    value: hours,
    unit: 'hours',
    description: `running your AC for ${hours} hours`,
  };
}

/**
 * Convert kg CO₂ to tree-days of absorption
 * 1 mature tree absorbs ~22 kg CO₂/year ≈ 0.06 kg/day
 */
export function toTreeDays(kgCO2: number): CarbonEquivalent {
  const days = Math.round(kgCO2 / 0.06);
  return {
    icon: '🌳',
    label: 'Tree absorption',
    value: days,
    unit: 'days',
    description: `${days} days of a tree absorbing CO₂`,
  };
}

/**
 * Convert kg CO₂ to minutes of domestic flight
 * Domestic flight: ~0.255 kg CO₂/km, avg speed ~800 km/h → ~3.4 kg/min
 */
export function toFlightMinutes(kgCO2: number): CarbonEquivalent {
  const minutes = Math.round(kgCO2 / 3.4 * 10) / 10;
  return {
    icon: '✈️',
    label: 'Flying',
    value: minutes,
    unit: 'min',
    description: `${minutes} minutes of domestic flight`,
  };
}

/**
 * Convert kg CO₂ to cups of chai
 * 1 cup of chai ≈ 0.05 kg CO₂
 */
export function toChaiCups(kgCO2: number): CarbonEquivalent {
  const cups = Math.round(kgCO2 / 0.05);
  return {
    icon: '☕',
    label: 'Cups of chai',
    value: cups,
    unit: 'cups',
    description: `making ${cups} cups of chai`,
  };
}

/**
 * Convert kg CO₂ to metro rides
 * Average metro ride (10 km) ≈ 0.3 kg CO₂
 */
export function toMetroRides(kgCO2: number): CarbonEquivalent {
  const rides = Math.round(kgCO2 / 0.3 * 10) / 10;
  return {
    icon: '🚇',
    label: 'Metro rides',
    value: rides,
    unit: 'rides',
    description: `${rides} metro rides (10 km each)`,
  };
}

/**
 * Convert kg CO₂ to LED bulb hours
 * 9W LED ≈ 0.0074 kg CO₂/hour
 */
export function toLEDBulbHours(kgCO2: number): CarbonEquivalent {
  const hours = Math.round(kgCO2 / 0.0074);
  return {
    icon: '💡',
    label: 'LED bulb',
    value: hours,
    unit: 'hours',
    description: `keeping an LED bulb on for ${hours} hours`,
  };
}

/**
 * Get all equivalents for a given kg CO₂ value
 */
export function getAllEquivalents(kgCO2: number): CarbonEquivalent[] {
  if (kgCO2 <= 0) return [];

  return [
    toKmDriven(kgCO2),
    toPhoneCharges(kgCO2),
    toACHours(kgCO2),
    toTreeDays(kgCO2),
    toChaiCups(kgCO2),
    toMetroRides(kgCO2),
    toLEDBulbHours(kgCO2),
    toFlightMinutes(kgCO2),
  ].filter((eq) => eq.value > 0);
}

/**
 * Get a random subset of equivalents for rotating display
 */
export function getRandomEquivalents(kgCO2: number, count: number = 3): CarbonEquivalent[] {
  const all = getAllEquivalents(kgCO2);
  const shuffled = all.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
