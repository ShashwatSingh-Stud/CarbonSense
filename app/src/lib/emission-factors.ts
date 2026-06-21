// CarbonSense — India-Specific Emission Factors Database
// Sources: IPCC, India MOEF&CC, Our World in Data, state-wise grid data

export type EmissionCategory = 'food' | 'transport' | 'energy' | 'shopping';

export interface EmissionItem {
  id: string;
  name: string;
  category: EmissionCategory;
  co2PerUnit: number; // kg CO₂
  unit: string;
  icon: string;
  tags?: string[];
}

// ============================================================
// FOOD — per serving (kg CO₂)
// ============================================================
export const foodEmissions: EmissionItem[] = [
  // Staples
  { id: 'rice-plate', name: 'Rice (1 plate)', category: 'food', co2PerUnit: 0.27, unit: 'serving', icon: '🍚', tags: ['staple', 'grain'] },
  { id: 'roti', name: 'Roti / Chapati', category: 'food', co2PerUnit: 0.12, unit: 'piece', icon: '🫓', tags: ['staple', 'bread'] },
  { id: 'paratha', name: 'Paratha', category: 'food', co2PerUnit: 0.18, unit: 'piece', icon: '🫓', tags: ['staple', 'bread'] },
  { id: 'naan', name: 'Naan', category: 'food', co2PerUnit: 0.2, unit: 'piece', icon: '🫓', tags: ['staple', 'bread'] },
  { id: 'poha', name: 'Poha', category: 'food', co2PerUnit: 0.14, unit: 'serving', icon: '🍛', tags: ['breakfast', 'snack'] },
  { id: 'upma', name: 'Upma', category: 'food', co2PerUnit: 0.13, unit: 'serving', icon: '🍛', tags: ['breakfast', 'south'] },

  // Dal & Lentils
  { id: 'dal', name: 'Dal (any variety)', category: 'food', co2PerUnit: 0.09, unit: 'serving', icon: '🍲', tags: ['lentil', 'protein', 'veg'] },
  { id: 'rajma', name: 'Rajma Chawal', category: 'food', co2PerUnit: 0.22, unit: 'serving', icon: '🍛', tags: ['lentil', 'north'] },
  { id: 'chole', name: 'Chole / Chana Masala', category: 'food', co2PerUnit: 0.18, unit: 'serving', icon: '🍛', tags: ['lentil', 'north'] },
  { id: 'sambar', name: 'Sambar', category: 'food', co2PerUnit: 0.11, unit: 'serving', icon: '🍲', tags: ['lentil', 'south'] },

  // Vegetables
  { id: 'sabzi', name: 'Mixed Sabzi', category: 'food', co2PerUnit: 0.1, unit: 'serving', icon: '🥬', tags: ['vegetable', 'veg'] },
  { id: 'palak-paneer', name: 'Palak Paneer', category: 'food', co2PerUnit: 0.72, unit: 'serving', icon: '🧀', tags: ['paneer', 'north'] },
  { id: 'paneer-tikka', name: 'Paneer Tikka', category: 'food', co2PerUnit: 0.85, unit: 'serving', icon: '🧀', tags: ['paneer', 'starter'] },
  { id: 'paneer-butter', name: 'Paneer Butter Masala', category: 'food', co2PerUnit: 0.9, unit: 'serving', icon: '🧀', tags: ['paneer', 'north'] },
  { id: 'aloo-gobi', name: 'Aloo Gobi', category: 'food', co2PerUnit: 0.15, unit: 'serving', icon: '🥔', tags: ['vegetable', 'veg'] },

  // Thalis
  { id: 'veg-thali', name: 'Veg Thali', category: 'food', co2PerUnit: 0.45, unit: 'serving', icon: '🍽️', tags: ['thali', 'veg', 'complete'] },
  { id: 'nonveg-thali', name: 'Non-Veg Thali', category: 'food', co2PerUnit: 2.5, unit: 'serving', icon: '🍽️', tags: ['thali', 'nonveg', 'complete'] },

  // Non-Veg
  { id: 'chicken-curry', name: 'Chicken Curry', category: 'food', co2PerUnit: 1.8, unit: 'serving', icon: '🍗', tags: ['chicken', 'nonveg'] },
  { id: 'chicken-biryani', name: 'Chicken Biryani', category: 'food', co2PerUnit: 2.1, unit: 'serving', icon: '🍗', tags: ['biryani', 'chicken', 'nonveg'] },
  { id: 'chicken-tikka', name: 'Chicken Tikka', category: 'food', co2PerUnit: 1.5, unit: 'serving', icon: '🍗', tags: ['chicken', 'starter'] },
  { id: 'butter-chicken', name: 'Butter Chicken', category: 'food', co2PerUnit: 2.0, unit: 'serving', icon: '🍗', tags: ['chicken', 'north'] },
  { id: 'mutton-curry', name: 'Mutton Curry', category: 'food', co2PerUnit: 5.2, unit: 'serving', icon: '🥩', tags: ['mutton', 'nonveg'] },
  { id: 'mutton-biryani', name: 'Mutton Biryani', category: 'food', co2PerUnit: 5.8, unit: 'serving', icon: '🥩', tags: ['biryani', 'mutton', 'nonveg'] },
  { id: 'fish-curry', name: 'Fish Curry', category: 'food', co2PerUnit: 1.4, unit: 'serving', icon: '🐟', tags: ['fish', 'nonveg'] },
  { id: 'fish-fry', name: 'Fish Fry', category: 'food', co2PerUnit: 1.6, unit: 'serving', icon: '🐟', tags: ['fish', 'nonveg'] },
  { id: 'egg-curry', name: 'Egg Curry', category: 'food', co2PerUnit: 0.68, unit: 'serving', icon: '🥚', tags: ['egg', 'nonveg'] },
  { id: 'boiled-egg', name: 'Boiled Egg', category: 'food', co2PerUnit: 0.3, unit: 'piece', icon: '🥚', tags: ['egg'] },
  { id: 'omelette', name: 'Omelette (2 eggs)', category: 'food', co2PerUnit: 0.6, unit: 'serving', icon: '🥚', tags: ['egg', 'breakfast'] },
  { id: 'keema', name: 'Keema', category: 'food', co2PerUnit: 4.5, unit: 'serving', icon: '🥩', tags: ['mutton', 'nonveg'] },
  { id: 'tandoori-chicken', name: 'Tandoori Chicken', category: 'food', co2PerUnit: 1.9, unit: 'serving', icon: '🍗', tags: ['chicken', 'tandoor'] },
  { id: 'prawn-curry', name: 'Prawn Curry', category: 'food', co2PerUnit: 3.2, unit: 'serving', icon: '🦐', tags: ['seafood', 'nonveg'] },

  // South Indian
  { id: 'masala-dosa', name: 'Masala Dosa', category: 'food', co2PerUnit: 0.18, unit: 'piece', icon: '🥞', tags: ['south', 'breakfast'] },
  { id: 'plain-dosa', name: 'Plain Dosa', category: 'food', co2PerUnit: 0.12, unit: 'piece', icon: '🥞', tags: ['south', 'breakfast'] },
  { id: 'idli', name: 'Idli (2 pieces)', category: 'food', co2PerUnit: 0.08, unit: 'serving', icon: '🟡', tags: ['south', 'breakfast'] },
  { id: 'vada', name: 'Medu Vada', category: 'food', co2PerUnit: 0.15, unit: 'piece', icon: '🍩', tags: ['south', 'breakfast'] },
  { id: 'uttapam', name: 'Uttapam', category: 'food', co2PerUnit: 0.16, unit: 'piece', icon: '🥞', tags: ['south', 'breakfast'] },
  { id: 'pongal', name: 'Pongal', category: 'food', co2PerUnit: 0.14, unit: 'serving', icon: '🍛', tags: ['south', 'breakfast'] },

  // Snacks
  { id: 'samosa', name: 'Samosa', category: 'food', co2PerUnit: 0.15, unit: 'piece', icon: '🔺', tags: ['snack', 'fried'] },
  { id: 'pakora', name: 'Pakora / Bhajiya', category: 'food', co2PerUnit: 0.12, unit: 'serving', icon: '🍘', tags: ['snack', 'fried'] },
  { id: 'pav-bhaji', name: 'Pav Bhaji', category: 'food', co2PerUnit: 0.25, unit: 'serving', icon: '🍛', tags: ['snack', 'mumbai'] },
  { id: 'vada-pav', name: 'Vada Pav', category: 'food', co2PerUnit: 0.14, unit: 'piece', icon: '🍔', tags: ['snack', 'mumbai'] },
  { id: 'chaat', name: 'Chaat / Pani Puri', category: 'food', co2PerUnit: 0.1, unit: 'serving', icon: '🥙', tags: ['snack', 'street'] },
  { id: 'momos', name: 'Momos (steamed, 6pc)', category: 'food', co2PerUnit: 0.35, unit: 'serving', icon: '🥟', tags: ['snack', 'tibetan'] },

  // Beverages
  { id: 'chai', name: 'Chai (milk tea)', category: 'food', co2PerUnit: 0.05, unit: 'cup', icon: '☕', tags: ['beverage', 'daily'] },
  { id: 'coffee', name: 'Coffee', category: 'food', co2PerUnit: 0.1, unit: 'cup', icon: '☕', tags: ['beverage'] },
  { id: 'filter-coffee', name: 'Filter Coffee', category: 'food', co2PerUnit: 0.08, unit: 'cup', icon: '☕', tags: ['beverage', 'south'] },
  { id: 'lassi', name: 'Lassi', category: 'food', co2PerUnit: 0.18, unit: 'glass', icon: '🥛', tags: ['beverage', 'dairy'] },
  { id: 'milk', name: 'Milk (250ml)', category: 'food', co2PerUnit: 0.33, unit: 'glass', icon: '🥛', tags: ['dairy', 'daily'] },
  { id: 'cold-drink', name: 'Cold Drink / Soda', category: 'food', co2PerUnit: 0.2, unit: 'bottle', icon: '🥤', tags: ['beverage', 'packaged'] },
  { id: 'juice', name: 'Fresh Juice', category: 'food', co2PerUnit: 0.12, unit: 'glass', icon: '🧃', tags: ['beverage', 'fresh'] },

  // Dairy
  { id: 'curd', name: 'Curd / Dahi', category: 'food', co2PerUnit: 0.15, unit: 'serving', icon: '🥛', tags: ['dairy'] },
  { id: 'ghee', name: 'Ghee (1 tbsp)', category: 'food', co2PerUnit: 0.28, unit: 'tbsp', icon: '🧈', tags: ['dairy', 'cooking'] },

  // Sweets
  { id: 'gulab-jamun', name: 'Gulab Jamun', category: 'food', co2PerUnit: 0.2, unit: 'piece', icon: '🍩', tags: ['sweet', 'dessert'] },
  { id: 'jalebi', name: 'Jalebi', category: 'food', co2PerUnit: 0.12, unit: 'serving', icon: '🍩', tags: ['sweet', 'dessert'] },
  { id: 'ice-cream', name: 'Ice Cream', category: 'food', co2PerUnit: 0.35, unit: 'scoop', icon: '🍨', tags: ['sweet', 'dessert'] },

  // Fast Food / Misc
  { id: 'pizza', name: 'Pizza (1 slice)', category: 'food', co2PerUnit: 0.75, unit: 'slice', icon: '🍕', tags: ['fast-food', 'western'] },
  { id: 'burger', name: 'Burger', category: 'food', co2PerUnit: 1.2, unit: 'piece', icon: '🍔', tags: ['fast-food', 'western'] },
  { id: 'maggi', name: 'Maggi / Instant Noodles', category: 'food', co2PerUnit: 0.18, unit: 'serving', icon: '🍜', tags: ['instant', 'snack'] },
  { id: 'fried-rice', name: 'Fried Rice', category: 'food', co2PerUnit: 0.3, unit: 'serving', icon: '🍚', tags: ['chinese', 'rice'] },
  { id: 'noodles', name: 'Noodles / Chow Mein', category: 'food', co2PerUnit: 0.25, unit: 'serving', icon: '🍜', tags: ['chinese'] },
];

