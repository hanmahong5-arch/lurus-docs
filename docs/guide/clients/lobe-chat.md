---
title: Lobe Chat 配置
description: 在 Lobe Chat 中配置 Lurus API 作为模型提供商。
---

<div class="lobe-page">

# Lobe Chat 配置

[Lobe Chat](https://lobehub.com) 是一款现代化的开源 AI 聊天应用。本页介绍在线一键配置与手动配置两种方式。

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">开始前</p>
<div class="lurus-callout__body">准备一个 Lurus <Term t="API Key">API Key</Term>。还没有？前往 <a href="/guide/get-api-key">获取 API Key</a>。</div>
</div>
</div>

## 在线配置

点击以下链接直接配置：

```
https://chat-preview.lobehub.com/?settings={"keyVaults":{"openai":{"apiKey":"YOUR_API_KEY","baseURL":"https://api.lurus.cn/v1"}}}
```

将 `YOUR_API_KEY` 替换为你的 API Key。

## 手动配置

<ol class="lurus-steps">
<li>

打开 Lobe Chat **设置**。

</li>
<li>

选择「**语言模型**」。

</li>
<li>

在 OpenAI 配置中填写：

- **API Key**：输入你的 Lurus API Key
- **API Proxy**：`https://api.lurus.cn/v1`

</li>
<li>

**保存**设置。

</li>
</ol>

## 使用建议

<div class="lurus-callout lurus-callout--tip">
<span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
<div>
<p class="lurus-callout__title">提示</p>
<div class="lurus-callout__body"><ul><li>Lobe Chat 默认使用 OpenAI 模型名，需要在对话中手动切换</li><li>推荐使用 <code>deepseek-chat</code> 获得最佳性价比</li></ul></div>
</div>
</div>

<NextSteps title="下一步" :steps="[
  { text: '浏览支持的模型', link: '/guide/models' },
  { text: '获取 API Key', link: '/guide/get-api-key' },
  { text: '查看 API 快速开始', link: '/guide/quickstart' }
]" />

</div>

<style scoped>
.lobe-page .lurus-steps { margin-top: 1rem; }
</style>
