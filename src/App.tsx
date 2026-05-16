import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { AuthShell } from '@/components/layout/AuthShell';
import { LoginScreen } from '@/screens/LoginScreen';
import { SplashScreen } from '@/screens/SplashScreen';
import { useAppStore } from '@/store/useAppStore'; // <-- NUEVO

export default function App() {
  // 👇 USAMOS ZUSTAND EN LUGAR DE useState
  const { appFlowState, setAppFlowState, mockError, mockRecovery } = useAppStore();
  
  if (appFlowState === 'login') {
    return (
      <AuthShell>
        <LoginScreen onLoginSuccess={() => setAppFlowState('splash')} />
      </AuthShell>
    );
  }

  if (appFlowState === 'splash') {
    return (
      <AuthShell>
        <SplashScreen 
          onComplete={() => setAppFlowState('ready')} 
          simulateError={mockError}
          simulateRecovery={mockRecovery}
        />
      </AuthShell>
    );
  }

  return <RouterProvider router={router} />;
}