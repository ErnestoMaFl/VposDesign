import React from 'react';
import { X, Loader2, BarChart2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { QueryResultCard } from './QueryResultCard';

export const QuickQueryModal: React.FC = () => {
  const { 
    isQuickQueryModalOpen, 
    isQuerying, 
    activeQuickQuery, 
    closeQuickQuery 
  } = useAppStore();

  if (!isQuickQueryModalOpen) return null;

  return (
    // BACKDROP
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-surface-base/70 backdrop-blur-sm animate-in fade-in duration-300 px-4">
      
      {/* CONTENEDOR DEL MODAL */}
      <div className="w-full max-w-2xl bg-surface-low border border-surface-bright-edge/30 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* HEADER: Título y botón de cerrar */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-surface-bright-edge/20 bg-surface-highest/30">
          <div className="flex items-center gap-2 text-accent-plum">
            <BarChart2 size={16} />
            <span className="font-utility text-xs uppercase tracking-widest font-medium">
              Consulta Rápida
            </span>
          </div>
          {/* Este es el único botón que necesitas para salir */}
          <button 
            onClick={closeQuickQuery}
            className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/15 rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENIDO (El Body del Modal) */}
        <div className="p-8 min-h-[300px] flex flex-col justify-center">
          
          {isQuerying ? (
            // ESTADO: CARGANDO
            <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in">
              <Loader2 size={32} className="text-accent-plum animate-spin opacity-80" />
              <p className="font-utility text-sm text-on-surface-variant uppercase tracking-widest animate-pulse">
                Procesando consulta...
              </p>
            </div>
          ) : activeQuickQuery ? (
            // ESTADO: RESULTADO LISTO
            <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="font-utility text-base text-[#e3e2e6] leading-relaxed mb-2">
                {activeQuickQuery.content}
              </p>
              
              <div className="w-full">
                <QueryResultCard 
                  variant={activeQuickQuery.variant} 
                  payload={activeQuickQuery.payload} 
                />
              </div>
            </div>
          ) : null}

        </div>

      </div>
    </div>
  );
};