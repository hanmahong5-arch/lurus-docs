<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useInternalAuth } from '../composables/useInternalAuth'

const { verifyKey, saveKey, clearKey } = useInternalAuth()

const authenticated = ref(false)
const keyInput = ref('')
const error = ref('')
const checking = ref(false)

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
  } else {
    error.value = 'Invalid access key'
  }
}

function logout() {
  clearKey()
  authenticated.value = false
  keyInput.value = ''
}

onMounted(async () => {
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
  <div class="internal-layout">
    <template v-if="authenticated">
      <div class="internal-header">
        <span class="internal-badge">Internal</span>
        <button class="internal-logout" @click="logout">Logout</button>
      </div>
      <slot />
    </template>

    <div v-else class="internal-login">
      <div class="login-card">
        <h2>Internal Access</h2>
        <p>Enter the internal access key to view this page.</p>
        <form @submit.prevent="login">
          <input
            v-model="keyInput"
            type="password"
            placeholder="Access Key"
            class="login-input"
            autocomplete="off"
          />
          <button type="submit" class="login-btn" :disabled="checking">
            {{ checking ? 'Verifying...' : 'Login' }}
          </button>
        </form>
        <p v-if="error" class="login-error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.internal-layout {
  min-height: 60vh;
}

.internal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.internal-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 4px;
  background: #dcfce7;
  color: #16a34a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dark .internal-badge {
  background: rgba(22, 163, 74, 0.15);
}

.internal-logout {
  font-size: 13px;
  padding: 4px 12px;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
}
.internal-logout:hover {
  border-color: #16a34a;
  color: #16a34a;
}

.internal-login {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
}

.login-card {
  max-width: 400px;
  width: 100%;
  padding: 32px;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  text-align: center;
}

.login-card h2 {
  margin: 0 0 8px;
  font-size: 20px;
  color: var(--vp-c-text-1);
}

.login-card p {
  margin: 0 0 20px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.login-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  outline: none;
  margin-bottom: 12px;
  box-sizing: border-box;
}
.login-input:focus {
  border-color: #16a34a;
}

.login-btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: #16a34a;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.login-btn:hover:not(:disabled) {
  background: #15803d;
}
.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-error {
  color: #ef4444;
  font-size: 13px;
  margin: 12px 0 0 !important;
}
</style>
