import React, { useState, useEffect } from 'react';
import { Layers, X, Maximize2, Minimize2, Eye, AlignLeft, ArrowRight, Trash2 } from 'lucide-react';
import { useAppStore, type PausedProcess } from '@/store/useAppStore';

export const ProcessStackVisualizer = () => {
  const processes = useAppStore(state => state.pausedProcesses);
  const clear = useAppStore(state => state.clearPausedProcesses);
  const removeProcess = useAppStore(state => state.removePausedProcess);
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [focusedProcessId, setFocusedProcessId] = useState<string | null>(null);
  const [modalProcessId, setModalProcessId] = useState<string | null>(null);

  useEffect(() => {
    if (processes.length === 0) {
      setIsExpanded(false);
      setFocusedProcessId(null);
      setModalProcessId(null);
    } else if (focusedProcessId && !processes.find(p => p.id === focusedProcessId)) {
      setFocusedProcessId(null);
    }
  }, [processes.length, focusedProcessId, processes]);

  if (processes.length === 0) return null;

  const displayCount = 3;
  const showExpandButton = processes.length > 1; 
  const hasMore = processes.length > displayCount;
  
  const visibleProcesses = focusedProcessId 
    ? processes.filter(p => p.id === focusedProcessId) 
    : (isExpanded ? processes : processes.slice(0, displayCount));

  const handleDetailsClick = (e: React.MouseEvent, proc: PausedProcess) => {
    e.stopPropagation();
    if (proc.details.length > 80) {
      setModalProcessId(proc.id);
    } else {
      setFocusedProcessId(proc.id);
    }
  };

  const handleResumeProcess = (procId: string) => {
    console.log("Recuperando proceso:", procId);
  };

  const processInModal = modalProcessId ? processes.find(p => p.id === modalProcessId) : null;

  return (
    <div className={`
      flex flex-col pt-4 pb-3 px-6 border-b border-surface-bright-edge/20 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden relative z-50
      ${isExpanded 
        ? 'flex-[1_0_100%] shadow-[0_15px_40px_rgba(0,0,0,0.3)] bg-surface-base' 
        : 'shrink-0 h-[25%] min-h-[230px] bg-surface-low'} 
    `}>
      
      {/* ========================================= */}
      {/* MINIMODAL 100% CONTAINER */}
      {/* ========================================= */}
      {processInModal && (
        <div className="absolute inset-0 z-[100] bg-surface-base flex flex-col animate-in fade-in duration-200">
          <div className="flex justify-between items-center px-5 py-3 shrink-0 border-b border-surface-bright-edge/10">
            <div className="flex items-center gap-2">
              <AlignLeft size={14} className="text-[#B47022]/60" />
              <span className="font-utility text-[11px] font-medium text-[#B47022] uppercase tracking-widest">
                Detalle • {processInModal.id}
              </span>
            </div>
            <button 
              onClick={() => setModalProcessId(null)} 
              className="p-1 hover:bg-[#9B4444]/20 text-on-surface-variant hover:text-[#9B4444] rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="flex-1 px-5 pt-2 pb-4 flex flex-col overflow-hidden">
            <div className="flex items-center gap-6 bg-surface-container rounded-lg px-4 py-2.5 mb-3 shrink-0 shadow-sm border border-surface-bright-edge/5">
              <div className="flex flex-col">
                <span className="font-utility text-[9px] text-on-surface-variant uppercase tracking-widest mb-0.5">Tiempo</span>
                <span className="font-utility text-xs font-medium text-on-surface">Hace {processInModal.timeAgo}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-utility text-[9px] text-on-surface-variant uppercase tracking-widest mb-0.5">Volumen</span>
                <span className="font-utility text-xs font-medium text-on-surface">{processInModal.itemCount} ítems</span>
              </div>
              {processInModal.total > 0 && (
                <div className="flex flex-col">
                  <span className="font-utility text-[9px] text-on-surface-variant uppercase tracking-widest mb-0.5">Valor</span>
                  <span className="font-utility text-xs font-medium text-on-surface">
                    ${processInModal.total.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-surface-bright-edge/50 [&::-webkit-scrollbar-thumb]:rounded-full">
              <p className="font-utility text-xs text-[#e3e2e6] leading-relaxed">
                {processInModal.details}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER SUPERIOR --- */}
      <div className="flex justify-between items-center mb-2 shrink-0 h-6">
        <span className="font-utility text-[10px] text-[#B47022] uppercase tracking-widest flex items-center gap-2 font-medium">
          <Layers size={14} /> Pila ({processes.length})
          {!isExpanded && hasMore && !focusedProcessId && (
            <span className="text-[#e3e2e6] bg-[#B47022]/20 px-1.5 rounded text-[9px]">
              + {processes.length - displayCount} ocultos
            </span>
          )}
        </span>
        
        {/* Acciones globales */}
        <div className="flex items-center gap-2">
          {showExpandButton && !focusedProcessId && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="p-1 bg-[#B47022] hover:brightness-110 border border-[#B47022] rounded text-[#0F1013] transition-all flex items-center shadow-[0_0_10px_rgba(180,112,34,0.4)]"
            >
              {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          )}
          <button onClick={clear} className="p-1 text-[#B47022]/60 hover:bg-[#9B4444]/10 hover:text-[#9B4444] rounded transition-colors" title="Borrar toda la pila">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {/* --- LISTA DE TARJETAS --- */}
      <div className={`
        flex-1 flex flex-col transition-all duration-300
        ${isExpanded ? 'gap-3 overflow-y-auto pr-2 pb-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#B47022]/50 [&::-webkit-scrollbar-thumb]:rounded-full' : 'gap-1.5 overflow-hidden'}
      `}>
        {visibleProcesses.map((proc, i) => {
          const uniqueKey = `${proc.id}-${i}`;
          const isFocused = focusedProcessId === proc.id;
          
          let isTop = false;
          if (focusedProcessId !== null) {
            isTop = isFocused; 
          } else {
            isTop = (i === 0); 
          }

          const isHeroMode = isFocused || processes.length === 1;
          const isCompactMode = !isExpanded && !isFocused && processes.length >= 3;
          const isExpandedMode = isExpanded && !isFocused;
          const isStackedMode = !isHeroMode && !isCompactMode && !isExpandedMode; 
          
          return (
            <div 
              key={uniqueKey} 
              onClick={() => handleResumeProcess(proc.id)}
              className={`
                group w-full rounded-xl flex flex-col justify-center overflow-hidden transition-all duration-300 relative cursor-pointer
                ${isHeroMode ? 'flex-1 p-3.5' : ''}
                ${isCompactMode ? 'flex-1 p-2 px-3' : ''}
                ${isExpandedMode ? 'shrink-0 min-h-[140px] max-h-[180px] p-4 mb-1' : ''}
                ${isStackedMode ? 'flex-1 p-3' : ''}
                ${isTop 
                  ? 'bg-[#B47022]/10 border-t border-[#B47022]/40 shadow-sm hover:bg-[#B47022]/20' 
                  : 'bg-surface-container border-t border-surface-bright-edge/30 hover:bg-surface-high'}
              `}
            >
              {/* FLECHA CENTRADA EN 35% PARA HERO MODE */}
              <div className={`absolute right-[-10%] ${isHeroMode ? 'top-[53%]' : 'top-1/2'} -translate-y-1/2 text-surface-bright-edge opacity-0 group-hover:opacity-[0.18] group-hover:right-[-5%] transition-all duration-500 pointer-events-none`}>
                <ArrowRight size={100} className={isTop ? 'text-[#B47022]' : ''} />
              </div>

              {/* ========================================================= */}
              {/* MODO COMPACTO HORIZONTAL */}
              {/* ========================================================= */}
              {isCompactMode && (
                <div className="flex justify-between items-center w-full h-full gap-2 relative z-10 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <span className={`font-utility text-[11px] font-medium truncate ${isTop ? 'text-[#B47022]' : 'text-on-surface'}`}>
                      {proc.name}
                    </span>
                    <div className={`flex items-center gap-1.5 mt-0.5 font-utility text-[9px] ${isTop ? 'text-[#B47022]/70' : 'text-on-surface-variant'}`}>
                      <span>Vol: {proc.itemCount}</span>
                      <span className="opacity-40">•</span>
                      <span>Tpo: {proc.timeAgo}</span>
                      {proc.total > 0 && (
                        <>
                          <span className="opacity-40">•</span>
                          <span>Val: ${proc.total.toFixed(2)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`font-utility text-[9px] uppercase tracking-widest ${isTop ? 'text-[#B47022]/70' : 'text-on-surface-variant'}`}>
                      {proc.id}
                    </span>
                    
                    <button 
                      onClick={(e) => handleDetailsClick(e, proc)} 
                      className={`p-1 flex items-center justify-center rounded transition-colors ${isTop ? 'bg-[#B47022]/10 hover:bg-[#B47022]/20 text-[#B47022]' : 'hover:bg-surface-high text-on-surface-variant hover:text-on-surface'}`}
                      title="Ver detalles"
                    >
                      <Eye size={14} />
                    </button>
                    {processes.length > 1 && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeProcess(proc.id); }} 
                        className="p-1 text-on-surface-variant hover:text-[#9B4444] transition-colors rounded"
                        title="Eliminar proceso"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODO HERO (1 Ítem o Enfocado) */}
              {/* ========================================================= */}
              {isHeroMode && (
                <div className="flex flex-col h-full relative z-10 justify-start animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-center mb-2 shrink-0">
                    <h4 className={`font-narrative text-2xl leading-none ${isTop ? 'text-[#e3e2e6]' : 'text-on-surface'}`}>
                      {proc.name}
                    </h4>
                    
                    <div className="flex items-center gap-2">
                      <span className={`font-utility text-[12px] tracking-widest uppercase ${isTop ? 'text-[#B47022]' : 'text-on-surface-variant'}`}>
                        {proc.id}
                      </span>
                      {isFocused && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); setFocusedProcessId(null); }} 
                          className="p-1 hover:bg-surface-highest text-on-surface-variant hover:text-on-surface rounded-full transition-colors border border-surface-bright-edge/20"
                          title="Cerrar detalles"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-1 border-y border-surface-bright-edge/10 mb-1 shrink-0">
                    <div className="flex flex-col justify-center">
                      <span className="font-utility text-[8px] text-on-surface-variant uppercase tracking-widest">Volumen</span>
                      <span className="font-narrative text-[17px] leading-tight text-[#e3e2e6]">{proc.itemCount}</span>
                    </div>
                    <div className="flex flex-col border-l border-surface-bright-edge/10 pl-2 justify-center">
                      <span className="font-utility text-[8px] text-on-surface-variant uppercase tracking-widest">Tiempo</span>
                      <span className="font-narrative text-[17px] leading-tight text-[#e3e2e6]">{proc.timeAgo}</span>
                    </div>
                    {proc.total > 0 && (
                      <div className="flex flex-col border-l border-surface-bright-edge/10 pl-2 justify-center">
                        <span className="font-utility text-[8px] text-[#B47022] uppercase tracking-widest">Valor</span>
                        <span className="font-narrative text-[17px] leading-tight text-[#e3e2e6]">${proc.total.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#B47022]/30 [&::-webkit-scrollbar-thumb]:rounded-full flex flex-col justify-start">
                    <p className={`font-utility text-[11px] leading-snug italic ${isTop ? 'text-[#e3e2e6]/90' : 'text-on-surface-variant'}`}>
                      "{proc.details}"
                      {proc.details.length > 80 && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); setModalProcessId(proc.id); }} 
                          className={`inline-flex items-baseline ml-1 font-bold hover:underline ${isTop ? 'text-[#B47022]' : 'text-on-surface'}`}
                          title="Ver bitácora"
                        >
                          [+]
                        </button>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODO EXPANDIDO (Cards amplias y arquitectónicas) */}
              {/* ========================================================= */}
              {isExpandedMode && (
                <div className="flex flex-col h-full w-full relative z-10 justify-between animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-start w-full gap-4 mb-2 shrink-0">
                    <h4 className={`font-narrative text-xl truncate ${isTop ? 'text-[#B47022]' : 'text-on-surface'}`}>
                      {proc.name}
                    </h4>
                    <span className={`font-utility text-[11px] tracking-widest uppercase mt-0.5 shrink-0 ${isTop ? 'text-[#B47022]' : 'text-on-surface-variant'}`}>
                      {proc.id}
                    </span>
                  </div>

                  <div className="flex-1 min-h-0 overflow-hidden mb-3">
                    <p className={`font-utility text-xs leading-relaxed italic line-clamp-2 opacity-90 ${isTop ? 'text-[#e3e2e6]' : 'text-on-surface-variant'}`}>
                      "{proc.details}"
                    </p>
                  </div>

                  <div className="flex justify-between items-end w-full mt-auto shrink-0">
                    <div className="flex items-center gap-4 font-utility">
                      <div className="flex flex-col">
                        <span className={`text-[9px] uppercase tracking-widest mb-0.5 ${isTop ? 'text-[#B47022]/70' : 'text-on-surface-variant'}`}>Volumen</span>
                        <span className={`text-sm font-medium ${isTop ? 'text-[#e3e2e6]' : 'text-on-surface'}`}>{proc.itemCount}</span>
                      </div>
                      <div className={`w-[1px] h-6 ${isTop ? 'bg-[#B47022]/30' : 'bg-surface-bright-edge/30'}`} />
                      <div className="flex flex-col">
                        <span className={`text-[9px] uppercase tracking-widest mb-0.5 ${isTop ? 'text-[#B47022]/70' : 'text-on-surface-variant'}`}>Tiempo</span>
                        <span className={`text-sm font-medium ${isTop ? 'text-[#e3e2e6]' : 'text-on-surface'}`}>{proc.timeAgo}</span>
                      </div>
                      {proc.total > 0 && (
                        <>
                          <div className={`w-[1px] h-6 ${isTop ? 'bg-[#B47022]/30' : 'bg-surface-bright-edge/30'}`} />
                          <div className="flex flex-col">
                            <span className={`text-[9px] uppercase tracking-widest mb-0.5 ${isTop ? 'text-[#B47022]' : 'text-on-surface-variant'}`}>Valor</span>
                            <span className={`text-sm font-medium ${isTop ? 'text-[#e3e2e6]' : 'text-on-surface'}`}>${proc.total.toFixed(2)}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button 
                        onClick={(e) => handleDetailsClick(e, proc)} 
                        className={`p-2 rounded-lg transition-colors ${isTop ? 'bg-[#B47022]/20 hover:bg-[#B47022]/30 text-[#B47022]' : 'bg-surface-base hover:bg-surface-high text-on-surface-variant hover:text-on-surface'}`}
                        title="Ver detalles"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeProcess(proc.id); }} 
                        className="p-2 text-on-surface-variant hover:text-[#9B4444] bg-surface-base hover:bg-[#9B4444]/15 transition-all rounded-lg"
                        title="Eliminar proceso"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODO ESTÁNDAR REDISEÑADO (Exactamente 2 ítems) */}
              {/* ========================================================= */}
              {isStackedMode && (
                <div className="flex flex-col h-full w-full relative z-10 justify-between animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-start w-full gap-4">
                    <h4 className={`font-narrative text-lg truncate ${isTop ? 'text-[#B47022]' : 'text-on-surface'}`}>
                      {proc.name}
                    </h4>
                    <span className={`font-utility text-[11px] tracking-widest uppercase mt-0.5 shrink-0 ${isTop ? 'text-[#B47022]' : 'text-on-surface-variant'}`}>
                      {proc.id}
                    </span>
                  </div>

                  <div className="flex justify-between items-end w-full mt-auto gap-4">
                    <div className={`flex items-center gap-2 font-utility text-xs pb-1 ${isTop ? 'text-[#e3e2e6]/90' : 'text-on-surface-variant'}`}>
                      <div className="flex items-center gap-1">
                        <span className="uppercase tracking-widest text-[10px] opacity-70">Vol</span>
                        <span className="font-medium">{proc.itemCount}</span>
                      </div>
                      <span className="opacity-40">•</span>
                      <div className="flex items-center gap-1">
                        <span className="uppercase tracking-widest text-[10px] opacity-70">Tpo</span>
                        <span className="font-medium">{proc.timeAgo}</span>
                      </div>
                      {proc.total > 0 && (
                        <>
                          <span className="opacity-40">•</span>
                          <div className="flex items-center gap-1">
                            <span className="uppercase tracking-widest text-[10px] opacity-70">Val</span>
                            <span className={isTop ? 'text-[#e3e2e6] font-medium' : 'font-medium'}>${proc.total.toFixed(2)}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button 
                        onClick={(e) => handleDetailsClick(e, proc)} 
                        className={`p-2 rounded-lg transition-all ${isTop ? 'hover:bg-[#B47022]/20 text-[#B47022]' : 'hover:bg-surface-high text-on-surface-variant hover:text-on-surface'}`}
                        title="Ver detalles"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeProcess(proc.id); }} 
                        className="p-2 text-on-surface-variant hover:text-[#9B4444] hover:bg-[#9B4444]/15 transition-all rounded-lg"
                        title="Eliminar proceso"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
};