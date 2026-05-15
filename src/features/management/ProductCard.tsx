import React from 'react';
import { Package, CheckCircle2, AlertTriangle, Slash } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import type { Product } from '@/store/slices/createManagementSlice';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.minStock;

  const statusColorText = isOutOfStock ? 'text-error' : isLowStock ? 'text-warning' : 'text-accent-sage';
  const statusColorBg = isOutOfStock ? 'bg-error' : isLowStock ? 'bg-warning' : 'bg-accent-sage';
  const statusLabel = isOutOfStock ? 'Agotado' : isLowStock ? 'Stock Bajo' : 'En Stock';
  
  const StatusIcon = isOutOfStock ? Slash : isLowStock ? AlertTriangle : CheckCircle2;

  return (
    <div 
      onClick={onClick} 
      // Agregado h-full para que todas las tarjetas midan lo mismo en el grid
      className="group flex flex-col h-full bg-[#13151A] hover:bg-surface-container rounded-xl cursor-pointer transition-all duration-300 border border-surface-bright-edge/10 hover:border-surface-bright-edge/30 overflow-hidden"
    >
      {/* 1. ÁREA DE IMAGEN */}
      <div className="relative h-[180px] w-full bg-[#0B0D10] flex items-center justify-center overflow-hidden shrink-0">
        <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-md opacity-80 ${statusColorBg}`} />
        <Package size={64} strokeWidth={1} className="text-[#3C4150] group-hover:scale-110 transition-transform duration-500" />
        
        <div className="absolute bottom-3 right-3 bg-[#1F2128]/95 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-[#3C4150]/60 shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
          <span className="font-narrative text-2xl text-[#e3e2e6] tracking-wide">
            {formatCurrency(product.priceSale)}
          </span>
        </div>
      </div>

      {/* 2. ÁREA DE DATOS PRINCIPALES */}
      {/* flex-1 empuja el separador y el footer hacia abajo */}
      <div className="p-5 pb-4 flex flex-col flex-1">
        <span className="font-utility text-lg font-medium text-[#e3e2e6] line-clamp-2 mb-1.5">
          {product.name}
        </span>
        
        <div className="flex items-center gap-2 mt-auto">
          <span className="font-utility text-xs text-success-light uppercase tracking-widest">
            SKU: {product.sku}
          </span>
          <span className="w-1 h-1 rounded-full bg-success-light/30 shrink-0" />
          <span className="font-utility text-xs text-success-light uppercase tracking-widest line-clamp-1">
            {product.category}
          </span>
        </div>
      </div>

      {/* SEPARADOR CORREGIDO */}
      {/* shrink-0 evita que se aplaste. mx-8 lo hace más corto. border-t-2 lo hace más grueso. */}
      <div className="mx-8 border-t-2 border-black/90 shadow-[0_1px_0_rgba(255,255,255,0.02)] shrink-0" />

      {/* 3. FOOTER DEL INVENTARIO */}
      <div className="px-5 py-4 flex justify-between items-center shrink-0">
        <div className={`flex items-center gap-2 font-utility text-xs uppercase tracking-widest font-medium ${statusColorText}`}>
          <StatusIcon size={16} strokeWidth={2.5} />
          <span>{statusLabel}</span>
        </div>
        
        <span className={`font-narrative text-2xl leading-none ${statusColorText}`}>
          {String(product.stock).padStart(2, '0')}
        </span>
      </div>
      
    </div>
  );
};