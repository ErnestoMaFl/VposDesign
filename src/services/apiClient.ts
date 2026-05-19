/**
 * Cliente HTTP central del backend VPOS.
 *
 * Encapsula:
 * - Base URL desde env
 * - JSON serialization
 * - Manejo unificado de errores
 * - Timeout configurable
 *
 * En Fase 7 se inyectará el JWT aquí.
 */

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('VITE_API_URL no está definido en .env');
}

export class ApiError extends Error {
  public status: number;
  public code: string;
  public details?: unknown;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

interface RequestOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
}

async function request<TResponse>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body?: unknown,
  opts: RequestOptions = {}
): Promise<TResponse> {
  const { signal, timeoutMs = 8000 } = opts;

  // Combinamos el AbortSignal del caller con un timeout interno
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  if (signal) {
    signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      let detail: unknown = null;
      try {
        detail = await res.json();
      } catch {
        // No-op: el backend respondió sin JSON
      }
      throw new ApiError(
        res.status,
        `HTTP_${res.status}`,
        `Request a ${path} falló: ${res.statusText}`,
        detail
      );
    }

    // 204 No Content
    if (res.status === 204) {
      return undefined as TResponse;
    }

    return (await res.json()) as TResponse;
  } catch (err) {
    clearTimeout(timeoutId);

    if (err instanceof ApiError) throw err;

    if ((err as Error).name === 'AbortError') {
      throw new ApiError(0, 'ABORTED', 'Request cancelado o timeout');
    }

    throw new ApiError(
      0,
      'NETWORK_ERROR',
      `Fallo de red: ${(err as Error).message}`
    );
  }
}

export const apiClient = {
  get: <T>(path: string, opts?: RequestOptions) =>
    request<T>('GET', path, undefined, opts),
  post: <T>(path: string, body: unknown, opts?: RequestOptions) =>
    request<T>('POST', path, body, opts),
  put: <T>(path: string, body: unknown, opts?: RequestOptions) =>
    request<T>('PUT', path, body, opts),
  delete: <T>(path: string, opts?: RequestOptions) =>
    request<T>('DELETE', path, undefined, opts),
};