---
layout: page
title: LurusTech Docs — AI 基础设施与产品平台
description: LurusTech 平台文档 — API Reference · Quickstart · Integration Guide
---

<div class="vp-doc lurus-home">

<Hero />

<nav class="persona-jump" aria-label="按角色快速跳转">
  <a href="#newbie" class="persona-jump__chip">
    <span class="persona-jump__icon"><Icon name="rocket" :size="14" /></span>
    <span class="persona-jump__label">新手</span>
    <span class="persona-jump__hint">3 分钟上手</span>
  </a>
  <a href="#player" class="persona-jump__chip">
    <span class="persona-jump__icon"><Icon name="gamepad-2" :size="14" /></span>
    <span class="persona-jump__label">玩家</span>
    <span class="persona-jump__hint">现成工具</span>
  </a>
  <a href="#decider" class="persona-jump__chip">
    <span class="persona-jump__icon"><Icon name="briefcase" :size="14" /></span>
    <span class="persona-jump__label">决策者</span>
    <span class="persona-jump__hint">企业评估</span>
  </a>
  <a href="#dev" class="persona-jump__chip">
    <span class="persona-jump__icon"><Icon name="code" :size="14" /></span>
    <span class="persona-jump__label">开发者</span>
    <span class="persona-jump__hint">构建系统</span>
  </a>
</nav>

## <Icon name="rocket" :size="22" /> 我是新手 — 3 分钟跑通第一次调用 {#newbie}

选错模型，比写错代码贵 10 倍。先用我们的网关跑一次，再决定迁不迁。

<div class="action-grid">
  <ActionCard
    product-id="lurus-api"
    :actions="[
      { label: '快速开始', href: '/guide/quickstart', primary: true },
      { label: '获取 API Key', href: '/guide/get-api-key' },
      { label: '支持的模型', href: '/guide/models' },
      { label: '控制台', href: 'https://api.lurus.cn', external: true },
    ]"
  />
  <ActionCard
    product-id="platform"
    :actions="[
      { label: '平台概述', href: '/platform/', primary: true },
      { label: '计费详解', href: '/platform/billing' },
      { label: '常见问题', href: '/platform/faq' },
    ]"
  />
</div>

---

## <Icon name="gamepad-2" :size="22" /> 我是玩家 — 想要现成的 AI 工具 {#player}

代码已经替你写好了。下载就跑，不写一行配置。

<div class="action-grid">
  <ActionCard
    product-id="lucrum"
    :actions="[
      { label: '快速开始', href: '/lucrum/quickstart', primary: true },
      { label: '策略市场', href: '/lucrum/strategies' },
      { label: '交易平台', href: 'https://lucrum.lurus.cn', external: true },
    ]"
  />
  <ActionCard
    product-id="switch"
    :actions="[
      { label: '安装指南', href: '/switch/install', primary: true },
      { label: '配置说明', href: '/switch/configuration' },
    ]"
  />
  <ActionCard
    product-id="creator"
    :actions="[
      { label: '安装指南', href: '/creator/install', primary: true },
      { label: '使用案例', href: '/creator/use-cases' },
    ]"
  />
  <ActionCard
    name="Lutu — 移动客户端"
    tagline="路途 APP · 移动端 AI 助理与记账"
    icon="smartphone"
    color="var(--lurus-color-creator)"
    status="beta"
    :actions="[
      { label: '下载 Lutu', href: 'https://www.lurus.cn/download#lutu', primary: true, external: true },
    ]"
  />
</div>

---

## <Icon name="briefcase" :size="22" /> 我是决策者 — 评估企业采购 {#decider}

不是工具采购，是基础设施替换。先看 TCO 与合规边界，再看功能。

