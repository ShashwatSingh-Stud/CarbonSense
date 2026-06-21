// CarbonSense — Baseline Carbon Footprint Calculator
// Calculates estimated annual footprint based on onboarding quiz answers

import { getStateEmissionFactor } from './emission-factors';

export type DietType = 'vegetarian' | 'eggetarian' | 'non-vegetarian';
export type LifestyleType = 'urban' | 'semi-urban' | 'rural';
export type EnergyType = 'lpg' | 'induction' | 'both';
export type TransportMode =
  | 'car-petrol'
  | 'car-diesel'
  | 'car-ev'
  | 'bike'
  | 'auto-rickshaw'
  | 'bus'
  | 'metro'
  | 'cycle'
  | 'walk'
  | 'wfh';

export interface OnboardingData {
  city: string;
  state: string;
  lifestyle: LifestyleType;
  dietType: DietType;
  transportModes: TransportMode[];
  monthlyElectricityUnits: number; // kWh
  energyType: EnergyType;
  hasAC: boolean;
  familySize: number;
}

export interface BaselineResult {
  annualKg: number;
  monthlyKg: number;
  dailyKg: number;
  nationalAverageAnnualKg: number;
  comparisonPercent: number; // +/- % compared to national avg
  breakdown: {
    food: number;
    transport: number;
    energy: number;
    shopping: number;
  };
  suggestedMonthlyBudget: number;
}

// India's per capita CO₂ emissions: ~1.9 tonnes/year (World Bank 2022)
const INDIA_NATIONAL_AVERAGE_KG = 1900;

/**
 * Calculate food-related annual CO₂ based on diet type
 */
function calculateFoodAnnualKg(diet: DietType, familySize: number): number {
  // Per person annual estimates (kg CO₂)
  const dietFactors: Record<DietType, number> = {
    vegetarian: 350,     // ~0.96 kg/day
    eggetarian: 450,     // ~1.23 kg/day
    'non-vegetarian': 650, // ~1.78 kg/day
  };
  // Family cooking has efficiency gains
  const familyFactor = familySize > 1 ? 0.85 : 1;
  return dietFactors[diet] * familyFactor;
}

/**
 * Calculate transport-related annual CO₂ based on modes
 */
function calculateTransportAnnualKg(
  modes: TransportMode[],
  lifestyle: LifestyleType
): number {
  // Average daily km by mode for Indian cities
  const dailyKmByMode: Record<TransportMode, number> = {
    'car-petrol': 25,
    'car-diesel': 25,
    'car-ev': 25,
    bike: 15,
    'auto-rickshaw': 8,
    bus: 15,
    metro: 20,
    cycle: 8,
    walk: 3,
    wfh: 0,
  };

  // CO₂ per km by mode
  const co2PerKm: Record<TransportMode, number> = {
    'car-petrol': 0.17,
    'car-diesel': 0.19,
    'car-ev': 0.05,
    bike: 0.05,
    'auto-rickshaw': 0.06,
    bus: 0.04,
    metro: 0.03,
    cycle: 0,
    walk: 0,
    wfh: 0,
  };

  // Lifestyle affects commute frequency
  const commuteDays: Record<LifestyleType, number> = {
    urban: 260,       // 5 days/week
    'semi-urban': 230,
    rural: 200,
  };

  if (modes.length === 0) return 200; // Minimal transport assumption

  // If multiple modes, assume they split usage
  const perModeDays = commuteDays[lifestyle] / modes.length;

  return modes.reduce((total, mode) => {
    return total + dailyKmByMode[mode] * co2PerKm[mode] * perModeDays;
  }, 0);
}

/**
 * Calculate energy-related annual CO₂
 */
function calculateEnergyAnnualKg(
  monthlyUnits: number,
  state: string,
  energyType: EnergyType,
  hasAC: boolean
): number {
  // Electricity
  const stateFactor = getStateEmissionFactor(state);
  const electricityAnnual = monthlyUnits * 12 * stateFactor;

  // Cooking gas
  let cookingAnnual = 0;
  if (energyType === 'lpg' || energyType === 'both') {
    cookingAnnual = 42.5 * 8; // ~8 cylinders/year for average household
  }
  if (energyType === 'induction' || energyType === 'both') {
    cookingAnnual += monthlyUnits * 0.15 * 12 * stateFactor; // 15% extra electricity for cooking
  }

  // AC addition (summer months ~6 months, 6 hrs/day)
  let acAnnual = 0;
  if (hasAC) {
    acAnnual = 1.23 * 6 * 180; // 1.5T AC, 6 hrs, 180 summer days
  }

  return electricityAnnual + cookingAnnual + acAnnual;
}

