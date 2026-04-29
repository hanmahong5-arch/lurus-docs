<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useData } from 'vitepress'

const props = defineProps<{ chart: string; id?: string }>()

const container = ref<HTMLElement | null>(null)
const error = ref<string | null>(null)
const { isDark } = useData()

const renderId = props.id ?? `mermaid-${Math.random().toString(36).slice(2, 9)}`

async function render() {
  if (!container.value) return
  error.value = null
  try {
    const mermaid = (await import('mermaid')).default
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark.value ? 'dark' : 'default',
      securityLevel: 'loose',
      flowchart: { curve: 'basis', htmlLabels: true },
      themeVariables: {
        fontFamily: '-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif',
        primaryColor: '#fef0e8',
        primaryTextColor: isDark.value ? '#f4eee5' : '#3a2e26',
        primaryBorderColor: '#C67B5C',
        lineColor: '#C67B5C',
      },
    })
    const { svg } = await mermaid.render(renderId, props.chart)
    if (container.value) container.value.innerHTML = svg
  } catch (e) {
    error.value = (e as Error).message
    if (container.value) {
      container.value.innerHTML = `<pre style="white-space:pre-wrap;color:#b91c1c;padding:12px;">Mermaid 渲染失败:\n${error.value}\n\n--- chart ---\n${props.chart}</pre>`
    }
  }
}

onMounted(() => render())
watch([() => props.chart, isDark], async () => {
  await nextTick()
  await render()
})
</script>

<template>
  <div class="lurus-mermaid">
    <div ref="container"></div>
  </div>
</template>
