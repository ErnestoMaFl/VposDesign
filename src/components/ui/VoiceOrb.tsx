import React from 'react';
import type { VoiceOrbState } from '@/types/voice';

interface VoiceOrbProps {
  status: VoiceOrbState;
  size?: 'sm' | 'md' | 'lg'; 
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({ status = 'standby', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  }[size];

  const stateStyles = {
    standby: 'bg-[#31353F] scale-100 shadow-none',
    listening: 'animate-listening',
    
    // REDUCIMOS el brillo estático de la sombra para que resalte más el haz de luz interno
    processing: 'processing-gradient shadow-[0_0_15px_rgba(92,66,117,0.2)] scale-100',
    
    success: 'bg-[#459964] scale-110 shadow-[0_0_40px_rgba(69,153,100,0.5)] brightness-110',
    error: 'bg-[#9B4444] scale-100 shadow-[0_0_30px_rgba(155,68,68,0.5)]',
    ambiguity: 'bg-[#B47022] animate-pulse scale-105 shadow-[0_0_30px_rgba(180,112,34,0.5)]',
  };

  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`
          rounded-full transition-all duration-500 ease-in-out
          ${sizeClasses}
          ${stateStyles[status]}
        `}
        aria-label={`Voice system status: ${status}`}
        role="status"
      />
    </div>
  );
};