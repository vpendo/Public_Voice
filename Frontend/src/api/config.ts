/**
 * Backend API base URL. Use for auth and reports.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';

export function apiUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}