// ============================================================
// TRANSPORT — per km (kg CO₂)
// ============================================================
export const transportEmissions: EmissionItem[] = [
  { id: 'car-petrol', name: 'Car (Petrol)', category: 'transport', co2PerUnit: 0.17, unit: 'km', icon: '🚗', tags: ['car', 'private'] },
  { id: 'car-diesel', name: 'Car (Diesel)', category: 'transport', co2PerUnit: 0.19, unit: 'km', icon: '🚗', tags: ['car', 'private'] },
  { id: 'car-ev', name: 'Electric Car', category: 'transport', co2PerUnit: 0.05, unit: 'km', icon: '⚡', tags: ['car', 'ev'] },
  { id: 'car-cng', name: 'Car (CNG)', category: 'transport', co2PerUnit: 0.12, unit: 'km', icon: '🚗', tags: ['car', 'cng'] },
  { id: 'bike-petrol', name: 'Motorcycle / Scooter', category: 'transport', co2PerUnit: 0.05, unit: 'km', icon: '🏍️', tags: ['two-wheeler'] },
  { id: 'bike-ev', name: 'Electric Scooter', category: 'transport', co2PerUnit: 0.01, unit: 'km', icon: '⚡', tags: ['two-wheeler', 'ev'] },
  { id: 'auto-rickshaw', name: 'Auto-Rickshaw', category: 'transport', co2PerUnit: 0.06, unit: 'km', icon: '🛺', tags: ['public', 'local'] },
  { id: 'e-rickshaw', name: 'E-Rickshaw', category: 'transport', co2PerUnit: 0.02, unit: 'km', icon: '🛺', tags: ['public', 'ev'] },
  { id: 'city-bus', name: 'City Bus', category: 'transport', co2PerUnit: 0.04, unit: 'km', icon: '🚌', tags: ['public', 'bus'] },
  { id: 'brts', name: 'BRTS', category: 'transport', co2PerUnit: 0.035, unit: 'km', icon: '🚌', tags: ['public', 'bus', 'rapid'] },
  { id: 'metro', name: 'Metro Rail', category: 'transport', co2PerUnit: 0.03, unit: 'km', icon: '🚇', tags: ['public', 'rail'] },
  { id: 'local-train', name: 'Local Train', category: 'transport', co2PerUnit: 0.01, unit: 'km', icon: '🚆', tags: ['public', 'rail'] },
  { id: 'long-train', name: 'Long-distance Train', category: 'transport', co2PerUnit: 0.01, unit: 'km', icon: '🚆', tags: ['public', 'rail', 'intercity'] },
  { id: 'cab-shared', name: 'Shared Cab (Ola/Uber Pool)', category: 'transport', co2PerUnit: 0.09, unit: 'km', icon: '🚕', tags: ['cab', 'shared'] },
  { id: 'cab-solo', name: 'Solo Cab (Ola/Uber)', category: 'transport', co2PerUnit: 0.17, unit: 'km', icon: '🚕', tags: ['cab', 'private'] },
  { id: 'cycle', name: 'Bicycle', category: 'transport', co2PerUnit: 0, unit: 'km', icon: '🚲', tags: ['zero-emission'] },
  { id: 'walk', name: 'Walking', category: 'transport', co2PerUnit: 0, unit: 'km', icon: '🚶', tags: ['zero-emission'] },
  { id: 'flight-domestic', name: 'Domestic Flight', category: 'transport', co2PerUnit: 0.255, unit: 'km', icon: '✈️', tags: ['flight', 'high-impact'] },
  { id: 'flight-international', name: 'International Flight', category: 'transport', co2PerUnit: 0.195, unit: 'km', icon: '✈️', tags: ['flight', 'high-impact'] },
];

