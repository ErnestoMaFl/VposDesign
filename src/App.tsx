import { useState } from 'react';
import { AuthShell } from '@/components/layout/AuthShell';
import { LoginScreen } from '@/screens/LoginScreen';
import { SplashScreen } from '@/screens/SplashScreen';
import { MainPOSScreen } from '@/screens/MainPOSScreen';
import { HomeScreen } from '@/screens/HomeScreen';

type ViewState = 'login' | 'splash' | 'home' | 'venta' | 'inventario' | 'consultas' | 'gestion';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('login');
  
  const [mockError, setMockError] = useState(false);
  const [mockRecovery, setMockRecovery] = useState(false);

  if (currentView === 'login') {
    return (
      <AuthShell>
        <LoginScreen onLoginSuccess={() => setCurrentView('splash')} />
      </AuthShell>
    );
  }

  if (currentView === 'splash') {
    return (
      <AuthShell>
        <SplashScreen 
          onComplete={() => setCurrentView('home')} 
          simulateError={mockError}
          simulateRecovery={mockRecovery}
        />
      </AuthShell>
    );
  }

  if (currentView === 'home') {
    return (
      <HomeScreen 
        onNavigate={(module) => setCurrentView(module)}
        userRole="Dueño"
      />
    );
  }

  if (currentView === 'venta') {
    return (
      <MainPOSScreen 
        onGoToLogin={() => setCurrentView('login')}
        onGoToSplash={() => setCurrentView('splash')}
        onGoToHome={() => setCurrentView('home')}
        mockError={mockError}
        setMockError={setMockError}
        mockRecovery={mockRecovery}
        setMockRecovery={setMockRecovery}
      />
    );
  }

  return (
    <div className="flex w-full h-screen items-center justify-center bg-surface-base text-on-surface">
      <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="font-narrative text-5xl mb-4 text-on-surface opacity-90 capitalize">
          Módulo: {currentView}
        </h2>
        <p className="font-utility text-sm tracking-widest uppercase text-on-surface-variant mb-8">
          Esta pantalla está en construcción
        </p>
        <button 
          onClick={() => setCurrentView('home')}
          className="px-8 py-3 bg-surface-low hover:bg-surface-container border border-surface-bright-edge/30 transition-colors rounded-full text-sm font-utility text-on-surface"
        >
          Volver al Tablero Principal
        </button>
      </div>
    </div>
  );
}