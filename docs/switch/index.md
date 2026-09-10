---
title: Switch — AI 编程 CLI 统一管理中心
description: 桌面应用，一个界面管理 5 款主流 AI 编程 CLI 的配置、MCP 服务器和成本。
---

<div class="switch-page">

<ProductHero product-id="switch" />

<MetricStats :items="[
  { label: '管理 CLI', value: '5 款', hint: 'Claude Code / Codex / Gemini / PicoClaw / NullClaw' },
  { label: '包体积', value: '<15MB', hint: '单 exe 零依赖' },
  { label: '启动', value: '<2s', hint: 'Wails + Go 1.25 + React 18' },
]" />

## 什么是 Lurus Switch？

**Lurus Switch** 是一个桌面应用（单 exe 零依赖，&lt; 15MB），让你用一个界面管理 **5 款主流 AI 编程 CLI：Claude Code / Codex / Gemini CLI / PicoClaw / NullClaw** 的配置、MCP 服务器和成本。基于 **Wails**（Go 1.25 + React 18）构建，启动 &lt; 2 秒，支持 Windows / macOS / Linux 全平台。

当前开发者同时使用 Claude Code、Codex、Gemini CLI 等多个 AI CLI，配置散落各处、成本各自为政。Switch 将这一切集中管理。

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">一个界面，告别四处翻配置</p>
    <div class="lurus-callout__body">配置可视化编辑、MCP 跨工具同步、成本按工具/模型聚合——不用再分别打开每个 CLI 的 dotfile。</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="sparkles" :size="14" /> 核心能力</span>
  <h2 class="lurus-section-head__title">一站式管理你的全部 AI CLI</h2>
  <p class="lurus-section-head__lede">配置、MCP、成本、密钥、代理——常用的运维动作都在同一个窗口里完成。</p>
</div>

<CapabilityGrid accent="var(--lurus-color-switch)" :items="[
  { title: '多 CLI 配置管理', body: '可视化编辑 Claude Code / Codex / Gemini CLI / PicoClaw / NullClaw 配置，Monaco Editor 实时预览。', icon: 'layers' },
  { title: 'CLAUDE.md 智能助手', body: '扫描项目自动生成 CLAUDE.md，质量评分，给出优化建议。', icon: 'sparkles' },
  { title: 'MCP 服务器可视化', body: '告别手写 JSON，可视化配置 MCP 服务器，跨工具同步。', icon: 'plug' },
  { title: '成本监控仪表盘', body: '实时 Token 消耗趋势，按工具/模型分类，预算预警。', icon: 'bar-chart-3' },
  { title: 'API Key 统一管理', body: '跨工具统一存储和使用，安全加密。', icon: 'key' },
  { title: '代理与网络', body: '系统代理自动检测，Clash / V2Ray 一键配置，API Endpoint 自定义。', icon: 'shuffle' },
  { title: '配置快照', body: '保存 / 恢复 / 对比 diff，试错零成本。', icon: 'history' },
  { title: 'Prompt 模板库', body: '内置高质量模板 + 自定义管理 + 导入导出。', icon: 'package' },
  { title: '进程管理', body: 'CLI 进程监控：列表 / 终止 / 启动 / 输出查看。', icon: 'monitor' },
  { title: '自动更新', body: 'GitHub Releases 自更新 + 工具版本检查。', icon: 'package-plus' },
]" title="" />

---

## 工作原理

### 四种运行模式

首次启动时 Switch 让你选一种运行模式，之后整个界面按这个模式裁剪。白标分发出去的 EndUser 构建会跳过这一步——它出厂就锁定在 EndUser 模式，直接进激活流程。

<DiagramFigure
  caption="四种模式（Personal / Reseller / Enterprise / EndUser）从首次启动分叉；只有 EndUser 这一支带激活状态机 —— 未激活 → 激活（心跳运行中）→ 心跳校验失败则落到「已吊销 / 指纹不匹配」需要重新激活。回到未激活只有手动清除激活信息一条路，心跳失败不会把设备退回未激活态。"
  source="2c-gui-switch · 与仓库 README 同一张图">
  <SwitchArchitecture />
</DiagramFigure>

