import React, { useState } from 'react';
import { Wifi, WifiOff, Server, User, ChevronDown, Bell } from 'lucide-react';

export type ConnectionState = 'online' | 'local' | 'offline';

interface HeaderBarProps {
  moduleName?: string;
  breadcrumb?: string;
  cashierName?: string;
  role?: string;
  shift?: string;
  connectionStatus?: ConnectionState;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  moduleName = "Venta Activa",
  breadcrumb = "VPOS",
  cashierName = "Ernesto Macias",
  role = "Cajera",
  shift = "Turno Matutino",
  connectionStatus = 'online'
}) => {
  const [isConnectionExpanded, setIsConnectionExpanded] = useState(false);
  const [isNotifExpanded, setIsNotifExpanded] = useState(false);

  // Configuración de los estados de red
  const statusConfig = {
    online: { icon: Wifi, color: 'text-accent-sage', bg: 'bg-accent-sage', label: 'Online' },
    local: { icon: Server, color: 'text-accent-navy', bg: 'bg-accent-navy', label: 'Modo Local' },
    offline: { icon: WifiOff, color: 'text-[#9B4444]', bg: 'bg-[#9B4444]', label: 'Offline' }
  };

  const CurrentIcon = statusConfig[connectionStatus].icon;

  const toggleConnection = () => {
    setIsConnectionExpanded(!isConnectionExpanded);
    if (isNotifExpanded) setIsNotifExpanded(false);
  };

  const toggleNotif = () => {
    setIsNotifExpanded(!isNotifExpanded);
    if (isConnectionExpanded) setIsConnectionExpanded(false);
  };

  return (
    <div className="w-full h-16 px-8 flex items-center justify-between shrink-0 bg-surface-base z-20">
      
      {/* Lado Izquierdo: Miga de pan y Módulo */}
      <div className="flex items-baseline gap-3">
        <span className="font-utility text-xs font-medium text-on-surface-variant uppercase tracking-widest">
          {breadcrumb}
        </span>
        <span className="text-on-surface-variant text-xs">/</span>
        <span className="font-utility text-sm font-medium text-on-surface">
          {moduleName}
        </span>
      </div>

      {/* Lado Derecho: Conexión -> Notificaciones -> Usuario */}
      <div className="flex items-center gap-6">
        
        {/* Indicador de Conexión */}
        <div className="relative">
          <button 
            onClick={toggleConnection}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-surface-low transition-colors"
          >
            <div className={`w-2 h-2 rounded-full ${statusConfig[connectionStatus].bg} ${connectionStatus === 'online' ? 'animate-pulse' : ''}`} />
            <CurrentIcon size={14} className={statusConfig[connectionStatus].color} />
            <span className="font-utility text-xs text-on-surface-variant">
              {statusConfig[connectionStatus].label}
            </span>
            <ChevronDown size={14} className="text-on-surface-variant" />
          </button>

          {/* Popover Expandible de Conexión */}
          {isConnectionExpanded && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-surface-highest/90 backdrop-blur-md p-4 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex flex-col gap-3 z-50">
              <span className="font-utility text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">
                Estado de Servicios
              </span>
              <div className="flex justify-between items-center">
                <span className="font-utility text-xs text-on-surface">Base de datos</span>
                <span className={`font-utility text-xs font-medium ${connectionStatus !== 'offline' ? 'text-accent-sage' : 'text-[#9B4444]'}`}>
                  {connectionStatus !== 'offline' ? 'Conectado' : 'Fallo'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-utility text-xs text-on-surface">Motor de Voz</span>
                <span className={`font-utility text-xs font-medium ${connectionStatus === 'online' ? 'text-accent-sage' : 'text-accent-navy'}`}>
                  {connectionStatus === 'online' ? 'Cloud (Groq)' : 'Local'}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="w-1 h-1 rounded-full bg-surface-bright-edge" />

        {/* Campana de Notificaciones */}
        <div className="relative flex items-center justify-center">
          <button 
            onClick={toggleNotif}
            className="relative p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-low rounded-full transition-colors"
          >
            <Bell size={18} />
            <span className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 min-w-[16px] h-[16px] px-1 bg-accent-plum rounded-full flex items-center justify-center font-utility text-[9px] font-medium text-[#e3e2e6] shadow-[0_0_10px_rgba(92,66,117,0.5)]">
              2
            </span>
          </button>

          {/* Popover Expandible de Notificaciones */}
          {isNotifExpanded && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-surface-highest/90 backdrop-blur-md p-4 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex flex-col gap-4 z-50">
              <div className="flex justify-between items-center border-b border-surface-bright-edge/30 pb-2">
                <span className="font-utility text-[10px] text-on-surface-variant uppercase tracking-widest">
                  Notificaciones
                </span>
                <button className="font-utility text-[10px] text-accent-sage hover:text-[#e3e2e6] transition-colors">
                  Marcar leídas
                </button>
              </div>
              
              {/* Lista de alertas falsas */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="font-utility text-xs font-medium text-on-surface">Stock Bajo detectado</span>
                  <span className="font-utility text-xs text-on-surface-variant">Coca-Cola Original 2L llegó a 8 unidades.</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-utility text-xs font-medium text-accent-plum">Corte de caja pendiente</span>
                  <span className="font-utility text-xs text-on-surface-variant">El turno matutino debió cerrar hace 15 mins.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-1 h-1 rounded-full bg-surface-bright-edge" />

        {/* Usuario (Cajero y Turno)*/}
        <div className="flex items-center gap-3 text-right">
          <div className="flex flex-col">
            <span className="font-utility text-sm font-medium text-on-surface leading-tight">
              {cashierName}
            </span>
            <span className="font-utility text-[10px] text-on-surface-variant uppercase tracking-widest leading-tight mt-0.5">
              {role} • {shift}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-surface-low flex items-center justify-center text-on-surface-variant shrink-0">
            <User size={18} />
          </div>
        </div>

      </div>
    </div>
  );
};