---
title: Switch — 成本监控
description: 5 款 CLI 聚合成本、阈值告警、归因分析、与 Lumen 协同。
---

# 成本监控 <StatusBadge status="dev" />

Switch 把 Claude Code / Codex / Gemini / PicoClaw / NullClaw 等工具的 Token 消费统一聚合，并在超出预算前告警。

## 成本聚合

启动 Switch 后台进程后，所有由 Switch 启动的 CLI 进程的请求都会经过本地代理（默认 `127.0.0.1:41234`），记录到本地 SQLite：

```
~/.lurus-switch/costs.db
```

聚合维度：

- 工具（claude-code / codex / gemini / picoclaw / nullclaw）
- 模型（claude-sonnet-4 / gpt-5 / gemini-3-pro 等）
- 项目（按 CWD 所在 git 仓库 root）
- 时间（天 / 周 / 月）

## 阈值告警

在 Switch 设置页面配置：

| 告警类型 | 示例 |
|---------|------|
| 日预算 | 超过 ¥50/天 时系统通知 |
| 单次调用 | 超过 ¥2/次 标红 |
| 模型占比 | Claude Opus > 60% 时提醒换档 |

告警渠道：系统通知 / 邮件 / Webhook。

## 归因分析

"今天为什么突然花这么多？"

Switch 提供**火焰图式**归因：

```
总消费 ¥38.2 (↑ 250% vs 昨日)
├─ claude-code   ¥28.4 (74%)  ← 主因
│   └─ 项目: 2l-bs-docs       ¥21.3  ← 具体元凶
│       └─ 模型: claude-opus  ¥19.8
├─ codex         ¥6.5
└─ gemini        ¥3.3
```

## 与 Lumen 协同

对于使用 Lumen SDK 的 Agent 项目，Switch 可以合并 Lumen 的细粒度 Trace 数据：

```
Switch 粗粒度: 项目 / 工具 / 模型
     +
Lumen 细粒度: Graph / Node / LLM Call
     =
完整成本拓扑
```

在 Switch 设置开启"Lumen 集成"并指向 `http://localhost:7070`。

## 导出

```
右键 → 导出为 CSV / JSON
```

或命令行：

```bash
lurus-switch export --format csv --since 30d > costs.csv
```

## 下一步

<NextSteps :steps="[
  { text: 'MCP 服务器管理', link: '/switch/mcp-servers', primary: true },
  { text: '团队同步', link: '/switch/team-config' },
  { text: 'Lumen 成本追踪', link: '/lumen/python-sdk' },
]" />
