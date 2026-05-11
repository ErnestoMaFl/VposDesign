import type { StateCreator } from 'zustand';
import type { VoiceOrbState, InterpretationItem } from '@/types/voice';

export interface VoiceSlice {
  orbState: VoiceOrbState;
  showAmbiguity: boolean;
  interpretations: InterpretationItem[];
  
  setOrbState: (state: VoiceOrbState) => void;
  setShowAmbiguity: (show: boolean) => void;
  setInterpretations: (items: InterpretationItem[]) => void;
}

export const createVoiceSlice: StateCreator<VoiceSlice> = (set) => ({
  orbState: 'standby',
  showAmbiguity: false,
  interpretations: [],

  setOrbState: (orbState) => set({ orbState }),
  setShowAmbiguity: (showAmbiguity) => set({ showAmbiguity }),
  setInterpretations: (interpretations) => set({ interpretations }),
});