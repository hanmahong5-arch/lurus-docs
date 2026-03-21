<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAdminApi } from '../composables/useApi'

const { verifyKey, saveKey, clearKey } = useAdminApi()

const authenticated = ref(false)
const keyInput = ref('')
const error = ref('')
const checking = ref(false)

async function login() {
  if (!keyInput.value.trim()) {
    error.value = 'Please enter an API key'
    return
  }
  checking.value = true
  error.value = ''
  const result = await verifyKey(keyInput.value.trim())
  checking.value = false

  if (result.ok) {
    saveKey(keyInput.value.trim())
    authenticated.value = true
  } else {
    error.value = result.message
  }
}

function logout() {
  clearKey()
  authenticated.value = false
  keyInput.value = ''
}

let isActive = true
onMounted(async () => {
  const stored = localStorage.getItem('lurus-docs-admin-key')
  if (stored) {
    const result = await verifyKey(stored)
    if (!isActive) return
    if (result.ok) {
      authenticated.value = true
    } else if (result.reason === 'invalid') {
      clearKey()
    }
  }
})
onUnmounted(() => { isActive = false })
</script>

<template>
  <div class="admin-layout">
    <template v-if="authenticated">
      <div class="admin-header">
        <span class="admin-badge">Admin</span>
        <button class="admin-logout" @click="logout">Logout</button>
      </div>
      <slot />
    </template>

    <div v-else class="admin-login">
      <div class="login-card">
        <h2>Admin Login</h2>
        <p>Enter the admin API key to access the management panel.</p>
        <form @submit.prevent="login">
          <input
            v-model="keyInput"
            type="password"
            placeholder="API Key"
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
.admin-layout {
  min-height: 60vh;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.admin-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 4px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.admin-logout {
  font-size: 13px;
  padding: 4px 12px;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
}
.admin-logout:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.admin-login {
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
  border-color: var(--vp-c-brand-1);
}

.login-btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.login-btn:hover:not(:disabled) {
  background: var(--vp-button-brand-hover-bg);
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
