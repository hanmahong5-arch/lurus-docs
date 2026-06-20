---
title: "Creator — AI 駆動のデスクトップコンテンツファクトリー"
description: "Wails で構築されたデスクトップコンテンツ制作ツール。AI による創作支援とマルチフォーマット出力に対応。"
---

<div class="creator-page">

<ProductHero product-id="creator" />

## Creator とは？

**Lurus Creator** は、動画ダウンロード・音声文字起こし・AI リライト・マルチプラットフォーム公開を 1 本の自動化パイプラインに統合したデスクトップ AI コンテンツ制作ツールです。単一の exe で依存ゼロ、開いてすぐ使えます。

動画のリンクを 1 つ貼り付けるだけで、AI が 6 種類のプラットフォーム向けにカスタマイズされた文章を自動生成します。WeChat 公式アカウント（深掘り記事）、Douyin（ナレーション台本）、Xiaohongshu（おすすめノート）、YouTube Shorts、TikTok、Instagram Reels。このうち WeChat 公式アカウント / Douyin / Xiaohongshu の 3 プラットフォームは chromedp によるブラウザ自動化でワンクリック公開に対応し、その他のプラットフォームは手動公開が必要です。動画ソースは YouTube、Bilibili など 1000 以上のサイトに対応します（yt-dlp による駆動）。

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">1000+</span><span class="lurus-stat__label">動画ソースサイト</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">6</span><span class="lurus-stat__label">プラットフォーム向けカスタム文章</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3</span><span class="lurus-stat__label">プラットフォームのワンクリック公開</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">99</span><span class="lurus-stat__label">文字起こし対応言語</span></div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> コア機能</span>
  <h2 class="lurus-section-head__title">1 つのリンクからマルチプラットフォーム公開まで</h2>
  <p class="lurus-section-head__lede">ダウンロード・文字起こし・リライト・公開を 1 本のパイプラインにつなぎ、全工程を自動化します。</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-creator)"
  :items="[
    { title: 'ワンクリックコンテンツパイプライン', body: '動画ソース → yt-dlp ダウンロード → ffmpeg トランスコード → Whisper 文字起こし → LLM リライト → chromedp 公開、全工程を自動化', icon: 'workflow' },
    { title: 'スマートリライト', body: '翻訳（用語を保持）、リライト（トーン・長さ調整）、要点抽出、SEO 最適化（タイトル・タグ・要約）', icon: 'sparkles' },
    { title: 'マルチプラットフォームコンテンツ生成', body: '一度で 6 プラットフォームのテンプレートを生成：公式アカウント / Douyin / Xiaohongshu / YouTube Shorts / TikTok / Reels', icon: 'share-2' },
    { title: 'DevFactory バッチ処理', body: 'SQLite ステートマシンによるタスク単位の追跡、バッチキューイング、Token 予算制御、レジューム対応', icon: 'package' },
  ]"
/>

### ワンクリックコンテンツパイプライン

<ArchitectureDiagram
  title="コンテンツパイプライン：動画ソース → 公開"
  chart="graph LR
    SRC[動画ソース<br/>YouTube / Bilibili / ローカル] --> DL[yt-dlp ダウンロード]
    DL --> TC[ffmpeg トランスコード]
    TC --> TR[Whisper 文字起こし]
    TR --> RW[LLM リライト / 翻訳]
    RW --> PUB[chromedp 公開<br/>公式アカウント / Douyin / Xiaohongshu]"
/>

| 段階 | ツール | 説明 |
|------|------|------|
| **ダウンロード** | yt-dlp | YouTube、Bilibili など 1000 以上の動画プラットフォーム |
| **トランスコード** | ffmpeg | フォーマット変換、トリミング、ウォーターマーク除去 |
| **文字起こし** | Whisper | 音声をテキストに変換、99 言語対応 |
| **リライト** | LLM (Lurus API) | AI による推敲、翻訳、フォーマット調整 |
| **公開** | chromedp | ヘッドレスブラウザによる自動ログイン、アップロード、公開 |

