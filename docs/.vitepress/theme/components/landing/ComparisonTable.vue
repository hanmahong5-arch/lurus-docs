<script setup lang="ts">
interface Row {
  dimension: string
  self: string
  alt: Record<string, string>
}

defineProps<{
  selfLabel: string
  competitors: string[]
  rows: Row[]
  title?: string
}>()
</script>

<template>
  <section class="comparison">
    <h2 v-if="title" class="comparison__heading">{{ title }}</h2>
    <div class="comparison__scroll">
      <table class="comparison__table">
        <thead>
          <tr>
            <th class="comparison__dim">维度</th>
            <th class="comparison__self">{{ selfLabel }}</th>
            <th v-for="c in competitors" :key="c">{{ c }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.dimension">
            <td class="comparison__dim"><strong>{{ r.dimension }}</strong></td>
            <td class="comparison__self">{{ r.self }}</td>
            <td v-for="c in competitors" :key="c">{{ r.alt[c] ?? '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.comparison { margin: 32px 0; }
.comparison__heading {
  font-size: var(--lurus-fs-xl);
  font-weight: 700;
  margin: 0 0 16px;
  border: none !important;
  padding: 0 !important;
}
.comparison__scroll {
  overflow-x: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--lurus-radius-lg);
}
.comparison__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 560px;
}
.comparison__table th,
.comparison__table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.9rem;
}
.comparison__table thead th {
  background: var(--vp-c-bg-soft);
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.comparison__table tbody tr:last-child td { border-bottom: none; }
.comparison__table tbody tr:hover { background: var(--vp-c-brand-soft); }
.comparison__self {
  color: var(--vp-c-brand-1);
  font-weight: 600;
  background: color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent);
}
.comparison__dim {
  width: 180px;
  color: var(--vp-c-text-2);
}
</style>
