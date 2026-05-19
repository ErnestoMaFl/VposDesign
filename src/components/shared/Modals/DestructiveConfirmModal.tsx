import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button'; // Importamos tu nuevo super componente

interface DestructiveConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  armingTimeMs?: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DestructiveConfirmModal: React.FC<DestructiveConfirmModalProps> = ({
  isOpen,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}) => {
  // Si no está abierto, no renderizamos nada
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

        <div className="flex w-full gap-4">
          
          {/* Botón Secundario (Ahora con el fondo tintado azul, cero gris) */}
          <Button
            variant="secondary"
            className="flex-1 py-4"
            onClick={onCancel}
          >
            {cancelText}
          </Button>

          {/* Botón Primario (Destructivo, sin animaciones basura) */}
          <Button
            variant="destructive"
            className="flex-1 py-4"
            onClick={onConfirm}
          >
            {confirmText}
          </Button>

        </div>
      </div>
    </div>
  );
};