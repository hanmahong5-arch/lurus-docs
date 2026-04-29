<script setup lang="ts">
import { computed } from 'vue'
import { products } from '../../../data/products'
import ProductHero from './ProductHero.vue'
import MetricStats from './MetricStats.vue'
import CapabilityGrid from './CapabilityGrid.vue'
import ArchitectureDiagram from './ArchitectureDiagram.vue'
import CodeShowcase from './CodeShowcase.vue'
import UserScenarios from './UserScenarios.vue'
import ComparisonTable from './ComparisonTable.vue'
import RelatedProducts from './RelatedProducts.vue'
import NextSteps from './NextSteps.vue'

const props = defineProps<{
  productId: string
  /** Skip specific sections when needed (e.g. { hero: false }) */
  hide?: Partial<Record<'hero' | 'metrics' | 'highlights' | 'architecture' | 'code' | 'scenarios' | 'comparison' | 'related' | 'next', boolean>>
}>()

const p = computed(() => products[props.productId])
const accent = computed(() => (p.value ? `var(${p.value.colorToken})` : undefined))
</script>

<template>
  <div v-if="p" class="product-landing">
    <ProductHero v-if="!hide?.hero" :product-id="productId" />
    <slot name="after-hero" />

    <MetricStats v-if="!hide?.metrics && p.metrics?.length" :items="p.metrics" />

    <slot name="before-highlights" />
    <CapabilityGrid
      v-if="!hide?.highlights && p.highlights?.length"
      :items="p.highlights"
      :accent="accent"
      title="核心能力"
    />

    <ArchitectureDiagram
      v-if="!hide?.architecture && p.architectureDiagram"
      :chart="p.architectureDiagram"
      title="架构一览"
    />

    <CodeShowcase
      v-if="!hide?.code && p.codeExamples?.length"
      :tabs="p.codeExamples"
      title="代码示例"
    />

    <UserScenarios
      v-if="!hide?.scenarios && p.scenarios?.length"
      :scenarios="p.scenarios"
      title="使用场景"
    />

    <ComparisonTable
      v-if="!hide?.comparison && p.comparison"
      :self-label="p.name"
      :competitors="p.comparison.competitors"
      :rows="p.comparison.rows"
      title="对标分析"
    />

    <slot name="extra" />

    <RelatedProducts v-if="!hide?.related" :product-id="productId" />

    <NextSteps v-if="!hide?.next && p.nextSteps?.length" :steps="p.nextSteps" />
  </div>
  <div v-else class="product-landing__error">
    <strong>产品元数据未找到: {{ productId }}</strong>
    <p>请在 <code>docs/.vitepress/data/products.ts</code> 中登记。</p>
  </div>
</template>

<style scoped>
.product-landing {
  margin-top: 8px;
}
.product-landing__error {
  padding: 16px 20px;
  background: rgba(234, 88, 12, 0.08);
  border: 1px solid var(--lurus-status-beta);
  border-radius: var(--lurus-radius-md);
  color: var(--vp-c-text-1);
}
</style>
