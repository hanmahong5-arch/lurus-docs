<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { chrome } from '../../data/i18n'

type Status = 'live' | 'beta' | 'dev' | 'plan'

interface Props {
  status: Status
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
})

const { lang } = useData()

const labels: Record<Status, string> = {
  live: '已上线',
  beta: '内测中',
  dev: '开发中',
  plan: '规划中',
}
const chromeKey: Record<Status, string> = {
  live: 'statusLive',
  beta: 'statusBeta',
  dev: 'statusDev',
  plan: 'statusPlan',
}

const displayLabel = computed(
  () => props.label || chrome(chromeKey[props.status], lang.value, labels[props.status]) || props.status,
)
</script>

<template>
  <span class="status-badge" :class="`status-badge--${status}`">
    {{ displayLabel }}
  </span>
</template>
