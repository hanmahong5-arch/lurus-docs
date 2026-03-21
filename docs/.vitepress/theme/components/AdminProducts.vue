<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useAdminApi, friendlyError } from '../composables/useApi'
import type { Product, ProductStatus } from '../../../../server/types'

const api = useAdminApi()

const products = ref<Product[]>([])
const loading = ref(false)
const loadError = ref('')
const actionError = ref('')
const saving = ref(false)

const showForm = ref(false)
const editing = ref<Product | null>(null)
const form = ref({
  id: '',
  name: '',
  icon: '',
  color: '#C67B5C',
  status: 'active' as ProductStatus,
  sort_order: 0,
})

const STATUSES: ProductStatus[] = ['planning', 'beta', 'active', 'maintenance', 'deprecated', 'sunset']

let isActive = true

async function loadProducts() {
  loading.value = true
  loadError.value = ''
  try {
    const res = await api.fetchAdminProducts()
    if (!isActive) return
    products.value = res.data
  } catch (e) {
    loadError.value = friendlyError(e)
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editing.value = null
  form.value = { id: '', name: '', icon: '', color: '#C67B5C', status: 'active', sort_order: 0 }
  showForm.value = true
}

function openEdit(p: Product) {
  editing.value = p
  form.value = {
    id: p.id,
    name: p.name,
    icon: p.icon,
    color: p.color,
    status: p.status,
    sort_order: p.sort_order,
  }
  showForm.value = true
}

async function saveForm() {
  if (!form.value.name) return
  actionError.value = ''
  saving.value = true

  try {
    if (editing.value) {
      await api.editProductApi(editing.value.id, {
        name: form.value.name,
        icon: form.value.icon,
        color: form.value.color,
        status: form.value.status,
        sort_order: form.value.sort_order,
      })
    } else {
      if (!form.value.id) return
      await api.createProductApi({
        id: form.value.id,
        name: form.value.name,
        icon: form.value.icon,
        color: form.value.color,
        status: form.value.status,
        sort_order: form.value.sort_order,
      })
    }
    showForm.value = false
    await loadProducts()
  } catch (e) {
    actionError.value = `Save failed: ${friendlyError(e)}`
  } finally {
    saving.value = false
  }
}

function statusColor(s: string) {
  const map: Record<string, string> = {
    planning: '#6b7280',
    beta: '#eab308',
    active: '#22c55e',
    maintenance: '#f97316',
    deprecated: '#ef4444',
    sunset: '#9ca3af',
  }
  return map[s] || '#6b7280'
}

watch(showForm, (open) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})

function onGlobalKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && showForm.value) {
    showForm.value = false
  }
}

onMounted(() => {
  loadProducts()
  document.addEventListener('keydown', onGlobalKeydown)
})
onUnmounted(() => {
  isActive = false
  document.removeEventListener('keydown', onGlobalKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="admin-products">
    <div class="section-header">
      <h2>Products Management</h2>
      <button class="btn-create" @click="openCreate">+ New Product</button>
    </div>

    <!-- Action feedback -->
    <div v-if="actionError" class="action-banner action-banner-error" @click="actionError = ''">
      {{ actionError }}
      <span class="banner-dismiss">dismiss</span>
    </div>

    <div v-if="showForm" class="form-overlay" @click.self="showForm = false">
      <div class="form-card">
        <h3>{{ editing ? 'Edit Product' : 'New Product' }}</h3>

        <label v-if="!editing" class="form-label">
          ID (slug)
          <input v-model="form.id" class="form-input" placeholder="e.g. lurus-newservice" />
        </label>

        <label class="form-label">
          Name
          <input v-model="form.name" class="form-input" placeholder="Product display name" />
        </label>

        <label class="form-label">
          Icon (lucide name)
          <input v-model="form.icon" class="form-input" placeholder="e.g. zap, shield, globe" />
        </label>

        <label class="form-label">
          Color
          <div style="display: flex; gap: 8px; align-items: center; margin-top: 4px;">
            <input type="color" v-model="form.color" />
            <input v-model="form.color" class="form-input" style="margin-top: 0" />
          </div>
        </label>

        <label class="form-label">
          Status
          <select v-model="form.status" class="form-input">
            <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
          </select>
        </label>

        <label class="form-label">
          Sort Order
          <input v-model.number="form.sort_order" type="number" class="form-input" />
        </label>

        <div class="form-actions">
          <button class="btn-cancel" @click="showForm = false">Cancel</button>
          <button class="btn-save" @click="saveForm" :disabled="!form.name || (!editing && !form.id) || saving">
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-text">Loading...</div>

    <div v-else-if="loadError" class="error-text">
      <p>{{ loadError }}</p>
      <button class="retry-btn" @click="loadProducts">Retry</button>
    </div>

    <table v-else-if="products.length > 0" class="products-table">
      <thead>
        <tr>
          <th>Order</th>
          <th>ID</th>
          <th>Name</th>
          <th>Color</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in products" :key="p.id">
          <td>{{ p.sort_order }}</td>
          <td><code>{{ p.id }}</code></td>
          <td>{{ p.name }}</td>
          <td>
            <span class="color-swatch" :style="{ background: p.color }" />
            {{ p.color }}
          </td>
          <td>
            <span class="status-dot" :style="{ background: statusColor(p.status) }" />
            {{ p.status }}
          </td>
          <td>
            <button class="action-btn" @click="openEdit(p)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="empty-text">No products yet. Click "+ New Product" to create one.</div>
  </div>
</template>

<style scoped>
.admin-products { margin-top: 8px; }

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.section-header h2 { margin: 0; font-size: 20px; }

.btn-create {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.btn-create:hover { background: var(--vp-button-brand-hover-bg); }

.products-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.products-table th {
  text-align: left;
  padding: 8px 10px;
  border-bottom: 2px solid var(--vp-c-divider);
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
}
.products-table td {
  padding: 10px;
  border-bottom: 1px solid var(--vp-c-divider);
  vertical-align: middle;
}

.color-swatch {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 3px;
  vertical-align: middle;
  margin-right: 4px;
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 4px;
}

.action-btn {
  padding: 3px 8px;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 12px;
  cursor: pointer;
}
.action-btn:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }

/* Shared form styles */
.form-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.form-card {
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 28px;
  border-radius: 12px;
  background: var(--vp-c-bg);
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}
.form-card h3 { margin: 0 0 20px; font-size: 18px; }
.form-label {
  display: block;
  margin-bottom: 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}
.form-input {
  display: block;
  width: 100%;
  margin-top: 4px;
  padding: 8px 10px;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 14px;
  box-sizing: border-box;
}
.form-input:focus { border-color: var(--vp-c-brand-1); outline: none; }
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
}
.btn-cancel {
  padding: 8px 16px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 13px;
  cursor: pointer;
}
.btn-save {
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.btn-save:disabled { opacity: 0.5; cursor: not-allowed; }

.action-banner {
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.action-banner-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}
.banner-dismiss {
  font-size: 12px;
  opacity: 0.7;
  text-decoration: underline;
}

.loading-text, .empty-text, .error-text {
  text-align: center;
  padding: 32px 0;
  color: var(--vp-c-text-3);
  font-size: 14px;
}
.error-text p {
  margin: 0 0 12px;
  color: var(--vp-c-text-2);
}
.retry-btn {
  padding: 6px 16px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  cursor: pointer;
}
.retry-btn:hover {
  background: var(--vp-c-brand-soft);
}
</style>
