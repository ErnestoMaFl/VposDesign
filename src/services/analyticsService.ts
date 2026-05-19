/**
 * Cliente HTTP para el endpoint POST /analytics/query.
 */

import { apiClient } from './apiClient';

const STORE_ID = import.meta.env.VITE_STORE_ID;

export type AnalyticsVariant = 'text' | 'table' | 'bar-chart';

export interface AnalyticsChartPayload {
  labels: string[];
  values: number[];
  accent: 'sage' | 'navy' | 'plum';
}

export interface AnalyticsTablePayload {
  headers: string[];
  rows: (string | number)[][];
}

export interface AnalyticsResponse {
  narrative: string;
  variant: AnalyticsVariant;
  payload: AnalyticsChartPayload | AnalyticsTablePayload | null;
  sql_generated: string | null;
  row_count: number;
  cached: boolean;
  latency_ms: number;
}

export const analyticsService = {
  query: (question: string, quick = false) =>
    apiClient.post<AnalyticsResponse>('/analytics/query', {
      question,
      store_id: STORE_ID,
      quick,
    }),
};