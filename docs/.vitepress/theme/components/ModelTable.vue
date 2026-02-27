<script setup lang="ts">
import type { Model } from '../../data/models.data'

interface Props {
  vendor: string
  tagline?: string
  models: Model[]
}

defineProps<Props>()

const STATUS_LABEL: Record<string, string> = {
  available: '可用',
  beta: 'Beta',
  deprecated: '已停用',
}

const STATUS_TYPE: Record<string, 'tip' | 'warning' | 'danger'> = {
  available: 'tip',
  beta: 'warning',
  deprecated: 'danger',
}
</script>

<template>
  <div class="model-table-section">
    <h3 class="vendor-title">{{ vendor }}</h3>
    <p v-if="tagline" class="vendor-tagline">{{ tagline }}</p>

    <table class="model-table">
      <thead>
        <tr>
          <th>模型名称</th>
          <th>上下文长度</th>
          <th>定价</th>
          <th>状态</th>
          <th>标签</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="model in models" :key="model.id">
          <td><code>{{ model.id }}</code></td>
          <td>{{ model.context }}</td>
          <td>{{ model.price }}</td>
          <td>
            <Badge
              :text="STATUS_LABEL[model.status] ?? model.status"
              :type="STATUS_TYPE[model.status] ?? 'info'"
            />
          </td>
          <td>
            <span
              v-for="tag in model.tags"
              :key="tag"
              class="model-tag"
            >{{ tag }}</span>
          </td>
        </tr>
      </tbody>
    </table>
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
