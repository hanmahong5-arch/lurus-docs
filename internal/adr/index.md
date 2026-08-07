---
title: 架构决策档案（ADR）
lastReviewed: 2026-04-28
owner: marvin
---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="history" :size="14" /> 治理</span>
  <h2 class="lurus-section-head__title">架构决策档案（ADR）</h2>
  <p class="lurus-section-head__lede">关键架构决策的"为什么"。代码会变、注释会过期，但决策的上下文如果不写下来就永远丢失。</p>
</div>

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="check-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">何时该写 ADR</p>
    <div class="lurus-callout__body">当且仅当三条<strong>同时</strong>满足：<strong>①</strong> 决策影响多个产品；<strong>②</strong> 有真实的备选方案被拒绝；<strong>③</strong> 后人可能问"为什么不用 X"。内部专属——可以承认失败、写出当时的私心、记录"我赌错了"的决定。</div>
  </div>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">10</span><span class="lurus-stat__label">已立档决策</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">8</span><span class="lurus-stat__label">live / 实施中</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">2</span><span class="lurus-stat__label">accepted</span></div>
</div>

## 索引

| # | 决策 | 状态 | 写于 |
|---|---|---|---|
| [0001](./0001-three-tier-envs) | PROD/STAGE/DEV 三层环境划分 | ✅ 实施中 | 2026-04-24 |
| [0002](./0002-zitadel-as-oidc) | Casdoor 作为统一 OIDC Provider（原 Zitadel，历史档案） | ✅ live | 2025-09 |
| [0003](./0003-cnpg-postgres) | PG 用 CNPG operator 而非 RDS | ✅ live | 2025-08 |
| [0004](./0004-temporal-replaces-cron) | Temporal 替代 cron + outbox | ✅ live | 2026-02 |
| [0005](./0005-platform-as-billing-source) | 所有付费功能必须经 Platform 计费 | ✅ live | 2025-12 |
| [0006](./0006-newapi-replaces-lurus-hub) | 移除 lurus-hub，newapi 全量承担 LLM 网关 | ✅ live | 2026-04-23 |
| [0007](./0007-lutu-absorbs-lucrum-app) | lutu 吸收 lucrum-app（RN）| ✅ live | 2026-03 |
| [0008](./0008-phoenix-to-nextjs-www) | www 从 Phoenix 转 Next.js，原 Phoenix 转 webgame | ✅ live | 2026-04 |
| [0009](./0009-newhub-replaces-newapi) | newapi 退役 → 整合并入 newhub，hub.lurus.cn 成唯一网关 | ✅ accepted | 2026-05-27 |
| [0010](./0010-product-retirements) | 产品退役汇总（admin / webgame / xianyu） | ✅ accepted | 2026-05-28 |

## 模板（写新 ADR 时复制）

```markdown
---
adr: NNNN
title: &lt;一句话决策&gt;
status: proposed | accepted | superseded by NNNN | deprecated
date: YYYY-MM-DD
---

# ADR-NNNN: &lt;一句话决策&gt;

## 背景
&lt;触发这次决策的真实事件 / 问题 / 限制&gt;

## 备选方案

### A. &lt;方案 A&gt;
- 优势：
- 劣势：
- 拒绝原因：

### B. &lt;方案 B&gt;
（同上）

## 决定
我们选 &lt;方案&gt;。

## 理由
1. &lt;为什么这个方案匹配当前限制&gt;
2. &lt;为什么不选其他方案的具体理由&gt;
3. &lt;我们承担了什么风险换来什么&gt;

## 后果
- 正面：
- 负面 / 我们要承担的代价：
- 后续会重新评估的触发条件：

## 参考
&lt;相关 issue / 复盘 / 邮件链 / 其他 ADR&gt;
```
