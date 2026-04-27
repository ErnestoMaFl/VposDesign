import React from 'react';
import { ShoppingBag, Mic, Pause } from 'lucide-react';
import { CartLineItem } from './CartLineItem';
import { CartSummaryFooter } from './CartSummaryFooter';

export type CartStatus = 'empty' | 'active' | 'frozen';

export interface CartItemType {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  origin: 'voice' | 'touch';
  isActive?: boolean;
  icon?: React.ReactNode;
}

interface CartPanelProps {
  status: CartStatus;
  items: CartItemType[];
  totals: { subtotal: number; discount: number; iva: number; total: number };
  onIncreaseItem: (id: string) => void;
  onDecreaseItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onCharge: () => void;
  onSaveDraft: () => void;
}

export const CartPanel: React.FC<CartPanelProps> = ({
  status,
  items,
  totals,
  onIncreaseItem,
  onDecreaseItem,
  onDeleteItem,
  onCharge,
  onSaveDraft
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      
      {/* Estilos para animaciones */}
      <style>{`
        @keyframes slide-up-fade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-item-enter {
          animation: slide-up-fade 0.4s ease-out forwards;
        }
        
        /* "Respiración" para el estado de pausa */
        @keyframes breathe {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(0,0,0,0.3); }
          50% { transform: scale(1.03); box-shadow: 0 0 40px rgba(0,0,0,0.5); }
        }
        .animate-breathe {
          animation: breathe 3s ease-in-out infinite;
        }
      `}</style>

      {/* Header fijo del Carrito */}
      <div className="pt-8 px-10 pb-4 shrink-0 flex justify-between items-center relative z-20">
        <h2 className="font-utility text-xs text-on-surface-variant tracking-widest uppercase">
          Carrito Actual
        </h2>
        {status !== 'empty' && (
          <span className="font-utility text-xs text-on-surface-variant bg-surface-low px-2 py-0.5 rounded-full">
            {items.length} ítems
          </span>
        )}
      </div>

      {status === 'empty' ? (
        <div className="flex-1 flex flex-col items-center justify-center opacity-60">
          <div className="w-20 h-20 rounded-full bg-surface-low flex items-center justify-center mb-6 shadow-inner">
            <ShoppingBag size={32} className="text-on-surface-variant" />
          </div>
          <p className="font-narrative text-2xl text-on-surface mb-2">
            El carrito está vacío
          </p>
          <div className="flex items-center gap-2 text-on-surface-variant bg-surface-container px-4 py-2 rounded-full">
            <Mic size={14} className="text-accent-sage animate-pulse" />
            <span className="font-utility text-sm">Prueba decir: "Agrega dos cocas"</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* Overlay de estado Congelado/Pausado con Animación */}
          {status === 'frozen' && (
            <div className="absolute inset-0 z-30 bg-surface-base/40 backdrop-blur-[2px] flex items-center justify-center cursor-not-allowed transition-all duration-500">
              <div className="bg-surface-highest/95 px-6 py-3.5 rounded-full border border-surface-bright-edge/30 backdrop-blur-md animate-breathe flex items-center gap-3">
                <Pause size={14} className="text-accent-navy" />
                <span className="font-utility text-xs font-medium text-on-surface tracking-widest uppercase">
                  Proceso en pausa
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-accent-navy animate-pulse" />
              </div>
            </div>
          )}

          {/* Área Scrolleable de Ítems */}
          <div className="flex-1 relative overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 px-4 pb-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {items.map((item, index) => (
                <div 
                  key={item.id} 
                  className="animate-item-enter" 
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CartLineItem 
                    index={index + 1}
                    name={item.name}
                    description={item.description}
                    quantity={item.quantity}
                    unitPrice={item.unitPrice}
                    subtotal={item.subtotal}
                    origin={item.origin}
                    isActive={item.isActive}
                    icon={item.icon}
                    onIncrease={() => onIncreaseItem(item.id)}
                    onDecrease={() => onDecreaseItem(item.id)}
                    onDelete={() => onDeleteItem(item.id)}
                  />
                </div>
              ))}
            </div>

            {/* Máscara de desvanecimiento inferior */}
            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-surface-base to-transparent pointer-events-none z-10" />
          </div>

          <CartSummaryFooter 
            subtotal={totals.subtotal} 
            discount={totals.discount} 
            iva={totals.iva} 
            total={totals.total}
            onCharge={onCharge}
            onSaveDraft={onSaveDraft}
          />
        </div>
      )}

    </div>
  );
};