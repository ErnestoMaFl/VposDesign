import React, { useEffect, useRef } from 'react';
import { Mic, Loader2 } from 'lucide-react';
import type { ChatMessage } from '@/types/analytics';
import { ChatMessageBubble } from './ChatMessageBubble';
import { QueryResultCard } from './QueryResultCard';
import { PillSuggestions } from './PillSuggestions';

interface ConversationalQueryInterfaceProps {
  messages: ChatMessage[];
  suggestions: string[];
  onSuggestionSelect: (text: string) => void;
  isListening?: boolean; // Para mostrar el feedback visual si el Orb está escuchando
  isQuerying?: boolean;  // Para mostrar feedback si está procesando la IA
}

export const ConversationalQueryInterface: React.FC<ConversationalQueryInterfaceProps> = ({
  messages,
  suggestions,
  onSuggestionSelect,
  isListening = false,
  isQuerying = false,
}) => {
  // Referencia para el auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Efecto para hacer scroll suave hacia abajo cuando llega un mensaje nuevo
  useEffect(() => {
    // Usamos un pequeño timeout para darle tiempo a las animaciones CSS (como la gráfica) de renderizarse
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isQuerying]); // Se dispara cuando cambian los mensajes o el estado de carga

  return (
    <div className="flex flex-col h-full w-full overflow-hidden relative">
      
      {/* --- ZONA SUPERIOR: Historial del Chat --- */}
      <div className="flex-1 overflow-y-auto px-8 pt-8 pb-32 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-surface-bright-edge/50 [&::-webkit-scrollbar-thumb]:rounded-full">
        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg}>
            {/* Si el mensaje tiene payload visual (tabla o gráfica), lo inyectamos como hijo */}
            {(msg.variant === 'table' || msg.variant === 'bar-chart') && (
              <QueryResultCard variant={msg.variant} payload={msg.payload} />
            )}
          </ChatMessageBubble>
        ))}

        {/* Indicador de procesamiento de la IA (Escribiendo...) */}
        {isQuerying && (
          <div className="flex w-full justify-start mb-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-surface-low rounded-full px-5 py-3 flex items-center gap-2 border border-surface-bright-edge/20 shadow-sm">
              <Loader2 size={14} className="text-accent-plum animate-spin" />
              <span className="font-utility text-xs text-on-surface-variant">Analizando datos...</span>
            </div>
          </div>
        )}

        {/* Ancla invisible para el auto-scroll */}
        <div ref={messagesEndRef} className="h-4 w-full" />
      </div>

      {/* --- ZONA INFERIOR: Sugerencias e Input Fijo --- */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-surface-base via-surface-base to-transparent pt-12 pb-6 px-8">
        
        {/* Indicador si el usuario activó la voz */}
        <div className={`mb-3 transition-opacity duration-300 ${isListening ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-sage/10 border border-accent-sage/20 rounded-full">
            <Mic size={12} className="text-accent-sage animate-pulse" />
            <span className="font-utility text-[10px] text-accent-sage font-medium uppercase tracking-widest">
              Escuchando tu pregunta...
            </span>
          </div>
        </div>

        {/* Los chips de sugerencias */}
        <PillSuggestions 
          suggestions={suggestions} 
          onSelect={onSuggestionSelect} 
        />
      </div>

    </div>
  );
};