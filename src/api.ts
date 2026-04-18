/**
 * Browser calls use same-origin paths in dev (Vite proxies /api → backend).
 * Set VITE_API_URL in production when the API is on another origin (no trailing slash).
 */
const raw = import.meta.env.VITE_API_URL?.trim() ?? ''

export const API_BASE = raw.replace(/\/$/, '')

export function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE}${p}`
}
