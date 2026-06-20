<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData } from 'vitepress'
import Icon from './Icon.vue'
import { chrome } from '../../data/i18n'

const props = defineProps<{ content: string }>()
const { lang } = useData()
const copied = ref(false)

const copyLabel = computed(() => chrome('copy', lang.value, '复制'))
const copiedLabel = computed(() => chrome('copied', lang.value, '已复制'))
const copyAria = computed(() => chrome('copyToClipboard', lang.value, '复制到剪贴板'))

async function copy() {
  try {
    await navigator.clipboard.writeText(props.content)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    /* navigator.clipboard unavailable — button just resets */
  }
}
</script>

<template>
  <button
    type="button"
    class="copy-btn"
    :class="{ 'copy-btn--ok': copied }"
    :aria-label="copied ? copiedLabel : copyAria"
    @click="copy"
  >
    <Icon :name="copied ? 'check' : 'copy'" :size="14" />
    <span>{{ copied ? copiedLabel : copyLabel }}</span>
  </button>
</template>

<style scoped>
.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--lurus-radius-md);
  cursor: pointer;
  transition: color var(--lurus-dur-fast), background var(--lurus-dur-fast);
}
.copy-btn:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}
.copy-btn--ok {
  color: var(--lurus-status-live);
  border-color: var(--lurus-status-live);
}
</style>
