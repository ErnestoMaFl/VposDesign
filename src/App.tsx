import { useState } from 'react';
import { Droplet } from 'lucide-react';
import { VoiceOrb, type VoiceOrbState } from "./components/shared/VoiceOrb";
import { ProcessStepBar } from "./components/shared/ProcessStepBar";
import { DisambiguationPanel } from "./components/shared/DisambiguationPanel";
import { HeaderBar, type ConnectionState } from "./components/shared/HeaderBar";
import { VoicePanel, type InterpretationItem } from "./components/shared/VoicePanel";
import { CartPanel, type CartStatus, type CartItemType } from "./components/shared/CartPanel"; // NUEVO IMPORTE

// Mocks y Datos simulados
const mockAmbiguousOptions = [
  { id: '1', name: 'Coca-Cola Original 600ml', category: 'Bebidas - PET', price: 18.50, stock: 24, confidence: 92 },
  { id: '2', name: 'Coca-Cola Light 600ml', category: 'Bebidas - PET', price: 18.50, stock: 12, confidence: 85 },
  { id: '3', name: 'Coca-Cola Original 2L', category: 'Bebidas - PET', price: 35.00, stock: 8, confidence: 70 },
];

const mockCartItems: CartItemType[] = [
  { id: 'i1', name: 'Coca-Cola Original 600ml', description: 'Envase PET, Fría', quantity: 2, unitPrice: 18.50, subtotal: 37.00, origin: 'voice' },
  { id: 'i2', name: 'Sabritas Sal 45g', description: 'Pasillo 3', quantity: 1, unitPrice: 20.00, subtotal: 20.00, origin: 'touch' },
  { id: 'i3', name: 'Coca Cola Regular', description: 'Lata 355ml', quantity: 3, unitPrice: 3.50, subtotal: 10.50, origin: 'voice', isActive: true, icon: <Droplet size={18} className="text-accent-plum" /> },
];

