/**
 * Contrato del endpoint POST /api/v1/products/search
 * Espejo del schema SearchArbitrationResult del backend (Fase 1.2).
 */

export type SearchStatus = 'winner' | 'ambiguous' | 'no_match';

/**
 * Forma del candidato que devuelve Meilisearch a través del backend.
 * Es un superset del MeiliProductDocument; incluye campos calculados como _rankingScore.
 */
export interface SearchCandidate {
  id: string;
  store_id: string;
  name: string;
  sku?: string | null;
  barcode?: string | null;
  brand?: string | null;
  natural_description?: string | null;
  category_id?: string | null;
  category_name?: string | null;
  synonyms: string[];
  voice_aliases: string[];
  price_sale: number;
  price_cost: number;
  stock_quantity: number;
  unit_of_measure: string;
  is_bulk: boolean;
  is_active: boolean;
  image_url?: string | null;
  _rankingScore?: number;
  rankingScore?: number;
}

export interface SearchArbitrationResult {
  status: SearchStatus;
  query: string;
  winner_id: string | null;
  candidates: SearchCandidate[];
  processing_time_ms: number;
  thresholds_used: Record<string, number>;
}

export interface SearchRequest {
  query: string;
  store_id: string;
  limit?: number;
  category_filter?: string | null;
}