import React from 'react';
import type { ScanLogItem } from '@/types/inventory';
import { Package } from 'lucide-react';

interface ScanLogFeedProps {
  logs: ScanLogItem[];
}

export const ScanLogFeed: React.FC<ScanLogFeedProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center h-full opacity-40">
        <p className="font-utility text-[#919194] text-[14px] uppercase tracking-widest">
          Esperando dictado...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-6 overflow-y-auto px-2 pb-12 [&::-webkit-scrollbar]:hidden">
      {logs.map((log, index) => {
        const isLatest = index === 0;
        const isReversed = index % 2 !== 0; // true en ítems 1, 3, 5 (impares del array, visualmente los pares)
        
        const isPositive = log.delta > 0;
        const isNegative = log.delta < 0;
        
        // Mapeo semántico estricto
        let deltaColorText = "text-[#5C4275]"; 
        let deltaColorBg = "bg-[#5C4275]";
        if (isPositive) {
          deltaColorText = "text-[#4D7A63]"; 
          deltaColorBg = "bg-[#4D7A63]";
        }
        if (isNegative) {
          deltaColorText = "text-[#ffb4ab]"; 
          deltaColorBg = "bg-[#ffb4ab]";
        }

        // Tonal Layering
        const containerClasses = isLatest
          ? 'bg-[#1F2128] shadow-[inset_0_1px_0_#3C4150] shadow-[0_15px_30px_rgba(0,0,0,0.3)] opacity-100 scale-100 z-10' 
          : 'bg-[#181A1F] opacity-50 hover:opacity-100 scale-[0.98] hover:scale-100 transition-all duration-500 z-0'; 

        // Variables dinámicas para el ritmo visual alternado (izq-der / der-izq)
        const barPosition = isReversed ? 'left-0' : 'right-0';
        const cardPadding = isReversed ? 'pl-6' : 'pr-6'; // Deja el espacio exacto para la barra (w-6 = 24px)
        const mainFlexDir = isReversed ? 'flex-row-reverse' : 'flex-row';
        const ledgerFlexDir = isReversed ? 'flex-row-reverse border-r' : 'flex-row border-l';
        const textAlign = isReversed ? 'text-right' : 'text-left';
        const badgeAlign = isReversed ? 'justify-end' : 'justify-start';

        return (
          <div 
            key={log.id}
            className={`
              relative flex ${mainFlexDir} items-stretch rounded-2xl overflow-hidden min-h-[140px]
              ${containerClasses} ${cardPadding}
              animate-in fade-in zoom-in-95 duration-500
            `}
          >
            {/* LA BARRA DE ACENTO GIGANTE: w-6 (24px) intocable */}
            <div className={`absolute top-0 bottom-0 w-6 ${deltaColorBg} ${barPosition} opacity-100 z-20`} />

            {/* ÍCONO: Ahora está en una caja de w-32 exacta, con justify-center = Centrado Perfecto */}
            <div className="w-32 flex items-center justify-center shrink-0 z-10">
              <Package size={36} strokeWidth={1.5} className="text-[#3C4150]" />
            </div>

            {/* CONTENIDO CENTRAL */}
            <div className={`flex-1 flex flex-col justify-center py-6 ${textAlign} px-4 z-10`}>
              
              {/* 1. EL PRODUCTO RESUELTO */}
              <span className="font-narrative text-[28px] text-[#E3E2E6] leading-none mb-2">
                {log.name}
              </span>
              
              {/* 2. LO QUE SE DICTÓ (Aumentado a 19px y opacity-80) */}
              <span className="font-utility text-[19px] text-[#919194] italic tracking-wide mb-4 opacity-80">
                "{log.rawTranscript}"
              </span>
              
              {/* Pills / Tags de estado */}
              <div className={`flex gap-2 ${badgeAlign}`}>
                <span className="px-2.5 py-1 rounded bg-[#0B0D10] font-utility text-[9px] uppercase tracking-widest text-[#919194] shadow-inner">
                  INVENTARIO
                </span>
                <span className={`px-2.5 py-1 rounded bg-[#0B0D10] font-utility text-[9px] uppercase tracking-widest shadow-inner ${isLatest ? 'text-[#4D7A63]' : 'text-[#919194]'}`}>
                  {log.status === 'success' ? '✓ Ajuste Confirmado' : 'Pendiente'}
                </span>
              </div>
            </div>

            {/* LEDGER FINANCIERO (Cantidades y Delta) */}
            <div className={`
              flex ${ledgerFlexDir} items-center bg-[#0B0D10]/50 border-[#3C4150]/30 px-10 shrink-0 z-10
            `}>
              
              {/* Apilamiento Ant/Act: Ahora con tipografía premium */}
              <div className="flex flex-col justify-center w-24 gap-3">
                <div className="flex justify-between items-end border-b border-[#3C4150]/40 pb-1">
                  <span className="font-utility text-[10px] uppercase tracking-widest text-[#919194] mb-1">Ant</span>
                  <span className="font-narrative text-[26px] text-[#919194] leading-none">
                    {log.oldQuantity}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="font-utility text-[10px] uppercase tracking-widest text-[#E3E2E6] mb-1">Act</span>
                  <span className={`font-narrative text-[32px] leading-none ${log.newQuantity === 0 ? 'text-[#ffb4ab]' : 'text-[#E3E2E6]'}`}>
                    {log.newQuantity}
                  </span>
                </div>
              </div>

              {/* Divisor difuso */}
              <div className="w-8 shrink-0" />
              <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-[#3C4150] to-transparent opacity-50 shrink-0" />
              <div className="w-8 shrink-0" />

              {/* Delta Gigante (64px) */}
              <div className="flex items-baseline justify-center min-w-[90px]">
                <span className={`font-narrative text-[64px] leading-none tracking-tight ${deltaColorText}`}>
                  {isPositive ? '+' : ''}{log.delta}
                </span>
                <span className={`font-utility text-[11px] uppercase tracking-widest ${deltaColorText} opacity-70 ml-2`}>
                  Qty
                </span>
              </div>

            </div>

          </div>
        );
      })}
    </div>
  );
};