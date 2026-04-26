import React from 'react';

export type VoiceOrbState = 
  | 'standby' 
  | 'listening' 
  | 'processing' 
  | 'success' 
  | 'error' 
  | 'ambiguity';

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
      <style>{`
        @keyframes listening-pulse {
          0%, 100% { 
            background-color: #4D7A63;
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(77,122,99,0.3);
          }
          50% { 
            background-color: #459964;
            transform: scale(1.10);
            box-shadow: 0 0 40px rgba(69,153,100,0.5);
          }
        }
        .animate-listening {
          /* Aumentado de 1.5s a 2.5s: una respiración profunda y calmada */
          animation: listening-pulse 2.5s ease-in-out infinite;
        }
        
        /* HAZ DE LUZ DE ALTO CONTRASTE */
        @keyframes graze {
          0% { background-position: 200% 50%; }
          100% { background-position: -100% 50%; }
        }
        .processing-gradient {
          background: linear-gradient(
            110deg, 
            #31353F 30%,   
            #6F528C 50%,   
            #31353F 70%    
          );
          background-size: 300% 100%; 
          /* Aumentado de 1.8s a 4s: un escaneo lento y analítico */
          animation: graze 4s linear infinite; 
        }
      `}</style>

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