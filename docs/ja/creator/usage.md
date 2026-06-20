---
title: "Creator 利用ガイド"
description: "Creator デスクトップコンテンツファクトリーの利用ガイドと機能説明。"
---

<div class="creator-page">

# 利用ガイド

## クイック体験

<ol class="lurus-steps">
<li>メイン画面で「<strong>新規タスク</strong>」をクリックします。</li>
<li>動画 URL（YouTube / Bilibili など）を貼り付けます。</li>
<li>対象の操作を選択します：ダウンロードのみ / ダウンロード+文字起こし / ダウンロード+文字起こし+リライト / 完全パイプライン（公開を含む）。</li>
<li>「<strong>開始</strong>」をクリックすると、Creator が各ステージを順番に実行します。タスクパネルでリアルタイムの進捗を確認できます。</li>
</ol>

---

## コンテンツパイプライン詳説

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="video" :size="14" /> ステージ 1</span>
  <h2 class="lurus-section-head__title">動画ダウンロード</h2>
  <p class="lurus-section-head__lede">1000 以上の動画プラットフォームに対応（完全な一覧は yt-dlp の対応サイトをご覧ください）。</p>
</div>

完全な一覧は [yt-dlp の対応サイト](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md) をご覧ください。

**よく使うソース**：

| プラットフォーム | URL フォーマット |
|------|---------|
| YouTube | `https://www.youtube.com/watch?v=xxx` |
| Bilibili | `https://www.bilibili.com/video/BVxxx` |
| 抖音（Douyin） | `https://www.douyin.com/video/xxx` |
| Twitter/X | `https://x.com/user/status/xxx` |

**ダウンロードオプション**：

| オプション | 説明 | デフォルト値 |
|------|------|--------|
| 動画品質 | 最高 / 1080p / 720p / 音声のみ | 最高 |
| 字幕 | 利用可能な字幕を自動ダウンロード | オン |
| プロキシ | HTTP/SOCKS5 プロキシ（海外プラットフォームへのアクセス） | なし |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="search" :size="14" /> ステージ 2</span>
  <h2 class="lurus-section-head__title">音声文字起こし</h2>
  <p class="lurus-section-head__lede">OpenAI Whisper モデルを使って音声をテキストに変換します。</p>
</div>

| モデル | サイズ | 速度 | 精度 | 適した用途 |
|------|------|------|--------|---------|
| `tiny` | 75 MB | 超高速 | 普通 | 高速プレビュー |
| `base` | 142 MB | 高速 | 良好 | 日常利用（デフォルト） |
| `small` | 466 MB | 中速 | 優秀 | 高めの精度が必要な場合 |
| `medium` | 1.5 GB | 低速 | 非常に優秀 | 専門コンテンツ、多言語 |

**言語サポート**：言語を自動検出するほか、手動で指定することもできます（中国語、英語、日本語など 99 言語に対応）。

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="sparkles" :size="14" /> ステージ 3</span>
  <h2 class="lurus-section-head__title">AI リライト</h2>
  <p class="lurus-section-head__lede">Lurus API 経由で AI モデルを呼び出し、文字起こしテキストを加工します。</p>
</div>

[Lurus API](/ja/guide/introduction) 経由で AI モデルを呼び出し、文字起こしテキストを加工します。

**リライトモード**：

| モード | 説明 | 適した用途 |
|------|------|------|
| **翻訳** | 外国語コンテンツを中国語に翻訳 | 海外動画のローカライズ |
| **推敲** | 文法を修正し、表現を最適化 | 文章品質の向上 |
| **要約** | 核心となる論点を抽出し、分量を圧縮 | 長尺動画 → 短文 |
| **拡張** | 詳細や背景を補足 | 短いコンテンツ → 長文記事 |
| **スタイル変換** | トーンを調整（フォーマル↔カジュアル） | 各プラットフォームへの適合 |
| **SEO 最適化** | タイトル、タグ、要約を生成 | 検索順位の向上 |

**モデル選択**：

| 推奨モデル | 適した用途 | コスト |
|---------|------|------|
| `deepseek-chat` | 中国語のリライト、翻訳 | 低 |
| `gpt-4o` | 英語コンテンツ、複雑なリライト | 高 |
| `claude-3-5-sonnet` | クリエイティブライティング、長文テキスト | 中 |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="share-2" :size="14" /> ステージ 4</span>
  <h2 class="lurus-section-head__title">自動公開</h2>
  <p class="lurus-section-head__lede">chromedp ヘッドレスブラウザで自動公開します。</p>
