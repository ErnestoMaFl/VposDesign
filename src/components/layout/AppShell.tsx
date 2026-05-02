import React from 'react';
import { HeaderBar } from "@/components/layout/HeaderBar";
import type { ConnectionState } from "@/types/system";
import { VoicePanel } from "@/features/voice/VoicePanel";
import type { VoiceOrbState, InterpretationItem } from "@/types/voice";

interface AppShellProps {
  // Contenido dinámico que cambiará según la pantalla
  children: React.ReactNode;
  
  // Props para la Zona A (HeaderBar)
  headerProps?: {
    connectionStatus?: ConnectionState;
    moduleName?: string;
    breadcrumb?: string;
    cashierName?: string;
    role?: string;
    shift?: string;
  };

  // Props para la Zona C (VoicePanel)
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
    // Raíz: Flex horizontal que ocupa toda la pantalla
    <div className="flex w-full h-screen bg-surface-base text-on-surface overflow-hidden">
      
      {/* COLUMNA IZQUIERDA: Header + Contenido Dinámico */}
      <div className="flex-1 flex flex-col relative">
        
        {/* ZONA A: HeaderBar Fijo (Techo Arquitectónico z-40) */}
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

        {/* ÁREA CENTRAL DINÁMICA (Main Content) */}
        <div className="flex-1 relative flex flex-col overflow-hidden">
          {children}
        </div>

      </div>

      {/* ZONA C: VoicePanel Fijo Lateral */}
      {/* Su z-30 y diseño propio ya garantizan que se superponga adecuadamente */}
      <VoicePanel {...voiceProps} />
      
    </div>
  );
};