<div class="action-grid">
  <ActionCard
    name="为什么选择 Lurus"
    tagline="四项核心能力 vs 自建 — TCO、性能、合规一张表"
    icon="award"
    color="var(--lurus-brand-500)"
    :actions="[
      { label: '企业方案', href: '/solutions/', primary: true },
      { label: 'Why Lurus', href: '/solutions/why-lurus' },
    ]"
  />
  <ActionCard
    name="企业部署形态"
    tagline="SaaS · 私有化 · 混合云 · 合规边界一次讲清"
    icon="server"
    color="var(--lurus-color-platform)"
    :actions="[
      { label: '部署矩阵', href: '/solutions/enterprise-deploy', primary: true },
    ]"
  />
  <ActionCard
    product-id="auth"
    :actions="[
      { label: '概述与接入点', href: '/platform/auth/', primary: true },
      { label: '企业 SSO 联邦', href: '/platform/auth/oidc' },
      { label: '认证控制台', href: 'https://auth.lurus.cn', external: true },
    ]"
  />
  <ActionCard
    name="联系商务"
    tagline="私有化部署 · 授权 · 定制化 · 合作咨询"
    icon="mail"
    color="var(--lurus-color-auth)"
    :actions="[
      { label: 'business@lurus.cn', href: 'mailto:business@lurus.cn', primary: true, external: true },
    ]"
  />
</div>

---

## <Icon name="code" :size="22" /> 我是开发者 — 构建 AI 系统 {#dev}

LLM 应用的四个底层组件：执行 · 记忆 · 网关 · CLI。各自能用，组合更强。

<div class="action-grid">
  <ActionCard
    product-id="kova"
    :actions="[
      { label: '快速开始', href: '/kova/quickstart', primary: true },
      { label: '核心概念', href: '/kova/concepts' },
      { label: 'API 参考', href: '/kova/api' },
    ]"
  />
  <ActionCard
    product-id="memx"
    :actions="[
      { label: '快速开始', href: '/memx/quickstart', primary: true },
      { label: '核心概念', href: '/memx/concepts' },
      { label: '架构设计', href: '/memx/architecture' },
    ]"
  />
  <ActionCard
    product-id="lumen"
    :actions="[
      { label: '快速开始', href: '/lumen/quickstart', primary: true },
      { label: 'Python SDK', href: '/lumen/python-sdk' },
      { label: 'CLI 手册', href: '/lumen/cli' },
    ]"
  />
  <ActionCard
    product-id="api-ref"
    :actions="[
      { label: 'API 概述', href: '/api/overview', primary: true },
      { label: '认证', href: '/api/authentication' },
      { label: 'Chat Completions', href: '/api/chat-completions' },
    ]"
  />
  <ActionCard
    product-id="arch"
    :actions="[
      { label: '查看架构', href: '/developer/architecture', primary: true },
    ]"
  />
  <ActionCard
    product-id="forge"
    :actions="[
      { label: '产品哲学', href: '/forge/', primary: true },
      { label: 'Ontology', href: '/forge/ontology' },
    ]"
  />
</div>

---

## 跨产品教程 · 迁移指南

<div class="action-grid action-grid--compact">
  <ActionCard
    name="教程中心"
    tagline="MemX + Kova · Lumen + LangGraph · Lucrum 端到端"
    icon="graduation-cap"
    color="var(--lurus-color-kova)"
    :actions="[
      { label: '跨产品教程', href: '/tutorials/', primary: true },
    ]"
  />
  <ActionCard
    name="迁移指南"
    tagline="OpenAI · LangGraph · 自建 OIDC → 5 分钟搬家"
    icon="import"
    color="var(--lurus-color-lurus-api)"
    :actions="[
      { label: '迁移中心', href: '/migrations/', primary: true },
    ]"
  />
  <ActionCard
    name="术语表"
    tagline="47+ 技术术语按主题分组，跨产品速查"
    icon="book-a"
    color="var(--lurus-color-memx)"
    :actions="[
      { label: '术语全表', href: '/guide/glossary', primary: true },
    ]"
  />
</div>

---

## 为什么选择 Lurus？

四个判断点 — 不是又一个工具，是一次基础设施替换。

