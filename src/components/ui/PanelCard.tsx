import React from 'react';

// El sub-componente de la métrica inferior izquierda
export const BottomLeftMetric = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="flex flex-col justify-end pb-1 shrink-0">
    <span className="font-utility text-[11px] tracking-widest uppercase text-[#9ca3af] mb-1.5">
      {label}
    </span>
    <div className="flex items-center min-h-[28px]">
      {children}
    </div>
  </div>
);

interface PanelCardProps {
  title: string;
  description: string;
  backgroundIcon: React.ReactNode;
  accentShadow?: 'sage' | 'navy' | 'plum' | 'neutral';
  bottomLeft: React.ReactNode;
  bottomRight: React.ReactNode;
  onClick: () => void;
}

export const PanelCard: React.FC<PanelCardProps> = ({
  title,
  description,
  backgroundIcon,
  accentShadow = 'neutral',
  bottomLeft,
  bottomRight,
  onClick
}) => {
  const shadowClasses = {
    sage: 'hover:shadow-card-sage',
    navy: 'hover:shadow-card-navy',
    plum: 'hover:shadow-card-plum',
    neutral: 'hover:shadow-card-neutral',
  };

  return (
    <button 
      onClick={onClick}
      className={`group relative flex flex-col p-8 bg-surface-low hover:bg-surface-container border border-transparent hover:border-surface-bright-edge/30 transition-all duration-500 cursor-pointer overflow-hidden text-left rounded-2xl w-full min-h-[280px] ${shadowClasses[accentShadow]}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Ícono de fondo masivo */}
      <div className="absolute top-2 right-2">
        {backgroundIcon}
      </div>
      
      <div className="flex flex-col relative z-10 w-full h-full">
        <div>
          <h4 className="font-utility font-medium text-xl text-[#e3e2e6]">
            {title}
          </h4>
          <p className="font-utility text-[15px] text-[#9ca3af] mt-1 max-w-[65%] line-clamp-2">
            {description}
          </p>
        </div>

        <div className="mt-auto flex justify-between items-end w-full">
          {bottomLeft}
          <div className="flex flex-col items-end">
            {bottomRight}
          </div>
        </div>
      </div>
    </button>
  );
};