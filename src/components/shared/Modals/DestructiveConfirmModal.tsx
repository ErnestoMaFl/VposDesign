import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface DestructiveConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  armingTimeMs?: number; // Tiempo en milisegundos para desbloquear (default: 1500)
  onConfirm: () => void;
  onCancel: () => void;
}

export const DestructiveConfirmModal: React.FC<DestructiveConfirmModalProps> = ({
  isOpen,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  armingTimeMs = 1500,
  onConfirm,
  onCancel,
}) => {
  const [isArmed, setIsArmed] = useState(false);
  const [progress, setProgress] = useState(0);

  // Lógica de armado del modal
  useEffect(() => {
    if (!isOpen) {
      setIsArmed(false);
      setProgress(0);
      return;
    }

    let startTime = Date.now();
    let animationFrameId: number;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min((elapsed / armingTimeMs) * 100, 100);
      
      setProgress(currentProgress);

      if (currentProgress < 100) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setIsArmed(true);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isOpen, armingTimeMs]);

  if (!isOpen) return null;

  return (
    // Overlay con Blur Pesado
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-base/80 backdrop-blur-md animate-in fade-in duration-300 px-4">
      
      {/* Contenedor del Modal */}
      <div className="bg-surface-container rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-surface-bright-edge/20 w-full max-w-md p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
        
        {/* Ícono de Advertencia Gigante */}
        <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mb-6 shadow-inner">
          <AlertTriangle size={40} className="text-error" />
        </div>

        {/* Tipografía Dramática */}
        <h2 className="font-narrative text-3xl text-error leading-tight mb-3">
          {title}
        </h2>
        
        <p className="font-utility text-sm text-on-surface-variant leading-relaxed mb-8">
          {description}
        </p>

        {/* Contenedor de Botones */}
        <div className="flex w-full gap-4">
          
          {/* Botón Secundario (Salida Segura) */}
          <button
            onClick={onCancel}
            className="flex-1 py-4 bg-surface-low hover:bg-surface-high rounded-xl font-utility text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
          >
            {cancelText}
          </button>

          {/* Botón Primario (Destructivo con Seguro) */}
          <button
            onClick={() => isArmed && onConfirm()}
            disabled={!isArmed}
            className={`
              relative flex-1 py-4 rounded-xl font-utility text-sm font-medium overflow-hidden transition-all duration-300
              ${isArmed 
                ? 'bg-error/20 border border-error/50 text-error hover:bg-error hover:text-white hover:shadow-[0_0_25px_rgba(155,68,68,0.5)] active:scale-95 cursor-pointer' 
                : 'bg-surface-low border border-transparent text-on-surface-variant/50 cursor-not-allowed'
              }
            `}
          >
            {/* Barra de progreso de llenado (Solo visible mientras se arma) */}
            {!isArmed && (
              <div 
                className="absolute left-0 top-0 bottom-0 bg-error/10 transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            )}
            
            {/* Texto del botón (Asegurado sobre la barra de progreso) */}
            <span className="relative z-10">
              {confirmText}
            </span>
          </button>

        </div>
      </div>
    </div>
  );
};