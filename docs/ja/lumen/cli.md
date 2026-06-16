---
title: Lumen CLI マニュアル
description: lumen-cli のすべてのサブコマンド、オプション、終了コードとワークフロースキャフォールド。
---

<div class="lumen-page">

# Lumen CLI マニュアル <StatusBadge status="dev" />

`lumen-cli` は Lumen のオプションの CLI（Rust 製）で、Python SDK に依存しないコマンドラインワークフロー機能を提供します。

## インストール

```bash
cargo install lumen-cli
# または
curl -fsSL https://lumen.lurus.cn/install.sh | sh
```

## 概要

```
lumen <command> [options]
```

| コマンド | 用途 |
|------|------|
| `doctor` | 環境セルフチェック：Token、ネットワーク、ディスク、Python 依存関係 |
| `init` | プロジェクトルートに `lumen.yaml` 設定テンプレートを生成 |
| `agent` | Agent レベルの操作：一覧 / trace / replay / export |
| `mcp` | MCP 互換レイヤー：Lumen の機能を Claude/Codex に公開 |
| `workflow` | `lumen.yaml` に基づくワークフロー実行器 |
| `deploy` | Agent 定義を Kova Cluster にプッシュ |
| `config` | ローカル CLI 設定の参照/変更 |

## コマンド詳細

```bash
# doctor — 環境自検（退出码 0 全通过 / 1 至少一项失败）
lumen doctor
#   ✓ LURUS_API_KEY present  ✓ python3.11 detected  ✓ /var/lumen writable (5.2 GB free)
#   ✗ port 7070 occupied — close the process or set LUMEN_PORT

# init — 项目根生成 lumen.yaml（templates: langgraph / bare / multi-agent）
lumen init --template langgraph

# agent
lumen agent list                  # 列出本地/远端 Agent
lumen agent trace <run-id>        # 打印 trace 树
lumen agent replay <run-id>       # 不消耗 Token 重放
lumen agent export <run-id>       # 导出 JSON / HAR / OTel

# mcp — 启动 MCP 服务端，暴露 Trace/Replay/Cost 为工具
lumen mcp serve --port 3333       # 或 --manifest ./my-tools.yaml
# Claude Code / Codex 的 mcp_servers 指向 http://127.0.0.1:3333 即可调用

# workflow — 按 lumen.yaml 执行多 Agent 编排
lumen workflow run                # 默认 pipeline；-e prod 指定环境；--dry-run 不实际调 LLM

# deploy — 推送 Agent 定义到 Kova Cluster
lumen deploy --target kova://my-cluster

# config
lumen config get api_key
lumen config set api_key sk-xxxx
lumen config unset telemetry.endpoint
```

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="rewind" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">replay と dry-run はどちらも料金がかかりません</p>
    <div class="lurus-callout__body"><code>lumen agent replay &lt;run-id&gt;</code> は履歴から再生し、<strong>Token を消費しません</strong>；<code>lumen workflow run --dry-run</code> はオーケストレーションフローを最後まで実行しますが<strong>実際には LLM を呼び出しません</strong>。<code>lumen.yaml</code> の設定を検証するのに適しています。</div>
  </div>
</div>

## 終了コード

| Code | 意味 |
|------|------|
| `0` | 成功 |
| `1` | 一般エラー |
| `2` | パラメータエラー |
| `3` | 設定不足 |
| `4` | ネットワークエラー |
| `5` | リモートサービスがエラーを返した |

## 次のステップ

<NextSteps :steps="[
  { text: '概要に戻る', link: '/ja/lumen/', primary: true },
  { text: 'Python SDK', link: '/ja/lumen/python-sdk' },
  { text: 'エコシステム統合', link: '/ja/lumen/integration' },
]" />

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-callout { margin: 18px 0; }
</style>
