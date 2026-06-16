---
title: データ構造 / Schema リファレンス
description: Lurus API のリクエスト・レスポンスのデータ構造。OpenAPI 仕様（relay.json）から自動同期生成され、常にゲートウェイの実装と一致します。
---

<div class="api-schemas-page">

# データ構造リファレンス

以下のリクエスト / レスポンスのデータ構造は、newapi の <Term t="OpenAPI">OpenAPI</Term> 仕様（`relay.json`）から**自動同期生成**され、常にゲートウェイの実装と一致します。完全なエンドポイント一覧は [API 概要](/ja/api/overview)、呼び出し例は [Chat Completions](/ja/api/chat-completions) を参照してください。

::: info 更新方法
本ページの `<!-- sync:schemas -->` マーカー領域は `bun run sync` により `2b-svc-newapi/docs/openapi/relay.json` から再生成されます。この領域を手動で編集しないでください。
:::

<!-- sync:schemas:start -->
_計 35 個のデータ構造（OpenAPI 仕様から自動生成）。_

<details class="lurus-faq-item">
<summary><code>AudioTranscriptionResponse</code></summary>

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `text` | string | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ChatCompletionRequest</code></summary>

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `model` | string | はい | モデル ID |
| `messages` | array&lt;Message&gt; | はい | 会話メッセージのリスト |
| `temperature` | number | — | サンプリング温度 |
| `top_p` | number | — | 核サンプリングパラメータ |
| `n` | integer | — | 生成数 |
| `stream` | boolean | — | ストリーミングレスポンスを使用するか |
| `stream_options` | object | — |  |
| `stop` | string \| array&lt;string&gt; | — | 停止シーケンス |
| `max_tokens` | integer | — | 最大生成 Token 数 |
| `max_completion_tokens` | integer | — | 最大補完 Token 数 |
| `presence_penalty` | number | — |  |
| `frequency_penalty` | number | — |  |
| `logit_bias` | object | — |  |
| `user` | string | — |  |
| `tools` | array&lt;Tool&gt; | — |  |
| `tool_choice` | string (`none` / `auto` / `required`) \| object | — |  |
| `response_format` | ResponseFormat | — |  |
| `seed` | integer | — |  |
| `reasoning_effort` | string (`low` / `medium` / `high`) | — | 推論強度（推論をサポートするモデル向け） |
| `modalities` | array&lt;string (`text` / `audio`)&gt; | — |  |
| `audio` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ChatCompletionResponse</code></summary>

| フィールド | 型 | 必須 | 説明 |
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

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `role` | string (`user` / `assistant`) | はい |  |
| `content` | string \| array&lt;object&gt; | はい |  |

</details>

<details class="lurus-faq-item">
<summary><code>ClaudeRequest</code></summary>

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `model` | string | はい |  |
| `messages` | array&lt;ClaudeMessage&gt; | はい |  |
| `system` | string \| array&lt;object&gt; | — |  |
| `cache_control` | object | — |  |
| `inference_geo` | string | — |  |
| `max_tokens` | integer | はい |  |
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

| フィールド | 型 | 必須 | 説明 |
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

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `model` | string | はい |  |
| `prompt` | string \| array&lt;string&gt; | はい |  |
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

| フィールド | 型 | 必須 | 説明 |
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

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `model` | string | はい |  |
| `input` | string \| array&lt;string&gt; | はい | 埋め込み対象のテキスト |
| `encoding_format` | string (`float` / `base64`) | — |  |
| `dimensions` | integer | — | 出力ベクトルの次元数 |

</details>

<details class="lurus-faq-item">
<summary><code>EmbeddingResponse</code></summary>

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `object` | string | — |  |
| `data` | array&lt;object&gt; | — |  |
| `model` | string | — |  |
| `usage` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>GeminiModelsResponse</code></summary>

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `models` | array&lt;object&gt; | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>GeminiResponse</code></summary>

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `candidates` | array&lt;object&gt; | — |  |
| `usageMetadata` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ImageResponse</code></summary>

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `created` | integer | — |  |
| `data` | array&lt;object&gt; | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>Message</code></summary>

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `role` | string (`system` / `user` / `assistant` / `tool` / `developer`) | はい | メッセージのロール |
| `content` | string \| array&lt;MessageContent&gt; | はい | メッセージの内容 |
| `name` | string | — | 送信者名 |
| `tool_calls` | array&lt;ToolCall&gt; | — |  |
| `tool_call_id` | string | — | ツール呼び出し ID（tool ロールのメッセージで使用） |
| `reasoning_content` | string | — | 推論内容 |

</details>

<details class="lurus-faq-item">
<summary><code>MessageContent</code></summary>

| フィールド | 型 | 必須 | 説明 |
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

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `id` | string | — | モデル ID |
| `object` | string | — | オブジェクトタイプ |
| `created` | integer | — | 作成タイムスタンプ |
| `owned_by` | string | — | モデルの所有者 |

</details>

