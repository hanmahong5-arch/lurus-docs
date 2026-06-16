---
title: Switch 利用ガイド
description: Switch デスクトップアプリの日常利用ガイド。クイック接続から高度な機能まで。
---

<div class="switch-page">

# Switch 利用ガイド <StatusBadge status="dev" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="rocket" :size="14" /> はじめに</span>
  <h2 class="lurus-section-head__title">任意の OpenAI クライアントを Switch に接続する</h2>
  <p class="lurus-section-head__lede">Switch は起動するとローカルで OpenAI API 互換のエンドポイントを公開します。<code>base_url</code> を 1 行書き換えるだけで、すべてのリクエストが自動的に Switch によってルーティングされます。</p>
</div>

## クイック接続

Switch は起動するとローカルで OpenAI API 互換のエンドポイント `http://localhost:19090/v1` を公開します（Switch gateway のデフォルトポートは 19090）。アプリ／SDK の `base_url` をこのアドレスに変更すると、すべてのリクエストが自動的に Switch によってルーティングされます。`api_key` には任意の値（例: `switch`）を入力してください。Switch は設定内の provider key を使用します。

<ol class="lurus-steps">

<li>

クライアントの `base_url` をローカルの Switch エンドポイントに向け、`api_key` には任意の値（例: `switch`）を入力して、通常どおりリクエストを送信します:

::: code-group

```bash [cURL]
curl http://localhost:19090/v1/chat/completions \
  -H "Content-Type: application/json" -H "Authorization: Bearer switch" \
  -d '{"model":"gpt-4o","messages":[{"role":"user","content":"Hello"}]}'
```

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:19090/v1",
    api_key="switch",
)
resp = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}],
)
print(resp.choices[0].message.content)
```

```javascript [Node.js]
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "http://localhost:19090/v1",
  apiKey: "switch",
});
const resp = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello" }],
});
console.log(resp.choices[0].message.content);
```

:::

</li>

<li>

OpenAI SDK（Python / Node.js）では `base_url`/`baseURL` と `api_key` を変更するだけで、その他の呼び出しは通常どおりです — Switch は設定内の provider key を使って実際のルーティングを行うため、クライアント側は下流のプロバイダーを意識する必要はありません。

</li>

</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">なぜ api_key は任意の値でよいのか</p>
    <div class="lurus-callout__body">Switch はローカルプロキシとして、設定内に保存された実際の provider key を使って下流を呼び出します。クライアント側の <code>api_key</code> はプレースホルダーとしてのみ使われるため、<code>switch</code> と入力すれば十分です。</div>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="code" :size="14" /> 統合</span>
  <h2 class="lurus-section-head__title">AI コーディングツールで使う</h2>
  <p class="lurus-section-head__lede">すべてのツールで API Base / インターフェースアドレスには <code>http://localhost:19090/v1</code> を、API Key には <code>switch</code> を入力します。</p>
</div>

## AI コーディングツールで使う

すべてのツールで API Base / インターフェースアドレスには `http://localhost:19090/v1` を、API Key には `switch` を入力します:

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="code" :size="22" /></span>
    <div class="lurus-card__title">Cursor</div>
    <p class="lurus-card__body">設定（<code>Ctrl+,</code>）→「AI」を検索 →「OpenAI API Base」をこのアドレスに変更 → 保存すると、補完と対話が自動的に Switch を経由します。</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="terminal" :size="22" /></span>
    <div class="lurus-card__title">Continue（VS Code）</div>
    <p class="lurus-card__body"><code>~/.continue/config.json</code> を編集し、各 model 項目に <code>"provider": "openai"</code>、<code>"apiBase": "http://localhost:19090/v1"</code>、<code>"apiKey": "switch"</code> を設定し、<code>"model"</code> には <code>deepseek-chat</code> / <code>gpt-4o</code> などを入力します。</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="22" /></span>
    <div class="lurus-card__title">Cherry Studio</div>
    <p class="lurus-card__body">設定 → API 設定 →「カスタム OpenAI 互換」を選択 → アドレスと Key を入力 →「接続テスト」。</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="bot" :size="22" /></span>
    <div class="lurus-card__title">Lobe Chat</div>
    <p class="lurus-card__body">設定 → 言語モデル → OpenAI → API Key とインターフェースアドレスを入力。</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> ランタイム</span>
  <h2 class="lurus-section-head__title">監視・切り替え・ストリーミング</h2>
