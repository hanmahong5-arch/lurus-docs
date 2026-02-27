<script setup lang="ts">
interface Props {
  name: string
  tagline: string
  href: string
  color?: string
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: '#C67B5C',
  icon: '→'
})
</script>

<template>
  <a class="product-card" :href="props.href" :style="{ '--card-color': props.color }">
    <div class="product-card__header">
      <span class="product-card__name">{{ props.name }}</span>
      <span class="product-card__arrow">{{ props.icon }}</span>
    </div>
    <p class="product-card__tagline">{{ props.tagline }}</p>
  </a>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 22px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
}

.product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--card-color);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.product-card:hover {
  transform: translateY(-3px);
  border-color: var(--card-color);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  text-decoration: none;
}

.product-card:hover::before {
  opacity: 1;
}

.product-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-card__name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.product-card__arrow {
  font-size: 1rem;
  color: var(--card-color);
  transition: transform 0.2s ease;
}

.product-card:hover .product-card__arrow {
  transform: translateX(4px);
}

.product-card__tagline {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin: 0;
}
</style>
