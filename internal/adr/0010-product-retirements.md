---
adr: 0010
title: 产品退役汇总（admin / webgame / xianyu）
status: accepted
date: 2026-05-28
---

# ADR-0010: 产品退役汇总（2026-05）

> 单条退役各有 decision doc；本 ADR 把 2026-05 的三起下线**汇总成一页**，方便后人一眼看"哪些产品已经死了、为什么、替代是什么"。
> 内部专属——可以直白写"auth 死了一个月没人发现"这种话。

## 背景

2026-05 季度复盘 + 多源诚实化审计中，发现三个产品的真实状态与 `lurus.yaml` / `_BOARD.md` 标注漂移（标着 prod/planning，实际已死或从未交付）。三方同步规则要求 lifecycle 改动 atomic 落到 yaml + _BOARD + service-status，本 ADR 是文档站这一侧的同步记录。

## 退役清单

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">3</span><span class="lurus-stat__label">本季下线</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">2</span><span class="lurus-stat__label">sunset</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">1</span><span class="lurus-stat__label">archived</span></div>
</div>

| 产品 | 下线日期 | 状态 | 真实状态 | 决策 doc |
|---|---|---|---|---|
| **admin**（运营后台，`2l-bs-admin`）| 2026-05-10 | <span class="lurus-tag lurus-tag--muted">sunset</span> | SPA 从未交付（9 commits，0 production deploy）；`admin.lurus.cn` 实测 404 | `2026-05-10-sunset-bs-admin.md`（+ 2026-05-19 Correction）|
| **webgame**（`2c-bs-www-phoenix`）| 2026-05-28 | <span class="lurus-tag lurus-tag--muted">sunset</span> | pod 活但 auth 死约 1 个月 + 0 `/play` 流量 + 0 营收 | `2026-05-28-sunset-webgame.md` |
| **xianyu**（`2b-svc-xianyu`）| 2026-05-14 | <span class="lurus-tag lurus-tag--muted">archived</span> | 与主业脱节 + R5 NotReady，已 archived | `lurus.yaml` lifecycle_index（backup 待 R5 复活后 tar）|

## 各自的决定与替代

### admin — sunset 2026-05-10
独立运营后台 SPA 两条路线（platform-core 内嵌 `web/` React + 独立 `apps/admin/` Next.js）2026-05-19 实测均未交付。**替代**：platform-core `/admin/v1` REST API + `zita` CLI（`cmd/zita`）+ `zita-mcp` + [MCP 工具链](../products/mcp)。客户侧账号自助走 `identity.lurus.cn`，与运营后台无关。详见 [admin 手册（sunset stub）](../products/admin)。后续 2026-06-02 有"wire `web/` 或 apply `apps/admin/`"二选一决断。

### webgame — sunset 2026-05-28
根因是 ops（Zitadel OIDC app `unused-placeholder` 未注册 → `Errors.App.NotFound`），**非代码**。`q3-survival-goal.md §2` 把 webgame 列入 90 天 0 投入。**选 sunset 而非 archive 的边界**：archive 含下架 pod / 删 DNS / repo archive / 备份等不可逆 R1 写操作，owner-gated；sunset 是诚实中间态——停止假装 prod，保留 pod（已跑 27d，0 资源压力）+ DNS，留 archive 决策窗口。

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="eye" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">sunset vs archive</p>
    <div class="lurus-callout__body"><strong>sunset</strong> = 诚实中间态，停止假装 prod，保留 pod + DNS（可逆，留决策窗口）。<strong>archive</strong> = 下架 pod / 删 DNS / repo archive / 备份等<strong>不可逆 R1 写操作</strong>，owner-gated。</div>
  </div>
</div>

<div class="lurus-callout lurus-callout--danger">
  <span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">archive 时的坑</p>
    <div class="lurus-callout__body">webgame repo 名历史沿用 <code>lurus-www</code>，与 www-next <strong>同名</strong>——执行 <code>gh repo archive</code> 前必须确认不误伤 www（见 webgame decision doc"不碰清单"）。</div>
  </div>
</div>

### xianyu — archived 2026-05-14
闲鱼扩展与主业脱节，叠加 R5 NotReady（宿主机离线）。已从 services 段移除，backup 待 R5 复活后 tar 到 `D:/_backup/`。

## 后果

- `_BOARD.md` prod 计数：webgame -1（admin/xianyu 此前已分别 sunset/archived）
- 文档站：products.ts 中 admin / webgame 标 `sunset`（灰点）；新增 admin sunset stub 修复 `config.ts` 的 `/products/admin` 断链
- 诚实化记录：admin "SPA 从未交付却标 live 30+ 天"、webgame "auth 死 1 月无人察觉" —— 暴露的是**缺少对外可用性探活**这一系统性盲区

后续重评估触发：
- 2026-06-02 admin SPA 决断（wire / apply 二选一）落地后，admin 可能复活为 live
- webgame：owner 决定复活 auth（注册 Zitadel OIDC app）或推进 archive（q3-goal 倾向后者）

## 参考

- `lurus/doc/decisions/2026-05-10-sunset-bs-admin.md`
- `lurus/doc/decisions/2026-05-28-sunset-webgame.md`
- `lurus.yaml` `governance.lifecycle_index`
- [admin 手册](../products/admin) · [web 手册](../products/web)
