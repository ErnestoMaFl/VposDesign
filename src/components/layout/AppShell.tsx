import React from 'react';
import { HeaderBar } from "@/components/layout/HeaderBar";
import type { ConnectionState } from "@/types/system";
import { VoicePanel } from "@/features/voice/VoicePanel";
import { ProcessStackVisualizer } from "@/components/ui/ProcessStackVisualizer";
import type { VoiceOrbState, InterpretationItem } from "@/types/voice";

interface AppShellProps {
  // Contenido dinámico que cambiará según la pantalla
  children: React.ReactNode;
  headerProps?: {
    connectionStatus?: ConnectionState;
    moduleName?: string;
    breadcrumb?: string;
    cashierName?: string;
    role?: string;
    shift?: string;
  };
  voiceProps: {
    status: VoiceOrbState;
    transcriptText: string;
    isPartialTranscript?: boolean;
    detectedIntention?: string;
    interpretations?: InterpretationItem[];
    availableCommands?: string[];
  };
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  headerProps,
  voiceProps,
}) => {
  return (
    <div className="flex w-full h-screen bg-surface-base text-on-surface overflow-hidden">
      
      {/* COLUMNA IZQUIERDA: Header + Contenido Dinámico */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="relative z-40 flex flex-col shadow-sm shrink-0">
          <HeaderBar 
            connectionStatus={headerProps?.connectionStatus ?? 'online'}
            moduleName={headerProps?.moduleName}
            breadcrumb={headerProps?.breadcrumb}
            cashierName={headerProps?.cashierName}
            role={headerProps?.role}
            shift={headerProps?.shift}
          />
        </div>

        <div className="flex-1 relative z-0 flex flex-col overflow-hidden">
          {children}
        </div>
      </div>

      {/* COLUMNA DERECHA: Stack Visualizer + Voice Panel */}
      <div className="relative w-[380px] h-full flex flex-col bg-surface-low shadow-[-20px_0_50px_rgba(0,0,0,0.3)] z-30 shrink-0">
        <ProcessStackVisualizer />
        <VoicePanel {...voiceProps} />
      </div>
      
    </div>
  );
};