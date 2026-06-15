---
title: Admin (运营后台) — 已下线
id: admin
group: platform
priority: P1
status: sunset
owner: marvin (+ AI assist)
lastReviewed: 2026-05-28
sourcePath: 2l-bs-admin (archived)
---

# Admin (运营后台) 内部手册

<div class="lurus-callout lurus-callout--danger"><span class="lurus-callout__icon"><Icon name="history" :size="18"/></span><div><p class="lurus-callout__title">本产品已 SUNSET（2026-05-10）</p><div class="lurus-callout__body"><code>admin.lurus.cn</code> 实测 <strong>404</strong>，独立运营后台 SPA <strong>从未交付</strong>。本页作为历史归档 + 替代入口指引保留。需要运营能力请直接看下方<a href="#真实替代入口-现在用这些">真实替代入口</a>。</div></div></div>

<div class="lurus-callout lurus-callout--info"><span class="lurus-callout__icon"><Icon name="lock" :size="18"/></span><div><p class="lurus-callout__title">仅限内部</p><div class="lurus-callout__body">仅限内部员工查阅。</div></div></div>

<p><span class="lurus-tag lurus-tag--muted">P1 · SUNSET</span> <span class="lurus-tag lurus-tag--muted">0 production deploy</span></p>

## 一句话定位（历史）

`2l-bs-admin` 曾计划做成独立的运营后台（Phoenix LiveView 形态，9 commits，**0 production deploy**），供运营查账户 / 渠道 / 用量。**2026-05-10 决策下线**——决策档案：`lurus/doc/decisions/2026-05-10-sunset-bs-admin.md`（含 2026-05-19 Correction）。

## 为什么下线

- 两条 SPA 替代路线（platform-core 内嵌 `web/` React SPA + 独立 `apps/admin/` Next.js）**2026-05-19 实测均未交付 / 未部署**：`identity.lurus.cn/admin/` 返 404，`admin.lurus.cn` DNS 虽配但 `lurus-admin` namespace 为空。
- 运营所需能力已被更轻的入口覆盖（见下），独立后台 ROI 低。

## 真实替代入口（现在用这些）

| 能力 | 替代入口 |
|---|---|
| 账户 / 渠道 / 用量 / 计费查询与管理 | platform-core **`/admin/v1/*` REST API**（`identity.lurus.cn`，bearer `INTERNAL_API_KEY`）|
| 命令行运维 | **`zita` CLI**（`cmd/zita`，6 命令组：account / app / audit / dlq / health / tenant）|
| AI agent 运维 | **`zita-mcp`**（`cmd/zita-mcp`）+ 工具链 [MCP Servers](/products/mcp)（zitadel-mcp / platform-mcp / k8s-mcp）|
| LLM 渠道 / Token / 日志后台 | newapi 自带 Web Admin（`newapi.lurus.cn`）→ 整合后并入 [newhub](/products/newhub)（`hub.lurus.cn`）|

> **客户侧账号自助**（个人信息 / 钱包 / 订阅）走 `identity.lurus.cn` 控制台，与本运营后台无关——客户**无权**进 `/admin`。

## 后续

`lurus.yaml` `future_reviews` 登记了 **2026-06-02 的 admin SPA 决断**（选 A：wire `web/` embedded `r.StaticFS /admin`；或 B：`kubectl apply apps/admin/`，二选一不二选删另一份避免代码漂移）。在该决断落地并实测可访问之前，本产品保持 sunset，**不要**把 `admin.lurus.cn` 当作可用入口写进任何对内 / 对外文档。

<div class="lurus-callout lurus-callout--warn"><span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18"/></span><div><p class="lurus-callout__title">勿当可用入口</p><div class="lurus-callout__body">在 2026-06-02 决断落地并实测可访问前，<strong>不要</strong>把 <code>admin.lurus.cn</code> 写进任何对内 / 对外文档作为可用入口。</div></div></div>

## 历史归档

- 决策：`lurus/doc/decisions/2026-05-10-sunset-bs-admin.md`
- 原 repo：`github.com/hanmahong5-arch/lurus-admin`（待 `gh repo archive` + `D:/_backup/` tar）
- 相关 ADR：[ADR-0010 产品退役汇总](/adr/0010-product-retirements)
