---
title: API 概要
description: Lurus API の基本情報。Base URL、リクエスト形式、エンドポイント一覧を含みます。
---

<div class="api-overview-page">

<ProductHero product-id="api-ref" />

Lurus API は OpenAI API 形式と完全に互換性があり、OpenAI に対応した任意の SDK やツールでそのまま呼び出せます。

<CapabilityGrid
  accent="var(--lurus-color-api-ref)"
  title="Lurus API を使う理由"
  :items="[
    { title: 'OpenAI 互換', body: 'すべてのエンドポイントのパスとセマンティクスが OpenAI に揃っており、SDK は base_url を差し替えるだけでそのまま利用可能', icon: 'shuffle' },
    { title: '完全なエラーコード', body: '各エラーに code + message + 推奨アクションが付与され、自動処理が容易', icon: 'alert-circle' },
    { title: '多様な認証', body: 'Bearer Token / PAT / JWT に対応し、スクリプトから企業 SSO まで全方位をカバー', icon: 'key' },
    { title: 'モデルルーティングとリトライ', body: 'モデル名に応じて上流チャネルへ自動ルーティングし、失敗時は予備へ自動切り替え', icon: 'shuffle' },
  ]"
/>

## 接続の 3 ステップ {#quickstart}

<ol class="lurus-steps">
<li>

base URL を `https://api.lurus.cn/v1` に向けます。

</li>
<li>

リクエストヘッダーに `Authorization: Bearer sk-your-api-key` を付与します（[API Key を取得](/ja/guide/get-api-key)）。

</li>
<li>

任意の OpenAI SDK でリクエストを送信します。ビジネスコードの変更は不要です。下記の [SDK サポート](#sdk-サポート) を参照してください。

</li>
</ol>

## Base URL

```
https://api.lurus.cn/v1
```

## 認証方式

すべての API リクエストは Header に API Key を付与する必要があります：

```http
Authorization: Bearer sk-your-api-key
```

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">認証は API Key だけではありません</p>
    <div class="lurus-callout__body">Bearer Token のほか、OIDC / OAuth2、PAT、JWT にも対応しています。詳しくは <a href="/ja/api/authentication">認証の詳細</a> を参照してください。</div>
  </div>
</div>

## 利用可能なエンドポイント

<!-- sync:endpoints:start -->
**モデル一覧の取得**

<ApiEndpoint method="GET" path="/v1/models" description="モデル一覧の取得" />
<ApiEndpoint method="GET" path="/v1beta/models" description="Gemini 形式で取得" />

**OpenAI形式(Chat)**

<ApiEndpoint method="POST" path="/v1/chat/completions" description="チャット対話の作成" />

**OpenAI形式(Responses)**

<ApiEndpoint method="POST" path="/v1/responses" description="レスポンスの作成 (OpenAI Responses API)" />
<ApiEndpoint method="POST" path="/v1/responses/compact" description="対話の圧縮 (OpenAI Responses API)" />

**画像生成**

<ApiEndpoint method="POST" path="/v1/images/generations" description="画像の生成(qwen-image)" />
<ApiEndpoint method="POST" path="/v1/images/edits" description="画像の編集(qwen-image-edit)" />

**動画生成**

<ApiEndpoint method="POST" path="/v1/videos" description="動画の作成 " />
<ApiEndpoint method="GET" path="/v1/videos/{task_id}" description="動画タスクのステータス取得 " />
<ApiEndpoint method="GET" path="/v1/videos/{task_id}/content" description="動画コンテンツの取得" />
<ApiEndpoint method="POST" path="/kling/v1/videos/text2video" description="Kling テキストから動画生成" />
<ApiEndpoint method="GET" path="/kling/v1/videos/text2video/{task_id}" description="Kling テキストから動画生成タスクのステータス取得" />
<ApiEndpoint method="POST" path="/kling/v1/videos/image2video" description="Kling 画像から動画生成" />
<ApiEndpoint method="GET" path="/kling/v1/videos/image2video/{task_id}" description="Kling 画像から動画生成タスクのステータス取得" />
<ApiEndpoint method="POST" path="/jimeng/" description="即夢の動画生成" />
<ApiEndpoint method="POST" path="/v1/video/generations" description="動画生成タスクの作成" />
<ApiEndpoint method="GET" path="/v1/video/generations/{task_id}" description="動画生成タスクのステータス取得" />

**Claude形式(Messages)**

<ApiEndpoint method="POST" path="/v1/messages" description="Claude チャット" />

**Gemini形式**

<ApiEndpoint method="POST" path="/v1beta/models/{model}:generateContent" description="Gemini 画像(Nano Banana)" />
<ApiEndpoint method="POST" path="/v1/engines/{model}/embeddings" description="Gemini 埋め込み(Embeddings)" />

**OpenAI形式(Embeddings)**

<ApiEndpoint method="POST" path="/v1/embeddings" description="テキスト埋め込みの作成" />

**テキスト補完(Completions)**

<ApiEndpoint method="POST" path="/v1/completions" description="テキスト補完の作成" />

**OpenAI音声(Audio)**

<ApiEndpoint method="POST" path="/v1/audio/transcriptions" description="音声の文字起こし" />
<ApiEndpoint method="POST" path="/v1/audio/translations" description="音声の翻訳" />
<ApiEndpoint method="POST" path="/v1/audio/speech" description="テキスト読み上げ" />

**リランク(Rerank)**

<ApiEndpoint method="POST" path="/v1/rerank" description="ドキュメントのリランク" />

**Moderations**

<ApiEndpoint method="POST" path="/v1/moderations" description="コンテンツ審査" />

**Realtime**

<ApiEndpoint method="GET" path="/v1/realtime" description="リアルタイム WebSocket 接続" />
<!-- sync:endpoints:end -->

## リクエスト形式

すべてのリクエストは JSON 形式を使用します：

```http
POST /v1/chat/completions HTTP/1.1
Host: api.lurus.cn
Content-Type: application/json
Authorization: Bearer sk-your-api-key

{
  "model": "deepseek-chat",
  "messages": [
    {"role": "user", "content": "Hello!"}
  ]
}
```

## レスポンス形式

各フィールドの型と必須かどうかは [データ構造リファレンス / Schema](/ja/api/schemas) を参照してください（OpenAPI 仕様から自動同期され、ゲートウェイの実装と一致します）。

### 成功レスポンス

```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1677858242,
  "model": "deepseek-chat",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 12,
    "total_tokens": 22
  }
}
```

### エラーレスポンス

```json
{
  "error": {
    "code": "invalid_api_key",
    "message": "Invalid API key provided",
    "type": "authentication_error"
  }
}
```

## レート制限

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">60</span><span class="lurus-stat__label">RPM リクエスト/分</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">100,000</span><span class="lurus-stat__label">TPM Token/分</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">10</span><span class="lurus-stat__label">最大同時リクエスト数</span></div>
</div>

| 制限の種類 | デフォルト値 | 説明 |
|---------|--------|------|
| RPM (リクエスト/分) | 60 | 1 分あたりの最大リクエスト数 |
| TPM (Token/分) | 100,000 | 1 分あたりの最大 Token 数 |
| 同時リクエスト | 10 | 同時に進行する最大リクエスト数 |

制限を超えると `429 Too Many Requests` エラーが返されます。対処方法は [エラー処理](/ja/api/errors) を参照してください。

## SDK サポート

### Python (公式 OpenAI SDK)

```bash
pip install openai
```

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.lurus.cn/v1",
    api_key="sk-your-api-key"
)
```

### Node.js

```bash
npm install openai
```

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.lurus.cn/v1',
  apiKey: 'sk-your-api-key'
});
```

