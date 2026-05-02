import { create } from 'zustand';
import type { VoiceOrbState } from '@/types/voice';
import type { ConnectionState } from '@/types/system';
import type { CartStatus } from '@/types/cart';

export interface HomeMetrics {
  salesToday: number;
  salesTotal: number;
  trend: number;
  lowStockCount: number;
  pendingItems: number;
  topCategory: string;
  pendingOrders: number;
}

interface AppState {
  // --- VARIABLES DE ESTADO ---
  orbState: VoiceOrbState;
  stepMode: 'linear' | 'context';
  currentStep: number;
  showAmbiguity: boolean;
  connectionState: ConnectionState;
  cartStatus: CartStatus;
  homeMetrics: HomeMetrics;

  // --- ACCIONES GLOBALES ---
  setOrbState: (state: VoiceOrbState) => void;
  setStepMode: (mode: 'linear' | 'context') => void;
  setCurrentStep: (step: number) => void;
  setShowAmbiguity: (show: boolean) => void;
  setConnectionState: (state: ConnectionState) => void;
  setCartStatus: (status: CartStatus) => void;
  setHomeMetrics: (metrics: Partial<HomeMetrics>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Valores iniciales
  orbState: 'standby',
  stepMode: 'linear',
  currentStep: 0,
  showAmbiguity: false,
  connectionState: 'online',
  cartStatus: 'active',
  homeMetrics: {
    salesToday: 142,
    salesTotal: 4250.00,
    trend: 12,
    lowStockCount: 3,
    pendingItems: 18,
    topCategory: 'Bebidas',
    pendingOrders: 2,
  },

  // Mutadores
  setOrbState: (orbState) => set({ orbState }),
  setStepMode: (stepMode) => set({ stepMode }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setShowAmbiguity: (showAmbiguity) => set({ showAmbiguity }),
  setConnectionState: (connectionState) => set({ connectionState }),
  setCartStatus: (cartStatus) => set({ cartStatus }),
  setHomeMetrics: (metrics) => set((state) => ({ homeMetrics: { ...state.homeMetrics, ...metrics } })),
}));