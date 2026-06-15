---
title: Switch — MCP 服务器管理
description: 可视化配置 / 调试 MCP 服务器，跨 AI CLI 同步。
---

<div class="switch-page">

# MCP 服务器管理 <StatusBadge status="dev" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="plug" :size="14" /> 统一管理</span>
  <h2 class="lurus-section-head__title">一份中央配置，跨 CLI 同步</h2>
  <p class="lurus-section-head__lede">Switch 把分散在 Claude Code / Codex / Gemini 各自 <code>mcp_servers.json</code> 里的配置统一管理，并提供可视化调试。</p>
</div>

## MCP 管理器

打开 Switch → 左侧 "MCP 服务器"，可以看到：

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">注册状态</div>
    <p class="lurus-card__body">当前已注册的所有 MCP Server，含状态 <span class="lurus-tag">running</span> <span class="lurus-tag">stopped</span> <span class="lurus-tag">errored</span></p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="share-2" :size="20" /></span>
    <div class="lurus-card__title">引用关系</div>
    <p class="lurus-card__body">每个 Server 被哪些 CLI 引用</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="history" :size="20" /></span>
    <div class="lurus-card__title">调用记录</div>
    <p class="lurus-card__body">最近 N 次工具调用记录</p>
  </div>
</div>

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

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shuffle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">visible_to 驱动按需下发</p>
    <div class="lurus-callout__body">切换任一 CLI 时，Switch 会按 <code>visible_to</code> 动态生成该 CLI 的 <code>mcp_servers.json</code>，每个工具只看到分配给它的 Server。</div>
  </div>
</div>

## 调试

选中一个 Server，右侧调试面板：

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="puzzle" :size="20" /></span>
    <div class="lurus-card__title">Tools 列表</div>
    <p class="lurus-card__body">Server 暴露的所有工具，包括入参 schema</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">手动调用</div>
    <p class="lurus-card__body">填入参数直接测试</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="search" :size="20" /></span>
    <div class="lurus-card__title">Request Log</div>
    <p class="lurus-card__body">最近的 request/response 完整 JSON</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="rewind" :size="20" /></span>
    <div class="lurus-card__title">重启</div>
    <p class="lurus-card__body">进程级重启</p>
  </div>
</div>

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

</div>

<style scoped>
.switch-page .lurus-section-head { margin-top: 2.6rem; }
</style>
