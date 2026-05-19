import { useAppStore } from '@/store/useAppStore';
import type { WSMessage } from '@/types/websocket';

class WSClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectDelay: number = 1000;
  private maxReconnectDelay: number = 15000;
  private intentionalDisconnect: boolean = false;
  
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private pendingDisconnectTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Apunta al host de tu backend
    this.url = import.meta.env.VITE_WS_URL || 'ws://127.0.0.1:8000/api/v1/ws/voice';
  }

  public connect() {
    // Si había un disconnect programado (de un cleanup de StrictMode),
    // lo cancelamos: el componente volvió a montarse antes de cerrar.
    if (this.pendingDisconnectTimer) {
      clearTimeout(this.pendingDisconnectTimer);
      this.pendingDisconnectTimer = null;
      return; // La conexión sigue viva, no hace falta abrir otra
    }

    if (
      this.ws &&
      (this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    this.intentionalDisconnect = false;
    this.ws = new WebSocket(this.url);
    this.ws.onopen = this.handleOpen.bind(this);
    this.ws.onmessage = this.handleMessage.bind(this);
    this.ws.onclose = this.handleClose.bind(this);
    this.ws.onerror = this.handleError.bind(this);
  }


  public disconnect() {
    // En lugar de cerrar inmediatamente, damos 100ms de gracia.
    // Si en ese lapso vuelve un connect() (típico StrictMode), lo cancelamos.
    if (this.pendingDisconnectTimer) {
      clearTimeout(this.pendingDisconnectTimer);
    }

    this.pendingDisconnectTimer = setTimeout(() => {
      this.pendingDisconnectTimer = null;
      this.intentionalDisconnect = true;
      this.clearTimers();
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
      useAppStore.getState().setConnectionState('offline');
    }, 100);
  }

  public sendTextCommand(text: string, context?: string) {
    const storeId = import.meta.env.VITE_STORE_ID;
    this.sendMessage({
      event: 'TEXT_COMMAND',
      payload: { text, context, store_id: storeId },
    });
  }

  public sendInterrupt() {
    this.sendMessage({ event: 'INTERRUPT_SIGNAL', payload: {} });
  }

  // Uso interno para estandarizar el envío JSON
  private sendMessage(msg: WSMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    } else {
      console.warn('WS no está conectado. Mensaje descartado:', msg.event);
    }
  }

  // --- Manejadores de Eventos ---

  private handleOpen() {
    console.log('✅ Conexión WS establecida a nivel TCP.');
    // Aún no marcamos 'online' en Zustand. Esperamos el evento 'CONNECTED' de tu backend.
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data: WSMessage = JSON.parse(event.data);
      
      switch (data.event) {
        case 'CONNECTED':
          console.log(`🔌 Sesión WS iniciada: ${data.payload.connection_id}`);
          this.reconnectDelay = 1000; 
          useAppStore.getState().setConnectionState('online');
          this.startHeartbeat(); // Iniciamos los pings
          break;

        case 'COMMAND_RESULT':
          console.log('🎤 RESULTADO PIPELINE:', data.payload);
          // El payload.result es un VoicePipelineResult completo
          // En Fase 3 esto alimentará el slice de voice/cart. Por ahora solo loggeamos
          // y disparamos eventos en el store para que el Voice Panel los muestre.
          const result = data.payload?.result;
          if (result) {
            useAppStore.getState().setOrbState('success');
            setTimeout(() => useAppStore.getState().setOrbState('standby'), 1500);
            // Inyectar interpretaciones en el monitor de verdad
            useAppStore.getState().setInterpretations(
              result.items.map((item: any, idx: number) => ({
                id: String(idx),
                text: `${item.extracted.quantity}× ${item.extracted.product_query} (${item.search_status})`,
                status: item.search_status === 'winner' ? 'success' : item.search_status === 'ambiguous' ? 'pending' : 'error',
                semanticType: 'product',
              }))
            );
          }
          break;

        case 'PONG':
          // El backend respondió al keep-alive silenciosamente
          break;

        case 'ERROR':
          console.error('❌ Error del Servidor:', data.payload);
          break;

        default:
          console.log('Mensaje S2C no manejado:', data);
      }
    } catch (error) {
      console.error('Error parseando mensaje WS:', error);
    }
  }

  private handleClose(event: CloseEvent) {
    useAppStore.getState().setConnectionState('offline');
    this.clearTimers();
    
    if (this.intentionalDisconnect) {
      console.log('WS desconectado intencionalmente.');
      return;
    }

    console.warn(`Desconexión WS (Código: ${event.code}). Reconectando en ${this.reconnectDelay}ms...`);
    this.attemptReconnect();
  }

  private handleError(error: Event) {
    console.error('Error de red WS:', error);
  }

  // --- Utilidades ---

  private attemptReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect();
      this.reconnectDelay = Math.min(this.reconnectDelay * 1.5, this.maxReconnectDelay);
    }, this.reconnectDelay);
  }

  private startHeartbeat() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    // Envía un PING cada 30 segundos
    this.heartbeatInterval = setInterval(() => {
      this.sendMessage({ event: 'PING', payload: {} });
    }, 30000);
  }

  private clearTimers() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
  }
}
export const wsVoiceClient = new WSClient();

// Exponer el cliente a la consola del navegador SOLO en desarrollo para hacer pruebas
if (import.meta.env.DEV) {
  (window as any).wsVoiceClient = wsVoiceClient;
}