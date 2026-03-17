const API_BASE = '/api';
const STORAGE_KEY = 'lurus-docs-internal-key';

function getInternalKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
}

function internalHeaders(): HeadersInit {
  const key = getInternalKey();
  return key ? { Authorization: `Bearer ${key}` } : {};
}

export function useInternalAuth() {
  async function verifyKey(key: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/internal/verify`, {
        headers: { Authorization: `Bearer ${key}` },
      });
      return res.ok;
    } catch {
      return false;
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

  async function fetchContent(slug: string): Promise<{ content: string } | null> {
    try {
      const res = await fetch(`${API_BASE}/internal/content/${slug}`, {
        headers: internalHeaders(),
      });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  }

  return { verifyKey, saveKey, clearKey, hasKey, fetchContent };
}
