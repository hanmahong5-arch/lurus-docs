---
title: Switch — MCP 服务器管理
description: 可视化配置 / 调试 MCP 服务器，跨 AI CLI 同步。
---

# MCP 服务器管理 <StatusBadge status="dev" />

Switch 把分散在 Claude Code / Codex / Gemini 各自 `mcp_servers.json` 里的配置**统一管理**，并提供可视化调试。

## MCP 管理器

打开 Switch → 左侧 "MCP 服务器"，可以看到：

- 当前已注册的所有 MCP Server（含状态：running / stopped / errored）
- 每个 Server 被哪些 CLI 引用
- 最近 N 次工具调用记录

## 配置格式

Switch 使用一份中央 `~/.lurus-switch/mcp.yaml`：

```yaml
servers:
  github:
    command: npx
    args: [-y, '@modelcontextprotocol/server-github']
    env:
      GITHUB_TOKEN: ${GITHUB_TOKEN}
    visible_to: [claude-code, codex]

  postgres:
    command: docker
    args: [run, -i, --rm, mcp/postgres, 'postgres://localhost/dev']
    visible_to: [claude-code]

  kova:
    url: http://localhost:3333
    type: http
    visible_to: [claude-code, codex, gemini]
```

切换任一 CLI 时，Switch 会按 `visible_to` 动态生成该 CLI 的 `mcp_servers.json`。

## 调试

选中一个 Server，右侧调试面板：

- **Tools 列表**：Server 暴露的所有工具，包括入参 schema
- **手动调用**：填入参数直接测试
- **Request Log**：最近的 request/response 完整 JSON
- **重启**：进程级重启

## 常用 Server 快速接入

Switch 内置了一键安装按钮，无需手写配置：

| Server | 用途 |
|--------|------|
| `github` | 读写 issues / PR / file |
| `postgres` | 查询数据库 |
| `filesystem` | 读写本地文件 |
| `slack` | 发消息 / 读频道 |
| `kova` | Kova Agent 作为工具 |
| `lumen` | Lumen Trace / Replay |

## 同步到团队

见 [团队同步](/switch/team-config)。

## 下一步

<NextSteps :steps="[
  { text: '成本监控', link: '/switch/cost-monitoring', primary: true },
  { text: '团队同步', link: '/switch/team-config' },
  { text: '回到使用手册', link: '/switch/usage' },
]" />
