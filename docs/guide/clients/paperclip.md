---
title: Paperclip 配置
description: 让 Paperclip 里的智能体员工用 Lurus API 干活：每个智能体一把限额 Key，花费在网关上硬封顶，国内直连，人民币计费。
---

# Paperclip 配置

[Paperclip](https://github.com/paperclipai/paperclip) 是开源（MIT）的智能体编排平台：给一家"公司"定目标、搭组织架构、雇智能体员工，按任务和定时例程让它们干活。它自己不带模型，模型由每个智能体所用的运行时（OpenCode、Hermes、OpenClaw 等）决定。

本页用 Paperclip 内置的 OpenCode 运行时接 Lurus API。用 Hermes 或 OpenClaw 的智能体，按 [Hermes 配置](/guide/clients/hermes) 或 [OpenClaw 配置](/guide/clients/openclaw) 改它们自己的配置即可，Paperclip 这边不用动。

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">开始前</p>
<div class="lurus-callout__body">准备 Lurus <Term t="API Key">API Key</Term>（格式 <code>sk-xxx</code>），建议每个智能体一把，原因见下方「给每个智能体封顶」。还没有？前往 <a href="/guide/get-api-key">获取 API Key</a>。</div>
</div>
</div>

## 1. 给智能体加两个环境变量

在 Paperclip 里打开这个智能体的设置，运行时选 **OpenCode**，在环境变量里加：

| 变量 | 值 |
|------|-----|
| `LURUS_API_KEY` | 这个智能体专用的 Key（`sk-xxx`），可以用 Paperclip 的密钥引用代替明文 |
| `PAPERCLIP_OPENCODE_PROVIDERS` | 下面这段 JSON |

```json
{
  "lurus": {
    "npm": "@ai-sdk/openai-compatible",
    "name": "Lurus API",
    "options": {
      "baseURL": "https://hub.lurus.cn/v1",
      "apiKey": "{env:LURUS_API_KEY}"
    },
    "models": {
      "deepseek-chat": { "name": "DeepSeek Chat" },
      "deepseek-reasoner": { "name": "DeepSeek Reasoner" }
    }
  }
}
```

`PAPERCLIP_OPENCODE_PROVIDERS` 是 Paperclip 给 OpenCode 注入自定义模型网关的官方入口，`{env:LURUS_API_KEY}` 由 Paperclip 在服务端替换成真实 Key。`models` 里只需列出你要用的模型，ID 见 [模型与价格](https://hub.lurus.cn/api/v1/models)。

想让公司里所有 OpenCode 智能体都走 Lurus，也可以把这两个变量设在 Paperclip 服务进程上；但那样所有智能体共用一把 Key，下面的封顶就只能按整个公司算。

## 2. 选模型

智能体的模型填 `provider/model` 格式：

```
lurus/deepseek-chat
```

保存后点一次 **测试**，或者先在终端确认 Key 能用：

```bash
curl https://hub.lurus.cn/v1/models -H "Authorization: Bearer $LURUS_API_KEY"
```

## 3. 给每个智能体封顶

Paperclip 的预算按已记录的花费计算，它自己的文档也写明：用量回报和进行中的任务会让暂停晚一步。自定义网关的模型没有内置单价，这些运行在 Paperclip 里会记为「未计价」，预算条不会动。

所以真正的上限放在网关上：在 [Hub 控制台](https://hub.lurus.cn) 给每个智能体的 Key 设 **总额度上限**。额度用完，Lurus 直接拒绝请求，智能体当次运行失败并在 Paperclip 里留下记录，不会再多花一分钱。实际花了多少，以 Hub 控制台和 [Lurus 钱包](https://identity.lurus.cn/wallet) 的扣费为准。

| 场景 | 建议 |
|------|------|
| 新雇的智能体试运行 | Key 设一个小额度，跑几天看实际花费再调 |
| 24 小时定时例程 | 每个例程的智能体单独一把 Key，跑飞了只烧它自己的额度 |
| 余额快用完 | 所有 Key 共用一个钱包，到 [钱包充值](https://identity.lurus.cn/topup) 补上 |

## 选型建议

| 角色 | 推荐模型 |
|------|---------|
| 写代码、处理工单的执行者 | `deepseek-chat` |
| CEO、规划类角色 | `deepseek-reasoner` |

## 常见问题

**报 Model not found**：`models` 里没列这个模型。Paperclip 会把智能体当前选的模型自动补进去，但模型 ID 要和 Hub 返回的完全一致。

**报 401**：`LURUS_API_KEY` 没加在这个智能体上，或者 Key 已过期、被禁用。

**报额度不足**：这把 Key 的总额度上限用完了，或者钱包余额不足。在 Hub 控制台调高额度，或者先充值。
