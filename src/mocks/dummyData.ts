import React from 'react';
import { Droplet } from 'lucide-react';
import { type CartItemType } from '@/types/cart';

export const mockAmbiguousOptions = [
  { id: '1', name: 'Coca-Cola Original 600ml', category: 'Bebidas - PET', price: 18.50, stock: 24, confidence: 92 },
  { id: '2', name: 'Coca-Cola Light 600ml', category: 'Bebidas - PET', price: 18.50, stock: 12, confidence: 85 },
  { id: '3', name: 'Coca-Cola Original 2L', category: 'Bebidas - PET', price: 35.00, stock: 8, confidence: 70 },
];

export const mockCartItems: CartItemType[] = [
  { id: 'i1', name: 'Coca-Cola Original 600ml', description: 'Envase PET, Fría', quantity: 2, unitPrice: 18.50, subtotal: 37.00, origin: 'voice' },
  { id: 'i2', name: 'Sabritas Sal 45g', description: 'Pasillo 3', quantity: 1, unitPrice: 20.00, subtotal: 20.00, origin: 'touch' },
  { id: 'i3', name: 'Coca Cola Regular', description: 'Lata 355ml', quantity: 3, unitPrice: 3.50, subtotal: 10.50, origin: 'voice', isActive: true, icon: React.createElement(Droplet, { size: 18, className: "text-accent-plum" }) },
];