---
title: 数据结构 / Schema 参考
description: Lurus API 请求与响应的数据结构，由 OpenAPI 规范（relay.json）自动同步生成，始终与网关实现一致。
---

<div class="api-schemas-page">

# 数据结构参考

以下请求 / 响应数据结构由 newapi 的 OpenAPI 规范（`relay.json`）**自动同步生成**，始终与网关实现保持一致。完整端点列表见 [API 概述](/api/overview)，调用示例见 [Chat Completions](/api/chat-completions)。

::: info 如何更新
本页 `<!-- sync:schemas -->` 标记区由 `bun run sync` 从 `2b-svc-newapi/docs/openapi/relay.json` 重新生成，请勿手动编辑该区域。
:::

<!-- sync:schemas:start -->
_共 35 个数据结构（由 OpenAPI 规范自动生成）。_

<details class="lurus-faq-item">
<summary><code>AudioTranscriptionResponse</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `text` | string | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ChatCompletionRequest</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `model` | string | 是 | 模型 ID |
| `messages` | array&lt;Message&gt; | 是 | 对话消息列表 |
| `temperature` | number | — | 采样温度 |
| `top_p` | number | — | 核采样参数 |
| `n` | integer | — | 生成数量 |
| `stream` | boolean | — | 是否流式响应 |
| `stream_options` | object | — |  |
| `stop` | string \| array&lt;string&gt; | — | 停止序列 |
| `max_tokens` | integer | — | 最大生成 Token 数 |
| `max_completion_tokens` | integer | — | 最大补全 Token 数 |
| `presence_penalty` | number | — |  |
| `frequency_penalty` | number | — |  |
| `logit_bias` | object | — |  |
| `user` | string | — |  |
| `tools` | array&lt;Tool&gt; | — |  |
| `tool_choice` | string (`none` / `auto` / `required`) \| object | — |  |
| `response_format` | ResponseFormat | — |  |
| `seed` | integer | — |  |
| `reasoning_effort` | string (`low` / `medium` / `high`) | — | 推理强度 (用于支持推理的模型) |
| `modalities` | array&lt;string (`text` / `audio`)&gt; | — |  |
| `audio` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ChatCompletionResponse</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | — |  |
| `object` | string | — |  |
| `created` | integer | — |  |
| `model` | string | — |  |
| `choices` | array&lt;object&gt; | — |  |
| `usage` | Usage | — |  |
| `system_fingerprint` | string | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ClaudeMessage</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `role` | string (`user` / `assistant`) | 是 |  |
| `content` | string \| array&lt;object&gt; | 是 |  |

</details>

<details class="lurus-faq-item">
<summary><code>ClaudeRequest</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `model` | string | 是 |  |
| `messages` | array&lt;ClaudeMessage&gt; | 是 |  |
| `system` | string \| array&lt;object&gt; | — |  |
| `cache_control` | object | — |  |
| `inference_geo` | string | — |  |
| `max_tokens` | integer | 是 |  |
| `temperature` | number | — |  |
| `top_p` | number | — |  |
| `top_k` | integer | — |  |
| `stream` | boolean | — |  |
| `stop_sequences` | array&lt;string&gt; | — |  |
| `tools` | array&lt;object&gt; | — |  |
| `tool_choice` | object | — |  |
| `thinking` | object | — |  |
| `context_management` | object | — |  |
| `output_config` | object | — |  |
| `output_format` | object | — |  |
| `container` | string \| object | — |  |
| `mcp_servers` | array&lt;object&gt; | — |  |
| `metadata` | object | — |  |
| `speed` | string (`standard` / `fast`) | — |  |
| `service_tier` | string (`auto` / `standard_only`) | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ClaudeResponse</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | — |  |
| `type` | string | — |  |
| `role` | string | — |  |
| `content` | array&lt;object&gt; | — |  |
| `model` | string | — |  |
| `stop_reason` | string (`end_turn` / `max_tokens` / `stop_sequence` / `tool_use`) | — |  |
| `usage` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>CompletionRequest</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `model` | string | 是 |  |
| `prompt` | string \| array&lt;string&gt; | 是 |  |
| `max_tokens` | integer | — |  |
| `temperature` | number | — |  |
| `top_p` | number | — |  |
| `n` | integer | — |  |
| `stream` | boolean | — |  |
| `stop` | string \| array&lt;string&gt; | — |  |
| `suffix` | string | — |  |
| `echo` | boolean | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>CompletionResponse</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | — |  |
| `object` | string | — |  |
| `created` | integer | — |  |
| `model` | string | — |  |
| `choices` | array&lt;object&gt; | — |  |
| `usage` | Usage | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>EmbeddingRequest</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `model` | string | 是 |  |
| `input` | string \| array&lt;string&gt; | 是 | 要嵌入的文本 |
| `encoding_format` | string (`float` / `base64`) | — |  |
| `dimensions` | integer | — | 输出向量维度 |

