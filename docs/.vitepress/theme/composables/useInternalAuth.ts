const API_BASE = '/api';
const STORAGE_KEY = 'lurus-docs-internal-key';
const FETCH_TIMEOUT_MS = 10_000;

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: 'invalid' | 'network'; message: string };

export type ContentResult =
  | { content: string }
  | { error: 'auth' | 'network'; message: string };

function getInternalKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
}

function fetchWithTimeout(url: string, options?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

function internalHeaders(): HeadersInit {
  const key = getInternalKey();
  return key ? { Authorization: `Bearer ${key}` } : {};
}

export function useInternalAuth() {
  async function verifyKey(key: string): Promise<VerifyResult> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/internal/verify`, {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (res.ok) return { ok: true };
      if (res.status === 401) {
        return { ok: false, reason: 'invalid', message: 'Access key not recognized — check and try again' };
      }
      return { ok: false, reason: 'network', message: `Server error (${res.status}) — try again later` };
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        return { ok: false, reason: 'network', message: 'Connection timed out — try again' };
      }
      return { ok: false, reason: 'network', message: 'Unable to connect — check your network' };
    }
  }

  function saveKey(key: string) {
    localStorage.setItem(STORAGE_KEY, key);
  }

  function clearKey() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function hasKey(): boolean {
    return !!getInternalKey();
  }

  async function fetchContent(slug: string): Promise<ContentResult> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/internal/content/${slug}`, {
        headers: internalHeaders(),
      });
      if (res.ok) return await res.json();
      if (res.status === 401) {
        return { error: 'auth', message: 'Access key expired or invalid — please log in again' };
      }
      return { error: 'network', message: `Failed to load content (${res.status})` };
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        return { error: 'network', message: 'Connection timed out — try refreshing the page' };
      }
      return { error: 'network', message: 'Unable to connect — check your network' };
    }
  }

  return { verifyKey, saveKey, clearKey, hasKey, fetchContent };
}