// ============================================================
// ENERGY — per kWh state-wise (kg CO₂)
// ============================================================
export interface StateEmissionFactor {
  state: string;
  co2PerKwh: number; // kg CO₂ per kWh
}

export const stateEmissionFactors: StateEmissionFactor[] = [
  { state: 'Madhya Pradesh', co2PerKwh: 0.85 },
  { state: 'Delhi', co2PerKwh: 0.87 },
  { state: 'Maharashtra', co2PerKwh: 0.79 },
  { state: 'Karnataka', co2PerKwh: 0.53 },
  { state: 'Tamil Nadu', co2PerKwh: 0.62 },
  { state: 'Uttar Pradesh', co2PerKwh: 0.91 },
  { state: 'Gujarat', co2PerKwh: 0.82 },
  { state: 'Kerala', co2PerKwh: 0.39 },
  { state: 'West Bengal', co2PerKwh: 0.94 },
  { state: 'Telangana', co2PerKwh: 0.72 },
  { state: 'Rajasthan', co2PerKwh: 0.88 },
  { state: 'Andhra Pradesh', co2PerKwh: 0.67 },
  { state: 'Punjab', co2PerKwh: 0.78 },
  { state: 'Haryana', co2PerKwh: 0.84 },
  { state: 'Bihar', co2PerKwh: 0.92 },
  { state: 'Jharkhand', co2PerKwh: 0.95 },
  { state: 'Odisha', co2PerKwh: 0.9 },
  { state: 'Chhattisgarh', co2PerKwh: 0.93 },
  { state: 'Assam', co2PerKwh: 0.55 },
  { state: 'Goa', co2PerKwh: 0.6 },
  { state: 'Uttarakhand', co2PerKwh: 0.45 },
  { state: 'Himachal Pradesh', co2PerKwh: 0.2 },
  { state: 'Jammu & Kashmir', co2PerKwh: 0.5 },
  { state: 'Sikkim', co2PerKwh: 0.18 },
  { state: 'Meghalaya', co2PerKwh: 0.48 },
  { state: 'Tripura', co2PerKwh: 0.65 },
  { state: 'Mizoram', co2PerKwh: 0.52 },
  { state: 'Manipur', co2PerKwh: 0.5 },
  { state: 'Nagaland', co2PerKwh: 0.55 },
  { state: 'Arunachal Pradesh', co2PerKwh: 0.3 },
];

