<script setup lang="ts">
import { ownership } from '../../data/org'
import { products } from '../../data/products'

function nameOf(id: string): string {
  return products.find((p) => p.id === id)?.name ?? id
}
</script>

<template>
  <div class="ownership-matrix">
    <table class="ownership-matrix__table">
      <thead>
        <tr>
          <th>产品</th>
          <th>Primary Owner</th>
          <th>Backup</th>
          <th>Escalation</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in ownership" :key="row.productId">
          <td><a :href="`/products/${row.productId}`">{{ nameOf(row.productId) }}</a></td>
          <td>{{ row.primary }}</td>
          <td :class="{ 'is-warn': row.backup === '⚠ 无' }">{{ row.backup }}</td>
          <td>{{ row.escalation }}</td>
        </tr>
      </tbody>
    </table>
    <p class="ownership-matrix__note">
      bus factor = 1 全公司高风险。每条 backup = ⚠ 无 都是潜在单点。优先补 P0 产品（platform / newapi / memx）。
    </p>
  </div>
</template>

<style scoped>
.ownership-matrix__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.ownership-matrix__table th,
.ownership-matrix__table td {
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  text-align: left;
}
.ownership-matrix__table th { background: var(--vp-c-bg-soft); font-weight: 600; }
.ownership-matrix__table td.is-warn { color: #b45309; font-weight: 600; }
.dark .ownership-matrix__table td.is-warn { color: #fbbf24; }
.ownership-matrix__note {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-top: 12px;
}
</style>
