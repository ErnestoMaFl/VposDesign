import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '@/store/useAppStore';
import { AlertTriangle, Fingerprint, Package, Tag, Zap } from 'lucide-react';
import type { FormTab } from '@/store/slices/createManagementSlice';

export const ProductForm: React.FC = () => {
  // Optimización: Extraemos estrictamente lo que este formulario necesita
  const { activeProductId, catalog, activeTab, setActiveTab, updateActiveProductField } = useAppStore(
    useShallow((state) => ({
      activeProductId: state.activeProductId,
      catalog: state.catalog,
      activeTab: state.activeTab,
      setActiveTab: state.setActiveTab,
      updateActiveProductField: state.updateActiveProductField
    }))
  );
  
  const product = catalog.find(p => p.id === activeProductId);
  
  // Si por alguna razón no hay producto activo (ej. error de estado), no renderizamos nada
  if (!product) return null;

  // --- LA MAGIA DEL MARGEN ---
  // Fórmula: ((PrecioVenta - Costo) / PrecioVenta) * 100
  const margin = product.priceSale > 0 
    ? ((product.priceSale - product.priceCost) / product.priceSale) * 100 
    : 0;
    
  const isLoss = margin < 0;
  
  // Asignación de Tonal Layering dinámico basado en la ganancia
  const marginColor = isLoss ? 'text-error' : margin < 25 ? 'text-warning' : 'text-accent-sage';
  const marginBg = isLoss ? 'bg-error/10 border-error/30' : margin < 25 ? 'bg-warning/10 border-warning/30' : 'bg-accent-sage/10 border-accent-sage/30';

  // Configuración de las pestañas arquitectónicas
  const tabs: { id: FormTab; label: string; icon: React.ReactNode }[] = [
    { id: 'basic', label: 'Datos Generales', icon: <Fingerprint size={14} /> },
    { id: 'pricing', label: 'Precios', icon: <Tag size={14} /> },
    { id: 'stock', label: 'Inventario', icon: <Package size={14} /> },
    { id: 'ai', label: 'IA Semántica', icon: <Zap size={14} /> },
  ];

  return (
    <div className="flex flex-col h-full bg-surface-low rounded-2xl border border-surface-bright-edge/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      
      {/* NAVEGACIÓN DE PESTAÑAS */}
      <div className="flex border-b border-surface-bright-edge/30 bg-surface-base px-6 shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 font-utility text-xs uppercase tracking-widest font-medium transition-all relative ${
              activeTab === tab.id ? 'text-[#e3e2e6]' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-low/50'
            }`}
          >
            {tab.icon} {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-accent-sage shadow-[0_-2px_10px_rgba(77,122,99,0.8)]" />
            )}
          </button>
        ))}
      </div>

      {/* CONTENIDO DE LA PESTAÑA */}
      <div className="flex-1 p-8 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        
        {/* === PESTAÑA: PRECIOS Y MARGEN === */}
        {activeTab === 'pricing' && (
          <div className="flex gap-8">
            {/* Inputs Numéricos */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-utility text-xs uppercase tracking-widest text-on-surface-variant">
                  Precio de Costo (Proveedor)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-narrative text-3xl text-on-surface-variant">$</span>
                  <input 
                    type="number" 
                    value={product.priceCost || ''}
                    onChange={(e) => updateActiveProductField('priceCost', parseFloat(e.target.value) || 0)}
                    className="w-full bg-surface-recessed border border-surface-bright-edge/20 rounded-xl py-4 pl-10 pr-4 font-narrative text-4xl text-[#e3e2e6] outline-none focus:border-accent-navy transition-colors shadow-inner"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-utility text-xs uppercase tracking-widest text-on-surface-variant">
                  Precio de Venta (Público)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-narrative text-3xl text-on-surface-variant">$</span>
                  <input 
                    type="number" 
                    value={product.priceSale || ''}
                    onChange={(e) => updateActiveProductField('priceSale', parseFloat(e.target.value) || 0)}
                    className="w-full bg-surface-recessed border border-surface-bright-edge/20 rounded-xl py-4 pl-10 pr-4 font-narrative text-4xl text-[#e3e2e6] outline-none focus:border-accent-sage transition-colors shadow-inner"
                  />
                </div>
              </div>
            </div>

            {/* Ledger del Margen (Cambia de color en vivo) */}
            <div className={`w-[320px] rounded-2xl border flex flex-col items-center justify-center p-8 transition-all duration-500 shadow-inner shrink-0 ${marginBg}`}>
              <span className={`font-utility text-[11px] uppercase tracking-widest font-bold mb-2 ${marginColor}`}>
                Margen de Ganancia Neto
              </span>
              
              <div className="flex items-baseline gap-1">
                {isLoss && <AlertTriangle size={36} className="text-error animate-pulse mr-2" />}
                <span className={`font-narrative text-7xl leading-none tracking-tight transition-colors duration-500 ${marginColor}`}>
                  {margin.toFixed(1)}
                </span>
                <span className={`font-narrative text-4xl transition-colors duration-500 ${marginColor}`}>%</span>
              </div>
              
              <p className={`font-utility text-xs mt-4 text-center opacity-80 ${marginColor}`}>
                {isLoss 
                  ? '⚠️ Estás vendiendo por debajo del costo. Ajusta los precios.' 
                  : margin < 25 
                    ? 'Margen bajo. Considera revisar tus costos.' 
                    : 'Margen saludable y dentro del promedio operativo.'}
              </p>
            </div>
          </div>
        )}

        {/* === PESTAÑA: DATOS BÁSICOS === */}
        {activeTab === 'basic' && (
          <div className="grid grid-cols-2 gap-6 animate-in fade-in duration-300">
            <div className="flex flex-col gap-2 col-span-2">
              <label className="font-utility text-xs uppercase tracking-widest text-on-surface-variant">Nombre del Producto</label>
              <input 
                type="text" 
                value={product.name} 
                onChange={(e) => updateActiveProductField('name', e.target.value)} 
                className="w-full bg-surface-recessed border border-surface-bright-edge/20 rounded-xl px-4 py-3 font-utility text-base text-[#e3e2e6] outline-none focus:border-accent-navy transition-colors shadow-inner" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-utility text-xs uppercase tracking-widest text-on-surface-variant">SKU / Código</label>
              <input 
                type="text" 
                value={product.sku} 
                onChange={(e) => updateActiveProductField('sku', e.target.value)} 
                className="w-full bg-surface-recessed border border-surface-bright-edge/20 rounded-xl px-4 py-3 font-utility text-base text-[#e3e2e6] outline-none focus:border-accent-navy transition-colors shadow-inner uppercase" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-utility text-xs uppercase tracking-widest text-on-surface-variant">Categoría</label>
              <input 
                type="text" 
                value={product.category} 
                onChange={(e) => updateActiveProductField('category', e.target.value)} 
                className="w-full bg-surface-recessed border border-surface-bright-edge/20 rounded-xl px-4 py-3 font-utility text-base text-[#e3e2e6] outline-none focus:border-accent-navy transition-colors shadow-inner" 
              />
            </div>
          </div>
        )}

        {/* === OTRAS PESTAÑAS (Stock, AI) === */}
        {(activeTab === 'stock' || activeTab === 'ai') && (
           <div className="flex items-center justify-center h-full text-on-surface-variant font-utility text-sm italic animate-in fade-in duration-300">
             Configuración de {activeTab === 'stock' ? 'inventario y alertas' : 'sinónimos y entrenamiento'} próximamente...
           </div>
        )}

      </div>
    </div>
  );
};