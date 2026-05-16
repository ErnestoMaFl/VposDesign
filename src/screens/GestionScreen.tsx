import { useMemo, useState } from 'react'; // <-- AÑADIR useState
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '@/store/useAppStore';
import { CardPanelLayout } from '@/components/layout/CardPanelLayout';
import { HybridSearchInput } from '@/components/shared/HybridSearch/HybridSearchInput';
import { ProductCard } from '@/features/management/ProductCard';
import { ProductForm } from '@/features/management/ProductForm';
import { Plus, Save, X } from 'lucide-react';
import { DestructiveConfirmModal } from '@/components/shared/Modals/DestructiveConfirmModal';

export const GestionScreen = () => {
  const { 
    catalog, searchQuery, viewMode, activeProductId, isSearching, orbState, connectionState,
    setSearchQuery, openEditProduct, closeForm, saveProduct, openCreateProduct
  } = useAppStore(useShallow((state) => ({
    catalog: state.catalog,
    searchQuery: state.searchQuery,
    viewMode: state.viewMode,
    activeProductId: state.activeProductId,
    isSearching: state.isSearching,
    orbState: state.orbState,
    connectionState: state.connectionState,
    setSearchQuery: state.setSearchQuery,
    openEditProduct: state.openEditProduct,
    closeForm: state.closeForm,
    saveProduct: state.saveProduct,
    openCreateProduct: state.openCreateProduct
  })));

  // ESTADO PARA EL MODAL DE DESCARTAR CAMBIOS
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);

  const filteredCatalog = useMemo(() => {
    if (!searchQuery) return catalog.slice(0, 50);
    
    const q = searchQuery.toLowerCase();
    const resultados = catalog.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.sku.toLowerCase().includes(q)
    );
    
    return resultados.slice(0, 50);
  }, [catalog, searchQuery]);

  const activeProduct = useMemo(() => 
    catalog.find(p => p.id === activeProductId), 
  [catalog, activeProductId]);

  const getVoiceProps = () => {
    if (viewMode === 'edit' && activeProduct) {
      return {
        status: orbState,
        transcriptText: orbState === 'listening' ? "cambia el precio de costo..." : "",
        isPartialTranscript: orbState === 'listening',
        detectedIntention: "EDICIÓN_CATÁLOGO",
        interpretations: [],
        availableCommands: [
          'Cambia precio de venta a [X]', 
          'Cambia precio de costo a [X]', 
          'Guardar cambios', 
          'Cancelar edición'
        ]
      };
    }
    
    return {
      status: orbState,
      transcriptText: isSearching ? searchQuery : (orbState === 'listening' ? "busca sabritas..." : ""),
      isPartialTranscript: orbState === 'listening',
      interpretations: [],
      availableCommands: ['Buscar [producto]', 'Nuevo producto', 'Volver al inicio']
    };
  };

  return (
    <CardPanelLayout
      headerProps={{ 
        moduleName: "Gestión de Catálogo", 
        connectionStatus: connectionState, 
        cashierName: "Ernesto Macias", 
        role: "Dueño",
        shift: "Turno Único"
      }}
      voiceProps={getVoiceProps()}
      stepContextMessage={viewMode === 'list' ? 'BASE DE DATOS DE PRODUCTOS' : `EDITANDO: ${activeProduct?.name.toUpperCase()}`}
      title={viewMode === 'list' ? 'Tu Catálogo.' : 'Detalle de Producto.'}
      
      headerAction={
        viewMode === 'list' ? (
          <button 
            onClick={openCreateProduct}
            className="group flex items-center gap-2 px-5 py-2.5 bg-surface-low hover:bg-accent-sage/10 border border-surface-bright-edge/30 hover:border-accent-sage/40 transition-all duration-300 rounded-lg font-utility text-sm text-[#e3e2e6] hover:text-[#daffe8] hover:shadow-[0_0_15px_rgba(77,122,99,0.2)] active:scale-95"
          >
            <Plus size={16} className="text-surface-bright-edge group-hover:text-accent-sage transition-colors" />
            Nuevo Producto
          </button>
        ) : (
          <div className="flex gap-3">
            <button 
              // CAMBIO AQUÍ: En lugar de closeForm(), abrimos el modal
              onClick={() => setIsDiscardModalOpen(true)} 
              className="flex items-center gap-2 px-5 py-2.5 bg-surface-low hover:bg-error/15 hover:text-error border border-transparent transition-colors rounded-lg font-utility text-sm text-on-surface-variant"
            >
              <X size={16} /> Descartar
            </button>
            <button 
              onClick={saveProduct} 
              className="flex items-center gap-2 px-6 py-2.5 bg-accent-sage/80 hover:bg-accent-sage active:bg-[#3b6751] active:scale-[0.98] transition-all duration-300 rounded-lg font-utility text-sm text-[#daffe8] shadow-[0_4px_15px_rgba(77,122,99,0.2)]"
            >
              <Save size={16} /> Guardar Cambios
            </button>
          </div>
        )
      }
    >
      
      {viewMode === 'list' ? (
        <div className="flex flex-col h-full min-h-0">
          <div className="mb-6 shrink-0">
            <HybridSearchInput 
              value={searchQuery} 
              onChange={setSearchQuery} 
              isListening={orbState === 'listening'} 
            />
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 pb-8 [&::-webkit-scrollbar]:hidden">
            {isSearching ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {[1,2,3,4,5,6].map(i => (
                   <div key={i} className="h-[90px] bg-surface-low rounded-xl animate-pulse border border-surface-bright-edge/10 flex items-center p-4 gap-4">
                     <div className="w-14 h-14 bg-surface-container rounded-lg shrink-0" />
                     <div className="flex-1 flex flex-col gap-2">
                       <div className="h-4 bg-surface-container rounded w-3/4" />
                       <div className="h-3 bg-surface-container rounded w-1/2" />
                     </div>
                   </div>
                 ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCatalog.length > 0 ? (
                  filteredCatalog.map(p => (
                    <ProductCard 
                      key={p.id} 
                      product={p} 
                      onClick={() => openEditProduct(p.id)} 
                    />
                  ))
                ) : (
                  <div className="col-span-full py-12 flex flex-col items-center justify-center text-on-surface-variant">
                    <p className="font-utility text-sm uppercase tracking-widest">No se encontraron productos.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 pb-6">
          <ProductForm />
        </div>
      )}

      {/* NUESTRO MODAL INYECTADO */}
      <DestructiveConfirmModal
        isOpen={isDiscardModalOpen}
        title="¿Descartar cambios?"
        description="Se perderán todas las modificaciones no guardadas de este producto. Esta acción no se puede deshacer."
        confirmText="Sí, descartar"
        cancelText="Seguir editando"
        armingTimeMs={1000} // Le ponemos 1 segundo para no ser tan lentos en catálogos
        onConfirm={() => {
          setIsDiscardModalOpen(false);
          closeForm(); // Aquí ejecutamos la acción real
        }}
        onCancel={() => setIsDiscardModalOpen(false)}
      />

    </CardPanelLayout>
  );
};