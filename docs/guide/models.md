---
title: 支持的模型
description: Lurus API 支持的所有 AI 模型列表，包括价格、上下文窗口和能力对比。
---

<script setup>
import { data } from '../.vitepress/data/models.data'
</script>

<div class="models-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> 模型目录</span>
  <h1 class="lurus-section-head__title">支持的模型</h1>
  <p class="lurus-section-head__lede">主流 AI 供应商的各类模型，按 <code>model</code> 名称统一接入；本页由 <code>data/models.yaml</code> 自动渲染，列表始终与数据文件同步。</p>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="filter" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">如何新增模型</p>
    <div class="lurus-callout__body">添加新模型只需编辑 <code>lurus-docs/data/models.yaml</code>，推送后 CI 自动构建更新。</div>
  </div>
</div>

## 模型列表

<ModelTable
  v-for="v in data.vendors"
  :key="v.name"
  :vendor="v.name"
  :tagline="v.tagline"
  :models="v.models"
/>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="search" :size="14" /> 选型指南</span>
  <h2 class="lurus-section-head__title">怎么选模型</h2>
  <p class="lurus-section-head__lede">从任务类型和预算两个角度快速定位。</p>
</div>

### 按任务选择

| 场景 | 推荐模型 |
|------|---------|
| 日常对话 | `deepseek-chat`（性价比最高） |
| 代码生成 | `deepseek-reasoner` / `gpt-4o` |
| 数学推理 | `deepseek-reasoner` / `claude-3-opus` |
| 长文档分析 | `gemini-3-pro-preview`（1M 上下文） |
| 创意写作 | `claude-3-5-sonnet` |
| 英文任务 | `gpt-4o` / `claude-3-5-sonnet` |
| 中文任务 | `deepseek-chat` |
| 图像理解 | `gemini-3-pro-image-preview` / `gpt-4o` |
| 图像生成 | `dall-e-3` / `midjourney` |

### 按预算选择

| 预算区间 | 推荐模型 |
|---------|---------|
| 低（&lt; ¥5/M tokens） | `deepseek-chat`、`gpt-3.5-turbo`、`gemini-3-flash-preview` |
| 中（¥5–20/M tokens） | `claude-3-sonnet`、`gemini-3-pro-preview`、`gpt-4o-mini` |
| 高（&gt; ¥20/M tokens） | `gpt-4o`、`claude-3-opus` |

## 切换模型

所有模型共享相同 API 格式，只需更换 `model` 字段（其余代码不变）：`client.chat.completions.create(model="deepseek-chat", ...)` → `model="gemini-3-pro-preview"`。

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">注意事项</p>
    <div class="lurus-callout__body"><ul><li><strong>模型可用性</strong>：<code>Beta</code> 状态为预览版，接口可能调整。</li><li><strong>配额限制</strong>：不同 API Key 可能有不同模型访问权限。</li><li><strong>价格变动</strong>：定价随供应商调整，以控制台显示为准。</li><li><strong>上下文限制</strong>：超出上下文长度的请求会被截断或返回错误。</li></ul></div>
  </div>
</div>

<NextSteps
  title="下一步"
  :steps="[
    { text: '快速开始', link: '/guide/quickstart', primary: true },
    { text: 'Chat Completions API', link: '/api/chat-completions' },
    { text: '常见问题', link: '/guide/faq' },
  ]"
/>

</div>
