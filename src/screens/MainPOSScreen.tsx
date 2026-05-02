import { mockCartItems, mockAmbiguousOptions } from '@/mocks/dummyData';
import { useAppStore } from '@/store/useAppStore';

import { AppShell } from '@/components/layout/AppShell';
import { SystemSidebar } from '@/components/layout/SystemSidebar';
import { ProcessStepBar } from '@/components/ui/ProcessStepBar';
import { CartPanel } from '@/features/cart/CartPanel';
import { PaymentPanel } from '@/features/payment/PaymentPanel';
import { DisambiguationPanel } from '@/features/voice/DisambiguationPanel';

interface MainPOSScreenProps {
  onGoToLogin: () => void;
  onGoToSplash: () => void;
  onGoToHome: () => void;
  mockError: boolean;
  setMockError: (v: boolean) => void;
  mockRecovery: boolean;
  setMockRecovery: (v: boolean) => void;
}

export const MainPOSScreen = ({
  onGoToLogin, onGoToSplash, onGoToHome, mockError, setMockError, mockRecovery, setMockRecovery // <-- Agregado
}: MainPOSScreenProps) => {
  
  // Selectores atómicos
  const orbState = useAppStore((state) => state.orbState);
  const stepMode = useAppStore((state) => state.stepMode);
  const currentStep = useAppStore((state) => state.currentStep);
  const showAmbiguity = useAppStore((state) => state.showAmbiguity);
  const connectionState = useAppStore((state) => state.connectionState);
  const cartStatus = useAppStore((state) => state.cartStatus);

  const setOrbState = useAppStore((state) => state.setOrbState);
  const setStepMode = useAppStore((state) => state.setStepMode);
  const setCurrentStep = useAppStore((state) => state.setCurrentStep);
  const setShowAmbiguity = useAppStore((state) => state.setShowAmbiguity);
  const setConnectionState = useAppStore((state) => state.setConnectionState);
  const setCartStatus = useAppStore((state) => state.setCartStatus);

  const saleSteps = ['Agregar', 'Descuento', 'Cobrar', 'Confirmar'];

  return (
    <div className="flex w-full h-screen bg-surface-base overflow-hidden">
      <SystemSidebar 
        connectionState={connectionState} setConnectionState={setConnectionState}
        cartStatus={cartStatus} setCartStatus={setCartStatus}
        orbState={orbState} setOrbState={setOrbState}
        stepMode={stepMode} setStepMode={setStepMode}
        showAmbiguity={showAmbiguity} setShowAmbiguity={setShowAmbiguity}
        onAdvanceStep={() => { setStepMode('linear'); setCurrentStep((currentStep + 1) % saleSteps.length); }}
        onGoToLogin={onGoToLogin}
        onGoToSplash={onGoToSplash}
        onGoToHome={onGoToHome}
        mockError={mockError} setMockError={setMockError}
        mockRecovery={mockRecovery} setMockRecovery={setMockRecovery}
      />

      <div className="flex-1 overflow-hidden">
        <AppShell
          headerProps={{ connectionStatus: connectionState, moduleName: "Venta Principal" }}
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
              onConfirm={() => { setCurrentStep(3); setOrbState('success'); }}
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
};