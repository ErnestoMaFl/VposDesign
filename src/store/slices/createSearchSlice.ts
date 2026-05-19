import type { StateCreator } from 'zustand';
import type { StoreState } from '../useAppStore';
import { searchProducts } from '@/services/searchService';
import type { SearchArbitrationResult, SearchCandidate } from '@/types/search';

export type SearchUIState = 'idle' | 'loading' | 'success' | 'error';

export interface SearchSlice {
  // Resultado del último search ejecutado
  lastSearchResult: SearchArbitrationResult | null;
  searchUIState: SearchUIState;
  searchError: string | null;

  // El AbortController activo para cancelar requests obsoletas
  // No se persiste; vive solo en memoria del slice.
  _activeSearchController: AbortController | null;

  performSearch: (query: string) => Promise<SearchArbitrationResult>;
  clearSearch: () => void;
}

export const createSearchSlice: StateCreator<StoreState, [], [], SearchSlice> = (
  set,
  get
) => ({
  lastSearchResult: null,
  searchUIState: 'idle',
  searchError: null,
  _activeSearchController: null,

  performSearch: async (query: string) => {
    // Cancela cualquier request en vuelo (race-condition guard)
    const prev = get()._activeSearchController;
    if (prev) prev.abort();

    const controller = new AbortController();
    set({
      _activeSearchController: controller,
      searchUIState: 'loading',
      searchError: null,
    });

    try {
      const result = await searchProducts(query, { signal: controller.signal });
      // Solo aplicamos el resultado si seguimos siendo el controller activo
      if (get()._activeSearchController !== controller) {
        return result;
      }
      set({
        lastSearchResult: result,
        searchUIState: 'success',
        _activeSearchController: null,
      });
      return result;
    } catch (err) {
      if (get()._activeSearchController !== controller) {
        // Otro search nos reemplazó; no tocamos estado
        throw err;
      }
      const message = err instanceof Error ? err.message : 'Error desconocido';
      set({
        searchUIState: 'error',
        searchError: message,
        _activeSearchController: null,
      });
      throw err;
    }
  },

  clearSearch: () => {
    const prev = get()._activeSearchController;
    if (prev) prev.abort();
    set({
      lastSearchResult: null,
      searchUIState: 'idle',
      searchError: null,
      _activeSearchController: null,
    });
  },
});

// Helper para que el resto de la app pueda actuar sobre el winner
export function getWinnerFromResult(
  result: SearchArbitrationResult
): SearchCandidate | null {
  if (result.status !== 'winner' || !result.winner_id) return null;
  return result.candidates.find((c) => c.id === result.winner_id) ?? null;
}