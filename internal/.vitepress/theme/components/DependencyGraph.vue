<script setup lang="ts">
import { buildDependencyMermaid } from '../../data/products'
import MermaidBlock from './MermaidBlock.vue'

const chart = buildDependencyMermaid()
</script>

<template>
  <div class="dep-graph">
    <p class="dep-graph__hint">
      自动从 <code>data/products.ts</code> 渲染。箭头指向"我消费的服务"——读起来：从我出发的箭头是依赖。
    </p>
    <MermaidBlock :chart="chart" id="dep-graph" />
  </div>
</template>

<style scoped>
.dep-graph__hint {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin: 8px 0;
}
</style>
