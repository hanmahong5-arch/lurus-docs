<script setup lang="ts">
import StatusBadge from './StatusBadge.vue'

export interface CardAction {
  label: string
  href: string
  primary?: boolean
  external?: boolean
}

type Status = 'live' | 'beta' | 'dev' | 'plan'

interface Props {
  name: string
  tagline: string
  icon?: string
  color?: string
  status?: Status
  actions: CardAction[]
}

withDefaults(defineProps<Props>(), {
  icon: '📦',
  color: '#C67B5C',
})
</script>

<template>
  <div class="action-card" :style="{ '--card-accent': color }">
    <div class="action-card__header">
      <span class="action-card__icon">{{ icon }}</span>
      <div class="action-card__meta">
        <span class="action-card__name">
          {{ name }}
          <StatusBadge v-if="status" :status="status" />
        </span>
        <span class="action-card__tagline">{{ tagline }}</span>
      </div>
    </div>
    <div class="action-card__buttons">
      <a
        v-for="action in actions"
        :key="action.label"
        :href="action.href"
        :target="action.external ? '_blank' : undefined"
        :rel="action.external ? 'noopener noreferrer' : undefined"
        class="action-card__btn"
        :class="action.primary ? 'action-card__btn--primary' : 'action-card__btn--alt'"
      >
        {{ action.label }}<span v-if="action.external" class="action-card__ext" aria-hidden="true">↗</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.action-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 22px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--card-accent);
}

.action-card:hover {
  border-color: var(--card-accent);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  transform: translateY(-3px);
}

.action-card__header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.action-card__icon {
  font-size: 1.6rem;
  line-height: 1;
  flex-shrink: 0;
}

.action-card__meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.action-card__name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.3;
  flex-wrap: wrap;
}

.action-card__tagline {
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  line-height: 1.4;
}

.action-card__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.action-card__btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  min-height: 36px;
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease;
  cursor: pointer;
}

.action-card__btn--primary {
  background-color: var(--card-accent);
  color: #fff;
  border: 1px solid transparent;
}

.action-card__btn--primary:hover {
  filter: brightness(1.1);
  text-decoration: none;
  color: #fff;
}

.action-card__btn--alt {
  background-color: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.action-card__btn--alt:hover {
  border-color: var(--card-accent);
  color: var(--card-accent);
  text-decoration: none;
  background-color: var(--vp-c-bg-soft);
}

.action-card__ext {
  font-size: 0.72rem;
  opacity: 0.75;
}

/* Mobile: larger touch targets */
@media (max-width: 768px) {
  .action-card__btn {
    min-height: 44px;
    padding: 10px 16px;
  }
}

@media (max-width: 480px) {
  .action-card__btn {
    flex: 1;
    justify-content: center;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .action-card {
    transition: none;
  }
  .action-card:hover {
    transform: none;
  }
}
</style>
