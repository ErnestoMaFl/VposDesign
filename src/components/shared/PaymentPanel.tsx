import React, { useState } from 'react';
import { Banknote, CreditCard, ArrowLeft, Delete, CheckCircle2 } from 'lucide-react';
import { type CartItemType } from './CartPanel';

export type PaymentMethod = 'cash' | 'card' | null;

interface PaymentPanelProps {
  totals: { subtotal: number; discount: number; iva: number; total: number; folio?: string };
  items: CartItemType[];
  onCancel: () => void;
  onConfirm: (method: PaymentMethod, received: number, change: number) => void;
}

export const PaymentPanel: React.FC<PaymentPanelProps> = ({ totals, items, onCancel, onConfirm }) => {
  const [method, setMethod] = useState<PaymentMethod>(null);
  const [receivedStr, setReceivedStr] = useState<string>('');

  const receivedAmount = receivedStr === '' ? 0 : parseFloat(receivedStr);
  const change = receivedAmount - totals.total;
  const isSufficient = receivedAmount >= totals.total;

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);

  const handleKeypad = (val: string) => {
    if (val === 'C') setReceivedStr('');
    else if (val === 'DEL') setReceivedStr(prev => prev.slice(0, -1));
    else if (val === 'EXACT') setReceivedStr(totals.total.toString());
    else {
      if (receivedStr === '0' && val !== '.') return;
      if (val === '.' && receivedStr.includes('.')) return;
      setReceivedStr(prev => prev + val);
    }
  };

  const quickBills = [10, 20, 50, 100, 200, 500];

  return (
    <div className="flex-1 flex flex-row bg-surface-base absolute inset-0 z-30 animate-in fade-in zoom-in-95 duration-300">
      
      {/* ===== LADO IZQUIERDO: TICKET CLÁSICO ===== */}
      <div className="w-[340px] h-full bg-surface-low border-r border-dashed border-surface-bright-edge/50 flex flex-col shadow-[15px_0_40px_rgba(0,0,0,0.15)] z-10 shrink-0">
        
        {/* Cabecera del ticket limpia, puro texto */}
        <div className="pt-8 pb-6 px-6 text-center border-b border-dashed border-surface-bright-edge/30 shrink-0 flex flex-col items-center">
          <h3 className="font-narrative text-2xl text-on-surface tracking-widest uppercase leading-none">VPOS</h3>
          <p className="font-utility text-[10px] text-on-surface-variant uppercase tracking-widest mt-1.5">
            Ticket de Venta
          </p>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4 [&::-webkit-scrollbar]:hidden">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-start font-utility text-sm">
               <div className="flex gap-3">
                 <span className="text-on-surface-variant">{item.quantity}x</span>
                 <span className="text-on-surface">{item.name}</span>
               </div>
               <span className="text-on-surface font-medium tabular-nums ml-4">{formatCurrency(item.subtotal)}</span>
            </div>
          ))}
        </div>
        
        <div className="p-6 border-t border-dashed border-surface-bright-edge/30 bg-surface-base/30 flex flex-col gap-2 font-utility text-xs shrink-0">
          <div className="flex justify-between text-on-surface-variant">
            <span>Subtotal</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>
          {totals.discount > 0 && (
            <div className="flex justify-between text-accent-navy">
              <span>Descuento</span>
              <span>-{formatCurrency(totals.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-on-surface-variant">
            <span>IVA (16%)</span>
            <span>{formatCurrency(totals.iva)}</span>
          </div>
          
          <div className="flex justify-between items-end mt-3 pt-3 border-t border-dashed border-surface-bright-edge/30">
            <span className="font-utility text-sm text-on-surface-variant">Total</span>
            <span className="font-narrative text-3xl text-on-surface">{formatCurrency(totals.total)}</span>
          </div>

          <div className="text-center text-[9px] text-on-surface-variant/40 uppercase tracking-widest mt-6">
            ID: {totals.folio || 'TXN-000000'}
          </div>
        </div>
      </div>

      {/* ===== LADO DERECHO: INTERACCIONES DE PAGO ===== */}
      {/* CAMBIO AQUÍ: overflow-hidden en lugar de overflow-y-auto */}
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        
        {/* Header Acciones */}
        <div className="pt-6 px-10 pb-4 flex items-center gap-4 shrink-0">
          <button onClick={onCancel} className="p-2 -ml-2 bg-surface-base hover:bg-surface-low rounded-full text-on-surface-variant transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="font-utility text-xs text-on-surface-variant tracking-widest uppercase">
            Selecciona Método de Pago
          </h2>
        </div>

        {/* SELECTOR */}
        <div className="px-10 flex gap-4 shrink-0 mb-5">
          <button
            onClick={() => setMethod('cash')}
            className={`flex-1 flex flex-col items-center justify-center gap-3 py-4 rounded-xl transition-all duration-300 border-t ${
              method === 'cash' ? 'bg-surface-container border-accent-sage shadow-[0_10px_30px_rgba(77,122,99,0.15)]' : 'bg-surface-low border-surface-bright-edge/30 hover:bg-surface-container/50 text-on-surface-variant'
            }`}
          >
            <Banknote size={24} className={method === 'cash' ? 'text-accent-sage' : ''} />
            <span className={`font-utility text-sm font-medium ${method === 'cash' ? 'text-on-surface' : ''}`}>Efectivo</span>
          </button>
          <button
            onClick={() => setMethod('card')}
            className={`flex-1 flex flex-col items-center justify-center gap-3 py-4 rounded-xl transition-all duration-300 border-t ${
              method === 'card' ? 'bg-surface-container border-accent-navy shadow-[0_10px_30px_rgba(63,90,122,0.15)]' : 'bg-surface-low border-surface-bright-edge/30 hover:bg-surface-container/50 text-on-surface-variant'
            }`}
          >
            <CreditCard size={24} className={method === 'card' ? 'text-accent-navy' : ''} />
            <span className={`font-utility text-sm font-medium ${method === 'card' ? 'text-on-surface' : ''}`}>Tarjeta</span>
          </button>
        </div>

        {/* CASH CALCULATOR (Fijo, Elástico, Sin Scroll) */}
        {method === 'cash' && (
          <div className="flex-1 flex flex-col px-10 pb-8 gap-5 min-h-0 animate-in slide-in-from-bottom-8 duration-500">
            
            {/* Resumen Superior */}
            <div className="flex justify-between items-center p-5 bg-surface-low rounded-2xl border border-surface-bright-edge/20 shrink-0">
              <div>
                <span className="font-utility text-xs text-on-surface-variant uppercase tracking-widest block mb-1">Monto Recibido</span>
                <div className="font-narrative text-4xl text-on-surface h-10">{receivedStr ? formatCurrency(receivedAmount) : '$0.00'}</div>
              </div>
              <div className="text-right">
                <span className="font-utility text-xs text-on-surface-variant uppercase tracking-widest block mb-1">Cambio a devolver</span>
                <div className={`font-narrative text-5xl transition-colors duration-300 ${isSufficient ? 'text-accent-sage' : 'text-on-surface-variant opacity-30'}`}>
                  {isSufficient ? formatCurrency(change) : '$0.00'}
                </div>
              </div>
            </div>

            {/* Teclado y Controles Inferiores (Flexibles) */}
            <div className="flex gap-4 flex-1 min-h-0">
              
              {/* 1. Izquierda: Billetes Rápidos + TODAS LAS ACCIONES */}
              <div className="w-[260px] flex flex-col gap-2 h-full">
                
                {/* Billetes Proporcionales (Llenan el espacio con grid-rows-3) */}
                <div className="grid grid-cols-2 grid-rows-3 gap-2 flex-1 min-h-0">
                  {quickBills.map(bill => (
                    <button key={bill} onClick={() => setReceivedStr(bill.toString())} className="w-full h-full bg-surface-low hover:bg-surface-container rounded-xl font-utility text-lg font-medium text-accent-sage transition-colors">
                      ${bill}
                    </button>
                  ))}
                </div>
                
                {/* Acciones con altura fija para no verse "fideos" */}
                <button onClick={() => handleKeypad('EXACT')} className="h-12 shrink-0 bg-surface-low hover:bg-surface-container rounded-xl font-utility text-sm font-medium text-accent-sage transition-colors">
                  Monto Exacto
                </button>
                <button onClick={() => handleKeypad('C')} className="h-12 shrink-0 bg-surface-low hover:bg-surface-container rounded-xl font-utility text-sm font-medium text-on-surface-variant transition-colors">
                  Limpiar
                </button>

                {/* Confirmar Masivo */}
                <button
                  disabled={!isSufficient}
                  onClick={() => onConfirm('cash', receivedAmount, change)}
                  className={`w-full mt-1 shrink-0 h-[72px] rounded-xl font-utility text-base font-medium flex items-center justify-center gap-3 transition-all duration-300 ${
                    isSufficient 
                      ? 'bg-accent-sage hover:brightness-110 text-[#e3e2e6] shadow-[0_4px_20px_rgba(77,122,99,0.25)] translate-y-0' 
                      : 'bg-surface-container text-on-surface-variant cursor-not-allowed translate-y-2 opacity-50'
                  }`}
                >
                  <CheckCircle2 size={24} />
                  Confirmar Pago
                </button>
              </div>

              {/* 2. Centro: Numpad intacto y Flexible (grid-rows-4 llena la altura exacta) */}
              <div className="flex-1 grid grid-cols-3 grid-rows-4 gap-2 h-full min-h-0">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map((key) => (
                  <button key={key} onClick={() => handleKeypad(key)} className="w-full h-full bg-surface-low hover:bg-surface-container active:bg-surface-high rounded-xl font-narrative text-2xl text-on-surface transition-colors">
                    {key}
                  </button>
                ))}
                <button onClick={() => handleKeypad('DEL')} className="w-full h-full bg-surface-low hover:bg-[#9B4444]/20 text-on-surface-variant hover:text-[#9B4444] rounded-xl flex items-center justify-center transition-colors">
                  <Delete size={28} />
                </button>
              </div>

            </div>

          </div>
        )}

        {method === 'card' && (
          <div className="flex-1 flex flex-col items-center justify-center opacity-70 animate-in fade-in duration-500 h-full">
            <CreditCard size={48} className="text-accent-navy mb-4 opacity-50" />
            <p className="font-utility text-lg text-on-surface">Esperando cobro en Terminal...</p>
            <button 
              onClick={() => onConfirm('card', totals.total, 0)}
              className="mt-8 px-6 py-3 bg-surface-container hover:bg-surface-high text-accent-navy rounded-full font-utility text-sm transition-colors"
            >
              Simular Pago Aprobado
            </button>
          </div>
        )}

      </div>
    </div>
  );
};