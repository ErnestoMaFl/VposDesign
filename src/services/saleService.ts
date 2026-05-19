/**
 * Cliente HTTP para el dominio de ventas.
 * Espejo de los endpoints /api/v1/sales del backend.
 */

import { apiClient } from './apiClient';

const STORE_ID = import.meta.env.VITE_STORE_ID;

export type SaleStatus =
  | 'en_progreso'
  | 'completada'
  | 'cancelada'
  | 'reembolsada'
  | 'a_crédito';

export type PaymentMethod =
  | 'efectivo'
  | 'tarjeta'
  | 'transferencia_bancaria'
  | 'crédito_tienda'
  | 'vale';

export interface SaleItem {
  id: string;
  product_id: string;
  product_name: string;
  line_number: number;
  quantity: number;
  unit_price: number;
  unit_cost: number;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  available_stock?: number;
}

export interface Sale {
  id: string;
  sale_number: string;
  status: SaleStatus;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total: number;
  items: SaleItem[];
  customer_id: string | null;
  cashier_id: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface CompleteSaleResult {
  sale_id: string;
  sale_number: string;
  total: number;
  amount_tendered: number;
  change: number;
  status: string;
}

export const saleService = {
  create: (
    cashierUserId: string,
    cashRegisterSessionId?: string,
    voiceSessionId?: string,
    customerId?: string
  ) =>
    apiClient.post<{ id: string; sale_number: string; status: string }>(
      '/sales',
      {
        store_id: STORE_ID,
        cashier_user_id: cashierUserId,
        cash_register_session_id: cashRegisterSessionId ?? null,
        voice_session_id: voiceSessionId ?? null,
        customer_id: customerId ?? null,
      }
    ),

  addItem: (saleId: string, productId: string, quantity: number, voiceInputRaw?: string) =>
    apiClient.post<SaleItem>('/sales/items', {
      sale_id: saleId,
      product_id: productId,
      quantity,
      store_id: STORE_ID,
      voice_input_raw: voiceInputRaw ?? null, // <- Añadido para el backend
    }),

  removeItem: (saleId: string, itemId: string) =>
    apiClient.delete<{ removed: number }>(
      `/sales/items/${itemId}?sale_id=${saleId}&store_id=${STORE_ID}`
    ),
  
  updateQuantity: (saleId: string, itemId: string, newQuantity: number) =>
    apiClient.put<{ id: string; quantity: number }>('/sales/items/quantity', {
      sale_id: saleId,
      item_id: itemId,
      new_quantity: newQuantity,
      store_id: STORE_ID,
    }),

  complete: (
    saleId: string,
    paymentMethod: PaymentMethod,
    amountTendered: number,
    userId: string
  ) =>
    apiClient.post<CompleteSaleResult>('/sales/complete', {
      sale_id: saleId,
      store_id: STORE_ID,
      payment_method: paymentMethod,
      amount_tendered: amountTendered,
      user_id: userId,
    }),

  cancel: (saleId: string, reason?: string) =>
    apiClient.post<{ sale_id: string; status: string }>('/sales/cancel', {
      sale_id: saleId,
      store_id: STORE_ID,
      reason: reason ?? null,
    }),

  get: (saleId: string) =>
    apiClient.get<Sale>(`/sales/${saleId}?store_id=${STORE_ID}`),
};