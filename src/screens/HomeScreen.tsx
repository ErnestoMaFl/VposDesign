import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { AppShell } from '@/components/layout/AppShell';
import { ProcessStepBar } from '@/components/ui/ProcessStepBar';
import { SystemSidebar } from '@/components/layout/SystemSidebar';

interface HomeScreenProps {
  onNavigate: (module: 'venta' | 'inventario' | 'consultas' | 'gestion') => void;
  userRole?: 'Dueño' | 'Cajero'; 
}

const formatCurrencyParts = (amount: number) => {
  const parts = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).formatToParts(amount);
  const whole = parts.filter(p => p.type !== 'fraction' && p.type !== 'decimal').map(p => p.value).join('');
  const fraction = parts.filter(p => p.type === 'decimal' || p.type === 'fraction').map(p => p.value).join('');
  return { whole, fraction };
};

const BottomLeftMetric = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="flex flex-col justify-end pb-1 shrink-0">
    <span className="font-utility text-[11px] tracking-widest uppercase text-[#9ca3af] mb-1.5">
      {label}
    </span>
    <div className="flex items-center min-h-[28px]">
      {children}
    </div>
  </div>
);

export const HomeScreen: React.FC<HomeScreenProps> = ({ 
  onNavigate,
  userRole = 'Dueño'
}) => {
  // === SOLO IMPORTAMOS LO QUE EL HOME NECESITA ===
  const { homeMetrics, connectionState, setConnectionState } = useAppStore();
  const revenue = formatCurrencyParts(homeMetrics.salesTotal);

  return (
    <div className="flex w-full h-screen bg-surface-base overflow-hidden">
      
      {/* Sidebar limpio, sin la basura del POS */}
      <SystemSidebar 
        variant="home" 
        connectionState={connectionState} 
        setConnectionState={setConnectionState}
        onGoToLogin={() => console.log('Mock Login')} 
      />

      <div className="flex-1 overflow-hidden">
        <AppShell
          headerProps={{ 
            moduleName: "Tablero Principal",
            cashierName: "Ana López",
            role: userRole,
            shift: "Turno Matutino",
            connectionStatus: connectionState
          }}
          voiceProps={{
            status: 'standby', // En el Home la voz no está escuchando
            transcriptText: '',
            interpretations: [],
            availableCommands: ['Nueva venta', 'Inventario', 'Consultas', 'Gestión', 'Cerrar turno']
          }}
        >
          <div className="flex-1 flex flex-col h-full bg-surface-base overflow-hidden">
            
            <ProcessStepBar 
              contextMessage="SELECCIONA UNA OPERACIÓN PARA COMENZAR" 
            />

            <div className="flex-1 overflow-y-auto px-10 py-8 [&::-webkit-scrollbar]:hidden">
              <div className="max-w-5xl mx-auto">
                
                <h3 className="font-narrative text-3xl text-[#e3e2e6] tracking-tight mb-8 shrink-0">
                  Bienvenido.
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* --- CARD 1: PUNTO DE VENTA --- */}
                  <button 
                    onClick={() => onNavigate('venta')}
                    className="group relative flex flex-col p-8 bg-surface-low hover:bg-surface-container border border-transparent hover:border-surface-bright-edge/30 hover:shadow-[0_15px_40px_-15px_rgba(77,122,99,0.25)] transition-all duration-500 cursor-pointer overflow-hidden text-left rounded-2xl w-full min-h-[280px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div className="absolute top-2 right-2">
                      <span className="material-symbols-outlined fill-icon !text-[140px] text-[#4D7A63] opacity-80 group-hover:opacity-100 transition-opacity">point_of_sale</span>
                    </div>
                    
                    <div className="flex flex-col relative z-10 w-full h-full">
                      <div>
                        <h4 className="font-utility font-medium text-xl text-[#e3e2e6]">
                          Punto de Venta
                        </h4>
                        <p className="font-utility text-[15px] text-[#9ca3af] mt-1 max-w-[65%] line-clamp-2">Inicia una nueva transacción, cobra productos y atiende a tus clientes.</p>
                      </div>

                      <div className="mt-auto flex justify-between items-end w-full">
                        <BottomLeftMetric label="Tendencia">
                          <span className={`font-utility text-sm font-medium flex items-center gap-1 ${homeMetrics.trend >= 0 ? 'text-[#4D7A63]' : 'text-[#9B4444]'}`}>
                            <span className="material-symbols-outlined !text-[18px]">
                              {homeMetrics.trend >= 0 ? 'trending_up' : 'trending_down'}
                            </span> 
                            {homeMetrics.trend > 0 ? '+' : ''}{homeMetrics.trend}% /hora
                          </span>
                        </BottomLeftMetric>

                        <div className="flex flex-col items-end">
                          <span className="font-utility text-[11px] tracking-widest uppercase text-[#9ca3af] mb-0.5">
                            Volumen Diario
                          </span>
                          <div className="flex items-baseline">
                            <span className="font-narrative text-6xl text-[#e3e2e6] leading-none translate-y-1.5 transition-all">
                              {homeMetrics.salesToday}
                            </span>
                            <span className="font-utility text-xl text-[#9ca3af] ml-2 translate-y-1.5">ventas</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* --- CARD 2: INVENTARIO --- */}
                  <button 
                    onClick={() => onNavigate('inventario')}
                    className="group relative flex flex-col p-8 bg-surface-low hover:bg-surface-container border border-transparent hover:border-surface-bright-edge/30 hover:shadow-[0_15px_40px_-15px_rgba(63,90,122,0.25)] transition-all duration-500 cursor-pointer overflow-hidden text-left rounded-2xl w-full min-h-[280px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div className="absolute top-2 right-2">
                      <span className="material-symbols-outlined fill-icon !text-[140px] text-[#3F5A7A] opacity-80 group-hover:opacity-100 transition-opacity">inventory_2</span>
                    </div>
                    
                    <div className="flex flex-col relative z-10 w-full h-full">
                      <div>
                        <h4 className="font-utility font-medium text-xl text-[#e3e2e6]">
                          Inventario
                        </h4>
                        <p className="font-utility text-[15px] text-[#9ca3af] mt-1 max-w-[65%] line-clamp-2">Recibe mercancía, haz transferencias y audita tus existencias.</p>
                      </div>

                      <div className="mt-auto flex justify-between items-end w-full">
                        <BottomLeftMetric label="Alertas">
                          {homeMetrics.lowStockCount > 0 ? (
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-sm font-utility font-medium shadow-sm transition-colors ${homeMetrics.lowStockCount > 10 ? 'bg-[#9B4444] text-[#e3e2e6] animate-pulse' : 'bg-[#B47022]/20 text-[#B47022] border border-[#B47022]/30'}`}>
                              <span className="material-symbols-outlined fill-icon !text-[16px]">warning</span> {homeMetrics.lowStockCount} Stock Bajo
                            </span>
                          ) : (
                            <span className="font-utility text-sm text-[#9ca3af]">Sin alertas</span>
                          )}
                        </BottomLeftMetric>

                        <div className="flex flex-col items-end">
                          <span className="font-utility text-[11px] tracking-widest uppercase text-[#9ca3af] mb-0.5">
                            Por Revisar
                          </span>
                          <div className="flex items-baseline">
                            <span className="font-narrative text-6xl text-[#e3e2e6] leading-none translate-y-1.5 transition-all">
                              {homeMetrics.pendingItems}
                            </span>
                            <span className="font-utility text-xl text-[#9ca3af] ml-2 translate-y-1.5">ítems</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* --- MÓDULOS DUEÑO/ADMIN --- */}
                  {userRole === 'Dueño' && (
                    <>
                      {/* --- CARD 3: CONSULTAS --- */}
                      <button 
                        onClick={() => onNavigate('consultas')}
                        className="group relative flex flex-col p-8 bg-surface-low hover:bg-surface-container border border-transparent hover:border-surface-bright-edge/30 hover:shadow-[0_15px_40px_-15px_rgba(92,66,117,0.25)] transition-all duration-500 cursor-pointer overflow-hidden text-left rounded-2xl w-full min-h-[280px]"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
                        <div className="absolute right-0 bottom-0 w-full h-[60%] overflow-hidden pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                          <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                            <path d="M0,60 L0,40 C50,40 70,15 110,25 C150,35 170,55 200,20 L200,60 Z" fill="#5C4275" />
                          </svg>
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className="material-symbols-outlined fill-icon !text-[140px] text-[#5C4275] opacity-80 group-hover:opacity-100 transition-opacity">analytics</span>
                        </div>
                        
                        <div className="flex flex-col relative z-20 w-full h-full">
                          <div>
                            <h4 className="font-utility font-medium text-xl text-[#e3e2e6]">
                              Reportes y Consultas
                            </h4>
                            <p className="font-utility text-[15px] text-[#9ca3af] mt-1 max-w-[65%] line-clamp-2">Analiza a fondo las métricas, cortes de caja y rendimiento general.</p>
                          </div>

                          <div className="mt-auto flex justify-between items-end w-full">
                            <BottomLeftMetric label="Categoría Estrella">
                              <span className="font-narrative text-3xl text-[#e3e2e6] leading-none translate-y-1 transition-all">{homeMetrics.topCategory}</span>
                            </BottomLeftMetric>

                            <div className="flex flex-col items-end">
                              <span className="font-utility text-[11px] tracking-widest uppercase text-[#9ca3af] mb-0.5">
                                Ingresos Netos
                              </span>
                              <div className="flex items-baseline">
                                <span className="font-narrative text-6xl text-[#e3e2e6] leading-none translate-y-1.5 transition-all">
                                  {revenue.whole}
                                </span>
                                <span className="font-narrative text-3xl text-[#9ca3af] ml-0.5 leading-none translate-y-1.5">
                                  {revenue.fraction}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* --- CARD 4: GESTIÓN --- */}
                      <button 
                        onClick={() => onNavigate('gestion')}
                        className="group relative flex flex-col p-8 bg-surface-low hover:bg-surface-container border border-transparent hover:border-surface-bright-edge/30 hover:shadow-[0_15px_40px_-15px_rgba(227,226,230,0.1)] transition-all duration-500 cursor-pointer overflow-hidden text-left rounded-2xl w-full min-h-[280px]"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <div className="absolute top-2 right-2 group-hover:rotate-45 transition-transform duration-700">
                          <span className="material-symbols-outlined fill-icon !text-[140px] text-[#e3e2e6] opacity-80 group-hover:opacity-100 transition-opacity">settings</span>
                        </div>
                        
                        <div className="flex flex-col relative z-10 w-full h-full">
                          <div>
                            <h4 className="font-utility font-medium text-xl text-[#e3e2e6]">
                              Ajustes del Sistema
                            </h4>
                            <p className="font-utility text-[15px] text-[#9ca3af] mt-1 max-w-[65%] line-clamp-2">Administra catálogos, personal, cajas y configuraciones de la tienda.</p>
                          </div>

                          <div className="mt-auto flex justify-between items-end w-full">
                            <BottomLeftMetric label="Pedidos">
                              {homeMetrics.pendingOrders > 0 ? (
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-sm font-utility font-medium shadow-sm transition-colors ${homeMetrics.pendingOrders > 5 ? 'bg-[#9B4444] text-[#e3e2e6] animate-pulse' : 'border border-[#B47022]/30 text-[#B47022] bg-[#B47022]/10'}`}>
                                  <span className={`w-2 h-2 rounded-full ${homeMetrics.pendingOrders > 5 ? 'bg-[#e3e2e6]' : 'bg-[#B47022]'} animate-pulse`}></span>
                                  {homeMetrics.pendingOrders} pedidos pendientes
                                </span>
                              ) : (
                                <span className="font-utility text-sm text-[#9ca3af]">Todo al día</span>
                              )}
                            </BottomLeftMetric>
                          </div>
                        </div>
                      </button>
                    </>
                  )}

                </div>
              </div>
            </div>
          </div>
        </AppShell>
      </div>
    </div>
  );
};