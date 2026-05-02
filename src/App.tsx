import { useState } from 'react';
import { AuthShell } from '@/components/layout/AuthShell';
import { LoginScreen } from '@/screens/LoginScreen';
import { SplashScreen } from '@/screens/SplashScreen';
import { MainPOSScreen } from '@/screens/MainPOSScreen';

export default function App() {
  const [currentView, setCurrentView] = useState<'login' | 'splash' | 'app'>('login');
  
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
          onComplete={() => setCurrentView('app')} 
          simulateError={mockError}
          simulateRecovery={mockRecovery}
        />
      </AuthShell>
    );
  }

  return (
    <MainPOSScreen 
      onGoToLogin={() => setCurrentView('login')}
      onGoToSplash={() => setCurrentView('splash')}
      mockError={mockError}
      setMockError={setMockError}
      mockRecovery={mockRecovery}
      setMockRecovery={setMockRecovery}
    />
  );
}