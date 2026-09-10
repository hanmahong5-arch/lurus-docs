<script setup lang="ts">
/**
 * 静态架构图外壳。
 *
 * 与 landing/ArchitectureDiagram.vue 的区别是**它在 SSR 里就有内容**：
 * 那个组件在 onMounted 里跑 mermaid 再 innerHTML 注入，构建产物里
 * `.arch-diagram__canvas` 是个空 div（实测 dist/developer/architecture.html
 * 里没有任何 mermaid 产出的 svg，连出错兜底的 <pre> 都不在），
 * 于是爬虫、无 JS、以及 JS 加载失败时那一页是没有图的。
 *
 * 这里的 SVG 直接写在 template 里，属于首屏 HTML；颜色接 diagrams.css 的
 * `--lurus-dg-*`，一份图跟随明暗。
 */
defineProps<{
  /** 图注。写这张图在讲什么，不要写「架构图」。 */
  caption?: string
  /** 出处标注，例如 `2b-svc-kova · src/queue/` */
  source?: string
}>()
</script>

<template>
  <figure class="lurus-dg">
    <div class="lurus-dg__canvas">
      <slot />
    </div>
    <figcaption v-if="caption || source || $slots.caption" class="lurus-dg__cap">
      <span v-if="caption" class="lurus-dg__cap-text">{{ caption }}</span>
      <slot name="caption" />
      <code v-if="source" class="lurus-dg__src">{{ source }}</code>
    </figcaption>
    <details v-if="$slots.fallback" class="lurus-dg__fallback">
      <summary>文本版（无障碍 / 复制用）</summary>
      <slot name="fallback" />
    </details>
  </figure>
</template>

<style scoped>
.lurus-dg {
  margin: 28px 0;
}
/* 图比正文宽 —— VitePress 的正文栏是 688px，而这些图的 viewBox 是 960 宽，
 * 塞进正文栏会整体缩到 72%，9px 的子标签实际只剩 6.5px，糊到读不出来。
 * 在有余量的视口上让图向两侧各借一点空间。数值是量出来的：1440px 视口下
 * 左侧栏右边界 ~270px、右侧目录左边界 ~1180px，正文栏 380–1070，
 * 两边各有 ~110px 空档，所以借 96px 留 14px 安全边。 */
@media (min-width: 1280px) {
  .lurus-dg { margin-inline: -56px; }
}
@media (min-width: 1440px) {
  .lurus-dg { margin-inline: -96px; }
}
/* 图直接坐在页面纸面上，默认不套第二层容器背景 —— 多一层 chrome 会跟图本身打架 */
.lurus-dg__canvas {
  overflow-x: auto;
  /* 窄屏横向滚动时给出可抓的滚动条，而不是把图压扁 */
  scrollbar-width: thin;
}
.lurus-dg__canvas :deep(svg) {
  display: block;
  width: 100%;
  min-width: 640px;
  height: auto;
  margin: 0 auto;
}
.lurus-dg__cap {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  margin-top: 10px;
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}
/* 占满一整行，把出处标注挤到下一行 —— 否则出处那截等宽小字会插在
 * 图注中间，把一句话切成两半读。 */
.lurus-dg__cap-text { flex: 1 1 100%; }
.lurus-dg__src {
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  background: none;
  padding: 0;
}
.lurus-dg__fallback {
  margin-top: 10px;
  font-size: 0.85rem;
}
.lurus-dg__fallback > summary {
  cursor: pointer;
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
  user-select: none;
}
.lurus-dg__fallback > summary:hover { color: var(--vp-c-brand-1); }

@media (max-width: 640px) {
  .lurus-dg__canvas :deep(svg) { min-width: 560px; }
}

/* 图向外借了宽度，图注要缩回来跟正文左对齐 —— 否则图注比正文宽出一截，
 * 既破坏版心又把 0.82rem 的小字拉成过长的行长。 */
@media (min-width: 1280px) {
  .lurus-dg__cap, .lurus-dg__fallback { margin-inline: 56px; }
}
@media (min-width: 1440px) {
  .lurus-dg__cap, .lurus-dg__fallback { margin-inline: 96px; }
}
</style>
