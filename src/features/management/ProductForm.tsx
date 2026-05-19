import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '@/store/useAppStore';
import { AlertTriangle, Fingerprint, Package, Tag, Zap, ScanBarcode, Scale, ToggleLeft, ToggleRight } from 'lucide-react';
import type { FormTab } from '@/store/slices/createManagementSlice';

export const ProductForm: React.FC = () => {
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
  
  if (!product) return null;

  // --- CÁLCULO DE MARGEN ---
  const margin = product.priceSale > 0 
    ? ((product.priceSale - product.priceCost) / product.priceSale) * 100 
    : 0;
    
  const isLoss = margin < 0;
  
  // Tonal Layering dinámico basado en la ganancia
  const marginColor = isLoss ? 'text-error' : margin < 25 ? 'text-warning' : 'text-accent-sage';
  const marginBg = isLoss ? 'bg-error/10 border-error/30' : margin < 25 ? 'bg-warning/10 border-warning/30' : 'bg-accent-sage/10 border-accent-sage/30';

  const tabs: { id: FormTab; label: string; icon: React.ReactNode }[] = [
    { id: 'basic', label: 'Datos Generales', icon: <Fingerprint size={14} /> },
    { id: 'pricing', label: 'Precios e Impuestos', icon: <Tag size={14} /> },
    { id: 'stock', label: 'Inventario', icon: <Package size={14} /> },
    { id: 'ai', label: 'IA Semántica', icon: <Zap size={14} /> },
  ];

  // Opciones del enum unit_of_measure de tu BD
  const unitOptions = [
    'pieza', 'kilogramo', 'gramo', 'litro', 'mililitro', 'metro', 
    'centímetro', 'onza', 'pulgada', 'paquete', 'caja', 'oferta', 'otro'
  ];

  // Helpers para manejar Arrays como Strings separados por comas en los inputs
  const handleArrayChange = (field: 'aiAliases' | 'synonyms', value: string) => {
    const arrayValue = value.split(',').map(s => s.trim()).filter(Boolean);
    updateActiveProductField(field, arrayValue);
  };

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
      <div className="flex-1 p-8 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-surface-bright-edge/50 [&::-webkit-scrollbar-thumb]:rounded-full">
        
        {/* === PESTAÑA: DATOS BÁSICOS === */}
        {activeTab === 'basic' && (
          <div className="grid grid-cols-2 gap-6 animate-in fade-in duration-300">
            <div className="flex flex-col gap-2 col-span-2">
              <label className="font-utility text-xs uppercase tracking-widest text-on-surface-variant">Nombre del Producto</label>
              <input 
                type="text" 
                value={product.name || ''} 
                onChange={(e) => updateActiveProductField('name', e.target.value)} 
                className="w-full bg-surface-recessed border border-surface-bright-edge/20 rounded-xl px-4 py-3 font-utility text-base text-[#e3e2e6] outline-none focus:border-accent-navy transition-colors shadow-inner" 
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="font-utility text-xs uppercase tracking-widest text-on-surface-variant">SKU Interno</label>
              <input 
                type="text" 
                value={product.sku || ''} 
                onChange={(e) => updateActiveProductField('sku', e.target.value)} 
                className="w-full bg-surface-recessed border border-surface-bright-edge/20 rounded-xl px-4 py-3 font-utility text-base text-[#e3e2e6] outline-none focus:border-accent-navy transition-colors shadow-inner uppercase" 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-utility text-xs uppercase tracking-widest text-on-surface-variant flex items-center gap-1">
                <ScanBarcode size={14} /> Código de Barras
              </label>
              <input 
                type="text" 
                value={product.barcode || ''} 
                onChange={(e) => updateActiveProductField('barcode', e.target.value)} 
                className="w-full bg-surface-recessed border border-surface-bright-edge/20 rounded-xl px-4 py-3 font-utility text-base text-[#e3e2e6] outline-none focus:border-accent-navy transition-colors shadow-inner" 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-utility text-xs uppercase tracking-widest text-on-surface-variant">Marca</label>
              <input 
                type="text" 
                value={product.brand || ''} 
                onChange={(e) => updateActiveProductField('brand', e.target.value)} 
                className="w-full bg-surface-recessed border border-surface-bright-edge/20 rounded-xl px-4 py-3 font-utility text-base text-[#e3e2e6] outline-none focus:border-accent-navy transition-colors shadow-inner" 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-utility text-xs uppercase tracking-widest text-on-surface-variant">Categoría</label>
              <input 
                type="text" 
                value={product.category || ''} 
                onChange={(e) => updateActiveProductField('category', e.target.value)} 
                className="w-full bg-surface-recessed border border-surface-bright-edge/20 rounded-xl px-4 py-3 font-utility text-base text-[#e3e2e6] outline-none focus:border-accent-navy transition-colors shadow-inner" 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-utility text-xs uppercase tracking-widest text-on-surface-variant flex items-center gap-1">
                <Scale size={14} /> Unidad de Medida
              </label>
              <div className="relative">
                <select
                  value={product.unit || 'pieza'}
                  onChange={(e) => updateActiveProductField('unit', e.target.value)}
                  className="w-full bg-surface-recessed border border-surface-bright-edge/20 rounded-xl px-4 py-3 font-utility text-base text-[#e3e2e6] outline-none focus:border-accent-navy transition-colors shadow-inner appearance-none cursor-pointer"
                >
                  {unitOptions.map(u => <option key={u} value={u} className="bg-surface-base">{u}</option>)}
                </select>
              </div>
            </div>

            {/* Switches de Estado */}
            <div className="flex items-center gap-8 pl-2">
              <button 
                onClick={() => updateActiveProductField('is_active', !product.is_active)}
                className="flex items-center gap-2 group outline-none"
              >
                {product.is_active 
                  ? <ToggleRight size={32} className="text-accent-sage" /> 
                  : <ToggleLeft size={32} className="text-on-surface-variant" />}
                <span className="font-utility text-sm text-[#e3e2e6] group-hover:text-white transition-colors">Activo en POS</span>
              </button>

              <button 
                onClick={() => updateActiveProductField('is_bulk', !product.is_bulk)}
                className="flex items-center gap-2 group outline-none"
              >
                {product.is_bulk 
                  ? <ToggleRight size={32} className="text-accent-navy" /> 
                  : <ToggleLeft size={32} className="text-on-surface-variant" />}
                <span className="font-utility text-sm text-[#e3e2e6] group-hover:text-white transition-colors">Venta a Granel</span>
              </button>
            </div>
          </div>
        )}

        {/* === PESTAÑA: PRECIOS E IMPUESTOS === */}
        {activeTab === 'pricing' && (
          <div className="flex gap-8 animate-in fade-in duration-300">
            <div className="flex-1 flex flex-col gap-6">
              
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-utility text-xs uppercase tracking-widest text-on-surface-variant">Precio de Costo</label>
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
                  <label className="font-utility text-xs uppercase tracking-widest text-on-surface-variant">Precio de Venta</label>
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

              <div className="flex flex-col gap-2 w-1/2 pr-3">
                <label className="font-utility text-xs uppercase tracking-widest text-on-surface-variant">Tasa de Impuesto (IVA %)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={(product.taxRate ?? 0.16) * 100}
                    onChange={(e) => updateActiveProductField('taxRate', (parseFloat(e.target.value) || 0) / 100)}
                    className="w-full bg-surface-recessed border border-surface-bright-edge/20 rounded-xl py-3 pl-4 pr-10 font-utility text-xl text-[#e3e2e6] outline-none focus:border-accent-navy transition-colors shadow-inner"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-utility text-xl text-on-surface-variant">%</span>
                </div>
              </div>

            </div>

            {/* Ledger del Margen */}
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

        {/* === PESTAÑA: INVENTARIO === */}
        {activeTab === 'stock' && (
          <div className="grid grid-cols-2 gap-6 animate-in fade-in duration-300">
            <div className="flex flex-col gap-2">
              <label className="font-utility text-xs uppercase tracking-widest text-on-surface-variant">Stock Actual</label>
              <input 
                type="number" 
                value={product.stock || 0} 
                onChange={(e) => updateActiveProductField('stock', parseFloat(e.target.value) || 0)} 
                className="w-full bg-surface-recessed border border-surface-bright-edge/20 rounded-xl px-4 py-3 font-utility text-xl text-[#e3e2e6] outline-none focus:border-accent-navy transition-colors shadow-inner" 
              />
              <span className="text-[10px] text-on-surface-variant/70 font-utility">Para ajustes contables, usa el módulo de Inventario.</span>
            </div>

            <div className="grid grid-cols-2 gap-6 col-span-2">
              <div className="flex flex-col gap-2">
                <label className="font-utility text-xs uppercase tracking-widest text-warning">Alerta de Stock Mínimo</label>
                <input 
                  type="number" 
                  value={product.minStock || 0} 
                  onChange={(e) => updateActiveProductField('minStock', parseFloat(e.target.value) || 0)} 
                  className="w-full bg-warning/5 border border-warning/20 focus:border-warning rounded-xl px-4 py-3 font-utility text-xl text-warning outline-none transition-colors shadow-inner" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-utility text-xs uppercase tracking-widest text-on-surface-variant">Stock Máximo (Capacidad)</label>
                <input 
                  type="number" 
                  value={product.maxStock || ''} 
                  onChange={(e) => updateActiveProductField('maxStock', parseFloat(e.target.value) || 0)} 
                  className="w-full bg-surface-recessed border border-surface-bright-edge/20 rounded-xl px-4 py-3 font-utility text-xl text-[#e3e2e6] outline-none focus:border-accent-navy transition-colors shadow-inner" 
                />
              </div>
            </div>
          </div>
        )}

        {/* === PESTAÑA: IA SEMÁNTICA === */}
        {activeTab === 'ai' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="p-4 bg-accent-plum/10 border border-accent-plum/30 rounded-xl flex items-start gap-4">
              <Zap className="text-accent-plum shrink-0 mt-0.5" size={20} />
              <p className="font-utility text-sm text-on-surface">
                Estos datos alimentan el motor de búsqueda vectorial y el punto de venta por voz. 
                Sé descriptivo para mejorar la precisión de los cajeros al hablar.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-utility text-xs uppercase tracking-widest text-accent-plum">Alias de Voz (Separados por coma)</label>
                <input 
                  type="text" 
                  value={product.aiAliases?.join(', ') || ''} 
                  onChange={(e) => handleArrayChange('aiAliases', e.target.value)}
                  placeholder='Ej: "coca de seiscientos", "coca regular"'
                  className="w-full bg-surface-recessed border border-surface-bright-edge/20 rounded-xl px-4 py-3 font-utility text-sm text-[#e3e2e6] outline-none focus:border-accent-plum transition-colors shadow-inner" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-utility text-xs uppercase tracking-widest text-on-surface-variant">Sinónimos de Búsqueda (Separados por coma)</label>
                <input 
                  type="text" 
                  value={product.synonyms?.join(', ') || ''} 
                  onChange={(e) => handleArrayChange('synonyms', e.target.value)}
                  placeholder='Ej: "refresco", "soda", "gaseosa"'
                  className="w-full bg-surface-recessed border border-surface-bright-edge/20 rounded-xl px-4 py-3 font-utility text-sm text-[#e3e2e6] outline-none focus:border-accent-navy transition-colors shadow-inner" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-utility text-xs uppercase tracking-widest text-on-surface-variant">Descripción Natural (Para la IA)</label>
              <textarea 
                value={product.naturalDescription || ''} 
                onChange={(e) => updateActiveProductField('naturalDescription', e.target.value)}
                placeholder="Describe el producto como si se lo estuvieras explicando a un cliente..."
                rows={3}
                className="w-full bg-surface-recessed border border-surface-bright-edge/20 rounded-xl px-4 py-3 font-utility text-sm text-[#e3e2e6] outline-none focus:border-accent-navy transition-colors shadow-inner resize-none" 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-utility text-xs uppercase tracking-widest text-on-surface-variant">Descripción Técnica (Física/Química)</label>
              <textarea 
                value={product.technicalDescription || ''} 
                onChange={(e) => updateActiveProductField('technicalDescription', e.target.value)}
                placeholder="Detalles de manufactura, ingredientes clave o dimensiones..."
                rows={2}
                className="w-full bg-surface-recessed border border-surface-bright-edge/20 rounded-xl px-4 py-3 font-utility text-sm text-[#e3e2e6] outline-none focus:border-accent-navy transition-colors shadow-inner resize-none" 
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};