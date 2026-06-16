---
title: Switch 設定ガイド
description: Switch の AI ツール設定、MCP サーバー管理、コスト監視の設定。
---

<div class="switch-page">

# Switch 設定ガイド

## 設定画面を開く

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">メニューバーアイコン</div>
    <p class="lurus-card__body">macOS / Linux：メニューバーアイコンをクリック →「設定」。</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">システムトレイ</div>
    <p class="lurus-card__body">Windows：トレイアイコンを右クリック →「設定を開く」。</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">ショートカットキー</div>
    <p class="lurus-card__body"><span class="lurus-kbd">Ctrl+Shift+S</span>（Win/Linux）/ <span class="lurus-kbd">Cmd+Shift+S</span>（macOS）。</p>
  </div>
</div>

---

## モデルプロバイダーを追加

「**<Term t="Provider">プロバイダー</Term>**」タブ →「**プロバイダーを追加**」で、プロバイダー名 + API Base URL + API Key を入力します：

| プロバイダー | API Base URL | API Key |
|------|------|------|
| **Lurus API** <span class="lurus-tag">推奨</span> | `https://api.lurus.cn/v1` | Lurus Key（`sk-` で始まる）；モデルは「自動検出」をクリック |
| **OpenAI** | `https://api.openai.com/v1` | `sk-...`（公式） |
| **Anthropic** | `https://api.anthropic.com/v1` | `sk-ant-...` |
| **Ollama**（ローカル） | `http://localhost:11434/v1` | （空欄） |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shuffle" :size="14" /> ルーティング</span>
  <h2 class="lurus-section-head__title">ルーティングルールを設定</h2>
  <p class="lurus-section-head__lede">どのリクエストをどのプロバイダーに送るかを定義します。マッチしないリクエストはデフォルトプロバイダーに送られます（デフォルト → Lurus API）。</p>
</div>

**モデル名でルーティング**：`gpt-*` → OpenAI；`claude-*` → Anthropic；`deepseek-*` / `*`（その他）→ Lurus API；`llama*` → Ollama。JSON：

```json
{ "rules": [
    { "pattern": "gpt-*", "provider": "OpenAI" },
    { "pattern": "claude-*", "provider": "Anthropic" },
    { "pattern": "llama*", "provider": "Ollama" },
    { "pattern": "*", "provider": "Lurus API" }
  ] }
```

**アプリ別ルーティング（上級）**：ローカルアプリごとに異なるルーティングを設定します：

```json
{
  "app_rules": [
    {
      "app": "cursor",
      "default_provider": "Lurus API",
      "model_override": "deepseek-reasoner"
    },
    {
      "app": "continue",
      "default_provider": "Ollama"
    }
  ]
}
```

---

## プロキシポートの設定

「**一般**」→「**リッスンポート**」、デフォルトは `11434` です。ポートが競合する場合（Ollama などと）は別のポート（例：`11435`）に変更し、アプリ側でも対応して `base_url=http://localhost:11435/v1` を修正します（`api_key` は任意の値で構いません。Switch は設定済みのプロバイダー key を使用します）。

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">ポートの競合</p>
    <div class="lurus-callout__body">デフォルトポート <code>11434</code> は Ollama のデフォルトポートと同じです。両者を同じマシンで実行する場合は、Switch を別のポート（例：<code>11435</code>）に変更し、アプリ側の <code>base_url</code> も合わせて更新してください。</div>
  </div>
</div>

---

## 設定ファイル全体

Switch の設定は次の場所に保存されます：

| プラットフォーム | パス |
|------|------|
| Windows | `%APPDATA%\LurusSwitch\config.json` |
| macOS | `~/Library/Application Support/LurusSwitch/config.json` |
| Linux | `~/.config/LurusSwitch/config.json` |

`config.json` の完全な例：

```json
{
  "listen_port": 11434,
  "log_requests": true,
  "start_on_login": true,
  "providers": [
    {
      "name": "Lurus API",
      "base_url": "https://api.lurus.cn/v1",
      "api_key": "sk-your-lurus-key",
      "enabled": true
    },
    {
      "name": "Ollama",
      "base_url": "http://localhost:11434/v1",
      "api_key": "",
      "enabled": true
    }
  ],
  "routing": {
    "default_provider": "Lurus API",
    "rules": [
      { "pattern": "llama*",  "provider": "Ollama" },
      { "pattern": "qwen*",   "provider": "Ollama" },
      { "pattern": "*",       "provider": "Lurus API" }
    ]
  }
}
```

---

## 設定の確認

「**ステータス**」タブには次が表示されます：各プロバイダーの接続状態（緑=正常、赤=失敗）、現在有効なルーティングルール、直近のリクエストログ。コマンドラインでの確認（正常な JSON が返れば成功）：

```bash
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"ping"}]}'
```

---

## 次のステップ

<NextSteps :steps="[
  { text: 'コスト監視', link: '/ja/switch/cost-monitoring', primary: true },
  { text: 'MCP サーバー', link: '/ja/switch/mcp-servers' },
  { text: 'チーム設定', link: '/ja/switch/team-config' },
]" title="" />

</div>

<style>
.switch-page .lurus-section-head { margin-top: 8px; }
</style>
