---
title: Lumen CLI 手册
description: lumen-cli 的全部子命令、选项、退出码与工作流脚手架。
---

<div class="lumen-page">

# Lumen CLI 手册 <StatusBadge status="dev" />

`lumen-cli` 是 Lumen 的可选 CLI（Rust 构建），提供不依赖 Python SDK 的命令行工作流能力。

## 安装

```bash
cargo install lumen-cli
# 或
curl -fsSL https://lumen.lurus.cn/install.sh | sh
```

## 总览

```
lumen <command> [options]
```

| 命令 | 用途 |
|------|------|
| `doctor` | 环境自检：Token、网络、磁盘、Python 依赖 |
| `init` | 在项目根生成 `lumen.yaml` 配置模板 |
| `agent` | Agent 级操作：列表 / trace / replay / export |
| `mcp` | MCP 兼容层：将 Lumen 能力暴露给 Claude/Codex |
| `workflow` | 基于 `lumen.yaml` 的工作流执行器 |
| `deploy` | 推送 Agent 定义到 Kova Cluster |
| `config` | 查看/修改本地 CLI 配置 |

## 命令详解

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
    <p class="lurus-callout__title">replay 与 dry-run 都不花钱</p>
    <div class="lurus-callout__body"><code>lumen agent replay &lt;run-id&gt;</code> 从历史记录回放，<strong>不消耗 Token</strong>；<code>lumen workflow run --dry-run</code> 走完编排流程但<strong>不实际调用 LLM</strong>，适合验证 <code>lumen.yaml</code> 配置。</div>
  </div>
</div>

## 退出码

| Code | 含义 |
|------|------|
| `0` | 成功 |
| `1` | 通用错误 |
| `2` | 参数错误 |
| `3` | 配置缺失 |
| `4` | 网络错误 |
| `5` | 远端服务返回错误 |

## 下一步

<NextSteps :steps="[
  { text: '回到简介', link: '/lumen/', primary: true },
  { text: 'Python SDK', link: '/lumen/python-sdk' },
  { text: '生态集成', link: '/lumen/integration' },
]" />

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-callout { margin: 18px 0; }
</style>
