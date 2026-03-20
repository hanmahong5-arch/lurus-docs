---
layout: home

hero:
  name: "Lurus"
  text: "AI 基础设施与产品平台"
  tagline: 从执行引擎到量化交易，从智能记忆到内容创作 — 覆盖 AI 全栈的产品矩阵
  image:
    src: /hero-image.svg
    alt: Lurus Platform
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quickstart
    - theme: alt
      text: 获取 API Key
      link: /guide/get-api-key
    - theme: alt
      text: 控制台
      link: https://api.lurus.cn

features:
  - icon: 🔌
    title: Lurus API — LLM 统一网关
    details: 一个 API Key 接入 50+ 主流 AI 模型，完全兼容 OpenAI SDK。智能路由、自动故障转移、per-channel 熔断保护，网关延迟 p95 < 50ms。
    link: /guide/introduction
    linkText: 查看文档
  - icon: 🤖
    title: Kova — Agent 持久执行引擎
    details: Rust 构建的 WAL-First 架构，152,000 行工业级代码。崩溃自动恢复、微秒级调度、零外部依赖，支持 REST/gRPC/MCP/A2A 五种协议。
    link: /kova/
    linkText: 查看文档
  - icon: 🧠
    title: MemX — AI 自适应记忆
    details: 基于 ACE v2.0 的知识蒸馏引擎，零 LLM 成本提取知识、艾宾浩斯衰退遗忘、四层混合检索、12 种 PII 隐私过滤。
    link: /memx/
    linkText: 查看文档
  - icon: 📈
    title: Lucrum — AI 量化交易
    details: 自然语言描述策略，AI 自动生成代码并回测。11 个投资顾问 Agent、Decimal.js 金融级精度、680+ 单元测试覆盖。
    link: /gushen/
    linkText: 查看文档
  - icon: 🖥️
    title: Switch — AI 工具管理中心
    details: 一个桌面应用管理 Claude Code / Codex / Gemini CLI 等所有 AI 编程工具的配置、MCP 服务器和成本。单 exe 零依赖。
    link: /switch/
    linkText: 查看文档
  - icon: 🎬
    title: Creator — AI 内容工厂
    details: 粘贴视频链接，AI 一键生成微信/抖音/小红书三平台定制内容并自动发布。支持 8 大视频平台，单 exe 零依赖。
    link: /creator/
    linkText: 查看文档

---

<div class="platform-stats">
  <div class="stat-item">
    <span class="stat-number">12</span>
    <span class="stat-label">产品矩阵</span>
  </div>
  <div class="stat-item">
    <span class="stat-number">50+</span>
    <span class="stat-label">AI 模型接入</span>
  </div>
  <div class="stat-item">
    <span class="stat-number">5</span>
    <span class="stat-label">编程语言</span>
  </div>
  <div class="stat-item">
    <span class="stat-number">3 us</span>
    <span class="stat-label">Kova 调度延迟</span>
  </div>
</div>

## AI 服务

<div class="action-grid">
  <ActionCard
    name="Lurus API"
    status="live"
    tagline="一个 Key 接入 50+ AI 模型，兼容 OpenAI SDK，p95 < 50ms"
    icon="🔌"
    color="#C67B5C"
    :actions="[
      { label: '快速开始', href: '/guide/quickstart', primary: true },
      { label: '获取 API Key', href: '/guide/get-api-key' },
      { label: '支持的模型', href: '/guide/models' },
      { label: '控制台', href: 'https://api.lurus.cn', external: true },
    ]"
  />
  <ActionCard
    name="Kova"
    status="dev"
    tagline="Rust 构建的 Agent 持久执行引擎，WAL 崩溃恢复，152K 行代码"
    icon="🤖"
    color="#6B8E7B"
    :actions="[
      { label: '快速开始', href: '/kova/quickstart', primary: true },
      { label: '核心概念', href: '/kova/concepts' },
      { label: 'API 参考', href: '/kova/api' },
    ]"
  />
  <ActionCard
    name="MemX"
    status="dev"
    tagline="AI 自适应记忆引擎，零 LLM 成本蒸馏，仿生遗忘曲线"
    icon="🧠"
    color="#9333EA"
    :actions="[
      { label: '快速开始', href: '/memx/quickstart', primary: true },
      { label: '核心概念', href: '/memx/concepts' },
      { label: '架构设计', href: '/memx/architecture' },
    ]"
  />
  <ActionCard
    name="Lucrum"
    status="live"
    tagline="AI 量化交易，自然语言生成策略，11 个投资顾问 Agent"
    icon="📈"
    color="#7B8EC6"
    :actions="[
      { label: '快速开始', href: '/gushen/quickstart', primary: true },
      { label: '策略市场', href: '/gushen/strategies' },
      { label: '常见问题', href: '/gushen/faq' },
      { label: '交易平台', href: 'https://gushen.lurus.cn', external: true },
    ]"
  />
  <ActionCard
    name="Forge"
    status="beta"
    tagline="AI 产品可视化工作台，对话驱动开发"
    icon="🔨"
    color="#C6A87B"
    :actions="[
      { label: '了解详情', href: '/forge/', primary: true },
    ]"
  />
</div>

## 桌面工具

