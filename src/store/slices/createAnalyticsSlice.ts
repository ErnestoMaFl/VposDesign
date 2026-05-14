import type { StateCreator } from 'zustand';
import type { StoreState } from '../useAppStore';
import type { ChatMessage, ChartPayload } from '@/types/analytics';

export interface AnalyticsSlice {
  chatHistory: ChatMessage[];
  isQuerying: boolean;
  isSpeaking: boolean; 
  
  activeQuickQuery: ChatMessage | null;
  isQuickQueryModalOpen: boolean;
  
  addMessage: (msg: ChatMessage) => void;
  clearHistory: () => void;
  setIsSpeaking: (status: boolean) => void;
  simulateQueryResponse: (question: string) => void;
  
  simulateQuickQuery: (question: string) => void;
  closeQuickQuery: () => void;
}

// --- GENERADOR ALEATORIO DE MOCKS ---
const generateRandomMockResponse = (idPrefix: string): ChatMessage => {
  const rand = Math.random();
  
  if (rand < 0.33) {
    // 33% Probabilidad: TABLA (Top 5 Real)
    return {
      id: `${idPrefix}-${Date.now()}`,
      role: 'system',
      content: 'Aquí tienes el top 5 exacto de productos más vendidos hoy:',
      timestamp: Date.now(),
      variant: 'table',
      payload: {
        headers: ['Producto', 'Vendidos', 'Ingreso'],
        rows: [
          ['Coca Cola 600ml', 47, 705.00],
          ['Sabritas Sal 45g', 22, 440.00],
          ['Azúcar Zulka 1kg', 15, 420.00],
          ['Agua Ciel 1L', 12, 144.00],
          ['Jabón Zote Rosa', 8, 160.00]
        ]
      }
    };
  } else if (rand < 0.66) {
    // 33% Probabilidad: TEXTO (Alertas)
    return {
      id: `${idPrefix}-${Date.now()}`,
      role: 'system',
      content: 'Alerta de inventario. Tienes 3 productos en estado crítico que se agotarán hoy si se mantiene el ritmo:\n\n• Azúcar Zulka (Quedan 0)\n• Aceite La Gloria (Quedan 2)\n• Huevos Bachoco (Queda 1/2 tapa)',
      timestamp: Date.now(),
      variant: 'text'
    };
  } else {
    // 33% Probabilidad: GRÁFICA DE BARRAS
    return {
      id: `${idPrefix}-${Date.now()}`,
      role: 'system',
      content: 'Tus ventas han mantenido una tendencia positiva. Aquí el desglose de los últimos 7 días:',
      timestamp: Date.now(),
      variant: 'bar-chart',
      payload: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        values: [1200, 1500, 900, 2100, 2800, 3500, 3100],
        accent: 'sage' // Usando la paleta del sistema
      }
    };
  }
};

export const createAnalyticsSlice: StateCreator<
  StoreState,
  [],
  [],
  AnalyticsSlice
> = (set, get) => ({
  chatHistory: [
    {
      id: 'welcome-1',
      role: 'system',
      content: 'Hola. Soy tu Analista de Datos. ¿Qué te gustaría saber de tu negocio hoy?',
      timestamp: Date.now(),
      variant: 'text'
    }
  ],
  isQuerying: false,
  isSpeaking: false,
  activeQuickQuery: null,
  isQuickQueryModalOpen: false,

  addMessage: (msg) => set((state) => ({ 
    chatHistory: [...state.chatHistory, msg] 
  })),

  clearHistory: () => set({ chatHistory: [] }),

  setIsSpeaking: (status) => set({ isSpeaking: status }),

  // [Flujo Completo / Oficina]
  simulateQueryResponse: (question: string) => {
    get().addMessage({ id: `user-${Date.now()}`, role: 'user', content: question, timestamp: Date.now() });
    set({ isQuerying: true });
    get().setOrbState('processing');

    setTimeout(() => {
      get().setOrbState('success');
      
      // Tiramos los dados y obtenemos una respuesta aleatoria
      const responseMessage = generateRandomMockResponse('sys');
      
      get().addMessage(responseMessage);
      set({ isQuerying: false, isSpeaking: true });
      
      setTimeout(() => get().setOrbState('standby'), 1000);
      setTimeout(() => set({ isSpeaking: false }), 3000);
    }, 1500);
  },

  // [Flujo Efímero / Mostrador]
  simulateQuickQuery: (question: string) => {
    set({ isQuickQueryModalOpen: true, activeQuickQuery: null, isQuerying: true });
    get().setOrbState('processing');

    setTimeout(() => {
      get().setOrbState('success');
      
      // Tiramos los dados y obtenemos una respuesta aleatoria
      const responseMessage = generateRandomMockResponse('quick');
      
      set({ 
        activeQuickQuery: responseMessage, 
        isQuerying: false 
      });

      setTimeout(() => get().setOrbState('standby'), 1500);
    }, 1500);
  },

  closeQuickQuery: () => {
    set({ isQuickQueryModalOpen: false });
    setTimeout(() => set({ activeQuickQuery: null }), 300);
    get().setOrbState('standby');
  }
});