export const energyEmissions: EmissionItem[] = [
  { id: 'electricity', name: 'Electricity', category: 'energy', co2PerUnit: 0.82, unit: 'kWh', icon: '⚡', tags: ['grid'] },
  { id: 'lpg-cylinder', name: 'LPG Gas Cylinder', category: 'energy', co2PerUnit: 42.5, unit: 'cylinder', icon: '🔥', tags: ['cooking', 'gas'] },
  { id: 'lpg-kg', name: 'LPG Gas', category: 'energy', co2PerUnit: 2.98, unit: 'kg', icon: '🔥', tags: ['cooking', 'gas'] },
  { id: 'png', name: 'Piped Natural Gas', category: 'energy', co2PerUnit: 2.0, unit: 'SCM', icon: '🔥', tags: ['cooking', 'gas'] },
  { id: 'ac-hour', name: 'Air Conditioner (1.5T)', category: 'energy', co2PerUnit: 1.23, unit: 'hour', icon: '❄️', tags: ['cooling'] },
  { id: 'fan-hour', name: 'Ceiling Fan', category: 'energy', co2PerUnit: 0.06, unit: 'hour', icon: '🌀', tags: ['cooling'] },
  { id: 'geyser', name: 'Water Heater / Geyser', category: 'energy', co2PerUnit: 1.64, unit: 'hour', icon: '🚿', tags: ['heating'] },
  { id: 'washing-machine', name: 'Washing Machine (1 load)', category: 'energy', co2PerUnit: 0.6, unit: 'load', icon: '🧺', tags: ['appliance'] },
  { id: 'induction', name: 'Induction Cooktop', category: 'energy', co2PerUnit: 0.82, unit: 'hour', icon: '🍳', tags: ['cooking', 'electric'] },
];

