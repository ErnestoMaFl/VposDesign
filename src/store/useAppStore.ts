import { create } from 'zustand';
import type { VoiceOrbState } from '@/types/voice';
import type { ConnectionState } from '@/types/system';
import type { CartStatus } from '@/types/cart';

interface AppState {
  // --- VARIABLES DE ESTADO ---
  orbState: VoiceOrbState;
  stepMode: 'linear' | 'context';
  currentStep: number;
  showAmbiguity: boolean;
  connectionState: ConnectionState;
  cartStatus: CartStatus;

  // --- ACCIONES GLOBALES ---
  setOrbState: (state: VoiceOrbState) => void;
  setStepMode: (mode: 'linear' | 'context') => void;
  setCurrentStep: (step: number) => void;
  setShowAmbiguity: (show: boolean) => void;
  setConnectionState: (state: ConnectionState) => void;
  setCartStatus: (status: CartStatus) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Valores iniciales
  orbState: 'standby',
  stepMode: 'linear',
  currentStep: 0,
  showAmbiguity: false,
  connectionState: 'online',
  cartStatus: 'active',

  // Mutadores
  setOrbState: (orbState) => set({ orbState }),
  setStepMode: (stepMode) => set({ stepMode }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setShowAmbiguity: (showAmbiguity) => set({ showAmbiguity }),
  setConnectionState: (connectionState) => set({ connectionState }),
  setCartStatus: (cartStatus) => set({ cartStatus }),
}));