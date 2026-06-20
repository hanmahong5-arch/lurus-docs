---
title: "OpenAI から Lurus API への移行"
description: "5 分で OpenAI の呼び出しを Lurus API へシームレスに切り替え、SDK の使い方はそのまま維持します。"
---

<div class="mig-openai-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="import" :size="14" /> OpenAI から移行</span>
  <h1 class="lurus-section-head__title">OpenAI から Lurus API への移行</h1>
  <p class="lurus-section-head__lede"><code>base_url</code> を 1 行変えるだけで、既存の OpenAI SDK 呼び出しがすべてつながります——ビジネスロジックの書き換えは不要です。</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">5 分</span><span class="lurus-stat__label">想定所要時間</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">1 箇所</span><span class="lurus-stat__label">コード変更</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">0 回</span><span class="lurus-stat__label">再起動</span></div>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">前提条件</p>
    <div class="lurus-callout__body"><p>Lurus の <Term t="API Key">API Key</Term> をすでに 1 つ取得済みであること（<a href="/ja/guide/get-api-key">取得方法</a>）。</p></div>
  </div>
</div>

## <Icon name="repeat" :size="20" /> 1 箇所の変更

```diff
- from openai import OpenAI
-
- client = OpenAI(api_key="sk-openai-...")
+ from openai import OpenAI
+
+ client = OpenAI(
+     api_key="sk-lurus-...",
+     base_url="https://api.lurus.cn/v1",
+ )
```

これだけです。すべての `client.chat.completions.create(...)` 呼び出しは変更不要です。

## <Icon name="layers" :size="20" /> モデル名のマッピング

| OpenAI モデル | Lurus 推奨の代替 |
|-------------|----------------|
| gpt-5 | `gpt-5`（直通）または `deepseek-chat` / `claude-sonnet-4` |
| gpt-4o-mini | `deepseek-chat` / `qwen-turbo` |
| gpt-4o | `claude-sonnet-4` / `gemini-3-pro` |
| o1 | `deepseek-reasoner` |
| text-embedding-3-small | `bge-m3`（ローカル）/ `text-embedding-3-small` |

完全な一覧は [サポート対象のモデル](/ja/guide/models) を参照してください。

## <Icon name="workflow" :size="20" /> 本番投入の手順

<ol class="lurus-steps">
<li>

**接続性の検証** — 一度実行して日本語の返信を受け取れれば成功です。

```python
resp = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "你好"}],
)
print(resp.choices[0].message.content)
```

</li>
<li>

**段階的なトラフィック切り替え** — トラフィックを OpenAI から Lurus へ比率に応じて切り替え、`0.1` → `0.5` → `1.0` と徐々に上げていきます。

```python
import os, random

def get_client():
    if random.random() < float(os.getenv("LURUS_TRAFFIC", "0.1")):
        return OpenAI(api_key=os.getenv("LURUS_API_KEY"),
                      base_url="https://api.lurus.cn/v1")
    return OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
```

</li>
<li>

**ロールバック** — `base_url` を削除すれば OpenAI の呼び出しに戻ります。**再起動は不要**です（リクエスト単位で反映されます）。

</li>
</ol>

## <Icon name="life-buoy" :size="20" /> よくある質問

<details class="lurus-faq-item">
<summary>モデル名が見つからない？</summary>

[モデルカタログ](/ja/guide/models) で検索するか、Issue を立ててください。

</details>

<details class="lurus-faq-item">
<summary>関数呼び出し / JSON モードはサポートされていますか？</summary>

Lurus は OpenAI の関数呼び出し / JSON Schema に完全互換です。

</details>

<details class="lurus-faq-item">
<summary>組織 ID は必要ですか？</summary>

Lurus は `organization` フィールドを必要とせず、付与してもエラーにはなりません。

</details>

## 次のステップ

<NextSteps :steps="[
  { text: 'モデルカタログ', link: '/ja/guide/models', primary: true },
  { text: 'API リファレンス', link: '/ja/api/overview' },
  { text: 'ルーベイ課金', link: '/ja/platform/billing' },
]" />

</div>
