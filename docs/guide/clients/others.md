---
title: 其他客户端
description: 在其他兼容 OpenAI API 的客户端中配置 Lurus API。
---

<div class="others-page">

# 其他客户端

任何支持 OpenAI API 的客户端都可以使用 Lurus API。下方给出通用配置参数、常见客户端清单与可直接复制的配置示例。

## 通用配置

只需把这两项填入客户端的 OpenAI 兼容设置：

| 配置项 | 值 |
|--------|-----|
| API Base URL | `https://api.lurus.cn/v1` |
| API Key | `sk-your-api-key` |

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">还没有 Key？</p>
<div class="lurus-callout__body">前往 <a href="/guide/get-api-key">获取 API Key</a>。模型名称可在 <a href="/guide/models">支持的模型</a> 查询。</div>
</div>
</div>

## 支持的客户端

<div class="lurus-h3">桌面应用</div>

<div class="lurus-cards lurus-cards--compact">
<a class="lurus-card lurus-card--api" href="/guide/clients/cherry-studio">
<span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
<div class="lurus-card__title">Cherry Studio</div>
<p class="lurus-card__body">跨平台，功能丰富</p>
</a>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
<div class="lurus-card__title">ChatBox</div>
<p class="lurus-card__body">简洁易用</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
<div class="lurus-card__title">BetterChatGPT</div>
<p class="lurus-card__body">开源免费</p>
</div>
</div>

<div class="lurus-h3">移动应用</div>

<div class="lurus-cards lurus-cards--compact">
<a class="lurus-card lurus-card--api" href="/guide/clients/opencat">
<span class="lurus-card__icon"><Icon name="smartphone" :size="20" /></span>
<div class="lurus-card__title">OpenCat</div>
<p class="lurus-card__body">iOS / macOS</p>
</a>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="smartphone" :size="20" /></span>
<div class="lurus-card__title">ChatGPT Next Web</div>
<p class="lurus-card__body">PWA</p>
</div>
</div>

<div class="lurus-h3">Web 应用</div>

<div class="lurus-cards lurus-cards--compact">
<a class="lurus-card lurus-card--api" href="/guide/clients/lobe-chat">
<span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
<div class="lurus-card__title">Lobe Chat</div>
<p class="lurus-card__body">现代化开源聊天 UI</p>
</a>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
<div class="lurus-card__title">ChatGPT Web</div>
<p class="lurus-card__body">浏览器端</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="server" :size="20" /></span>
<div class="lurus-card__title">Open WebUI</div>
<p class="lurus-card__body">自托管</p>
</div>
</div>

<div class="lurus-h3">IDE 插件</div>

<div class="lurus-cards lurus-cards--compact">
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">Continue</div>
<p class="lurus-card__body">VS Code</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">Codeium</div>
<p class="lurus-card__body">IDE 补全</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">Cursor</div>
<p class="lurus-card__body">AI 编辑器</p>
</div>
</div>

<div class="lurus-h3">命令行工具</div>

<div class="lurus-cards lurus-cards--compact">
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">llm-cli</div>
<p class="lurus-card__body">终端调用</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">aichat</div>
<p class="lurus-card__body">终端调用</p>
</div>
</div>

## 配置示例

### Cursor

<ol class="lurus-steps">
<li>

打开 **设置 → OpenAI API**。

</li>
<li>

**API Key**：输入 Lurus Key。

</li>
<li>

**Base URL**：`https://api.lurus.cn/v1`。

</li>
</ol>

### Continue (VS Code)

编辑 `~/.continue/config.json`：

```json
{
  "models": [
    {
      "title": "Lurus DeepSeek",
      "provider": "openai",
      "model": "deepseek-chat",
      "apiBase": "https://api.lurus.cn/v1",
      "apiKey": "sk-your-api-key"
    }
  ]
}
```

## 不支持的功能

部分客户端特有功能可能不完全兼容：

<div class="lurus-callout lurus-callout--warn">
<span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
<div>
<p class="lurus-callout__title">兼容性提醒</p>
<div class="lurus-callout__body"><ul><li>实时语音对话</li><li>图像编辑</li><li>特定厂商的专有 API</li></ul><p>如有问题，请联系技术支持。</p></div>
</div>
</div>

<NextSteps title="下一步" :steps="[
  { text: '浏览支持的模型', link: '/guide/models' },
  { text: '获取 API Key', link: '/guide/get-api-key' },
  { text: '查看 API 快速开始', link: '/guide/quickstart' }
]" />

</div>

<style scoped>
.others-page .lurus-h3 { margin-top: 1.6rem; }
.others-page .lurus-steps { margin-top: 1rem; }
</style>
