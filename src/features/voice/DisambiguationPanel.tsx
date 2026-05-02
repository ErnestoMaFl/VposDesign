import React, { useState, useEffect } from 'react';
import { Clock, X } from 'lucide-react';
import { DisambiguationCard, type DisambiguationOption } from "@/components/ui/DisambiguationCard";

interface DisambiguationPanelProps {
  options: DisambiguationOption[];
  onSelect: (id: string) => void;
  onCancel: () => void;
  cancelKeyword?: string;
}

export const DisambiguationPanel: React.FC<DisambiguationPanelProps> = ({ 
  options, 
  onSelect, 
  onCancel,
  cancelKeyword = "Ninguna" 
}) => {
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (timeLeft <= 0) {
      onCancel();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onCancel]);

  const isUrgent = timeLeft <= 5;

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center px-8 bg-surface-highest/60 backdrop-blur-md">
      
      {/* FIX: Cambiado a max-w-2xl para que las opciones no se vean apretadas */}
      <div className="w-full max-w-2xl flex flex-col">
        
        {/* Header del Panel */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="font-utility text-xs text-accent-sage tracking-widest uppercase mb-2">
              Múltiples Coincidencias
            </h3>
            <p className="font-utility text-lg text-on-surface">
              ¿Cuál de estos productos quisiste decir?
            </p>
          </div>
          
          {/* Timer Visual */}
          <div className={`flex items-center gap-2 transition-all duration-300 ${isUrgent ? 'animate-pressure' : 'text-on-surface-variant'}`}>
            <Clock size={16} />
            <span className="font-utility text-sm font-medium tabular-nums">
              00:{String(timeLeft).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Lista de Opciones */}
        <div className="flex flex-col gap-3">
          {options.slice(0, 4).map((opt, index) => (
            <DisambiguationCard 
              key={opt.id} 
              index={index + 1} 
              option={opt} 
              onSelect={onSelect} 
            />
          ))}
        </div>

        {/* Opción para cancelar */}
        <div className="mt-8 flex justify-center">
          <button 
            onClick={onCancel}
            className="group flex items-center gap-2 px-6 py-3 bg-surface-base text-on-surface-variant rounded-full transition-all duration-300 font-utility text-sm hover:bg-[#9B4444]/15 hover:text-[#9B4444]"
          >
            <X size={16} className="transition-colors" />
            <span>
              O di <span className="text-on-surface font-medium group-hover:text-[#9B4444] transition-colors">"{cancelKeyword}"</span> para cancelar
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};