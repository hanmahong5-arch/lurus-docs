---
title: Switch 使用手册
description: Switch 桌面应用的日常使用指南，包括快速接入和高级功能。
---

<div class="switch-page">

# Switch 使用手册 <StatusBadge status="dev" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="rocket" :size="14" /> 上手</span>
  <h2 class="lurus-section-head__title">把任意 OpenAI 客户端接到 Switch</h2>
  <p class="lurus-section-head__lede">Switch 启动后在本地暴露兼容 OpenAI API 的端点，改一行 <code>base_url</code> 即可让所有请求自动由 Switch 路由。</p>
</div>

## 快速接入

Switch 启动后本地暴露兼容 OpenAI API 的端点 `http://localhost:19090/v1`（Switch gateway 默认端口 19090）。把应用/SDK 的 `base_url` 改为此地址，所有请求自动由 Switch 路由。`api_key` 填任意值（如 `switch`），Switch 用配置中的 provider key。

<ol class="lurus-steps">

<li>

把客户端的 `base_url` 指向本地 Switch 端点，`api_key` 填任意值（如 `switch`），照常发起请求：

::: code-group

```bash [cURL]
curl http://localhost:19090/v1/chat/completions \
  -H "Content-Type: application/json" -H "Authorization: Bearer switch" \
  -d '{"model":"gpt-4o","messages":[{"role":"user","content":"Hello"}]}'
```

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:19090/v1",
    api_key="switch",
)
resp = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}],
)
print(resp.choices[0].message.content)
```

```javascript [Node.js]
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "http://localhost:19090/v1",
  apiKey: "switch",
});
const resp = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello" }],
});
console.log(resp.choices[0].message.content);
```

:::

</li>

<li>

OpenAI SDK（Python / Node.js）只改 `base_url`/`baseURL` 与 `api_key`，其余调用照常 — Switch 用配置中的 provider key 完成实际路由，客户端无需感知下游提供商。

</li>

</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">为什么 api_key 可以填任意值</p>
    <div class="lurus-callout__body">Switch 作为本地代理，使用配置中保存的真实 provider key 调用下游。客户端这一侧的 <code>api_key</code> 仅用于占位，填 <code>switch</code> 即可。</div>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="code" :size="14" /> 集成</span>
  <h2 class="lurus-section-head__title">在 AI 编程工具中使用</h2>
  <p class="lurus-section-head__lede">所有工具的 API Base / 接口地址均填 <code>http://localhost:19090/v1</code>，API Key 填 <code>switch</code>。</p>
</div>

## 在 AI 编程工具中使用

所有工具的 API Base / 接口地址均填 `http://localhost:19090/v1`，API Key 填 `switch`：

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="code" :size="22" /></span>
    <div class="lurus-card__title">Cursor</div>
    <p class="lurus-card__body">设置（<code>Ctrl+,</code>）→ 搜「AI」→「OpenAI API Base」改为该地址 → 保存，补全和对话自动走 Switch。</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="terminal" :size="22" /></span>
    <div class="lurus-card__title">Continue（VS Code）</div>
    <p class="lurus-card__body">编辑 <code>~/.continue/config.json</code>，每个 model 项设 <code>"provider": "openai"</code>、<code>"apiBase": "http://localhost:19090/v1"</code>、<code>"apiKey": "switch"</code>，<code>"model"</code> 填 <code>deepseek-chat</code> / <code>gpt-4o</code> 等。</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="22" /></span>
    <div class="lurus-card__title">Cherry Studio</div>
    <p class="lurus-card__body">设置 → API 配置 → 选「自定义 OpenAI 兼容」→ 填地址和 Key →「测试连接」。</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="bot" :size="22" /></span>
    <div class="lurus-card__title">Lobe Chat</div>
    <p class="lurus-card__body">设置 → 语言模型 → OpenAI → 填 API Key 和接口地址。</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> 运行时</span>
  <h2 class="lurus-section-head__title">监控、切换与流式</h2>
</div>

## 请求监控

「**日志**」选项卡查看实时请求日志，字段：时间（时间戳）、模型、提供商（实际路由目标）、耗时（ms）、Token（prompt/completion）、状态（200 / 4xx-5xx）。「导出 CSV」可导出近 7 天记录用于成本统计。

## 一键切换提供商

菜单栏图标（macOS）/ 系统托盘（Windows）点击可：切换「当前活跃提供商」、临时禁用某提供商（调试）、查看今日用量概览。

## 流式响应

完全支持 SSE 流式响应并透传下游：`chat.completions.create(..., stream=True)` 后迭代 `chunk.choices[0].delta.content`。

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shuffle" :size="14" /> 进阶</span>
  <h2 class="lurus-section-head__title">负载均衡</h2>
  <p class="lurus-section-head__lede">同一模型配置多个提供商时可轮询或按权重分配。</p>
</div>

## 高级：负载均衡

同一模型配置多个提供商时可轮询或按权重分配：

```json
{
  "routing": {
    "rules": [
      {
        "pattern": "deepseek-chat",
        "providers": [
          { "name": "Lurus API", "weight": 70 },
          { "name": "DeepSeek Official", "weight": 30 }
        ],
        "strategy": "weighted_random"
      }
    ]
  }
}
```

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> 排障</span>
  <h2 class="lurus-section-head__title">故障排查</h2>
  <p class="lurus-section-head__lede">展开对应症状查看处理步骤。</p>
</div>

## 故障排查

<details class="lurus-faq-item">
<summary>"connection refused" — 连接被拒绝</summary>

Switch 未启动或端口不对。检查进程和端口：

- 进程：Windows `tasklist | findstr LurusSwitch` / macOS·Linux `ps aux | grep lurus-switch`
- 端口：`curl http://localhost:19090/v1/models`

</details>

<details class="lurus-faq-item">
<summary>401 / 403 — 鉴权失败</summary>

提供商 API Key 配置错误。在配置界面重新填写并点击「测试」验证连通性。

</details>

<details class="lurus-faq-item">
<summary>延迟异常高</summary>

1. 日志查路由是否命中正确提供商。
2. 海外提供商（OpenAI / Anthropic）高延迟正常（300-1500ms）。
3. 改用 Lurus API 国内节点（通常 &lt; 200ms）。

</details>

<details class="lurus-faq-item">
<summary>macOS 应用无响应</summary>

菜单栏右键「退出」后重启，或终端执行：

```bash
pkill -f LurusSwitch && open -a "Lurus Switch"
```

</details>

## 下一步

<NextSteps :steps="[
  { text: 'MCP 服务器管理', link: '/switch/mcp-servers', primary: true },
  { text: '成本监控', link: '/switch/cost-monitoring' },
  { text: '团队配置同步', link: '/switch/team-config' },
]" />

</div>

<style scoped>
.switch-page .lurus-section-head { margin-top: 2.6rem; }
</style>
