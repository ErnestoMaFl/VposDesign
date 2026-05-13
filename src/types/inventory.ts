export type InventoryMode = 'selection' | 'scanning' | 'summary';
export type ScanStatus = 'success' | 'pending' | 'error' | 'ambiguity';

export interface ScanLogItem {
  id: string;
  name: string;
  oldQuantity: number;
  newQuantity: number;
  delta: number;
  status: ScanStatus;
  rawTranscript: string; // Lo que el usuario "dictó"
}