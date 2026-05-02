import React, { useState, useEffect } from 'react';
import { ShieldCheck, Delete, ArrowLeft } from 'lucide-react';
import { ProcessStepBar } from "@/components/ui/ProcessStepBar";

const mockCashiers = [
  { id: '1', name: 'Ana López', role: 'Cajera Principal', avatar: 'AL' },
  { id: '2', name: 'Carlos Ruiz', role: 'Gerente', avatar: 'CR' },
  { id: '3', name: 'Mónica Gil', role: 'Cajera Auxiliar', avatar: 'MG' },
  { id: '4', name: 'Roberto Díaz', role: 'Cajero', avatar: 'RD' },
  { id: '5', name: 'Elena Paz', role: 'Cajera FDS', avatar: 'EP' },
  { id: '6', name: 'Luis Soto', role: 'Supervisor', avatar: 'LS' },
];

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState(0);
  const [selectedCashier, setSelectedCashier] = useState<typeof mockCashiers[0] | null>(null);
  const [pin, setPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const loginSteps = ['Identificación', 'Código de Acceso', 'Verificando'];

  useEffect(() => {
    if (pin.length === 4) {
      setIsVerifying(true);
      setStep(2);
      setTimeout(() => {
        onLoginSuccess();
      }, 1500);
    }
  }, [pin, onLoginSuccess]);

  const handleKeypadPress = (num: string) => {
    if (pin.length < 4 && !isVerifying) {
      setPin(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0 && !isVerifying) {
      setPin(prev => prev.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      
      <div className="flex justify-between items-end mb-12">
        <div className="flex items-center gap-4">
          {/* Logo gigante, flotante y sin bordes */}
          <img 
            src="/logo.webp" 
            alt="VPOS Logo" 
            className="w-24 h-24 object-contain mix-blend-screen drop-shadow-[0_0_20px_rgba(77,122,99,0.4)] -ml-2" 
          />
          <div className="flex flex-col justify-center">
            <h1 className="font-narrative text-5xl tracking-wide text-on-surface leading-none mb-1">VPOS</h1>
            <p className="font-utility text-sm text-on-surface-variant uppercase tracking-widest">
              Sucursal Centro
            </p>
          </div>
        </div>
        
        {/* LEYENDA ORIGINAL RESTAURADA */}
        <div className="flex items-center gap-2 px-4 py-3 bg-surface-low rounded-xl border border-surface-bright-edge/20 shadow-sm">
          <ShieldCheck size={16} className="text-accent-navy" />
          <span className="font-utility text-xs text-on-surface-variant">
            El login es siempre táctil por seguridad. La voz se activa después de identificarte.
          </span>
        </div>
      </div>

      <ProcessStepBar steps={loginSteps} currentStep={step} />

      <div className="flex-1 flex flex-col items-center justify-center mt-8">
        
        {/* PASO 1: SELECCIONAR CAJERO (Grid de 6) */}
        {step === 0 && (
          <div className="w-full grid grid-cols-3 gap-6 animate-fade-in max-w-4xl">
            {mockCashiers.map((cashier) => (
              <button
                key={cashier.id}
                onClick={() => {
                  setSelectedCashier(cashier);
                  setStep(1);
                }}
                className="flex flex-col items-center p-8 bg-surface-low hover:bg-surface-container transition-all duration-300 rounded-2xl group border border-transparent hover:border-surface-bright-edge/30"
              >
                <div className="w-16 h-16 rounded-full bg-surface-base flex items-center justify-center mb-4 group-hover:bg-accent-sage/10 transition-colors shadow-inner">
                  <span className="font-narrative text-2xl text-on-surface-variant group-hover:text-accent-sage">
                    {cashier.avatar}
                  </span>
                </div>
                <span className="font-utility text-base font-medium text-on-surface mb-1">
                  {cashier.name}
                </span>
                <span className="font-utility text-[10px] text-on-surface-variant uppercase tracking-widest">
                  {cashier.role}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* PASO 2: INGRESAR PIN */}
        {(step > 0) && selectedCashier && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in-95 w-full max-w-sm">
            
            {!isVerifying && (
              <button 
                onClick={() => { setStep(0); setPin(''); setSelectedCashier(null); }}
                className="self-start flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors mb-8"
              >
                <ArrowLeft size={16} />
                <span className="font-utility text-sm">Cambiar usuario</span>
              </button>
            )}

            <div className="flex flex-col items-center mb-10 text-center">
              <span className="font-utility text-base text-on-surface mb-1">{selectedCashier.name}</span>
              <span className="font-utility text-xs text-on-surface-variant tracking-widest uppercase">
                {isVerifying ? 'Verificando credenciales...' : 'Ingresa tu PIN de 4 dígitos'}
              </span>
            </div>

            <div className="flex gap-6 mb-12">
              {[0, 1, 2, 3].map((index) => (
                <div 
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index < pin.length 
                      ? 'bg-accent-sage shadow-[0_0_15px_rgba(77,122,99,0.5)] scale-110' 
                      : 'bg-surface-container'
                  }`}
                />
              ))}
            </div>

            <div className={`grid grid-cols-3 gap-4 w-full transition-opacity duration-500 ${isVerifying ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleKeypadPress(num.toString())}
                  className="h-16 bg-surface-low hover:bg-surface-container active:bg-surface-high rounded-xl font-narrative text-2xl text-on-surface transition-colors"
                >
                  {num}
                </button>
              ))}
              <div className="h-16" />
              <button
                onClick={() => handleKeypadPress('0')}
                className="h-16 bg-surface-low hover:bg-surface-container active:bg-surface-high rounded-xl font-narrative text-2xl text-on-surface transition-colors"
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                className="h-16 flex items-center justify-center bg-surface-low hover:bg-[#9B4444]/20 hover:text-[#9B4444] rounded-xl text-on-surface-variant transition-colors"
              >
                <Delete size={20} />
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};