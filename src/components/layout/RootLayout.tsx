import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { SystemSidebar } from '@/components/layout/SystemSidebar';
import { useAppStore } from '@/store/useAppStore';

export const RootLayout = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Leemos la URL actual

  // Si la ruta es '/venta', mostramos los botones del POS. Si no, los del Home.
  const isPOS = location.pathname === '/venta';

  // 1. Traemos TODOS los estados de Zustand que el Sidebar necesita
  const { 
    connectionState, setConnectionState, 
    orbState, setOrbState,
    cartStatus, setCartStatus,
    stepMode, setStepMode,
    showAmbiguity, setShowAmbiguity,
    currentStep, setCurrentStep,
    setAppFlowState
  } = useAppStore();

  // 2. Mocks locales (los que antes vivían en App.tsx)
  const [mockError, setMockError] = useState(false);
  const [mockRecovery, setMockRecovery] = useState(false);

  return (
    <div className="flex w-full h-screen bg-surface-base overflow-hidden">
      
      {/* ¡SIDEBAR CORREGIDO! Ya tiene todos sus botones y variante dinámica */}
      <SystemSidebar 
        variant={isPOS ? 'pos' : 'home'}
        connectionState={connectionState} 
        setConnectionState={setConnectionState}
        orbState={orbState}
        setOrbState={setOrbState}
        cartStatus={cartStatus}
        setCartStatus={setCartStatus}
        stepMode={stepMode}
        setStepMode={setStepMode}
        showAmbiguity={showAmbiguity}
        setShowAmbiguity={setShowAmbiguity}
        onAdvanceStep={() => setCurrentStep((currentStep + 1) % 4)}
        onGoToLogin={() => setAppFlowState('login')}
        onGoToSplash={() => setAppFlowState('splash')}
        onGoToHome={() => navigate('/')}
        mockError={mockError}
        setMockError={setMockError}
        mockRecovery={mockRecovery}
        setMockRecovery={setMockRecovery}
      />
      
      <div className="flex-1 overflow-hidden relative">
        <Outlet /> 
      </div>
    </div>
  );
};  