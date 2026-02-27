<script setup lang="ts">
interface Props {
  text: string
  type?: 'tip' | 'warning' | 'danger' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'tip'
})
</script>

<template>
  <span class="lurus-badge" :class="`lurus-badge--${props.type}`">
    {{ props.text }}
  </span>
</template>

<style scoped>
.lurus-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1.6;
  white-space: nowrap;
  vertical-align: middle;
  margin-left: 6px;
}

.lurus-badge--tip {
  background-color: rgba(198, 123, 92, 0.15);
  color: #C67B5C;
  border: 1px solid rgba(198, 123, 92, 0.3);
}

.lurus-badge--warning {
  background-color: rgba(234, 179, 8, 0.12);
  color: #A37900;
  border: 1px solid rgba(234, 179, 8, 0.3);
}

.lurus-badge--danger {
  background-color: rgba(239, 68, 68, 0.12);
  color: #DC2626;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.lurus-badge--info {
  background-color: rgba(99, 102, 241, 0.12);
  color: #4F46E5;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.dark .lurus-badge--tip {
  background-color: rgba(232, 168, 124, 0.2);
  color: #E8A87C;
  border-color: rgba(232, 168, 124, 0.35);
}

.dark .lurus-badge--warning {
  background-color: rgba(234, 179, 8, 0.15);
  color: #EAB308;
  border-color: rgba(234, 179, 8, 0.35);
}

.dark .lurus-badge--danger {
  background-color: rgba(239, 68, 68, 0.15);
  color: #F87171;
  border-color: rgba(239, 68, 68, 0.35);
}

.dark .lurus-badge--info {
  background-color: rgba(99, 102, 241, 0.15);
  color: #818CF8;
  border-color: rgba(99, 102, 241, 0.35);
}
</style>
