// Los tres motores de nuestra arquitectura
export type MatchEngine = 'trigram' | 'phonetic' | 'semantic';

// Lo que el buscador espera recibir (independiente de si viene de mock o DB)
export interface SearchResult {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  matchType: MatchEngine;
}