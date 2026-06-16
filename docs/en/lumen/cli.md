---
title: Lumen CLI Manual
description: All subcommands, options, exit codes, and workflow scaffolding for lumen-cli.
---

<div class="lumen-page">

# Lumen CLI Manual <StatusBadge status="dev" />

`lumen-cli` is Lumen’s optional CLI (built in Rust), providing command-line workflow capabilities that don’t depend on the Python SDK.

## Installation

```bash
cargo install lumen-cli
# 或
curl -fsSL https://lumen.lurus.cn/install.sh | sh
```

## Overview

```
lumen <command> [options]
```

| Command | Purpose |
|------|------|
| `doctor` | Environment self-check: token, network, disk, Python dependencies |
| `init` | Generate a `lumen.yaml` config template in the project root |
| `agent` | Agent-level operations: list / trace / replay / export |
| `mcp` | MCP compatibility layer: expose Lumen capabilities to Claude/Codex |
| `workflow` | Workflow executor based on `lumen.yaml` |
| `deploy` | Push Agent definitions to the Kova Cluster |
| `config` | View/modify local CLI configuration |

## Command Reference

```bash
# doctor — 环境自检（退出码 0 全通过 / 1 至少一项失败）
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
    <p class="lurus-callout__title">Both replay and dry-run are free</p>
    <div class="lurus-callout__body"><code>lumen agent replay &lt;run-id&gt;</code> replays from history records and <strong>does not consume tokens</strong>; <code>lumen workflow run --dry-run</code> walks through the full orchestration flow but <strong>does not actually call the LLM</strong>, making it ideal for validating your <code>lumen.yaml</code> configuration.</div>
  </div>
</div>

## Exit Codes

| Code | Meaning |
|------|------|
| `0` | Success |
| `1` | Generic error |
| `2` | Argument error |
| `3` | Missing configuration |
| `4` | Network error |
| `5` | Remote service returned an error |

## Next Steps

<NextSteps :steps="[
  { text: 'Back to Introduction', link: '/en/lumen/', primary: true },
  { text: 'Python SDK', link: '/en/lumen/python-sdk' },
  { text: 'Ecosystem Integration', link: '/en/lumen/integration' },
]" />

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-callout { margin: 18px 0; }
</style>