</details>

<details class="lurus-faq-item">
<summary><code>EmbeddingResponse</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `object` | string | — |  |
| `data` | array&lt;object&gt; | — |  |
| `model` | string | — |  |
| `usage` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>GeminiModelsResponse</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `models` | array&lt;object&gt; | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>GeminiResponse</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `candidates` | array&lt;object&gt; | — |  |
| `usageMetadata` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ImageResponse</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `created` | integer | — |  |
| `data` | array&lt;object&gt; | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>Message</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `role` | string (`system` / `user` / `assistant` / `tool` / `developer`) | 是 | 消息角色 |
| `content` | string \| array&lt;MessageContent&gt; | 是 | 消息内容 |
| `name` | string | — | 发送者名称 |
| `tool_calls` | array&lt;ToolCall&gt; | — |  |
| `tool_call_id` | string | — | 工具调用 ID（用于 tool 角色消息） |
| `reasoning_content` | string | — | 推理内容 |

</details>

<details class="lurus-faq-item">
<summary><code>MessageContent</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | string (`text` / `image_url` / `input_audio` / `file` / `video_url`) | — |  |
| `text` | string | — |  |
| `image_url` | object | — |  |
| `input_audio` | object | — |  |
| `file` | object | — |  |
| `video_url` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>Model</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | — | 模型 ID |
| `object` | string | — | 对象类型 |
| `created` | integer | — | 创建时间戳 |
| `owned_by` | string | — | 模型所有者 |

</details>

<details class="lurus-faq-item">
<summary><code>ModelsResponse</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `object` | string | — |  |
| `data` | array&lt;Model&gt; | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ModerationRequest</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `input` | string \| array&lt;string&gt; | 是 |  |
| `model` | string | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ModerationResponse</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | — |  |
| `model` | string | — |  |
| `results` | array&lt;object&gt; | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>RerankRequest</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `model` | string | 是 |  |
| `query` | string | 是 | 查询文本 |
| `documents` | array&lt;string \| object&gt; | 是 | 要重排序的文档列表 |
| `top_n` | integer | — | 返回前 N 个结果 |
| `return_documents` | boolean | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>RerankResponse</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | — |  |
| `results` | array&lt;object&gt; | — |  |
| `meta` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ResponseFormat</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | string (`text` / `json_object` / `json_schema`) | — |  |
| `json_schema` | object | — | JSON Schema 定义 |

</details>

