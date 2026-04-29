<script setup lang="ts">
import Icon from '../Icon.vue'

interface Scenario {
  role: string
  title: string
  summary: string
  link: string
}

defineProps<{ scenarios: Scenario[]; title?: string }>()
</script>

<template>
  <section class="scenarios">
    <h2 v-if="title" class="scenarios__heading">{{ title }}</h2>
    <ol class="scenarios__list">
      <li v-for="s in scenarios" :key="s.title" class="scenarios__item">
        <span class="scenarios__role">{{ s.role }}</span>
        <a :href="s.link" class="scenarios__link">
          <strong class="scenarios__title">{{ s.title }}</strong>
          <span class="scenarios__summary">{{ s.summary }}</span>
          <Icon name="arrow-right" :size="18" class="scenarios__arrow" />
        </a>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.scenarios { margin: 32px 0; }
.scenarios__heading {
  font-size: var(--lurus-fs-xl);
  font-weight: 700;
  margin: 0 0 16px;
  border: none !important;
  padding: 0 !important;
}
.scenarios__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.scenarios__item {
  display: grid;
  grid-template-columns: 88px 1fr;
  align-items: stretch;
  gap: 12px;
}
.scenarios__role {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 8px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-radius: var(--lurus-radius-md);
  font-weight: 600;
  font-size: 0.88rem;
}
.scenarios__link {
  display: grid;
  grid-template-columns: 1fr 24px;
  column-gap: 16px;
  align-items: center;
  padding: 14px 18px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--lurus-radius-md);
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: border-color var(--lurus-dur-base), transform var(--lurus-dur-base);
}
.scenarios__link:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateX(2px);
  color: var(--vp-c-text-1);
}
.scenarios__title {
  display: block;
  font-weight: 700;
}
.scenarios__summary {
  display: block;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-top: 2px;
}
.scenarios__arrow {
  grid-column: 2;
  grid-row: 1 / span 2;
  align-self: center;
  color: var(--vp-c-text-3);
}
@media (max-width: 640px) {
  .scenarios__item { grid-template-columns: 1fr; }
  .scenarios__role { padding: 6px 12px; justify-content: flex-start; }
}
</style>
