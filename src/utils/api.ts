const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export const getApiUrl = (endpoint: string): string => {
  if (!endpoint.startsWith('/')) endpoint = `/${endpoint}`;
  return API_BASE ? `${API_BASE.replace(/\/$/, '')}${endpoint}` : endpoint;
};

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = getApiUrl(endpoint);
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, { ...options, headers, credentials: 'include' });
  if (!res.ok) {
    const body = await res.text().catch(() => null);
    throw new Error(`API error ${res.status}: ${res.statusText} - ${body}`);
  }
  const contentType = res.headers.get('content-type') || '';
  return contentType.includes('application/json') ? res.json() : res.text();
}