<div class="diff-grid">
  <article class="diff-card diff-card--brand">
    <header class="diff-card__head">
      <span class="diff-card__icon"><Icon name="layers" :size="20" /></span>
      <h3 class="diff-card__title">全栈自研</h3>
    </header>
    <p class="diff-card__lede">Rust 执行引擎到 Flutter 移动端，全部自研。账户 / 计费 / 记忆 / 网关共用。</p>
    <ul class="diff-card__points">
      <li>出问题不用等三家厂商互相推诿</li>
      <li>越用越值——记忆、计费、模型在一个池里复利</li>
    </ul>
  </article>

  <article class="diff-card diff-card--accent-kova">
    <header class="diff-card__head">
      <span class="diff-card__icon"><Icon name="zap" :size="20" /></span>
      <h3 class="diff-card__title">引擎级性能</h3>
    </header>
    <p class="diff-card__lede">Kova 调度 <strong>3μs</strong>（Criterion）· 网关 p95 <strong>&lt; 50ms</strong>。</p>
    <ul class="diff-card__points">
      <li>我们写了执行引擎，不是又包了 Temporal 一层</li>
      <li>MemX 不调 LLM 也能蒸馏 · Lucrum 全精度无浮点漂移</li>
    </ul>
  </article>

  <article class="diff-card diff-card--accent-platform">
    <header class="diff-card__head">
      <span class="diff-card__icon"><Icon name="shield-check" :size="20" /></span>
      <h3 class="diff-card__title">数据主权</h3>
    </header>
    <p class="diff-card__lede">一次部署，不向任何云厂商纳税。国密 SM4-GCM 全程加密。</p>
    <ul class="diff-card__points">
      <li>一套 SSO / Passkey / MFA，接你已有的 IdP</li>
      <li>兼容 OpenAI SDK · 想走随时拿数据走</li>
    </ul>
  </article>

  <article class="diff-card diff-card--accent-memx">
    <header class="diff-card__head">
      <span class="diff-card__icon"><Icon name="receipt" :size="20" /></span>
      <h3 class="diff-card__title">TCO 透明</h3>
    </header>
    <p class="diff-card__lede">鹿贝单位统一计费 — 50+ 模型，一份对账单。</p>
    <ul class="diff-card__points">
      <li>对账时间从一天到 5 分钟</li>
      <li>随时迁出，零退出成本</li>
    </ul>
  </article>
</div>

<details class="diff-table">
  <summary>展开完整对照表（8 个维度 × 自建对比）</summary>

| 维度 | Lurus 的优势 | 对照自建 |
|------|-------------|---------|
| **全栈自研** | 从 Rust 执行引擎到 Flutter 移动端，核心技术完全自主可控 | 多供应商拼装，版本锁定风险 |
| **引擎级性能** | Kova 3μs 调度延迟（Criterion 基准），网关 p95 < 50ms | 自建 Temporal/LangGraph 量级较慢 |
| **数据主权** | 私有化部署，数据不出企业边界，支持国密 SM4-GCM | 公有云合规与审计难度高 |
| **统一身份** | 所有产品共享 SSO、Passkey、MFA，接企业 IdP 联邦 | Keycloak / Auth0 自运维 |
| **生态协同** | 12 个产品共享账户/计费/记忆/LLM 网关，越用越值 | 工具栈碎片化 |
| **经济高效** | MemX 零 LLM 成本蒸馏；Lucrum Decimal.js 全精度零误差 | 记忆 / 精度问题需额外投入 |
| **TCO 透明** | 鹿贝单位统一计费，按量扣费 + 免费额度 | 多家账单对账复杂 |
| **开放可迁出** | OpenAI SDK 兼容，PAT/JWT 标准认证，导出无锁定 | 供应商锁定退出成本高 |

</details>

---

## 准备好了？