// ============================================================
// SHOPPING — per item (kg CO₂)
// ============================================================
export const shoppingEmissions: EmissionItem[] = [
  { id: 'tshirt', name: 'T-shirt / Top', category: 'shopping', co2PerUnit: 8.0, unit: 'item', icon: '👕', tags: ['clothing'] },
  { id: 'jeans', name: 'Jeans / Pants', category: 'shopping', co2PerUnit: 15.0, unit: 'item', icon: '👖', tags: ['clothing'] },
  { id: 'shirt-formal', name: 'Formal Shirt', category: 'shopping', co2PerUnit: 10.0, unit: 'item', icon: '👔', tags: ['clothing'] },
  { id: 'saree', name: 'Saree', category: 'shopping', co2PerUnit: 12.0, unit: 'item', icon: '👗', tags: ['clothing', 'indian'] },
  { id: 'kurta', name: 'Kurta / Kurti', category: 'shopping', co2PerUnit: 9.0, unit: 'item', icon: '👘', tags: ['clothing', 'indian'] },
  { id: 'shoes', name: 'Shoes / Footwear', category: 'shopping', co2PerUnit: 14.0, unit: 'pair', icon: '👟', tags: ['footwear'] },
  { id: 'smartphone', name: 'Smartphone', category: 'shopping', co2PerUnit: 70.0, unit: 'item', icon: '📱', tags: ['electronics'] },
  { id: 'laptop', name: 'Laptop', category: 'shopping', co2PerUnit: 350.0, unit: 'item', icon: '💻', tags: ['electronics'] },
  { id: 'tablet', name: 'Tablet', category: 'shopping', co2PerUnit: 100.0, unit: 'item', icon: '📱', tags: ['electronics'] },
  { id: 'tv', name: 'Television', category: 'shopping', co2PerUnit: 200.0, unit: 'item', icon: '📺', tags: ['electronics'] },
  { id: 'headphones', name: 'Headphones / Earbuds', category: 'shopping', co2PerUnit: 8.0, unit: 'item', icon: '🎧', tags: ['electronics'] },
  { id: 'fmcg-item', name: 'FMCG Item (general)', category: 'shopping', co2PerUnit: 0.5, unit: 'item', icon: '🛍️', tags: ['fmcg'] },
  { id: 'cosmetics', name: 'Cosmetics / Beauty Product', category: 'shopping', co2PerUnit: 3.0, unit: 'item', icon: '💄', tags: ['fmcg'] },
  { id: 'book', name: 'Book', category: 'shopping', co2PerUnit: 2.7, unit: 'item', icon: '📚', tags: ['paper'] },
  { id: 'furniture-small', name: 'Small Furniture Item', category: 'shopping', co2PerUnit: 50.0, unit: 'item', icon: '🪑', tags: ['furniture'] },
];

