import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, ScanLine, Loader2, Package } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { searchProducts, candidateToSearchResult } from '@/services/searchService';
import { formatCurrency } from '@/utils/formatters';
import { escapeRegExp, normalizeSearchText } from '@/utils/textNormalization';
import type { SearchResult, MatchEngine } from './types';
import type { SearchArbitrationResult } from '@/types/search';
import { BarcodeScannerModal } from './BarcodeScannerModal';

interface HybridSearchInputProps {
  value: string;
  onChange: (val: string) => void;
  isListening?: boolean;
  placeholder?: string;
  withDropdown?: boolean;
  onSelectResult?: (result: SearchResult) => void;
  onMicClick?: () => void;
  //Si true y el backend devuelve status='winner', se autoselecciona el resultado.
  autoSelectOnWinner?: boolean;
}

// Función HighlightText segura contra caracteres especiales y con colores de alto contraste
const HighlightText = ({ text, query }: { text: string; query: string }) => {
  if (!query) return <span className="text-[#a1a1aa]">{text}</span>;
  
  const safeQuery = escapeRegExp(query);
  const regex = new RegExp(`(${safeQuery})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <span key={i} className="text-white font-bold">{part}</span>
        ) : (
          <span key={i} className="text-[#a1a1aa]">{part}</span>
        )
      )}
    </span>
  );
};

export const HybridSearchInput: React.FC<HybridSearchInputProps> = ({ 
  value, 
  onChange, 
  isListening, 
  placeholder = "Buscar producto manual o escanear...",
  withDropdown = false,
  onSelectResult,
  onMicClick,
  autoSelectOnWinner = false
}) => {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, 200);

  const [results, setResults] = useState<SearchResult[]>([]);
  const [arbitrationStatus, setArbitrationStatus] = useState<
    SearchArbitrationResult['status'] | null
  >(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  useOnClickOutside(containerRef, () => setIsOpen(false));

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  useEffect(() => {
    if (value !== localValue && value !== debouncedValue) {
      setLocalValue(value);
    }
  }, [value]);

  // Búsqueda con prevención de Race Conditions usando AbortController
  useEffect(() => {
    if (!withDropdown) return;

    const normalizedQuery = normalizeSearchText(debouncedValue);

    if (!normalizedQuery) {
      setResults([]);
      setArbitrationStatus(null);
      setSearchError(null);
      setIsOpen(false);
      return;
    }

    const controller = new AbortController();
    let isCancelled = false;

    const fetchResults = async () => {
      setIsLoading(true);
      setSearchError(null);
      setIsOpen(true);

      try {
        const arbitration = await searchProducts(debouncedValue, {
          signal: controller.signal,
        });

        if (isCancelled) return;

        setArbitrationStatus(arbitration.status);
        const mapped = arbitration.candidates.map(candidateToSearchResult);
        setResults(mapped);

        // AUTO-AGREGAR si es winner y el componente está en modo carrito
        if (
          arbitration.status === 'winner' &&
          arbitration.winner_id &&
          onSelectResult &&
          autoSelectOnWinner
        ) {
          const winnerCandidate = arbitration.candidates.find(
            (c) => c.id === arbitration.winner_id
          );
          if (winnerCandidate) {
            // Damos un beat visual para que el usuario vea el match antes de cerrar
            setTimeout(() => {
              if (isCancelled) return;
              handleSelect(candidateToSearchResult(winnerCandidate));
            }, 250);
          }
        }
      } catch (err) {
        if (isCancelled) return;
        console.error('Error en búsqueda:', err);
        setSearchError(err instanceof Error ? err.message : 'Error desconocido');
        setResults([]);
        setArbitrationStatus(null);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    fetchResults();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [debouncedValue, withDropdown, autoSelectOnWinner]);

  // Scroll automático al navegar con el teclado (flechas)
  useEffect(() => {
    if (selectedIndex >= 0 && listboxRef.current) {
      const activeItem = listboxRef.current.children[selectedIndex] as HTMLElement;
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!withDropdown || !isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (result: SearchResult) => {
    if (onSelectResult) onSelectResult(result);
    setIsOpen(false);
    setLocalValue(''); 
    onChange('');
    inputRef.current?.blur();
  };

  const handleScanSuccess = (decodedText: string) => {
    setIsScannerOpen(false);
    setLocalValue(decodedText); 
  };

  const getBadgeConfig = (matchType: MatchEngine) => {
    switch (matchType) {
      case 'trigram': return { label: 'Trigrama', style: 'text-on-surface-variant border-surface-bright-edge/30 bg-surface-base' };
      case 'phonetic': return { label: 'Fonética', style: 'text-accent-navy border-accent-navy/30 bg-accent-navy/10' };
      case 'semantic': return { label: 'Semántica', style: 'text-accent-plum border-accent-plum/30 bg-accent-plum/10 shadow-[0_0_8px_rgba(92,66,117,0.3)]' };
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      
      {/* El Input */}
      <div 
        className={`relative flex items-center w-full bg-[#0B0D10] transition-colors z-50
        ${isOpen && withDropdown 
          ? 'border-t border-surface-bright-edge/40 shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] rounded-t-xl rounded-b-none' 
          : 'border border-surface-bright-edge/10 focus-within:border-surface-bright-edge/40 focus-within:shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] rounded-xl'
        }`}
      >
        <div className="pl-4 pr-2 text-on-surface-variant">
          {isLoading ? <Loader2 size={18} className="animate-spin text-accent-navy" /> : <Search size={18} />}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="search-results-listbox"
          aria-autocomplete="list"
          value={localValue}
          onChange={(e) => {
            setLocalValue(e.target.value);
            if (withDropdown && !isOpen && e.target.value) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (withDropdown && localValue) setIsOpen(true); }}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none py-4 text-on-surface font-utility text-base placeholder:text-on-surface-variant/50"
          autoComplete="off"
          spellCheck="false"
        />
        
        {/* ZONA DE BOTONES DERECHOS */}
        <div className="flex items-center gap-1 pr-3">
          <div className="flex gap-1 mr-2">
            <span className="w-5 h-5 flex items-center justify-center rounded bg-surface-base text-[9px] font-bold text-accent-sage border border-surface-bright-edge/20" title="Búsqueda por Trigramas">T</span>
            <span className="w-5 h-5 flex items-center justify-center rounded bg-surface-base text-[9px] font-bold text-accent-navy border border-surface-bright-edge/20" title="Búsqueda Fonética">F</span>
            <span className="w-5 h-5 flex items-center justify-center rounded bg-surface-base text-[9px] font-bold text-accent-plum border border-surface-bright-edge/20" title="Búsqueda Semántica">S</span>
          </div>

          <div className="w-[1px] h-6 bg-surface-bright-edge/30 mx-1" />
          
          <button 
            onClick={() => setIsScannerOpen(true)}
            className="p-2 text-on-surface-variant hover:text-accent-sage transition-colors focus:outline-none"
            title="Escanear Código de Barras"
          >
            <ScanLine size={20} />
          </button>
          
          <button 
            onClick={onMicClick}
            className={`p-2 transition-colors duration-300 focus:outline-none ${isListening ? 'text-accent-sage animate-pulse' : 'text-on-surface-variant hover:text-accent-sage'}`}
            title="Activar micrófono"
          >
            <Mic size={20} />
          </button>
        </div>
      </div>

      {/* RESULTADOS DEL DROPDOWN */}
      {withDropdown && isOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0B0D10] border border-surface-bright-edge/30 shadow-[0_40px_80px_rgba(0,0,0,0.95)] rounded-b-xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200 mt-[1px]">
          {searchError ? (
            <div className="p-6 text-center text-error font-utility text-sm">
              No se pudo conectar al servidor. Revisa tu conexión.
            </div>
          ) : isLoading && results.length === 0 ? (
            <div className="p-6 text-center text-on-surface-variant font-utility text-sm">
              Analizando catálogo...
            </div>
          ) : results.length > 0 ? (
            <>
              {/* Banner de estado de arbitraje */}
              {arbitrationStatus === 'winner' && autoSelectOnWinner && (
                <div className="px-5 py-2 bg-accent-sage/10 border-b border-accent-sage/20 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-sage animate-pulse" />
                  <span className="font-utility text-[10px] text-accent-sage uppercase tracking-widest">
                    Coincidencia exacta encontrada
                  </span>
                </div>
              )}
              {arbitrationStatus === 'ambiguous' && (
                <div className="px-5 py-2 bg-warning/10 border-b border-warning/20 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                  <span className="font-utility text-[10px] text-warning uppercase tracking-widest">
                    Varias coincidencias. Elige una:
                  </span>
                </div>
              )}

              <ul 
                id="search-results-listbox"
                ref={listboxRef}
                role="listbox" 
                className="max-h-[260px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-surface-bright-edge/50 [&::-webkit-scrollbar-thumb]:rounded-full py-2"
              >
                {results.map((result, index) => {
                  const isSelected = index === selectedIndex;
                  const badge = getBadgeConfig(result.matchType);

                  return (
                    <li
                      key={result.id}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(result)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between px-5 py-3.5 cursor-pointer transition-colors border-l-2 ${
                        isSelected ? 'bg-surface-container border-accent-navy shadow-inner' : 'bg-transparent border-transparent hover:bg-surface-low'
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded bg-[#181A1F] border border-surface-bright-edge/20 flex items-center justify-center text-surface-bright-edge shrink-0">
                          <Package size={20} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-utility text-[15px] truncate text-on-surface">
                            <HighlightText text={result.name} query={localValue} />
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-utility text-[10px] text-success-light uppercase tracking-widest">{result.sku}</span>
                            <span className="w-1 h-1 rounded-full bg-surface-bright-edge/50" />
                            <span className="font-utility text-[10px] text-on-surface-variant truncate">{result.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end shrink-0 pl-4 gap-1.5">
                        <span className="font-narrative text-xl text-[#e3e2e6] leading-none">{formatCurrency(result.price)}</span>
                        <span className={`font-utility text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border ${badge.style}`}>
                          {badge.label}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <div className="p-6 text-center text-on-surface-variant font-utility text-sm">
              No encontré "{localValue}" en tu catálogo.
            </div>
          )}
        </div>
      )}

      {isScannerOpen && (
        <BarcodeScannerModal 
          onClose={() => setIsScannerOpen(false)} 
          onScanSuccess={handleScanSuccess} 
        />
      )}
    </div>
  );
};