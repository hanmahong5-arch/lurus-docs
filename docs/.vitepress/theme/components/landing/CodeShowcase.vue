<script setup lang="ts">
import { ref, computed } from 'vue'
import CopyButton from '../CopyButton.vue'

interface Tab {
  lang: string
  label: string
  code: string
}

const props = defineProps<{ tabs: Tab[]; title?: string }>()

const active = ref(0)
const current = computed(() => props.tabs[active.value])
</script>

<template>
  <section class="code-showcase">
    <div v-if="title" class="code-showcase__title">{{ title }}</div>
    <div class="code-showcase__head">
      <div class="code-showcase__tabs" role="tablist">
        <button
          v-for="(t, i) in tabs"
          :key="t.label"
          role="tab"
          :aria-selected="i === active"
          :class="['code-showcase__tab', { 'is-active': i === active }]"
          @click="active = i"
        >
          {{ t.label }}
        </button>
      </div>
      <CopyButton v-if="current" :content="current.code" />
    </div>
    <pre v-if="current" class="code-showcase__pre"><code>{{ current.code }}</code></pre>
  </section>
</template>

<style scoped>
.code-showcase {
  margin: 28px 0;
}
.code-showcase__title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 10px;
}
.code-showcase__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--vp-c-bg-mute);
  border: 1px solid var(--vp-c-divider);
  border-bottom: none;
  border-top-left-radius: var(--lurus-radius-md);
  border-top-right-radius: var(--lurus-radius-md);
}
.code-showcase__tabs {
  display: flex;
  gap: 4px;
}
.code-showcase__tab {
  padding: 4px 12px;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: transparent;
  border: none;
  border-radius: var(--lurus-radius-sm);
  cursor: pointer;
  transition: background var(--lurus-dur-fast), color var(--lurus-dur-fast);
}
.code-showcase__tab:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}
.code-showcase__tab.is-active {
  background: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}
.code-showcase__pre {
  margin: 0;
  padding: 16px;
  background: var(--vp-code-bg);
  border: 1px solid var(--vp-c-divider);
  border-top: none;
  border-bottom-left-radius: var(--lurus-radius-md);
  border-bottom-right-radius: var(--lurus-radius-md);
  overflow-x: auto;
  font-family: var(--lurus-font-mono);
  font-size: 0.86rem;
  line-height: 1.6;
  color: var(--vp-code-color);
}
.code-showcase__pre code {
  background: transparent;
  padding: 0;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
}
</style>
