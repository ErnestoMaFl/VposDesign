import React from 'react';
import { Tag, Banknote, Save } from 'lucide-react';

export interface CartSummaryFooterProps {
  subtotal: number;
  discount?: number;
  iva: number;
  total: number;
  onCharge?: () => void;
  onSaveDraft?: () => void;
}

export const CartSummaryFooter: React.FC<CartSummaryFooterProps> = ({
  subtotal,
  discount = 0,
  iva,
  total,
  onCharge,
  onSaveDraft,
}) => {
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);

  return (
    // Redujimos a rounded-t-[1.5rem]
    // Cambiamos la sombra: la exterior es más suave, y añadimos un 'inset' claro para simular el reflejo de luz en el borde
    <div className="w-full bg-surface-low pt-8 px-10 pb-[calc(2rem+72px)] rounded-t-[1.5rem] shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(60,65,80,0.6)] flex flex-col shrink-0 relative z-20">      
      {/* Contenedor del desglose (Subtotal, Descuento, IVA) */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-utility text-sm text-on-surface-variant">Subtotal</span>
          <span className="font-utility text-sm text-on-surface">{formatCurrency(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center">
            <span className="font-utility text-sm text-accent-navy flex items-center gap-1.5">
              <Tag size={14} />
              Descuento aplicado
            </span>
            <span className="font-utility text-sm text-accent-navy">
              -{formatCurrency(discount)}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="font-utility text-sm text-on-surface-variant">IVA (16%)</span>
          <span className="font-utility text-sm text-on-surface">{formatCurrency(iva)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-end mb-8">
        <span className="font-utility text-lg text-on-surface-variant mb-2">Total</span>
        <span className="font-narrative text-[3.5rem] leading-tight text-on-surface tracking-wide">
          {formatCurrency(total)}
        </span>
      </div>

      {/* Botones de Acción */}
      <div className="flex gap-4 w-full">
        <button 
          onClick={onSaveDraft}
          title="Pausar Venta"
          className="w-14 h-14 flex-none flex items-center justify-center bg-surface-base hover:bg-surface-high transition-colors rounded-xl text-on-surface-variant hover:text-on-surface"
        >
          <Save size={20} />
        </button>
        
        {/* Botón Cobrar - Altura exacta h-14 */}
        <button 
          onClick={onCharge}
          className="h-14 flex-1 flex items-center justify-center gap-3 bg-accent-sage hover:brightness-110 transition-all rounded-xl font-utility text-base font-medium text-[#e3e2e6] shadow-[0_4px_20px_rgba(77,122,99,0.25)]"
        >
          <Banknote size={20} />
          Cobrar {formatCurrency(total)}
        </button>
      </div>

    </div>
  );
};