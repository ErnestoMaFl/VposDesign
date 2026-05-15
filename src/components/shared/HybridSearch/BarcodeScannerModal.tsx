import React, { useEffect, useRef, useState } from 'react';
import { X, ScanLine, Loader2 } from 'lucide-react';

interface BarcodeScannerModalProps {
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ onClose, onScanSuccess }) => {
  const [isStarting, setIsStarting] = useState(true);
  const [hasError, setHasError] = useState(false);
  const scannerRef = useRef<any>(null); // Guardamos la instancia del escáner

  useEffect(() => {
    let isMounted = true;

    const startScanner = async () => {
      try {
        // 1. LAZY LOADING: Importamos la librería SOLO cuando se abre el modal
        const { Html5Qrcode } = await import('html5-qrcode');
        
        if (!isMounted) return;

        // 2. Instanciamos el lector apuntando al div con id "reader"
        scannerRef.current = new Html5Qrcode("reader");
        
        const config = { 
          fps: 10, 
          qrbox: { width: 250, height: 150 }, // Retícula rectangular para códigos de barras
          aspectRatio: 1.0 
        };

        await scannerRef.current.start(
          { facingMode: "environment" }, // Forzamos la cámara trasera
          config,
          (decodedText: string) => {
            // ÉXITO AL LEER EL CÓDIGO
            
            // A. Feedback Táctil (Vibración)
            if (navigator.vibrate) {
              navigator.vibrate(200); 
            }
            
            // B. Feedback Sonoro (Beep)
            // Nota: Crea un archivo beep.mp3 en tu carpeta public/
            try {
              const audio = new Audio('/beep.mp3');
              audio.play().catch(() => {}); // Ignoramos si el navegador bloquea el audio
            } catch (e) {}

            // C. Pausar escáner y mandar la data
            if (scannerRef.current) {
              scannerRef.current.pause(true);
            }
            onScanSuccess(decodedText);
          }
        );
        
        if (isMounted) setIsStarting(false);

      } catch (err) {
        console.error("Error al iniciar cámara:", err);
        if (isMounted) {
          setHasError(true);
          setIsStarting(false);
        }
      }
    };

    startScanner();

    // 3. DESMONTAJE SEGURO: Apagamos el hardware al cerrar
    return () => {
      isMounted = false;
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0D10]/95 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* Botón Cerrar Global */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-3 bg-surface-highest hover:bg-error/20 text-on-surface-variant hover:text-error rounded-full transition-colors z-50"
      >
        <X size={24} />
      </button>

      <div className="relative flex flex-col items-center w-full max-w-md p-6">
        
        <div className="flex items-center gap-3 mb-8 text-accent-sage">
          <ScanLine size={24} className="animate-pulse" />
          <h2 className="font-utility text-lg font-medium tracking-widest uppercase">
            Escanea el Código
          </h2>
        </div>

        {/* CONTENEDOR DE LA CÁMARA */}
        <div className="relative w-full aspect-square bg-surface-base rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-surface-bright-edge/30">
          
          {isStarting && !hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-on-surface-variant">
              <Loader2 size={32} className="animate-spin mb-4 text-accent-navy" />
              <p className="font-utility text-sm uppercase tracking-widest">Iniciando Lente...</p>
            </div>
          )}

          {hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-error p-6 text-center">
              <X size={32} className="mb-4" />
              <p className="font-utility text-sm">No se pudo acceder a la cámara. Verifica los permisos de tu navegador.</p>
            </div>
          )}

          {/* Aquí es donde html5-qrcode inyecta el video */}
          <div id="reader" className="w-full h-full object-cover" />
          
          {/* Overlay Oscuro simulando Retícula (Diseño UI por encima del video) */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_0_200px_rgba(11,13,16,0.6)]" />
          
        </div>

        <p className="font-utility text-xs text-on-surface-variant text-center mt-8 max-w-xs leading-relaxed">
          Apunta la cámara de tu dispositivo hacia el código de barras del producto. La lectura será automática.
        </p>

      </div>
    </div>
  );
};