<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  description?: string
}

const props = defineProps<Props>()

const copied = ref(false)

function copyPath() {
  navigator.clipboard.writeText(props.path).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 1800)
  })
}
</script>

<template>
  <div class="api-endpoint" @click="copyPath" :title="copied ? '已复制！' : '点击复制路径'">
    <span class="api-method" :class="`api-method--${props.method.toLowerCase()}`">
      {{ props.method }}
    </span>
    <code class="api-path">{{ props.path }}</code>
    <span v-if="props.description" class="api-description">{{ props.description }}</span>
    <span class="api-copy-icon" :class="{ copied }">
      <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </span>
  </div>
</template>

<style scoped>
.api-endpoint {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  margin: 8px 0;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
  font-family: var(--vp-font-family-mono);
}

.api-endpoint:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-brand-soft);
}

.api-method {
  flex-shrink: 0;
  padding: 2px 8px;
  border-radius: 5px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.api-method--get    { background: rgba(34, 197, 94, 0.15);  color: #16A34A; }
.api-method--post   { background: rgba(59, 130, 246, 0.15); color: #2563EB; }
.api-method--put    { background: rgba(234, 179, 8, 0.15);  color: #B45309; }
.api-method--patch  { background: rgba(168, 85, 247, 0.15); color: #7C3AED; }
.api-method--delete { background: rgba(239, 68, 68, 0.15);  color: #DC2626; }

.dark .api-method--get    { background: rgba(34, 197, 94, 0.2);  color: #4ADE80; }
.dark .api-method--post   { background: rgba(59, 130, 246, 0.2); color: #60A5FA; }
.dark .api-method--put    { background: rgba(234, 179, 8, 0.2);  color: #FCD34D; }
.dark .api-method--patch  { background: rgba(168, 85, 247, 0.2); color: #C084FC; }
.dark .api-method--delete { background: rgba(239, 68, 68, 0.2);  color: #F87171; }

.api-path {
  flex: 1;
  font-size: 0.875rem;
  color: var(--vp-c-text-1);
  background: transparent;
  padding: 0;
  border: none;
}

.api-description {
  flex-shrink: 0;
  font-family: var(--vp-font-family-base);
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  margin-left: auto;
}

.api-copy-icon {
  flex-shrink: 0;
  color: var(--vp-c-text-3);
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
}

.api-copy-icon.copied {
  color: #16A34A;
}

.api-endpoint:hover .api-copy-icon {
  color: var(--vp-c-brand-1);
}
</style>