/**
 * Calculate shopping/consumption annual CO₂ (estimate)
 */
function calculateShoppingAnnualKg(lifestyle: LifestyleType): number {
  const shoppingFactors: Record<LifestyleType, number> = {
    urban: 250,
    'semi-urban': 180,
    rural: 120,
  };
  return shoppingFactors[lifestyle];
}

/**
 * Main baseline calculation function
 */
export function calculateBaseline(data: OnboardingData): BaselineResult {
  const food = calculateFoodAnnualKg(data.dietType, data.familySize);
  const transport = calculateTransportAnnualKg(data.transportModes, data.lifestyle);
  const energy = calculateEnergyAnnualKg(
    data.monthlyElectricityUnits,
    data.state,
    data.energyType,
    data.hasAC
  );
  const shopping = calculateShoppingAnnualKg(data.lifestyle);

  const annualKg = Math.round(food + transport + energy + shopping);
  const monthlyKg = Math.round(annualKg / 12);
  const dailyKg = Math.round((annualKg / 365) * 100) / 100;

  const comparisonPercent = Math.round(
    ((annualKg - INDIA_NATIONAL_AVERAGE_KG) / INDIA_NATIONAL_AVERAGE_KG) * 100
  );

  // Suggest a monthly budget 10% below current average
  const suggestedMonthlyBudget = Math.round(monthlyKg * 0.9);

  return {
    annualKg,
    monthlyKg,
    dailyKg,
    nationalAverageAnnualKg: INDIA_NATIONAL_AVERAGE_KG,
    comparisonPercent,
    breakdown: {
      food: Math.round(food),
      transport: Math.round(transport),
      energy: Math.round(energy),
      shopping: Math.round(shopping),
    },
    suggestedMonthlyBudget,
  };
}

// ============================================================
// LOCATION DATA — Indian cities/states with Bhopal prioritized
// ============================================================

export interface CityOption {
  city: string;
  state: string;
}

export const indianCities: CityOption[] = [
  // Bhopal first (prioritized)
  { city: 'Bhopal', state: 'Madhya Pradesh' },
  // Other MP cities
  { city: 'Indore', state: 'Madhya Pradesh' },
  { city: 'Jabalpur', state: 'Madhya Pradesh' },
  { city: 'Gwalior', state: 'Madhya Pradesh' },
  { city: 'Ujjain', state: 'Madhya Pradesh' },
  // Metro cities
  { city: 'New Delhi', state: 'Delhi' },
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Bangalore', state: 'Karnataka' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  // Tier 1
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'Lucknow', state: 'Uttar Pradesh' },
  { city: 'Chandigarh', state: 'Punjab' },
  { city: 'Kochi', state: 'Kerala' },
  { city: 'Thiruvananthapuram', state: 'Kerala' },
  { city: 'Bhubaneswar', state: 'Odisha' },
  { city: 'Patna', state: 'Bihar' },
  { city: 'Ranchi', state: 'Jharkhand' },
  { city: 'Raipur', state: 'Chhattisgarh' },
  { city: 'Dehradun', state: 'Uttarakhand' },
  { city: 'Guwahati', state: 'Assam' },
  { city: 'Surat', state: 'Gujarat' },
  { city: 'Nagpur', state: 'Maharashtra' },
  { city: 'Coimbatore', state: 'Tamil Nadu' },
  { city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { city: 'Vadodara', state: 'Gujarat' },
  { city: 'Ludhiana', state: 'Punjab' },
  { city: 'Agra', state: 'Uttar Pradesh' },
  { city: 'Varanasi', state: 'Uttar Pradesh' },
  { city: 'Noida', state: 'Uttar Pradesh' },
  { city: 'Gurgaon', state: 'Haryana' },
  { city: 'Faridabad', state: 'Haryana' },
  { city: 'Mysore', state: 'Karnataka' },
  { city: 'Shimla', state: 'Himachal Pradesh' },
  { city: 'Gangtok', state: 'Sikkim' },
  { city: 'Panaji', state: 'Goa' },
  { city: 'Shillong', state: 'Meghalaya' },
  { city: 'Imphal', state: 'Manipur' },
  { city: 'Aizawl', state: 'Mizoram' },
  { city: 'Agartala', state: 'Tripura' },
  { city: 'Itanagar', state: 'Arunachal Pradesh' },
  { city: 'Kohima', state: 'Nagaland' },
  { city: 'Srinagar', state: 'Jammu & Kashmir' },
];
