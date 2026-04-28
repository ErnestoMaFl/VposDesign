import { useState } from 'react';
import { Droplet } from 'lucide-react';
import { type VoiceOrbState } from "./components/shared/VoiceOrb";
import { ProcessStepBar } from "./components/shared/ProcessStepBar";
import { DisambiguationPanel } from "./components/shared/DisambiguationPanel";
import { type ConnectionState } from "./components/shared/HeaderBar";
import { CartPanel, type CartStatus, type CartItemType } from "./components/shared/CartPanel";
import { AppShell } from "./components/shared/AppShell";
import { AuthShell } from "./components/shared/AuthShell";
import { LoginScreen } from "./components/shared/LoginScreen";
import { PaymentPanel } from "./components/shared/PaymentPanel";
import { SystemSidebar } from "./components/shared/SystemSidebar"; 

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
  const [currentView, setCurrentView] = useState<'login' | 'app'>('login');
  const [orbState, setOrbState] = useState<VoiceOrbState>('standby');
  const [stepMode, setStepMode] = useState<'linear' | 'context'>('linear');
  const [currentStep, setCurrentStep] = useState(0);
  const [showAmbiguity, setShowAmbiguity] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>('online');
  const [cartStatus, setCartStatus] = useState<CartStatus>('active');

  const saleSteps = ['Agregar', 'Descuento', 'Cobrar', 'Confirmar'];

  if (currentView === 'login') {
    return (
      <div className="flex w-full h-screen bg-surface-base overflow-hidden">
        <AuthShell>
          <LoginScreen onLoginSuccess={() => setCurrentView('app')} />
        </AuthShell>
        <div className="fixed bottom-4 right-4 z-50">
          <button 
            onClick={() => setCurrentView('app')}
            className="px-4 py-2 bg-surface-container border border-surface-bright-edge text-on-surface-variant text-xs rounded shadow-lg hover:text-on-surface"
          >
            Saltar Login (Mock)
          </button>
        </div>
      </div>
    );
  }

  return (
    // FIX MAESTRO: Envolvemos TODO en un contenedor Flex Horizontal general
    <div className="flex w-full h-screen bg-surface-base overflow-hidden">
      
      {/* 1. SIDEBAR EMPUJADOR */}
      <SystemSidebar 
        connectionState={connectionState} setConnectionState={setConnectionState}
        cartStatus={cartStatus} setCartStatus={setCartStatus}
        orbState={orbState} setOrbState={setOrbState}
        stepMode={stepMode} setStepMode={setStepMode}
        showAmbiguity={showAmbiguity} setShowAmbiguity={setShowAmbiguity}
        onAdvanceStep={() => { setStepMode('linear'); setCurrentStep((prev) => (prev + 1) % saleSteps.length); }}
        onGoToLogin={() => setCurrentView('login')}
      />

      {/* 2. APP SHELL (Ocupa el resto del espacio) */}
      <div className="flex-1 overflow-hidden">
        <AppShell
          headerProps={{
            connectionStatus: connectionState,
            moduleName: "Venta Principal",
          }}
          voiceProps={{
            status: orbState,
            transcriptText: showAmbiguity ? "agrega una coca" : "agrega tres maruchan de habanero",
            isPartialTranscript: orbState === 'listening',
            detectedIntention: showAmbiguity ? "BÚSQUEDA_AMBIGUA" : "TRANSACCIÓN_VENTA",
            interpretations: showAmbiguity 
              ? [{ id: '1', text: 'Detectada intención: Agregar', status: 'success', semanticType: 'add' }, { id: '2', text: 'Entidad: "coca" (Múltiples coincidencias)', status: 'error' }] 
              : [{ id: '1', text: 'Intención: Agregar', status: 'success', semanticType: 'add' }, { id: '2', text: 'Cantidad: 3', status: 'success', semanticType: 'quantity' }, { id: '3', text: 'Producto: Sopa Maruchan Habanero', status: 'pending', semanticType: 'product' }],
            availableCommands: showAmbiguity 
              ? ['Opción 1', 'Opción 2', 'La de 600 mililitros', 'Ninguna'] 
              : ['Cobrar venta', 'Aplicar descuento', 'Cancelar', 'Buscar producto'],
          }}
        >
          <ProcessStepBar 
            steps={saleSteps} 
            currentStep={currentStep} 
            contextMessage={stepMode === 'context' ? 'Selecciona una operación para comenzar' : undefined}
          />

          <CartPanel 
            status={cartStatus}
            items={cartStatus === 'empty' ? [] : mockCartItems}
            totals={{ subtotal: 67.50, discount: 10.50, iva: 9.12, total: 66.12 }}
            onIncreaseItem={(id) => console.log('Aumentar', id)}
            onDecreaseItem={(id) => console.log('Reducir', id)}
            onDeleteItem={(id) => console.log('Eliminar', id)}
            onCharge={() => { setStepMode('linear'); setCurrentStep(2); }} 
            onSaveDraft={() => console.log('Pausar')}
          />

          {currentStep === 2 && stepMode === 'linear' && (
            <PaymentPanel
              totals={{ subtotal: 67.50, discount: 10.50, iva: 9.12, total: 66.12, folio: 'TXN-84920' }}
              items={mockCartItems}
              onCancel={() => setCurrentStep(1)} 
              onConfirm={(method, received, change) => {
                console.log('Pago confirmado:', { method, received, change });
                setCurrentStep(3); 
                setOrbState('success');
              }}
            />
          )}

          {showAmbiguity && (
            <DisambiguationPanel 
              options={mockAmbiguousOptions}
              onSelect={() => { setShowAmbiguity(false); setOrbState('success'); }}
              onCancel={() => { setShowAmbiguity(false); setOrbState('standby'); }}
            />
          )}
        </AppShell>
      </div>

    </div>
  );
}