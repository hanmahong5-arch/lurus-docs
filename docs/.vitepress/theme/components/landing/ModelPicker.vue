<script setup lang="ts">
/**
 * ModelPicker — pick a model id + language, get a copy-ready, OpenAI-compatible snippet.
 *
 * Data-driven: the dropdown iterates `modelCatalog` (generated from
 * data/models.yaml by scripts/sync.ts — single source of truth), so it always
 * matches the live catalog. Plain TS import (not a .data.ts loader) resolves
 * identically at SSR and on the client, mirroring ModelTable.
 *
 * The language tabs reuse CodeShowcase's pattern (an `active` ref + <button
 * v-for>). This is a gateway, so only the `model` parameter and the host
 * language change — the endpoint and request body stay fixed.
 */
import { ref, computed } from 'vue'
import { modelCatalog } from '../../../data/model-catalog'
import Icon from '../Icon.vue'
import CopyButton from '../CopyButton.vue'

const vendors = modelCatalog

const selected = ref('deepseek-chat')
const current = computed(() =>
  vendors.flatMap(v => v.models).find(m => m.id === selected.value)
)

const langs = [
  { id: 'python', label: 'Python' },
  { id: 'curl', label: 'cURL' },
  { id: 'node', label: 'Node.js' },
] as const
type LangId = (typeof langs)[number]['id']
const activeLang = ref<LangId>('python')

const snippet = computed(() => {
  const model = selected.value
  if (activeLang.value === 'curl') {
    return `curl https://api.lurus.cn/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $LURUS_API_KEY" \\
  -d '{
    "model": "${model}",
    "messages": [{"role": "user", "content": "你好"}]
  }'`
  }
  if (activeLang.value === 'node') {
    return `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.lurus.cn/v1",
  apiKey: process.env.LURUS_API_KEY,
});

const response = await client.chat.completions.create({
  model: "${model}",
  messages: [{ role: "user", content: "你好" }],
});
console.log(response.choices[0].message.content);`
  }
  return `from openai import OpenAI
import os

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key=os.environ["LURUS_API_KEY"])

response = client.chat.completions.create(
    model="${model}",
    messages=[{"role": "user", "content": "你好"}],
)
print(response.choices[0].message.content)`
})
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
    <div class="model-picker__tabs" role="tablist">
      <button
        v-for="l in langs"
        :key="l.id"
        type="button"
        role="tab"
        :aria-selected="l.id === activeLang"
        :class="['model-picker__tab', { 'is-active': l.id === activeLang }]"
        @click="activeLang = l.id"
      >{{ l.label }}</button>
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
.model-picker__tabs {
  display: flex;
  gap: 4px;
  padding: 8px 12px;
  background: var(--vp-c-bg-mute);
  border-bottom: 1px solid var(--vp-c-divider);
}
.model-picker__tab {
  padding: 4px 12px;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: transparent;
  border: none;
  border-radius: var(--lurus-radius-sm);
  cursor: pointer;
  transition: background var(--lurus-dur-fast), color var(--lurus-dur-fast);
}
.model-picker__tab:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}
.model-picker__tab.is-active {
  background: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
  font-weight: 600;
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
