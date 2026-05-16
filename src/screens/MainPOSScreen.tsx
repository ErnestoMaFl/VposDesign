import { useState } from 'react'; // <-- AÑADIR useState
import { mockCartItems, mockAmbiguousOptions } from '@/mocks/dummyData';
import { useAppStore } from '@/store/useAppStore';

import { AppShell } from '@/components/layout/AppShell';
import { ProcessStepBar } from '@/components/ui/ProcessStepBar';
import { CartPanel } from '@/features/cart/CartPanel';
import { PaymentPanel } from '@/features/payment/PaymentPanel';
import { DisambiguationPanel } from '@/features/voice/DisambiguationPanel';
import { QuickQueryModal } from '@/features/analytics/QuickQueryModal';

// <-- NUEVOS IMPORTS
import { HybridSearchInput } from '@/components/shared/HybridSearch/HybridSearchInput';
import { DestructiveConfirmModal } from '@/components/shared/Modals/DestructiveConfirmModal';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const MainPOSScreen = () => {
  const {
    orbState, stepMode, currentStep, showAmbiguity, connectionState, cartStatus,
    setOrbState, setStepMode, setCurrentStep, setShowAmbiguity, setCartStatus
  } = useAppStore();

  const saleSteps = ['Agregar', 'Descuento', 'Cobrar', 'Confirmar'];

  // <-- NUEVOS ESTADOS LOCALES
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Acción real al confirmar la cancelación
  const handleCancelSale = () => {
    setIsCancelModalOpen(false);
    setCartStatus('empty'); // Vaciamos el carrito en el estado global
    setSearchQuery('');
    
    // Feedback visual en el Orb de Voz
    setOrbState('success');
    setTimeout(() => setOrbState('standby'), 1500);
  };

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

      {/* NUEVA BARRA DE ACCIONES (Buscador Táctil + Cancelar Venta) */}
      {/* Solo se muestra si estamos en la fase de agregar productos y no está congelado */}
      {cartStatus !== 'frozen' && currentStep < 2 && (
        // ARREGLO 1: z-50 para aplastar el z-20 del CartPanel. px-8 para alinear exacto.
        <div className="px-4 pb-4 pt-2 flex gap-4 items-center z-50 relative animate-in fade-in duration-300">
          <div className="flex-1 min-w-0">
            <HybridSearchInput 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar producto manual o escanear..."
              withDropdown={true}
              onSelectResult={(res) => {
                console.log('Agregado manual al carrito:', res);
                setSearchQuery('');
              }}
              // ARREGLO 2: Le pasamos la acción para que el micrófono funcione
              onMicClick={() => setOrbState(orbState === 'listening' ? 'standby' : 'listening')}
            />
          </div>
          
         <Button 
            variant="destructive" 
            size="md"
            className="shrink-0 py-4"
            leftIcon={<Trash2 size={18} />}
            disabled={cartStatus === 'empty'}
            onClick={() => setIsCancelModalOpen(true)}
          >
            Cancelar Venta
          </Button>
        </div>
      )}

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

      <QuickQueryModal />

      {/* NUESTRO MODAL INYECTADO PROTEGIENDO EL CARRITO */}
      <DestructiveConfirmModal
        isOpen={isCancelModalOpen}
        title="¿Cancelar venta actual?"
        description="Se eliminarán todos los productos del carrito y se perderá el progreso. Esta acción no se puede deshacer."
        confirmText="Sí, cancelar venta"
        cancelText="Volver al carrito"
        armingTimeMs={1500} // El estándar de 1.5s para no borrar 20 ítems por accidente
        onConfirm={handleCancelSale}
        onCancel={() => setIsCancelModalOpen(false)}
      />

    </AppShell>
  );
};