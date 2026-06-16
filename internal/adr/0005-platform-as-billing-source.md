---
adr: 0005
title: 所有付费功能必须经 Platform billing capability，禁止 shadow billing
status: accepted
date: 2025-12
---

# ADR-0005: 所有付费功能必须经 Platform billing capability，禁止 shadow billing

## 背景

2025 Q4，发现两个独立的"扣费"逻辑：
- platform-core 的钱包扣款（DECIMAL 4 位精度，幂等，事件发到 NATS）
- newapi 内置的 token 计费（自有数据库表，每请求 +1 计数，无幂等）

<div class="lurus-callout lurus-callout--danger">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">触发后果：双扣</p>
    <div class="lurus-callout__body">用户 $10 充值后，可能被<strong>双扣</strong>（newapi 扣一次 + platform 扣一次），账目对不上。两套独立扣费逻辑是本铁律的导火索。</div>
  </div>
</div>

## 备选方案

### A. newapi 自治计费，与 platform 钱包对账
- 拒绝：永远会有时间窗内的不一致；客服复盘成本高

### B. platform 是唯一资金源，所有计费走 capability API
- 接受

## 决定

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="wallet" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">铁律 · accepted 2025-12 · live</p>
    <div class="lurus-callout__body">Platform 是<strong>唯一资金源</strong>。所有"用户付费"走 <code>POST /internal/v1/wallet/debit</code>（HTTP）或 gRPC <code>Wallet.Debit</code>。<strong>禁止</strong> shadow billing。</div>
  </div>
</div>

**铁律**：

> 所有"用户付费"行为必须通过 Platform billing capability 完成。
> Platform billing capability = `POST /internal/v1/wallet/debit`（HTTP）或 gRPC `Wallet.Debit`。
> 各产品**禁止**自维护"用户余额"表。各产品可以维护"用量"表（统计/审计）但不是资金源。

## 理由

1. **金融级精度的单一实现** — DECIMAL(20,4) + SQL WHERE 原子扣款 + Redis dedup + Temporal workflow，集中实现胜过 N 份各自实现
2. **审计可追溯** — 所有扣款写 platform.billing schema，append-only 账本，7 年保留
3. **退款 / 退订 / 发票统一** — 任何资金动作都走同一套路径
4. **跨产品订阅可能** — 用户买"全家桶"订阅享多产品权益，必须统一权益体系（platform identity）

## 跨组规则

`lurus.yaml` `cross_group_policy.billing_integration`：

> All paid features MUST route through Platform billing capability. No shadow billing.

实施：
- newapi 内置计费下沉为"按 token 上报"（Platform debit by quantity），不再自扣余额
- lucrum 策略市场购买 → Platform debit
- creator 多平台发布配额 → Platform debit
- switch 用户管理私钥 → 当前免费，未来收费仍走 Platform

## 后果

正面：
- 单一资金真相源
- 审计 / 客服 / 合规一处管
- 测试聚焦在 platform billing 一份代码

负面 / 代价：
- 各产品要适应"先 reserve 再 commit"的两步扣款模式（避免 race）
- platform 成为所有产品的强依赖；platform 挂 = 所有付费功能挂
- 跨服务网络延迟（每次扣款多 ~10ms）

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">代价：全局付费强依赖</p>
    <div class="lurus-callout__body"><strong>Platform 挂 = 所有付费功能挂</strong>，每次扣款多 ~10ms 跨服务延迟。各产品必须改用"先 reserve 再 commit"两步扣款避免 race。金融精度章节见 <a href="/products/platform">platform 手册</a>。</div>
  </div>
</div>

后续重评估：
- platform billing QPS > 10K/s 持续 → 考虑读写分离 / 边缘节点
- 出现极端场景（高频小额，比如 1 token 每秒一扣）→ 考虑批量提交模式

## 参考

- `lurus.yaml` `capabilities.billing` + `cross_group_policy`
- `2l-svc-platform/api/openapi.yaml` 中 `/internal/v1/wallet/*`
- [internal/products/platform.md](../products/platform) 金融精度章节
