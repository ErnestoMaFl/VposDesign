import { create } from 'zustand';
import { createSystemSlice, type SystemSlice } from './slices/createSystemSlice';
import { createCartSlice, type CartSlice } from './slices/createCartSlice';
import { createVoiceSlice, type VoiceSlice } from './slices/createVoiceSlice';
import { createInventorySlice, type InventorySlice } from './slices/createInventorySlice';
import { createAnalyticsSlice, type AnalyticsSlice } from './slices/createAnalyticsSlice';
import { createManagementSlice, type ManagementSlice } from './slices/createManagementSlice';
import { createSearchSlice, type SearchSlice } from './slices/createSearchSlice';
import { createSaleSlice, type SaleSlice } from './slices/createSaleSlice';

export type StoreState =
  & SystemSlice
  & CartSlice
  & VoiceSlice
  & InventorySlice
  & AnalyticsSlice
  & ManagementSlice
  & SearchSlice
  & SaleSlice;

export const useAppStore = create<StoreState>()((...a) => ({
  ...createSystemSlice(...a),
  ...createCartSlice(...a),
  ...createVoiceSlice(...a),
  ...createInventorySlice(...a),
  ...createAnalyticsSlice(...a),
  ...createManagementSlice(...a),
  ...createSearchSlice(...a),
  ...createSaleSlice(...a),
}));