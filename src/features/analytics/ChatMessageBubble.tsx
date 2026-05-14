import React from 'react';
import { User, Cpu } from 'lucide-react';
import type { ChatMessage } from '@/types/analytics';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  children?: React.ReactNode; // Espacio reservado para inyectar gráficas/tablas en el siguiente paso
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message, children }) => {
  const isUser = message.role === 'user';

  // --- BURBUJA DEL DUEÑO (DERECHA) ---
  if (isUser) {
    return (
      <div className="flex w-full justify-end mb-8 animate-in fade-in duration-300">
        <div className="max-w-[80%] flex flex-col items-end gap-1.5">
          <span className="font-utility text-[10px] text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
            Tú <User size={12} />
          </span>
          <p className="font-narrative text-3xl text-on-surface-variant italic text-right leading-tight">
            "{message.content}"
          </p>
        </div>
      </div>
    );
  }

  // --- BURBUJA DE LA IA (IZQUIERDA) ---
  return (
    <div className="flex w-full justify-start mb-8 animate-in fade-in duration-500">
      <div className="w-full max-w-[90%] flex flex-col items-start gap-2">
        <span className="font-utility text-[10px] text-accent-plum uppercase tracking-widest flex items-center gap-1.5 font-medium">
          <Cpu size={12} /> Analista VPOS
        </span>
        
        <div className="w-full bg-surface-low rounded-2xl rounded-tl-sm p-6 shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-surface-bright-edge/10">
          {/* Narrativa Ejecutiva */}
          <p className="font-utility text-sm text-[#e3e2e6] leading-relaxed">
            {message.content}
          </p>
          
          {/* Aquí inyectaremos los resultados visuales (variante table o bar-chart) */}
          {children && (
            <div className="mt-6">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};