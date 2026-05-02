import React from 'react';
import { Minus, Plus, Mic, Hand, Trash2, Package } from 'lucide-react'; // Agregamos Package como default

export interface CartLineItemProps {
  index: number;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  origin: 'voice' | 'touch';
  isActive?: boolean;
  icon?: React.ReactNode; // Vuelve a ser opcional
  onIncrease?: () => void;
  onDecrease?: () => void;
  onDelete?: () => void;
}

export const CartLineItem: React.FC<CartLineItemProps> = ({
  index,
  name,
  description,
  quantity,
  unitPrice,
  subtotal,
  origin,
  isActive = false,
  icon,
  onIncrease,
  onDecrease,
  onDelete,
}) => {
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);

  return (
    <div 
      className={`
        relative flex items-center p-4 rounded-lg transition-all duration-300 ease-in-out
        ${isActive 
          ? 'bg-accent-plum/30 shadow-[0_4px_20px_rgba(92,66,117,0.4)]' 
          : 'bg-surface-low hover:bg-surface-container'
        }
      `}
    >
      {/* Indicador de Activo (Conductor Rail vertical en color Plum) */}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-plum rounded-l-lg shadow-[0_0_10px_rgba(92,66,117,0.6)]" />
      )}

      {/* Número de línea (Índice) */}
      <span className="font-utility text-xs font-medium text-on-surface-variant tracking-widest w-6 ml-2">
        {String(index).padStart(2, '0')}
      </span>

      {/* Ícono / Imagen del producto: Usa el pasado por props o Package por defecto */}
      <div 
        className={`w-10 h-10 ml-2 rounded flex items-center justify-center transition-colors 
          ${isActive ? 'bg-surface-base text-accent-plum' : 'bg-surface-base text-[#9ca3af]'}
        `}
      >
        {icon || <Package size={18} />}
      </div>

      {/* Detalles del producto */}
      <div className="flex flex-col ml-4 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-utility text-sm font-medium text-on-surface">
            {name}
          </span>
          {/* Indicador de origen (Voz vs Táctil) */}
          <span className="text-on-surface-variant opacity-50" title={`Agregado por ${origin}`}>
            {origin === 'voice' ? <Mic size={14} /> : <Hand size={14} />}
          </span>
        </div>
        
        {/* Descripción en verde blanquesino (#d9eddc) */}
        <span className="font-utility text-xs text-[#d9eddc] mt-0.5">
          {description}
        </span>
      </div>

      {/* Precio Unitario en verde blanquesino (#d9eddc) */}
      <div className="w-20 text-right font-utility text-sm text-[#d9eddc]">
        {formatCurrency(unitPrice)}
      </div>

      {/* Control de Cantidad Interactivo */}
      <div className="flex items-center bg-surface-base rounded-md px-1 py-1 mx-4">
        <button 
          onClick={onDecrease}
          className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-low rounded transition-colors"
        >
          <Minus size={14} />
        </button>
        
        <span className="w-8 text-center font-utility text-sm font-medium text-on-surface">
          {quantity}
        </span>
        
        <button 
          onClick={onIncrease}
          className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-low rounded transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Subtotal */}
      <div className="w-24 text-right pr-4">
        <span className="font-narrative text-2xl tracking-wide text-on-surface">
          {formatCurrency(subtotal)}
        </span>
      </div>

      {/* Botón de Borrar */}
      <button
        onClick={onDelete}
        className="p-2 text-on-surface-variant hover:text-[#cc4444] hover:bg-surface-high transition-all duration-300 rounded"
        title="Eliminar ítem"
        aria-label="Eliminar ítem"
      >
        <Trash2 size={18} />
      </button>

    </div>
  );
};