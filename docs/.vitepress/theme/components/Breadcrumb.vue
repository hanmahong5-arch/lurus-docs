<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'

const { theme } = useData()
const route = useRoute()

interface CrumbItem {
  text: string
  link?: string
}

const crumbs = computed<CrumbItem[]>(() => {
  const path = route.path
  // Skip homepage
  if (path === '/' || path === '/index.html') return []

  const items: CrumbItem[] = [{ text: '首页', link: '/' }]

  // Find which sidebar section contains this page
  const sidebar = theme.value.sidebar
  if (!sidebar) return items

  for (const [prefix, groups] of Object.entries(sidebar)) {
    if (!path.startsWith(prefix)) continue
    // Found matching sidebar section
    for (const group of groups as any[]) {
      if (!group.items) continue
      for (const item of group.items) {
        // Normalize: VitePress clean URLs may or may not have trailing slash
        const itemPath = item.link?.replace(/\/$/, '') || ''
        const currentPath = path.replace(/\/$/, '').replace(/\.html$/, '')
        if (itemPath === currentPath) {
          // Add the group name as middle crumb
          items.push({ text: group.text, link: group.items[0]?.link })
          // Add current page as final crumb (not clickable)
          items.push({ text: item.text })
          return items
        }
      }
    }
    // Page matched prefix but not found in sidebar items — show group as fallback
    const firstGroup = (groups as any[])[0]
    if (firstGroup?.text) {
      items.push({ text: firstGroup.text, link: firstGroup.items?.[0]?.link })
    }
    break
  }

  return items
})
</script>

<template>
  <nav v-if="crumbs.length > 1" class="breadcrumb" aria-label="breadcrumb">
    <template v-for="(crumb, i) in crumbs" :key="i">
      <a v-if="crumb.link && i < crumbs.length - 1" :href="crumb.link" class="breadcrumb-link">
        {{ crumb.text }}
      </a>
      <span v-else class="breadcrumb-current">{{ crumb.text }}</span>
      <span v-if="i < crumbs.length - 1" class="breadcrumb-sep"> &gt; </span>
    </template>
  </nav>
</template>

<style scoped>
.breadcrumb {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
  margin-bottom: 8px;
  line-height: 1.4;
}

.breadcrumb-link {
  color: var(--vp-c-text-3);
  text-decoration: none;
}

.breadcrumb-link:hover {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}

.breadcrumb-sep {
  margin: 0 4px;
  color: var(--vp-c-text-3);
  opacity: 0.5;
}

.breadcrumb-current {
  color: var(--vp-c-text-2);
}
</style>
