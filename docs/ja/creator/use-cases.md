---
title: "Creator ユースケース"
description: "B 站動画解説 / 公式アカウント長文 / 小紅書ノートという 3 種類の典型シナリオの完全なパイプライン。"
---

<div class="creator-page">

# Creator ユースケース <StatusBadge status="dev" />

動画、長文からソーシャル向けショートコンテンツまでをカバーする、3 つの実際のパイプライン事例です。

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="video" :size="14" /> ケース 1</span>
  <h2 class="lurus-section-head__title">B 站動画解説</h2>
  <p class="lurus-section-head__lede">1 本の B 站動画リンク → ナレーション原稿 + サムネイル文案。</p>
</div>

| ステージ | ツール | 成果物 |
|------|------|------|
| 入力 | 動画リンクを貼り付け | 元動画 URL |
| ダウンロード | yt-dlp | mp4 ファイル |
| 文字起こし | Whisper large-v3 | タイムスタンプ付き中国語字幕 |
| 精緻化 | LLM（DeepSeek-Chat） | セクション要約 + ハイライト |
| リライト | LLM（Claude Sonnet） | 3 バージョンのナレーション原稿（真面目 / 軽妙 / サスペンス） |
| サムネイル | LLM | 3 つのサムネイルタイトル候補 |
| 出力 | Creator エディタ | B 站の管理画面にそのまま貼り付け可能 |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="gauge" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">典型的な所要時間</p>
    <div class="lurus-callout__body">10 分の動画 → 全工程 90 秒。</div>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="book-open" :size="14" /> ケース 2</span>
  <h2 class="lurus-section-head__title">公式アカウント長文</h2>
  <p class="lurus-section-head__lede">1 つのテーマ → 公式アカウント向け 2000 字の深掘り記事。</p>
</div>

<ArchitectureDiagram
  title="テーマ → 公式アカウント長文"
  chart='graph TD
    TOPIC["テーマ入力：AI Agent の永続化における WAL の応用を振り返る"] --> SEARCH[資料検索<br/>Lurus API + web_search Tool]
    SEARCH --> OUTLINE[アウトライン生成<br/>LLM が 5 つの H2 を列挙]
    OUTLINE --> WRITE[段落ごとに執筆<br/>アウトラインに沿ってブロック生成]
    WRITE --> FIG[挿絵の提案<br/>LLM が 3 枚の図解の挿入位置を提案]
    FIG --> MD[Markdown を Creator エディタに出力]'
/>

**適応ポイント**：

- 公式アカウントは H4 をサポートしないため、自動でダウングレード
- 「おすすめの記事」相互リンクを自動生成（キーワードマッチングに基づく）
- 「口語調 / 学術調 / ビジネス調」の 3 段階のスタイル切り替えに対応

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="share-2" :size="14" /> ケース 3</span>
  <h2 class="lurus-section-head__title">小紅書ノート</h2>
  <p class="lurus-section-head__lede">1 枚の画像 + 1 言のツッコミ → 完成度の高い宣伝ノート。</p>
</div>

**入力**：製品画像 +「バッテリーが本当に最高」

**出力**：

```
┌─────────────────────────────┐
│ 🌙 终于找到通勤救星！       │
│                              │
│ 用了一周真的爱上了...（100 字）│
│                              │
│ ✅ 续航 28 小时              │
│ ✅ 重量只有 180 克           │
│ ✅ 降噪 -35dB                │
│                              │
│ #数码好物 #通勤 #降噪耳机   │
└─────────────────────────────┘
```

禁止ワードを避けながら、6〜10 個のトピックタグを自動生成します。

---

## 共用パイプラインの比較

| シナリオ | 動画解説 | 公式アカウント長文 | 小紅書 |
|------|---------|-----------|--------|
| 入力形態 | URL | テーマワード | 画像 + 短文 |
| コアモデル | Whisper + LLM | LLM | LLM |
| 成果物の長さ | 300〜500 字の原稿 | 2000 字 | 80〜150 字 |
| 公開サポート | コピーしてエクスポート | chromedp で自動公開 | chromedp で自動公開 |
| 典型的な所要時間 | 90 秒 | 2 分 | 30 秒 |

## 次のステップ

<NextSteps :steps="[
  { text: '概要に戻る', link: '/ja/creator/', primary: true },
  { text: 'インストールガイド', link: '/ja/creator/install' },
  { text: '使用マニュアル', link: '/ja/creator/usage' },
]" />

</div>
