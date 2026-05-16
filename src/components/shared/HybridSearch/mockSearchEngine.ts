// src/components/shared/HybridSearch/mockSearchEngine.ts
import type { SearchResult } from './types';

// Simulamos una base de datos con diferentes casos
const mockDatabase: SearchResult[] = [
  { id: '1', name: 'Coca Cola Original 600ml', sku: 'CC-600', category: 'Bebidas', price: 18.50, stock: 24, matchType: 'trigram' },
  { id: '2', name: 'Coca Cola Sin Azúcar 600ml', sku: 'CC-LGT', category: 'Bebidas', price: 18.50, stock: 12, matchType: 'trigram' },
  { id: '3', name: 'Koka Kola (Error común)', sku: 'ERR-01', category: 'Bebidas', price: 18.50, stock: 5, matchType: 'phonetic' },
  { id: '4', name: 'Refresco Negro Azucarado', sku: 'SEM-99', category: 'Bebidas', price: 18.50, stock: 8, matchType: 'semantic' },
  { id: '5', name: 'Sabritas Sal 45g', sku: 'SAB-45', category: 'Botanas', price: 20.00, stock: 12, matchType: 'trigram' },
];

export const simulateHybridSearch = async (query: string): Promise<SearchResult[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const q = query.toLowerCase();
      if (!q) {
        resolve([]);
        return;
      }
      
      // Simulamos la lógica del backend: si pones "coca", el motor semántico
      // es lo suficientemente inteligente para devolver "Refresco Negro Azucarado"
      const results = mockDatabase.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.sku.toLowerCase().includes(q) ||
        (q === 'coca' && p.matchType === 'semantic') 
      );
      
      resolve(results);
    }, 20); // Simulamos 400ms de latencia de red
  });
};