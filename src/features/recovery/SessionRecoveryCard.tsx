import React from 'react';
import { AlertCircle, Clock, RefreshCw, Trash2 } from 'lucide-react';

interface SessionRecoveryCardProps {
  saleId: string;
  itemCount: number;
  total: number;
  timestamp: string;
  onRecover: () => void;
  onDiscard: () => void;
}

export const SessionRecoveryCard: React.FC<SessionRecoveryCardProps> = ({
  saleId,
  itemCount,
  total,
  timestamp,
  onRecover,
  onDiscard
}) => {
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);

  return (
    <div className="w-full max-w-md bg-surface-container rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      
      <div className="absolute top-0 left-0 w-full h-[1px] bg-surface-bright-edge opacity-50" />
      
      <div className="flex items-center gap-3 mb-6">
        <AlertCircle size={20} className="text-accent-plum" />
        <span className="font-utility text-xs font-medium text-accent-plum uppercase tracking-widest">
          Sesión Suspendida Detectada
        </span>
      </div>

      <div className="flex flex-col gap-2 mb-8">
        <h3 className="font-narrative text-4xl text-on-surface">Venta {saleId}</h3>
        <div className="flex items-center gap-4 text-on-surface-variant font-utility text-sm mt-2">
          <span className="flex items-center gap-1.5"><Clock size={14} /> {timestamp}</span>
          <span className="w-1 h-1 rounded-full bg-surface-bright-edge" />
          <span>{itemCount} ítems</span>
          <span className="w-1 h-1 rounded-full bg-surface-bright-edge" />
          <span className="text-on-surface font-medium">{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={onDiscard}
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-surface-low hover:bg-[#9B4444]/15 hover:text-[#9B4444] text-on-surface-variant transition-colors rounded-xl font-utility text-sm"
        >
          <Trash2 size={16} />
          Descartar
        </button>
        <button 
          onClick={onRecover}
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-accent-sage hover:brightness-110 text-[#e3e2e6] transition-all rounded-xl font-utility text-sm shadow-[0_4px_20px_rgba(77,122,99,0.25)]"
        >
          <RefreshCw size={16} />
          Recuperar Venta
        </button>
      </div>
    </div>
  );
};