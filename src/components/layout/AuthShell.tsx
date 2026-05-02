import React from 'react';

export const AuthShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative flex w-full h-screen bg-surface-base text-on-surface overflow-hidden items-center justify-center">
      
      {/* Iluminación Ambiental (Luces desenfocadas de fondo) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-navy/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-sage/10 blur-[120px] rounded-full" />
      </div>

      {/* Contenedor Principal */}
      <div className="relative z-10 w-full max-w-4xl h-full flex flex-col py-12 px-8">
        {children}
      </div>

    </div>
  );
};