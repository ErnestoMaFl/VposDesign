import { create } from 'zustand';
import { createSystemSlice, type SystemSlice } from './slices/createSystemSlice';
import { createCartSlice, type CartSlice } from './slices/createCartSlice';
import { createVoiceSlice, type VoiceSlice } from './slices/createVoiceSlice';
import { createInventorySlice, type InventorySlice } from './slices/createInventorySlice';
import { createAnalyticsSlice, type AnalyticsSlice } from './slices/createAnalyticsSlice'; 
import { createManagementSlice, type ManagementSlice } from './slices/createManagementSlice'; 


export type StoreState = SystemSlice & CartSlice & VoiceSlice & InventorySlice & AnalyticsSlice & ManagementSlice;

export const useAppStore = create<StoreState>()((...a) => ({
  ...createSystemSlice(...a),
  ...createCartSlice(...a),
  ...createVoiceSlice(...a),
  ...createInventorySlice(...a),
  ...createAnalyticsSlice(...a), 
  ...createManagementSlice(...a),
}));