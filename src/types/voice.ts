export type VoiceOrbState = 'standby' | 'listening' | 'processing' | 'success' | 'error' | 'ambiguity';
export type InterpretationStatus = 'success' | 'pending' | 'error';
export type SemanticType = 'add' | 'charge' | 'quantity' | 'product' | 'search' | 'unknown';

export interface InterpretationItem {
  id: string;
  text: string;
  status: InterpretationStatus;
  semanticType?: SemanticType;
}