---
title: Chat Completions API
description: Lurus Chat Completions API リファレンス。OpenAI のインターフェース形式と完全互換です。
---

<div class="api-chat-page">

# Chat Completions API

最もよく使われる対話 API で、OpenAI Chat Completions インターフェースと完全互換です。

<ApiEndpoint method="POST" path="/v1/chat/completions" description="チャット対話を作成" />

```
POST https://api.lurus.cn/v1/chat/completions
```

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--api" href="#流式响应">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">ストリーミング応答</div>
    <p class="lurus-card__body">SSE でトークンを逐次返却</p>
  </a>
  <a class="lurus-card lurus-card--api" href="#function-calling">
    <span class="lurus-card__icon"><Icon name="plug-zap" :size="20" /></span>
    <div class="lurus-card__title">Function Calling</div>
    <p class="lurus-card__body">モデルにあなたの関数を呼び出させる</p>
  </a>
  <a class="lurus-card lurus-card--api" href="#多模态输入-vision">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">マルチモーダル Vision</div>
    <p class="lurus-card__body">テキストと画像を混在させて入力</p>
  </a>
  <a class="lurus-card lurus-card--api" href="#最佳实践">
    <span class="lurus-card__icon"><Icon name="sparkles" :size="20" /></span>
    <div class="lurus-card__title">ベストプラクティス</div>
    <p class="lurus-card__body">温度 / System Prompt / マルチターン</p>
  </a>
</div>

---

## リクエストパラメータ

### 必須

| パラメータ | 型 | 説明 |
|------|------|------|
| `model` | string | モデル名。例: `deepseek-chat`、`gpt-4o` |
| `messages` | array | 対話メッセージの配列。下記の形式を参照 |

### よく使うオプションパラメータ

