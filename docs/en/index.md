---
layout: page
title: LurusTech Docs
description: "AI systems in the customer's own environment: status you can verify, data you can restore, changes on record. Entry point to the docs for Witness, Kova, MemX, the gateway and the platform base."
---

<div class="vp-doc lurus-home">

<Hero />

<section class="home-block" aria-labelledby="home-parts">

## Docs by component {#home-parts}

<ul class="home-parts">
  <li>
    <a class="home-parts__name" href="/witness/">Lurus Witness</a><Badge type="warning" text="Early pilot" />
    <p>Read-only collection, external probing, a real restore drill every month and a monthly evidence report; every reading states how strong its evidence is. Docs are in Chinese.</p>
  </li>
  <li>
    <a class="home-parts__name" href="/en/kova/">Kova</a><Badge type="warning" text="Early pilot" />
    <p>Embedded durable execution engine: write-ahead-log crash recovery, execution records, replay.</p>
  </li>
  <li>
    <a class="home-parts__name" href="/en/memx/">MemX</a><Badge type="warning" text="Early pilot" />
    <p>AI memory engine: extraction, deduplication, decay, hybrid retrieval; CLI / REST / MCP.</p>
  </li>
  <li>
    <a class="home-parts__name" href="/en/guide/quickstart">Gateway & API</a><Badge type="tip" text="In internal production use" />
    <p>Privately deployed multi-tenant LLM gateway, based on the open-source New API (AGPLv3). Interface details are in the <a href="/en/api/overview">API reference</a>.</p>
  </li>
  <li>
    <a class="home-parts__name" href="/en/platform/">Platform base</a><Badge type="tip" text="In internal production use" />
    <p>Accounts and sign-in shared by every component. It is a base layer, not offered on its own.</p>
  </li>
</ul>

</section>

<section class="home-block" aria-labelledby="home-start">

## Where to start {#home-start}

<dl class="home-start">
  <dt>Operators deploying Witness</dt>
  <dd>Read <a href="/witness/deploy">Deployment (Chinese)</a>, then <a href="/witness/evidence">Core concepts (Chinese)</a>, to see where each reading comes from and how certain it is.</dd>
  <dt>Developers integrating the gateway</dt>
  <dd>Make one call with the <a href="/en/guide/quickstart">Quickstart</a>; look up fields and error codes in the <a href="/en/api/overview">API reference</a>.</dd>
  <dt>Decision-makers evaluating</dt>
  <dd>Read "What it is not" and "Where it stands" in the <a href="/witness/">Witness overview (Chinese)</a>, then <a href="/witness/drills">Restore drills and monthly reports (Chinese)</a>.</dd>
</dl>

</section>

<section class="home-block" aria-labelledby="home-bounds">

## Boundaries {#home-bounds}

<p class="home-bounds">We do not resell data-center space or compute, and we do not promise numbers we cannot prove. Maturity uses four labels only (early pilot, in internal production use, open source, in design), and when unsure we pick the more conservative one.</p>

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
