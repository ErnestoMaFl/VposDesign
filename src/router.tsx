import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';

// 🔴 EAGER LOADING (Importaciones normales)
// Estas pantallas se empaquetan en el bundle principal. Cargan al instante.
import { HomeScreen } from '@/screens/HomeScreen';
import { MainPOSScreen } from '@/screens/MainPOSScreen';
import { ConsultasScreen } from '@/screens/ConsultasScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />, // Envolvemos todo en nuestro Layout persistente
    children: [
      {
        index: true,
        element: <HomeScreen /> // Eager
      },
      {
        path: 'venta',
        element: <MainPOSScreen /> // Eager: El cajero lo necesita SIN DELAY
      },
      {
        path: 'consultas',
        element: <ConsultasScreen /> // <-- Ahora carga al instante
      },
      {
        path: 'inventario',
        async lazy() {
          const { InventarioScreen } = await import('@/screens/InventarioScreen');
          return { Component: InventarioScreen };
        }
      },
      
      // 🟢 LAZY LOADING (Importaciones dinámicas nativas de RR v7)
      // Estas pantallas SOLO se descargan si el usuario entra a la ruta.
      /*
      
      {
        path: 'gestion',
        async lazy() {
          const { GestionScreen } = await import('@/screens/GestionScreen');
          return { Component: GestionScreen };
        }
      }*/
    ]
  }
]);