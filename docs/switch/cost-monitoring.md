---
title: Switch — 成本监控
description: 5 款 CLI 聚合成本、阈值告警、归因分析、与 Lumen 协同。
---

<div class="switch-page">

# 成本监控 <StatusBadge status="dev" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bar-chart-3" :size="14" /> 成本仪表盘</span>
  <h2 class="lurus-section-head__title">把 5 款 CLI 的 Token 消费聚到一处</h2>
  <p class="lurus-section-head__lede">Switch 把 Claude Code / Codex / Gemini / PicoClaw / NullClaw 等工具的 Token 消费统一聚合，并在超出预算前告警。</p>
</div>

## 成本聚合

启动 Switch 后台进程后，所有由 Switch 启动的 CLI 进程的请求都会经过本地代理（默认 `127.0.0.1:41234`），记录到本地 SQLite：

```
~/.lurus-switch/costs.db
```

聚合维度：

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="terminal" :size="20" /></span>
    <div class="lurus-card__title">工具</div>
    <p class="lurus-card__body">claude-code / codex / gemini / picoclaw / nullclaw</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">模型</div>
    <p class="lurus-card__body">claude-sonnet-4 / gpt-5 / gemini-3-pro 等</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="package" :size="20" /></span>
    <div class="lurus-card__title">项目</div>
    <p class="lurus-card__body">按 CWD 所在 git 仓库 root</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="timer" :size="20" /></span>
    <div class="lurus-card__title">时间</div>
    <p class="lurus-card__body">天 / 周 / 月</p>
  </div>
</div>

## 阈值告警

在 Switch 设置页面配置：

| 告警类型 | 示例 |
|---------|------|
| 日预算 | 超过 ¥50/天 时系统通知 |
| 单次调用 | 超过 ¥2/次 标红 |
| 模型占比 | Claude Opus > 60% 时提醒换档 |

告警渠道：<span class="lurus-tag">系统通知</span> <span class="lurus-tag">邮件</span> <span class="lurus-tag">Webhook</span>

## 归因分析

> "今天为什么突然花这么多？"

Switch 提供**火焰图式**归因，逐层下钻到具体元凶：

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

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="git-merge" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">开启 Lumen 集成</p>
    <div class="lurus-callout__body">在 Switch 设置开启「Lumen 集成」并指向 <code>http://localhost:7070</code>，即可把 Switch 的粗粒度成本与 Lumen 的 Graph / Node / LLM Call 级别 Trace 合并为完整成本拓扑。</div>
  </div>
</div>

## 导出

界面操作：

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

</div>

<style scoped>
.switch-page .lurus-section-head { margin-top: 2.6rem; }
</style>
