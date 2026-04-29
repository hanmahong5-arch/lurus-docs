<script setup lang="ts">
import Icon from '../Icon.vue'

interface Highlight {
  title: string
  body: string
  icon?: string
}

defineProps<{
  items: Highlight[]
  accent?: string
  title?: string
}>()
</script>

<template>
  <section class="cap-grid" :style="{ '--cap-accent': accent || 'var(--vp-c-brand-1)' }">
    <h2 v-if="title" class="cap-grid__heading">{{ title }}</h2>
    <div class="cap-grid__items">
      <div v-for="h in items" :key="h.title" class="cap-card">
        <span class="cap-card__icon">
          <Icon :name="h.icon || 'sparkles'" :size="22" />
        </span>
        <h3 class="cap-card__title">{{ h.title }}</h3>
        <p class="cap-card__body">{{ h.body }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cap-grid {
  margin: 32px 0;
}
.cap-grid__heading {
  font-size: var(--lurus-fs-xl);
  font-weight: 700;
  margin: 0 0 16px;
  border: none !important;
  padding: 0 !important;
}
.cap-grid__items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
.cap-card {
  padding: 20px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--lurus-radius-lg);
  transition: transform var(--lurus-dur-base), border-color var(--lurus-dur-base), box-shadow var(--lurus-dur-base);
}
.cap-card:hover {
  transform: var(--lurus-hover-rise);
  border-color: var(--cap-accent);
  box-shadow: var(--lurus-shadow-2);
}
.cap-card__icon {
  display: inline-flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border-radius: var(--lurus-radius-md);
  background: color-mix(in srgb, var(--cap-accent) 14%, transparent);
  color: var(--cap-accent);
  margin-bottom: 12px;
}
.cap-card__title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 6px;
  color: var(--vp-c-text-1);
  border: none !important;
  padding: 0 !important;
}
.cap-card__body {
  font-size: 0.88rem;
  line-height: 1.55;
  color: var(--vp-c-text-2);
  margin: 0;
}
</style>
