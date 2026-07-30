/**
 * Thin fetch wrapper. Every service in `services/api` goes through this
 * client so that connecting a real backend later is a one-file change:
 * flip `USE_MOCK_DATA` to false and implement the fetch calls per endpoint.
 */
import { STORAGE_KEYS } from "@/constants/app.constants";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";

/** Toggle this once a real backend exists. Every *.service.ts checks it. */
export const USE_MOCK_DATA = false;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Shape every Trustix API response is wrapped in. */
interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
  meta?: unknown;
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Set true to get back the raw envelope (data + meta) instead of just `data`. */
  raw?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem(STORAGE_KEYS.authToken);
  const { raw, ...init } = options;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    });
  } catch {
    throw new ApiError("Unable to reach the server. Is the backend running?", 0);
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message = (payload as ApiEnvelope<unknown> | null)?.error
      ?? (payload as ApiEnvelope<unknown> | null)?.message
      ?? `Request to ${path} failed`;
    throw new ApiError(message, response.status);
  }

  if (!payload) return undefined as T;
  return (raw ? payload : (payload as ApiEnvelope<T>).data) as T;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "DELETE" }),
};
