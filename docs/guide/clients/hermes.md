---
title: Hermes Agent 配置
description: 在 Hermes Agent 中用 Lurus API 作为模型服务：改三行 config.yaml，国内直连，人民币计费。
---

# Hermes Agent 配置

[Hermes Agent](https://github.com/NousResearch/hermes-agent) 是 Nous Research 出的开源自托管智能体。它的 `custom` provider 支持任何 OpenAI 兼容端点，接 Lurus API 只要改 `~/.hermes/config.yaml`。

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">开始前</p>
<div class="lurus-callout__body">准备一个 Lurus <Term t="API Key">API Key</Term>（格式 <code>sk-xxx</code>）。还没有？前往 <a href="/guide/get-api-key">获取 API Key</a>。</div>
</div>
</div>

## 1. 写入 Key

在 `~/.hermes/.env` 里加一行（或者在 shell 里 export）：

```bash
LURUS_API_KEY=sk-xxx
```

## 2. 改 config.yaml

```yaml
model:
  provider: custom
  base_url: https://hub.lurus.cn/v1
  api_key: ${LURUS_API_KEY}
  default: deepseek-chat
  context_length: 128000
```

| 字段 | 值 |
|------|-----|
| `provider` | `custom` |
| `base_url` | `https://hub.lurus.cn/v1` |
| `default` | Lurus 的模型 ID，见 [模型与价格](https://hub.lurus.cn/api/v1/models)（公开，人民币价格） |
| `context_length` | 该模型的上下文长度。Hermes 至少需要约 64k，填小了会被截断 |

## 3. 运行

```bash
hermes
```

想先确认 Key 能用、看看有哪些模型：

```bash
curl https://hub.lurus.cn/v1/models -H "Authorization: Bearer $LURUS_API_KEY"
```

## 选型建议

| 场景 | 推荐模型 |
|------|---------|
| 默认 | `deepseek-chat` |
| 需要更强的规划 | `deepseek-reasoner` |
| 读长文档 | `gemini-3-flash-preview` |

## 长任务不中断

Hermes 跑长任务时进程退出就要从头来。[Kova](/kova/) 能通过 ACP 驱动 Hermes，崩溃后续跑，已完成的模型调用不重复计费，用量和 Lurus API 共用一个钱包。

## 常见问题

**回答被截断**：`context_length` 填小了，按模型实际上下文填写。

**报 401**：`.env` 里的变量名要和 `api_key: ${...}` 里的一致。
