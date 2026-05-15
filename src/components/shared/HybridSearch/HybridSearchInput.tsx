import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, ScanLine, Loader2, Package } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { simulateHybridSearch } from './mockSearchEngine';
import { formatCurrency } from '@/utils/formatters';
import type { SearchResult, MatchEngine } from './types';
import { BarcodeScannerModal } from './BarcodeScannerModal';

interface HybridSearchInputProps {
  value: string;
  onChange: (val: string) => void;
  isListening?: boolean;
  placeholder?: string;
  
  withDropdown?: boolean;
  onSelectResult?: (result: SearchResult) => void;
}

const HighlightText = ({ text, query }: { text: string; query: string }) => {
  if (!query) return <span className="text-on-surface-variant">{text}</span>;
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <span key={i} className="text-[#e3e2e6] font-bold">{part}</span>
        ) : (
          <span key={i} className="text-on-surface-variant">{part}</span>
        )
      )}
    </span>
  );
};

export const HybridSearchInput: React.FC<HybridSearchInputProps> = ({ 
  value, 
  onChange, 
  isListening, 
  placeholder = "Busca por nombre, SKU o alias...",
  withDropdown = false,
  onSelectResult
}) => {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, 300);

  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useOnClickOutside(containerRef, () => setIsOpen(false));

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  useEffect(() => {
    if (value !== localValue && value !== debouncedValue) {
      setLocalValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (!withDropdown) return;
    if (!debouncedValue.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      setIsOpen(true);
      const data = await simulateHybridSearch(debouncedValue);
      setResults(data);
      setIsLoading(false);
      setSelectedIndex(-1);
    };
    fetchResults();
  }, [debouncedValue, withDropdown]);

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
    <div ref={containerRef} className="relative w-full max-w-2xl">
      {/* TU DISEÑO ORIGINAL INTACTO */}
      <div className={`relative flex items-center w-full bg-surface-recessed shadow-inner transition-colors z-50
        ${isOpen && withDropdown 
          ? 'border-t border-accent-navy/50 shadow-[inset_0_0_15px_rgba(63,90,122,0.1)] rounded-t-xl rounded-b-none' 
          : 'border border-surface-bright-edge/10 focus-within:border-accent-navy/50 rounded-xl'
        }`}
      >
        <div className="pl-4 pr-2 text-on-surface-variant">
          {isLoading ? <Loader2 size={18} className="animate-spin text-accent-navy" /> : <Search size={18} />}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={(e) => {
            setLocalValue(e.target.value);
            if (withDropdown && !isOpen && e.target.value) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (withDropdown && localValue) setIsOpen(true); }}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none py-4 text-on-surface font-utility text-sm placeholder:text-on-surface-variant/50"
          autoComplete="off"
          spellCheck="false"
        />
        
        {/* Zona Derecha Original + Escáner */}
        <div className="flex items-center gap-2 pr-4">
          <div className="flex gap-1">
            <span className="w-5 h-5 flex items-center justify-center rounded bg-surface-base text-[9px] font-bold text-accent-sage border border-surface-bright-edge/20" title="Búsqueda por Trigramas">T</span>
            <span className="w-5 h-5 flex items-center justify-center rounded bg-surface-base text-[9px] font-bold text-accent-navy border border-surface-bright-edge/20" title="Búsqueda Fonética">F</span>
            <span className="w-5 h-5 flex items-center justify-center rounded bg-surface-base text-[9px] font-bold text-accent-plum border border-surface-bright-edge/20" title="Búsqueda Semántica">S</span>
          </div>

          <div className="w-[1px] h-6 bg-surface-bright-edge/30 mx-1" />
          
          {/* EL BOTÓN DEL ESCÁNER AÑADIDO SIN ROMPER EL ESTILO */}
          <button 
            onClick={() => setIsScannerOpen(true)}
            className="text-on-surface-variant hover:text-accent-sage transition-colors focus:outline-none"
            title="Escanear Código de Barras"
          >
            <ScanLine size={18} />
          </button>
          
          <Mic size={18} className={`transition-colors duration-300 ${isListening ? 'text-accent-sage animate-pulse' : 'text-on-surface-variant'}`} />
        </div>
      </div>

      {/* EL DROPDOWN (Solo se activa si withDropdown es true) */}
      {withDropdown && isOpen && (
        <div className="absolute top-full left-0 right-0 bg-surface-highest/95 backdrop-blur-xl border border-surface-bright-edge/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-b-xl overflow-hidden z-40 animate-in fade-in slide-in-from-top-2 duration-200">
          {isLoading && results.length === 0 ? (
            <div className="p-6 text-center text-on-surface-variant font-utility text-sm">
              Analizando catálogo...
            </div>
          ) : results.length > 0 ? (
            <ul className="max-h-[340px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-surface-bright-edge/50 [&::-webkit-scrollbar-thumb]:rounded-full py-2">
              {results.map((result, index) => {
                const isSelected = index === selectedIndex;
                const badge = getBadgeConfig(result.matchType);

                return (
                  <li
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors border-l-2 ${
                      isSelected ? 'bg-surface-high border-accent-navy' : 'bg-transparent border-transparent hover:bg-surface-low'
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded bg-surface-base flex items-center justify-center text-surface-bright-edge shrink-0">
                        <Package size={20} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-utility text-sm truncate">
                          <HighlightText text={result.name} query={localValue} />
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-utility text-[10px] text-success-light uppercase tracking-widest">{result.sku}</span>
                          <span className="w-1 h-1 rounded-full bg-surface-bright-edge/50" />
                          <span className="font-utility text-[10px] text-on-surface-variant truncate">{result.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0 pl-4 gap-1.5">
                      <span className="font-narrative text-lg text-[#e3e2e6] leading-none">{formatCurrency(result.price)}</span>
                      <span className={`font-utility text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border ${badge.style}`}>
                        {badge.label}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-6 text-center text-on-surface-variant font-utility text-sm">
              No encontré nada para "{localValue}".
            </div>
          )}
        </div>
      )}

      {/* MODAL DE LA CÁMARA */}
      {isScannerOpen && (
        <BarcodeScannerModal 
          onClose={() => setIsScannerOpen(false)} 
          onScanSuccess={handleScanSuccess} 
        />
      )}
    </div>
  );
};