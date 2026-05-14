export type MessageRole = 'user' | 'system';
export type ResultVariant = 'text' | 'table' | 'bar-chart';

// Estructura estricta para los gráficos de barras usando los tokens de tu tema
export interface ChartPayload {
  labels: string[];
  values: number[];
  accent: 'sage' | 'navy' | 'plum';
}

// Estructura estricta para el renderizado de tablas
export interface TablePayload {
  headers: string[];
  rows: (string | number)[][];
}

// Contrato de un mensaje en el historial del Analista de Datos
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string; // La transcripción del usuario o la narrativa de la IA
  timestamp: number;
  variant?: ResultVariant; // Determina qué componente UI renderizar
  payload?: ChartPayload | TablePayload | null; // Los datos crudos si es tabla o gráfica
}