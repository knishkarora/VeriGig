/**
 * VeriGig Frontend API Client
 * Connects React UI to Fastify REST API with full credentials (session cookies) support
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export class ApiError extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Includes session cookie
  });

  const contentType = response.headers.get('content-type');
  let data: any = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `API Request failed with status ${response.status}`;
    throw new ApiError(errorMsg, response.status, data);
  }

  return data as T;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body?: any, options?: RequestInit) => 
    request<T>(endpoint, { 
      ...options, 
      method: 'POST', 
      body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
  patch: <T>(endpoint: string, body?: any, options?: RequestInit) => 
    request<T>(endpoint, { 
      ...options, 
      method: 'PATCH', 
      body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
  delete: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'DELETE' }),
};
