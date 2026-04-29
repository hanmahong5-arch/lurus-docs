<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  hint?: string
  tone?: 'neutral' | 'good' | 'warn' | 'bad'
}>()
</script>

<template>
  <div class="kpi-tile" :class="`kpi-tile--${tone || 'neutral'}`">
    <div class="kpi-tile__value">{{ value }}</div>
    <div class="kpi-tile__label">{{ label }}</div>
    <div v-if="hint" class="kpi-tile__hint">{{ hint }}</div>
  </div>
</template>

<style scoped>
.kpi-tile {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 16px 18px;
  background: var(--vp-c-bg-soft);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.kpi-tile__value {
  font-size: 28px;
  font-weight: 700;
  font-feature-settings: 'tnum';
  color: var(--vp-c-text-1);
}
.kpi-tile__label {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.kpi-tile__hint {
  font-size: 11px;
  color: var(--vp-c-text-3);
  margin-top: 4px;
}
.kpi-tile--good { border-left: 3px solid #22c55e; }
.kpi-tile--warn { border-left: 3px solid #f59e0b; }
.kpi-tile--bad  { border-left: 3px solid #ef4444; }
.kpi-tile--neutral { border-left: 3px solid #C67B5C; }
</style>
