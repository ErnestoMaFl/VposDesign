// Eventos Cliente -> Servidor (C2S)
export type C2SEvent = 'TEXT_COMMAND' | 'AUDIO_STREAM' | 'INTERRUPT_SIGNAL' | 'PING';

// Eventos Servidor -> Cliente (S2C)
export type S2CEvent = 'CONNECTED' | 'PARTIAL_TRANSCRIPT' | 'CONTEXT_REFRESH' | 'COMMAND_RESULT' | 'ERROR' | 'PONG';

// Contrato estricto basado en tus modelos Pydantic
export interface WSMessage<T = any> {
  event: C2SEvent | S2CEvent;
  payload: T;
}