</div>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">自動公開に対応しているのは 3 プラットフォームのみ</p>
    <div class="lurus-callout__body">現在、自動公開に対応しているのは <strong>WeChat 公式アカウント / 抖音 / 小紅書（Xiaohongshu）</strong> のみです。その他のプラットフォーム（YouTube Shorts / TikTok / Instagram Reels など）では文案を生成できますが、公開は手動で行う必要があります。</div>
  </div>
</div>

**初回設定**：

<ol class="lurus-steps">
<li>設定 →「<strong>公開プラットフォーム</strong>」→ 対象のプラットフォームを選択します。</li>
<li>「<strong>ログイン</strong>」をクリックするとブラウザウィンドウが開きます。</li>
<li>手動で QR コードをスキャン / パスワードでログインすると、Creator がログイン状態を保存します。</li>
</ol>

**公開設定**（プラットフォームごとに個別に設定）：

| 設定項目 | 説明 |
|--------|------|
| タイトルテンプレート | 変数に対応：`{{title}}`、`{{date}}`、`{{source}}` |
| タグ | 自動生成または手動設定 |
| サムネイル | 動画から自動抽出または手動アップロード |
| 公開時刻 | 即時公開または予約公開 |

---

## バッチ処理

<ol class="lurus-steps">
<li>テキストファイルを作成し、1 行に 1 つの動画 URL を記載します。</li>
<li>Creator で「<strong>バッチインポート</strong>」をクリックしてファイルを選択します。</li>
<li>統一処理の設定を選択します。</li>
<li>「<strong>すべて開始</strong>」をクリックします。</li>
</ol>

### タスクステータス

各タスクは個別に追跡されます：

| ステータス | 説明 |
|------|------|
| `queued` | 処理待ち |
| `downloading` | 動画をダウンロード中 |
| `transcribing` | 音声を文字起こし中 |
| `rewriting` | AI がリライト中 |
| `publishing` | 自動公開中 |
| `completed` | すべて完了 |
| `failed` | いずれかのステージで失敗（再試行可能） |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">レジューム機能</p>
    <div class="lurus-callout__body">失敗したタスクは、失敗したステージから再開できます。最初からやり直す必要はありません。</div>
  </div>
</div>

---

## 予算管理

AI リライトステージで Token を過剰に消費しないようにします：

| 設定 | 説明 | デフォルト値 |
|------|------|--------|
| タスクごとの Token 上限 | 各タスクが使用できる最大の Token 数 | 10,000 |
| 1 日あたりの総量上限 | 1 日に消費できる最大の Token 数 | 100,000 |
| 上限超過時の動作 | 一時停止 / リライトをスキップ / 通知 | 一時停止 |

設定 →「**Token 予算**」で設定します。

---

## ショートカットキー

| ショートカットキー | 機能 |
|--------|------|
| <span class="lurus-kbd">Ctrl+N</span> / <span class="lurus-kbd">Cmd+N</span> | 新規タスク |
| <span class="lurus-kbd">Ctrl+V</span> / <span class="lurus-kbd">Cmd+V</span> | URL を貼り付けてタスクを作成 |
| <span class="lurus-kbd">Ctrl+Shift+S</span> / <span class="lurus-kbd">Cmd+Shift+S</span> | 設定を開く |
| <span class="lurus-kbd">Space</span> | 現在のタスクを一時停止/再開 |
| <span class="lurus-kbd">Delete</span> | 選択したタスクを削除 |

---

## トラブルシューティング

<details class="lurus-faq-item">
<summary>動画のダウンロードに失敗する？</summary>

ネットワークを確認してください（海外動画はプロキシが必要な場合があります）。一部のプラットフォームはアンチスクレイピング対策を施しているため、Creator を最新版に更新してください。URL のフォーマットも確認してください。

</details>

<details class="lurus-faq-item">
<summary>文字起こしが正確でない？</summary>

より大きな Whisper モデルを使用してください（設定 → Whisper モデル）。音声の言語を手動で指定してください。背景ノイズが大きいと精度が低下します。

</details>

<details class="lurus-faq-item">
<summary>AI リライトがタイムアウトする？</summary>

API Key の残高を確認してください。テキストが長すぎる場合は分割して処理してください。より高速なモデル（`deepseek-chat` など）に切り替えてください。

</details>

<details class="lurus-faq-item">
<summary>公開に失敗する？</summary>

プラットフォームのログインが期限切れの可能性があるため、QR コードを再スキャンしてください。コンテンツがプラットフォームのルール（タイトル/画像/センシティブワード）に違反していないか確認してください。プラットフォームの API 変更に対しては、Creator の更新による対応をお待ちください。

</details>

---

## 次のステップ

<NextSteps :steps="[
  { text: 'ユースケース', link: '/ja/creator/use-cases', primary: true },
  { text: '紹介に戻る', link: '/ja/creator/' },
  { text: 'インストールガイド', link: '/ja/creator/install' },
]" />

</div>
