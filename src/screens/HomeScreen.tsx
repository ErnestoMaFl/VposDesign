import React from 'react';
import { ShoppingCart, Package, BarChart3, Settings, AlertCircle, ArrowRight } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { ProcessStepBar } from '@/components/ui/ProcessStepBar';

interface HomeScreenProps {
  onNavigate: (module: 'venta' | 'inventario' | 'consultas' | 'gestion') => void;
  // Mocks de métricas que vendrían del estado global/backend
  metrics?: {
    salesToday: number;
    salesTotal: number;
    lowStockCount: number;
    pendingOrders: number;
  };
  // Para saber si mostramos los módulos de dueño
  userRole?: 'Dueño' | 'Cajero'; 
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ 
  onNavigate,
  metrics = { salesToday: 42, salesTotal: 8450.50, lowStockCount: 14, pendingOrders: 2 },
  userRole = 'Dueño'
}) => {
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);

  return (
    <AppShell
      headerProps={{ 
        moduleName: "Tablero Principal",
        cashierName: "Ana López",
        role: userRole,
        shift: "Turno Matutino",
        connectionStatus: 'online'
      }}
      voiceProps={{
        status: 'standby',
        transcriptText: '', // En espera
        interpretations: [],
        availableCommands: ['Nueva venta', 'Inventario', 'Consultas', 'Gestión', 'Cerrar turno']
      }}
    >
      <div className="flex-1 flex flex-col h-full bg-surface-base overflow-hidden">
        
        {/* ZONA B: Banda de Estado (Modo Libre) */}
        <ProcessStepBar 
          contextMessage="SELECCIONA UNA OPERACIÓN PARA COMENZAR" 
        />

        {/* ZONA CENTRAL: Grid de Módulos */}
        <div className="flex-1 overflow-y-auto px-10 py-8 [&::-webkit-scrollbar]:hidden">
          <div className="max-w-5xl mx-auto">
            
            <h2 className="font-narrative text-3xl text-on-surface mb-8 opacity-90 animate-in fade-in slide-in-from-left-4 duration-500">
              Bienvenido a tu turno.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* TARJETA 1: VENTA (Primary Sage) */}
              <button 
                onClick={() => onNavigate('venta')}
                className="group relative flex flex-col items-start p-8 bg-surface-low hover:bg-surface-container transition-all duration-500 rounded-2xl text-left animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 overflow-hidden"
              >
                {/* Glow de fondo (Tonal Layering) */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-sage/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 group-hover:bg-accent-sage/10 transition-colors duration-500" />
                
                <div className="w-14 h-14 rounded-xl bg-surface-base text-accent-sage flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <ShoppingCart size={28} />
                </div>
                
                <h3 className="font-utility text-xl font-medium text-on-surface mb-2">Punto de Venta</h3>
                <p className="font-utility text-sm text-on-surface-variant mb-8 max-w-[80%]">
                  Inicia una nueva transacción, cobra productos y atiende a tus clientes.
                </p>

                <div className="mt-auto w-full pt-6 border-t border-dashed border-surface-bright-edge/30 flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="font-utility text-[10px] text-on-surface-variant tracking-widest uppercase mb-1">
                      Ventas de hoy
                    </span>
                    <span className="font-narrative text-3xl text-accent-sage leading-none">
                      {metrics.salesToday}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-utility text-[10px] text-on-surface-variant tracking-widest uppercase mb-1">
                      Total Acumulado
                    </span>
                    <span className="font-utility text-lg text-on-surface font-medium leading-none">
                      {formatCurrency(metrics.salesTotal)}
                    </span>
                  </div>
                </div>
              </button>

              {/* TARJETA 2: INVENTARIO (Secondary Navy) */}
              <button 
                onClick={() => onNavigate('inventario')}
                className="group relative flex flex-col items-start p-8 bg-surface-low hover:bg-surface-container transition-all duration-500 rounded-2xl text-left animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-navy/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 group-hover:bg-accent-navy/10 transition-colors duration-500" />
                
                <div className="flex justify-between w-full mb-6">
                  <div className="w-14 h-14 rounded-xl bg-surface-base text-accent-navy flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <Package size={28} />
                  </div>
                  {metrics.lowStockCount > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#9B4444]/10 rounded-full border border-[#9B4444]/20">
                      <AlertCircle size={14} className="text-[#9B4444]" />
                      <span className="font-utility text-xs font-medium text-[#9B4444]">
                        {metrics.lowStockCount} alertas de stock
                      </span>
                    </div>
                  )}
                </div>
                
                <h3 className="font-utility text-xl font-medium text-on-surface mb-2">Escaneo Rápido</h3>
                <p className="font-utility text-sm text-on-surface-variant mb-8 max-w-[80%]">
                  Audita pasillos completos dictando existencias a alta velocidad.
                </p>

                <div className="mt-auto w-full flex items-center text-accent-navy group-hover:text-[#e3e2e6] transition-colors duration-300">
                  <span className="font-utility text-xs tracking-widest uppercase font-medium">Entrar al almacén</span>
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </button>

              {/* TARJETAS DE DUEÑO/ADMIN (Solo se muestran si el rol es adecuado) */}
              {userRole === 'Dueño' && (
                <>
                  {/* TARJETA 3: CONSULTAS (Tertiary Plum) */}
                  <button 
                    onClick={() => onNavigate('consultas')}
                    className="group relative flex flex-col items-start p-8 bg-surface-low hover:bg-surface-container transition-all duration-500 rounded-2xl text-left animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-plum/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 group-hover:bg-accent-plum/10 transition-colors duration-500" />
                    
                    <div className="w-14 h-14 rounded-xl bg-surface-base text-accent-plum flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                      <BarChart3 size={28} />
                    </div>
                    
                    <h3 className="font-utility text-xl font-medium text-on-surface mb-2">Consultas de Negocio</h3>
                    <p className="font-utility text-sm text-on-surface-variant mb-8 max-w-[80%]">
                      Pregúntale al sistema sobre márgenes, ventas pasadas y proyecciones.
                    </p>

                    <div className="mt-auto w-full flex items-center text-accent-plum group-hover:text-[#e3e2e6] transition-colors duration-300">
                      <span className="font-utility text-xs tracking-widest uppercase font-medium">Abrir analíticas</span>
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </button>

                  {/* TARJETA 4: GESTIÓN (Neutral Base) */}
                  <button 
                    onClick={() => onNavigate('gestion')}
                    className="group relative flex flex-col items-start p-8 bg-surface-low hover:bg-surface-container transition-all duration-500 rounded-2xl text-left animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 overflow-hidden"
                  >
                    <div className="flex justify-between w-full mb-6">
                      <div className="w-14 h-14 rounded-xl bg-surface-base text-on-surface flex items-center justify-center shadow-inner group-hover:rotate-90 transition-transform duration-700">
                        <Settings size={28} />
                      </div>
                      {metrics.pendingOrders > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#B47022]/10 rounded-full border border-[#B47022]/20">
                          <span className="w-2 h-2 rounded-full bg-[#B47022] animate-pulse" />
                          <span className="font-utility text-xs font-medium text-[#B47022]">
                            {metrics.pendingOrders} OCs pendientes
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-utility text-xl font-medium text-on-surface mb-2">Gestión y Catálogo</h3>
                    <p className="font-utility text-sm text-on-surface-variant mb-8 max-w-[80%]">
                      Administra productos, proveedores, usuarios y configuración global.
                    </p>

                    <div className="mt-auto w-full flex items-center text-on-surface-variant group-hover:text-on-surface transition-colors duration-300">
                      <span className="font-utility text-xs tracking-widest uppercase font-medium">Ir a configuración</span>
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </button>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};