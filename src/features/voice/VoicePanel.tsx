import React from 'react';
import { Loader2, XCircle, Mic, Cpu, Plus, Banknote, Hash, Package, Search } from 'lucide-react';
import { VoiceOrb } from "@/components/ui/VoiceOrb";
import type { VoiceOrbState } from "@/types/voice";
// Reemplaza la línea 4 con esto:
import type { InterpretationItem, InterpretationStatus, SemanticType } from "@/types/voice";

const TranscriptDisplay: React.FC<{ text: string; isPartial: boolean; intention?: string }> = ({ text, isPartial, intention }) => (
  <div className="flex flex-col items-center text-center space-y-3 w-full">
    <span className="font-utility text-[10px] text-on-surface-variant font-medium tracking-widest uppercase">
      Lo que dijiste
    </span>
    {/* Transcripción (Resuelta o parcial) */}
    <p className={`font-narrative text-3xl italic leading-tight transition-all duration-300 ${isPartial ? 'text-on-surface-variant opacity-70' : 'text-on-surface opacity-100'}`}>
      "{text}"
    </p>
    {/*Etiqueta de Intención para Debugging/Monitor de Verdad */}
    {intention && !isPartial && (
      <div className="mt-2 px-2.5 py-1 bg-surface-container rounded text-[9px] font-utility text-accent-navy tracking-widest uppercase border border-accent-navy/20">
        INTENCIÓN: {intention}
      </div>
    )}
  </div>
);

const InterpretationDisplay: React.FC<{ items: InterpretationItem[] }> = ({ items }) => {
  if (!items || items.length === 0) return null;

  // Mapear el ícono según la semántica
  const getSemanticIcon = (item: InterpretationItem) => {
    //Aquí sí usamos colores y animaciones
    if (item.status === 'pending') return <Loader2 size={16} className="text-accent-navy animate-spin shrink-0" />;
    if (item.status === 'error') return <XCircle size={16} className="text-[#9B4444] shrink-0" />;
    
    // Éxito inato: Gris resaltado (on-surface-variant) para sentirse parte del panel, sin palomitas.
    const iconProps = { size: 16, className: "text-on-surface-variant/35 shrink-0" };
    switch (item.semanticType) {
      case 'add': return <Plus {...iconProps} />;
      case 'charge': return <Banknote {...iconProps} />;
      case 'quantity': return <Hash {...iconProps} />;
      case 'product': return <Package {...iconProps} />;
      case 'search': return <Search {...iconProps} />;
      default: return <div className="w-1.5 h-1.5 rounded-full bg-on-surface-variant shrink-0 mx-1" />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <span className="font-utility text-[10px] text-on-surface-variant font-medium tracking-widest uppercase">
        Lo que entendí
      </span>
      <div className="flex flex-col">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-2">
            {getSemanticIcon(item)}
            <span className={`font-utility text-sm ${item.status === 'error' ? 'text-[#9B4444]' : 'text-on-surface'}`}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AvailableCommandsList: React.FC<{ commands: string[] }> = ({ commands }) => {
  if (!commands || commands.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-3">
      <span className="font-utility text-[10px] text-on-surface-variant font-medium tracking-widest uppercase flex items-center gap-2">
        <Mic size={12} />
        Ahora puedes decir
      </span>
      <div className="flex flex-wrap gap-2">
        {commands.map((cmd, idx) => (
          <button 
            key={idx}
            className="px-4 py-2 bg-surface-container hover:bg-surface-high transition-colors rounded-full font-utility text-xs text-on-surface"
          >
            "{cmd}"
          </button>
        ))}
      </div>
    </div>
  );
};

const AIStatusIndicator: React.FC<{ model: string; latency: number; commandCount: number }> = ({ model, latency, commandCount }) => (
  <div className="w-full mt-auto pt-6 flex justify-between items-center text-on-surface-variant font-utility border-t border-surface-bright-edge/30">
    <div className="flex items-center gap-1.5">
      <Cpu size={12} className="text-accent-navy" />
      <span className="text-[9px] uppercase tracking-widest font-medium">{model}</span>
    </div>
    <div className="flex gap-4 text-[10px] tracking-widest font-medium">
      <span title="Latencia del último comando">{latency}ms</span>
      <span title="Comandos procesados en la sesión">{commandCount} CMDS</span>
    </div>
  </div>
);

// --- COMPONENTE PRINCIPAL ---

interface VoicePanelProps {
  status: VoiceOrbState;
  transcriptText: string;
  isPartialTranscript?: boolean;
  detectedIntention?: string;
  interpretations?: InterpretationItem[];
  availableCommands?: string[];
  aiStats?: { model: string; latency: number; commandCount: number };
}

export const VoicePanel: React.FC<VoicePanelProps> = ({
  status,
  transcriptText,
  isPartialTranscript = false,
  detectedIntention,
  interpretations = [],
  availableCommands = [],
  aiStats = { model: "Groq Llama 3", latency: 124, commandCount: 12 }
}) => {
  return (
    <div className="w-[380px] h-full bg-surface-low shadow-[-20px_0_50px_rgba(0,0,0,0.3)] z-30 flex flex-col pt-24 pb-8 relative">      
      {/* Área Superior */}
      <div className="flex flex-col items-center px-8 gap-8 shrink-0">
        <VoiceOrb status={status} size="lg" />
        
        {transcriptText && (
          <TranscriptDisplay 
            text={transcriptText} 
            isPartial={isPartialTranscript} 
            intention={detectedIntention} 
          />
        )}
      </div>

      {/* Área Inferior (Scrolleable) */}
      <div className="flex-1 overflow-y-auto mt-8 px-8 flex flex-col gap-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <InterpretationDisplay items={interpretations} />
        <AvailableCommandsList commands={availableCommands} />
      </div>

      {/* Footer del Panel: AI Status Indicator */}
      <div className="px-8 shrink-0 mt-4">
        <AIStatusIndicator {...aiStats} />
      </div>

    </div>
  );
};