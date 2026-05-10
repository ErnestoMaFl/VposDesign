import React from 'react';
import { mockCartItems, mockAmbiguousOptions } from '@/mocks/dummyData';
import { useAppStore } from '@/store/useAppStore';

import { AppShell } from '@/components/layout/AppShell';
import { ProcessStepBar } from '@/components/ui/ProcessStepBar';
import { CartPanel } from '@/features/cart/CartPanel';
import { PaymentPanel } from '@/features/payment/PaymentPanel';
import { DisambiguationPanel } from '@/features/voice/DisambiguationPanel';

// ¡Adiós a las interfaces con props de navegación y mocks!
// Ahora React Router y RootLayout se encargan de eso.

export const MainPOSScreen = () => {
  
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

  const saleSteps = ['Agregar', 'Descuento', 'Cobrar', 'Confirmar'];

  // NOTA CLAVE: Ya no devolvemos el <div className="flex..."> ni el <SystemSidebar>
  // Devolvemos directamente el <AppShell> porque el RootLayout ya nos envuelve.
  
  return (
    <AppShell
      headerProps={{ connectionStatus: connectionState, moduleName: "Venta Activa" }}
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
  );
};