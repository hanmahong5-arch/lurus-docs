---
adr: 0006
title: 移除 lurus-hub（2b-svc-api），newapi 全量承担 LLM 网关
status: accepted
date: 2026-04-23
---

# ADR-0006: 移除 lurus-hub，newapi 全量承担 LLM 网关

## 背景

2025 年我们 fork 了 [QuantumNous/new-api](https://github.com/QuantumNous/new-api) 一份做内部使用，命名为 `lurus-newapi`（2b-svc-newapi）。  
同时还有自研的 `lurus-hub`（2b-svc-api），是更早的产物，承担同一类 LLM 路由职责。

2026 Q1 终于面对：维护两份 LLM 网关代码相互重复，所有产品（switch / lucrum / lutu / forge / creator）连接配置混乱，新模型要在两边都加。

## 备选方案

### A. 留 hub，把 newapi 视为"上游同步用临时容器"
- 优势：保留我们自研代码与定制能力
- 劣势：QuantumNous 上游迭代极快，我们的 hub 已经落后社区主流（缺 Anthropic Tool Use streaming、新模型适配、用户管理 UI）
- 拒绝：维护成本高，价值低

### B. 留 newapi，弃 hub
- 优势：与活跃的 OSS 上游绑定，每月 sync 即可获得新模型 / 新功能
- 劣势：失去自研控制；上游若做出我们不喜欢的决策，rebase 成本高
- 接受：当前阶段重要的是速度

### C. 重写第三套
- 拒绝：完全无理由

## 决定

**2026-04-23 移除 lurus-hub（2b-svc-api）**：
- 备份到 `D:/_backup/2b-svc-api-2026-04-23.tar.gz`
- 从 `lurus.yaml` 删除条目
- 调整 capabilities：`llm-inference.provider` 改 `lurus-newapi`
- 调整 product_groups：platform 组成员表去掉 hub
- 各消费者（switch/lucrum/lutu/forge/creator）切到 newapi.lurus.cn

## 理由

1. **上游活跃** — QuantumNous 月度发布，新模型当周就有 adapter
2. **管理后台成熟** — newapi 自带渠道管理 / 密钥池 / 用量统计 UI，不用我们造
3. **Lurus 定制点小** — 我们的定制主要是计费 hook 接 platform，月度 rebase 可控
4. **成本** — 砍掉 hub 服务直接省一份 Pod 资源 + 一份 CI

## 后果

正面：
- 单一 LLM 网关入口（`newapi.lurus.cn/v1`）
- 所有产品配置统一
- 新模型接入成本下降到"等上游 sync"

负面 / 代价：
- 受制于 QuantumNous 决策。如果上游有破坏性改动，我们要紧急 fork 或 hold sync
- 我们的定制点（BillingSession 双资金来源、session cookie 名、pprof 守护）每次 sync 要重新 rebase
- newapi 上游用 Go 1.21，我们用 1.25 — 偶尔有依赖兼容问题

后续重评估触发：
- 上游做出与我们计费集成不兼容的破坏性改动 → 考虑分叉
- 我们的定制点 > 5 个文件 / 频繁冲突 → 考虑分叉

## 参考

- `lurus.yaml` line 367-368, 386-404
- [internal/products/newapi.md](../products/newapi)
- 上游 repo: https://github.com/QuantumNous/new-api
