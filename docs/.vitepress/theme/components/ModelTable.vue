<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import type { Model } from '../../data/models.data'
import { modelsTable } from '../../data/i18n'

interface Props {
  vendor: string
  tagline?: string
  models: Model[]
}

const props = defineProps<Props>()
const { lang } = useData()

// Locale overlay (null on the zh source → zh literals below win).
const tr = computed(() => modelsTable(lang.value))

const STATUS_ZH: Record<string, string> = {
  available: '可用',
  beta: 'Beta',
  deprecated: '已停用',
}
const STATUS_TYPE: Record<string, 'tip' | 'warning' | 'danger'> = {
  available: 'tip',
  beta: 'warning',
  deprecated: 'danger',
}
const HEADERS_ZH = { model: '模型名称', context: '上下文长度', price: '定价', status: '状态', tags: '标签' }

const headers = computed(() => tr.value?.headers ?? HEADERS_ZH)
// vendor / tagline overlays are keyed by the original zh vendor name (the prop).
const vendorName = computed(() => tr.value?.vendorNames[props.vendor] || props.vendor)
const vendorTagline = computed(() => (props.tagline ? tr.value?.taglines[props.vendor] || props.tagline : ''))
const statusLabel = (s: string) => tr.value?.status[s] || STATUS_ZH[s] || s
const tagLabel = (t: string) => tr.value?.tags[t] || t
</script>

<template>
  <div class="model-table-section">
    <h3 class="vendor-title">{{ vendorName }}</h3>
    <p v-if="vendorTagline" class="vendor-tagline">{{ vendorTagline }}</p>

    <div class="model-table-scroll">
    <table class="model-table">
      <thead>
        <tr>
          <th>{{ headers.model }}</th>
          <th>{{ headers.context }}</th>
          <th>{{ headers.price }}</th>
          <th>{{ headers.status }}</th>
          <th>{{ headers.tags }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="model in models" :key="model.id">
          <td><code>{{ model.id }}</code></td>
          <td>{{ model.context }}</td>
          <td>{{ model.price }}</td>
          <td>
            <Badge
              :text="statusLabel(model.status)"
              :type="STATUS_TYPE[model.status] ?? 'info'"
            />
          </td>
          <td>
            <span
              v-for="tag in model.tags"
              :key="tag"
              class="model-tag"
            >{{ tagLabel(tag) }}</span>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>
</template>

<style scoped>
.model-table-section {
  margin: 2rem 0;
}

.vendor-title {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
  color: var(--vp-c-text-1);
}

.vendor-tagline {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  margin: 0 0 0.75rem;
}

.model-table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.model-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.model-table th,
.model-table td {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid var(--vp-c-divider);
}

.model-table th {
  font-weight: 600;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg-soft);
  white-space: nowrap;
}

.model-table tr:last-child td {
  border-bottom: none;
}

.model-table tr:hover td {
  background-color: var(--vp-c-bg-soft);
}

.model-table code {
  font-size: 0.8rem;
  background: var(--vp-c-bg-mute);
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

.model-tag {
  display: inline-block;
  font-size: 0.72rem;
  padding: 1px 7px;
  margin: 2px 2px 2px 0;
  border-radius: 20px;
  background-color: var(--vp-c-bg-mute);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  white-space: nowrap;
}
</style>
