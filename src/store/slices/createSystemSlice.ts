import type { StateCreator } from 'zustand';
import type { ConnectionState } from '@/types/system';

export interface HomeMetrics {
  salesToday: number;
  salesTotal: number;
  trend: number;
  lowStockCount: number;
  pendingItems: number;
  topCategory: string;
  pendingOrders: number;
}

export interface SystemSlice {
  appFlowState: 'login' | 'splash' | 'ready';
  connectionState: ConnectionState;
  homeMetrics: HomeMetrics;
  mockError: boolean;
  mockRecovery: boolean;
  
  setAppFlowState: (state: 'login' | 'splash' | 'ready') => void;
  setConnectionState: (state: ConnectionState) => void;
  setHomeMetrics: (metrics: Partial<HomeMetrics>) => void;
  setMockError: (val: boolean) => void;
  setMockRecovery: (val: boolean) => void;
}

export const createSystemSlice: StateCreator<SystemSlice> = (set) => ({
  appFlowState: 'login',
  connectionState: 'online',
  mockError: false,
  mockRecovery: false,
  homeMetrics: {
    salesToday: 142,
    salesTotal: 4250.00,
    trend: 12,
    lowStockCount: 3,
    pendingItems: 18,
    topCategory: 'Bebidas',
    pendingOrders: 2,
  },

  setAppFlowState: (appFlowState) => set({ appFlowState }),
  setConnectionState: (connectionState) => set({ connectionState }),
  setMockError: (mockError) => set({ mockError }),
  setMockRecovery: (mockRecovery) => set({ mockRecovery }),
  setHomeMetrics: (metrics) => set((state) => ({ 
    homeMetrics: { ...state.homeMetrics, ...metrics } 
  })),
});