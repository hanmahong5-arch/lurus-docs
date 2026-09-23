---
layout: page
title: LurusTech 文档
description: 让客户自有环境里的 AI 系统，状态可核查、数据可恢复、改动有记录。见证、Kova、MemX、网关与平台底座的文档入口。
---

<div class="vp-doc lurus-home">

<Hero />

<section class="home-block" aria-labelledby="home-parts">

## 按构件进入文档 {#home-parts}

<ul class="home-parts">
  <li>
    <a class="home-parts__name" href="/witness/">Lurus Witness · 见证</a><Badge type="warning" text="早期试点" />
    <p>只读采集、外部探测、每月真实恢复演练与月度证据报告；每条读数都标明它的证据强度。</p>
  </li>
  <li>
    <a class="home-parts__name" href="/kova/">Kova</a><Badge type="warning" text="早期试点" />
    <p>嵌入式持久执行引擎：预写日志崩溃恢复、执行留痕、可回放。</p>
  </li>
  <li>
    <a class="home-parts__name" href="/memx/">MemX</a><Badge type="warning" text="早期试点" />
    <p>AI 记忆引擎：抽取、去重、衰减、混合检索；命令行 / REST / MCP 接入。</p>
  </li>
  <li>
    <a class="home-parts__name" href="/guide/quickstart">网关与 API</a><Badge type="tip" text="内部生产使用" />
    <p>私有部署的多租户 LLM 网关，基于开源 New API（AGPLv3）。接口细节见 <a href="/api/overview">API 参考</a>。</p>
  </li>
  <li>
    <a class="home-parts__name" href="/platform/">平台底座</a><Badge type="tip" text="内部生产使用" />
    <p>各构件共用的账号与登录。它是底座，不单独对外提供。</p>
  </li>
</ul>

</section>

<section class="home-block" aria-labelledby="home-start">

## 从哪里开始 {#home-start}

<dl class="home-start">
  <dt>要部署见证的运维</dt>
  <dd>先读 <a href="/witness/deploy">部署</a>，再读 <a href="/witness/evidence">核心概念</a>，弄清每个读数从哪来、有多确定。</dd>
  <dt>要接入网关的开发</dt>
  <dd>从 <a href="/guide/quickstart">快速开始</a> 跑通一次调用；字段与错误码查 <a href="/api/overview">API 参考</a>。</dd>
  <dt>要评估的决策者</dt>
  <dd>读 <a href="/witness/">见证概览</a> 里的「它不是什么」和「现在做到哪里」，再看 <a href="/witness/drills">恢复演练与月度报告</a>。</dd>
</dl>

</section>

<section class="home-block" aria-labelledby="home-bounds">

## 边界 {#home-bounds}

<p class="home-bounds">我们不做机房与算力转售，也不承诺证明不了的数字；成熟度只用四档标注——早期试点、内部生产使用、开源、设计中，拿不准时标更保守的那档。</p>

</section>

</div>

<style>
.lurus-home { max-width: 1152px; margin: 0 auto; padding: 24px; }
.lurus-home .home-block { max-width: 44rem; margin: 40px 0 0; }
.lurus-home .home-block h2 {
  font-size: var(--lurus-fs-lg);
  font-weight: 600;
  margin: 0 0 12px;
  padding: 0 0 8px;
  border-top: none;
  border-bottom: 1px solid var(--vp-c-divider);
}
.home-parts { list-style: none; padding: 0 !important; margin: 0; }
.home-parts li {
  margin: 0 !important;
  padding: 14px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}
.home-parts__name { font-weight: 600; text-decoration: none !important; }
.home-parts p { margin: 4px 0 0 !important; color: var(--vp-c-text-2); line-height: 1.6; }
.home-start { margin: 0; }
.home-start dt { font-weight: 600; margin-top: 14px; }
.home-start dd { margin: 4px 0 0; color: var(--vp-c-text-2); line-height: 1.6; }
.home-bounds { color: var(--vp-c-text-2); line-height: 1.7; }
@media (max-width: 640px) {
  .lurus-home { padding: 16px; }
}
</style>
