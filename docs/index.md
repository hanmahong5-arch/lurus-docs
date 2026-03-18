---
layout: home

hero:
  name: "Lurus Docs"
  text: "一站式产品文档"
  tagline: AI 服务 · 桌面工具 · 开发者平台 — 所有产品的完整文档
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
    details: 一个 API Key 接入 50+ 主流 AI 模型（GPT、Claude、Gemini、DeepSeek），完全兼容 OpenAI SDK，3 行代码迁移。
    link: /guide/introduction
    linkText: 查看文档
  - icon: 📈
    title: Lucrum — AI 量化交易
    details: AI 驱动的量化交易平台，智能交易助手 + 策略市场 + 回测引擎，从策略开发到实盘执行的完整工作流。
    link: /gushen/
    linkText: 查看文档
  - icon: 🤖
    title: Kova — Agent 执行引擎
    details: Rust 构建的高性能 AI Agent 持久化执行引擎，WAL-First 架构，崩溃自动恢复，支持 Agent/Workflow/Swarm。
    link: /kova/
    linkText: 查看文档
  - icon: 🧠
    title: MemX — AI 智能记忆
    details: 基于 ACE 引擎的 AI 记忆管理，智能知识蒸馏，仿生遗忘曲线，四层混合检索，全链路隐私保护。
    link: /memx/
    linkText: 查看文档
  - icon: 🖥️
    title: Switch — 智能桌面客户端
    details: 桌面端 AI 模型网关，全平台支持，本地代理路由，一键切换模型服务，离线可用。
    link: /switch/
    linkText: 查看文档
  - icon: 🎬
    title: Creator — AI 内容工厂
    details: 桌面端 AI 内容创作工具，视频下载 → 语音转写 → AI 改写 → 多平台发布，一条龙自动化。
    link: /creator/
    linkText: 查看文档

---

## AI 服务

<div class="action-grid">
  <ActionCard
    name="Lurus API"
    tagline="一个 Key 接入 50+ AI 模型，兼容 OpenAI SDK"
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
    name="Lucrum"
    tagline="AI 量化交易平台，策略市场 + 智能助手"
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
    name="Kova"
    tagline="AI Agent 持久化执行引擎，Rust 构建"
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
    tagline="AI 智能记忆管理，仿生遗忘曲线"
    icon="🧠"
    color="#9333EA"
    :actions="[
      { label: '快速开始', href: '/memx/quickstart', primary: true },
      { label: '核心概念', href: '/memx/concepts' },
      { label: '架构设计', href: '/memx/architecture' },
    ]"
  />
  <ActionCard
    name="Forge"
    tagline="AI 产品可视化工作台（内测中）"
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
    tagline="桌面 AI 网关，全平台，本地路由，离线可用"
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
    tagline="AI 内容工厂，视频转写 + AI 改写 + 自动发布"
    icon="🎬"
    color="#C67B7B"
    :actions="[
      { label: '安装指南', href: '/creator/install', primary: true },
      { label: '使用手册', href: '/creator/usage' },
    ]"
  />
  <ActionCard
    name="Lumen"
    tagline="Agent 开发者 CLI，本地开发到云端部署"
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
    tagline="统一账号、订阅计划、鹿贝钱包"
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
    tagline="OpenAI 兼容 API，完整端点文档"
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
    tagline="混合云集群、GitOps、可观测性 (详细内容需登录)"
    icon="🏗️"
    color="#A8C67B"
    :actions="[
      { label: '查看架构', href: '/developer/architecture', primary: true },
    ]"
  />
</div>

<style>
.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  margin: 24px 0 40px;
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

### Lucrum — AI 量化交易助手

```
你: 帮我分析一下最近上证指数的走势

AI: 最近 20 个交易日，上证指数呈现震荡偏强走势...
    建议关注 3200 支撑位，若放量突破 MA20 可考虑加仓。
```

> [快速开始](/gushen/quickstart) · [策略市场](/gushen/strategies) · [交易平台](https://gushen.lurus.cn)

---

### Kova — 创建你的第一个 Agent

```bash
# 启动 Kova
docker run -d -p 8080:8080 -e LURUS_API_KEY=sk-xxx ghcr.io/hanmahong5-arch/kova:latest

# 创建 Agent
curl -X POST http://localhost:8080/api/v1/agents \
  -H "Content-Type: application/json" \
  -d '{"name":"researcher","model":"deepseek-chat","tools":["web_search"]}'
```

> [快速开始](/kova/quickstart) · [核心概念](/kova/concepts) · [API 参考](/kova/api)

---

### Switch — 下载与安装

| 平台 | 最低要求 | 安装说明 |
|------|---------|---------|
| Windows | Windows 10 64-bit | [安装指南](/switch/install#windows) |
| macOS | macOS 12+ | [安装指南](/switch/install#macos) |
| Linux | Ubuntu 20.04+ | [安装指南](/switch/install#linux) |

> [安装指南](/switch/install) · [配置说明](/switch/configuration)

---

### MemX — 让 AI 拥有记忆

```python
from memx import Memory

m = Memory(config={"ace_enabled": True})

# 从对话中自动学习知识
m.add([
    {"role": "user", "content": "pytest 超时怎么办？"},
    {"role": "assistant", "content": "用 pytest -x --timeout=30 逐个排查"}
], user_id="dev1", scope="project:backend")

# 四层混合检索
results = m.search("pytest 调试", user_id="dev1")
```

> [快速开始](/memx/quickstart) · [核心概念](/memx/concepts) · [架构设计](/memx/architecture)

---

## 联系我们

- **技术支持**: support@lurus.cn
- **商务合作**: business@lurus.cn
- **GitHub**: [hanmahong5-arch](https://github.com/hanmahong5-arch)
