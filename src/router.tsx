import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';

// 🔴 EAGER LOADING (Importaciones normales)
// Estas pantallas se empaquetan en el bundle principal. Cargan al instante.
import { HomeScreen } from '@/screens/HomeScreen';
import { MainPOSScreen } from '@/screens/MainPOSScreen';

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
        path: 'consultas',
        async lazy() {
          const { ConsultasScreen } = await import('@/screens/ConsultasScreen');
          return { Component: ConsultasScreen };
        }
      },
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