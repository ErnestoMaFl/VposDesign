import React from 'react';

export interface ProcessStepBarProps {
  /** Arreglo de los nombres de los pasos (ej. ['Agregar', 'Descuento', 'Cobrar', 'Confirmar']) */
  steps?: string[];
  /** Índice del paso activo actual (0-based) */
  currentStep?: number;
  /** Si se provee, muestra un mensaje contextual no lineal en lugar de los pasos */
  contextMessage?: string;
}

export const ProcessStepBar: React.FC<ProcessStepBarProps> = ({
  steps = [],
  currentStep = 0,
  contextMessage,
}) => {
  const isLinear = !contextMessage && steps.length > 0;
  
  // Calculamos el ancho de la línea Sage (Conductor Rail)
  const progressPercentage = isLinear && steps.length > 1
    ? (currentStep / (steps.length - 1)) * 100
    : 0;

  return (
    <div className="w-full bg-surface-base flex flex-col relative">
      {/* Signature Component: The Conductor Rail */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-surface-bright-edge">
        <div
          className="h-full bg-accent-sage transition-all duration-500 ease-in-out"
          style={{ width: contextMessage ? '0%' : `${progressPercentage}%` }}
        />
      </div>

      {/* Content Area */}
      <div className="pt-5 pb-4 px-8">
        {!isLinear ? (
          /* Estado No Lineal (Modo Libre / Espera) */
          <div className="flex items-center">
            <span className="font-utility text-sm font-medium text-on-surface-variant uppercase tracking-widest">
              {contextMessage}
            </span>
          </div>
        ) : (
          /* Estado Lineal (Flujo de Pasos) */
          <div className="flex justify-between items-center relative">
            {steps.map((step, idx) => {
              const isActive = idx === currentStep;
              const isCompleted = idx < currentStep;
              const isPending = idx > currentStep;

              return (
                <div
                  key={step}
                  className="flex items-baseline gap-2 z-10 transition-colors duration-300"
                >
                  {/* Número de Paso */}
                  <span
                    className={`font-utility text-xs font-medium tracking-wider
                      ${isActive ? 'text-accent-sage' : ''}
                      ${isCompleted ? 'text-on-surface-variant' : ''}
                      ${isPending ? 'text-surface-bright-edge' : ''}
                    `}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  {/* Etiqueta del Paso */}
                  <span
                    className={`font-utility text-sm
                      ${isActive ? 'text-on-surface font-medium' : 'text-on-surface-variant font-normal'}
                    `}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};