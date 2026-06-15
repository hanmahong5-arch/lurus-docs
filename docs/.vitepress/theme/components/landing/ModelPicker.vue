<script setup lang="ts">
/**
 * ModelPicker — pick a model id and get a copy-ready, OpenAI-compatible snippet.
 *
 * Data-driven: the parent page passes `vendors` from the build-time
 * `models.data` loader (single source of truth = data/models.yaml), so the
 * dropdown always matches the live model catalog. No config generation — this
 * is a gateway, the only variable that changes is the `model` parameter.
 *
 * The <optgroup> list iterates the `vendors` prop directly (no computed) so it
 * renders server-side, mirroring ModelTable.
 */
import { ref, computed } from 'vue'
import { modelCatalog } from '../../../data/model-catalog'
import Icon from '../Icon.vue'
import CopyButton from '../CopyButton.vue'

// `modelCatalog` is a plain TS module generated from data/models.yaml by
// scripts/sync.ts (single source of truth). Plain TS — not a .data.ts loader —
// so it resolves at both SSR and client without loader/import quirks.
const vendors = modelCatalog

const selected = ref('deepseek-chat')
const current = computed(() =>
  vendors.flatMap(v => v.models).find(m => m.id === selected.value)
)

const snippet = computed(() => `from openai import OpenAI
import os

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key=os.environ["LURUS_API_KEY"])

response = client.chat.completions.create(
    model="${selected.value}",
    messages=[{"role": "user", "content": "你好"}],
)
print(response.choices[0].message.content)`)
</script>

<template>
  <div class="model-picker">
    <div class="model-picker__bar">
      <label class="model-picker__label" for="mp-select"><Icon name="shuffle" :size="16" /> 选择模型</label>
      <select id="mp-select" v-model="selected" class="model-picker__select">
        <optgroup v-for="v in vendors" :key="v.name" :label="v.name">
          <option v-for="m in v.models" :key="m.id" :value="m.id">{{ m.id }}</option>
        </optgroup>
      </select>
      <span v-if="current" class="model-picker__meta">{{ current.context }} · {{ current.price }}</span>
    </div>
    <div class="model-picker__code">
      <CopyButton :content="snippet" class="model-picker__copy" />
      <pre><code>{{ snippet }}</code></pre>
    </div>
  </div>
</template>

<style scoped>
.model-picker {
  margin: 18px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--lurus-radius-lg);
  overflow: hidden;
}
.model-picker__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}
.model-picker__label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
}
.model-picker__select {
  padding: 6px 10px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--lurus-radius-md);
  cursor: pointer;
}
.model-picker__meta {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}
.model-picker__code {
  position: relative;
}
.model-picker__code pre {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
  background: var(--vp-code-block-bg);
  font-family: var(--vp-font-family-mono);
  font-size: 0.82rem;
  line-height: 1.6;
}
.model-picker__copy {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
