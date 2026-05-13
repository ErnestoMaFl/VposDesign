import type { StateCreator } from 'zustand';
import type { InventoryMode, ScanLogItem } from '@/types/inventory';
import type { StoreState } from '../useAppStore'; 

export interface InventorySlice {
  inventoryMode: InventoryMode;
  scannedLogs: ScanLogItem[];
  isScanningPaused: boolean; // Para detener el dictado si hay ambigüedad

  setInventoryMode: (mode: InventoryMode) => void;
  clearScanLogs: () => void;
  addScanLog: (item: ScanLogItem) => void;
  setScanningPaused: (paused: boolean) => void;
  
  // Acciones exclusivas del Mock MVP
  startMockScanningLoop: (keepState?: boolean) => void;
  stopMockScanningLoop: () => void;
  resumeMockScanningLoop: (resolvedItemName: string) => void; // Para cuando se resuelva la ambigüedad
  resetInventory: () => void;
}

let mockTimeout: ReturnType<typeof setTimeout> | null = null;
let mockStep = 0;

const mockDictations = [
  { text: "aceite doce", name: "Aceite La Gloria 1L", old: 10, new: 12 },
  { text: "azúcar cero", name: "Azúcar Zulka 1kg", old: 5, new: 0 },
  { text: "sabritas tres", name: "Sabritas Sal 45g", old: 8, new: 11 }, // Nuevo
  { text: "agua veinticinco", name: "Agua Ciel 1L", old: 15, new: 25 }, // Nuevo
  { text: "coca", ambiguity: true }, // ⚠️ Aquí detonaremos la ambigüedad
  { text: "jabón zote cinco", name: "Jabón Zote Rosa 400g", old: 2, new: 5 },
  { text: "azúcar cero", name: "Azúcar Zulka 1kg", old: 5, new: 0 },
  { text: "sabritas tres", name: "Sabritas Sal 45g", old: 8, new: 11 }, // Nuevo
  { text: "agua veinticinco", name: "Agua Ciel 1L", old: 15, new: 25 }, // Nuevo
];

export const createInventorySlice: StateCreator<
  StoreState,
  [],
  [],
  InventorySlice
> = (set, get) => ({
  inventoryMode: 'selection',
  scannedLogs: [],
  isScanningPaused: false,

  setInventoryMode: (mode) => set({ inventoryMode: mode }),
  clearScanLogs: () => set({ scannedLogs: [] }),
  addScanLog: (item) => set((state) => ({ scannedLogs: [item, ...state.scannedLogs] })), 
  setScanningPaused: (paused) => set({ isScanningPaused: paused }),

  // Recibe keepState (por defecto falso)
  startMockScanningLoop: (keepState = false) => {
    if (!keepState) {
      // Solo reiniciamos la pila si es un inicio desde cero
      mockStep = 0;
      set({ scannedLogs: [], inventoryMode: 'scanning', isScanningPaused: false });
    } else {
      // Si estamos reanudando, solo quitamos la pausa
      set({ inventoryMode: 'scanning', isScanningPaused: false });
    }
    
    get().setOrbState('listening');

    const loop = () => {
      if (get().isScanningPaused) return;

      if (mockStep >= mockDictations.length) {
        get().setOrbState('success');
        setTimeout(() => get().setOrbState('standby'), 1500);
        return; 
      }

      const current = mockDictations[mockStep];
      get().setOrbState('processing');

      setTimeout(() => {
        if (current.ambiguity) {
          get().setScanningPaused(true);
          get().setOrbState('ambiguity');
          get().setShowAmbiguity(true);
        } else {
          get().addScanLog({
            id: `scan-${Date.now()}-${mockStep}`,
            name: current.name!,
            oldQuantity: current.old!,
            newQuantity: current.new!,
            delta: current.new! - current.old!,
            status: 'success',
            rawTranscript: current.text
          });
          get().setOrbState('success');
          
          setTimeout(() => get().setOrbState('listening'), 600);
          
          mockStep++;
          mockTimeout = setTimeout(loop, 2500); 
        }
      }, 1000); 
    };

    mockTimeout = setTimeout(loop, 1000);
  },

  stopMockScanningLoop: () => {
    if (mockTimeout) clearTimeout(mockTimeout);
    set({ isScanningPaused: false, inventoryMode: 'summary' });
    get().setOrbState('standby');
  },

  resumeMockScanningLoop: (resolvedItemName: string) => {
    get().setShowAmbiguity(false);
    get().setOrbState('success');
    
    get().addScanLog({
      id: `scan-${Date.now()}-resolved`,
      name: resolvedItemName,
      oldQuantity: 24, 
      newQuantity: 25,
      delta: 1,
      status: 'success',
      rawTranscript: "coca" // Dejamos lo que dijo crudo
    });

    set({ isScanningPaused: false });
    mockStep++;
    
    setTimeout(() => {
      get().setOrbState('listening');
      // LE PASAMOS TRUE PARA QUE NO BORRE EL HISTORIAL
      get().startMockScanningLoop(true); 
    }, 1000);
  },

  resetInventory: () => {
    if (mockTimeout) {
      clearTimeout(mockTimeout);
      mockTimeout = null;
    }
    set({ 
      inventoryMode: 'selection', 
      scannedLogs: [], 
      isScanningPaused: false 
    });
    get().setOrbState('standby');
    get().setShowAmbiguity(false);
  },
});