/**
 * Servicio de búsqueda de productos.
 *
 * Llama al endpoint POST /products/search del backend, que ya aplica
 * arbitraje (winner/ambiguous/no_match) usando Meilisearch.
 *
 * El servicio NO decide qué hacer con el resultado; eso es responsabilidad
 * del store/UI. Solo entrega el contrato tipado.
 */

import { apiClient, ApiError } from './apiClient';
import type {
  SearchArbitrationResult,
  SearchRequest,
} from '@/types/search';

const STORE_ID = import.meta.env.VITE_STORE_ID;

if (!STORE_ID) {
  throw new Error('VITE_STORE_ID no está definido en .env');
}

export async function searchProducts(
  query: string,
  opts: {
    storeId?: string;
    limit?: number;
    categoryFilter?: string | null;
    signal?: AbortSignal;
  } = {}
): Promise<SearchArbitrationResult> {
  const trimmed = query.trim();

  // El backend ya rechaza queries vacíos con 422, pero cortamos antes para
  // no gastar un round-trip.
  if (!trimmed) {
    return {
      status: 'no_match',
      query: '',
      winner_id: null,
      candidates: [],
      processing_time_ms: 0,
      thresholds_used: {},
    };
  }

  const body: SearchRequest = {
    query: trimmed,
    store_id: opts.storeId ?? STORE_ID,
    limit: opts.limit ?? 5,
    category_filter: opts.categoryFilter ?? null,
  };

  try {
    return await apiClient.post<SearchArbitrationResult>(
      '/products/search',
      body,
      { signal: opts.signal, timeoutMs: 5000 }
    );
  } catch (err) {
    // Para que el caller (input) decida si mostrar "sin conexión" o reintentar.
    // No envolvemos en otro error para preservar el code de ApiError.
    if (err instanceof ApiError && err.code === 'ABORTED') {
      // Devolvemos un resultado vacío en lugar de propagar el abort, para
      // que el dropdown no se rompa visualmente cuando el usuario sigue tecleando.
      return {
        status: 'no_match',
        query: trimmed,
        winner_id: null,
        candidates: [],
        processing_time_ms: 0,
        thresholds_used: {},
      };
    }
    throw err;
  }
}

/**
 * Adaptador: convierte un SearchCandidate del backend al SearchResult
 * que espera el componente HybridSearchInput actual.
 *
 * Lo mantenemos aquí para no tener que reescribir el componente entero;
 * el componente sigue consumiendo el tipo SearchResult viejo.
 */
import type { SearchResult, MatchEngine } from '@/components/shared/HybridSearch/types';
import type { SearchCandidate } from '@/types/search';

export function candidateToSearchResult(c: SearchCandidate): SearchResult {
  // Como ahora hay un solo motor (Meilisearch), elegimos el "engine" a mostrar
  // según el score. Es puramente cosmético para mantener los badges T/F/S.
  const score = c._rankingScore ?? c.rankingScore ?? 0;
  let matchType: MatchEngine = 'trigram';
  if (score >= 0.85) matchType = 'trigram';      // Match muy alto = exacto
  else if (score >= 0.65) matchType = 'phonetic'; // Match medio = fuzzy
  else matchType = 'semantic';                    // Match bajo = semántico

  return {
    id: c.id,
    name: c.name,
    sku: c.sku ?? '',
    category: c.category_name ?? 'Sin categoría',
    price: c.price_sale,
    stock: c.stock_quantity,
    matchType,
  };
}