<details class="lurus-faq-item">
<summary><code>ModelsResponse</code></summary>

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `object` | string | — |  |
| `data` | array&lt;Model&gt; | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ModerationRequest</code></summary>

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `input` | string \| array&lt;string&gt; | はい |  |
| `model` | string | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ModerationResponse</code></summary>

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `id` | string | — |  |
| `model` | string | — |  |
| `results` | array&lt;object&gt; | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>RerankRequest</code></summary>

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `model` | string | はい |  |
| `query` | string | はい | クエリテキスト |
| `documents` | array&lt;string \| object&gt; | はい | 再ランク付けするドキュメントのリスト |
| `top_n` | integer | — | 上位 N 件の結果を返す |
| `return_documents` | boolean | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>RerankResponse</code></summary>

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `id` | string | — |  |
| `results` | array&lt;object&gt; | — |  |
| `meta` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ResponseFormat</code></summary>

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `type` | string (`text` / `json_object` / `json_schema`) | — |  |
| `json_schema` | object | — | JSON Schema 定義 |

</details>

<details class="lurus-faq-item">
<summary><code>ResponsesCompactionRequest</code></summary>

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `model` | string | はい |  |
| `input` | string \| array&lt;object&gt; | — | 入力内容。文字列またはメッセージ配列を指定できます |
| `instructions` | string | — |  |
| `previous_response_id` | string | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ResponsesCompactionResponse</code></summary>

| フィールド | 型 | 必須 | 説明 |
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

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `model` | string | はい |  |
| `input` | string \| array&lt;object&gt; | — | 入力内容。文字列またはメッセージ配列を指定できます |
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

| フィールド | 型 | 必須 | 説明 |
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

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `model` | string | はい |  |
| `input` | string | はい | 変換対象のテキスト |
| `voice` | string (`alloy` / `echo` / `fable` / `onyx` / `nova` / `shimmer`) | はい |  |
| `response_format` | string (`mp3` / `opus` / `aac` / `flac` / `wav` / `pcm`) | — |  |
| `speed` | number | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>Tool</code></summary>

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `type` | string | — |  |
| `function` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ToolCall</code></summary>

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `id` | string | — |  |
| `type` | string | — |  |
| `function` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>Usage</code></summary>

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `prompt_tokens` | integer | — | プロンプトの Token 数 |
| `completion_tokens` | integer | — | 補完の Token 数 |
| `total_tokens` | integer | — | 合計 Token 数 |
| `prompt_tokens_details` | object | — |  |
| `completion_tokens_details` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>VideoRequest</code></summary>

動画生成リクエスト

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `model` | string | — | モデル / スタイル ID |
| `prompt` | string | — | テキスト記述プロンプト |
| `image` | string | — | 画像入力（URL または Base64） |
| `duration` | number | — | 動画の長さ（秒） |
| `width` | integer | — | 動画の幅 |
| `height` | integer | — | 動画の高さ |
| `fps` | integer | — | 動画のフレームレート |
| `seed` | integer | — | 乱数シード |
| `n` | integer | — | 生成する動画の数 |
| `response_format` | string | — | レスポンス形式 |
| `user` | string | — | ユーザー識別子 |
| `metadata` | object | — | 拡張パラメータ（negative_prompt、style、quality_level など） |

</details>

<details class="lurus-faq-item">
<summary><code>VideoResponse</code></summary>

動画生成タスク投入レスポンス

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `task_id` | string | — | タスク ID |
| `status` | string | — | タスクの状態 |

</details>

<details class="lurus-faq-item">
<summary><code>VideoTaskError</code></summary>

動画タスクのエラー情報

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `code` | integer | — | エラーコード |
| `message` | string | — | エラーメッセージ |

</details>

<details class="lurus-faq-item">
<summary><code>VideoTaskMetadata</code></summary>

動画タスクのメタデータ

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `duration` | number | — | 実際に生成された動画の長さ |
| `fps` | integer | — | 実際のフレームレート |
| `width` | integer | — | 実際の幅 |
| `height` | integer | — | 実際の高さ |
| `seed` | integer | — | 使用された乱数シード |

</details>

<details class="lurus-faq-item">
<summary><code>VideoTaskResponse</code></summary>

動画タスク状態照会レスポンス

| フィールド | 型 | 必須 | 説明 |
|------|------|------|------|
| `task_id` | string | — | タスク ID |
| `status` | string (`queued` / `in_progress` / `completed` / `failed`) | — | タスクの状態 |
| `url` | string | — | 動画リソースの URL（成功時） |
| `format` | string | — | 動画フォーマット |
| `metadata` | VideoTaskMetadata | — |  |
| `error` | VideoTaskError | — |  |

</details>
<!-- sync:schemas:end -->

<NextSteps
  title="次のステップ"
  :steps="[
    { text: 'API 概要', link: '/ja/api/overview', primary: true },
    { text: 'Chat Completions', link: '/ja/api/chat-completions' },
    { text: '連携と MCP カタログ', link: '/integrations/' },
    { text: 'エラー処理', link: '/ja/api/errors' },
  ]"
/>

</div>
