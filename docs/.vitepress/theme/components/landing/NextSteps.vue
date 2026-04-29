<script setup lang="ts">
import Icon from '../Icon.vue'

interface Step {
  text: string
  link: string
  primary?: boolean
  external?: boolean
}

defineProps<{ steps: Step[]; title?: string }>()
</script>

<template>
  <section class="next-steps">
    <h2 class="next-steps__heading">{{ title || '下一步' }}</h2>
    <div class="next-steps__grid">
      <a
        v-for="s in steps"
        :key="s.link"
        :href="s.link"
        :target="s.external ? '_blank' : undefined"
        :rel="s.external ? 'noopener noreferrer' : undefined"
        class="next-steps__card"
        :class="{ 'is-primary': s.primary }"
      >
        <span>{{ s.text }}</span>
        <Icon :name="s.external ? 'arrow-up-right' : 'arrow-right'" :size="16" />
      </a>
    </div>
  </section>
</template>

<style scoped>
.next-steps { margin: 40px 0 24px; }
.next-steps__heading {
  font-size: var(--lurus-fs-xl);
  font-weight: 700;
  margin: 0 0 16px;
  border: none !important;
  padding: 0 !important;
}
.next-steps__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}
.next-steps__card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--lurus-radius-md);
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: border-color var(--lurus-dur-base), transform var(--lurus-dur-base), background var(--lurus-dur-base);
}
.next-steps__card:hover {
  transform: var(--lurus-hover-rise);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.next-steps__card.is-primary {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
}
.next-steps__card.is-primary:hover {
  filter: brightness(1.08);
  color: #fff;
}
</style>
