/**
 * Sale Slice — Estado real del carrito conectado al backend.
 *
 * Reglas:
 * - Una sola venta activa a la vez (el SCO de Fase 6 manejará la pila multi-venta).
 * - Todas las acciones mutadoras esperan respuesta del backend antes de actualizar.
 * - El UI deriva todo desde `activeSale` (single source of truth).
 */

import type { StateCreator } from 'zustand';
import type { StoreState } from '../useAppStore';
import {
  saleService,
  type Sale,
  type SaleItem,
  type PaymentMethod,
} from '@/services/saleService';

export type SaleSliceStatus = 'idle' | 'loading' | 'ready' | 'frozen' | 'error';

const CASHIER_USER_ID = import.meta.env.VITE_CASHIER_USER_ID;

export interface SaleSlice {
  activeSale: Sale | null;
  saleStatus: SaleSliceStatus;
  saleError: string | null;
  isMutatingSale: boolean; // true mientras hay un POST/PUT/DELETE en vuelo

  // Bootstrap (idempotente)
  ensureActiveSale: () => Promise<void>;

  // CRUD
  addItemToSale: (
    productId: string,
    quantity: number,
    voiceInputRaw?: string
  ) => Promise<SaleItem | null>;
  removeItemFromSale: (itemId: string) => Promise<void>;
  updateItemQty: (itemId: string, qty: number) => Promise<void>;

  // Cobro / cierre
  completeSale: (
    paymentMethod: PaymentMethod,
    amountTendered: number
  ) => Promise<{ change: number; saleNumber: string } | null>;
  cancelActiveSale: (reason?: string) => Promise<void>;

  // Estado visual
  freezeSale: () => void;
  unfreezeSale: () => void;
  refreshActiveSale: () => Promise<void>;
  resetSaleSlice: () => void;
}