### Go

```go
import "github.com/sashabaranov/go-openai"

config := openai.DefaultConfig("sk-your-api-key")
config.BaseURL = "https://api.lurus.cn/v1"
client := openai.NewClientWithConfig(config)
```

### cURL

```bash
curl https://api.lurus.cn/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-your-api-key" \
  -d '{"model": "deepseek-chat", "messages": [{"role": "user", "content": "Hi"}]}'
```

## 特殊機能

<CapabilityGrid
  accent="var(--lurus-color-api-ref)"
  title="ゲートウェイ拡張機能"
  :items="[
    { title: 'ストリーミングレスポンス', body: 'stream: true を設定すると Server-Sent Events が有効になり、Token ごとに返却', icon: 'zap' },
    { title: 'モデルルーティング', body: 'モデル名によって対応する上流チャネルへ自動ルーティングし、基盤の設定を意識する必要なし', icon: 'shuffle' },
    { title: '自動リトライ', body: 'リクエスト失敗時に予備チャネルへ自動切り替え（複数設定されている場合）', icon: 'repeat' },
  ]"
/>

### ストリーミングレスポンス

`stream: true` を設定すると Server-Sent Events のストリーミングレスポンスが有効になります：

```json
{
  "model": "deepseek-chat",
  "messages": [...],
  "stream": true
}
```

完全なストリーミングデータ形式と Token ごとの処理については [Chat Completions — ストリーミングレスポンス](/ja/api/chat-completions#流式响应) を参照してください。

### モデルルーティング

モデル名によって対応する上流チャネルへ自動的にルーティングし、基盤の設定を意識する必要はありません。

### 自動リトライ

リクエスト失敗時に予備チャネルへ自動的に切り替えます（複数設定されている場合）。

---

<NextSteps
  title="次のステップ"
  :steps="[
    { text: '認証の詳細', link: '/ja/api/authentication', primary: true },
    { text: 'Chat Completions', link: '/ja/api/chat-completions' },
    { text: 'データ構造 / Schema', link: '/ja/api/schemas' },
    { text: 'エラー処理', link: '/ja/api/errors' },
    { text: 'API Key を取得', link: '/ja/guide/get-api-key' },
  ]"
/>

<RelatedProducts product-id="api-ref" />

</div>

<style>
.api-overview-page .lurus-stat-strip {
  margin: 1.5rem 0;
}
</style>
