import type { ReactNode } from 'react';
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
  icon?: ReactNode;
}