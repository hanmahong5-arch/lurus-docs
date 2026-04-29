<script setup lang="ts">
import { riskLabels } from '../../data/products'

const props = defineProps<{ flag: string }>()

const label = riskLabels[props.flag] ?? props.flag

const tone = (() => {
  if (props.flag === 'planning' || props.flag === 'wip') return 'info'
  if (props.flag === 'no-monitor' || props.flag === 'no-tests') return 'warn'
  if (props.flag === 'manual-deploy' || props.flag === 'stale-docs') return 'bad'
  return 'neutral'
})()
</script>

<template>
  <span class="risk-badge" :class="`risk-badge--${tone}`">{{ label }}</span>
</template>

<style scoped>
.risk-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  margin-right: 4px;
  margin-bottom: 4px;
}
.risk-badge--info { background: #dbeafe; color: #1e40af; }
.risk-badge--warn { background: #fef3c7; color: #92400e; }
.risk-badge--bad  { background: #fee2e2; color: #991b1b; }
.risk-badge--neutral { background: var(--vp-c-bg-soft); color: var(--vp-c-text-2); }

.dark .risk-badge--info { background: #1e3a8a; color: #bfdbfe; }
.dark .risk-badge--warn { background: #78350f; color: #fde68a; }
.dark .risk-badge--bad  { background: #7f1d1d; color: #fecaca; }
</style>
