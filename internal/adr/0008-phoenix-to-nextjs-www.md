---
adr: 0008
title: www 从 Phoenix 转 Next.js，原 Phoenix 代码转型为 webgame
status: accepted
date: 2026-04
---

# ADR-0008: www 从 Phoenix 转 Next.js，原 Phoenix 代码转型为 webgame

## 背景

`2c-bs-www` 仓库最初是 Phoenix（Elixir）实现的公司主页。2026 年初情况：

- Phoenix 实时能力（LiveView + PubSub）我们用得很少 — 主页是营销静态内容
- Next.js 16 已稳定，App Router + RSC 提供更好的 SEO / 加载性能 / 营销页迭代速度
- Phoenix 编译 + 部署时间长，每次小改动 build 1-2 分钟
- 但 Phoenix 的 LiveView 实时多人能力很适合做"slither.io 风格小游戏"作为产品 hook
- 两份业务在同一仓库（marketing + game candidate）耦合度高，难拆

## 备选方案

### A. 保留 Phoenix 不动
- 优势：现有代码可继续用
- 劣势：无法兼顾"营销页快速迭代" + "游戏实时性"两个不同诉求
- 拒绝

### B. 全部迁 Next.js，弃 Phoenix
- 优势：技术栈单一
- 劣势：失去 LiveView 这个差异化能力（实时多人极难用 Next.js 复刻）
- 拒绝

### C. 拆成两个域名 + 两个仓库
- 优势：彻底解耦
- 劣势：仓库分裂成本高，CI/CD 重新搭
- 拒绝

### D. 同仓库分两个 dir，一个 Next.js（www），一个 Phoenix（webgame）
- 优势：复用 CI/CD pipeline，独立 image
- 劣势：仓库结构略复杂
- 接受

## 决定

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="git-branch" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">决定 · accepted 2026-04 · live</p>
    <div class="lurus-callout__body">采用方案 D——同 GitHub 仓库 <code>lurus-www</code> 分两个目录：<code>www-next/</code>（Next.js 营销页）+ <code>www-phoenix/</code>（Phoenix 游戏），CI 按 path filter 触发，独立 image。</div>
  </div>
</div>

**2026-04 起**：

| 目录 | 栈 | 域名 |
|---|---|---|
| `2c-bs-www-next/` | Next.js 16 + Bun + Tailwind 4 | `www.lurus.cn`（阿里云 ICP 入口）|
| `2c-bs-www-phoenix/` | 现有 Phoenix 代码 | `webgame.lurus.cn`（slither.io 风格 + RPG 进化）|

同 GitHub 仓库 `lurus-www`，目录区分；CI 按 path filter 触发。

## 理由

1. **正确工具做正确事** — 静态营销页用 SSG/SSR；实时多人游戏用 BEAM
2. **复用代码不浪费** — Phoenix 代码不丢，转型成产品差异化能力
3. **ICP 备案延续性** — `lurus.cn` / `www.lurus.cn` 主域名 ICP 在阿里云，不动
4. **shared/lurus_phoenix 复用** — admin + webgame 都用 Phoenix，共享模块（OIDC、ApiProxy、HealthPlug）

## 后果

正面：
- 营销页改一行 5 秒部署
- 游戏作为差异化产品 hook（"用 Lurus 注册就能玩"）
- Phoenix 代码不浪费

负面 / 代价：
- 同仓库混栈，新人 onboarding 第一天会迷惑
- 镜像 tag 冲突：webgame 用 `:latest`（自动滚动），www 用 `main-<sha7>`（GitOps）— 要写明
- LiveView 重连风暴问题转移到 webgame，要单独应对

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">镜像 tag 冲突陷阱</p>
    <div class="lurus-callout__body">同仓两套发布约定必须写明：webgame 用 <code>:latest</code>（自动滚动），www 用 <code>main-&lt;sha7&gt;</code>（GitOps）。混淆会发错镜像。注：webgame 已于 <a href="./0010-product-retirements">ADR-0010</a> sunset。</div>
  </div>
</div>

后续重评估触发：
- Webgame 用户 < 10 持续 3 个月 → 关掉 webgame，把代码归档
- www 流量爆涨需 SSR / 边缘缓存 → 引入 Cloudflare Workers 或 Vercel

## 参考

- `lurus.yaml` line 577-597
- [internal/products/web.md](../products/web)
- [ops/dns.md](../ops/dns) 中 ICP 入口说明
