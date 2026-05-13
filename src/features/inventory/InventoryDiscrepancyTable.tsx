import React from 'react';
import type { ScanLogItem } from '@/types/inventory';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface InventoryDiscrepancyTableProps {
  logs: ScanLogItem[];
}

export const InventoryDiscrepancyTable: React.FC<InventoryDiscrepancyTableProps> = ({ logs }) => {
  if (logs.length === 0) return null;

  // Calculamos totales para el Footer del Ledger
  const totalItems = logs.length;
  const totalDiscrepancies = logs.filter(l => l.delta !== 0).length;
  
  // Mockeamos un costo promedio de $18.50 por ítem para calcular el impacto monetario
  const totalMonetaryImpact = logs.reduce((acc, log) => acc + (log.delta * 18.50), 0);

  return (
    <div className="flex-1 flex flex-col min-h-0 animate-in fade-in zoom-in-95 duration-500">
      
      {/* CONTENEDOR PRINCIPAL ARIA (Se comporta como tabla semántica) */}
      <div role="table" aria-label="Resumen de Discrepancias" className="flex-1 flex flex-col min-h-0">
        
        {/* HEADER DE LA TABLA (Row y Column Headers) */}
        <div role="row" className="flex items-center px-8 pb-4 shrink-0 font-utility text-[10px] uppercase tracking-widest text-[#919194]">
          <div role="columnheader" className="w-12" /> {/* Espaciador del ícono */}
          <div role="columnheader" className="flex-1">Producto</div>
          <div role="columnheader" className="w-24 text-right">Teórico (Ant)</div>
          <div role="columnheader" className="w-24 text-right">Físico (Act)</div>
          <div role="columnheader" className="w-32 text-right">Diferencia</div>
          <div role="columnheader" className="w-32 text-right">Ajuste Neto</div>
        </div>

        {/* FILAS DE DISCREPANCIA (Rowgroup encapsula la lista iterada) */}
        <div role="rowgroup" className="flex-1 overflow-y-auto flex flex-col gap-2 [&::-webkit-scrollbar]:hidden pb-6">
          {logs.map((log) => {
            const isPositive = log.delta > 0;
            const isNegative = log.delta < 0;
            const isZero = log.delta === 0;

            // Colores semánticos
            let deltaColorText = "text-[#5C4275]"; 
            if (isPositive) deltaColorText = "text-[#4D7A63]"; 
            if (isNegative) deltaColorText = "text-[#ffb4ab]"; 

            const monetaryImpact = log.delta * 18.50;

            return (
              <div 
                role="row"
                key={log.id}
                className="flex items-center px-8 py-4 bg-[#181A1F] hover:bg-[#1F2128] rounded-xl transition-colors duration-300 group"
              >
                <div role="cell" className="w-12 shrink-0">
                  {isZero ? (
                    <CheckCircle2 size={20} className="text-[#4D7A63] opacity-50 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <AlertTriangle size={20} className={`${deltaColorText} opacity-80 group-hover:opacity-100 transition-opacity`} />
                  )}
                </div>

                <div role="cell" className="flex-1 flex flex-col justify-center">
                  <span className="font-utility text-[16px] font-medium text-[#E3E2E6]">
                    {log.name}
                  </span>
                  <span className="font-utility text-[12px] text-[#919194] mt-0.5">
                    {isZero ? 'Sin discrepancia' : 'Ajuste requerido'}
                  </span>
                </div>

                <div role="cell" className="w-24 text-right font-narrative text-[24px] text-[#919194]">
                  {log.oldQuantity}
                </div>

                <div role="cell" className="w-24 flex justify-end">
                  <div className={`px-4 py-1.5 rounded-lg bg-[#0B0D10] shadow-inner font-narrative text-[24px] leading-none ${isZero ? 'text-[#E3E2E6]' : deltaColorText}`}>
                    {log.newQuantity}
                  </div>
                </div>

                <div role="cell" className={`w-32 text-right font-narrative text-[32px] tracking-tight ${deltaColorText}`}>
                  {isPositive ? '+' : ''}{log.delta}
                </div>

                <div role="cell" className={`w-32 text-right font-utility text-[16px] font-medium ${deltaColorText}`}>
                  {isPositive ? '+' : ''}{formatCurrency(monetaryImpact)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER DEL RESUMEN (Sticky bottom) */}
      <div className="shrink-0 bg-[#0B0D10] rounded-2xl p-8 flex justify-between items-center mt-4 border border-[#3C4150]/20 shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
        <div className="flex gap-12">
          <div className="flex flex-col">
            <span className="font-utility text-[10px] uppercase tracking-widest text-[#919194] mb-1">Ítems Revisados</span>
            <span className="font-narrative text-[32px] text-[#E3E2E6] leading-none">{totalItems}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-utility text-[10px] uppercase tracking-widest text-[#919194] mb-1">Con Diferencia</span>
            <span className="font-narrative text-[32px] text-[#ffb4ab] leading-none">{totalDiscrepancies}</span>
          </div>
        </div>

        <div className="flex flex-col text-right">
          <span className="font-utility text-[10px] uppercase tracking-widest text-[#919194] mb-1">Impacto Contable Neto</span>
          <span className={`font-narrative text-[48px] leading-none tracking-tight ${totalMonetaryImpact >= 0 ? 'text-[#4D7A63]' : 'text-[#ffb4ab]'}`}>
            {totalMonetaryImpact > 0 ? '+' : ''}{formatCurrency(totalMonetaryImpact)}
          </span>
        </div>
      </div>

    </div>
  );
};