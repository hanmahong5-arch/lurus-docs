<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { products, statusColors, groupColors, daysSince, type Group } from '../../data/products'
import RiskBadge from './RiskBadge.vue'

const groupNames: Record<Group, string> = {
  platform: 'Platform 组',
  kova: 'Kova 组',
  lucrum: 'Lucrum 组',
  desktop: 'Desktop 组',
  web: 'Web 组',
  tooling: '工具链',
}

const groupOrder: Group[] = ['platform', 'kova', 'lucrum', 'desktop', 'web', 'tooling']

// Computed at mount time so SSR build doesn't bake in a stale "now".
const now = ref(new Date())
onMounted(() => { now.value = new Date() })

function reviewedHint(iso: string): { text: string; stale: boolean } {
  const d = daysSince(iso, now.value)
  if (d < 0) return { text: '日期未知', stale: false }
  if (d === 0) return { text: '今日复审', stale: false }
  return { text: `复审 ${d} 天前`, stale: d > 30 }
}
</script>

<template>
  <div class="product-status">
    <div v-for="g in groupOrder" :key="g" class="product-status__group">
      <h3 class="product-status__group-title" :style="{ borderColor: groupColors[g] }">
        {{ groupNames[g] }}
        <span class="product-status__group-count">{{ products.filter((p) => p.group === g).length }}</span>
      </h3>
      <div class="product-status__cards">
        <a
          v-for="p in products.filter((x) => x.group === g)"
          :key="p.id"
          :href="p.manualPath"
          class="product-card"
          :style="{ '--accent': groupColors[p.group] }"
        >
          <div class="product-card__head">
            <span
              class="product-card__dot"
              :style="{ background: statusColors[p.status] }"
              :title="`status: ${p.status}`"
            ></span>
            <span class="product-card__name">{{ p.name }}</span>
            <span class="product-card__priority">{{ p.priority }}</span>
          </div>
          <div class="product-card__meta">
            <span v-if="p.domain">{{ p.domain }}</span>
            <span v-else>{{ p.deployTarget }}</span>
          </div>
          <div class="product-card__owner">
            <span :class="['product-card__bus', p.busFactor < 2 ? 'is-warn' : '']">
              owner {{ p.owner }} · bus {{ p.busFactor }}
            </span>
            <span :class="['product-card__reviewed', reviewedHint(p.lastReviewed).stale ? 'is-stale' : '']">
              · {{ reviewedHint(p.lastReviewed).text }}
            </span>
          </div>
          <div v-if="p.riskFlags.length" class="product-card__risks">
            <RiskBadge v-for="f in p.riskFlags" :key="f" :flag="f" />
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-status { display: flex; flex-direction: column; gap: 24px; }
.product-status__group-title {
  font-size: 15px;
  margin: 0 0 12px 0;
  padding-left: 10px;
  border-left: 3px solid #C67B5C;
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-weight: 600;
}
.product-status__group-count {
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-weight: 400;
}
.product-status__cards {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}
.product-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 14px;
  border: 1px solid var(--vp-c-divider);
  border-left: 3px solid var(--accent, #C67B5C);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  text-decoration: none !important;
  color: var(--vp-c-text-1) !important;
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
}
.product-card__head {
  display: flex;
  align-items: center;
  gap: 6px;
}
.product-card__dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}
.product-card__name {
  font-weight: 600;
  font-size: 14px;
  flex: 1;
}
.product-card__priority {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
}
.product-card__meta {
  font-size: 12px;
  color: var(--vp-c-text-2);
  font-family: 'JetBrains Mono', 'SF Mono', monospace;
}
.product-card__owner { font-size: 11px; color: var(--vp-c-text-3); }
.product-card__bus.is-warn { color: #b45309; font-weight: 600; }
.dark .product-card__bus.is-warn { color: #fbbf24; }
.product-card__reviewed { color: var(--vp-c-text-3); }
.product-card__reviewed.is-stale { color: #b45309; font-weight: 600; }
.dark .product-card__reviewed.is-stale { color: #fbbf24; }
.product-card__risks { display: flex; flex-wrap: wrap; gap: 2px; margin-top: 4px; }
</style>
