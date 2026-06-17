<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { products, outgoingLinks, incomingLinks } from '../../../data/products'
import { localizeProduct, uiFor } from '../../../data/i18n'
import Icon from '../Icon.vue'

const props = defineProps<{ productId: string }>()
const { lang } = useData()

const self = computed(() => products[props.productId])
const outgoing = computed(() => outgoingLinks(props.productId).map((p) => localizeProduct(p, lang.value)))
const incoming = computed(() =>
  incomingLinks(props.productId)
    .filter((p) => !outgoing.value.some((o) => o.id === p.id))
    .map((p) => localizeProduct(p, lang.value)),
)
const ui = computed(() => uiFor(lang.value))
</script>

<template>
  <section v-if="self && (outgoing.length || incoming.length)" class="related">
    <h2 class="related__heading">{{ ui ? ui.related.heading : '相关产品' }}</h2>

    <div v-if="outgoing.length" class="related__group">
      <h3 class="related__group-title">{{ ui ? ui.related.paired : '通常搭配' }}</h3>
      <div class="related__grid">
        <a v-for="r in outgoing" :key="r.id" :href="r.home" class="related__card"
           :style="{ '--rc': `var(${r.colorToken})` }">
          <span class="related__icon"><Icon :name="r.icon" :size="20" /></span>
          <div class="related__body">
            <strong class="related__name">{{ r.name }}</strong>
            <span class="related__tagline">{{ r.tagline }}</span>
          </div>
        </a>
      </div>
    </div>

    <div v-if="incoming.length" class="related__group">
      <h3 class="related__group-title">{{ ui ? ui.related.referenced : '被这些产品引用' }}</h3>
      <div class="related__grid">
        <a v-for="r in incoming" :key="r.id" :href="r.home" class="related__card related__card--muted"
           :style="{ '--rc': `var(${r.colorToken})` }">
          <span class="related__icon"><Icon :name="r.icon" :size="20" /></span>
          <div class="related__body">
            <strong class="related__name">{{ r.name }}</strong>
            <span class="related__tagline">{{ r.tagline }}</span>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.related { margin: 40px 0 24px; }
.related__heading {
  font-size: var(--lurus-fs-xl);
  font-weight: 700;
  margin: 0 0 12px;
  border: none !important;
  padding: 0 !important;
}
.related__group { margin-top: 16px; }
.related__group-title {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin: 12px 0 8px;
  border: none !important;
  padding: 0 !important;
}
.related__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}
.related__card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--lurus-radius-md);
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: border-color var(--lurus-dur-base), transform var(--lurus-dur-base);
}
.related__card:hover {
  border-color: var(--rc);
  transform: var(--lurus-hover-rise);
}
.related__card--muted { opacity: 0.9; }
.related__icon {
  display: inline-flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: var(--lurus-radius-md);
  background: color-mix(in srgb, var(--rc) 14%, transparent);
  color: var(--rc);
  flex-shrink: 0;
}
.related__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.related__name {
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
}
.related__tagline {
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  line-height: 1.4;
}
</style>
