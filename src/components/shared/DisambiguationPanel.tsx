import React, { useState, useEffect } from 'react';
import { Clock, X } from 'lucide-react';
import { DisambiguationCard, type DisambiguationOption } from './DisambiguationCard';

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
  const [timeLeft, setTimeLeft] = useState(10); // Timer de 10 segundos

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
    <div className="absolute inset-0 z-40 flex flex-col pt-12 px-8 bg-surface-highest/60 backdrop-blur-md rounded-tr-xl">
      
      {/* Animación personalizada para la presión de tiempo */}
      <style>{`
        @keyframes pressure-blink {
          0%, 100% { opacity: 1; transform: scale(1); filter: drop-shadow(0 0 6px rgba(155,68,68,0.6)); }
          50% { opacity: 0.5; transform: scale(1.05); filter: drop-shadow(0 0 0px rgba(155,68,68,0)); }
        }
        .animate-pressure {
          animation: pressure-blink 1.0s ease-in-out infinite;
          color: #9B4444;
        }
      `}</style>
      
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
        
        {/* Timer Visual con el efecto de presión */}
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

      {/* Opción para cancelar con hover rojo transparente */}
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
  );
};