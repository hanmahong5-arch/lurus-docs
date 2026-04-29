---
title: 架构决策档案（ADR）
lastReviewed: 2026-04-28
owner: marvin
---

# 架构决策档案（ADR）

> 关键架构决策的"为什么"。代码会变、注释会过期，但决策的上下文如果不写下来就永远丢失。
> 当且仅当：（1）决策影响多个产品；（2）有真实的备选方案被拒绝；（3）后人可能问"为什么不用 X"——才写 ADR。
> 内部专属——可以承认失败、写出当时的私心、记录"我赌错了"的决定。

## 索引

| # | 决策 | 状态 | 写于 |
|---|---|---|---|
| [0001](./0001-three-tier-envs) | PROD/STAGE/DEV 三层环境划分 | ✅ 实施中 | 2026-04-24 |
| [0002](./0002-zitadel-as-oidc) | Zitadel 作为统一 OIDC Provider | ✅ live | 2025-09 |
| [0003](./0003-cnpg-postgres) | PG 用 CNPG operator 而非 RDS | ✅ live | 2025-08 |
| [0004](./0004-temporal-replaces-cron) | Temporal 替代 cron + outbox | ✅ live | 2026-02 |
| [0005](./0005-platform-as-billing-source) | 所有付费功能必须经 Platform 计费 | ✅ live | 2025-12 |
| [0006](./0006-newapi-replaces-lurus-hub) | 移除 lurus-hub，newapi 全量承担 LLM 网关 | ✅ live | 2026-04-23 |
| [0007](./0007-lutu-absorbs-lucrum-app) | lutu 吸收 lucrum-app（RN）| ✅ live | 2026-03 |
| [0008](./0008-phoenix-to-nextjs-www) | www 从 Phoenix 转 Next.js，原 Phoenix 转 webgame | ✅ live | 2026-04 |

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
