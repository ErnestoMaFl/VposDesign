import { create } from 'zustand';
import { createSystemSlice, type SystemSlice } from './slices/createSystemSlice';
import { createCartSlice, type CartSlice } from './slices/createCartSlice';
import { createVoiceSlice, type VoiceSlice } from './slices/createVoiceSlice';
import { createInventorySlice, type InventorySlice } from './slices/createInventorySlice';

// Unimos todas las interfaces en un solo tipo global
export type StoreState = SystemSlice & CartSlice & VoiceSlice & InventorySlice;

export const useAppStore = create<StoreState>()((...a) => ({
  ...createSystemSlice(...a),
  ...createCartSlice(...a),
  ...createVoiceSlice(...a),
  ...createInventorySlice(...a),
}));