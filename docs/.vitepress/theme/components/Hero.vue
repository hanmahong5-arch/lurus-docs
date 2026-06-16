<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import CodeShowcase from './landing/CodeShowcase.vue'
import MetricStats from './landing/MetricStats.vue'
import { products } from '../../data/products'

const root = ref<HTMLElement | null>(null)
const tabs = products['lurus-api'].codeExamples || []
const metrics = [
  { label: '产品矩阵', value: '12' },
  { label: 'AI 模型接入', value: '50+' },
  { label: 'Kova 调度延迟', value: '3μs' },
  { label: '免费额度', value: '100 次/天' },
]

let frame = 0
function onMove(e: MouseEvent) {
  if (!root.value) return
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    if (!root.value) return
    const rect = root.value.getBoundingClientRect()
    const mx = ((e.clientX - rect.left) / rect.width) * 100
    const my = ((e.clientY - rect.top) / rect.height) * 100
    root.value.style.setProperty('--mx', `${mx}%`)
    root.value.style.setProperty('--my', `${my}%`)
  })
}
onMounted(() => root.value?.addEventListener('mousemove', onMove, { passive: true }))
onBeforeUnmount(() => root.value?.removeEventListener('mousemove', onMove))
</script>

<template>
  <section ref="root" class="lurus-hero">
    <div class="lurus-hero__bg" aria-hidden="true" />
    <div class="lurus-hero__noise" aria-hidden="true" />
    <div class="lurus-hero__content">
      <div class="lurus-hero__text">
        <span class="lurus-hero__name">Lurus</span>
        <h1 class="lurus-hero__title">AI 基础设施与产品平台</h1>
        <p class="lurus-hero__tagline">
          不是又一层 SaaS。<span class="lurus-hero__accent">执行、记忆、网关、计费</span>各自能用，组合更强 —
          像组合螺丝刀一样组合智能。
        </p>
        <div class="lurus-hero__actions">
          <a href="/guide/quickstart" class="lurus-hero__btn lurus-hero__btn--primary">3 分钟上手</a>
          <a href="/guide/get-api-key" class="lurus-hero__btn lurus-hero__btn--alt">获取 API Key</a>
          <a href="https://api.lurus.cn" target="_blank" rel="noopener noreferrer" class="lurus-hero__btn lurus-hero__btn--ghost">控制台 ↗</a>
        </div>
      </div>
      <div class="lurus-hero__code">
        <CodeShowcase v-if="tabs.length" :tabs="tabs" />
      </div>
    </div>
    <MetricStats :items="metrics" />
  </section>
</template>

<style scoped>
.lurus-hero {
  position: relative;
  padding: 48px 32px 32px;
  margin: -24px -24px 32px;
  border-radius: var(--lurus-radius-xl);
  overflow: hidden;
  isolation: isolate;
  --mx: 50%;
  --my: 50%;
}
.lurus-hero__bg {
  position: absolute;
  inset: 0;
  z-index: -2;
  background:
    radial-gradient(500px circle at var(--mx) var(--my),
      color-mix(in srgb, var(--lurus-brand-500) 22%, transparent), transparent 55%),
    radial-gradient(at 15% 25%, color-mix(in srgb, var(--lurus-brand-300) 30%, transparent), transparent 55%),
    radial-gradient(at 85% 75%, color-mix(in srgb, var(--lurus-color-kova) 16%, transparent), transparent 60%),
    var(--lurus-cream-50);
}
.lurus-hero__noise {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: 0.4;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/></svg>");
}
.dark .lurus-hero__noise { opacity: 0.2; }

.lurus-hero__content {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 40px;
  align-items: center;
}

.lurus-hero__name {
  display: inline-block;
  font-size: var(--lurus-fs-hero);
  font-weight: 800;
  letter-spacing: var(--lurus-tracking-tight);
  line-height: 1;
  background: linear-gradient(135deg, #C67B5C 0%, #E8A87C 50%, #C67B5C 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: lurus-shimmer var(--lurus-dur-shimmer) linear infinite;
}
.dark .lurus-hero__name {
  background: linear-gradient(135deg, #E8A87C 0%, #F0C09A 50%, #E8A87C 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
@keyframes lurus-shimmer {
  from { background-position: 0% center; }
  to   { background-position: 200% center; }
}
.lurus-hero__title {
  font-size: var(--lurus-fs-2xl);
  font-weight: 700;
  margin: 10px 0 12px;
  color: var(--vp-c-text-1);
  border: none !important;
  padding: 0 !important;
}
.lurus-hero__tagline {
  font-size: var(--lurus-fs-lg);
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin: 0 0 24px;
  max-width: 520px;
}
.lurus-hero__accent { color: var(--vp-c-brand-1); font-weight: 600; }

.lurus-hero__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.lurus-hero__btn {
  display: inline-flex;
  align-items: center;
  padding: 10px 22px;
  font-weight: 600;
  border-radius: var(--lurus-radius-pill);
  text-decoration: none;
  transition: transform var(--lurus-dur-fast), filter var(--lurus-dur-fast);
}
.lurus-hero__btn:hover { transform: var(--lurus-hover-rise); }
.lurus-hero__btn--primary {
  background: var(--vp-c-brand-1);
  color: #fff;
}
.lurus-hero__btn--primary:hover { color: #fff; filter: brightness(1.08); }
.lurus-hero__btn--alt {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}
.lurus-hero__btn--alt:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.lurus-hero__btn--ghost { color: var(--vp-c-text-2); }
.lurus-hero__btn--ghost:hover { color: var(--vp-c-brand-1); }

.lurus-hero__code {
  min-width: 0;
}

@media (max-width: 900px) {
  .lurus-hero__content { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .lurus-hero { padding: 32px 20px 24px; margin: -16px -16px 24px; }
  .lurus-hero__title { font-size: var(--lurus-fs-xl); }
}

@media (prefers-reduced-motion: reduce) {
  .lurus-hero__name { animation: none; }
}
</style>
