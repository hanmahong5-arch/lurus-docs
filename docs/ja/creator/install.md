---
title: "Creator インストールガイド"
description: "Creator デスクトップコンテンツファクトリのダウンロードとインストール手順。"
---

<div class="creator-page">

# インストールガイド

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">前提条件 · 所要時間 約 3 分</p>
    <div class="lurus-callout__body">Windows 10+ / macOS 12+ / Linux（64 ビット）· Lurus <Term t="API Key">API Key</Term>（<a href="/ja/guide/get-api-key">取得方法</a>、AI リライトに使用）· 4 GB 以上のメモリ（8 GB 以上を推奨）。</div>
  </div>
</div>

## ダウンロード

[GitHub Releases](https://github.com/hanmahong5-arch/lurus-creator/releases/latest) にアクセスし、対応プラットフォームのインストーラーをダウンロードします。

| プラットフォーム | ファイル | 説明 |
|------|------|------|
| Windows | `LurusCreator-windows-amd64.exe` | 64 ビットインストーラー |
| macOS (Apple Silicon) | `LurusCreator-darwin-arm64.dmg` | M1/M2/M3 チップ |
| macOS (Intel) | `LurusCreator-darwin-amd64.dmg` | Intel チップ |
| Linux | `LurusCreator-linux-amd64.AppImage` | AppImage 形式 |

---

## プラットフォーム別インストール

ダウンロード後、お使いの OS に合わせてインストール方法を選択してください。

:::tabs
== Windows

1. `LurusCreator-windows-amd64.exe` をダウンロードしてダブルクリックで実行します。
2. 「Windows によって PC が保護されました」と表示された場合は、「詳細情報」→「実行」をクリックします。
3. インストールウィザードを完了し、デスクトップのショートカットから起動します。
4. **初回設定**：[api.lurus.cn](https://api.lurus.cn) で Key を取得し、Creator の設定に貼り付けます（AI リライトに使用）。
5. 作業ディレクトリ（動画/原稿の保存場所）を選択します。

== macOS

1. 対応チップの `.dmg` をダウンロードし、ダブルクリックでマウントします。
2. **Lurus Creator** を「アプリケーション」にドラッグします。
3. 初回起動時に「開発元を確認できません」と表示された場合は、「システム設定 → プライバシーとセキュリティ → このまま開く」を選択します。

== Linux

```bash
# 下载、赋予执行权限、运行
wget https://github.com/hanmahong5-arch/lurus-creator/releases/latest/download/LurusCreator-linux-amd64.AppImage
chmod +x LurusCreator-linux-amd64.AppImage
./LurusCreator-linux-amd64.AppImage
```
:::

---

## 内蔵依存ツール

Creator は必要なツールをすべて同梱しているため、追加インストールは不要です：

| ツール | 用途 | 内蔵 |
|------|------|---------|
| yt-dlp | 動画ダウンロード | 内蔵 |
| ffmpeg | 音声・動画処理 | 内蔵 |
| Whisper | 音声の文字起こし | 内蔵（tiny/base モデル） |
| chromedp | 自動投稿 | 内蔵 |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Whisper モデル</p>
    <div class="lurus-callout__body">デフォルトで <code>tiny</code> と <code>base</code> モデルを内蔵しています。文字起こしの精度が不十分な場合は、設定でより大きいモデル（<code>small</code> / <code>medium</code>）をダウンロードできます。精度は高くなりますが、より多くのメモリを必要とします。</div>
  </div>
</div>

---

## システム要件

| 項目 | 最低要件 | 推奨 |
|------|---------|------|
| メモリ | 4 GB | 8 GB 以上 |
| ディスク容量 | 500 MB（インストール） | 10 GB 以上（動画キャッシュ含む） |
| ネットワーク | ブロードバンド接続 | 動画ダウンロードには安定した回線が必要 |
| GPU | 不要 | GPU があれば Whisper の文字起こしを高速化可能 |

---

## インストールの確認

<ol class="lurus-steps">
<li>設定ページを開き、API Key の状態が「接続済み」と表示されることを確認します。</li>
<li>「依存ツールを確認」をクリックし、すべてのツールが緑のチェックマークで表示されることを確認します。</li>
<li>動画 URL を入力してダウンロードをテストします。</li>
</ol>

---

## アンインストール

| プラットフォーム | 操作 | 設定/キャッシュの場所 |
|------|------|--------------|
| **Windows** | コントロールパネル → プログラムのアンインストール →「Lurus Creator」 | `%APPDATA%\LurusCreator\` |
| **macOS** | アプリケーションの「Lurus Creator」をゴミ箱にドラッグ | `~/Library/Application Support/LurusCreator/` |
| **Linux** | `rm /opt/lurus-creator`（または AppImage の場所） | `rm -rf ~/.config/LurusCreator/` |

---

## 次のステップ

<NextSteps :steps="[
  { text: '使い方ガイド', link: '/ja/creator/usage', primary: true },
  { text: 'ユースケース', link: '/ja/creator/use-cases' },
  { text: 'API Key を取得', link: '/ja/guide/get-api-key' },
]" />

</div>
