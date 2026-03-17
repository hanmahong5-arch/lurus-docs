import { ref } from 'vue';
import type { Product, Update, PaginatedResponse } from '../../../../server/types';

const API_BASE = '/api';

function getAdminKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lurus-docs-admin-key');
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

function adminHeaders(): HeadersInit {
  const key = getAdminKey();
  return {
    'Content-Type': 'application/json',
    ...(key ? { Authorization: `Bearer ${key}` } : {}),
  };
}

// ─── Public API ─────────────────────────────────────────────

export function useProducts() {
  const products = ref<Product[]>([]);
  const loading = ref(false);

  async function fetch(status?: string) {
    loading.value = true;
    try {
      const qs = status ? `?status=${status}` : '';
      const res = await request<{ data: Product[] }>(`/products${qs}`);
      products.value = res.data;
    } finally {
      loading.value = false;
    }
  }

  return { products, loading, fetch };
}

export function useUpdates() {
  const updates = ref<Update[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const hasMore = ref(false);

  async function fetch(params?: {
    product?: string;
    type?: string;
    page?: number;
    limit?: number;
    since?: string;
  }) {
    loading.value = true;
    try {
      const qs = new URLSearchParams();
      if (params?.product) qs.set('product', params.product);
      if (params?.type) qs.set('type', params.type);
      if (params?.page) qs.set('page', String(params.page));
      if (params?.limit) qs.set('limit', String(params.limit));
      if (params?.since) qs.set('since', params.since);

      const query = qs.toString();
      const res = await request<PaginatedResponse<Update>>(`/updates${query ? '?' + query : ''}`);
      updates.value = res.data;
      total.value = res.total;
      hasMore.value = res.hasMore;
    } finally {
      loading.value = false;
    }
  }

  return { updates, total, loading, hasMore, fetch };
}

// ─── Admin API ──────────────────────────────────────────────

export function useAdminApi() {
  async function verifyKey(key: string): Promise<boolean> {
    try {
      const res = await window.fetch(`${API_BASE}/admin/updates?limit=1`, {
        headers: { Authorization: `Bearer ${key}` },
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  function saveKey(key: string) {
    localStorage.setItem('lurus-docs-admin-key', key);
  }

  function clearKey() {
    localStorage.removeItem('lurus-docs-admin-key');
  }

  async function fetchAdminUpdates(params?: {
    product?: string;
    type?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const qs = new URLSearchParams();
    if (params?.product) qs.set('product', params.product);
    if (params?.type) qs.set('type', params.type);
    if (params?.status) qs.set('status', params.status);
    if (params?.page) qs.set('page', String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));

    const query = qs.toString();
    return request<PaginatedResponse<Update>>(`/admin/updates${query ? '?' + query : ''}`, {
      headers: adminHeaders(),
    });
  }

  async function createUpdateApi(body: Record<string, unknown>) {
    return request<{ data: Update }>('/admin/updates', {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify(body),
    });
  }

  async function editUpdateApi(id: number, body: Record<string, unknown>) {
    return request<{ data: Update }>(`/admin/updates/${id}`, {
      method: 'PUT',
      headers: adminHeaders(),
      body: JSON.stringify(body),
    });
  }

  async function publishUpdateApi(id: number) {
    return request<{ data: Update }>(`/admin/updates/${id}/publish`, {
      method: 'POST',
      headers: adminHeaders(),
    });
  }

  async function archiveUpdateApi(id: number) {
    return request<{ data: Update }>(`/admin/updates/${id}/archive`, {
      method: 'POST',
      headers: adminHeaders(),
    });
  }

  async function deleteUpdateApi(id: number) {
    return request<{ success: boolean }>(`/admin/updates/${id}`, {
      method: 'DELETE',
      headers: adminHeaders(),
    });
  }

  async function fetchAdminProducts() {
    return request<{ data: Product[] }>('/admin/products', {
      headers: adminHeaders(),
    });
  }

  async function createProductApi(body: Record<string, unknown>) {
    return request<{ data: Product }>('/admin/products', {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify(body),
    });
  }

  async function editProductApi(id: string, body: Record<string, unknown>) {
    return request<{ data: Product }>(`/admin/products/${id}`, {
      method: 'PUT',
      headers: adminHeaders(),
      body: JSON.stringify(body),
    });
  }

  return {
    verifyKey,
    saveKey,
    clearKey,
    fetchAdminUpdates,
    createUpdateApi,
    editUpdateApi,
    publishUpdateApi,
    archiveUpdateApi,
    deleteUpdateApi,
    fetchAdminProducts,
    createProductApi,
    editProductApi,
  };
}
