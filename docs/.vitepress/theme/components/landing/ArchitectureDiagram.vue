<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  chart: string
  title?: string
}>()

const container = ref<HTMLDivElement | null>(null)
const errored = ref(false)
const unique = `lurus-mermaid-${Math.random().toString(36).slice(2, 9)}`

async function render() {
  if (!container.value || typeof window === 'undefined') return
  try {
    const mermaid = (await import('mermaid')).default
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      fontFamily: 'var(--lurus-font-sans)',
      themeVariables: {
        primaryColor: '#F5E2D4',
        primaryTextColor: '#3D3530',
        primaryBorderColor: '#C67B5C',
        lineColor: '#B36A4A',
        secondaryColor: '#F0EAE4',
        tertiaryColor: '#E8E0D8',
      },
    })
    const { svg } = await mermaid.render(unique, props.chart)
    container.value.innerHTML = svg
    errored.value = false
  } catch {
    errored.value = true
  }
}

onMounted(render)
watch(() => props.chart, render)
</script>

<template>
  <figure class="arch-diagram">
    <figcaption v-if="title" class="arch-diagram__title">{{ title }}</figcaption>
    <div v-if="!errored" ref="container" class="arch-diagram__canvas" />
    <pre v-else class="arch-diagram__fallback"><code>{{ chart }}</code></pre>
  </figure>
</template>

<style scoped>
.arch-diagram {
  margin: 28px 0;
  padding: 24px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--lurus-radius-lg);
}
.arch-diagram__title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 12px;
  text-align: center;
}
.arch-diagram__canvas {
  display: flex;
  justify-content: center;
  overflow-x: auto;
}
.arch-diagram__canvas :deep(svg) {
  max-width: 100%;
  height: auto;
}
.arch-diagram__fallback {
  margin: 0;
  padding: 16px;
  font-size: 0.85rem;
  background: var(--vp-c-bg);
  border-radius: var(--lurus-radius-md);
  overflow-x: auto;
}
</style>
