import React, { useState } from 'react';
import { Settings2, X, Wifi, ShoppingBag, Mic, Route, LogOut } from 'lucide-react';
import { type VoiceOrbState } from './VoiceOrb';
import { type ConnectionState } from './HeaderBar';
import { type CartStatus } from './CartPanel';

interface SystemSidebarProps {
  connectionState: ConnectionState;
  setConnectionState: (s: ConnectionState) => void;
  cartStatus: CartStatus;
  setCartStatus: (s: CartStatus) => void;
  orbState: VoiceOrbState;
  setOrbState: (s: VoiceOrbState) => void;
  stepMode: 'linear' | 'context';
  setStepMode: (s: 'linear' | 'context') => void;
  showAmbiguity: boolean;
  setShowAmbiguity: (s: boolean) => void;
  onAdvanceStep: () => void;
  onGoToLogin: () => void;
}

export const SystemSidebar: React.FC<SystemSidebarProps> = ({
  connectionState, setConnectionState,
  cartStatus, setCartStatus,
  orbState, setOrbState,
  stepMode, setStepMode,
  showAmbiguity, setShowAmbiguity,
  onAdvanceStep, onGoToLogin
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Auto-cierra el sidebar al elegir una opción
  const OptionBtn = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
    <button
      onClick={() => { onClick(); setIsOpen(false); }}
      className={`px-3 py-2 rounded-lg text-xs font-utility transition-all duration-200 text-left ${
        active 
          ? 'bg-surface-high text-on-surface shadow-sm border border-surface-bright-edge/30' 
          : 'bg-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      {/* Botón Flotante para abrir (Fijado a la izquierda de la pantalla) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-1/2 -translate-y-1/2 z-50 p-2 bg-surface-highest border border-surface-bright-edge/30 rounded-r-xl shadow-[5px_0_20px_rgba(0,0,0,0.5)] text-on-surface-variant hover:text-on-surface transition-all duration-300 ${
          isOpen ? 'left-72' : 'left-0'
        }`}
      >
        <Settings2 size={20} />
      </button>

      {/* Sidebar Integrado (Empuja el contenido) */}
      <div 
        className={`h-full bg-surface-low border-r border-surface-bright-edge/20 shrink-0 transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden shadow-[15px_0_30px_rgba(0,0,0,0.1)] relative z-40 ${
          isOpen ? 'w-72' : 'w-0'
        }`}
      >
        {/* Contenedor interno con ancho fijo para que no se deforme al animar */}
        <div className="w-72 h-full flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-surface-bright-edge/20 shrink-0">
            <div>
              <h2 className="font-utility text-sm font-medium text-on-surface tracking-widest uppercase">
                Control de Sistema
              </h2>
              <p className="font-utility text-[10px] text-on-surface-variant mt-1">
                Entorno de Pruebas MVP
              </p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 bg-surface-base hover:bg-surface-container rounded-full text-on-surface-variant transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 [&::-webkit-scrollbar]:hidden">
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Wifi size={14} />
                <span className="font-utility text-[10px] uppercase tracking-widest">Conexión de Red</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <OptionBtn active={connectionState === 'online'} onClick={() => setConnectionState('online')} label="Online" />
                <OptionBtn active={connectionState === 'local'} onClick={() => setConnectionState('local')} label="Local" />
                <OptionBtn active={connectionState === 'offline'} onClick={() => setConnectionState('offline')} label="Offline" />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <ShoppingBag size={14} />
                <span className="font-utility text-[10px] uppercase tracking-widest">Estado del Carrito</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <OptionBtn active={cartStatus === 'empty'} onClick={() => setCartStatus('empty')} label="Vacío" />
                <OptionBtn active={cartStatus === 'active'} onClick={() => setCartStatus('active')} label="Activo" />
                <OptionBtn active={cartStatus === 'frozen'} onClick={() => setCartStatus('frozen')} label="Congelado" />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Mic size={14} />
                <span className="font-utility text-[10px] uppercase tracking-widest">Motor de Voz</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <OptionBtn active={orbState === 'standby'} onClick={() => setOrbState('standby')} label="Standby" />
                <OptionBtn active={orbState === 'listening'} onClick={() => setOrbState('listening')} label="Listening" />
                <OptionBtn active={orbState === 'processing'} onClick={() => setOrbState('processing')} label="Processing" />
                <OptionBtn active={orbState === 'success'} onClick={() => setOrbState('success')} label="Success" />
                <OptionBtn active={orbState === 'error'} onClick={() => setOrbState('error')} label="Error" />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Route size={14} />
                <span className="font-utility text-[10px] uppercase tracking-widest">Flujos de Interfaz</span>
              </div>
              <div className="flex flex-col gap-2">
                <OptionBtn active={stepMode === 'context'} onClick={() => setStepMode('context')} label="Modo Libre (Context)" />
                <button
                  onClick={() => { onAdvanceStep(); setIsOpen(false); }}
                  className="w-full px-3 py-2 bg-surface-container border border-surface-bright-edge hover:bg-surface-high text-on-surface text-xs font-utility rounded-lg flex justify-between items-center transition-colors"
                >
                  Avanzar Paso Lineal <span>&rarr;</span>
                </button>
                <button
                  onClick={() => { setShowAmbiguity(!showAmbiguity); if (!showAmbiguity) setOrbState('ambiguity'); setIsOpen(false); }}
                  className={`w-full px-3 py-2 text-xs font-utility rounded-lg flex justify-between items-center transition-colors ${showAmbiguity ? 'bg-accent-plum text-[#e3e2e6]' : 'bg-surface-low hover:bg-surface-container text-on-surface-variant'}`}
                >
                  Panel de Ambigüedad <span>{showAmbiguity ? 'Ocultar' : 'Mostrar'}</span>
                </button>
              </div>
            </div>

          </div>

          <div className="p-6 border-t border-surface-bright-edge/20 shrink-0">
            <button 
              onClick={() => { setIsOpen(false); onGoToLogin(); }}
              className="w-full px-4 py-3 bg-[#9B4444]/10 hover:bg-[#9B4444]/20 border border-[#9B4444]/20 text-[#9B4444] text-xs font-utility rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut size={14} />
              Volver al Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};