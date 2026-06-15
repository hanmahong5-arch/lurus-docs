---
title: 团队 AI CLI 统一接入（Switch + MCP + 网关）
description: 用 Switch 把团队的 AI CLI 工具、MCP 服务器和模型成本统一管理 —— 一份中央配置，跨 Claude Code / Codex / Gemini 同步。
---

<div class="tut-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="monitor" :size="14" /> 跨产品教程</span>
  <h1 class="lurus-section-head__title">团队 AI CLI 统一接入</h1>
  <p class="lurus-section-head__lede">把分散在每个工程师机器上的 AI CLI 配置、MCP 服务器、模型 Key 收敛成<strong>一份中央配置</strong>：Switch 管 MCP 与同步，Lurus API 管模型与计费。</p>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">联动产品</p>
    <div class="lurus-callout__body">Switch（桌面工具管理）· Lurus API（统一网关）· MCP 服务器（Kova / GitHub / PostgreSQL 等）。本教程只引用各产品文档已有的能力。</div>
  </div>
</div>

## <Icon name="package" :size="20" /> 你会得到

| Before（各自为政） | After（Switch 统一） |
|---|---|
| 每人手写 `mcp_servers.json`，工具版本不一 | 一份中央 `mcp.yaml`，`visible_to` 按需下发 |
| 各 CLI 各填一套 Provider Key | 统一走 Lurus API，一个 Key、一份账单 |
| 模型成本不可见 | Switch 成本看板按工具 / 模型聚合 |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="rocket" :size="14" /> 第一步</span>
  <h2 class="lurus-section-head__title">安装 Switch，接上网关</h2>
</div>

<ol class="lurus-steps">
<li>

按 [安装指南](/switch/install) 装好 Switch（macOS / Windows / Linux）。

</li>
<li>

在设置里填入 Lurus <Term t="API Key">API Key</Term>（[获取方式](/guide/get-api-key)），让所有 CLI 统一经 `https://api.lurus.cn/v1` 调模型 —— 一个 Key、一份账单。

</li>
<li>

验证本地代理已起（默认端口 19090）：

```bash
curl http://localhost:19090/v1/models
```

</li>
</ol>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="plug" :size="14" /> 第二步</span>
  <h2 class="lurus-section-head__title">写一份中央 MCP 配置</h2>
  <p class="lurus-section-head__lede">Switch 用一份 <code>~/.lurus-switch/mcp.yaml</code> 管理所有 MCP 服务器，<code>visible_to</code> 决定每个 CLI 看到哪些。</p>
</div>

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

  kova:                       # Kova Agent 作为工具暴露
    url: http://localhost:3333
    type: http
    visible_to: [claude-code, codex, gemini]
```

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shuffle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">visible_to 驱动按需下发</p>
    <div class="lurus-callout__body">切换任一 CLI 时，Switch 按 <code>visible_to</code> 动态生成该 CLI 的 <code>mcp_servers.json</code>，每个工具只看到分配给它的 Server。可接入的服务器清单见<a href="/integrations/">集成目录</a>，管理细节见 <a href="/switch/mcp-servers">MCP 服务器</a>。</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> 第三步</span>
  <h2 class="lurus-section-head__title">看见成本，再同步给团队</h2>
</div>

<ol class="lurus-steps">
<li>

打开 Switch 的<a href="/switch/cost-monitoring">成本监控</a>，按工具 / 模型查看 Token 消耗 —— 因为所有调用都走同一个 Lurus API Key，账单是统一的。

</li>
<li>

确认配置无误后，用<a href="/switch/team-config">团队同步</a>把这份 `mcp.yaml` 分发给团队，新成员开箱即用、版本一致。

</li>
</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="sparkles" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">下一步可以加什么</p>
    <div class="lurus-callout__body"><p>给 CLI 接入 <a href="/memx/quickstart">MemX 记忆</a>（<code>memory_search</code> / <code>memory_add</code> 工具）让 Agent 记住项目规范；或接 <a href="/lumen/">Lumen</a> 做调用追踪与成本告警。</p></div>
  </div>
</div>

<NextSteps
  title="下一步"
  :steps="[
    { text: 'Switch MCP 服务器', link: '/switch/mcp-servers', primary: true },
    { text: '集成与 MCP 目录', link: '/integrations/' },
    { text: '记忆 Agent 教程', link: '/tutorials/memory-agent' },
  ]"
/>

</div>
