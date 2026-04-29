---
title: 组织 / Bus Factor
lastReviewed: 2026-04-28
owner: marvin
---

# 组织 / Bus Factor

## 当前实情

公司规模：1 个全栈工程师（marvin） + AI 协作（Claude）。

bus factor 全产品 = 1。这是**当前规模合理**的状态，但同时是**最大风险**。

## 责任矩阵（Ownership Matrix）

<OwnershipMatrix />

## bus factor 提升路线图

不是"招人就解决"。即使没人，也可以提升 bus factor 到 1.5 或 2：

| 措施 | 提升幅度 | 难度 |
|---|---|---|
| 完整内部文档（本站） | 0 → 1 → 1.5 | 中 |
| 所有 SOP 都演练过 | 1.5 → 2 | 中 |
| 关键凭证写入密码管理器 + 配偶/合伙人掌握主密码 | 2 → 2.5 | 低 |
| 部署 / 回滚 / 备份完全自动化 | 2.5 → 3 | 高 |
| 第二名工程师 | 3 → 4 | 取决于招聘 |

## "marvin 失联"应急流程

> 防 marvin 因病 / 长假 / 意外无法响应（≥ 24 小时）的兜底。

### 第一步：能不能不动手就活着？

读"我们当前在跑什么":

```bash
# 系统总状态（Tailscale 必备）
ssh root@100.98.57.55 "kubectl get pods -A | grep -v Running | grep -v Completed"
```

如果一切正常 → 啥也别动，等 marvin 回来。

如果在烧：

### 第二步：找凭证

- 1 Password / Bitwarden 共享 vault：marvin 配偶 / 合伙人持有主密码
- vault 里包含：Tailscale auth key / Zitadel admin / GHCR PAT / 三丰云 console / 阿里云 / Cloudflare API token

### 第三步：read-only 操作可信

读取数据 / 状态 / 日志 → 没风险，敢做。

### 第四步：写操作要慎

任何写操作（部署、改配置、删数据）→ 优先回滚而不是修复。回滚 = 恢复到已知状态 = 风险低。

### 第五步：客户沟通

如果客户在追：发模板邮件，承认事故，承诺时间表。  
**不要承诺技术修复时间** — 你不知道根因，乱承诺会反复打脸。

```
Subject: &lt;服务名&gt; 当前状态

您好，

我们检测到 &lt;具体功能&gt; 在 &lt;时间&gt; 起出现异常。当前正在排查。
预计 &lt;较长但保守的时间&gt; 后给出更新。

抱歉造成不便。

— Lurus Team
```

## 招人优先级（当人力允许时）

按优先级倒序（先招最缺的）：

1. **运维 / SRE** — 单点故障最高的领域；30+ SOP 没人演练
2. **后端工程师** — Platform / newapi / memx 三个 P0 都靠 marvin
3. **前端工程师** — Forge / Tally / Web 都需要前端深度
4. **产品 / 客户支持** — 当客户超过 5 家后

## 当前所有人精力分配（marvin）

| 类别 | 占比 | 备注 |
|---|---|---|
| Platform / Newapi / MemX 维护 | 30% | P0 |
| Tally 开发 | 25% | 当前主推 |
| Lutu / Lucrum / Forge 迭代 | 15% | P1 |
| 客户支持（中铁/秒搭等） | 10% | 现金流来源 |
| 运维 / 部署 / 安全 | 10% | 必要 |
| 文档 / ADR / 内部建设 | 5% | 长期 |
| 招人 / 商务 / 战略 | 5% | 季度 |

精力 100%+ 是常态。Tally 上线后会重平衡。

## 联系方式

- marvin: marvin.uu@gmail.com
- 应急 / 事故：直接邮件 + 微信 / Telegram
- 客户咨询：support@lurus.cn（自动转 marvin）
