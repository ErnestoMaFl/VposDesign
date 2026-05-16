import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ScanLine, Loader2 } from 'lucide-react';

interface BarcodeScannerModalProps {
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ onClose, onScanSuccess }) => {
  const [isStarting, setIsStarting] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const scannerRef = useRef<any>(null);
  const isProcessingRef = useRef(false); // Seguro contra lecturas dobles

  useEffect(() => {
    let isMounted = true;

    const startScanner = async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        if (!isMounted) return;

        scannerRef.current = new Html5Qrcode("reader");
        const config = { fps: 10, qrbox: { width: 250, height: 150 }, aspectRatio: 1.0 };

        await scannerRef.current.start(
          { facingMode: "environment" },
          config,
          (decodedText: string) => {
            // Evitamos que lea 10 veces en 1 segundo y cicle la app
            if (isProcessingRef.current) return;
            isProcessingRef.current = true;

            if (navigator.vibrate) navigator.vibrate(200); 
            
            // YA NO PAUSAMOS NADA. Mandamos el texto y dejamos que el 
            // desmontaje (return de abajo) mate el hardware correctamente.
            onScanSuccess(decodedText);
          }
        );
        
        // CONDICIÓN DE CARRERA: Si le diste a la 'X' MIENTRAS la cámara encendía
        if (!isMounted) {
          scannerRef.current.stop().catch(() => {});
          return;
        }
        
        setIsStarting(false);

      } catch (err) {
        console.error("Error al iniciar cámara:", err);
        if (isMounted) {
          setHasError(true);
          setIsStarting(false);
        }
      }
    };

    startScanner();

    // ================================================================
    // RUTINA DE DESTRUCCIÓN ABSOLUTA (Aquí matamos el tab de la cámara)
    // ================================================================
    return () => {
      isMounted = false;
      if (scannerRef.current) {
        try {
          // Forzamos el STOP (que libera el track de video del navegador)
          // sin importar el estado "isScanning"
          scannerRef.current.stop()
            .then(() => {
              // clear() remueve los canvas/videos inyectados en el DOM
              scannerRef.current.clear();
            })
            .catch((e: any) => {
              // Si tira error porque ya estaba apagada, nos vale madre, lo ignoramos.
            });
        } catch (error) {
          // Ignoramos fallos silenciosos
        }
      }
    };
  }, [onScanSuccess]);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0B0D10]/98 backdrop-blur-xl animate-in fade-in duration-300">
      
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-4 bg-surface-highest hover:bg-error/20 text-on-surface hover:text-error rounded-full transition-colors z-[10000]"
      >
        <X size={28} />
      </button>

      <div className="relative flex flex-col items-center w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-8 text-accent-sage">
          <ScanLine size={24} className="animate-pulse" />
          <h2 className="font-utility text-lg font-medium tracking-widest uppercase">
            Escanea el Código
          </h2>
        </div>

        <div className="relative w-full aspect-square bg-surface-base rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-surface-bright-edge/30">
          
          {isStarting && !hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-on-surface-variant">
              <Loader2 size={32} className="animate-spin mb-4 text-accent-navy" />
              <p className="font-utility text-sm uppercase tracking-widest">Iniciando Lente...</p>
            </div>
          )}

          {hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-error p-6 text-center bg-surface-low">
              <X size={32} className="mb-4" />
              <p className="font-utility text-sm">No se pudo acceder a la cámara. Verifica los permisos de tu navegador.</p>
            </div>
          )}

          <div id="reader" className="w-full h-full object-cover" />
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_0_200px_rgba(11,13,16,0.7)]" />
        </div>

        <p className="font-utility text-xs text-on-surface-variant text-center mt-8 max-w-xs leading-relaxed">
          Apunta la cámara de tu dispositivo hacia el código de barras del producto. La lectura será automática.
        </p>
      </div>
    </div>,
    document.body
  );
};