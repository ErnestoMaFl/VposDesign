import React, { useState } from 'react';
import { Settings2, X, Wifi, ShoppingBag, Mic, Route, LogOut, Play, BarChart2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { VoiceOrbState } from "@/types/voice";
import type { ConnectionState } from "@/types/system";
import type { CartStatus } from '@/types/cart';

interface SystemSidebarProps {
  variant?: 'pos' | 'home'; 
  connectionState: ConnectionState;
  setConnectionState: (s: ConnectionState) => void;
  onGoToLogin: () => void;
  
  cartStatus?: CartStatus;
  setCartStatus?: (s: CartStatus) => void;
  orbState?: VoiceOrbState;
  setOrbState?: (s: VoiceOrbState) => void;
  stepMode?: 'linear' | 'context';
  setStepMode?: (s: 'linear' | 'context') => void;
  showAmbiguity?: boolean;
  setShowAmbiguity?: (s: boolean) => void;
  onAdvanceStep?: () => void;
  onGoToSplash?: () => void;
  onGoToHome?: () => void;
  mockError?: boolean;
  setMockError?: (v: boolean) => void;
  mockRecovery?: boolean;
  setMockRecovery?: (v: boolean) => void;
}

const OptionBtn = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-lg text-xs font-utility transition-all duration-200 text-center flex-1 ${
      active 
        ? 'bg-surface-high text-on-surface shadow-sm border border-surface-bright-edge/30' 
        : 'bg-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
    }`}
  >
    {label}
  </button>
);

export const SystemSidebar: React.FC<SystemSidebarProps> = ({
  variant = 'pos',
  connectionState, setConnectionState,
  onGoToLogin,
  cartStatus, setCartStatus,
  orbState, setOrbState,
  stepMode, setStepMode,
  showAmbiguity, setShowAmbiguity,
  onAdvanceStep, onGoToHome,
  setMockError, setMockRecovery
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const setHomeMetrics = useAppStore((state) => state.setHomeMetrics);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-1/2 -translate-y-1/2 z-50 p-2 bg-surface-highest border border-surface-bright-edge/30 rounded-r-xl shadow-[5px_0_20px_rgba(0,0,0,0.5)] text-on-surface-variant hover:text-on-surface transition-all duration-300 ${
          isOpen ? 'left-[260px]' : 'left-0'
        }`}
      >
        <Settings2 size={20} />
      </button>

      <div 
        className={`h-full bg-surface-low border-r border-surface-bright-edge/20 shrink-0 transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden shadow-[15px_0_30px_rgba(0,0,0,0.1)] relative z-40 ${
          isOpen ? 'w-[260px]' : 'w-0'
        }`}
      >
        <div className="w-[260px] h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-surface-bright-edge/20 shrink-0">
            <div>
              <h2 className="font-utility text-sm font-medium text-on-surface tracking-widest uppercase">
                Control MVP
              </h2>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1.5 bg-surface-base hover:bg-surface-container rounded-full text-on-surface-variant">
              <X size={14} />
            </button>
          </div>

          <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            
            {variant === 'pos' && (
              <>
                <div className="flex flex-col gap-2 pb-3 border-b border-surface-bright-edge/20">
                  <div className="flex items-center gap-2 text-on-surface-variant mb-1">
                    <Play size={12} />
                    <span className="font-utility text-[10px] uppercase tracking-widest">Ejecutar Flujos Completos</span>
                  </div>
                  
                  <button 
                    onClick={() => { setIsOpen(false); onGoToHome?.(); }} 
                    className="w-full mb-2 py-1.5 bg-surface-container hover:bg-surface-high border border-surface-bright-edge/30 text-on-surface text-[10px] rounded transition-colors tracking-widest uppercase font-medium"
                  >
                    &larr; Volver al Home
                  </button>

                  <button 
                    onClick={() => { setMockError?.(false); setMockRecovery?.(false); onGoToLogin(); }} 
                    className="w-full py-1.5 bg-surface-base hover:bg-surface-container border border-surface-bright-edge/30 text-on-surface-variant text-[10px] rounded hover:text-on-surface transition-colors tracking-widest uppercase"
                  >
                    Simular Flujo Normal
                  </button>
                  
                  <button 
                    onClick={() => { setMockError?.(true); setMockRecovery?.(false); onGoToLogin(); }} 
                    className="w-full py-1.5 bg-[#9B4444]/10 hover:bg-[#9B4444]/20 border border-[#9B4444]/30 text-[#9B4444] text-[10px] rounded transition-colors tracking-widest uppercase"
                  >
                    Simular Error de Red
                  </button>
                  
                  <button 
                    onClick={() => { setMockError?.(false); setMockRecovery?.(true); onGoToLogin(); }} 
                    className="w-full py-1.5 bg-accent-plum/10 hover:bg-accent-plum/20 border border-accent-plum/30 text-accent-plum text-[10px] rounded transition-colors tracking-widest uppercase"
                  >
                    Simular Sesión Pausada
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <ShoppingBag size={12} />
                    <span className="font-utility text-[10px] uppercase tracking-widest">Carrito</span>
                  </div>
                  <div className="flex gap-1 w-full">
                    <OptionBtn active={cartStatus === 'empty'} onClick={() => setCartStatus?.('empty')} label="Vacío" />
                    <OptionBtn active={cartStatus === 'active'} onClick={() => setCartStatus?.('active')} label="Act" />
                    <OptionBtn active={cartStatus === 'frozen'} onClick={() => setCartStatus?.('frozen')} label="Cong" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <Mic size={12} />
                    <span className="font-utility text-[10px] uppercase tracking-widest">Orb</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 w-full">
                    <OptionBtn active={orbState === 'standby'} onClick={() => setOrbState?.('standby')} label="Stby" />
                    <OptionBtn active={orbState === 'listening'} onClick={() => setOrbState?.('listening')} label="List" />
                    <OptionBtn active={orbState === 'processing'} onClick={() => setOrbState?.('processing')} label="Proc" />
                    <OptionBtn active={orbState === 'success'} onClick={() => setOrbState?.('success')} label="Ok" />
                    <OptionBtn active={orbState === 'error'} onClick={() => setOrbState?.('error')} label="Err" />
                    <OptionBtn active={orbState === 'ambiguity'} onClick={() => setOrbState?.('ambiguity')} label="Amb" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <Route size={12} />
                    <span className="font-utility text-[10px] uppercase tracking-widest">Flujos</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button onClick={() => setStepMode?.(stepMode === 'linear' ? 'context' : 'linear')} className="w-full px-2 py-1.5 bg-surface-container border border-surface-bright-edge hover:bg-surface-high text-on-surface text-[11px] font-utility rounded flex justify-between items-center transition-colors">
                      Modo: {stepMode === 'linear' ? 'Lineal' : 'Libre'}
                    </button>
                    <button onClick={onAdvanceStep} className="w-full px-2 py-1.5 bg-surface-container border border-surface-bright-edge hover:bg-surface-high text-on-surface text-[11px] font-utility rounded flex justify-between items-center transition-colors">
                      Avanzar Paso Lineal <span>&rarr;</span>
                    </button>
                    <button onClick={() => { setShowAmbiguity?.(!showAmbiguity); if (!showAmbiguity) setOrbState?.('ambiguity'); }} className={`w-full px-2 py-1.5 text-[11px] font-utility rounded flex justify-between items-center transition-colors ${showAmbiguity ? 'bg-accent-plum text-[#e3e2e6]' : 'bg-surface-low hover:bg-surface-container text-on-surface-variant'}`}>
                      Ambigüedad <span>{showAmbiguity ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {variant === 'home' && (
              <div className="flex flex-col gap-2 pb-3 border-b border-surface-bright-edge/20">
                <div className="flex items-center gap-2 text-on-surface-variant mb-1">
                  <BarChart2 size={12} />
                  <span className="font-utility text-[10px] uppercase tracking-widest">Métricas del Tablero</span>
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                  <button 
                    onClick={() => setHomeMetrics({ salesToday: 12, salesTotal: 350.50, trend: 2, lowStockCount: 0, pendingItems: 2, topCategory: 'Pan Dulce', pendingOrders: 0 })} 
                    className="px-2 py-1.5 bg-surface-container hover:bg-surface-high text-on-surface-variant hover:text-on-surface text-[11px] font-utility rounded text-left transition-colors flex items-center gap-2"
                  >
                    Mañana Tranquila
                  </button>
                  <button 
                    onClick={() => setHomeMetrics({ salesToday: 142, salesTotal: 4250.00, trend: 12, lowStockCount: 3, pendingItems: 18, topCategory: 'Bebidas', pendingOrders: 2 })} 
                    className="px-2 py-1.5 bg-surface-container hover:bg-surface-high text-on-surface text-[11px] font-utility rounded text-left transition-colors flex items-center gap-2"
                  >
                    Turno Normal
                  </button>
                  <button 
                    onClick={() => setHomeMetrics({ salesToday: 385, salesTotal: 18450.00, trend: 45, lowStockCount: 14, pendingItems: 42, topCategory: 'Cervezas', pendingOrders: 8 })} 
                    className="px-2 py-1.5 bg-[#B47022]/20 hover:bg-[#B47022]/30 text-[#e3e2e6] text-[11px] font-utility rounded text-left transition-colors flex items-center gap-2 shadow-[0_0_10px_rgba(180,112,34,0.1)]"
                  >
                    Hora Pico (Caos)
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Wifi size={12} />
                <span className="font-utility text-[10px] uppercase tracking-widest">Red</span>
              </div>
              <div className="flex gap-1 w-full">
                <OptionBtn active={connectionState === 'online'} onClick={() => setConnectionState(('online'))} label="On" />
                <OptionBtn active={connectionState === 'local'} onClick={() => setConnectionState(('local'))} label="Loc" />
                <OptionBtn active={connectionState === 'offline'} onClick={() => setConnectionState(('offline'))} label="Off" />
              </div>
            </div>

          </div>

          <div className="p-4 border-t border-surface-bright-edge/20 shrink-0">
            <button 
              onClick={() => { setIsOpen(false); onGoToLogin(); }}
              className="w-full px-3 py-2.5 bg-[#9B4444]/10 hover:bg-[#9B4444]/20 border border-[#9B4444]/20 text-[#9B4444] text-xs font-utility rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut size={14} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );
};