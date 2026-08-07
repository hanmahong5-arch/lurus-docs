---
adr: 0009
title: newapi 退役 → 整合并入 newhub，hub.lurus.cn 成唯一 LLM 网关
status: accepted
date: 2026-05-27
---

# ADR-0009: newapi 退役 → 整合并入 newhub

> 这是 [ADR-0006](./0006-newapi-replaces-lurus-hub)（移除 lurus-hub，newapi 全量承担网关）的下一章。
> 2026 年 4 月我们刚把 hub 砍掉、让 newapi 当唯一网关；不到两个月，网关又要换主——因为多租户需求把 newapi 推到了天花板。

## 背景

ADR-0006 后，`newapi.lurus.cn`（QuantumNous/new-api fork）成为唯一 LLM 网关，6 个产品（switch / lucrum / lutu / forge / creator + 后来 kova/tally）经它路由。

但 newapi 是**单租户**架构。随着 Switch 演进出三模式（Personal / Reseller / EndUser）、Tally 等需要按租户隔离计费与治理，newapi 缺的能力越来越硬：

- 多租户认证（`tenant_slug` 维度的 Casdoor OIDC）
- Platform gRPC 计费集成（`ReportUsage` / `WalletDebit`）
- 日志全文检索（Meilisearch）、Prometheus-format `/metrics` + OTel 一等可观测性（平台侧监控见 [可观测性手册](/ops/observability)）
- `governance/` / `hub/` / `openrouter_pool/` / `nats/` 等护城河模块（newhub 独有 ~2,183 LOC）

`2b-svc-newhub` 在 newapi 之上叠了这些能力，已 stage on R6（`test-newhub.lurus.cn`），NATS publisher live。问题是：长期维护**两份**网关代码，违背 ADR-0006 当初"单一网关"的初衷。

## 备选方案

（沿用 `2026-05-05-newapi-newhub-fork-audit.md` 的 A/B/C 定义，2026-05-27 重审仍 hold）

### A. newapi 退役，整合并入 newhub
- 优势：newhub 整洁架构（`cmd/internal/{domain,app,adapter,pkg}`）是未来代码自然落点；12 月 Horizon Plan H1-H3 全围绕 newhub；整合后维护税减半
- 劣势：需把 newapi 近 90 天 Lurus 原创 commit 移植过来；切流有风险
- **接受**：风险用 DNS TTL 60s + 1 周流量镜像演练对冲，最坏 5 分钟回滚

### B. newhub 重写为 newapi 的 HTTP 客户端
- 拒绝：需删 ~85k LOC relay 代码重写；多 5-10ms p95 网络跳；双仓边界历史已证明会被新需求侵蚀

### C. 保持现状双仓
- 拒绝：维护税持续累加；违背 12 月战略（99.5% uptime / 5min TTFT / Insights 平台）

## 决定

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="git-merge" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">决定 · accepted 2026-05-27 · Option A</p>
    <div class="lurus-callout__body"><strong>newapi 退役，整合到 newhub</strong>。<code>hub.lurus.cn</code> 成为唯一 LLM gateway；<code>newapi.lurus.cn</code> 经 STAGE 演练后 DNS 切 newhub；原 newapi GitHub repo 归档 + 90 天只读。</div>
  </div>
</div>

**2026-05-27 正式接受 Option A**：newapi 退役，整合到 newhub。`hub.lurus.cn` 成为唯一 LLM gateway；`newapi.lurus.cn` 经 STAGE 演练后 DNS 切 newhub；原 newapi GitHub repo 归档 + 90 天只读。

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="history" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">历史修正</p>
    <div class="lurus-callout__body"><code>sprint-status.yaml</code> 曾把本决策误标为 "Option B"，并引用了一个不存在的占位 ADR 文件名。真实意图始终是 Option A，本 ADR 形式化已存在的实质决策。决策原文：<code>lurus/doc/decisions/2026-05-27-d1-newapi-retire.md</code>。</div>
  </div>
</div>

## 理由

1. **能力天花板** — 多租户 / gRPC 计费 / 治理是 newapi 无法低成本补齐的，newhub 已实现
2. **战略对齐** — 12 月 Horizon Plan 全押 newhub，继续投 newapi 是反向投入
3. **维护税** — 双网关 → 单网关，90 天 commit 维护量估算减半
4. **可逆** — 切流用镜像 + 灰度 + 短 TTL，回滚 SLA ≤ 15min

## 后果

正面：
- 单一多租户网关入口（`hub.lurus.cn`），Switch 三模式 + 按租户计费/治理原生支持
- newapi 维护负担归零（归档只读）

负面 / 代价：
- 过渡期 newapi 与 newhub 并存，计费口径必须对齐（以 Platform gRPC 为准），防双计
- 5 阶段 cutover（R-1~R-5）是跨多个 sprint 的工程，期间网关认知需双份
- 上游 `QuantumNous/new-api` 关系降级为"仅安全补丁"，不再 monthly cherry-pick

后续重评估触发：
- R-3 镜像演练响应 diff ≥ 0.1% → 暂停切流，回到 parity 审计
- PROD 切流（R-4）gated on SCIM / HA / Reliability hard floor 全 done

## 整合路线（R-1~R-5）

<ol class="lurus-steps">
<li>

**R-1 · 移植原创 commit** — 把 newapi 近 90 天 Lurus 原创 commit 移植到 newhub

</li>
<li>

**R-2 · Provider Parity 审计** — 比对两侧 provider 行为一致性

</li>
<li>

**R-3 · 切流方案设计** — 镜像 + 灰度 + DNS（短 TTL）

</li>
<li>

**R-4 · PROD 切流** — gated on SCIM / HA / Reliability hard floor 全 done

</li>
<li>

**R-5 · newapi 归档 + 文档修订**

</li>
</ol>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="timer" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">状态</p>
    <div class="lurus-callout__body">截至 <strong>2026-05-28</strong>，全部 R 阶段<strong>未开跑</strong>。完整"与 newapi 整合路线"表见 <a href="/products/newhub">newhub 内部手册</a>。</div>
  </div>
</div>

## 参考

- 决策原文：`lurus/doc/decisions/2026-05-27-d1-newapi-retire.md`（Option A accepted）
- 原始 A/B/C 审计：`lurus/doc/decisions/2026-05-05-newapi-newhub-fork-audit.md`
- 上游同步推迟：`lurus/doc/decisions/2026-05-18-newapi-upstream-sync-defer.md`
- 前一章：[ADR-0006](./0006-newapi-replaces-lurus-hub)
- [newhub 内部手册](../products/newhub) · [newapi 内部手册](../products/newapi)
