'use client';

// CarbonSense — Client-side state management with localStorage persistence
// Designed to work standalone (localStorage) and sync with Supabase when available

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { EmissionCategory } from './emission-factors';
import { calculateStreak } from './utils';
import type { BaselineResult, DietType, LifestyleType, EnergyType, TransportMode } from './baseline-calculator';

// ============================================================
// TYPES
// ============================================================

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  city: string;
  state: string;
  lifestyle: LifestyleType;
  dietType: DietType;
  transportModes: TransportMode[];
  energyType: EnergyType;
  monthlyElectricityUnits: number;
  hasAC: boolean;
  familySize: number;
  baselineFootprint: BaselineResult | null;
  monthlyBudgetKg: number;
  createdAt: string;
  onboardingCompleted: boolean;
}

export interface ActivityLog {
  id: string;
  userId: string;
  category: EmissionCategory;
  itemId: string;
  itemName: string;
  itemIcon: string;
  quantity: number;
  unit: string;
  co2Kg: number;
  loggedAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: EmissionCategory | 'mixed';
  targetReductionKg: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  participantCount: number;
  joined: boolean;
  userReductionKg: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface AIInsight {
  id: string;
  content: string;
  type: 'weekly' | 'nudge' | 'coach';
  generatedAt: string;
  actedOn: boolean;
}

export interface AppState {
  user: UserProfile | null;
  logs: ActivityLog[];
  challenges: Challenge[];
  chatMessages: ChatMessage[];
  insights: AIInsight[];
  theme: 'light' | 'dark';
  isLoading: boolean;
  isAuthenticated: boolean;
}

// ============================================================
// ACTIONS
// ============================================================

type AppAction =
  | { type: 'SET_USER'; payload: UserProfile }
  | { type: 'UPDATE_USER'; payload: Partial<UserProfile> }
  | { type: 'LOGOUT' }
  | { type: 'ADD_LOG'; payload: ActivityLog }
  | { type: 'DELETE_LOG'; payload: string }
  | { type: 'SET_LOGS'; payload: ActivityLog[] }
  | { type: 'SET_CHALLENGES'; payload: Challenge[] }
  | { type: 'JOIN_CHALLENGE'; payload: string }
  | { type: 'UPDATE_CHALLENGE_PROGRESS'; payload: { id: string; reductionKg: number } }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_CHAT_MESSAGES'; payload: ChatMessage[] }
  | { type: 'ADD_INSIGHT'; payload: AIInsight }
  | { type: 'SET_INSIGHTS'; payload: AIInsight[] }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'HYDRATE'; payload: Partial<AppState> };

// ============================================================
// INITIAL STATE
// ============================================================

const initialState: AppState = {
  user: null,
  logs: [],
  challenges: getDefaultChallenges(),
  chatMessages: [],
  insights: [],
  theme: 'dark',
  isLoading: false,
  isAuthenticated: false,
};

// ============================================================
// REDUCER
// ============================================================

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'LOGOUT':
      return { ...initialState, theme: state.theme };
    case 'ADD_LOG':
      return { ...state, logs: [action.payload, ...state.logs] };
    case 'DELETE_LOG':
      return {
        ...state,
        logs: state.logs.filter((l) => l.id !== action.payload),
      };
    case 'SET_LOGS':
      return { ...state, logs: action.payload };
    case 'SET_CHALLENGES':
      return { ...state, challenges: action.payload };
    case 'JOIN_CHALLENGE':
      return {
        ...state,
        challenges: state.challenges.map((c) =>
          c.id === action.payload
            ? { ...c, joined: true, participantCount: c.participantCount + 1 }
            : c
        ),
      };
    case 'UPDATE_CHALLENGE_PROGRESS':
      return {
        ...state,
        challenges: state.challenges.map((c) =>
          c.id === action.payload.id
            ? { ...c, userReductionKg: action.payload.reductionKg }
            : c
        ),
      };
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload],
      };
    case 'SET_CHAT_MESSAGES':
      return { ...state, chatMessages: action.payload };
    case 'ADD_INSIGHT':
      return { ...state, insights: [action.payload, ...state.insights] };
    case 'SET_INSIGHTS':
      return { ...state, insights: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'HYDRATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// ============================================================
// DEFAULT CHALLENGES
// ============================================================

function getDefaultChallenges(): Challenge[] {
  const now = new Date();
  const weekEnd = new Date(now);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const monthEnd = new Date(now);
  monthEnd.setDate(monthEnd.getDate() + 30);

  return [
    {
      id: 'meat-free-week',
      title: 'Meat-Free Week 🥬',
      description: 'Go vegetarian for 7 days and see how much CO₂ you save. Discover amazing plant-based Indian recipes!',
      category: 'food',
      targetReductionKg: 15,
      startDate: now.toISOString(),
      endDate: weekEnd.toISOString(),
      isActive: true,
      participantCount: 234,
      joined: false,
      userReductionKg: 0,
    },
    {
      id: 'car-free-monday',
      title: 'Car-Free Monday 🚇',
      description: 'Ditch the car every Monday. Use metro, bus, or cycle. Track your savings over the month!',
      category: 'transport',
      targetReductionKg: 10,
      startDate: now.toISOString(),
      endDate: monthEnd.toISOString(),
      isActive: true,
      participantCount: 156,
      joined: false,
      userReductionKg: 0,
    },
    {
      id: 'zero-waste-wed',
      title: 'Zero-Waste Wednesday ♻️',
      description: 'One day a week — zero single-use plastic, minimal food waste. Small steps, big impact.',
      category: 'shopping',
      targetReductionKg: 5,
      startDate: now.toISOString(),
      endDate: monthEnd.toISOString(),
      isActive: true,
      participantCount: 89,
      joined: false,
      userReductionKg: 0,
    },
    {
      id: 'transit-champion',
      title: 'Public Transit Champion 🏆',
      description: 'Use only public transport for 30 days. Compete with friends for the biggest reduction!',
      category: 'transport',
      targetReductionKg: 50,
      startDate: now.toISOString(),
      endDate: monthEnd.toISOString(),
      isActive: true,
      participantCount: 312,
      joined: false,
      userReductionKg: 0,
    },
    {
      id: 'energy-saver',
      title: 'Energy Saver Sprint ⚡',
      description: 'Reduce your electricity usage by 20% this month. Turn off ACs, switch to LEDs, unplug idle devices.',
      category: 'energy',
      targetReductionKg: 30,
      startDate: now.toISOString(),
      endDate: monthEnd.toISOString(),
      isActive: true,
      participantCount: 178,
      joined: false,
      userReductionKg: 0,
    },
  ];
}

// ============================================================
// CONTEXT
// ============================================================

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Computed values
  todayTotal: number;
  weeklyTotal: number;
  monthlyTotal: number;
  currentStreak: number;
  categoryBreakdown: Record<EmissionCategory, number>;
  budgetRemaining: number;
  budgetUsedPercent: number;
  todayLogs: ActivityLog[];
  weeklyLogs: ActivityLog[];
}

