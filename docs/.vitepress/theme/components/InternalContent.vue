<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useInternalAuth } from '../composables/useInternalAuth'
import MarkdownIt from 'markdown-it'

const props = defineProps<{ slug: string }>()

const { verifyKey, saveKey, clearKey, hasKey, fetchContent } = useInternalAuth()

const authenticated = ref(false)
const content = ref('')
const loading = ref(false)
const error = ref('')
const keyInput = ref('')
const checking = ref(false)

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

let isActive = true

async function loadContent() {
  loading.value = true
  error.value = ''
  const result = await fetchContent(props.slug)
  if (!isActive) return
  loading.value = false

  if ('content' in result) {
    content.value = md.render(result.content)
    authenticated.value = true
  } else if (result.error === 'auth') {
    authenticated.value = false
    clearKey()
  } else {
    error.value = result.message
  }
}

async function login() {
  if (!keyInput.value.trim()) {
    error.value = 'Please enter an access key'
    return
  }
  checking.value = true
  error.value = ''
  const result = await verifyKey(keyInput.value.trim())

  if (result.ok) {
    saveKey(keyInput.value.trim())
    checking.value = false
    await loadContent()
  } else {
    checking.value = false
    error.value = result.message
  }
}

onMounted(async () => {
  if (hasKey()) {
    await loadContent()
  }
})
onUnmounted(() => { isActive = false })
</script>

<template>
  <div class="internal-content">
    <!-- Loading state -->
    <div v-if="loading" class="ic-loading">
      <div class="ic-spinner" />
      <span>Loading internal content...</span>
    </div>

    <!-- Authenticated: render content -->
    <div v-else-if="authenticated && content" class="ic-rendered vp-doc" v-html="content" />

    <!-- Network/server error — don't show login, show retry -->
    <div v-else-if="error" class="ic-error">
      <p class="ic-error-text">{{ error }}</p>
      <button class="ic-retry-btn" @click="loadContent">Try again</button>
    </div>

    <!-- Not authenticated: login prompt -->
    <div v-else class="ic-gate">
      <div class="ic-gate-card">
        <div class="ic-gate-icon">&#128274;</div>
        <h3>Internal Content</h3>
        <p>This section contains internal technical details. Enter your access key to view.</p>
        <form @submit.prevent="login" class="ic-gate-form">
          <input
            v-model="keyInput"
            type="password"
            placeholder="Access Key"
            class="ic-gate-input"
            autocomplete="off"
          />
          <button type="submit" class="ic-gate-btn" :disabled="checking">
            {{ checking ? 'Verifying...' : 'View Content' }}
          </button>
        </form>
        <p v-if="error" class="ic-gate-error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ic-loading {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.ic-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.ic-rendered {
  margin-top: 24px;
}

.ic-rendered :deep(h1),
.ic-rendered :deep(h2),
.ic-rendered :deep(h3) {
  margin-top: 24px;
  margin-bottom: 8px;
}

.ic-rendered :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

.ic-rendered :deep(th),
.ic-rendered :deep(td) {
  border: 1px solid var(--vp-c-divider);
  padding: 8px 12px;
  text-align: left;
}

.ic-rendered :deep(th) {
  background: var(--vp-c-bg-soft);
  font-weight: 600;
}

.ic-rendered :deep(pre) {
  background: var(--vp-code-block-bg);
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  margin: 16px 0;
}

.ic-rendered :deep(code) {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
}

.ic-rendered :deep(p code) {
  background: var(--vp-code-bg);
  padding: 2px 6px;
  border-radius: 4px;
}

.ic-rendered :deep(blockquote) {
  border-left: 3px solid var(--vp-c-brand-1);
  padding-left: 16px;
  margin: 16px 0;
  color: var(--vp-c-text-2);
}

.ic-error {
  padding: 24px;
  text-align: center;
}
.ic-error-text {
  margin: 0 0 16px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}
.ic-retry-btn {
  padding: 8px 20px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-brand-1);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.ic-retry-btn:hover {
  background: var(--vp-c-brand-soft);
}

.ic-gate {
  margin: 32px 0;
}

.ic-gate-card {
  max-width: 480px;
  padding: 32px;
  border: 1px dashed var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  text-align: center;
}

.ic-gate-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.ic-gate-card h3 {
  margin: 0 0 8px;
  font-size: 18px;
  color: var(--vp-c-text-1);
}

.ic-gate-card > p {
  margin: 0 0 20px;
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.ic-gate-form {
  display: flex;
  gap: 8px;
}

.ic-gate-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  outline: none;
}
.ic-gate-input:focus {
  border-color: #16a34a;
}

.ic-gate-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: #16a34a;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
}
.ic-gate-btn:hover:not(:disabled) {
  background: #15803d;
}
.ic-gate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ic-gate-error {
  color: #ef4444;
  font-size: 13px;
  margin: 12px 0 0 !important;
}
</style>