// ============================================================
// ALL EMISSIONS combined
// ============================================================
export const allEmissions: EmissionItem[] = [
  ...foodEmissions,
  ...transportEmissions,
  ...energyEmissions,
  ...shoppingEmissions,
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get emission factor for a specific item
 */
export function getEmissionFactor(itemId: string): EmissionItem | undefined {
  return allEmissions.find((item) => item.id === itemId);
}

/**
 * Calculate CO₂ for a given item and quantity
 */
export function calculateCO2(itemId: string, quantity: number): number {
  const item = getEmissionFactor(itemId);
  if (!item) return 0;
  return Math.round(item.co2PerUnit * quantity * 100) / 100;
}

/**
 * Get state-specific electricity emission factor
 */
export function getStateEmissionFactor(state: string): number {
  const factor = stateEmissionFactors.find(
    (s) => s.state.toLowerCase() === state.toLowerCase()
  );
  return factor?.co2PerKwh ?? 0.82; // India average fallback
}

/**
 * Calculate electricity CO₂ for a specific state
 */
export function calculateElectricityCO2(kWh: number, state: string): number {
  const factor = getStateEmissionFactor(state);
  return Math.round(kWh * factor * 100) / 100;
}

/**
 * Search emission items by name (fuzzy)
 */
export function searchEmissions(query: string, category?: EmissionCategory): EmissionItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  let items = allEmissions;
  if (category) {
    items = items.filter((item) => item.category === category);
  }

  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.id.includes(q) ||
      item.tags?.some((tag) => tag.includes(q))
  );
}

/**
 * Get items by category
 */
export function getItemsByCategory(category: EmissionCategory): EmissionItem[] {
  return allEmissions.filter((item) => item.category === category);
}

/**
 * Quick-log preset items — most common daily actions
 */
export const quickLogPresets: EmissionItem[] = [
  foodEmissions.find((i) => i.id === 'veg-thali')!,
  foodEmissions.find((i) => i.id === 'chai')!,
  foodEmissions.find((i) => i.id === 'rice-plate')!,
  transportEmissions.find((i) => i.id === 'metro')!,
  transportEmissions.find((i) => i.id === 'city-bus')!,
  transportEmissions.find((i) => i.id === 'auto-rickshaw')!,
  transportEmissions.find((i) => i.id === 'bike-petrol')!,
  transportEmissions.find((i) => i.id === 'car-petrol')!,
  foodEmissions.find((i) => i.id === 'chicken-biryani')!,
  foodEmissions.find((i) => i.id === 'dal')!,
  energyEmissions.find((i) => i.id === 'ac-hour')!,
  foodEmissions.find((i) => i.id === 'coffee')!,
];
