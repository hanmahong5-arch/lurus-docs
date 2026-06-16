---
title: Switch — AI コーディング CLI 統合管理センター
description: デスクトップアプリ。1 つの画面で 5 種類の主要 AI コーディング CLI の設定、MCP サーバー、コストを管理。
---

<div class="switch-page">

<ProductHero product-id="switch" />

<MetricStats :items="[
  { label: '管理 CLI', value: '5 種類', hint: 'Claude Code / Codex / Gemini / PicoClaw / NullClaw' },
  { label: 'パッケージサイズ', value: '<15MB', hint: '単一 exe・依存ゼロ' },
  { label: '起動', value: '<2s', hint: 'Wails + Go 1.25 + React 18' },
]" />

## Lurus Switch とは？

**Lurus Switch** は、1 つの画面で **5 種類の主要 AI コーディング CLI：Claude Code / Codex / Gemini CLI / PicoClaw / NullClaw** の設定、MCP サーバー、コストを管理できるデスクトップアプリ（単一 exe・依存ゼロ、&lt; 15MB）です。**Wails**（Go 1.25 + React 18）で構築されており、起動は &lt; 2 秒、Windows / macOS / Linux の全プラットフォームに対応します。

現在の開発者は Claude Code、Codex、Gemini CLI など複数の AI CLI を同時に使用しており、設定はあちこちに散在し、コストも個別に管理されています。Switch はそのすべてを一元管理します。

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">1 つの画面で、設定をあちこち探す手間とおさらば</p>
    <div class="lurus-callout__body">設定のビジュアル編集、MCP のツール横断同期、コストのツール／モデル別集計——もう各 CLI の dotfile を個別に開く必要はありません。</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="sparkles" :size="14" /> コア機能</span>
  <h2 class="lurus-section-head__title">すべての AI CLI をワンストップで管理</h2>
  <p class="lurus-section-head__lede">設定、MCP、コスト、キー、プロキシ——よく使う運用操作がすべて同じウィンドウで完結します。</p>
</div>

<CapabilityGrid accent="var(--lurus-color-switch)" :items="[
  { title: 'マルチ CLI 設定管理', body: 'Claude Code / Codex / Gemini CLI / PicoClaw / NullClaw の設定をビジュアル編集、Monaco Editor でリアルタイムプレビュー。', icon: 'layers' },
  { title: 'CLAUDE.md スマートアシスタント', body: 'プロジェクトをスキャンして CLAUDE.md を自動生成、品質スコアリング、最適化の提案を提示。', icon: 'sparkles' },
  { title: 'MCP サーバーのビジュアル化', body: '手書き JSON とおさらば。MCP サーバーをビジュアル設定し、ツール横断で同期。', icon: 'plug' },
  { title: 'コスト監視ダッシュボード', body: 'リアルタイムの Token 消費トレンドを、ツール／モデル別に分類、予算アラート。', icon: 'bar-chart-3' },
  { title: 'API Key 統合管理', body: 'ツール横断で統一保存・利用、安全に暗号化。', icon: 'key' },
  { title: 'プロキシとネットワーク', body: 'システムプロキシの自動検出、Clash / V2Ray のワンクリック設定、API Endpoint のカスタマイズ。', icon: 'shuffle' },
  { title: '設定スナップショット', body: '保存／復元／diff 比較、試行錯誤のコストはゼロ。', icon: 'history' },
  { title: 'Prompt テンプレートライブラリ', body: '高品質テンプレートを内蔵 + カスタム管理 + インポート／エクスポート。', icon: 'package' },
  { title: 'プロセス管理', body: 'CLI プロセス監視：一覧／終了／起動／出力の確認。', icon: 'monitor' },
  { title: '自動更新', body: 'GitHub Releases による自動更新 + ツールバージョンチェック。', icon: 'package-plus' },
]" title="" />

---

## 仕組み

Switch はローカルで OpenAI API 互換のエンドポイント（デフォルト `http://localhost:11434/v1`）を公開します。アプリ側は `base_url` をこのローカルアドレスに変更するだけで、以降のルーティングはすべて Switch が引き受けます。

<ArchitectureDiagram
  title="ローカルプロキシ + マルチプロバイダールーティング"
  chart="graph TD
    App[あなたのアプリ<br/>OpenAI SDK] --> SW[Lurus Switch<br/>localhost:11434]
    SW --> L[Lurus API]
    SW --> O[OpenAI 直接接続]
    SW --> OL[Ollama<br/>ローカルモデル]"
/>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="plug-zap" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">ゼロ侵襲で導入</p>
    <div class="lurus-callout__body">1 か所の <code>base_url</code> を変更するだけで、既存の OpenAI SDK 呼び出しがすべて接続されます。ルーティングルールは Switch 内で一元管理され、アプリのコードは意識する必要がありません。</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> 利用シーン</span>
  <h2 class="lurus-section-head__title">Switch を使っているのは</h2>
</div>

<UserScenarios title="" :scenarios="[
  { role: 'マルチ CLI ユーザー', title: 'マルチ CLI 管理', summary: 'Claude Code / Codex / Gemini CLI / PicoClaw / NullClaw のうち複数を同時に使用し、統一した設定管理が必要。', link: '/ja/switch/configuration' },
  { role: 'コスト責任者', title: 'コスト管理', summary: '複数の CLI を並行利用し、統一した費用ビューと予算管理が必要。', link: '/ja/switch/cost-monitoring' },
  { role: '技術チーム', title: 'チーム標準化', summary: '設定を統一配布し、チームメンバーが一貫した AI CLI 設定を使用できるようにする。', link: '/ja/switch/team-config' },
  { role: '中国の開発者', title: '国内ネットワーク', summary: 'VPN 設定、日本語インターフェース、国内／海外モデルのワンクリック切り替えが必要。', link: '/ja/switch/configuration' },
]" />

---

## 他のソリューションとの比較

<ComparisonTable
  self-label="Switch"
  :competitors="['Aider', 'Cursor', '手動管理']"
  :rows="[
    { dimension: 'CLI カバレッジ', self: '5 種類を統合', alt: { Aider: '1 種類', Cursor: 'IDE 内蔵', '手動管理': 'N/A' } },
    { dimension: 'MCP 管理', self: 'ビジュアル + 同期', alt: { Aider: 'なし', Cursor: '個別設定', '手動管理': '手書き JSON' } },
    { dimension: 'コスト監視', self: '集計ダッシュボード', alt: { Aider: 'なし', Cursor: 'なし', '手動管理': 'なし' } },
    { dimension: 'チーム同期', self: 'Git + Vault', alt: { Aider: 'なし', Cursor: 'なし', '手動管理': 'なし' } },
  ]"
  title=""
/>

---

## 対応プラットフォーム

| プラットフォーム | バージョン要件 |
|------|---------|
| Windows | Windows 10 64-bit 以上 |
| macOS | macOS 12 (Monterey) 以上 |
| Linux | Ubuntu 20.04 / Debian 11 以上 |

---

## 次のステップ

<NextSteps :steps="[
  { text: 'インストールガイド', link: '/ja/switch/install', primary: true },
  { text: '設定説明', link: '/ja/switch/configuration' },
  { text: '利用マニュアル', link: '/ja/switch/usage' },
]" title="" />

<RelatedProducts product-id="switch" />

</div>

<style>
.switch-page .lurus-section-head { margin-top: 8px; }
.switch-page .cap-grid__heading { display: none; }
</style>
