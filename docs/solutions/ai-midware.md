---
title: 企业 AI 中台方案
description: 五层闭环 — Auth · API · MemX · Kova · Lumen，给企业构建自己的 AI 中台。
---

# 企业 AI 中台方案

## 五层闭环

自顶向下（每层独立可用，组合闭环价值更高）：
- **业务应用层**：客服 · 知识库 · 报表 · 开发者工具
- **Lumen** — 可观测性：Trace / Replay / Cost
- **Kova** — Agent 执行引擎：WAL / Checkpoint
- **MemX** — 智能记忆：蒸馏 / 去重 / 衰退 / 检索
- **Lurus API** — LLM 统一网关：50+ 模型 / 计量 / 限流
- **Lurus Auth** — 统一身份：SSO · MFA · OIDC · 联邦

## 独立开箱 vs 五层协同

| 维度 | 独立使用 | 五层协同 |
|------|---------|---------|
| 身份 | 各自实现 | **SSO 一次** |
| 成本统计 | 自己扛 | **Lumen + API 自动关联** |
| 崩溃恢复 | 手动加 | **Kova WAL 兜底** |
| 知识沉淀 | 分散 | **MemX 统一蒸馏** |
| 合规 | 逐个评估 | **一套合规覆盖** |

## 典型交付

| 形态 | 说明 | 周期 |
|------|------|------|
| SaaS | 立即可用 | 0 |
| 私有化 | 镜像部署到企业 K8s | 2-4 周 |
| 托管运维 | Lurus 值班，企业内网 | 议定 |

## 参考落地路径

1. **W1-2**：接 [Lurus API](/guide/introduction) 替换现有 LLM 调用
2. **W3-4**：接 [Auth](/platform/auth/) 实现 SSO
3. **W5-6**：用 [MemX](/memx/) 沉淀业务知识
4. **W7-8**：把核心 Agent 迁到 [Kova](/kova/)
5. **W9-10**：全链路接入 [Lumen](/lumen/) 可观测

## 下一步

<NextSteps :steps="[
  { text: '为什么选择 Lurus', link: '/solutions/why-lurus', primary: true },
  { text: '企业部署形态', link: '/solutions/enterprise-deploy' },
  { text: '联系商务', link: 'mailto:business@lurus.cn', external: true },
]" />
