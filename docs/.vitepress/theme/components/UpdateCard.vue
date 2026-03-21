<script setup lang="ts">
defineProps<{
  title: string
  type: string
  productName: string
  productColor: string
  version?: string | null
  content: string
  publishedAt: string | null
  isMajor: boolean
}>()

const TYPE_LABELS: Record<string, { label: string; cls: string }> = {
  feature:      { label: 'New Feature',   cls: 'type-feature' },
  improvement:  { label: 'Improvement',   cls: 'type-improvement' },
  bugfix:       { label: 'Bug Fix',       cls: 'type-bugfix' },
  security:     { label: 'Security',      cls: 'type-security' },
  deprecation:  { label: 'Deprecation',   cls: 'type-deprecation' },
  launch:       { label: 'Launch',        cls: 'type-launch' },
  sunset:       { label: 'Sunset',        cls: 'type-sunset' },
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr.replace(' ', 'T') + 'Z')
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}
</script>

<template>
  <div class="update-card" :class="{ 'is-major': isMajor }">
    <div class="update-meta">
      <span class="update-product" :style="{ '--product-color': productColor }">
        {{ productName }}
      </span>
      <span
        class="update-type"
        :class="TYPE_LABELS[type]?.cls || 'type-feature'"
      >
        {{ TYPE_LABELS[type]?.label || type }}
      </span>
      <span v-if="version" class="update-version">{{ version }}</span>
      <span v-if="publishedAt" class="update-date">{{ formatDate(publishedAt) }}</span>
    </div>
    <h3 class="update-title">{{ title }}</h3>
    <div v-if="content" class="update-content" v-html="content" />
  </div>
</template>

<style scoped>
.update-card {
  padding: 20px 24px;
  border-left: 3px solid var(--vp-c-divider);
  margin-bottom: 16px;
  transition: border-color 0.2s ease;
}
.update-card:hover {
  border-left-color: var(--vp-c-brand-1);
}
.update-card.is-major {
  border-left-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  border-radius: 0 8px 8px 0;
}

.update-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.update-product {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  background: color-mix(in srgb, var(--product-color) 15%, transparent);
  color: var(--product-color);
}

.update-type {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.type-feature     { background: rgba(34,197,94,0.12); color: #22c55e; }
.type-improvement { background: rgba(59,130,246,0.12); color: #3b82f6; }
.type-bugfix      { background: rgba(249,115,22,0.12); color: #f97316; }
.type-security    { background: rgba(239,68,68,0.12);  color: #ef4444; }
.type-deprecation { background: rgba(234,179,8,0.12);  color: #eab308; }
.type-launch      { background: rgba(168,85,247,0.12); color: #a855f7; }
.type-sunset      { background: rgba(107,114,128,0.12); color: #6b7280; }

.update-version {
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

.update-date {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-left: auto;
}

.update-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: var(--vp-c-text-1);
}

.update-content {
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}
</style>
