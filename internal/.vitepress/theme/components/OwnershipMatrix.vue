<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ownership } from '../../data/org'
import { products, daysSince } from '../../data/products'

function nameOf(id: string): string {
  return products.find((p) => p.id === id)?.name ?? id
}
function lastReviewedOf(id: string): string | undefined {
  return products.find((p) => p.id === id)?.lastReviewed
}

const now = ref(new Date())
onMounted(() => { now.value = new Date() })

function reviewedCell(id: string): { text: string; stale: boolean } {
  const iso = lastReviewedOf(id)
  if (!iso) return { text: '—', stale: false }
  const d = daysSince(iso, now.value)
  if (d < 0) return { text: iso, stale: false }
  return { text: d === 0 ? '今日' : `${d} 天前`, stale: d > 30 }
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
          <th>上次复审</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in ownership" :key="row.productId">
          <td><a :href="`/products/${row.productId}`">{{ nameOf(row.productId) }}</a></td>
          <td>{{ row.primary }}</td>
          <td :class="{ 'is-warn': row.backup === '⚠ 无' }">{{ row.backup }}</td>
          <td>{{ row.escalation }}</td>
          <td :class="{ 'is-warn': reviewedCell(row.productId).stale }">{{ reviewedCell(row.productId).text }}</td>
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
