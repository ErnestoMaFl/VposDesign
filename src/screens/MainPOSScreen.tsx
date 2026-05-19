import { useEffect, useState, useMemo, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { mockAmbiguousOptions } from '@/mocks/dummyData';
import { useAppStore } from '@/store/useAppStore';
import { AppShell } from '@/components/layout/AppShell';
import { ProcessStepBar } from '@/components/ui/ProcessStepBar';
import { CartPanel } from '@/features/cart/CartPanel';
import { PaymentPanel } from '@/features/payment/PaymentPanel';
import { DisambiguationPanel } from '@/features/voice/DisambiguationPanel';
import { QuickQueryModal } from '@/features/analytics/QuickQueryModal';
import { HybridSearchInput } from '@/components/shared/HybridSearch/HybridSearchInput';
import { DestructiveConfirmModal } from '@/components/shared/Modals/DestructiveConfirmModal';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { saleToCartView } from '@/utils/saleAdapters';
import type { CartStatus } from '@/types/cart';
import type { Sale } from '@/services/saleService';

// En el navegador, setTimeout devuelve number, no NodeJS.Timeout
type TimeoutHandle = ReturnType<typeof setTimeout>;

export const MainPOSScreen = () => {
  // --- Selectores granulares del store ---
  const {
    orbState,
    stepMode,
    currentStep,
    showAmbiguity,
    connectionState,
    setOrbState,
    setStepMode,
    setCurrentStep,
    setShowAmbiguity,
  } = useAppStore(
    useShallow((s) => ({
      orbState: s.orbState,
      stepMode: s.stepMode,
      currentStep: s.currentStep,
      showAmbiguity: s.showAmbiguity,
      connectionState: s.connectionState,
      setOrbState: s.setOrbState,
      setStepMode: s.setStepMode,
      setCurrentStep: s.setCurrentStep,
      setShowAmbiguity: s.setShowAmbiguity,
    }))
  );

  const {
    activeSale,
    saleStatus,
    saleError,
    isMutatingSale,
    ensureActiveSale,
    addItemToSale,
    removeItemFromSale,
    updateItemQty,
    completeSale,
    cancelActiveSale,
    freezeSale,
  } = useAppStore(
    useShallow((s) => ({
      activeSale: s.activeSale,
      saleStatus: s.saleStatus,
      saleError: s.saleError,
      isMutatingSale: s.isMutatingSale,
      ensureActiveSale: s.ensureActiveSale,
      addItemToSale: s.addItemToSale,
      removeItemFromSale: s.removeItemFromSale,
      updateItemQty: s.updateItemQty,
      completeSale: s.completeSale,
      cancelActiveSale: s.cancelActiveSale,
      freezeSale: s.freezeSale,
    }))
  );
  const saleSteps = ['Agregar', 'Descuento', 'Cobrar', 'Confirmar'];

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Refs para coalescing de updates por item (evita N PUTs en cascada)
  const pendingQtyTimers = useRef<Map<string, TimeoutHandle>>(new Map());

  // Bootstrap: garantizar venta activa al entrar al POS
  useEffect(() => {
    ensureActiveSale();
  }, [ensureActiveSale]);

  // Cleanup: cancelar todos los timers pendientes al desmontar
  useEffect(() => {
    const timers = pendingQtyTimers.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  // Derivar la vista del carrito desde la venta real
  const { items: cartItems, totals: cartTotals } = useMemo(
    () => saleToCartView(activeSale),
    [activeSale]
  );

  const cartStatus: CartStatus = useMemo(() => {
    if (saleStatus === 'frozen') return 'frozen';
    if (!activeSale || activeSale.items.length === 0) return 'empty';
    return 'active';
  }, [saleStatus, activeSale]);

  // -----------------------------------------------------------
  // Optimistic helpers (mutan el activeSale en memoria sin tocar backend)
  // -----------------------------------------------------------
  const applyOptimisticQty = (itemId: string, newQty: number) => {
    const sale = useAppStore.getState().activeSale;
    if (!sale) return;

    if (newQty <= 0) {
      const filtered = sale.items.filter((i) => i.id !== itemId);
      const subtotal = filtered.reduce((acc, i) => acc + i.subtotal, 0);
      const tax = subtotal * 0.16;
      useAppStore.setState({
        activeSale: {
          ...sale,
          items: filtered,
          subtotal,
          tax_amount: tax,
          total: subtotal - sale.discount_amount + tax,
        },
      });
      return;
    }

    const updatedItems = sale.items.map((i) =>
      i.id === itemId
        ? {
            ...i,
            quantity: newQty,
            subtotal: i.unit_price * newQty,
            // available_stock se preserva (sigue siendo el del último refresh)
          }
        : i
    );
    const subtotal = updatedItems.reduce((acc, i) => acc + i.subtotal, 0);
    const tax = subtotal * 0.16;
    useAppStore.setState({
      activeSale: {
        ...sale,
        items: updatedItems,
        subtotal,
        tax_amount: tax,
        total: subtotal - sale.discount_amount + tax,
      },
    });
  };

  // Debounce: si el usuario hace clic 10 veces seguidas, solo enviamos 1 PUT
  const scheduleBackendQtyUpdate = (itemId: string, targetQty: number) => {
    const prev = pendingQtyTimers.current.get(itemId);
    if (prev) clearTimeout(prev);

    const timer = setTimeout(() => {
      pendingQtyTimers.current.delete(itemId);
      if (targetQty <= 0) {
        removeItemFromSale(itemId);
      } else {
        updateItemQty(itemId, targetQty);
      }
    }, 350);

    pendingQtyTimers.current.set(itemId, timer);
  };

  // -----------------------------------------------------------
  // Handlers
  // -----------------------------------------------------------
  const handleSelectProduct = async (productId: string, quantity = 1) => {
    if (!activeSale) {
      await ensureActiveSale();
    }
    const item = await addItemToSale(productId, quantity);
    if (item) {
      setSearchQuery('');
      setOrbState('success');
      setTimeout(() => setOrbState('standby'), 800);
    } else {
      setOrbState('error');
      setTimeout(() => setOrbState('standby'), 1200);
    }
  };

  const handleIncrease = (id: string) => {
    const sale = useAppStore.getState().activeSale;
    const item = sale?.items.find((i) => i.id === id);
    if (!item) return;

    const newQty = item.quantity + 1;

    // Guard estricto: comparar el target contra el stock disponible
    if (
      item.available_stock !== undefined &&
      newQty > item.available_stock
    ) {
      useAppStore.setState({
        saleError: `Solo hay ${item.available_stock} unidades disponibles de "${item.product_name}"`,
      });
      setOrbState('error');
      setTimeout(() => setOrbState('standby'), 1200);
      return; // No optimistic, no backend
    }

    applyOptimisticQty(id, newQty);
    scheduleBackendQtyUpdate(id, newQty);
  };

  const handleDecrease = (id: string) => {
    const sale = useAppStore.getState().activeSale;
    const item = sale?.items.find((i) => i.id === id);
    if (!item) return;

    const newQty = item.quantity - 1;
    applyOptimisticQty(id, newQty);
    scheduleBackendQtyUpdate(id, newQty);
  };

  const handleDelete = (id: string) => {
    // Cancelar cualquier debounce pendiente sobre este item
    const pending = pendingQtyTimers.current.get(id);
    if (pending) {
      clearTimeout(pending);
      pendingQtyTimers.current.delete(id);
    }
    // Optimistic remove + delete real
    applyOptimisticQty(id, 0);
    removeItemFromSale(id);
  };

  const handleCharge = () => {
    if (!activeSale || activeSale.items.length === 0) return;
    setStepMode('linear');
    setCurrentStep(2);
  };

  const handleSaveDraft = () => {
    // Fase 6 conectará esto al stack PDA real. Por ahora solo congelamos visual.
    freezeSale();
  };

  const handleCancelSale = async () => {
    setIsCancelModalOpen(false);
    await cancelActiveSale('Cancelada por el cajero');
    setSearchQuery('');
    setCurrentStep(0);
    setStepMode('context');
    setOrbState('success');
    setTimeout(() => setOrbState('standby'), 1500);
    await ensureActiveSale();
  };

  const handlePaymentConfirm = async (
    method: 'cash' | 'card' | null,
    received: number
  ) => {
    if (!method) return;
    const backendMethod = method === 'cash' ? 'efectivo' : 'tarjeta';
    const result = await completeSale(backendMethod, received);
    if (result) {
      setCurrentStep(3);
      setOrbState('success');
      setTimeout(async () => {
        setCurrentStep(0);
        setStepMode('context');
        setOrbState('standby');
        await ensureActiveSale();
      }, 2500);
    } else {
      setOrbState('error');
      setTimeout(() => setOrbState('standby'), 1500);
    }
  };

  // -----------------------------------------------------------
  // Render
  // -----------------------------------------------------------
  return (
    <AppShell
      headerProps={{
        connectionStatus: connectionState,
        moduleName: activeSale
          ? `Venta ${activeSale.sale_number}`
          : 'Venta Activa',
      }}
      voiceProps={{
        status: orbState,
        transcriptText: showAmbiguity
          ? 'agrega una coca'
          : 'agrega tres maruchan de habanero',
        isPartialTranscript: orbState === 'listening',
        detectedIntention: showAmbiguity
          ? 'BÚSQUEDA_AMBIGUA'
          : 'TRANSACCIÓN_VENTA',
        interpretations: showAmbiguity
          ? [
              {
                id: '1',
                text: 'Detectada intención: Agregar',
                status: 'success',
                semanticType: 'add',
              },
              {
                id: '2',
                text: 'Entidad: "coca" (Múltiples coincidencias)',
                status: 'error',
              },
            ]
          : [],
        availableCommands: ['Cobrar venta', 'Cancelar', 'Buscar producto'],
      }}
    >
      <ProcessStepBar
        steps={saleSteps}
        currentStep={currentStep}
        contextMessage={
          stepMode === 'context'
            ? activeSale
              ? 'Agrega productos al carrito por voz o búsqueda'
              : 'Iniciando nueva venta...'
            : undefined
        }
      />

      {/* Banner de error de venta */}
      {saleError && (
        <div className="mx-4 mt-2 px-4 py-2 bg-error/15 border border-error/30 rounded-lg text-error font-utility text-sm flex justify-between items-center animate-in fade-in duration-200">
          <span>{saleError}</span>
          <button
            onClick={() => useAppStore.setState({ saleError: null })}
            className="text-error/60 hover:text-error text-xs uppercase tracking-widest ml-4"
          >
            cerrar
          </button>
        </div>
      )}

      {/* Buscador + Cancelar (solo en pasos de armado) */}
      {cartStatus !== 'frozen' && currentStep < 2 && (
        <div className="px-4 pb-4 pt-2 flex gap-4 items-center z-50 relative animate-in fade-in duration-300">
          <div className="flex-1 min-w-0">
            <HybridSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={
                isMutatingSale
                  ? 'Procesando...'
                  : 'Buscar producto manual o escanear...'
              }
              withDropdown={true}
              autoSelectOnWinner={true}
              onSelectResult={(res) => {
                handleSelectProduct(res.id, 1);
              }}
              onMicClick={() =>
                setOrbState(orbState === 'listening' ? 'standby' : 'listening')
              }
            />
          </div>

          <Button
            variant="destructive"
            size="md"
            className="shrink-0 py-4"
            leftIcon={<Trash2 size={18} />}
            disabled={cartStatus === 'empty' || isMutatingSale}
            onClick={() => setIsCancelModalOpen(true)}
          >
            Cancelar Venta
          </Button>
        </div>
      )}

      <CartPanel
        status={cartStatus}
        items={cartItems}
        totals={cartTotals}
        onIncreaseItem={handleIncrease}
        onDecreaseItem={handleDecrease}
        onDeleteItem={handleDelete}
        onCharge={handleCharge}
        onSaveDraft={handleSaveDraft}
      />

      {currentStep === 2 && stepMode === 'linear' && activeSale && (
        <PaymentPanel
          totals={{
            subtotal: cartTotals.subtotal,
            discount: cartTotals.discount,
            iva: cartTotals.iva,
            total: cartTotals.total,
            folio: cartTotals.folio,
          }}
          items={cartItems}
          onCancel={() => setCurrentStep(1)}
          onConfirm={(method, received) =>
            handlePaymentConfirm(method, received)
          }
        />
      )}

      {showAmbiguity && (
        <DisambiguationPanel
          options={mockAmbiguousOptions}
          onSelect={(optionId) => {
            const option = mockAmbiguousOptions.find((o) => o.id === optionId);
            setShowAmbiguity(false);
            if (option) handleSelectProduct(option.id, 1);
          }}
          onCancel={() => {
            setShowAmbiguity(false);
            setOrbState('standby');
          }}
        />
      )}

      <QuickQueryModal />

      <DestructiveConfirmModal
        isOpen={isCancelModalOpen}
        title="¿Cancelar venta actual?"
        description="Se eliminarán todos los productos del carrito y se perderá el progreso. Esta acción no se puede deshacer."
        confirmText="Sí, cancelar venta"
        cancelText="Volver al carrito"
        armingTimeMs={1500}
        onConfirm={handleCancelSale}
        onCancel={() => setIsCancelModalOpen(false)}
      />
    </AppShell>
  );
};