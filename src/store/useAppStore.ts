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

export interface PausedProcess {
  id: string;
  name: string;
  itemCount: number;
  total: number;
  timeAgo: string;
  details: string;
}

interface AppState {
  orbState: VoiceOrbState;
  stepMode: 'linear' | 'context';
  currentStep: number;
  showAmbiguity: boolean;
  connectionState: ConnectionState;
  cartStatus: CartStatus;
  homeMetrics: HomeMetrics;
  pausedProcesses: PausedProcess[];
  appFlowState: 'login' | 'splash' | 'ready';

  setOrbState: (state: VoiceOrbState) => void;
  setStepMode: (mode: 'linear' | 'context') => void;
  setCurrentStep: (step: number) => void;
  setShowAmbiguity: (show: boolean) => void;
  setConnectionState: (state: ConnectionState) => void;
  setCartStatus: (status: CartStatus) => void;
  setHomeMetrics: (metrics: Partial<HomeMetrics>) => void;
  setAppFlowState: (state: 'login' | 'splash' | 'ready') => void;

  
  // --- NUEVOS MUTADORES DE LA PILA ---
  addMockPausedProcess: () => void;
  removePausedProcess: (id: string) => void; // <-- NUEVO
  clearPausedProcesses: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  orbState: 'standby',
  stepMode: 'linear',
  currentStep: 0,
  showAmbiguity: false,
  connectionState: 'online',
  cartStatus: 'active',
  appFlowState: 'login',
  homeMetrics: {
    salesToday: 142,
    salesTotal: 4250.00,
    trend: 12,
    lowStockCount: 3,
    pendingItems: 18,
    topCategory: 'Bebidas',
    pendingOrders: 2,
  },
  
  pausedProcesses: [],

  setOrbState: (orbState) => set({ orbState }),
  setStepMode: (stepMode) => set({ stepMode }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setShowAmbiguity: (showAmbiguity) => set({ showAmbiguity }),
  setConnectionState: (connectionState) => set({ connectionState }),
  setCartStatus: (cartStatus) => set({ cartStatus }),
  setHomeMetrics: (metrics) => set((state) => ({ homeMetrics: { ...state.homeMetrics, ...metrics } })),
  setAppFlowState: (appFlowState) => set({ appFlowState }),

  addMockPausedProcess: () => set((state) => {
    const isSale = state.pausedProcesses.length % 2 === 0;
    // Generamos un texto largo cada 3 procesos para probar la lógica del minimodal
    const isLongDetails = state.pausedProcesses.length % 3 === 0;
    
    const detailsText = isLongDetails 
      ? "El cliente fue a su auto a buscar la cartera. Dejó apartados: 3x Cemento Cruz Azul 50kg, 10x Varilla 3/8, 2x Clavos 2 pulgadas. Aplicar descuento de mayoreo si regresa en menos de 15 minutos." 
      : (isSale ? "2x Sabritas Sal, 1x Coca Cola. Cliente frecuente." : "Revisión pasillo 3. Faltan etiquetas rojas.");

    const newProcess: PausedProcess = {
      id: isSale ? `#VTA-00${42 + state.pausedProcesses.length}` : `#CONS-00${1 + state.pausedProcesses.length}`,
      name: isSale ? 'Venta Pausada' : 'Consulta Inventario',
      itemCount: isSale ? 3 : 0,
      total: isSale ? 97.50 : 0,
      timeAgo: 'Ahorita',
      details: detailsText
    };
    return { pausedProcesses: [newProcess, ...state.pausedProcesses] };
  }),
  
  removePausedProcess: (id) => set((state) => ({
    pausedProcesses: state.pausedProcesses.filter(p => p.id !== id)
  })),

  clearPausedProcesses: () => set({ pausedProcesses: [] }),
}));