<div class="finalcta">
  <div class="finalcta__text">
    <h3>5 行代码切换网关，兼容 OpenAI SDK</h3>
    <p>改一个 base_url，原有调用全部接通。一个 Key 接 50+ 模型，注册即送免费额度。</p>
  </div>
  <div class="finalcta__actions">
    <a href="/guide/quickstart" class="finalcta__btn finalcta__btn--primary">3 分钟上手 →</a>
    <a href="https://api.lurus.cn" target="_blank" rel="noopener noreferrer" class="finalcta__btn finalcta__btn--alt">前往控制台 ↗</a>
    <a href="mailto:business@lurus.cn" class="finalcta__btn finalcta__btn--ghost">企业咨询</a>
  </div>
</div>

## 联系我们

<div class="contact-grid">
  <a href="mailto:support@lurus.cn" class="contact-card">
    <span class="contact-card__icon"><Icon name="life-buoy" :size="22" /></span>
    <span class="contact-card__name">技术支持</span>
    <span class="contact-card__addr">support@lurus.cn</span>
  </a>
  <a href="mailto:business@lurus.cn" class="contact-card contact-card--accent">
    <span class="contact-card__icon"><Icon name="briefcase" :size="22" /></span>
    <span class="contact-card__name">商务合作</span>
    <span class="contact-card__addr">business@lurus.cn</span>
  </a>
  <a href="https://github.com/hanmahong5-arch" target="_blank" rel="noopener noreferrer" class="contact-card">
    <span class="contact-card__icon"><Icon name="github" :size="22" /></span>
    <span class="contact-card__name">GitHub</span>
    <span class="contact-card__addr">hanmahong5-arch ↗</span>
  </a>
</div>

</div>

<style>
.lurus-home { max-width: 1152px; margin: 0 auto; padding: 24px; }
.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 20px 0 28px;
}
.action-grid--compact {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}
.lurus-home h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--lurus-fs-xl);
  font-weight: 700;
  margin-top: 36px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--vp-c-brand-soft);
}
.lurus-home h2 .lurus-icon { color: var(--vp-c-brand-1); }
.lurus-home hr {
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--vp-c-brand-soft), transparent);
  margin: 40px 0;
}
@media (max-width: 640px) {
  .lurus-home { padding: 16px; }
}

/* ============================================================
 * Persona jump chips — sits under Hero, anchors into 4 personas
 * ============================================================ */
.persona-jump {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: -12px 0 8px;
  padding: 10px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--lurus-radius-pill);
  align-items: center;
  justify-content: center;
}
.persona-jump__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--lurus-radius-pill);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--vp-c-text-2) !important;
  text-decoration: none !important;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  transition: transform var(--lurus-dur-fast) var(--lurus-ease-out),
              border-color var(--lurus-dur-fast),
              color var(--lurus-dur-fast);
}
.persona-jump__chip:hover {
  transform: var(--lurus-hover-rise);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1) !important;
}
.persona-jump__icon {
  display: inline-flex;
  color: var(--vp-c-brand-1);
}
.persona-jump__hint {
  color: var(--vp-c-text-3);
  font-weight: 400;
  font-size: 0.74rem;
}
.persona-jump__chip:hover .persona-jump__hint { color: inherit; opacity: 0.85; }
@media (max-width: 640px) {
  .persona-jump { border-radius: var(--lurus-radius-lg); }
  .persona-jump__hint { display: none; }
}

/* ============================================================
 * Differentiators — 4 cards replacing the 8-row why-Lurus table
 * ============================================================ */
.diff-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
  margin: 18px 0 14px;
}
.diff-card {
  --accent: var(--vp-c-brand-1);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--lurus-radius-lg);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  transition: transform var(--lurus-dur-base) var(--lurus-ease-out),
              border-color var(--lurus-dur-base),
              box-shadow var(--lurus-dur-base);
}
.diff-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent);
}
.diff-card:hover {
  transform: var(--lurus-hover-rise);
  border-color: var(--accent);
  box-shadow: var(--lurus-shadow-3);
}
.diff-card--brand            { --accent: var(--vp-c-brand-1); }
.diff-card--accent-kova      { --accent: var(--lurus-color-kova); }
.diff-card--accent-platform  { --accent: var(--lurus-color-platform); }
.diff-card--accent-memx      { --accent: var(--lurus-color-memx); }
.diff-card__head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.diff-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--lurus-radius-md);
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  color: var(--accent);
  flex-shrink: 0;
}
.diff-card__title {
  margin: 0;
  font-size: 1.02rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  border: none !important;
  padding: 0 !important;
}
.diff-card__lede {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}
.diff-card__lede strong {
  color: var(--accent);
  font-feature-settings: 'tnum';
}
.diff-card__points {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.diff-card__points li {
  position: relative;
  padding-left: 16px;
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
.diff-card__points li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.65;
}

.diff-table {
  margin: 12px 0 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--lurus-radius-md);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}
