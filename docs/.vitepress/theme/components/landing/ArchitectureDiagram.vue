<script setup lang="ts">
/**
 * 客户端渲染的 mermaid 图。
 *
 * 修过的两个毛病（2026-09-10）：
 *
 * 1. **SSR 里什么都没有。** 原实现把 mermaid 产出的 svg 在 onMounted 里
 *    innerHTML 进一个空 div，而出错兜底的 <pre> 由 `errored`（初值 false）
 *    控制 —— 于是构建产物里 `.arch-diagram__canvas` 是个空标签，连图表源码
 *    都不在 HTML 里。爬虫、无 JS、JS 加载失败的读者，那一页就是没有图。
 *    现在改成：**先渲染文本版**（图表源码，本身可读），mermaid 成功之后再换成
 *    图形。首屏 HTML 因此总是带内容，JS 到位后观感不变。
 *
 * 2. **主题写死浅色。** themeVariables 是一组硬编码的暖色 hex，暗色模式下
 *    整张图仍然是浅底深字，跟页面打架。现在从 CSS 变量取色，并监听
 *    documentElement 的 class 变化重渲染。
 *
 * 新页面优先用 components/diagrams/ 下的静态 SVG（图形直接写在 template 里，
 * 不依赖 JS，也不用把 mermaid 打进包）；这个组件留给已有的存量图。
 */
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps<{
  chart: string
  title?: string
}>()

const container = ref<HTMLDivElement | null>(null)
/** mermaid 是否已成功渲染。SSR 与首次客户端渲染都为 false，两边标记一致，不会水合失配。 */
const rendered = ref(false)
const unique = `lurus-mermaid-${Math.random().toString(36).slice(2, 9)}`
let observer: MutationObserver | null = null

/** 从站点 CSS 变量取色，让 mermaid 跟随明暗，而不是钉死一套浅色值。 */
function themeVars() {
  const cs = getComputedStyle(document.documentElement)
  const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback
  return {
    primaryColor: v('--vp-c-bg-soft', '#E8E4D6'),
    primaryTextColor: v('--vp-c-text-1', '#14130F'),
    primaryBorderColor: v('--vp-c-brand-1', '#FF5D1F'),
    lineColor: v('--lurus-dg-muted', '#3D3B33'),
    secondaryColor: v('--vp-c-bg', '#F5F2E8'),
    tertiaryColor: v('--vp-c-bg-mute', '#D6D2C2'),
    background: v('--vp-c-bg', '#F5F2E8'),
    mainBkg: v('--vp-c-bg-soft', '#E8E4D6'),
    textColor: v('--vp-c-text-1', '#14130F'),
  }
}

async function render() {
  if (!container.value || typeof window === 'undefined') return
  try {
    const mermaid = (await import('mermaid')).default
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      fontFamily: 'var(--vp-font-family-base)',
      themeVariables: themeVars(),
    })
    const { svg } = await mermaid.render(unique, props.chart)
    container.value.innerHTML = svg
    rendered.value = true
  } catch {
    // 渲染失败就停在文本版 —— 那一版本身可读，比一个空框好
    rendered.value = false
  }
}

onMounted(() => {
  render()
  // 明暗切换时重渲染：mermaid 把颜色烤进产出的 svg，不会自己跟着 CSS 变
  observer = new MutationObserver((records) => {
    if (records.some((r) => r.attributeName === 'class')) render()
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})
onBeforeUnmount(() => observer?.disconnect())
watch(() => props.chart, render)
</script>

<template>
  <figure class="arch-diagram">
    <figcaption v-if="title" class="arch-diagram__title">{{ title }}</figcaption>
    <div v-show="rendered" ref="container" class="arch-diagram__canvas" />
    <pre v-if="!rendered" class="arch-diagram__fallback"><code>{{ chart }}</code></pre>
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
  line-height: 1.6;
  background: var(--vp-c-bg);
  border-radius: var(--lurus-radius-md);
  overflow-x: auto;
  color: var(--vp-c-text-2);
}
</style>
