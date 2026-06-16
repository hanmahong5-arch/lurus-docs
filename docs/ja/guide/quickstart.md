---
title: クイックスタート
description: 5 分以内に初めての Lurus API 呼び出しを完了します。Python、Node.js、Go、cURL に対応。
---

<div class="qs-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="rocket" :size="14" /> クイックスタート</span>
  <h1 class="lurus-section-head__title">5 分で最初の呼び出しを動かす</h1>
  <p class="lurus-section-head__lede">Key を取得 → リクエストを送信 → モデルを切り替え、3 ステップで完了。</p>
</div>

::: info 前提条件
Lurus アカウント 1 つ（登録するだけで無料枠が手に入ります。第 1 ステップで作成します）· Python 3.8+ / Node.js 18+ / Go 1.21+ / cURL（いずれか）· ターミナルの基本知識。所要時間は約 5 分。
:::

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> 第 1 ステップ</span>
  <h2 class="lurus-section-head__title">アカウント登録 —— 無料で始める</h2>
  <p class="lurus-section-head__lede">登録するだけで無料枠が手に入り、チャージなしでこのチュートリアルを動かせます。</p>
</div>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="coins" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">登録するだけで使える、支払い不要</p>
    <div class="lurus-callout__body"><p>新規アカウントには自動で <strong>5 鹿贝 + 無料枠</strong>（Free プラン <strong>100 回/日</strong>、<code>deepseek-chat</code>・<code>gpt-3.5-turbo</code> を含む）が付与され、本チュートリアルを動かすには十分すぎるほどです。枠とアップグレードの詳細は <a href="/ja/guide/faq">よくある質問</a> と <a href="/ja/platform/billing">料金について</a> をご覧ください。</p></div>
  </div>
</div>

続いて API Key を作成します:

<ol class="lurus-steps">
<li>

[api.lurus.cn](https://api.lurus.cn) にアクセスし、ログインまたは登録する

</li>
<li>

「**トークン管理**」→「**新しいトークンを作成**」へ進む

</li>
<li>

生成された Key をコピーする（形式: `sk-xxxxxxxxxxxxxxxx`）

</li>
</ol>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">セキュリティに関する注意</p>
    <div class="lurus-callout__body"><p>API Key はパスワードと同等です。<strong>Git にコミットしない</strong>こと、<strong>フロントエンドのコードに書かない</strong>ことを徹底してください。環境変数で渡すことを推奨します:</p><pre><code>export LURUS_API_KEY="sk-your-key-here"</code></pre></div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> 第 2 ステップ</span>
  <h2 class="lurus-section-head__title">最初のリクエストを送る</h2>
  <p class="lurus-section-head__lede">言語を選んで、コピーすればそのまま実行できます。</p>
</div>

:::tabs
== Python
```bash
pip install openai
```
```python
from openai import OpenAI
import os

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key=os.environ["LURUS_API_KEY"])

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "你是一个有帮助的助手。"},
        {"role": "user", "content": "用一句话介绍什么是人工智能。"}
    ]
)
print(response.choices[0].message.content)
# → 人工智能是让计算机模拟人类智能行为（如学习、推理、理解语言）的技术与科学领域。
```

== cURL
```bash
curl https://api.lurus.cn/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $LURUS_API_KEY" \
  -d '{ "model": "deepseek-chat", "messages": [
      {"role": "system", "content": "你是一个有帮助的助手。"},
      {"role": "user",   "content": "用一句话介绍什么是人工智能。"} ] }'
# 响应：{ "id":"chatcmpl-abc123", "choices":[{ "message":{"role":"assistant","content":"..."}, "finish_reason":"stop" }],
#        "usage":{ "prompt_tokens":32, "completion_tokens":22, "total_tokens":54 } }
```

== Node.js
```bash
npm install openai
```
```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.lurus.cn/v1',
  apiKey: process.env.LURUS_API_KEY
});

const response = await client.chat.completions.create({
  model: 'deepseek-chat',
  messages: [
    { role: 'system', content: '你是一个有帮助的助手。' },
    { role: 'user', content: '用一句话介绍什么是人工智能。' }
  ]
});

console.log(response.choices[0].message.content);
// → 人工智能是让计算机模拟人类智能行为（如学习、推理、理解语言）的技术与科学领域。
```

== Go
```bash
go get github.com/sashabaranov/go-openai
```
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
            Model: "deepseek-chat",
            Messages: []openai.ChatCompletionMessage{
                {Role: "system", Content: "你是一个有帮助的助手。"},
                {Role: "user", Content: "用一句话介绍什么是人工智能。"},
            },
        },
    )
    fmt.Println(resp.Choices[0].Message.Content)
    // → 人工智能是让计算机模拟人类智能行为（如学习、推理、理解语言）的技术与科学领域。
}
```
:::

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="check-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">モデルの返答が見えましたか? 最初の呼び出しが動きました 🎉</p>
    <div class="lurus-callout__body"><p>今回のリクエストは、登録時にもらった無料枠を使っており、一円もかかっていません。次はモデルを切り替えて試してみましょう —— コードはほとんど変える必要がありません。</p></div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shuffle" :size="14" /> 第 3 ステップ</span>
  <h2 class="lurus-section-head__title">モデルを切り替える</h2>
  <p class="lurus-section-head__lede"><code>model</code> パラメータを変えるだけで、他のコードは一切変更不要です。モデルを選ぶと下のスニペットが即座に更新され、コピーすればそのまま実行できます。</p>
</div>

<ModelPicker />

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="sparkles" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">どれを選べばよいか分からない?</p>
    <div class="lurus-callout__body"><p><strong>日常利用</strong> → <code>deepseek-chat</code>（コスト最安、中国語が最も得意）<br><strong>複雑な推論</strong> → <code>deepseek-reasoner</code><br><strong>長文ドキュメント処理</strong> → <code>gemini-3-pro-preview</code></p><p>詳しい比較は <a href="/guide/models">対応モデル</a> をご覧ください。</p></div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> よくある質問</span>
  <h2 class="lurus-section-head__title">うまく動かない? まずはここを確認</h2>
</div>

<details class="lurus-faq-item">
<summary><code>401 Unauthorized</code> が返る</summary>

```
{"error": {"code": "invalid_api_key", "type": "authentication_error"}}
```

確認すること:

- Key が `sk-` で始まっているか
- リクエストヘッダーの形式: `Authorization: Bearer sk-xxxx`（Bearer の後ろにスペースがある点に注意）
- Key が「有効」状態になっているか（コンソールで確認）

</details>

<details class="lurus-faq-item">
<summary><code>"no available server"</code> が返る</summary>

- `model` 名のスペルを確認する（大文字・小文字を区別）
- その Key がこのモデルへのアクセス権を持っているか確認する
- Key を作成したばかりの場合は、約 10 秒待ってから再試行する

</details>

<details class="lurus-faq-item">
<summary>ストリーミング応答はどう有効化する?</summary>

リクエストボディに `"stream": true` を追加します。詳しくは [<Term t="Streaming">ストリーミング応答</Term>](/api/chat-completions#流式响应) をご覧ください。

</details>

<NextSteps
  title="次のステップ"
  :steps="[
    { text: 'Chat Completions 完全ドキュメント', link: '/ja/api/chat-completions', primary: true },
    { text: '対応モデル', link: '/guide/models' },
    { text: 'AI クライアントを設定する', link: '/ja/guide/clients/cherry-studio' },
  ]"
/>

</div>
