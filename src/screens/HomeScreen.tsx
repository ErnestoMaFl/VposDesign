import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { AppShell } from '@/components/layout/AppShell';
import { ProcessStepBar } from '@/components/ui/ProcessStepBar';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { formatCurrencyParts } from '@/utils/formatters';

import { PointOfSaleIcon, Inventory2Icon, AnalyticsIcon, SettingsIcon } from '@/components/ui/SolidIcons';

interface HomeScreenProps {
  userRole?: 'Dueño' | 'Cajero'; 
}

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
  userRole = 'Dueño'
}) => {
  // Inicializamos el hook de React Router
  const navigate = useNavigate();
  
  const { 
    homeMetrics, 
    connectionState, 
    orbState 
  } = useAppStore();
  
  const revenue = formatCurrencyParts(homeMetrics.salesTotal);

  // Monitor de la Verdad (Mock dinámico reaccionando al Sidebar)
  const getMockVoiceProps = () => {
    switch(orbState) {
      case 'listening':
        return {
          status: 'listening' as const,
          transcriptText: "abrir inven...",
          isPartialTranscript: true,
          interpretations: [{ id: '1', text: 'Escuchando tu comando...', status: 'pending' as const }],
          availableCommands: ['Termina de hablar', 'Cancela']
        };
      case 'processing':
        return {
          status: 'processing' as const,
          transcriptText: "abrir inventario",
          isPartialTranscript: false,
          detectedIntention: "NAVEGACIÓN",
          interpretations: [
            { id: '1', text: 'Intención: Cambiar de módulo', status: 'success' as const, semanticType: 'search' as const },
            { id: '2', text: 'Destino: Inventario', status: 'success' as const }
          ],
          availableCommands: ['Procesando...']
        };
      case 'success':
        return {
          status: 'success' as const,
          transcriptText: "abrir inventario",
          isPartialTranscript: false,
          detectedIntention: "NAVEGACIÓN EJECUTADA",
          interpretations: [{ id: '1', text: '✓ Navegando al módulo de Inventario', status: 'success' as const }],
          availableCommands: ['Nueva venta', 'Consultas', 'Cerrar turno']
        };
      case 'error':
        return {
          status: 'error' as const,
          transcriptText: "abrir refaccionaria",
          isPartialTranscript: false,
          detectedIntention: "NAVEGACIÓN FALLIDA",
          interpretations: [{ id: '1', text: '✗ El módulo "refaccionaria" no existe', status: 'error' as const }],
          availableCommands: ['Ir a inventario', 'Nueva venta', 'Ajustes']
        };
      default:
        return {
          status: 'standby' as const,
          transcriptText: "",
          isPartialTranscript: false,
          interpretations: [],
          availableCommands: ['Nueva venta', 'Ir a inventario', 'Consultas', 'Ajustes']
        };
    }
  };

  return (
    <AppShell
      headerProps={{ 
        moduleName: "Tablero Principal",
        cashierName: "Ana López",
        role: userRole,
        shift: "Turno Matutino",
        connectionStatus: connectionState
      }}
      voiceProps={getMockVoiceProps()}
    >
      <div className="flex-1 flex flex-col h-full bg-surface-base overflow-hidden">
        
        <ProcessStepBar 
          contextMessage="DI EL NOMBRE DE UNA OPERACIÓN O SELECCIÓNALA PARA COMENZAR" 
        />

        <div className="flex-1 overflow-y-auto px-10 py-8 [&::-webkit-scrollbar]:hidden">
          <div className="max-w-5xl mx-auto">
            
            <div className="flex justify-between items-end mb-8 shrink-0">
              <h3 className="font-narrative text-3xl text-[#e3e2e6] tracking-tight">
                Bienvenido.
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* --- CARD 1: PUNTO DE VENTA --- */}
              <button 
                onClick={() => navigate('/venta')}
                className="group relative flex flex-col p-8 bg-surface-low hover:bg-surface-container border border-transparent hover:border-surface-bright-edge/30 hover:shadow-card-sage transition-all duration-500 cursor-pointer overflow-hidden text-left rounded-2xl w-full min-h-[280px]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="absolute top-2 right-2">
                  <PointOfSaleIcon className="w-[140px] h-[140px] text-[#4D7A63] opacity-80 group-hover:opacity-100 transition-opacity" />
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
                      <span className={`font-utility text-sm font-medium flex items-center gap-1.5 ${homeMetrics.trend >= 0 ? 'text-[#4D7A63]' : 'text-error'}`}>
                        {homeMetrics.trend >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
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
                onClick={() => navigate('/inventario')}
                className="group relative flex flex-col p-8 bg-surface-low hover:bg-surface-container border border-transparent hover:border-surface-bright-edge/30 hover:shadow-card-navy transition-all duration-500 cursor-pointer overflow-hidden text-left rounded-2xl w-full min-h-[280px]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="absolute top-2 right-2">
                  <Inventory2Icon className="w-[140px] h-[140px] text-[#3F5A7A] opacity-80 group-hover:opacity-100 transition-opacity" />
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
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-sm font-utility font-medium shadow-sm transition-colors ${homeMetrics.lowStockCount > 10 ? 'bg-error text-[#e3e2e6] animate-pulse' : 'bg-warning/20 text-warning border border-warning/30'}`}>
                          <AlertTriangle size={14} className={homeMetrics.lowStockCount > 10 ? "text-[#e3e2e6]" : "text-warning"} />
                          {homeMetrics.lowStockCount} Stock Bajo
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
                    onClick={() => navigate('/consultas')}
                    className="group relative flex flex-col p-8 bg-surface-low hover:bg-surface-container border border-transparent hover:border-surface-bright-edge/30 hover:shadow-card-plum transition-all duration-500 cursor-pointer overflow-hidden text-left rounded-2xl w-full min-h-[280px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
                    <div className="absolute right-0 bottom-0 w-full h-[60%] overflow-hidden pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                      <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                        <path d="M0,60 L0,40 C50,40 70,15 110,25 C150,35 170,55 200,20 L200,60 Z" fill="#5C4275" />
                      </svg>
                    </div>
                    <div className="absolute top-2 right-2">
                      <AnalyticsIcon className="w-[140px] h-[140px] text-[#5C4275] opacity-80 group-hover:opacity-100 transition-opacity" />
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
                    onClick={() => navigate('/gestion')}
                    className="group relative flex flex-col p-8 bg-surface-low hover:bg-surface-container border border-transparent hover:border-surface-bright-edge/30 hover:shadow-card-neutral transition-all duration-500 cursor-pointer overflow-hidden text-left rounded-2xl w-full min-h-[280px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div className="absolute top-2 right-2 group-hover:rotate-45 transition-transform duration-700">
                      <SettingsIcon className="w-[140px] h-[140px] text-[#e3e2e6] opacity-80 group-hover:opacity-100 transition-opacity" />
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
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-sm font-utility font-medium shadow-sm transition-colors ${homeMetrics.pendingOrders > 5 ? 'bg-error text-[#e3e2e6] animate-pulse' : 'border border-warning/30 text-warning bg-warning/10'}`}>
                              <span className={`w-2 h-2 rounded-full ${homeMetrics.pendingOrders > 5 ? 'bg-[#e3e2e6]' : 'bg-warning'} animate-pulse`}></span>
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
  );
};