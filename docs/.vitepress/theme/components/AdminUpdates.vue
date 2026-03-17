<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAdminApi } from '../composables/useApi'
import AdminEditor from './AdminEditor.vue'
import type { Update, Product } from '../../../../server/types'

const api = useAdminApi()

const updates = ref<Update[]>([])
const products = ref<Product[]>([])
const loading = ref(false)
const total = ref(0)
const page = ref(1)
const filterStatus = ref('')
const filterProduct = ref('')

// Form state
const showForm = ref(false)
const editing = ref<Update | null>(null)
const form = ref({
  product_id: '',
  title: '',
  content: '',
  type: 'feature' as string,
  version: '',
  is_major: false,
})

const UPDATE_TYPES = [
  'feature', 'improvement', 'bugfix', 'security', 'deprecation', 'launch', 'sunset',
]

async function loadData() {
  loading.value = true
  try {
    const [updatesRes, productsRes] = await Promise.all([
      api.fetchAdminUpdates({
        status: filterStatus.value || undefined,
        product: filterProduct.value || undefined,
        page: page.value,
        limit: 20,
      }),
      api.fetchAdminProducts(),
    ])
    updates.value = updatesRes.data
    total.value = updatesRes.total
    products.value = productsRes.data
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editing.value = null
  form.value = { product_id: '', title: '', content: '', type: 'feature', version: '', is_major: false }
  showForm.value = true
}

function openEdit(u: Update) {
  editing.value = u
  form.value = {
    product_id: u.product_id,
    title: u.title,
    content: u.content,
    type: u.type,
    version: u.version || '',
    is_major: !!u.is_major,
  }
  showForm.value = true
}

async function saveForm() {
  if (!form.value.product_id || !form.value.title) return

  if (editing.value) {
    await api.editUpdateApi(editing.value.id, {
      product_id: form.value.product_id,
      title: form.value.title,
      content: form.value.content,
      type: form.value.type,
      version: form.value.version || undefined,
      is_major: form.value.is_major,
    })
  } else {
    await api.createUpdateApi({
      product_id: form.value.product_id,
      title: form.value.title,
      content: form.value.content,
      type: form.value.type,
      version: form.value.version || undefined,
      is_major: form.value.is_major,
    })
  }

  showForm.value = false
  await loadData()
}

async function publishAction(id: number) {
  await api.publishUpdateApi(id)
  await loadData()
}

async function archiveAction(id: number) {
  await api.archiveUpdateApi(id)
  await loadData()
}

async function deleteAction(id: number) {
  if (!confirm('Delete this draft update?')) return
  await api.deleteUpdateApi(id)
  await loadData()
}

function statusBadge(s: string) {
  const map: Record<string, string> = {
    draft: 'badge-draft',
    published: 'badge-published',
    archived: 'badge-archived',
  }
  return map[s] || ''
}

watch([filterStatus, filterProduct], () => {
  page.value = 1
  loadData()
})

onMounted(loadData)
</script>

<template>
  <div class="admin-updates">
    <div class="section-header">
      <h2>Updates Management</h2>
      <button class="btn-create" @click="openCreate">+ New Update</button>
    </div>

    <div class="filters-row">
      <select v-model="filterStatus" class="filter-select">
        <option value="">All Status</option>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
      </select>
      <select v-model="filterProduct" class="filter-select">
        <option value="">All Products</option>
        <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option>
      </select>
      <span class="total-count">{{ total }} total</span>
    </div>

    <!-- Form Modal -->
    <div v-if="showForm" class="form-overlay">
      <div class="form-card">
        <h3>{{ editing ? 'Edit Update' : 'New Update' }}</h3>

        <label class="form-label">
          Product
          <select v-model="form.product_id" class="form-input">
            <option value="" disabled>Select product...</option>
            <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </label>

        <label class="form-label">
          Title
          <input v-model="form.title" class="form-input" placeholder="Update title" />
        </label>

        <label class="form-label">
          Type
          <select v-model="form.type" class="form-input">
            <option v-for="t in UPDATE_TYPES" :key="t" :value="t">{{ t }}</option>
          </select>
        </label>

        <label class="form-label">
          Version
          <input v-model="form.version" class="form-input" placeholder="e.g. v1.2.0 or main-abc1234" />
        </label>

        <label class="form-label form-checkbox">
          <input type="checkbox" v-model="form.is_major" />
          Major update (highlighted)
        </label>

        <div class="form-label">
          Content
          <AdminEditor v-model="form.content" />
        </div>

        <div class="form-actions">
          <button class="btn-cancel" @click="showForm = false">Cancel</button>
          <button class="btn-save" @click="saveForm" :disabled="!form.product_id || !form.title">Save</button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div v-if="loading" class="loading-text">Loading...</div>

    <table v-else-if="updates.length > 0" class="updates-table">
      <thead>
        <tr>
          <th>Status</th>
          <th>Product</th>
          <th>Title</th>
          <th>Type</th>
          <th>Source</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in updates" :key="u.id">
          <td><span class="status-badge" :class="statusBadge(u.status)">{{ u.status }}</span></td>
          <td>{{ products.find(p => p.id === u.product_id)?.name || u.product_id }}</td>
          <td class="td-title">{{ u.title }}</td>
          <td>{{ u.type }}</td>
          <td>{{ u.source }}</td>
          <td class="td-actions">
            <button class="action-btn" @click="openEdit(u)" title="Edit">Edit</button>
            <button
              v-if="u.status === 'draft'"
              class="action-btn action-publish"
              @click="publishAction(u.id)"
              title="Publish"
            >Publish</button>
            <button
              v-if="u.status === 'published'"
              class="action-btn action-archive"
              @click="archiveAction(u.id)"
              title="Archive"
            >Archive</button>
            <button
              v-if="u.status === 'draft'"
              class="action-btn action-delete"
              @click="deleteAction(u.id)"
              title="Delete"
            >Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="empty-text">No updates found.</div>
  </div>
</template>

<style scoped>
.admin-updates { margin-top: 8px; }

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.section-header h2 {
  margin: 0;
  font-size: 20px;
}

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

.filters-row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}
.filter-select {
  padding: 6px 10px;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 13px;
}
.total-count {
  margin-left: auto;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

.updates-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.updates-table th {
  text-align: left;
  padding: 8px 10px;
  border-bottom: 2px solid var(--vp-c-divider);
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
}
.updates-table td {
  padding: 10px;
  border-bottom: 1px solid var(--vp-c-divider);
  vertical-align: middle;
}
.td-title {
  font-weight: 500;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.td-actions {
  white-space: nowrap;
}

.status-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}
.badge-draft     { background: rgba(234,179,8,0.15); color: #eab308; }
.badge-published { background: rgba(34,197,94,0.15); color: #22c55e; }
.badge-archived  { background: rgba(107,114,128,0.15); color: #6b7280; }

.action-btn {
  padding: 3px 8px;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 12px;
  cursor: pointer;
  margin-right: 4px;
}
.action-btn:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.action-publish { color: #22c55e; border-color: #22c55e; }
.action-publish:hover { background: rgba(34,197,94,0.1); }
.action-archive { color: #6b7280; }
.action-delete { color: #ef4444; border-color: #ef4444; }
.action-delete:hover { background: rgba(239,68,68,0.1); }

/* Form overlay */
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 28px;
  border-radius: 12px;
  background: var(--vp-c-bg);
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}
.form-card h3 {
  margin: 0 0 20px;
  font-size: 18px;
}
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
.form-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-direction: row;
}
.form-checkbox input[type="checkbox"] { margin: 0; }

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

.loading-text, .empty-text {
  text-align: center;
  padding: 32px 0;
  color: var(--vp-c-text-3);
  font-size: 14px;
}
</style>
