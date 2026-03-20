<script setup lang="ts">
type Status = 'live' | 'beta' | 'dev' | 'plan'

interface Props {
  status: Status
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
})

const labels: Record<Status, string> = {
  live: '已上线',
  beta: '内测中',
  dev: '开发中',
  plan: '规划中',
}

const displayLabel = props.label || labels[props.status]
</script>

<template>
  <span class="status-badge" :class="`status-badge--${status}`">
    {{ displayLabel }}
  </span>
</template>