const AppContext = createContext<AppContextValue | null>(null);

// ============================================================
// PROVIDER
// ============================================================

const STORAGE_KEY = 'carbonsense-state';

function loadFromStorage(): Partial<AppState> | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore parse errors
  }
  return null;
}

function saveToStorage(state: AppState) {
  if (typeof window === 'undefined') return;
  try {
    const toSave = {
      user: state.user,
      logs: state.logs,
      challenges: state.challenges,
      chatMessages: state.chatMessages,
      insights: state.insights,
      theme: state.theme,
      isAuthenticated: state.isAuthenticated,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // ignore storage errors
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      dispatch({ type: 'HYDRATE', payload: stored });
    }
  }, []);

  // Save to localStorage on every state change
  useEffect(() => {
    if (state.user || state.logs.length > 0) {
      saveToStorage(state);
    }
  }, [state]);

  // Apply theme to document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', state.theme);
    }
  }, [state.theme]);

  // Computed values
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const weekStart = new Date(now);
  const dayOfWeek = weekStart.getDay();
  weekStart.setDate(weekStart.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  weekStart.setHours(0, 0, 0, 0);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const todayLogs = state.logs.filter(
    (l) => new Date(l.loggedAt) >= todayStart
  );
  const weeklyLogs = state.logs.filter(
    (l) => new Date(l.loggedAt) >= weekStart
  );
  const monthlyLogs = state.logs.filter(
    (l) => new Date(l.loggedAt) >= monthStart
  );

  const todayTotal = todayLogs.reduce((sum, l) => sum + l.co2Kg, 0);
  const weeklyTotal = weeklyLogs.reduce((sum, l) => sum + l.co2Kg, 0);
  const monthlyTotal = monthlyLogs.reduce((sum, l) => sum + l.co2Kg, 0);

  const currentStreak = calculateStreak(
    state.logs.map((l) => new Date(l.loggedAt))
  );

  const categoryBreakdown: Record<EmissionCategory, number> = {
    food: monthlyLogs
      .filter((l) => l.category === 'food')
      .reduce((s, l) => s + l.co2Kg, 0),
    transport: monthlyLogs
      .filter((l) => l.category === 'transport')
      .reduce((s, l) => s + l.co2Kg, 0),
    energy: monthlyLogs
      .filter((l) => l.category === 'energy')
      .reduce((s, l) => s + l.co2Kg, 0),
    shopping: monthlyLogs
      .filter((l) => l.category === 'shopping')
      .reduce((s, l) => s + l.co2Kg, 0),
  };

  const monthlyBudget = state.user?.monthlyBudgetKg ?? 150;
  const budgetRemaining = Math.max(0, monthlyBudget - monthlyTotal);
  const budgetUsedPercent = Math.min(100, (monthlyTotal / monthlyBudget) * 100);

  const value: AppContextValue = {
    state,
    dispatch,
    todayTotal,
    weeklyTotal,
    monthlyTotal,
    currentStreak,
    categoryBreakdown,
    budgetRemaining,
    budgetUsedPercent,
    todayLogs,
    weeklyLogs,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ============================================================
// HOOK
// ============================================================

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
