---
title: 路线图（with confidence）
lastReviewed: 2026-04-28
owner: marvin
---

# 路线图（with confidence）

<div class="lurus-callout lurus-callout--key"><span class="lurus-callout__icon"><Icon name="radar" :size="18"/></span><div><p class="lurus-callout__title">每条都带信心等级</p><div class="lurus-callout__body">每条路线图条目带<strong>信心等级</strong>：是承诺、是计划、还是想法。不分青红皂白把愿景包装成承诺是欺骗未来的自己。</div></div></div>

## <Icon name="gauge" :size="20" /> 信心等级

| 等级 | 含义 | 适合场景 |
|---|---|---|
| 🔒 **承诺** | 已对客户 / 内部承诺，不能动 | 已签约客户的交付项；监管要求 |
| 📌 **计划** | 已规划，资源已分配，按计划执行 | 当前 sprint 的工作 |
| 🌱 **意向** | 想做，未排期，不保证今年 | 调研中、可能 pivot |
| ☁ **远景** | 长期方向，不构成行动 | 5 年愿景 |

<p>
<span class="lurus-tag">🔒 承诺</span>
<span class="lurus-tag">📌 计划</span>
<span class="lurus-tag lurus-tag--muted">🌱 意向</span>
<span class="lurus-tag lurus-tag--muted">☁ 远景</span>
</p>

## <Icon name="timer" :size="20" /> 2026 Q2（4-6 月）

### 🔒 承诺

<div class="lurus-callout lurus-callout--danger"><span class="lurus-callout__icon"><Icon name="lock" :size="18"/></span><div><p class="lurus-callout__title">Tally MVP 上线 — 2026-06-30 前</p><div class="lurus-callout__body">PRD / Architecture 编写中。路径：<strong>R6 stage 跑 30 天 + 5 客户验证 → R1 prod</strong>。不达标推后，但 PRD 不缩水。客户来自中铁/秒搭路径中获得的进销存潜在客户。</div></div></div>

### 📌 计划

- **internal.lurus.cn 上线**（本站）
  - 14 产品手册 ✅
  - 12 SOP ✅
  - ADR / Postmortem 框架 ✅
  - oauth2-proxy + Zitadel 边缘鉴权 — 5 月初
  - 部署到 R6 → 6 周打磨 → R1
- **Lutu enterprise demo phase**
  - 当前 internal-tool（dogfood）→ 可向潜在企业客户演示的状态
  - 主要是 polish + 演示数据集
- **Newapi 上游 sync**（每月）
  - 5 月 sync 一次（QuantumNous 月度 release）
  - rebase 我们的定制点
- **Memorus 提升 ACE 引擎成熟度**
  - 4 个引擎（Reflector/Curator/Decay/Generator）当前默认关闭
  - 选 1-2 个开启生产，对接 lucrum

### 🌱 意向

- **Switch 自动更新机制完整**（当前只 Windows x64，缺 macOS / Linux）
- **Forge 准入流程文档化** + 用户管理 UI
- **Lumen v0.2** — Agent.run() 完整实现 + Replay 重执行

## <Icon name="timer" :size="20" /> 2026 Q3（7-9 月）

### 🔒 承诺

<div class="lurus-callout lurus-callout--danger"><span class="lurus-callout__icon"><Icon name="lock" :size="18"/></span><div><p class="lurus-callout__title">Tally Prod 稳定运行</p><div class="lurus-callout__body">目标 <strong>SLA 99.9%</strong>、<strong>5+ 客户付费</strong>。</div></div></div>

### 📌 计划

- **Bus factor 提升到 2**（结构性，不靠招人）
  - 所有 SOP 至少演练 1 次
  - 完整 vault + 应急流程文档
  - DR 演练（R1 → R6 切流量）
- **第一次正式事故复盘**（如果发生 S0/S1）
- **Zitadel 升级到最新 LTS**
- **MinIO 加 R6 二次备份**（解决 office-win-1 单点）

### 🌱 意向

- **Tally v2**：金税四期 ISV 对接 / 多渠道库存分配
- **Webgame 公开测试**（如果 LiveView 重连风暴解决）
- **Lucrum 策略市场上线**

### ☁ 远景

- 第二名工程师入职 — 不依赖时间表

## <Icon name="timer" :size="20" /> 2026 Q4（10-12 月）

### 📌 计划

- **Tally 客户 ≥ 20**
- **跨产品订阅"全家桶"** — Platform 实现多产品权益打包
- **公司收入 → 月 20 万**（粗略）

### 🌱 意向

- **API marketplace** — 把 newapi / memx / kova 作为对外 API 产品销售
- **Lurus Cloud** — 私有化部署套件（packaging）

## <Icon name="cloud" :size="20" /> 2027+

### ☁ 远景

- 团队 5-10 人
- 客户 100+
- AI midware 成为细分龙头

---

## <Icon name="history" :size="20" /> 取消的路线图（学习存档）

| 时间 | 项目 | 原因 |
|---|---|---|
| 2026-04 | lurus-hub（2b-svc-api）| 移除，被 newapi 取代（[ADR-0006](../adr/0006-newapi-replaces-lurus-hub)）|
| 2026-03 | lucrum-app（RN Expo）| 合并进 lutu（[ADR-0007](../adr/0007-lutu-absorbs-lucrum-app)）|
| 2026-04 | www（Phoenix）| 转型为 webgame（[ADR-0008](../adr/0008-phoenix-to-nextjs-www)）|

## <Icon name="repeat" :size="20" /> 决策反思

每季度回看：
- 承诺都达成了吗？没达成 → 是定得太满还是执行不到位？
- 计划被 pivot 多少次？率高 → 计划过早，应该停在意向阶段
- 意向有多少落地？率低 → 意向太多，要更克制