.diff-table > summary {
  cursor: pointer;
  padding: 12px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  user-select: none;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background var(--lurus-dur-fast);
}
.diff-table > summary::-webkit-details-marker { display: none; }
.diff-table > summary::before {
  content: '▸';
  display: inline-block;
  transition: transform var(--lurus-dur-fast);
  color: var(--vp-c-brand-1);
}
.diff-table[open] > summary::before { transform: rotate(90deg); }
.diff-table > summary:hover { background: var(--vp-c-bg-mute); }
.diff-table table { margin: 0 18px 18px; }

/* ============================================================
 * Final CTA — bottom strip "ready?"
 * ============================================================ */
.finalcta {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 24px;
  align-items: center;
  margin: 24px 0 16px;
  padding: 28px 32px;
  border-radius: var(--lurus-radius-xl);
  background:
    radial-gradient(120% 140% at 0% 0%, color-mix(in srgb, var(--vp-c-brand-1) 14%, transparent), transparent 60%),
    radial-gradient(120% 140% at 100% 100%, color-mix(in srgb, var(--lurus-color-kova) 12%, transparent), transparent 55%),
    var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}
.finalcta__text h3 {
  margin: 0 0 6px;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  border: none !important;
  padding: 0 !important;
}
.finalcta__text p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
.finalcta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
}
.finalcta__btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: var(--lurus-radius-pill);
  text-decoration: none !important;
  transition: transform var(--lurus-dur-fast),
              filter var(--lurus-dur-fast),
              border-color var(--lurus-dur-fast),
              color var(--lurus-dur-fast);
}
.finalcta__btn:hover { transform: var(--lurus-hover-rise); }
.finalcta__btn--primary {
  background: var(--vp-c-brand-1);
  color: #fff !important;
}
.finalcta__btn--primary:hover { filter: brightness(1.08); }
.finalcta__btn--alt {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1) !important;
  border: 1px solid var(--vp-c-divider);
}
.finalcta__btn--alt:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1) !important;
}
.finalcta__btn--ghost {
  color: var(--vp-c-text-2) !important;
}
.finalcta__btn--ghost:hover { color: var(--vp-c-brand-1) !important; }

@media (max-width: 720px) {
  .finalcta {
    grid-template-columns: 1fr;
    padding: 22px 20px;
  }
  .finalcta__actions { justify-content: flex-start; }
}

/* ============================================================
 * Contact card grid
 * ============================================================ */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin: 16px 0 8px;
}
.contact-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 18px 20px;
  border-radius: var(--lurus-radius-lg);
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  text-decoration: none !important;
  color: var(--vp-c-text-1) !important;
  transition: transform var(--lurus-dur-base),
              border-color var(--lurus-dur-base),
              box-shadow var(--lurus-dur-base);
}
.contact-card:hover {
  transform: var(--lurus-hover-rise);
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--lurus-shadow-2);
}
.contact-card--accent { border-color: color-mix(in srgb, var(--vp-c-brand-1) 30%, var(--vp-c-divider)); }
.contact-card__icon {
  color: var(--vp-c-brand-1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: var(--lurus-radius-md);
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
}
.contact-card__name {
  font-weight: 700;
  font-size: 0.95rem;
}
.contact-card__addr {
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  font-family: var(--lurus-font-mono);
}
</style>