<details class="lurus-faq-item">
<summary><code>ResponsesCompactionRequest</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `model` | string | 是 |  |
| `input` | string \| array&lt;object&gt; | — | 输入内容，可以是字符串或消息数组 |
| `instructions` | string | — |  |
| `previous_response_id` | string | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ResponsesCompactionResponse</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | — |  |
| `object` | string | — |  |
| `created_at` | integer | — |  |
| `output` | array&lt;object&gt; | — |  |
| `usage` | Usage | — |  |
| `error` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ResponsesRequest</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `model` | string | 是 |  |
| `input` | string \| array&lt;object&gt; | — | 输入内容，可以是字符串或消息数组 |
| `instructions` | string | — |  |
| `max_output_tokens` | integer | — |  |
| `temperature` | number | — |  |
| `top_p` | number | — |  |
| `stream` | boolean | — |  |
| `tools` | array&lt;object&gt; | — |  |
| `tool_choice` | string \| object | — |  |
| `reasoning` | object | — |  |
| `previous_response_id` | string | — |  |
| `truncation` | string (`auto` / `disabled`) | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ResponsesResponse</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | — |  |
| `object` | string | — |  |
| `created_at` | integer | — |  |
| `status` | string (`completed` / `failed` / `in_progress` / `incomplete`) | — |  |
| `model` | string | — |  |
| `output` | array&lt;object&gt; | — |  |
| `usage` | Usage | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>SpeechRequest</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `model` | string | 是 |  |
| `input` | string | 是 | 要转换的文本 |
| `voice` | string (`alloy` / `echo` / `fable` / `onyx` / `nova` / `shimmer`) | 是 |  |
| `response_format` | string (`mp3` / `opus` / `aac` / `flac` / `wav` / `pcm`) | — |  |
| `speed` | number | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>Tool</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | string | — |  |
| `function` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ToolCall</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | — |  |
| `type` | string | — |  |
| `function` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>Usage</code></summary>

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `prompt_tokens` | integer | — | 提示词 Token 数 |
| `completion_tokens` | integer | — | 补全 Token 数 |
| `total_tokens` | integer | — | 总 Token 数 |
| `prompt_tokens_details` | object | — |  |
| `completion_tokens_details` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>VideoRequest</code></summary>

视频生成请求

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `model` | string | — | 模型/风格 ID |
| `prompt` | string | — | 文本描述提示词 |
| `image` | string | — | 图片输入 (URL 或 Base64) |
| `duration` | number | — | 视频时长（秒） |
| `width` | integer | — | 视频宽度 |
| `height` | integer | — | 视频高度 |
| `fps` | integer | — | 视频帧率 |
| `seed` | integer | — | 随机种子 |
| `n` | integer | — | 生成视频数量 |
| `response_format` | string | — | 响应格式 |
| `user` | string | — | 用户标识 |
| `metadata` | object | — | 扩展参数 (如 negative_prompt, style, quality_level 等) |

</details>

<details class="lurus-faq-item">
<summary><code>VideoResponse</code></summary>

视频生成任务提交响应

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `task_id` | string | — | 任务 ID |
| `status` | string | — | 任务状态 |

</details>

<details class="lurus-faq-item">
<summary><code>VideoTaskError</code></summary>

视频任务错误信息

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `code` | integer | — | 错误码 |
| `message` | string | — | 错误信息 |

</details>

<details class="lurus-faq-item">
<summary><code>VideoTaskMetadata</code></summary>

视频任务元数据

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `duration` | number | — | 实际生成的视频时长 |
| `fps` | integer | — | 实际帧率 |
| `width` | integer | — | 实际宽度 |
| `height` | integer | — | 实际高度 |
| `seed` | integer | — | 使用的随机种子 |

</details>

<details class="lurus-faq-item">
<summary><code>VideoTaskResponse</code></summary>

视频任务状态查询响应

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `task_id` | string | — | 任务 ID |
| `status` | string (`queued` / `in_progress` / `completed` / `failed`) | — | 任务状态 |
| `url` | string | — | 视频资源 URL（成功时） |
| `format` | string | — | 视频格式 |
| `metadata` | VideoTaskMetadata | — |  |
| `error` | VideoTaskError | — |  |

</details>
<!-- sync:schemas:end -->

<NextSteps
  title="下一步"
  :steps="[
    { text: 'API 概述', link: '/api/overview', primary: true },
    { text: 'Chat Completions', link: '/api/chat-completions' },
    { text: '错误处理', link: '/api/errors' },
  ]"
/>

</div>
