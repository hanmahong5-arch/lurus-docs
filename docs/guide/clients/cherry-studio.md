---
title: Cherry Studio 配置
description: 在 Cherry Studio 中配置 Lurus API，一键接入 50+ AI 模型。
---

<div class="cherry-page">

# Cherry Studio 配置

[Cherry Studio](https://cherry-ai.com) 是一款优秀的跨平台 AI 客户端，支持多种模型供应商。本页带你在几分钟内接入 Lurus API。

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">开始前</p>
<div class="lurus-callout__body">准备一个 Lurus <Term t="API Key">API Key</Term>（格式 <code>sk-xxx</code>）。还没有？前往 <a href="/guide/get-api-key">获取 API Key</a>。</div>
</div>
</div>

## 配置步骤

<ol class="lurus-steps">
<li>

打开 Cherry Studio **设置**。

</li>
<li>

选择「**API 提供商**」。

</li>
<li>

点击「**添加自定义供应商**」。

</li>
<li>

填写以下信息：

| 字段 | 值 |
|------|-----|
| 名称 | Lurus API |
| API Base URL | `https://api.lurus.cn/v1` |
| API Key | 你的 API Key (`sk-xxx`) |

</li>
<li>

**保存**配置。

</li>
</ol>

## 快速配置链接

点击以下链接可快速导入配置：

```
cherrystudio://providers/api-keys?v=1&data={cherryConfig}
```

将 `{cherryConfig}` 替换为你的配置信息。

## 选择模型

配置完成后，在 Cherry Studio 中选择 **Lurus API** 作为供应商，即可使用所有支持的模型。完整列表见 [支持的模型](/guide/models)。

## 常见问题

<details class="lurus-faq-item">
<summary>连接失败？</summary>

- 检查 API Key 是否正确
- 确认网络连接正常
- 检查 Base URL 是否正确（`https://api.lurus.cn/v1`）

</details>

<details class="lurus-faq-item">
<summary>模型列表为空？</summary>

尝试在设置中手动刷新模型列表，或手动输入模型名称如 `deepseek-chat`。

</details>

<NextSteps title="下一步" :steps="[
  { text: '浏览支持的模型', link: '/guide/models' },
  { text: '获取 API Key', link: '/guide/get-api-key' },
  { text: '查看 API 快速开始', link: '/guide/quickstart' }
]" />

</div>

<style scoped>
.cherry-page .lurus-steps { margin-top: 1rem; }
</style>
