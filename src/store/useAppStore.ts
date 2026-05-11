import { create } from 'zustand';
import { createSystemSlice, type SystemSlice } from './slices/createSystemSlice';
import { createCartSlice, type CartSlice } from './slices/createCartSlice';
import { createVoiceSlice, type VoiceSlice } from './slices/createVoiceSlice';

// Unimos todas las interfaces en un solo tipo global
type StoreState = SystemSlice & CartSlice & VoiceSlice;

export const useAppStore = create<StoreState>()((...a) => ({
  ...createSystemSlice(...a),
  ...createCartSlice(...a),
  ...createVoiceSlice(...a),
}));