### マルチプラットフォームコンテンツ生成 + 一部プラットフォームのワンクリック公開

コンテンツ生成は 6 プラットフォームのテンプレートをカバーします：WeChat 公式アカウント、Douyin、Xiaohongshu、YouTube Shorts、TikTok、Instagram Reels。現在 chromedp ヘッドレスブラウザ技術で自動公開を実現しているのは 3 プラットフォームのみです：

| プラットフォーム | 対応コンテンツタイプ | 自動公開 |
|------|--------------|---------|
| **WeChat 公式アカウント** | テキスト＋画像記事 | ✅ |
| **Douyin** | ショート動画 + 文章 | ✅ |
| **Xiaohongshu** | テキスト＋画像ノート | ✅ |
| YouTube Shorts | ショート動画台本 | ❌ 手動公開が必要 |
| TikTok | ショート動画台本 | ❌ 手動公開が必要 |
| Instagram Reels | ショート動画台本 | ❌ 手動公開が必要 |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">初回ログイン</p>
    <div class="lurus-callout__body">各公開プラットフォームの機能を初めて使う際は、一度手動で QR コードをスキャンしてログインする必要があります。その後、Creator はログイン状態を保存します。</div>
  </div>
</div>

---

## 技術アーキテクチャ

`Creator Desktop (Wails v2 = Go + TypeScript)`：フロントエンドは TypeScript（タスクパネル / エディタ / 設定）+ Go バックエンド（yt-dlp / ffmpeg / Whisper / chromedp のスケジューリング + SQLite ステートマシン）→ [Lurus API](/ja/guide/introduction)（LLM、DeepSeek/GPT など）。単一の実行ファイルにコンパイルされます。

<ArchitectureDiagram
  title="Creator Desktop 技術アーキテクチャ"
  chart="graph TD
    UI[フロントエンド TypeScript<br/>タスクパネル / エディタ / 設定] --> GO[Go バックエンド<br/>スケジューリング + SQLite ステートマシン]
    GO --> TOOLS[yt-dlp / ffmpeg / Whisper / chromedp]
    GO --> API[Lurus API<br/>LLM · DeepSeek / GPT など]"
/>

---

## 適用シーン

<UserScenarios
  title="誰が Creator を使っているか"
  :scenarios="[
    { role: '個人メディア', title: '個人メディア運営', summary: '海外の優良コンテンツをローカライズし、中国語版を量産', link: '/ja/creator/use-cases' },
    { role: '知識', title: '知識発信', summary: '技術講演動画から文字原稿を抽出し、テキスト＋画像チュートリアルとして公開', link: '/ja/creator/use-cases' },
    { role: 'マトリクス', title: 'コンテンツマトリクス', summary: '1 つのコンテンツを複数プラットフォームのフォーマットとスタイルに自動適応', link: '/ja/creator/use-cases' },
    { role: 'チーム', title: 'チーム協働', summary: '動画リストをバッチ処理し、タスクの進捗を一目で把握', link: '/ja/creator/usage' },
  ]"
/>

---

## 対応プラットフォーム

| OS | バージョン要件 |
|---------|---------|
| Windows | Windows 10 64-bit 以上 |
| macOS | macOS 12 (Monterey) 以上 |
| Linux | Ubuntu 20.04+ / Debian 11+ |

<div class="lurus-cta">
  <div>
    <p class="lurus-cta__title">ダウンロードしてすぐ使える、設定不要で起動</p>
    <p class="lurus-cta__text">単一の exe に yt-dlp / ffmpeg / Whisper / chromedp をパッケージング、3 分で最初のタスクを完走。</p>
  </div>
  <div class="lurus-cta__actions">
    <a class="lurus-cta__btn lurus-cta__btn--primary" href="/ja/creator/install">インストールガイド →</a>
  </div>
</div>

<!-- lurus:related-block -->

---

## 関連製品と次のステップ

<RelatedProducts product-id="creator" />

</div>
