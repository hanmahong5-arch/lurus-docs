---
title: Lumen CLI 手册
description: lumen-cli 的全部子命令、选项、退出码与工作流脚手架。
---

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

## `doctor`

`lumen doctor` 检查本地环境是否满足 Lumen 运行所需。

```bash
$ lumen doctor
✓ LURUS_API_KEY present
✓ python3.11 detected
✓ /var/lumen writable (5.2 GB free)
✗ port 7070 occupied — close the process or set LUMEN_PORT
```

退出码：`0` 全通过，`1` 至少一项失败。

## `init`

在项目根生成 `lumen.yaml`：

```bash
lumen init --template langgraph
```

Templates: `langgraph`, `bare`, `multi-agent`。

## `agent`

```bash
lumen agent list                  # 列出本地 / 远端 Agent
lumen agent trace <run-id>        # 打印 trace 树
lumen agent replay <run-id>       # 不消耗 Token 重放
lumen agent export <run-id>       # 导出 JSON / HAR / OTel
```

## `mcp`

启动一个 MCP 服务端，把 Lumen 的 Trace/Replay/Cost 能力暴露为工具：

```bash
lumen mcp serve --port 3333
# 或自定义清单
lumen mcp serve --manifest ./my-tools.yaml
```

Claude Code / Codex 配置 `mcp_servers` 指向 `http://127.0.0.1:3333` 即可调用。

## `workflow`

`lumen.yaml` 描述多 Agent 编排，`lumen workflow run` 执行：

```bash
lumen workflow run                # 执行默认 pipeline
lumen workflow run -e prod        # 指定环境
lumen workflow run --dry-run      # 不实际调用 LLM
```

## `deploy`

将 Agent 定义推送到 [Kova](/kova/) Cluster：

```bash
lumen deploy --target kova://my-cluster
```

## `config`

```bash
lumen config get api_key
lumen config set api_key sk-xxxx
lumen config unset telemetry.endpoint
```

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
