---
title: OpenCat の設定
description: OpenCat の iOS/macOS クライアントで Lurus API を設定します。
---

<div class="opencat-page">

# OpenCat の設定

[OpenCat](https://opencat.app) は iOS / macOS ネイティブの AI チャットアプリで、シンプルなインターフェースとカスタム API をサポートしています。本ページでは URL Scheme によるワンタップ設定と手動設定の 2 つの方法を紹介します。

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">始める前に</p>
<div class="lurus-callout__body">Lurus の <Term t="API Key">API Key</Term>（形式は <code>sk-xxxxxxxxxxxxxxxx</code>）を用意してください。まだお持ちでない場合は <a href="/ja/guide/get-api-key">API Key を取得</a> してください。</div>
</div>
</div>

## クイック設定（URL Scheme）

ブラウザやメモアプリで以下のリンクをタップすると、OpenCat に直接遷移して設定が自動入力されます：

```
opencat://team/join?domain=https://api.lurus.cn&token=YOUR_API_KEY
```

`YOUR_API_KEY` をあなたの Key（`sk-xxxxxxxxxxxxxxxx`）に置き換え、Safari で開いてください。

<div class="lurus-callout lurus-callout--tip">
<span class="lurus-callout__icon"><Icon name="smartphone" :size="18" /></span>
<div>
<p class="lurus-callout__title">iOS ショートカット（推奨）</p>
<div class="lurus-callout__body">iOS のショートカット App で「URL を開く」アクションを新規作成し、上記のアドレスを貼り付けてあなたの Key を入力し、ホーム画面に保存します。次回デバイスを変更してもワンタップで設定が完了します。</div>
</div>
</div>

---

## 手動設定

URL Scheme が機能しない場合（旧バージョンの OpenCat は非対応）は、手動で設定します：

<ol class="lurus-steps">
<li>

OpenCat を開く → **設定**（右上のアイコン）→ **API 設定**。

</li>
<li>

「**カスタム API**」を選択し、以下を入力します：

- **API Host**：`https://api.lurus.cn`
- **API Key**：あなたの Key（`sk-xxxxxxxxxxxxxxxx`）

</li>
<li>

「**接続を検証**」をクリックし、成功と表示されたら保存します。

</li>
</ol>

---

## モデルの選択

OpenCat はモデル一覧を自動取得しないため、モデル名を手動で入力する必要があります。よく使われるモデル：

| モデル名 | 特徴 |
|---------|------|
| `deepseek-chat` | 高コストパフォーマンス、中国語に最適 |
| `deepseek-reasoner` | 数学・コードの推論 |
| `gpt-4o` | 総合能力が最も高い |
| `claude-3-5-sonnet` | 長文・クリエイティブライティング |
| `gemini-3-pro-preview` | マルチモーダル、1M コンテキスト |

完全な一覧は [サポートされているモデル](/guide/models) を参照してください。

---

## よくある質問

<details class="lurus-faq-item">
<summary>接続テストが失敗し、「無効なキー」と表示される</summary>

- API Host の末尾に**スラッシュが付いていない**ことを確認してください（`https://api.lurus.cn` であり、`https://api.lurus.cn/` ではありません）
- API Key の形式が正しいことを確認してください（`sk-` で始まる）
- [Lurus コンソール](https://api.lurus.cn) で Key のステータスが「有効」になっていることを確認してください

</details>

<details class="lurus-faq-item">
<summary>モデル名を入力しても応答がない</summary>

- モデル名のスペルを確認してください（大文字・小文字を区別します。例：`gpt-4o` であり `GPT-4o` ではありません）
- あなたの Key がそのモデルへのアクセス権限を持っていることを確認してください

</details>

<details class="lurus-faq-item">
<summary>macOS 版の設定はどこにありますか？</summary>

macOS 版の入口：メニューバーの **OpenCat** → **Preferences**（<span class="lurus-kbd">⌘,</span>）→ **API** タブで、iOS 版と同じ設定パラメータです。

</details>

<NextSteps title="次のステップ" :steps="[
  { text: 'サポートされているモデルを見る', link: '/guide/models' },
  { text: 'API Key を取得する', link: '/ja/guide/get-api-key' },
  { text: 'API クイックスタートを見る', link: '/ja/guide/quickstart' }
]" />

</div>

<style scoped>
.opencat-page .lurus-steps { margin-top: 1rem; }
</style>
