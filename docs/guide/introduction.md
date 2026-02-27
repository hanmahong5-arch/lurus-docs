# Lurus API 简介

**一个 API Key，接入 50+ 主流 AI 模型。** 完全兼容 OpenAI SDK，现有代码只需两行改动，无需重写。

---

## 你是哪种用户？

::: info 我想快速试用 AI，没有技术背景
→ 先配置一个 AI 客户端：[Cherry Studio](/guide/clients/cherry-studio) · [Lobe Chat](/guide/clients/lobe-chat)，填入 API Key 即可对话，全程无需写代码。
:::

::: tip 我是开发者，想接入 AI 能力
→ [快速开始](/guide/quickstart) — 5 分钟完成首次 API 调用，支持 Python / Node.js / Go / cURL。
:::

::: info 我已在用 OpenAI，想切换 / 降成本
→ 替换两行代码即可迁移，所有 OpenAI SDK 功能完全兼容：
```python
# 改这两行，其余代码不动
base_url="https://api.lurus.cn/v1"
api_key="sk-your-lurus-key"
```
:::

---

## 核心能力

### 🔌 统一 API — 一个接口覆盖所有模型

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.lurus.cn/v1",
    api_key="sk-your-api-key"
)

# GPT-4o、Claude、Gemini、DeepSeek，换个名字就行
response = client.chat.completions.create(
    model="deepseek-chat",  # 或 gpt-4o / claude-3-5-sonnet / gemini-3-pro-preview
    messages=[{"role": "user", "content": "你好"}]
)
```

### 🔀 智能路由与自动故障转移

- **多渠道备援**：同一模型配置多个供应商，主渠道失败自动切换
- **权重负载均衡**：按比例分流到不同渠道，平衡成本与速度
- **优先级策略**：先用低成本渠道，超限再切换高成本备用

### 💵 精细化成本控制

- 为每个 API Key 设置 Token 配额，超量自动拦截
- 按天/月查看调用次数、Token 消耗、费用明细
- 配额告警：剩余不足 20% 时发送通知

### 🛡️ 企业级访问管理

| 功能 | 说明 |
|------|------|
| 多 Key 管理 | 给不同项目/团队分配独立 Key |
| 模型白名单 | 限制 Key 只能访问指定模型 |
| IP 白名单 | 只允许指定 IP 段调用 |
| 完整审计日志 | 每次请求的模型、Token、延迟均有记录 |

---

## 适用场景

| 场景 | 你能做什么 |
|------|-----------|
| **AI 应用开发** | 用同一套代码接入所有供应商，快速 A/B 测试不同模型 |
| **成本优化** | 日常任务走 DeepSeek（低成本），复杂任务走 GPT-4o（高质量） |
| **服务稳定性** | 多渠道冗余，单个供应商故障不影响你的服务 |
| **团队管理** | 分配 Key + 配额，统一查看全员 AI 用量和费用 |
| **AI 客户端** | 为 Cherry Studio、Lobe Chat、OpenCat 等工具提供统一后端 |

---

## 架构概览

```
你的应用 / AI 客户端
         │
         ▼
┌─────────────────────────────────────┐
│           Lurus API Gateway          │
│                                     │
│  认证 → 路由 → 限流 → 计费 → 日志   │
└─────────────────────────────────────┘
         │
   ┌─────┴──────┐──────────┬──────────┐
   ▼            ▼           ▼          ▼
 OpenAI      Claude      Gemini    DeepSeek …
```

请求进来后，网关按配置的渠道优先级路由，某个供应商返回错误时自动重试下一个，你的代码感知不到切换过程。

---

## 推荐学习路径

**第一次使用？按顺序走，20 分钟内跑通整个流程：**

1. [获取 API Key](/guide/get-api-key) — 注册并创建你的第一个 Key（3 分钟）
2. [快速开始](/guide/quickstart) — 发出第一个 API 请求（5 分钟）
3. [支持的模型](/guide/models) — 了解有哪些模型可用，怎么选
4. [Chat Completions API](/api/chat-completions) — 掌握最常用的接口

::: details 进阶用户直接跳到…
- [Function Calling](/api/chat-completions#function-calling) — 让 AI 调用你的函数
- [流式响应](/api/chat-completions#流式响应) — 逐字输出，提升体验
- [API 参考总览](/api/overview) — 完整端点列表
:::