| パラメータ | 型 | デフォルト値 | 説明 |
|------|------|--------|------|
| `temperature` | number | 1.0 | ランダム性（0–2）。コード/数学は 0.1、創作は 0.9 |
| `max_tokens` | integer | — | 生成する最大トークン数。未設定の場合はモデルが決定 |
| `stream` | boolean | false | <Term t="Streaming">ストリーミング出力</Term>（SSE）。[ストリーミング応答](#流式响应)を参照 |
| `top_p` | number | 1.0 | 核サンプリング。通常 temperature とどちらか一方を調整 |
| `stop` | string/array | — | この文字列に達したら生成を停止 |
| `n` | integer | 1 | 同時に生成する候補返信の数 |
| `user` | string | — | ユーザー識別子。監査ログに使用 |

### Messages 形式

```json
[
  {"role": "system",    "content": "你是一位专业的技术顾问。"},
  {"role": "user",      "content": "什么是 RESTful API？"},
  {"role": "assistant", "content": "RESTful API 是…"},
  {"role": "user",      "content": "能举个例子吗？"}
]
```

| ロール | 用途 |
|------|------|
| `system` | AI の振る舞い、口調、制約を設定。配列の先頭に置く |
| `user` | ユーザーの入力 |
| `assistant` | AI の返信。マルチターン対話では過去の返信も含める必要がある |

リクエストボディ（`ChatCompletionRequest`）とメッセージ（`Message`）の全フィールド定義は [データ構造リファレンス](/ja/api/schemas) を参照してください。

---

## 基本例

:::tabs
== Python
```python
from openai import OpenAI

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-your-key")

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "你是一位专业的技术顾问，回复简洁，不超过 100 字。"},
        {"role": "user",   "content": "什么是 RESTful API？"}
    ],
    temperature=0.3,
    max_tokens=200
)

print(response.choices[0].message.content)
print(f"Token 用量：{response.usage.total_tokens}")  # usage.total_tokens
```

== cURL
```bash
curl https://api.lurus.cn/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $LURUS_API_KEY" \
  -d '{
    "model": "deepseek-chat",
    "messages": [
      {"role": "system", "content": "你是一位专业的技术顾问，回复简洁，不超过 100 字。"},
      {"role": "user",   "content": "什么是 RESTful API？"}
    ],
    "temperature": 0.3
  }'
```

== Node.js
```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.lurus.cn/v1',
  apiKey: process.env.LURUS_API_KEY
});

const response = await client.chat.completions.create({
  model: 'deepseek-chat',
  messages: [
    { role: 'system', content: '你是一位专业的技术顾问，回复简洁，不超过 100 字。' },
    { role: 'user',   content: '什么是 RESTful API？' }
  ],
  temperature: 0.3,
  max_tokens: 200
});

console.log(response.choices[0].message.content);
console.log(`Token 用量：${response.usage.total_tokens}`);
```

== Go
```go
package main

import (
    "context"
    "fmt"
    "os"
    openai "github.com/sashabaranov/go-openai"
)

func main() {
    cfg := openai.DefaultConfig(os.Getenv("LURUS_API_KEY"))
    cfg.BaseURL = "https://api.lurus.cn/v1"
    client := openai.NewClientWithConfig(cfg)

    resp, _ := client.CreateChatCompletion(context.Background(),
        openai.ChatCompletionRequest{
            Model:       "deepseek-chat",
            Temperature: 0.3,
            Messages: []openai.ChatCompletionMessage{
                {Role: "system", Content: "你是一位专业的技术顾问，回复简洁，不超过 100 字。"},
                {Role: "user", Content: "什么是 RESTful API？"},
            },
        },
    )
    fmt.Println(resp.Choices[0].Message.Content)
    fmt.Printf("Token 用量：%d\n", resp.Usage.TotalTokens)
}
```
:::

---

## ストリーミング応答

`stream: true` を設定すると、応答は Server-Sent Events を介してトークンを逐次返却します。チャット系アプリケーションに適しています。

:::tabs
== Python
```python
stream = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "写一首关于秋天的四行诗"}],
    stream=True
)

for chunk in stream:
    delta = chunk.choices[0].delta
    if delta.content:
        print(delta.content, end="", flush=True)
print()  # 换行
```

== Node.js
```javascript
const stream = await client.chat.completions.create({
  model: 'deepseek-chat',
  messages: [{ role: 'user', content: '写一首关于秋天的四行诗' }],
  stream: true
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? '');
}
```
:::

### ストリーミングデータ形式

```
data: {"id":"chatcmpl-abc","choices":[{"delta":{"content":"落"},"index":0}]}
data: {"id":"chatcmpl-abc","choices":[{"delta":{"content":"叶"},"index":0}]}
...
data: [DONE]
```

::: tip
最後の `data: [DONE]` はストリームの終了を示します。このとき `delta.content` は空です。
:::

---

## Function Calling

提供した関数をいつ呼び出すかを AI に判断させ、構造化されたパラメータ（<Term t="Tool Call">Tool Call</Term>）を返します。検索、データベースのクエリ、外部 API の呼び出しなどのシナリオに適しています。

### ワークフロー

<ArchitectureDiagram
  title="Function Calling の呼び出しフロー"
  chart="graph LR; A[あなたのリクエスト<br/>tools 定義を含む] --> B[モデルが返却<br/>finish_reason: tool_calls]; B --> C[あなたが関数を実行<br/>結果を role: tool で返送]; C --> D[モデルが結果を統合<br/>最終回答を生成]"
/>

### 完全な例: 天気の照会

:::tabs
== Python
```python
import json
from openai import OpenAI

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-your-key")

# 定义可调用的函数
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "获取指定城市的当前天气",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "城市名称，如"北京"、"上海""
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "温度单位"
                    }
                },
                "required": ["city"]
            }
        }
    }
]

# 第一轮：AI 决定调用哪个函数
messages = [{"role": "user", "content": "北京今天天气怎么样？"}]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    tools=tools,
    tool_choice="auto"
)

msg = response.choices[0].message

# AI 返回了 tool_calls，说明它想调用函数
if msg.tool_calls:
    tool_call = msg.tool_calls[0]
    args = json.loads(tool_call.function.arguments)
    print(f"AI 想调用：{tool_call.function.name}({args})")
    # → AI 想调用：get_weather({'city': '北京', 'unit': 'celsius'})

    # 执行你自己的函数（这里模拟返回数据）
    weather_result = {"city": "北京", "temperature": 8, "condition": "晴，有北风"}

    # 第二轮：把函数结果传回给 AI
    messages.append(msg)  # 保留 AI 的 tool_calls 消息
    messages.append({
        "role": "tool",
        "tool_call_id": tool_call.id,
        "content": json.dumps(weather_result, ensure_ascii=False)
    })

    final = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        tools=tools
    )
    print(final.choices[0].message.content)
    # → 北京今天天气晴，气温 8°C，有北风，出门建议穿厚外套。
```
:::

::: warning モデルのサポート
Function Calling にはモデルのサポートが必要です。`gpt-4o`、`gpt-4o-mini`、`claude-3-5-sonnet` の使用を推奨します。
DeepSeek 系列もサポートしていますが、パラメータ形式にわずかな差異があるため、テスト時には検証に注意してください。
:::

---

## マルチモーダル入力（Vision）

一部のモデルは画像の内容を理解でき、`content` の中にテキストと画像を混在させて入力できます。

:::tabs
== URL 画像
```json
{
  "model": "gpt-4o",
  "messages": [{
    "role": "user",
    "content": [
      {"type": "text", "text": "这张图里有什么？"},
      {"type": "image_url", "image_url": {"url": "https://example.com/photo.jpg"}}
    ]
  }]
}
```

== Base64 画像
```json
{
  "model": "gpt-4o",
  "messages": [{
    "role": "user",
    "content": [
      {"type": "text", "text": "识别图中的文字"},
      {"type": "image_url", "image_url": {
        "url": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
      }}
    ]
  }]
}
```
:::

::: info Vision をサポートするモデル
`gpt-4o`、`gpt-4o-mini`、`gemini-3-pro-preview`、`gemini-3-pro-image-preview`

画像サイズの制限: URL 画像は公開ネットワークからアクセス可能である必要があります。Base64 は 1 枚あたり 5 MB を超えないことを推奨します。
:::

---

## ベストプラクティス

### System Prompt の書き方

```json
{
  "role": "system",
  "content": "你是一位专业客服。请用友好简洁的语气回答，每条回复不超过 150 字。如遇无法回答的问题，引导用户联系 support@lurus.cn。"
}
```

**良い System Prompt は次を含みます: 役割定義 + 口調の要求 + 長さの制限 + 境界の処理。**

### 温度設定の参考

| シナリオ | temperature | 説明 |
|------|-------------|------|
| コード生成、数学計算 | 0.0–0.2 | 決定性が高く、ランダム性を抑える |
| 質問応答、要約、分類 | 0.3–0.6 | 正確だが一定の柔軟性がある |
| 創作、ブレインストーミング | 0.7–1.0 | 多様性が強い |
| ランダムなストーリー、ロールプレイ | 1.0–1.5 | 高い創造性、不安定になる可能性あり |

### マルチターン対話の管理

```python
conversation = [
    {"role": "system", "content": "你是一位历史老师。"}
]

def chat(user_input: str) -> str:
    conversation.append({"role": "user", "content": user_input})
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=conversation,
        max_tokens=500
    )
    reply = response.choices[0].message.content
    conversation.append({"role": "assistant", "content": reply})
    return reply

print(chat("秦始皇是谁？"))
print(chat("他有哪些重要成就？"))  # 模型能记住上文的"秦始皇"
```

::: tip コンテキストウィンドウの管理
各モデルのコンテキスト長には上限があります（例: `deepseek-chat` は 64K tokens）。対話が長すぎる場合は、次のようにできます:
1. 最も古いメッセージを切り詰める（system + 直近 N ターンを保持）
2. 過去の対話を定期的に要約し、トークン使用量を圧縮する
:::

---

## エラー処理

よくあるステータスコード: `400` リクエスト形式エラー → JSON 構造と必須パラメータを確認；`401` Key が無効/期限切れ；`403` このモデルへのアクセス権がない → 管理者に連絡；`429` レート制限超過 → 指数バックオフでリトライ；`500/502` 上流モデルの異常 → リトライまたは予備モデルへ切り替え。完全なエラーコードとリトライ戦略は [エラー処理](/ja/api/errors) を参照してください。

---

<NextSteps
  title="次のステップ"
  :steps="[
    { text: 'エラー処理', link: '/api/errors', primary: true },
    { text: 'データ構造 / Schema', link: '/api/schemas' },
    { text: '認証', link: '/api/authentication' },
    { text: 'API 概要', link: '/api/overview' },
    { text: 'サポートされるモデル', link: '/guide/models' },
  ]"
/>

</div>

<style>
.api-chat-page .lurus-card__body code {
  font-size: 0.85em;
}
</style>
