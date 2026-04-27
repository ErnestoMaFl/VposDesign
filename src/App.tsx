import { useState } from 'react';
import { Droplet } from 'lucide-react';
import { VoiceOrb, type VoiceOrbState } from "./components/shared/VoiceOrb";
import { ProcessStepBar } from "./components/shared/ProcessStepBar";
import { CartLineItem } from "./components/shared/CartLineItem";
import { DisambiguationPanel } from "./components/shared/DisambiguationPanel";
import { CartSummaryFooter } from "./components/shared/CartSummaryFooter";

const mockAmbiguousOptions = [
  { id: '1', name: 'Coca-Cola Original 600ml', category: 'Bebidas - PET', price: 18.50, stock: 24, confidence: 92 },
  { id: '2', name: 'Coca-Cola Light 600ml', category: 'Bebidas - PET', price: 18.50, stock: 12, confidence: 85 },
  { id: '3', name: 'Coca-Cola Original 2L', category: 'Bebidas - PET', price: 35.00, stock: 8, confidence: 70 },
];

export default function App() {
  const [orbState, setOrbState] = useState<VoiceOrbState>('standby');
  const [stepMode, setStepMode] = useState<'linear' | 'context'>('linear');
  const [currentStep, setCurrentStep] = useState(0);
  const [showAmbiguity, setShowAmbiguity] = useState(false);

  const saleSteps = ['Agregar', 'Descuento', 'Cobrar', 'Confirmar'];

  const renderButton = (isActive: boolean, onClick: () => void, label: string) => (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded text-xs transition-all duration-200
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
    <div className="flex w-full h-screen bg-surface-base text-on-surface overflow-hidden">
      
      {/* LADO IZQUIERDO: ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col relative">
        
        <ProcessStepBar 
          steps={saleSteps} 
          currentStep={currentStep} 
          contextMessage={stepMode === 'context' ? 'Selecciona una operación para comenzar' : undefined}
        />

        {/* Contenedor del Carrito */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          <div className="pt-8 px-10 pb-4 shrink-0">
            <h2 className="font-utility text-xs text-on-surface-variant tracking-widest uppercase">
              Carrito Actual
            </h2>
          </div>
          
          {/* WRAPPER RELATIVO SOLO PARA LA LISTA: Aquí ocurre la magia del Fade-Out */}
          <div className="flex-1 relative overflow-hidden flex flex-col">
            
            {/* Lista: pb-12 para dar espacio al gradiente y utilidades CSS para ocultar el scrollbar feo */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 px-4 pb-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <CartLineItem 
                index={1} name="Coca-Cola Original 600ml" description="Envase PET, Fría"
                quantity={2} unitPrice={18.50} subtotal={37.00} origin="voice"
              />
              <CartLineItem 
                index={2} name="Sabritas Sal 45g" description="Pasillo 3"
                quantity={1} unitPrice={20.00} subtotal={20.00} origin="touch"
              />
              <CartLineItem 
                index={3} name="Coca Cola Regular" description="Lata 355ml"
                quantity={3} unitPrice={3.50} subtotal={10.50} origin="voice" isActive={true} 
                icon={<Droplet size={18} className="text-accent-plum" />}
              />
              {/* Duplica los ítems varias veces aquí si quieres probar el scroll y ver cómo se desvanecen */}
            </div>

            {/* MÁSCARA PREMIUM: Gradiente que desvanece los ítems hacia el color surface-base */}
            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-surface-base to-transparent pointer-events-none z-10" />
          
          </div>

          <CartSummaryFooter 
            subtotal={67.50} discount={10.50} iva={9.12} total={66.12} 
          />

        </div>

        {/* El panel de desambiguación se mantiene flotando sobre todo el lado izquierdo */}
        {showAmbiguity && (
          <DisambiguationPanel 
            options={mockAmbiguousOptions}
            onSelect={(id) => { setShowAmbiguity(false); setOrbState('success'); }}
            onCancel={() => { setShowAmbiguity(false); setOrbState('standby'); }}
          />
        )}

      </div>

      {/* LADO DERECHO: PILAR DE VOZ */}
      <div className="w-[380px] h-full bg-surface-low shadow-[-20px_0_50px_rgba(0,0,0,0.3)] z-30 flex flex-col items-center pt-32 gap-16 px-8 pb-[calc(2rem+72px)] relative">
        
        <VoiceOrb status={orbState} size="lg" />
        
        <div className="text-center space-y-3 w-full">
          <p className="font-utility text-xs text-on-surface-variant font-medium tracking-widest uppercase">
            Lo que escuché
          </p>
          <p className="font-narrative text-3xl text-on-surface italic opacity-90 leading-tight">
            {showAmbiguity ? '"agrega una coca"' : '"agrega tres maruchan de habanero"'}
          </p>
        </div>

      </div>

      {/* Controles de Mocking Visual */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-surface-recessed border-t border-surface-bright-edge/30 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-on-surface-variant uppercase tracking-widest mr-2">Micrófono:</span>
          {renderButton(orbState === 'standby', () => setOrbState('standby'), 'Standby')}
          {renderButton(orbState === 'listening', () => setOrbState('listening'), 'Listening')}
          {renderButton(orbState === 'processing', () => setOrbState('processing'), 'Processing')}
          {renderButton(orbState === 'success', () => setOrbState('success'), 'Success')}
          {renderButton(orbState === 'ambiguity', () => setOrbState('ambiguity'), 'Ambiguity')}
          {renderButton(orbState === 'error', () => setOrbState('error'), 'Error')}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-on-surface-variant uppercase tracking-widest mr-2">Flujo:</span>
          {renderButton(stepMode === 'context', () => setStepMode('context'), 'Modo Libre')}
          <div className="w-[1px] h-4 bg-surface-bright-edge mx-1"></div>
          {saleSteps.map((step, idx) => 
            renderButton(
              stepMode === 'linear' && currentStep === idx, 
              () => { setStepMode('linear'); setCurrentStep(idx); }, 
              step
            )
          )}
          <div className="w-[1px] h-4 bg-surface-bright-edge mx-1"></div>
          {renderButton(
            showAmbiguity, 
            () => { setShowAmbiguity(!showAmbiguity); if (!showAmbiguity) setOrbState('ambiguity'); }, 
            'Panel Ambigüedad'
          )}
        </div>
      </div>
    </div>
  );
}