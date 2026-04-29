<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Item {
  label: string
  value: string
  hint?: string
}

defineProps<{ items: Item[] }>()

const root = ref<HTMLElement | null>(null)
const visible = ref(false)

onMounted(() => {
  if (!root.value || typeof IntersectionObserver === 'undefined') {
    visible.value = true
    return
  }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        visible.value = true
        io.disconnect()
      }
    }
  }, { threshold: 0.3 })
  io.observe(root.value)
})
</script>

<template>
  <div ref="root" class="metric-stats" :class="{ 'is-visible': visible }">
    <div v-for="m in items" :key="m.label" class="metric-stats__item">
      <span class="metric-stats__value">{{ m.value }}</span>
      <span class="metric-stats__label">{{ m.label }}</span>
      <span v-if="m.hint" class="metric-stats__hint">{{ m.hint }}</span>
    </div>
  </div>
</template>

<style scoped>
.metric-stats {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 40px;
  padding: 32px 0 8px;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.6s var(--lurus-ease-out), transform 0.6s var(--lurus-ease-out);
}
.metric-stats.is-visible {
  opacity: 1;
  transform: translateY(0);
}
.metric-stats__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  position: relative;
}
.metric-stats__item + .metric-stats__item::before {
  content: '';
  position: absolute;
  left: -20px;
  top: 10%;
  height: 80%;
  width: 1px;
  background: var(--vp-c-divider);
}
.metric-stats__value {
  font-size: var(--lurus-fs-2xl);
  font-weight: 800;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
}
.metric-stats__label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--vp-c-text-3);
}
.metric-stats__hint {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  opacity: 0.8;
}
@media (max-width: 640px) {
  .metric-stats { gap: 20px; padding: 18px 0; }
  .metric-stats__item + .metric-stats__item::before { display: none; }
  .metric-stats__value { font-size: 1.6rem; }
}
</style>
