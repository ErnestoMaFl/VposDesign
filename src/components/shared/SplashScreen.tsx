import React, { useState, useEffect } from 'react';
import { ProcessStepBar } from './ProcessStepBar';
import { SessionRecoveryCard } from './SessionRecoveryCard';
import { WifiOff } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  simulateError?: boolean;
  simulateRecovery?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onComplete, 
  simulateError = false,
  simulateRecovery = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [statusText, setStatusText] = useState('Inicializando...');
  const [showError, setShowError] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);

  const bootSteps = ['Conectando', 'Catálogo', 'Sesiones', 'Listo'];

  useEffect(() => {
    let isMounted = true;

    const runBootSequence = async () => {
      // Paso 0: Siempre arranca conectando
      if (!isMounted) return;
      setCurrentStep(0);
      setStatusText('Conectando con WebSocket...');
      await new Promise(r => setTimeout(r, 1500));

      // Si el mock de error está activo, estalla aquí y detiene el Splash
      if (!isMounted) return;
      if (simulateError) {
        setShowError(true);
        return; 
      }

      // Paso 1: Catálogo
      setCurrentStep(1);
      setStatusText('Sincronizando índices del catálogo en memoria...');
      await new Promise(r => setTimeout(r, 1500));

      // Paso 2: Sesiones
      if (!isMounted) return;
      setCurrentStep(2);
      setStatusText('Verificando integridad de sesiones previas...');
      
      // Si el mock de recuperación está activo, estalla aquí y detiene el Splash
      if (simulateRecovery) {
        setShowRecovery(true);
        return;
      }

      await new Promise(r => setTimeout(r, 1500));

      // Paso 3: Éxito
      if (!isMounted) return;
      setCurrentStep(3);
      setStatusText('Sistema operativo listo. Lanzando entorno...');
      
      await new Promise(r => setTimeout(r, 1000));
      
      if (!isMounted) return;
      onComplete(); // Manda a la app
    };

    runBootSequence();

    return () => { isMounted = false; };
  }, [simulateError, simulateRecovery, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-2xl mx-auto z-10">
      
      {/* ÁREA DEL LOGO ARREGLADA (VERDE, GIGANTE, SIN FONDO NEGRO) */}
      <div className="relative flex items-center justify-center mb-16">
        {/* Glow arquitectónico tenue en VERDE (accent-sage) */}
        <div className="absolute inset-0 bg-accent-sage opacity-20 blur-[80px] rounded-full scale-150" />
        
        {/* Logo: Gigante (w-56), sin bordes, sin fondo negro (mix-blend-screen), EN VERDE */}
        <img 
          src="/logo.webp" 
          alt="VPOS Logo" 
          className="relative w-56 h-56 object-contain mix-blend-screen opacity-90 drop-shadow-[0_0_30px_rgba(77,122,99,0.3)]"
        />
      </div>

      {showError ? (
        <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-16 h-16 rounded-full bg-[#9B4444]/10 flex items-center justify-center mb-6">
            <WifiOff size={32} className="text-[#9B4444]" />
          </div>
          <h2 className="font-narrative text-3xl text-on-surface mb-3">Error de red</h2>
          <p className="font-utility text-sm text-on-surface-variant max-w-md mb-8">
            No pudimos conectar con Groq ni la base de datos central. El sistema operará temporalmente en <span className="text-accent-navy font-medium">Modo Local</span>.
          </p>
          <button onClick={onComplete} className="px-8 py-3 bg-surface-container hover:bg-surface-high border border-surface-bright-edge/30 transition-colors rounded-full font-utility text-sm text-on-surface">
            Continuar en Modo Local
          </button>
        </div>
      ) : showRecovery ? (
        <SessionRecoveryCard 
          saleId="#TXN-84920"
          itemCount={3}
          total={66.12}
          timestamp="Ayer, 10:42 PM"
          onDiscard={() => {
            setShowRecovery(false);
            setCurrentStep(3);
            setStatusText('Limpiando estado y lanzando entorno...');
            setTimeout(onComplete, 1000);
          }}
          onRecover={() => onComplete()}
        />
      ) : (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
          <div className="w-full mb-8">
            <ProcessStepBar steps={bootSteps} currentStep={currentStep} />
          </div>
          <div className="h-10 flex items-center justify-center">
            <p className="font-utility text-xs text-on-surface-variant uppercase tracking-widest font-medium animate-pulse">
              {statusText}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};