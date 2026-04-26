import { useState } from 'react';
import { VoiceOrb, type VoiceOrbState } from "./components/shared/VoiceOrb";
export default function App() {
  const [orbState, setOrbState] = useState<VoiceOrbState>('standby');

  // Botón fantasma (Ghost Button) que sigue las reglas del Monolith
  const renderButton = (state: VoiceOrbState, label: string) => (
    <button
      onClick={() => setOrbState(state)}
      className={`
        px-4 py-2 rounded text-sm transition-all duration-200
        ${orbState === state 
          ? 'bg-surface-high text-on-surface' // Estado activo
          : 'bg-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface' // Ghost inactivo
        }
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-surface-base text-on-surface gap-16">
      
      {/* Título - Tensión Editorial */}
      <div className="text-center space-y-2">
        <h1 className="font-narrative text-4xl tracking-wide">The Monolith</h1>
        <p className="font-utility text-on-surface-variant font-medium text-sm">
          Voice Orb Validation
        </p>
      </div>

      {/* El Componente en aislamiento */}
      <div className="p-8 bg-surface-low rounded-2xl">
        <VoiceOrb status={orbState} size="lg" />
      </div>

      {/* Panel de Control (Mocking Visual) */}
      <div className="flex flex-wrap gap-2 justify-center max-w-md p-4 bg-surface-recessed rounded-xl">
        {renderButton('standby', 'Standby')}
        {renderButton('listening', 'Listening')}
        {renderButton('processing', 'Processing')}
        {renderButton('success', 'Success')}
        {renderButton('ambiguity', 'Ambiguity')}
        {renderButton('error', 'Error')}
      </div>

    </div>
  );
}