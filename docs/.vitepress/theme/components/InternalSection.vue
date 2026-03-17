<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useInternalAuth } from '../composables/useInternalAuth'

const { verifyKey, saveKey, clearKey, hasKey } = useInternalAuth()

const authenticated = ref(false)
const keyInput = ref('')
const error = ref('')
const checking = ref(false)
const showLogin = ref(false)

async function login() {
  if (!keyInput.value.trim()) {
    error.value = 'Please enter an access key'
    return
  }
  checking.value = true
  error.value = ''
  const ok = await verifyKey(keyInput.value.trim())
  checking.value = false

  if (ok) {
    saveKey(keyInput.value.trim())
    authenticated.value = true
    showLogin.value = false
  } else {
    error.value = 'Invalid access key'
  }
}

onMounted(async () => {
  if (!hasKey()) return
  const stored = localStorage.getItem('lurus-docs-internal-key')
  if (stored) {
    const ok = await verifyKey(stored)
    if (ok) {
      authenticated.value = true
    } else {
      clearKey()
    }
  }
})
</script>

<template>
  <div class="internal-section">
    <div v-if="authenticated" class="is-content">
      <slot />
    </div>

    <div v-else class="is-placeholder">
      <div class="is-bar" @click="showLogin = !showLogin">
        <span class="is-icon">&#128274;</span>
        <span>This section requires internal access</span>
        <span class="is-toggle">{{ showLogin ? 'Hide' : 'Login' }}</span>
      </div>

      <div v-if="showLogin" class="is-login">
        <form @submit.prevent="login" class="is-form">
          <input
            v-model="keyInput"
            type="password"
            placeholder="Access Key"
            class="is-input"
            autocomplete="off"
          />
          <button type="submit" class="is-btn" :disabled="checking">
            {{ checking ? '...' : 'Verify' }}
          </button>
        </form>
        <p v-if="error" class="is-error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.is-placeholder {
  margin: 16px 0;
  border: 1px dashed var(--vp-c-border);
  border-radius: 8px;
  overflow: hidden;
}

.is-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  font-size: 14px;
  color: var(--vp-c-text-2);
  user-select: none;
}
.is-bar:hover {
  background: var(--vp-c-bg-elv);
}

.is-icon {
  font-size: 16px;
}

.is-toggle {
  margin-left: auto;
  font-size: 13px;
  color: #16a34a;
  font-weight: 500;
}

.is-login {
  padding: 12px 16px;
}

.is-form {
  display: flex;
  gap: 8px;
}

.is-input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 13px;
  outline: none;
}
.is-input:focus {
  border-color: #16a34a;
}

.is-btn {
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  background: #16a34a;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.is-btn:hover:not(:disabled) {
  background: #15803d;
}
.is-btn:disabled {
  opacity: 0.6;
}

.is-error {
  color: #ef4444;
  font-size: 12px;
  margin: 8px 0 0;
}
</style>