export default function App() {
  const [orbState, setOrbState] = useState<VoiceOrbState>('standby');
  const [stepMode, setStepMode] = useState<'linear' | 'context'>('linear');
  const [currentStep, setCurrentStep] = useState(0);
  const [showAmbiguity, setShowAmbiguity] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>('online');
  const [cartStatus, setCartStatus] = useState<CartStatus>('active');

  const saleSteps = ['Agregar', 'Descuento', 'Cobrar', 'Confirmar'];

  const renderButton = (isActive: boolean, onClick: () => void, label: string) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded text-xs transition-all duration-200 ${isActive ? 'bg-surface-high text-on-surface' : 'bg-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex w-full h-screen bg-surface-base text-on-surface overflow-hidden">
      
      {/* LADO IZQUIERDO: ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col relative">

        {/* CORRECCIÓN 3: Envolvemos el Header y el StepBar en un contenedor z-40 para que floten sobre el cristal del carrito */}
        <div className="relative z-40 flex flex-col shadow-sm">
          <HeaderBar connectionStatus={connectionState} />
          <ProcessStepBar 
            steps={saleSteps} 
            currentStep={currentStep} 
            contextMessage={stepMode === 'context' ? 'Selecciona una operación para comenzar' : undefined}
          />
        </div>

        {/* CONTENEDOR CENTRAL (Carrito) */}
        <div className="flex-1 relative flex flex-col overflow-hidden">
          <CartPanel 
            status={cartStatus}
            items={cartStatus === 'empty' ? [] : mockCartItems}
            totals={{ subtotal: 67.50, discount: 10.50, iva: 9.12, total: 66.12 }}
            onIncreaseItem={(id) => console.log('Aumentar', id)}
            onDecreaseItem={(id) => console.log('Reducir', id)}
            onDeleteItem={(id) => console.log('Eliminar', id)}
            onCharge={() => console.log('Cobrar')}
            onSaveDraft={() => console.log('Pausar')}
          />

          {showAmbiguity && (
            <DisambiguationPanel 
              options={mockAmbiguousOptions}
              onSelect={(id) => { setShowAmbiguity(false); setOrbState('success'); }}
              onCancel={() => { setShowAmbiguity(false); setOrbState('standby'); }}
            />
          )}
        </div>

      </div>

      {/* LADO DERECHO: PILAR DE VOZ */}
      <VoicePanel 
        status={orbState}
        transcriptText={showAmbiguity ? "agrega una coca" : "agrega tres maruchan de habanero"}
        isPartialTranscript={orbState === 'listening'}
        detectedIntention={showAmbiguity ? "BÚSQUEDA_AMBIGUA" : "TRANSACCIÓN_VENTA"}
        interpretations={showAmbiguity ? [{ id: '1', text: 'Detectada intención: Agregar', status: 'success', semanticType: 'add' }, { id: '2', text: 'Entidad: "coca" (Múltiples coincidencias)', status: 'error' }] : [{ id: '1', text: 'Intención: Agregar', status: 'success', semanticType: 'add' }, { id: '2', text: 'Cantidad: 3', status: 'success', semanticType: 'quantity' }, { id: '3', text: 'Producto: Sopa Maruchan Habanero', status: 'pending', semanticType: 'product' }]}
        availableCommands={showAmbiguity ? ['Opción 1', 'Opción 2', 'La de 600 mililitros', 'Ninguna'] : ['Cobrar venta', 'Aplicar descuento', 'Cancelar', 'Buscar producto']}
      />

      {/* Controles de Mocking Visual */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-surface-recessed border-t border-surface-bright-edge/30 flex justify-between items-center z-50">
        
        {/* Mock Carrito & Micrófono */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-on-surface-variant uppercase tracking-widest mr-2">Carrito:</span>
          {renderButton(cartStatus === 'empty', () => setCartStatus('empty'), 'Vacío')}
          {renderButton(cartStatus === 'active', () => setCartStatus('active'), 'Activo')}
          {renderButton(cartStatus === 'frozen', () => setCartStatus('frozen'), 'Congelado')}
          
          <div className="w-[1px] h-4 bg-surface-bright-edge mx-2"></div>
          
          <span className="text-[10px] text-on-surface-variant uppercase tracking-widest mr-2">Micrófono:</span>
          {renderButton(orbState === 'standby', () => setOrbState('standby'), 'Standby')}
          {renderButton(orbState === 'listening', () => setOrbState('listening'), 'Listening')}
          {renderButton(orbState === 'processing', () => setOrbState('processing'), 'Processing')}
          {renderButton(orbState === 'success', () => setOrbState('success'), 'Success')}
          {renderButton(orbState === 'error', () => setOrbState('error'), 'Error')}
        </div>

        {/* Mock Flujo & Red */}
        <div className="flex items-center gap-2">
          {renderButton(showAmbiguity, () => { setShowAmbiguity(!showAmbiguity); if (!showAmbiguity) setOrbState('ambiguity'); }, 'Panel Ambigüedad')}
          
          <div className="w-[1px] h-4 bg-surface-bright-edge mx-2"></div>

          <span className="text-[10px] text-on-surface-variant uppercase tracking-widest mr-2">Flujo:</span>
          {renderButton(stepMode === 'context', () => setStepMode('context'), 'Libre')}
          
          {/* CORRECCIÓN 2: Botón exclusivo para avanzar pasos */}
          <button
            onClick={() => {
              setStepMode('linear');
              setCurrentStep((prev) => (prev + 1) % saleSteps.length);
            }}
            className="px-3 py-1.5 rounded text-xs transition-all duration-200 bg-surface-container border border-surface-bright-edge hover:bg-surface-high text-on-surface flex items-center gap-1 font-medium ml-1"
          >
            Avanzar Paso &rarr;
          </button>

          <div className="w-[1px] h-4 bg-surface-bright-edge mx-2"></div>
          
          <span className="text-[10px] text-on-surface-variant uppercase tracking-widest mr-2">Red:</span>
          {renderButton(connectionState === 'online', () => setConnectionState('online'), 'ON')}
          {renderButton(connectionState === 'local', () => setConnectionState('local'), 'LOC')}
          {renderButton(connectionState === 'offline', () => setConnectionState('offline'), 'OFF')}
        </div>

      </div>
    </div>
  );
}