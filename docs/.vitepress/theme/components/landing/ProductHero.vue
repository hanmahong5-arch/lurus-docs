<script setup lang="ts">
import { computed } from 'vue'
import { products } from '../../../data/products'
import StatusBadge from '../StatusBadge.vue'
import Icon from '../Icon.vue'

const props = defineProps<{ productId: string }>()

const p = computed(() => products[props.productId])
const accent = computed(() => (p.value ? `var(${p.value.colorToken})` : 'var(--lurus-brand-500)'))
</script>

<template>
  <section v-if="p" class="product-hero" :style="{ '--accent': accent }">
    <div class="product-hero__bg" aria-hidden="true" />
    <div class="product-hero__content">
      <div class="product-hero__top">
        <span class="product-hero__icon"><Icon :name="p.icon" :size="40" /></span>
        <StatusBadge :status="p.status" />
      </div>
      <h1 class="product-hero__title">{{ p.fullName }}</h1>
      <p class="product-hero__tagline">{{ p.tagline }}</p>
      <div class="product-hero__actions">
        <a
          v-for="s in p.nextSteps"
          :key="s.link"
          :href="s.link"
          :target="s.external ? '_blank' : undefined"
          :rel="s.external ? 'noopener noreferrer' : undefined"
          class="product-hero__btn"
          :class="s.primary ? 'product-hero__btn--primary' : 'product-hero__btn--alt'"
        >
          {{ s.text }}
          <Icon v-if="s.external" name="arrow-up-right" :size="14" />
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.product-hero {
  position: relative;
  padding: 56px 40px 48px;
  margin: 0 0 24px;
  border-radius: var(--lurus-radius-xl);
  overflow: hidden;
  isolation: isolate;
}
.product-hero__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(at 15% 20%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 55%),
    radial-gradient(at 85% 80%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 60%),
    var(--vp-c-bg-soft);
}
.product-hero__top {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}
.product-hero__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: var(--lurus-radius-lg);
  background: color-mix(in srgb, var(--accent) 18%, transparent);
  color: var(--accent);
}
.product-hero__title {
  font-size: var(--lurus-fs-2xl);
  font-weight: 800;
  letter-spacing: var(--lurus-tracking-tight);
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
}
.product-hero__tagline {
  font-size: var(--lurus-fs-lg);
  color: var(--vp-c-text-2);
  margin: 0 0 24px;
  max-width: 720px;
}
.product-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.product-hero__btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: var(--lurus-radius-pill);
  font-weight: 600;
  font-size: 0.92rem;
  text-decoration: none;
  transition: transform var(--lurus-dur-fast), filter var(--lurus-dur-fast);
}
.product-hero__btn--primary {
  background: var(--accent);
  color: #fff;
}
.product-hero__btn--primary:hover {
  transform: var(--lurus-hover-rise);
  filter: brightness(1.08);
  color: #fff;
}
.product-hero__btn--alt {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}
.product-hero__btn--alt:hover {
  border-color: var(--accent);
  color: var(--accent);
}
@media (max-width: 640px) {
  .product-hero { padding: 40px 24px 36px; }
  .product-hero__title { font-size: var(--lurus-fs-xl); }
}
</style>
