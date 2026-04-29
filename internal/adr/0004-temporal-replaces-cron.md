---
adr: 0004
title: Temporal 替代 cron + outbox 实现长流程
status: accepted
date: 2026-02
---

# ADR-0004: Temporal 替代 cron + outbox 实现长流程

## 背景

订阅续费 / 支付完成 / 订阅生命周期 / 过期扫描 — 这些"跨小时跨天的可恢复流程"原来用 cron + outbox 模式。

问题：
- cron 不重试 → 某次跑挂就丢
- outbox 表快速膨胀，需手工清理
- 跨服务编排（platform → notification → mail）状态散落
- 调试困难：哪一步挂的全靠日志拼

## 备选方案

| 方案 | 拒绝原因 |
|---|---|
| 改良 cron + outbox（重试 + 监控） | 工程量大 = 自造 workflow 引擎 |
| AWS Step Functions / Cadence | 锁定云厂商 / 已 EOL |
| **Temporal**（接受） | 自托管 / 开源 / 成熟 / Go SDK 一流 |
| Cadence-go / 自研 | 维护负担 |

## 决定

部署 Temporal 到 K3s `temporal-system` namespace。Platform 注册 4 个 workflow：
- SubscriptionRenewal
- PaymentCompletion  
- SubscriptionLifecycle
- ExpiryScanner

UI: `temporal.lurus.cn`

## 后果

正面：
- 失败自动重试 + 状态机持久化
- workflow history 永久保留 → 调试 / 审计有迹可循
- exactly-once 语义 → 资金安全
- Worker 弹性扩缩

负面：
- 新依赖（Temporal server + worker pod）
- workflow 版本兼容是新心智（旧 workflow 跑到一半，代码升级了怎么办）
- Platform 启动强依赖 Temporal — Temporal 挂 = Platform 启动失败（已识别为 platform 已知坑 #2）

## 参考

- `lurus.yaml` `infrastructure.temporal`
- [internal/products/platform.md](../products/platform) Temporal workflows 章节
