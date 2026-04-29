---
title: 开发工具行业方案
description: Kova + Switch + Lumen — 面向开发者工具公司和基础设施团队。
---

# 开发工具行业方案

## 适用对象

- AI 编程工具公司
- 企业内部 Platform / DevX 团队
- 独立开发者 / 小工作室
- 科研机构

## 核心组件

<div class="action-grid">
  <ActionCard product-id="kova"   :actions="[{label:'Kova',   href:'/kova/',   primary:true}]" />
  <ActionCard product-id="switch" :actions="[{label:'Switch', href:'/switch/', primary:true}]" />
  <ActionCard product-id="lumen"  :actions="[{label:'Lumen',  href:'/lumen/',  primary:true}]" />
</div>

## 典型组合

### 场景 A：构建自家 AI 编程工具

```
    Kova       ← 持久执行，崩溃恢复
    MemX       ← 记住用户偏好 / 项目规范
    Lurus API  ← 50+ 模型即插即用
    Lumen      ← 发布后观测 + Replay 调试
    Auth       ← 全员 SSO + Passkey
```

### 场景 B：优化内部开发者 ROI

```
    Switch     ← 统一管理团队 5 款 CLI
       ↓
    Lumen      ← 每人每天 Token 消费一图说清
       ↓
    ArgoCD     ← 配置 Git 同步
```

## 典型收益

| 指标 | Before | After |
|------|--------|-------|
| AI 工具配置分散 | 5 份 JSON | **1 份 yaml** |
| 每月 Token 成本 | 不可见 | **仪表盘 + 告警** |
| Agent 崩溃恢复 | 重启从头 | **3μs 断点续跑** |
| 上线周期 | 周级 | **天级** |

## 下一步

<NextSteps :steps="[
  { text: 'Kova 快速开始', link: '/kova/quickstart', primary: true },
  { text: 'Switch 配置', link: '/switch/configuration' },
  { text: 'Lumen 快速开始', link: '/lumen/quickstart' },
]" />
