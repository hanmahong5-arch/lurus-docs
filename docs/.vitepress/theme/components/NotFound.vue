<script setup lang="ts">
import { ref, onMounted } from 'vue'

const attemptedPath = ref('')
onMounted(() => {
  attemptedPath.value = window.location.pathname
})
</script>

<template>
  <div class="not-found">
    <p class="not-found-code">404</p>
    <h1 class="not-found-title">Page Not Found</h1>
    <p class="not-found-desc">
      <code v-if="attemptedPath">{{ attemptedPath }}</code>
      does not exist or has been moved.
    </p>

    <div class="not-found-actions">
      <a href="/" class="nf-btn nf-btn--primary">Back to Homepage</a>
    </div>

    <div class="not-found-suggestions">
      <p class="nf-section-title">Popular destinations</p>
      <div class="nf-grid">
        <a href="/guide/quickstart" class="nf-link">Quick Start</a>
        <a href="/api/overview" class="nf-link">API Reference</a>
        <a href="/kova/" class="nf-link">Kova Agent Engine</a>
        <a href="/memx/" class="nf-link">MemX Memory</a>
        <a href="/lucrum/" class="nf-link">Lucrum Trading</a>
        <a href="/switch/" class="nf-link">Switch Desktop</a>
        <a href="/platform/" class="nf-link">Account &amp; Billing</a>
        <a href="/updates/" class="nf-link">Product Updates</a>
      </div>
    </div>

    <p class="not-found-hint">
      Try using the search bar above, or check the URL for typos.
    </p>
  </div>
</template>

<style scoped>
.not-found {
  padding: 64px 24px;
  text-align: center;
  max-width: 560px;
  margin: 0 auto;
}

.not-found-code {
  font-size: 4rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1;
}

.not-found-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 12px 0 8px;
  color: var(--vp-c-text-1);
}

.not-found-desc {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin: 0 0 24px;
}
.not-found-desc code {
  font-size: 13px;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
  word-break: break-all;
}

.not-found-actions {
  margin-bottom: 32px;
}

.nf-btn {
  display: inline-flex;
  align-items: center;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}
.nf-btn--primary {
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
}
.nf-btn--primary:hover {
  background: var(--vp-button-brand-hover-bg);
  text-decoration: none;
}

.not-found-suggestions {
  text-align: left;
  padding: 20px 24px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  margin-bottom: 24px;
}

.nf-section-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-3);
  margin: 0 0 12px;
}

.nf-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 16px;
}

.nf-link {
  font-size: 14px;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  padding: 4px 0;
  transition: color 0.15s;
}
.nf-link:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline;
}

.not-found-hint {
  font-size: 13px;
  color: var(--vp-c-text-3);
  margin: 0;
}

@media (max-width: 480px) {
  .not-found-code {
    font-size: 3rem;
  }
  .nf-grid {
    grid-template-columns: 1fr;
  }
}
</style>
