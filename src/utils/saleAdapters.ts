/**
 * Adaptadores entre los tipos del backend (Sale, SaleItem) y los tipos
 * de UI que el CartPanel y componentes hijos consumen (CartItemType).
 *
 * Mantiene el componente CartPanel agnóstico al origen de los datos
 * y permite reutilizar la misma UI con mocks o backend real.
 */

import type { Sale, SaleItem } from '@/services/saleService';
import type { CartItemType } from '@/types/cart';

/**
 * Convierte un SaleItem del backend al shape que la UI espera.
 * - origin siempre 'touch' por ahora (Fase 6 marcará 'voice' cuando
 *   el pipeline conecte automáticamente al sale_service).
 * - description usa SKU/product_name_snapshot; en una iteración futura
 *   podemos enriquecerlo con marca y unidad si lo cargamos al hacer el SELECT.
 */
export function saleItemToCartItem(item: SaleItem): CartItemType {
  return {
    id: item.id,
    name: item.product_name,
    description: `Línea ${item.line_number}`,
    quantity: item.quantity,
    unitPrice: item.unit_price,
    subtotal: item.subtotal,
    origin: 'touch',
    isActive: false,
  };
}

/**
 * Convierte una venta completa en el shape esperado por el CartPanel.
 */
export function saleToCartView(sale: Sale | null): {
  items: CartItemType[];
  totals: {
    subtotal: number;
    discount: number;
    iva: number;
    total: number;
    folio?: string;
  };
} {
  if (!sale) {
    return {
      items: [],
      totals: { subtotal: 0, discount: 0, iva: 0, total: 0 },
    };
  }

  return {
    items: sale.items.map(saleItemToCartItem),
    totals: {
      subtotal: sale.subtotal,
      discount: sale.discount_amount,
      iva: sale.tax_amount,
      total: sale.total,
      folio: sale.sale_number,
    },
  };
}