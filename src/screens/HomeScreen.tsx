import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { formatCurrencyParts } from '@/utils/formatters';
import { PointOfSaleIcon, Inventory2Icon, AnalyticsIcon, SettingsIcon } from '@/components/ui/SolidIcons';

// Usamos el Layout y Componentes correctos
import { CardPanelLayout } from '@/components/layout/CardPanelLayout';
import { PanelCard, BottomLeftMetric } from '@/components/ui/PanelCard';

interface HomeScreenProps {
  userRole?: 'Dueño' | 'Cajero'; 
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ userRole = 'Dueño' }) => {
  const navigate = useNavigate();
  const { homeMetrics, connectionState, orbState } = useAppStore();
  const revenue = formatCurrencyParts(homeMetrics.salesTotal);

  // Monitor de la Verdad mockeado
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
    <CardPanelLayout
      headerProps={{ 
        moduleName: "Tablero Principal", 
        cashierName: "Ernesto Macias", 
        role: userRole, 
        shift: "Turno Matutino", 
        connectionStatus: connectionState 
      }}
      voiceProps={getMockVoiceProps()}
      stepContextMessage="DI EL NOMBRE DE UNA OPERACIÓN O SELECCIÓNALA PARA COMENZAR"
      title="Bienvenido."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARD 1: VENTA */}
        <PanelCard
          title="Punto de Venta"
          description="Inicia una nueva transacción, cobra productos y atiende a tus clientes."
          backgroundIcon={<PointOfSaleIcon className="w-[140px] h-[140px] text-[#4D7A63] opacity-80 group-hover:opacity-100 transition-opacity" />}
          accentShadow="sage"
          onClick={() => navigate('/venta')}
          bottomLeft={
            <BottomLeftMetric label="Tendencia">
              <span className={`font-utility text-sm font-medium flex items-center gap-1.5 ${homeMetrics.trend >= 0 ? 'text-[#4D7A63]' : 'text-error'}`}>
                {homeMetrics.trend >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                {homeMetrics.trend > 0 ? '+' : ''}{homeMetrics.trend}% /hora
              </span>
            </BottomLeftMetric>
          }
          bottomRight={
            <>
              <span className="font-utility text-[11px] tracking-widest uppercase text-[#9ca3af] mb-0.5">Volumen Diario</span>
              <div className="flex items-baseline">
                <span className="font-narrative text-6xl text-[#e3e2e6] leading-none translate-y-1.5">{homeMetrics.salesToday}</span>
                <span className="font-utility text-xl text-[#9ca3af] ml-2 translate-y-1.5">ventas</span>
              </div>
            </>
          }
        />

        {/* CARD 2: INVENTARIO */}
        <PanelCard
          title="Inventario"
          description="Recibe mercancía, haz transferencias y audita tus existencias."
          backgroundIcon={<Inventory2Icon className="w-[140px] h-[140px] text-[#3F5A7A] opacity-80 group-hover:opacity-100 transition-opacity" />}
          accentShadow="navy"
          onClick={() => navigate('/inventario')}
          bottomLeft={
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
          }
          bottomRight={
            <>
              <span className="font-utility text-[11px] tracking-widest uppercase text-[#9ca3af] mb-0.5">Por Revisar</span>
              <div className="flex items-baseline">
                <span className="font-narrative text-6xl text-[#e3e2e6] leading-none translate-y-1.5">{homeMetrics.pendingItems}</span>
                <span className="font-utility text-xl text-[#9ca3af] ml-2 translate-y-1.5">ítems</span>
              </div>
            </>
          }
        />

        {/* MÓDULOS DUEÑO/ADMIN */}
        {userRole === 'Dueño' && (
          <>
            {/* CARD 3: CONSULTAS */}
            <PanelCard
              title="Reportes y Consultas"
              description="Analiza a fondo las métricas, cortes de caja y rendimiento general."
              backgroundIcon={<AnalyticsIcon className="w-[140px] h-[140px] text-[#5C4275] opacity-80 group-hover:opacity-100 transition-opacity" />}
              accentShadow="plum"
              onClick={() => navigate('/consultas')}
              bottomLeft={
                <BottomLeftMetric label="Categoría Estrella">
                  <span className="font-narrative text-3xl text-[#e3e2e6] leading-none translate-y-1 transition-all">{homeMetrics.topCategory}</span>
                </BottomLeftMetric>
              }
              bottomRight={
                <>
                  <span className="font-utility text-[11px] tracking-widest uppercase text-[#9ca3af] mb-0.5">Ingresos Netos</span>
                  <div className="flex items-baseline">
                    <span className="font-narrative text-6xl text-[#e3e2e6] leading-none translate-y-1.5 transition-all">
                      {revenue.whole}
                    </span>
                    <span className="font-narrative text-3xl text-[#9ca3af] ml-0.5 leading-none translate-y-1.5">
                      {revenue.fraction}
                    </span>
                  </div>
                </>
              }
            />

            {/* CARD 4: GESTIÓN */}
            <PanelCard
              title="Ajustes del Sistema"
              description="Administra catálogos, personal, cajas y configuraciones de la tienda."
              backgroundIcon={<SettingsIcon className="w-[140px] h-[140px] text-[#e3e2e6] opacity-80 group-hover:opacity-100 transition-opacity" />}
              accentShadow="neutral"
              onClick={() => navigate('/gestion')}
              bottomLeft={
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
              }
              bottomRight={
                <>
                  <span className="font-utility text-[11px] tracking-widest uppercase text-[#9ca3af] mb-0.5">Alertas Críticas</span>
                  <div className="flex items-baseline">
                    <span className="font-narrative text-6xl text-[#e3e2e6] leading-none translate-y-1.5 transition-all">0</span>
                  </div>
                </>
              }
            />
          </>
        )}
      </div>
    </CardPanelLayout>
  );
};