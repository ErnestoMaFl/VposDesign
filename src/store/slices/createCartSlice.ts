import type { StateCreator } from 'zustand';
import type { CartStatus } from '@/types/cart'

export interface PausedProcess {
  id: string;
  name: string;
  itemCount: number;
  total: number;
  timeAgo: string;
  details: string;
}

export interface CartSlice {
  cartStatus: CartStatus;
  stepMode: 'linear' | 'context';
  currentStep: number;
  pausedProcesses: PausedProcess[];

  setCartStatus: (status: CartStatus) => void;
  setStepMode: (mode: 'linear' | 'context') => void;
  setCurrentStep: (step: number) => void;
  addMockPausedProcess: () => void;
  removePausedProcess: (id: string) => void;
  clearPausedProcesses: () => void;
}

export const createCartSlice: StateCreator<CartSlice> = (set) => ({
  cartStatus: 'active',
  stepMode: 'linear',
  currentStep: 0,
  pausedProcesses: [],

  setCartStatus: (cartStatus) => set({ cartStatus }),
  setStepMode: (stepMode) => set({ stepMode }),
  setCurrentStep: (currentStep) => set({ currentStep }),

  addMockPausedProcess: () => set((state) => {
    const isSale = state.pausedProcesses.length % 2 === 0;
    const isLongDetails = state.pausedProcesses.length % 3 === 0;
    const detailsText = isLongDetails 
      ? "El cliente fue a su auto a buscar la cartera. Dejó apartados: 3x Cemento Cruz Azul 50kg, 10x Varilla 3/8." 
      : (isSale ? "2x Sabritas Sal, 1x Coca Cola. Cliente frecuente." : "Revisión pasillo 3. Faltan etiquetas.");

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
});