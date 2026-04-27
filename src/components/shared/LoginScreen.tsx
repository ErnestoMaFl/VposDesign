import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, Delete, ArrowLeft } from 'lucide-react';
import { ProcessStepBar } from './ProcessStepBar';

const mockCashiers = [
  { id: '1', name: 'Ana López', role: 'Cajera Principal', avatar: 'AL' },
  { id: '2', name: 'Carlos Ruiz', role: 'Gerente de Turno', avatar: 'CR' },
  { id: '3', name: 'Mónica Gil', role: 'Cajera Auxiliar', avatar: 'MG' },
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

  // Efecto para auto-verificar cuando se ingresan 4 dígitos
  useEffect(() => {
    if (pin.length === 4) {
      setIsVerifying(true);
      setStep(2); // Paso: Verificando
      
      // Simulamos latencia de red de 1.5 segundos
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
      
      {/* Header simplificado del AuthShell */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="font-narrative text-4xl tracking-wide text-on-surface">VPOS</h1>
          <p className="font-utility text-xs text-on-surface-variant uppercase tracking-widest mt-2">
            Sucursal Centro
          </p>
        </div>
        
        {/* Etiqueta de seguridad obligatoria */}
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-low rounded-full">
          <ShieldCheck size={16} className="text-accent-navy" />
          <span className="font-utility text-xs text-on-surface-variant">
            Login estrictamente táctil por seguridad. La voz está desactivada.
          </span>
        </div>
      </div>

      <ProcessStepBar steps={loginSteps} currentStep={step} />

      <div className="flex-1 flex flex-col items-center justify-center mt-8">
        
        {/* PASO 1: SELECCIONAR CAJERO */}
        {step === 0 && (
          <div className="w-full grid grid-cols-3 gap-6 animate-fade-in">
            {mockCashiers.map((cashier) => (
              <button
                key={cashier.id}
                onClick={() => {
                  setSelectedCashier(cashier);
                  setStep(1);
                }}
                className="flex flex-col items-center p-8 bg-surface-low hover:bg-surface-container transition-all duration-300 rounded-2xl group"
              >
                <div className="w-20 h-20 rounded-full bg-surface-base flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent-sage/10 transition-all duration-300 shadow-inner">
                  <span className="font-narrative text-3xl text-on-surface-variant group-hover:text-accent-sage">
                    {cashier.avatar}
                  </span>
                </div>
                <span className="font-utility text-lg font-medium text-on-surface mb-1">
                  {cashier.name}
                </span>
                <span className="font-utility text-xs text-on-surface-variant uppercase tracking-widest">
                  {cashier.role}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* PASO 2: INGRESAR PIN */}
        {(step === 1 || step === 2) && selectedCashier && (
          <div className="flex flex-col items-center animate-fade-in w-full max-w-sm">
            
            {/* Botón de volver */}
            {!isVerifying && (
              <button 
                onClick={() => { setStep(0); setPin(''); setSelectedCashier(null); }}
                className="self-start flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors mb-8"
              >
                <ArrowLeft size={16} />
                <span className="font-utility text-sm">Cambiar usuario</span>
              </button>
            )}

            <div className="flex flex-col items-center mb-10">
              <span className="font-utility text-base text-on-surface mb-1">{selectedCashier.name}</span>
              <span className="font-utility text-xs text-on-surface-variant tracking-widest uppercase">
                {isVerifying ? 'Verificando credenciales...' : 'Ingresa tu PIN de 4 dígitos'}
              </span>
            </div>

            {/* Dots del PIN */}
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

            {/* Teclado Numérico (Keypad) */}
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
              <div className="h-16" /> {/* Espacio vacío */}
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