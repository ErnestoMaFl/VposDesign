import type { StateCreator } from 'zustand';
import type { StoreState } from '../useAppStore';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  priceCost: number;
  priceSale: number;
  stock: number;
  minStock: number;
  unit: string;
  aiAliases: string[];
}

export type ManagementViewMode = 'list' | 'edit' | 'create';
export type FormTab = 'basic' | 'pricing' | 'stock' | 'ai';

export interface ManagementSlice {
  catalog: Product[];
  viewMode: ManagementViewMode;
  activeProductId: string | null;
  searchQuery: string;
  activeTab: FormTab;
  isSearching: boolean;

  setSearchQuery: (query: string) => void;
  openEditProduct: (id: string) => void;
  openCreateProduct: () => void;
  closeForm: () => void;
  setActiveTab: (tab: FormTab) => void;
  updateActiveProductField: (field: keyof Product, value: any) => void;
  saveProduct: () => void;
  
  simulateVoiceSearch: (query: string) => void;
  simulateVoiceFieldEdit: (field: keyof Product, value: any) => void;
}

const mockCatalog: Product[] = [
  { id: 'p1', sku: 'CC-600', name: 'Coca Cola Original 600ml', category: 'Bebidas', priceCost: 11.50, priceSale: 18.50, stock: 24, minStock: 10, unit: 'Pieza', aiAliases: ['coca', 'coquita'] },
  { id: 'p2', sku: 'SAB-45', name: 'Sabritas Sal 45g', category: 'Botanas', priceCost: 14.00, priceSale: 20.00, stock: 12, minStock: 5, unit: 'Pieza', aiAliases: ['papas'] },
  { id: 'p3', sku: 'AZ-1KG', name: 'Azúcar Zulka 1kg', category: 'Abarrotes', priceCost: 22.00, priceSale: 28.00, stock: 5, minStock: 10, unit: 'Kg', aiAliases: ['azucar blanca'] },
  { id: 'p4', sku: 'ACE-1L', name: 'Aceite La Gloria 1L', category: 'Abarrotes', priceCost: 38.00, priceSale: 45.00, stock: 8, minStock: 5, unit: 'Litro', aiAliases: ['aceite'] },
];

export const createManagementSlice: StateCreator<StoreState, [], [], ManagementSlice> = (set, get) => ({
  catalog: mockCatalog,
  viewMode: 'list',
  activeProductId: null,
  searchQuery: '',
  activeTab: 'basic',
  isSearching: false,

  setSearchQuery: (query) => set({ searchQuery: query }),
  openEditProduct: (id) => set({ viewMode: 'edit', activeProductId: id, activeTab: 'basic' }),
  openCreateProduct: () => set((state) => {
    const newId = `temp-${Date.now()}`;
    const emptyProduct: Product = {
      id: newId, sku: '', name: '', category: '', priceCost: 0, priceSale: 0, stock: 0, minStock: 0, unit: 'Pieza', aiAliases: []
    };
    return { 
      catalog: [emptyProduct, ...state.catalog], // Lo metemos al catálogo
      viewMode: 'create', 
      activeProductId: newId, // Le decimos al formulario que edite este nuevo
      activeTab: 'basic' 
    };
  }),
  closeForm: () => set((state) => {
    // Si estábamos creando uno nuevo (ID temporal) y lo descartamos, lo borramos de la memoria
    const isTemp = state.activeProductId?.startsWith('temp-');
    return { 
      viewMode: 'list', 
      activeProductId: null,
      catalog: isTemp ? state.catalog.filter(p => p.id !== state.activeProductId) : state.catalog
    };
  }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  updateActiveProductField: (field, value) => set((state) => {
    if (!state.activeProductId) return state;
    return { 
      catalog: state.catalog.map(p => p.id === state.activeProductId ? { ...p, [field]: value } : p)
    };
  }),

  saveProduct: () => set({ viewMode: 'list', activeProductId: null }),

  simulateVoiceSearch: (query) => {
    set({ isSearching: true, searchQuery: query });
    get().setOrbState('processing');
    setTimeout(() => {
      set({ isSearching: false });
      get().setOrbState('success');
      setTimeout(() => get().setOrbState('standby'), 1000);
    }, 800);
  },

  simulateVoiceFieldEdit: (field, value) => {
    get().setOrbState('processing');
    setTimeout(() => {
      get().updateActiveProductField(field, value);
      get().setOrbState('success');
      setTimeout(() => get().setOrbState('standby'), 1000);
    }, 600);
  }
});