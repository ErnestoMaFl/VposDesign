import { useState } from 'react';
import { VoiceOrb, type VoiceOrbState } from "./components/shared/VoiceOrb";
import { ProcessStepBar } from "./components/shared/ProcessStepBar";

export default function App() {
  const [orbState, setOrbState] = useState<VoiceOrbState>('standby');
  
  // Estado para controlar la ProcessStepBar
  const [stepMode, setStepMode] = useState<'linear' | 'context'>('linear');
  const [currentStep, setCurrentStep] = useState(0);
  const saleSteps = ['Agregar', 'Descuento', 'Cobrar', 'Confirmar'];

  // Renderizador de Ghost Buttons (manteniendo la pureza del diseño)
  const renderButton = (
    isActive: boolean, 
    onClick: () => void, 
    label: string
  ) => (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded text-sm transition-all duration-200
        ${isActive 
          ? 'bg-surface-high text-on-surface' 
          : 'bg-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
        }
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-screen bg-surface-base text-on-surface overflow-hidden">
      
      {/* Componente Integrado: ProcessStepBar en la parte superior */}
      <ProcessStepBar 
        steps={saleSteps} 
        currentStep={currentStep} 
        contextMessage={stepMode === 'context' ? 'Selecciona una operación para comenzar' : undefined}
      />

      {/* Contenedor central (Main Workspace) */}
      <div className="flex-1 flex flex-col items-center justify-center gap-16">
        
        {/* Título - Tensión Editorial */}
        <div className="text-center space-y-2">
          <h1 className="font-narrative text-4xl tracking-wide">The Monolith</h1>
          <p className="font-utility text-on-surface-variant font-medium text-sm">
            Component Isolation Environment
          </p>
        </div>

        {/* El Orb en aislamiento */}
        <div className="p-8 bg-surface-low rounded-2xl">
          <VoiceOrb status={orbState} size="lg" />
        </div>

        {/* Controles de Mocking Visual */}
        <div className="flex flex-col gap-4 w-full max-w-2xl px-4">
          
          {/* Controles del Voice Orb */}
          <div className="flex flex-col gap-2 p-4 bg-surface-recessed rounded-xl">
            <span className="text-xs text-on-surface-variant font-medium tracking-widest uppercase mb-1">Estado del Micrófono</span>
            <div className="flex flex-wrap gap-2">
              {renderButton(orbState === 'standby', () => setOrbState('standby'), 'Standby')}
              {renderButton(orbState === 'listening', () => setOrbState('listening'), 'Listening')}
              {renderButton(orbState === 'processing', () => setOrbState('processing'), 'Processing')}
              {renderButton(orbState === 'success', () => setOrbState('success'), 'Success')}
              {renderButton(orbState === 'ambiguity', () => setOrbState('ambiguity'), 'Ambiguity')}
              {renderButton(orbState === 'error', () => setOrbState('error'), 'Error')}
            </div>
          </div>

          {/* Controles de la ProcessStepBar */}
          <div className="flex flex-col gap-2 p-4 bg-surface-recessed rounded-xl">
            <span className="text-xs text-on-surface-variant font-medium tracking-widest uppercase mb-1">Control de Flujo (Pila)</span>
            
            <div className="flex flex-wrap gap-2 mb-2 pb-2 border-b-2 border-surface-base">
              {renderButton(stepMode === 'context', () => setStepMode('context'), 'Forzar Modo Libre')}
              {renderButton(stepMode === 'linear', () => setStepMode('linear'), 'Forzar Flujo de Venta')}
            </div>

            {stepMode === 'linear' && (
              <div className="flex flex-wrap gap-2">
                {saleSteps.map((step, idx) => 
                  renderButton(
                    currentStep === idx, 
                    () => setCurrentStep(idx), 
                    `Paso: ${step}`
                  )
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}