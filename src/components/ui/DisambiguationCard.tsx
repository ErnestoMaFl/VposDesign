import React from 'react';
import { Package } from 'lucide-react';

export interface DisambiguationOption {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  confidence: number;
}

interface DisambiguationCardProps {
  index: number;
  option: DisambiguationOption;
  onSelect: (id: string) => void;
}

export const DisambiguationCard: React.FC<DisambiguationCardProps> = ({ index, option, onSelect }) => {
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);

  return (
    <div 
      onClick={() => onSelect(option.id)}
      className="flex items-center p-4 bg-surface-container hover:bg-surface-high transition-all duration-300 rounded-lg cursor-pointer group"
    >
      {/* Número grande para selección por voz */}
      <div className="w-16 flex-shrink-0 text-center font-narrative text-5xl text-on-surface-variant group-hover:text-accent-sage transition-colors">
        {index}
      </div>

      <div className="w-10 h-10 ml-2 rounded bg-surface-base flex items-center justify-center text-on-surface-variant group-hover:text-accent-sage transition-colors">
        <Package size={20} />
      </div>

      {/* Detalles del producto */}
      <div className="flex flex-col ml-6 flex-1">
        <span className="font-utility text-lg font-medium text-on-surface">
          {option.name}
        </span>
        <div className="flex items-center gap-3 mt-1">
          <span className="font-utility text-xs text-on-surface-variant">
            {option.category}
          </span>
          <span className="font-utility text-xs px-2 py-0.5 bg-surface-base rounded text-accent-navy">
            Stock: {option.stock}
          </span>
        </div>
      </div>

      {/* Confianza visual y Precio */}
      <div className="flex flex-col items-center justify-center pr-2">
        <span className="font-narrative text-2xl text-on-surface mb-1">
          {formatCurrency(option.price)}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-utility text-[10px] text-on-surface-variant uppercase tracking-widest">
            Match
          </span>
          {/* Barra de confianza */}
          <div className="w-12 h-1 bg-surface-recessed rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent-navy transition-all"
              style={{ width: `${option.confidence}%` }}
            />
          </div>
          {/* Porcentaje numérico */}
          <span className="font-utility text-[10px] text-accent-navy font-medium tabular-nums w-6 text-right">
            {option.confidence}%
          </span>
        </div>
      </div>
    </div>
  );
};