### 本地网关

Switch 内置一个本地网关，在 `127.0.0.1` 上暴露 OpenAI 兼容端点，把应用的调用统一转发到你配置的上游：

| 项 | 值 | 说明 |
|---|---|---|
| 默认端口 | `19090` | 在设置里可改，改完下次启动生效 |
| 默认是否自启 | **否** | `autoStart` 默认 false，要手动开或在设置里打开 |
| 启动前置 | **必须先配上游地址** | 未配置时启动直接报错退出，不会静默起一个转发不出去的端口 |
| 监听地址 | 仅 `127.0.0.1` | 不对局域网暴露 |

暴露的路径：`/v1/chat/completions`、`/v1/completions`、`/v1/embeddings`、`/v1/models` 及 `/v1/` 兜底走通用代理；`/v1/messages` 走单独的 Anthropic Messages 格式处理；另有免鉴权的 `/health` 与 `/switch/v1/status`、`/switch/v1/balance`。上游支持按优先级排序的回落链，前一个不可用时依次尝试下一个。

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="plug-zap" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">接入只改一处 base_url</p>
    <div class="lurus-callout__body">网关起来之后把应用的 <code>base_url</code> 指到 <code>http://localhost:19090/v1</code>，原有 OpenAI SDK 调用即可接通；回落与路由规则在 Switch 里集中维护，应用代码无需感知。</div>
  </div>
</div>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="search" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">本地模型是「探测」不是「代理」</p>
    <div class="lurus-callout__body">Switch 会扫描本机的 Ollama（<code>http://127.0.0.1:11434</code>）并把可直接使用的环境变量片段列出来供你复制。<strong>那个端口是 Ollama 的，不是 Switch 的</strong>——本地模型的流量不经过 Switch 网关。</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> 适用场景</span>
  <h2 class="lurus-section-head__title">谁在用 Switch</h2>
</div>

<UserScenarios title="" :scenarios="[
  { role: '多 CLI 用户', title: '多 CLI 管理', summary: '同时使用 Claude Code / Codex / Gemini CLI / PicoClaw / NullClaw 中的多个，需要统一配置管理。', link: '/switch/configuration' },
  { role: '成本负责人', title: '成本控制', summary: '多 CLI 并行使用，需要统一的费用视图和预算管控。', link: '/switch/cost-monitoring' },
  { role: '技术团队', title: '团队标准化', summary: '统一配置分发，确保团队成员使用一致的 AI CLI 设置。', link: '/switch/team-config' },
  { role: '中国开发者', title: '国内网络', summary: '需要翻墙配置、中文界面、国内 / 海外模型一键切换。', link: '/switch/configuration' },
]" />

---

## 与其他方案对比

<ComparisonTable
  self-label="Switch"
  :competitors="['Aider', 'Cursor', '手动管理']"
  :rows="[
    { dimension: 'CLI 覆盖', self: '5 款统一', alt: { Aider: '1 款', Cursor: '内置 IDE', '手动管理': 'N/A' } },
    { dimension: 'MCP 管理', self: '可视化 + 同步', alt: { Aider: '无', Cursor: '单独配', '手动管理': '手写 JSON' } },
    { dimension: '成本监控', self: '聚合仪表盘', alt: { Aider: '无', Cursor: '无', '手动管理': '无' } },
    { dimension: '团队同步', self: 'Git + Vault', alt: { Aider: '无', Cursor: '无', '手动管理': '无' } },
  ]"
  title=""
/>

---

## 支持的平台

| 平台 | 版本要求 |
|------|---------|
| Windows | Windows 10 64-bit 及以上 |
| macOS | macOS 12 (Monterey) 及以上 |
| Linux | Ubuntu 20.04 / Debian 11 及以上 |

---

## 下一步

<NextSteps :steps="[
  { text: '安装指南', link: '/switch/install', primary: true },
  { text: '配置说明', link: '/switch/configuration' },
  { text: '使用手册', link: '/switch/usage' },
]" title="" />

<RelatedProducts product-id="switch" />

</div>

<style>
.switch-page .lurus-section-head { margin-top: 8px; }
.switch-page .cap-grid__heading { display: none; }
</style>
