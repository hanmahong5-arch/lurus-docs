---
title: 组织 / Bus Factor
lastReviewed: 2026-04-28
owner: marvin
---

# 组织 / Bus Factor

<div class="lurus-section-head"><span class="lurus-section-head__eyebrow"><Icon name="users" :size="14"/> 组织</span><h2 class="lurus-section-head__title">当前实情</h2><p class="lurus-section-head__lede">1 个全栈工程师 + AI 协作；全产品 bus factor = 1，既合理又是最大风险。</p></div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">1</span><span class="lurus-stat__label">全栈工程师</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">1</span><span class="lurus-stat__label">全产品 bus factor</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">100%+</span><span class="lurus-stat__label">精力占用（常态）</span></div>
</div>

公司规模：1 个全栈工程师（marvin） + AI 协作。

<div class="lurus-callout lurus-callout--danger"><span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18"/></span><div><p class="lurus-callout__title">最大风险</p><div class="lurus-callout__body">bus factor 全产品 = <strong>1</strong>。这是<strong>当前规模合理</strong>的状态，但同时是<strong>最大风险</strong>。</div></div></div>

## <Icon name="layers" :size="20" /> 责任矩阵（Ownership Matrix）

<OwnershipMatrix />

## <Icon name="trending-up" :size="20" /> bus factor 提升路线图

不是"招人就解决"。即使没人，也可以提升 bus factor 到 1.5 或 2：

| 措施 | 提升幅度 | 难度 |
|---|---|---|
| 完整内部文档（本站） | 0 → 1 → 1.5 | 中 |
| 所有 SOP 都演练过 | 1.5 → 2 | 中 |
| 关键凭证写入密码管理器 + 配偶/合伙人掌握主密码 | 2 → 2.5 | 低 |
| 部署 / 回滚 / 备份完全自动化 | 2.5 → 3 | 高 |
| 第二名工程师 | 3 → 4 | 取决于招聘 |

## <Icon name="shield-check" :size="20" /> "marvin 失联"应急流程

<div class="lurus-callout lurus-callout--key"><span class="lurus-callout__icon"><Icon name="alert-circle" :size="18"/></span><div><p class="lurus-callout__title">触发条件</p><div class="lurus-callout__body">防 marvin 因病 / 长假 / 意外无法响应（<strong>≥ 24 小时</strong>）的兜底。核心原则：<strong>能不动就不动，必须动则优先回滚。</strong></div></div></div>

<ol class="lurus-steps">
<li>

**能不能不动手就活着？** 读"我们当前在跑什么":

```bash
# 系统总状态（Tailscale 必备）
ssh root@100.98.57.55 "kubectl get pods -A | grep -v Running | grep -v Completed"
```

如果一切正常 → 啥也别动，等 marvin 回来。如果在烧 → 继续下一步。

</li>
<li>

**找凭证。** 1 Password / Bitwarden 共享 vault：marvin 配偶 / 合伙人持有主密码。vault 里包含：Tailscale auth key / Casdoor admin / GHCR PAT / 三丰云 console / 阿里云 / Cloudflare API token。

</li>
<li>

**read-only 操作可信。** 读取数据 / 状态 / 日志 → 没风险，敢做。

</li>
<li>

**写操作要慎。** 任何写操作（部署、改配置、删数据）→ 优先回滚而不是修复。回滚 = 恢复到已知状态 = 风险低。

</li>
<li>

**客户沟通。** 如果客户在追：发模板邮件，承认事故，承诺时间表。**不要承诺技术修复时间** — 你不知道根因，乱承诺会反复打脸。

```
Subject: <服务名> 当前状态

您好，

我们检测到 <具体功能> 在 <时间> 起出现异常。当前正在排查。
预计 <较长但保守的时间> 后给出更新。

抱歉造成不便。

— Lurus Team
```

</li>
</ol>

## <Icon name="users" :size="20" /> 招人优先级（当人力允许时）

按优先级倒序（先招最缺的）：

1. **运维 / SRE** — 单点故障最高的领域；30+ SOP 没人演练
2. **后端工程师** — Platform / newapi / memx 三个 P0 都靠 marvin
3. **前端工程师** — Forge / Tally / Web 都需要前端深度
4. **产品 / 客户支持** — 当客户超过 5 家后

## <Icon name="gauge" :size="20" /> 当前所有人精力分配（marvin）

| 类别 | 占比 | 备注 |
|---|---|---|
| Platform / Newapi / MemX 维护 | 30% | P0 |
| Tally 开发 | 25% | 当前主推 |
| Lutu / Lucrum / Forge 迭代 | 15% | P1 |
| 客户支持（中铁/秒搭等） | 10% | 现金流来源 |
| 运维 / 部署 / 安全 | 10% | 必要 |
| 文档 / ADR / 内部建设 | 5% | 长期 |
| 招人 / 商务 / 战略 | 5% | 季度 |

<div class="lurus-callout lurus-callout--warn"><span class="lurus-callout__icon"><Icon name="timer" :size="18"/></span><div><p class="lurus-callout__title">超载是常态</p><div class="lurus-callout__body">精力 <strong>100%+</strong> 是常态。Tally 上线后会重平衡。</div></div></div>

## <Icon name="mail" :size="20" /> 联系方式

- marvin: marvin.uu@gmail.com
- 应急 / 事故：直接邮件 + 微信 / Telegram
- 客户咨询：support@lurus.cn（自动转 marvin）