<div class="action-grid">
  <ActionCard
    name="Switch"
    status="dev"
    tagline="AI 编程工具统一管理，配置 + MCP + 成本一站式控制"
    icon="🖥️"
    color="#16A34A"
    :actions="[
      { label: '安装指南', href: '/switch/install', primary: true },
      { label: '配置说明', href: '/switch/configuration' },
      { label: '使用手册', href: '/switch/usage' },
    ]"
  />
  <ActionCard
    name="Creator"
    status="dev"
    tagline="AI 内容工厂，视频转写 + 三平台改写 + 自动发布"
    icon="🎬"
    color="#C67B7B"
    :actions="[
      { label: '安装指南', href: '/creator/install', primary: true },
      { label: '使用手册', href: '/creator/usage' },
    ]"
  />
  <ActionCard
    name="Lumen"
    status="dev"
    tagline="Agent 可观测性工具，Replay + 崩溃恢复 + 成本追踪"
    icon="⚡"
    color="#AF8B7B"
    :actions="[
      { label: '安装与使用', href: '/lumen/', primary: true },
    ]"
  />
</div>

## 平台基础

<div class="action-grid">
  <ActionCard
    name="账号与计费"
    tagline="统一账号、订阅计划、鹿贝钱包、VIP 体系"
    icon="💰"
    color="#8B9DAF"
    :actions="[
      { label: '平台概述', href: '/platform/', primary: true },
      { label: '计费详解', href: '/platform/billing' },
      { label: '常见问题', href: '/platform/faq' },
    ]"
  />
  <ActionCard
    name="API 参考"
    tagline="OpenAI 兼容 API，完整端点文档与错误码"
    icon="📖"
    color="#7BAFC6"
    :actions="[
      { label: 'API 概述', href: '/api/overview', primary: true },
      { label: '认证', href: '/api/authentication' },
      { label: 'Chat Completions', href: '/api/chat-completions' },
    ]"
  />
  <ActionCard
    name="系统架构"
    tagline="混合云集群、GitOps、全栈可观测性"
    icon="🏗️"
    color="#A8C67B"
    :actions="[
      { label: '查看架构', href: '/developer/architecture', primary: true },
    ]"
  />
</div>

<style>
.platform-stats {
  display: flex;
  justify-content: center;
  gap: 48px;
  padding: 40px 0 16px;
  flex-wrap: wrap;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: var(--vp-c-brand-1);
  line-height: 1;
}
.stat-label {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  font-weight: 500;
}
.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  margin: 24px 0 40px;
}
@media (max-width: 640px) {
  .platform-stats {
    gap: 24px;
  }
  .stat-number {
    font-size: 1.5rem;
  }
}
</style>

---

## 快速上手

### Lurus API — 3 行代码接入所有 AI

```bash
curl https://api.lurus.cn/v1/chat/completions \
  -H "Authorization: Bearer $LURUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"你好"}]}'
```

> [完整文档](/guide/quickstart) · [API 参考](/api/overview) · [控制台](https://api.lurus.cn)

---

### Kova — 创建你的第一个持久化 Agent

```rust
// cargo add kova
use kova::prelude::*;

let engine = KovaBuilder::new()
    .wal_dir("./agent-state")
    .build()?;

// Agent 崩溃后自动从 WAL 恢复，不重新调用 LLM
let agent = engine.create_agent("researcher")
    .model("deepseek-chat")
    .tools(&["web_search", "file_read"])
    .build()?;
```

> [快速开始](/kova/quickstart) · [核心概念](/kova/concepts) · [API 参考](/kova/api)

---

### Lucrum — 自然语言描述策略，AI 生成并回测

```
你: 双均线交叉策略，5日线上穿20日线买入，下穿卖出，止损5%

AI: 已生成 vnpy CtaTemplate 策略代码。
    回测结果 (2024-01 ~ 2025-12):
    夏普比率: 1.42 | 最大回撤: 8.3% | 胜率: 62%
    评级: A (收益优秀，风控良好)
```

> [快速开始](/gushen/quickstart) · [策略市场](/gushen/strategies) · [交易平台](https://gushen.lurus.cn)

---

### MemX — 让 AI 拥有持久记忆

```python
from memx import Memory

m = Memory(config={"ace_enabled": True})

# 从对话中自动蒸馏高价值知识，零 LLM 成本
m.add([
    {"role": "user", "content": "pytest 超时怎么办？"},
    {"role": "assistant", "content": "用 pytest -x --timeout=30 逐个排查"}
], user_id="dev1", scope="project:backend")

# 四层混合检索 + 衰退加权
results = m.search("pytest 调试", user_id="dev1")
```

> [快速开始](/memx/quickstart) · [核心概念](/memx/concepts) · [架构设计](/memx/architecture)

---

### Switch — 下载与安装

| 平台 | 最低要求 | 安装说明 |
|------|---------|---------|
| Windows | Windows 10 64-bit | [安装指南](/switch/install#windows) |
| macOS | macOS 12+ | [安装指南](/switch/install#macos) |
| Linux | Ubuntu 20.04+ | [安装指南](/switch/install#linux) |

> [安装指南](/switch/install) · [配置说明](/switch/configuration) · [使用手册](/switch/usage)

---

## 为什么选择 Lurus？

| 维度 | Lurus 的优势 |
|------|-------------|
| **全栈自研** | 从 Rust 执行引擎到 Flutter 移动端，核心技术完全自主可控 |
| **引擎级性能** | Kova 3 us 调度延迟，比 Temporal 快 500 倍；API 网关 p95 < 50ms |
| **数据主权** | 私有化部署，数据不出企业边界，支持国密 SM4-GCM |
| **生态协同** | 12 个产品共享账户/计费/记忆/LLM 网关，越用越值 |
| **经济高效** | MemX 零 LLM 成本蒸馏；Lucrum Decimal.js 全精度零浮点误差 |

---

## 联系我们

- **技术支持**: support@lurus.cn
- **商务合作**: business@lurus.cn
- **GitHub**: [github.com/hanmahong5-arch](https://github.com/hanmahong5-arch)
