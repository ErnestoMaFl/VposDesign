import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ProcessStepBar } from '@/components/ui/ProcessStepBar';

interface CardPanelLayoutProps {
  headerProps: any; 
  voiceProps: any;  
  stepContextMessage?: string;
  title: string;
  headerAction?: React.ReactNode; // Botones extra al lado del título (ej. "Finalizar Escaneo")
  children: React.ReactNode;
}

export const CardPanelLayout: React.FC<CardPanelLayoutProps> = ({
  headerProps,
  voiceProps,
  stepContextMessage,
  title,
  headerAction,
  children
}) => {
  return (
    <AppShell headerProps={headerProps} voiceProps={voiceProps}>
      <div className="flex-1 flex flex-col h-full bg-surface-base overflow-hidden">
        
        <ProcessStepBar contextMessage={stepContextMessage} />

        <div className="flex-1 px-10 pt-8 pb-4 flex flex-col overflow-hidden">
          <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col min-h-0">
            
            {/* Header del Panel */}
            <div className="flex justify-between items-end mb-8 shrink-0">
              <h3 className="font-narrative text-3xl text-[#e3e2e6] tracking-tight">
                {title}
              </h3>
              {headerAction && (
                <div>{headerAction}</div>
              )}
            </div>

            {/* Contenido (Grid de tarjetas) */}
            {children}

          </div>
        </div>
      </div>
    </AppShell>
  );
};