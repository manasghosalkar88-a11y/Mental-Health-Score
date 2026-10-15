import type { StudentDataRequest, PredictionResponse, ApiConnectionState } from '../types/api';
import { PREDICT_ENDPOINT, OPENAPI_ENDPOINT } from '../utils/constants';

const REQUEST_TIMEOUT_MS = 10000; // 10 seconds timeout

/**
 * Checks connectivity to the local FastAPI backend.
 * Tries direct http://127.0.0.1:2200/openapi.json first, then falls back to /openapi.json proxy.
 */
export async function checkApiHealth(signal?: AbortSignal): Promise<ApiConnectionState> {
  const endpoints = ['/health', '/openapi.json', OPENAPI_ENDPOINT, 'http://localhost:2200/health'];

  for (const endpoint of endpoints) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    try {
      const combinedSignal = signal || controller.signal;
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: combinedSignal,
      });

      clearTimeout(timeoutId);
      if (response.ok) {
        return 'connected';
      }
    } catch {
      clearTimeout(timeoutId);
      // Try next endpoint
    }
  }

  return 'disconnected';
}

/**
 * Sends student demographic and lifestyle data to FastAPI /predict
 * Tries same-origin proxy first, then direct URLs.
 */
export async function predictMentalHealthScore(
  payload: StudentDataRequest,
  signal?: AbortSignal
): Promise<PredictionResponse> {
  const endpoints = ['/predict', PREDICT_ENDPOINT, 'http://localhost:2200/predict'];
  let lastError: Error | null = null;

  for (const endpoint of endpoints) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    if (signal) {
      signal.addEventListener('abort', () => controller.abort());
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `Server error (${response.status} ${response.statusText})`;
        try {
          const errorJson = await response.json();
          if (errorJson.detail) {
            if (Array.isArray(errorJson.detail)) {
              const fields = errorJson.detail
                .map((d: { loc?: string[]; msg?: string }) => `${d.loc?.slice(1).join('.') || 'field'}: ${d.msg}`)
                .join('; ');
              errorMessage = `Input validation error: ${fields}`;
            } else if (typeof errorJson.detail === 'string') {
              errorMessage = errorJson.detail;
            }
          }
        } catch {
          // Fallback to default message
        }
        throw new Error(errorMessage);
      }

      const data: PredictionResponse = await response.json();
      if (typeof data.predicted_Mental_Health_Score !== 'number') {
        throw new Error('Invalid response format: predicted_Mental_Health_Score is missing or not a number');
      }

      return data;
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof DOMException && err.name === 'AbortError') {
        lastError = new Error('Request timed out. Please check that the FastAPI backend is running at http://127.0.0.1:2200');
      } else if (err instanceof Error) {
        lastError = err;
        // If it's a server error from the backend (e.g. HTTP 422), do not retry next endpoint
        if (err.message.startsWith('Input validation error') || err.message.startsWith('Server error (4')) {
          throw err;
        }
      }
    }
  }

  if (lastError && !lastError.message.includes('fetch')) {
    throw lastError;
  }

  throw new Error('Cannot connect to FastAPI backend at http://127.0.0.1:2200. Please ensure the server is running using: uvicorn main:app --port 2200 --reload');
}
