import { Outlet, useLocation } from 'react-router-dom';
import { SystemSidebar } from '@/components/layout/SystemSidebar';
import { wsVoiceClient } from '@/services/wsClient';
import { useEffect } from 'react';

export const RootLayout = () => {
  const location = useLocation(); // Leemos la URL actual

  // Si la ruta es '/venta', mostramos la variante POS del Sidebar. Si no, la del Home.
  const isPOS = location.pathname === '/venta';
  
  useEffect(() => {
    // 1. Iniciar conexión WS al montar la app
    wsVoiceClient.connect();

    // 2. Limpieza estricta al desmontar (evita memory leaks)
    return () => {
      wsVoiceClient.disconnect();
    };
  }, []);

  return (
    <div className="flex w-full h-screen bg-surface-base overflow-hidden">
      
      {/* El Sidebar ahora es totalmente independiente (Smart Component).
        Solo le decimos cómo debe verse según la URL en la que estemos.
      */}
      <SystemSidebar variant={isPOS ? 'pos' : 'home'} />
      
      <div className="flex-1 overflow-hidden relative">
        {/* Aquí es donde React Router inyecta la pantalla correspondiente 
          (HomeScreen, MainPOSScreen, InventarioScreen, etc.) 
          sin destruir el Sidebar ni el contenedor principal.
        */}
        <Outlet /> 
      </div>
      
    </div>
  );
};