<script setup lang="ts">
import { computed } from 'vue'
import { glossary } from '../../data/glossary'

const props = defineProps<{
  /** Glossary key — must match a key in glossary.ts */
  t: string
}>()

const entry = computed(() => glossary[props.t])
</script>

<template>
  <span v-if="entry" class="term-trigger">
    <slot />
    <span class="term-tooltip" role="tooltip">
      <span class="term-tooltip-title">{{ props.t }}</span>
      <span class="term-tooltip-zh">{{ entry.zh }}</span>
      <span v-if="entry.en" class="term-tooltip-en">{{ entry.en }}</span>
      <a v-if="entry.see" :href="entry.see" class="term-tooltip-link">
        了解更多 →
      </a>
    </span>
  </span>
  <span v-else><slot /></span>
</template>

<style scoped>
.term-trigger {
  position: relative;
  display: inline;
  border-bottom: 1px dashed var(--vp-c-text-3);
  cursor: help;
}

.term-tooltip {
  display: none;
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  width: max-content;
  max-width: min(320px, 90vw);
  padding: 10px 14px;
  border-radius: 8px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  z-index: 100;
  font-size: 0.85rem;
  line-height: 1.5;
  text-align: left;
  pointer-events: auto;
}

/* Prevent tooltip from clipping viewport edges */
@media (max-width: 768px) {
  .term-tooltip {
    left: 0;
    transform: none;
    max-width: min(280px, 85vw);
  }
  .term-tooltip::after {
    left: 16px;
    transform: none;
  }
}

.term-trigger:hover .term-tooltip,
.term-trigger:focus-within .term-tooltip {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Arrow */
.term-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: var(--vp-c-border);
}

.term-tooltip-title {
  font-weight: 700;
  color: var(--vp-c-brand-1);
  font-size: 0.82rem;
}

.term-tooltip-zh {
  color: var(--vp-c-text-1);
}

.term-tooltip-en {
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
  font-style: italic;
}

.term-tooltip-link {
  color: var(--vp-c-brand-1);
  font-size: 0.8rem;
  text-decoration: none;
  margin-top: 2px;
}

.term-tooltip-link:hover {
  text-decoration: underline;
}

/* Dark mode box-shadow */
.dark .term-tooltip {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

</style>
