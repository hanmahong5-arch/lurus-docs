---
title: Supported Models
description: A complete list of AI models supported by the Lurus API, including pricing, context windows, and capability comparisons.
---

<script setup>
import { data } from '../../.vitepress/data/models.data'
</script>

<div class="models-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Model Catalog</span>
  <h1 class="lurus-section-head__title">Supported Models</h1>
  <p class="lurus-section-head__lede">Models from all major AI providers, unified under a single <code>model</code> name. This page is auto-rendered from <code>data/models.yaml</code>, so the list always stays in sync with the data file.</p>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="filter" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">How to add a model</p>
    <div class="lurus-callout__body">To add a new model, just edit <code>lurus-docs/data/models.yaml</code>. After you push, CI builds and updates automatically.</div>
  </div>
</div>

## Model List

<ModelTable
  v-for="v in data.vendors"
  :key="v.name"
  :vendor="v.name"
  :tagline="v.tagline"
  :models="v.models"
/>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="search" :size="14" /> Selection Guide</span>
  <h2 class="lurus-section-head__title">How to Choose a Model</h2>
  <p class="lurus-section-head__lede">Quickly narrow it down from two angles: task type and budget.</p>
</div>

### By Task

| Scenario | Recommended Model |
|------|---------|
| Everyday chat | `deepseek-chat` (best value) |
| Code generation | `deepseek-reasoner` / `gpt-4o` |
| Math reasoning | `deepseek-reasoner` / `claude-3-opus` |
| Long-document analysis | `gemini-3-pro-preview` (1M context) |
| Creative writing | `claude-3-5-sonnet` |
| English tasks | `gpt-4o` / `claude-3-5-sonnet` |
| Chinese tasks | `deepseek-chat` |
| Image understanding | `gemini-3-pro-image-preview` / `gpt-4o` |
| Image generation | `dall-e-3` / `midjourney` |

### By Budget

| Budget Range | Recommended Model |
|---------|---------|
| Low (&lt; ¥5/M tokens) | `deepseek-chat`, `gpt-3.5-turbo`, `gemini-3-flash-preview` |
| Medium (¥5–20/M tokens) | `claude-3-sonnet`, `gemini-3-pro-preview`, `gpt-4o-mini` |
| High (&gt; ¥20/M tokens) | `gpt-4o`, `claude-3-opus` |

## Switching Models

All models share the same API format. Just change the `model` field (the rest of your code stays the same): `client.chat.completions.create(model="deepseek-chat", ...)` → `model="gemini-3-pro-preview"`.

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Things to note</p>
    <div class="lurus-callout__body"><ul><li><strong>Model availability</strong>: A <code>Beta</code> status means a preview release whose interface may change.</li><li><strong>Quota limits</strong>: Different API keys may have different model access permissions.</li><li><strong>Price changes</strong>: Pricing changes as providers adjust it; the console display is authoritative.</li><li><strong>Context limits</strong>: Requests that exceed the context length are truncated or return an error.</li></ul></div>
  </div>
</div>

<NextSteps
  title="Next Steps"
  :steps="[
    { text: 'Quickstart', link: '/en/guide/quickstart', primary: true },
    { text: 'Chat Completions API', link: '/en/api/chat-completions' },
    { text: 'FAQ', link: '/en/guide/faq' },
  ]"
/>

</div>
