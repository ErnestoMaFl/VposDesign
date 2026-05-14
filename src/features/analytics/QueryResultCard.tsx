import React from 'react';
import type { ResultVariant, ChartPayload, TablePayload } from '@/types/analytics';
import { formatCurrency } from '@/utils/formatters';

interface QueryResultCardProps {
  variant?: ResultVariant;
  payload?: ChartPayload | TablePayload | null;
}

export const QueryResultCard: React.FC<QueryResultCardProps> = ({ variant, payload }) => {
  if (!variant || variant === 'text' || !payload) return null;

  // --- VARIANTE: TABLA ---
  if (variant === 'table') {
    const data = payload as TablePayload;
    return (
      <div role="table" aria-label="Resultados de consulta" className="w-full bg-[#0B0D10]/50 rounded-xl overflow-hidden border border-surface-bright-edge/20 mt-4 shadow-sm">
        <div role="row" className="flex items-center px-5 py-3 bg-surface-highest/30 border-b border-surface-bright-edge/30">
          {data.headers.map((header, idx) => (
            <div key={idx} role="columnheader" className={`flex-1 font-utility text-[10px] uppercase tracking-widest text-on-surface-variant ${idx > 0 ? 'text-right' : 'text-left'}`}>
              {header}
            </div>
          ))}
        </div>
        <div role="rowgroup" className="flex flex-col">
          {data.rows.map((row, rowIdx) => (
            <div key={rowIdx} role="row" className="flex items-center px-5 py-3 border-b border-surface-bright-edge/10 last:border-0 hover:bg-surface-high/30 transition-colors">
              {row.map((cell, cellIdx) => (
                <div key={cellIdx} role="cell" className={`flex-1 font-utility text-sm ${cellIdx > 0 ? 'text-right text-[#e3e2e6] font-medium tabular-nums' : 'text-left text-on-surface-variant'}`}>
                  {typeof cell === 'number' && cell > 100 ? formatCurrency(cell) : cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- VARIANTE: GRÁFICA DE BARRAS ---
  if (variant === 'bar-chart') {
    const data = payload as ChartPayload;
    const maxValue = Math.max(...data.values) * 1.1; 
    
    // Paleta con colores base MATE y oscuros. El brillo solo existe en el hover.
    const accentTheme = {
      sage: { 
        gradient: 'from-[#2C4A3A] to-[#4D7A63]', 
        border: 'border-[#4D7A63]',
        hoverGlow: 'group-hover:shadow-[0_0_25px_rgba(77,122,99,0.8)] group-hover:brightness-125 group-hover:border-[#5bc085]/60'
      },
      navy: { 
        gradient: 'from-[#23354B] to-[#3F5A7A]', 
        border: 'border-[#3F5A7A]',
        hoverGlow: 'group-hover:shadow-[0_0_25px_rgba(63,90,122,0.8)] group-hover:brightness-125 group-hover:border-[#5479a3]/60'
      },
      plum: { 
        gradient: 'from-[#332345] to-[#5C4275]', 
        border: 'border-[#5C4275]',
        hoverGlow: 'group-hover:shadow-[0_0_25px_rgba(92,66,117,0.8)] group-hover:brightness-125 group-hover:border-[#7b599c]/60'
      }
    }[data.accent] || { gradient: 'from-surface-bright-edge/20 to-surface-bright-edge', border: 'border-surface-bright-edge', hoverGlow: '' };

    return (
      <div className="w-full mt-6 bg-gradient-to-b from-[#0B0D10]/40 to-[#0F1013] rounded-2xl p-6 border border-surface-bright-edge/20 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
        <div className="flex w-full h-[220px] gap-4">
          
          {/* EJE Y (Dinero) - 100% AZUL DEL SISTEMA (accent-navy) */}
          {(() => {
            const ticks = [maxValue, maxValue * 0.66, maxValue * 0.33, 0];
            return (
              <div className="flex flex-col justify-between items-end pb-8 pt-2 shrink-0 pr-4 font-utility text-[9px] text-accent-navy font-medium tracking-wider border-r border-accent-navy/40 relative">
                {ticks.map((tick, i) => (
                  <span key={i} className="relative leading-none">
                    {/* El corte (tick) en azul */}
                    <span className="absolute -right-4 top-1/2 w-2 h-[1px] bg-accent-navy/60" />
                    {formatCurrency(tick)}
                  </span>
                ))}
              </div>
            );
          })()}

          {/* ÁREA DEL GRÁFICO */}
          <div className="relative flex-1 flex gap-2 sm:gap-4">
            
            {/* GRID LINES: Al fondo (z-0), grises y neutras */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between pb-8 pt-2 z-0">
              <div className="w-full border-t-2 border-dashed border-accent-navy/60" />
              <div className="w-full border-t-2 border-dashed border-accent-navy/60" />
              <div className="w-full border-t-2 border-dashed border-accent-navy/60" />
              <div className="w-full border-t-2 border-solid border-accent-navy/70" />
            </div>

            {/* BARRAS Y EJE X */}
            {data.values.map((value, idx) => {
              const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;
              return (
                <div key={idx} className="relative z-10 group flex flex-col items-center justify-end flex-1 h-full">
                  
                  <div className="relative w-full flex-1 flex items-end justify-center mb-2">
                    {/* Tooltip */}
                    <div className="absolute -top-10 bg-surface-highest/90 backdrop-blur-sm text-[#e3e2e6] font-utility text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:-translate-y-4 whitespace-nowrap pointer-events-none shadow-lg border border-surface-bright-edge/40 z-20">
                      {formatCurrency(value)}
                    </div>
                    
                    {/* Barra MATE y Sólida (Opacidad 100%). Brilla solo con hover */}
                    <div 
                      className={`w-full max-w-[40px] rounded-t-md transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] bg-gradient-to-t ${accentTheme.gradient} border-t ${accentTheme.border} opacity-100 cursor-crosshair ${accentTheme.hoverGlow}`}
                      style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                    />
                  </div>
                  
                  {/* EJE X */}
                  <span className="h-6 flex items-center justify-center font-utility text-[11px] font-bold text-[#e3e2e6] shrink-0 group-hover:text-white transition-colors">
                    {data.labels[idx]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
};