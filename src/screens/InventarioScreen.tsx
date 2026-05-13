import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Activity, AlertTriangle, CheckSquare } from 'lucide-react';
import { QuickScanIcon, ReceivePackageIcon, ManualAdjustIcon, ShrinkageIcon } from '@/components/ui/SolidIcons';

import { CardPanelLayout } from '@/components/layout/CardPanelLayout';
import { PanelCard, BottomLeftMetric } from '@/components/ui/PanelCard';
import { ScanLogFeed } from '@/features/inventory/ScanLogFeed';
import { DisambiguationPanel } from '@/features/voice/DisambiguationPanel';
import { mockAmbiguousOptions } from '@/mocks/dummyData';
import { InventoryDiscrepancyTable } from '@/features/inventory/InventoryDiscrepancyTable';

export const InventarioScreen = () => {
  const { 
    connectionState, 
    inventoryMode,
    startMockScanningLoop,
    scannedLogs,
    stopMockScanningLoop,
    resetInventory,
    // Traemos los estados para la ambigüedad
    showAmbiguity,
    resumeMockScanningLoop,
    setShowAmbiguity,
    setOrbState
  } = useAppStore();

  useEffect(() => {
    return () => resetInventory();
  }, [resetInventory]);

  // Función mock para finalizar el flujo por completo
  const handleApplyAdjustments = () => {
    setOrbState('success');
    setTimeout(() => {
      resetInventory();
    }, 1500);
  };

  return (
    <CardPanelLayout
      headerProps={{ 
        moduleName: "Inventario", 
        connectionStatus: connectionState, 
        cashierName: "Ana López", 
        role: "Dueño", 
        shift: "Turno Matutino"
      }}
      voiceProps={{
        // Actualizamos los props de voz según los 3 pasos (selección -> escaneo -> resumen)
        status: showAmbiguity ? 'ambiguity' : (inventoryMode === 'scanning' ? 'listening' : 'standby'),
        transcriptText: showAmbiguity ? "coca" : (inventoryMode === 'scanning' ? "aceite diez..." : ""),
        isPartialTranscript: inventoryMode === 'scanning' && !showAmbiguity,
        availableCommands: showAmbiguity 
          ? ['Opción 1', 'Opción 2', 'Ninguna'] 
          : (
              inventoryMode === 'scanning' ? ['Terminar conteo', 'Deshacer último'] : 
              inventoryMode === 'summary' ? ['Aplicar ajustes', 'Descartar'] :
              ['Escaneo rápido', 'Ajuste manual']
            ),
      }}
      stepContextMessage={
        inventoryMode === 'selection' ? "SELECCIONA EL TIPO DE OPERACIÓN" : 
        inventoryMode === 'scanning' ? "DICTANDO EN MODO CONTINUO" : 
        "REVISIÓN DE AJUSTES"
      }
      title={
        inventoryMode === 'selection' ? 'Gestión de Inventario.' : 
        inventoryMode === 'scanning' ? 'Escaneo de Pasillo.' :
        'Resumen de Conteo.'
      }

      // Header Action dinámico
      headerAction={
        inventoryMode === 'scanning' ? (
          <button 
            onClick={stopMockScanningLoop}
            className="group flex items-center gap-3 px-5 py-2.5 bg-[#0B0D10] hover:bg-[#ffb4ab]/10 border border-[#3C4150]/40 hover:border-[#ffb4ab]/30 transition-all duration-300 rounded-lg shadow-[inset_0_1px_0_rgba(60,65,80,0.5)]"
          >
            <div className="w-2.5 h-2.5 rounded-[2px] bg-[#ffb4ab] group-hover:shadow-[0_0_10px_rgba(255,180,171,0.6)] transition-shadow" />
            <span className="font-utility text-[12px] font-medium text-[#E3E2E6] group-hover:text-[#ffb4ab] tracking-widest uppercase transition-colors">
              Finalizar Escaneo
            </span>
          </button>
        ) : inventoryMode === 'summary' ? (
          <button 
            onClick={handleApplyAdjustments}
            // Aquí está la magia táctil: 
            // 1. Color base al 80% (bg-[#4D7A63]/80)
            // 2. Hover resplandece al 100% y sube la sombra
            // 3. Active (clic) hunde el botón (scale-[0.98]) y oscurece el fondo (bg-[#3b6751])
            className="group flex items-center gap-3 px-8 py-3 bg-[#4D7A63]/68 hover:bg-[#4D7A63] active:bg-[#3b6751] active:scale-[0.98] transition-all duration-300 rounded-lg shadow-[0_4px_15px_rgba(77,122,99,0.2)] hover:shadow-[0_4px_25px_rgba(77,122,99,0.4)]"
          >
            <CheckSquare size={18} className="text-[#daffe8] group-active:scale-95 transition-transform" />
            <span className="font-utility text-[14px] font-medium text-[#daffe8] tracking-widest uppercase">
              Aplicar Todos los Ajustes
            </span>
          </button>
        ) : undefined
      }
    >
      
      {/* VISTA 1: SELECCIÓN DE MODO */}
      {inventoryMode === 'selection' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pb-4 [&::-webkit-scrollbar]:hidden min-h-0">
          <PanelCard
            title="Escaneo Rápido"
            description="Conteo de pasillo por voz. Actualiza existencias sin tocar la pantalla."
            backgroundIcon={<QuickScanIcon className="w-[140px] h-[140px] text-[#4D7A63] opacity-80 group-hover:opacity-100 transition-opacity" />}
            accentShadow="sage"
            onClick={startMockScanningLoop}
            bottomLeft={
              <BottomLeftMetric label="Precisión">
                <span className="font-utility text-sm font-medium flex items-center gap-1.5 text-[#4D7A63]">
                  <Activity size={18} /> 98.5% 
                </span>
              </BottomLeftMetric>
            }
            bottomRight={
              <>
                <span className="font-utility text-[11px] tracking-widest uppercase text-[#9ca3af] mb-0.5">Último Conteo</span>
                <div className="flex items-baseline">
                  <span className="font-narrative text-6xl text-[#e3e2e6] leading-none translate-y-1.5">2</span>
                  <span className="font-utility text-xl text-[#9ca3af] ml-2 translate-y-1.5">días</span>
                </div>
              </>
            }
          />

          <PanelCard
            title="Recepción de OC"
            description="Ingresa mercancía recibida vinculada a proveedores."
            backgroundIcon={<ReceivePackageIcon className="w-[140px] h-[140px] text-[#3F5A7A] opacity-80 group-hover:opacity-100 transition-opacity" />}
            accentShadow="navy"
            onClick={() => console.log('Recepción OC')}
            bottomLeft={
              <BottomLeftMetric label="Proveedores">
                <span className="font-utility text-sm text-[#9ca3af]">Bimbo, Coca-Cola</span>
              </BottomLeftMetric>
            }
            bottomRight={
              <>
                <span className="font-utility text-[11px] tracking-widest uppercase text-[#9ca3af] mb-0.5">Pendientes</span>
                <div className="flex items-baseline">
                  <span className="font-narrative text-6xl text-[#e3e2e6] leading-none translate-y-1.5">4</span>
                  <span className="font-utility text-xl text-[#9ca3af] ml-2 translate-y-1.5">órdenes</span>
                </div>
              </>
            }
          />

          <PanelCard
            title="Ajuste Manual"
            description="Corrige existencias de productos específicos de forma manual."
            backgroundIcon={<ManualAdjustIcon className="w-[140px] h-[140px] text-[#e3e2e6] opacity-80 group-hover:opacity-100 transition-opacity" />}
            accentShadow="neutral"
            onClick={() => console.log('Ajuste Manual')}
            bottomLeft={
              <BottomLeftMetric label="Alertas">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-sm font-utility font-medium bg-warning/20 text-warning border border-warning/30">
                  <AlertTriangle size={14} className="text-warning" />
                  3 Stock Bajo
                </span>
              </BottomLeftMetric>
            }
            bottomRight={
              <>
                <span className="font-utility text-[11px] tracking-widest uppercase text-[#9ca3af] mb-0.5">Discrepancias</span>
                <div className="flex items-baseline">
                  <span className="font-narrative text-6xl text-[#e3e2e6] leading-none translate-y-1.5">7</span>
                  <span className="font-utility text-xl text-[#9ca3af] ml-2 translate-y-1.5">ítems</span>
                </div>
              </>
            }
          />

          <PanelCard
            title="Registro de Merma"
            description="Da de baja productos dañados o vencidos contablemente."
            backgroundIcon={<ShrinkageIcon className="w-[140px] h-[140px] text-[#5C4275] opacity-80 group-hover:opacity-100 transition-opacity" />}
            accentShadow="plum"
            onClick={() => console.log('Registro de Merma')}
            bottomLeft={
              <BottomLeftMetric label="Impacto Mensual">
                <span className="font-utility text-sm font-medium text-[#e3e2e6]">-$450.00</span>
              </BottomLeftMetric>
            }
            bottomRight={
              <>
                <span className="font-utility text-[11px] tracking-widest uppercase text-[#9ca3af] mb-0.5">Mermas (Mes)</span>
                <div className="flex items-baseline">
                  <span className="font-narrative text-6xl text-[#e3e2e6] leading-none translate-y-1.5">12</span>
                  <span className="font-utility text-xl text-[#9ca3af] ml-2 translate-y-1.5">ítems</span>
                </div>
              </>
            }
          />

        </div>
      )}

      {/* VISTA 2: ESCANEO EN TIEMPO REAL */}
      {inventoryMode === 'scanning' && (
        <ScanLogFeed logs={scannedLogs} />
      )}

      {/* VISTA 3: RESUMEN Y CONFIRMACIÓN */}
      {inventoryMode === 'summary' && (
        <InventoryDiscrepancyTable logs={scannedLogs} />
      )}

      {/* OVERLAY: PANEL DE AMBIGÜEDAD */}
      {showAmbiguity && inventoryMode === 'scanning' && (
        <DisambiguationPanel 
          options={mockAmbiguousOptions}
          onSelect={(id) => {
            const option = mockAmbiguousOptions.find(o => o.id === id);
            resumeMockScanningLoop(option ? option.name : 'Producto Resuelto');
          }}
          onCancel={() => {
            setShowAmbiguity(false);
            setOrbState('listening');
          }}
        />
      )}

    </CardPanelLayout>
  );
};