export const createSaleSlice: StateCreator<StoreState, [], [], SaleSlice> = (
  set,
  get
) => ({
  activeSale: null,
  saleStatus: 'idle',
  saleError: null,
  isMutatingSale: false,

  ensureActiveSale: async () => {
    const state = get();
    const current = state.activeSale;

    // Ya hay venta lista, no hacer nada
    if (current && current.status === 'en_progreso') {
      return;
    }

    // Hay una creación en vuelo, esperar sin disparar otra
    if (state.saleStatus === 'loading') {
      return;
    }

    if (!CASHIER_USER_ID) {
      set({
        saleStatus: 'error',
        saleError:
          'VITE_CASHIER_USER_ID no configurado. Define un user_id válido en .env.',
      });
      return;
    }

    set({ saleStatus: 'loading', saleError: null });

    try {
      const created = await saleService.create(CASHIER_USER_ID);
      const full = await saleService.get(created.id);
      set({ activeSale: full, saleStatus: 'ready' });
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'No se pudo iniciar la venta';
      console.error('[SaleSlice] ensureActiveSale failed:', e);
      set({ saleStatus: 'error', saleError: message });
    }
  },

  addItemToSale: async (productId, quantity, voiceInputRaw) => {
    const sale = get().activeSale;
    if (!sale) {
      console.warn('[SaleSlice] addItem sin venta activa');
      return null;
    }

    set({ isMutatingSale: true, saleError: null });
    try {
      const item = await saleService.addItem(
        sale.id,
        productId,
        quantity,
        voiceInputRaw
      );
      await get().refreshActiveSale();
      return item;
    } catch (e) {
      const err = e as { code?: string; message?: string };
      const friendly =
        err.code === 'INSUFFICIENT_STOCK'
          ? 'No hay suficiente stock para agregar ese producto.'
          : err.code === 'PRODUCT_NOT_FOUND'
            ? 'Ese producto ya no existe o está inactivo.'
            : err.message ?? 'No se pudo agregar el producto';
      set({ saleError: friendly });
      return null;
    } finally {
      set({ isMutatingSale: false });
    }
  },

  removeItemFromSale: async (itemId) => {
    const sale = get().activeSale;
    if (!sale) return;

    // Optimistic remove
    const previousSale = sale;
    const filtered = sale.items.filter((i) => i.id !== itemId);
    const newSubtotal = filtered.reduce((acc, i) => acc + i.subtotal, 0);
    const optimisticSale: Sale = {
      ...sale,
      items: filtered,
      subtotal: newSubtotal,
      tax_amount: newSubtotal * 0.16,
      total: newSubtotal - sale.discount_amount + newSubtotal * 0.16,
    };
    set({ activeSale: optimisticSale, saleError: null });

    try {
      await saleService.removeItem(sale.id, itemId);
      await get().refreshActiveSale();
    } catch (e) {
      set({
        activeSale: previousSale,
        saleError:
          e instanceof Error ? e.message : 'No se pudo eliminar el ítem',
      });
    }
  },

  updateItemQty: async (itemId, qty) => {
    const sale = get().activeSale;
    if (!sale || qty <= 0) return;

    // Optimistic: actualizar UI inmediatamente
    const previousSale = sale;
    const optimisticSale: Sale = {
      ...sale,
      items: sale.items.map((it) =>
        it.id === itemId
          ? {
              ...it,
              quantity: qty,
              subtotal: it.unit_price * qty,
            }
          : it
      ),
    };
    // Recalcular totals localmente (aproximación; el backend dará los exactos)
    optimisticSale.subtotal = optimisticSale.items.reduce(
      (acc, i) => acc + i.subtotal,
      0
    );
    optimisticSale.tax_amount = optimisticSale.subtotal * 0.16;
    optimisticSale.total =
      optimisticSale.subtotal -
      optimisticSale.discount_amount +
      optimisticSale.tax_amount;

    set({ activeSale: optimisticSale, saleError: null });

    // Backend en segundo plano
    try {
      await saleService.updateQuantity(sale.id, itemId, qty);
      // Refresh para los totales exactos del backend (con redondeo correcto)
      await get().refreshActiveSale();
    } catch (e) {
      const err = e as { code?: string; message?: string };
      const friendly =
        err.code === 'INSUFFICIENT_STOCK'
          ? 'No hay suficiente stock disponible.'
          : err.message ?? 'No se pudo actualizar la cantidad';
      // Rollback
      set({ activeSale: previousSale, saleError: friendly });
    }
  },

  completeSale: async (paymentMethod, amountTendered) => {
    const sale = get().activeSale;
    if (!sale) return null;
    if (!CASHIER_USER_ID) return null;

    set({ isMutatingSale: true, saleError: null });
    try {
      const result = await saleService.complete(
        sale.id,
        paymentMethod,
        amountTendered,
        CASHIER_USER_ID
      );
      // Limpieza: la venta cerrada ya no es la activa
      set({
        activeSale: null,
        saleStatus: 'idle',
        isMutatingSale: false,
      });
      return { change: result.change, saleNumber: result.sale_number };
    } catch (e) {
      const err = e as { code?: string; message?: string };
      const friendly =
        err.code === 'INSUFFICIENT_PAYMENT'
          ? 'El monto recibido es menor al total a cobrar.'
          : err.code === 'INSUFFICIENT_STOCK'
            ? 'Otro cajero consumió stock de uno de los productos. Recarga el carrito.'
            : err.message ?? 'No se pudo completar la venta';
      set({ saleError: friendly, isMutatingSale: false });
      return null;
    }
  },

  cancelActiveSale: async (reason) => {
    const sale = get().activeSale;
    if (!sale) {
      // No había venta; limpio igual el estado por si quedó error
      set({ saleStatus: 'idle', saleError: null });
      return;
    }

    set({ isMutatingSale: true });
    try {
      await saleService.cancel(sale.id, reason);
    } catch (e) {
      console.warn('[SaleSlice] cancelActiveSale error (continuando igual):', e);
    } finally {
      set({
        activeSale: null,
        saleStatus: 'idle',
        isMutatingSale: false,
        saleError: null,
      });
    }
  },

  freezeSale: () => {
    if (get().activeSale) set({ saleStatus: 'frozen' });
  },

  unfreezeSale: () => {
    if (get().saleStatus === 'frozen') set({ saleStatus: 'ready' });
  },

  refreshActiveSale: async () => {
    const sale = get().activeSale;
    if (!sale) return;
    try {
      const full = await saleService.get(sale.id);
      set({ activeSale: full });
    } catch (e) {
      console.error('[SaleSlice] refresh failed:', e);
    }
  },

  resetSaleSlice: () =>
    set({
      activeSale: null,
      saleStatus: 'idle',
      saleError: null,
      isMutatingSale: false,
    }),
});