</div>

## リクエスト監視

「**ログ**」タブでリアルタイムのリクエストログを確認できます。フィールド: 時刻（タイムスタンプ）、モデル、プロバイダー（実際のルーティング先）、所要時間（ms）、Token（prompt/completion）、ステータス（200 / 4xx-5xx）。「CSV をエクスポート」で直近 7 日間の記録をエクスポートしてコスト集計に利用できます。

## プロバイダーのワンクリック切り替え

メニューバーアイコン（macOS）／システムトレイ（Windows）をクリックすると、次の操作ができます: 「現在アクティブなプロバイダー」の切り替え、特定プロバイダーの一時無効化（デバッグ用）、本日の使用量概要の確認。

## ストリーミングレスポンス

SSE ストリーミングレスポンスを完全にサポートし、下流へそのまま透過します: `chat.completions.create(..., stream=True)` の後に `chunk.choices[0].delta.content` を反復処理します。

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shuffle" :size="14" /> 応用</span>
  <h2 class="lurus-section-head__title">ロードバランシング</h2>
  <p class="lurus-section-head__lede">同一モデルに複数のプロバイダーを設定した場合、ラウンドロビンまたは重み付けで割り当てできます。</p>
</div>

## 応用: ロードバランシング

同一モデルに複数のプロバイダーを設定した場合、ラウンドロビンまたは重み付けで割り当てできます:

```json
{
  "routing": {
    "rules": [
      {
        "pattern": "deepseek-chat",
        "providers": [
          { "name": "Lurus API", "weight": 70 },
          { "name": "DeepSeek Official", "weight": 30 }
        ],
        "strategy": "weighted_random"
      }
    ]
  }
}
```

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> トラブルシューティング</span>
  <h2 class="lurus-section-head__title">トラブルシューティング</h2>
  <p class="lurus-section-head__lede">該当する症状を展開して対処手順を確認してください。</p>
</div>

## トラブルシューティング

<details class="lurus-faq-item">
<summary>"connection refused" — 接続が拒否される</summary>

Switch が起動していないか、ポートが正しくありません。プロセスとポートを確認します:

- プロセス: Windows `tasklist | findstr LurusSwitch` / macOS・Linux `ps aux | grep lurus-switch`
- ポート: `curl http://localhost:19090/v1/models`

</details>

<details class="lurus-faq-item">
<summary>401 / 403 — 認証失敗</summary>

プロバイダーの API Key の設定が誤っています。設定画面で入力し直し、「テスト」をクリックして接続性を確認してください。

</details>

<details class="lurus-faq-item">
<summary>レイテンシが異常に高い</summary>

1. ログで正しいプロバイダーにルーティングされているか確認します。
2. 海外プロバイダー（OpenAI / Anthropic）の高レイテンシは正常です（300-1500ms）。
3. Lurus API の国内ノードに切り替えます（通常 &lt; 200ms）。

</details>

<details class="lurus-faq-item">
<summary>macOS アプリが応答しない</summary>

メニューバーで右クリック →「終了」してから再起動するか、ターミナルで実行します:

```bash
pkill -f LurusSwitch && open -a "Lurus Switch"
```

</details>

## 次のステップ

<NextSteps :steps="[
  { text: 'MCP サーバー管理', link: '/ja/switch/mcp-servers', primary: true },
  { text: 'コスト監視', link: '/ja/switch/cost-monitoring' },
  { text: 'チーム設定の同期', link: '/ja/switch/team-config' },
]" />

</div>

<style scoped>
.switch-page .lurus-section-head { margin-top: 2.6rem; }
</style>
