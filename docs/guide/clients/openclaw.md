---
title: OpenClaw 配置
description: 把 OpenClaw 智能体的模型换成 Lurus API：一个 Key 用遍 DeepSeek、Gemini、GPT、Claude，国内直连，人民币计费。
---

# OpenClaw 配置

[OpenClaw](https://docs.openclaw.ai) 是开源、自托管的个人智能体（"龙虾"）。它支持任何 OpenAI 兼容的模型服务，所以接 Lurus API 只需要加一个自定义 provider。

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">开始前</p>
<div class="lurus-callout__body">准备一个 Lurus <Term t="API Key">API Key</Term>（格式 <code>sk-xxx</code>）。还没有？前往 <a href="/guide/get-api-key">获取 API Key</a>。建议给 OpenClaw 单独建一个令牌并设额度上限，智能体跑循环时不会把别的项目的额度用光。</div>
</div>
</div>

## 1. 把 Key 放进环境变量

```bash
export LURUS_API_KEY="sk-xxx"
```

## 2. 加 Lurus provider

用命令行合并进现有配置（不会覆盖你已有的 provider）：

```bash
openclaw config set models.providers.lurus '{
  "baseUrl": "https://hub.lurus.cn/v1",
  "apiKey": "${LURUS_API_KEY}",
  "api": "openai-completions",
  "models": [
    { "id": "deepseek-chat",          "name": "DeepSeek V3",      "contextWindow": 128000, "maxTokens": 8192 },
    { "id": "deepseek-reasoner",      "name": "DeepSeek R1",      "contextWindow": 128000, "maxTokens": 32000, "reasoning": true },
    { "id": "gemini-3-flash-preview", "name": "Gemini 3 Flash",   "contextWindow": 1000000, "maxTokens": 32000 }
  ]
}' --strict-json --merge
```

也可以直接编辑 `~/.openclaw/agents/<agentId>/agent/models.json`，在 `models.providers` 下写同样的内容，并保留 `"mode": "merge"`。

| 字段 | 值 |
|------|-----|
| `baseUrl` | `https://hub.lurus.cn/v1` |
| `apiKey` | `${LURUS_API_KEY}` |
| `api` | `openai-completions` |
| `models[].id` | Lurus 的模型 ID，见 [模型与价格](https://hub.lurus.cn/api/v1/models)（公开，人民币价格） |

## 3. 选模型并验证

在 OpenClaw 里把智能体的模型切到 `lurus/deepseek-chat`，发一句话试试。也可以先用 curl 确认 Key 可用：

```bash
curl https://hub.lurus.cn/v1/models -H "Authorization: Bearer $LURUS_API_KEY"
```

返回的就是这个 Key 当前能用的全部模型，想加哪个，把它的 `id` 补进上面的 `models` 列表即可。各模型价格见 [hub.lurus.cn/api/v1/models](https://hub.lurus.cn/api/v1/models)，每次调用返回的 `usage.cost` 是这次实际扣的钱。

## 选型建议

| 场景 | 推荐模型 | 原因 |
|------|---------|------|
| 日常对话、整理、写代码 | `deepseek-chat` | 便宜、中文好、速度快 |
| 多步规划、复杂推理 | `deepseek-reasoner` | 推理强，适合给智能体做计划 |
| 长文档、读网页 | `gemini-3-flash-preview` | 上下文长 |

## 想让龙虾断电也不丢任务？

OpenClaw 默认在单机上跑，进程一挂，进行到一半的长任务就没了。[Kova](/kova/) 是 Lurus 的智能体持久运行时，可以通过 ACP 直接驱动 OpenClaw，崩溃后从断点续跑、已完成的模型调用不会重复计费，用量和 Lurus API 记在同一个钱包里。

## 常见问题

**报 401**：Key 没生效。确认 `LURUS_API_KEY` 在启动 OpenClaw 的那个 shell 里已经 export。

**报 model not found**：`models[].id` 必须和 `/v1/models` 返回的完全一致，注意大小写和日期后缀。

**推理模型偶尔返回空内容**：`deepseek-reasoner` 会先输出推理过程，给它的 `maxTokens` 留足（上面示例是 32000），太小时正文可能被截掉。
