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

export type AppFlowState = 'login' | 'splash' | 'ready';

const STORAGE_KEY = 'vpos:appFlowState';

/**
 * Lee el estado inicial del flujo desde sessionStorage.
 * sessionStorage sobrevive recargas pero NO sobrevive al cierre de pestaña,
 * que es justo el comportamiento que queremos: F5 mantiene login, cerrar la
 * pestaña obliga a relogear.
 */
const getInitialAppFlowState = (): AppFlowState => {
  if (typeof window === 'undefined') return 'login';
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === 'ready' || stored === 'splash' || stored === 'login') {
      // Si la sesión anterior se quedó en 'splash' por una recarga durante el
      // boot, mejor volvemos a 'login' para no quedarnos atorados ahí.
      return stored === 'splash' ? 'login' : stored;
    }
  } catch {
    // sessionStorage puede fallar en modo incógnito muy restrictivo
  }
  return 'login';
};

export interface SystemSlice {
  appFlowState: AppFlowState;
  connectionState: ConnectionState;
  homeMetrics: HomeMetrics;
  mockError: boolean;
  mockRecovery: boolean;

  setAppFlowState: (state: AppFlowState) => void;
  setConnectionState: (state: ConnectionState) => void;
  setHomeMetrics: (metrics: Partial<HomeMetrics>) => void;
  setMockError: (val: boolean) => void;
  setMockRecovery: (val: boolean) => void;
  logout: () => void;
}

export const createSystemSlice: StateCreator<SystemSlice> = (set) => ({
  appFlowState: getInitialAppFlowState(),
  connectionState: 'online',
  mockError: false,
  mockRecovery: false,
  homeMetrics: {
    salesToday: 142,
    salesTotal: 4250.0,
    trend: 12,
    lowStockCount: 3,
    pendingItems: 18,
    topCategory: 'Bebidas',
    pendingOrders: 2,
  },

  setAppFlowState: (appFlowState) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, appFlowState);
    } catch {
      // Ignoramos errores de quota o modo privado
    }
    set({ appFlowState });
  },

  setConnectionState: (connectionState) => set({ connectionState }),
  setMockError: (mockError) => set({ mockError }),
  setMockRecovery: (mockRecovery) => set({ mockRecovery }),
  setHomeMetrics: (metrics) =>
    set((state) => ({ homeMetrics: { ...state.homeMetrics, ...metrics } })),

  /**
   * Cierra sesión limpiando la persistencia.
   * El botón "Cerrar Sesión" del SystemSidebar debe llamar a esto,
   * no a setAppFlowState('login') directamente.
   */
  logout: () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignorar
    }
    set({ appFlowState: 'login' });
  },
});