import React from 'react';

export type AccentColor = 'sage' | 'navy' | 'plum' | 'default';

interface InventoryOperationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  accent?: AccentColor;
  onClick: () => void;
}

export const InventoryOperationCard: React.FC<InventoryOperationCardProps> = ({
  title,
  description,
  icon,
  accent = 'default',
  onClick,
}) => {
  // Mapeo de la tríada de acentos del Architectural Monolith
  const accentStyles = {
    sage: 'text-[#4D7A63]',
    navy: 'text-[#3F5A7A]',
    plum: 'text-[#5C4275]',
    default: 'text-[#919194]', // on-surface-variant como fallback neutral
  };

  return (
    <button
      onClick={onClick}
      className="
        group relative flex flex-col w-full text-left
        p-8 rounded-xl
        bg-[#1F2128] /* surface-container */
        hover:bg-[#272B34] /* surface-high */
        transition-all duration-300 ease-in-out
        shadow-[inset_0_1px_0_#3C4150] 
        /* Ambient Shadow on hover: profunda, difusa, sentida pero no vista */
        hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]
        overflow-hidden
      "
    >
      {/* 
        Efecto de luz ambiental asimétrica. 
        Un gradiente radial muy sutil que sangra el color de acento 
        solo cuando se hace hover, manteniendo el aspecto mate.
      */}
      <div 
        className={`
          absolute -top-12 -right-12 w-48 h-48 rounded-full blur-[80px] 
          opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none
          ${
            accent === 'sage' ? 'bg-[#4D7A63]' :
            accent === 'navy' ? 'bg-[#3F5A7A]' :
            accent === 'plum' ? 'bg-[#5C4275]' : 'bg-[#3C4150]'
          }
        `}
      />

      {/* Ícono con el color de acento correspondiente */}
      <div className={`mb-6 transition-transform duration-300 group-hover:-translate-y-1 ${accentStyles[accent]}`}>
        {icon}
      </div>

      <div className="flex flex-col relative z-10">
        {/* Título: Inter 500 (Medium), nunca Bold */}
        <h4 className="font-[Inter] font-medium text-[18px] text-[#E3E2E6] tracking-tight mb-2">
          {title}
        </h4>
        
        {/* Descripción: Inter 400 (Regular), On-Surface-Variant, leading relajado */}
        <p className="font-[Inter] font-normal text-[14px] text-[#919194] leading-[1.6]">
          {description}
        </p>
      </div>
    </button>
  );
};