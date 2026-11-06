---
title: Lumen — Agent failure & spend black box
description: Local-first replay, cost, and crash-resume for LangGraph agents. Alpha. Not an agent runtime.
---

<div class="lumen-page">

<ProductHero product-id="lumen" />

<div class="lurus-callout lurus-callout--warning">
  <span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Alpha — honest scope</p>
    <div class="lurus-callout__body">
      <ul>
        <li><strong>Not</strong> an agent runtime — Lumen does not run, deploy, or host agents.</li>
        <li><strong>Not</strong> a general observability platform — it sells a shareable incident lifecycle (money × refuse × resume).</li>
        <li>Python package import is <code>lumen</code> (PyPI name <code>lumen-ai</code>). Do <strong>not</strong> <code>cargo install lumen-cli</code> (unrelated crates.io package).</li>
        <li>Kova is optional (Connected). Core works offline from local trace JSON.</li>
      </ul>
    </div>
  </div>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="check-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Prerequisites</p>
    <div class="lurus-callout__body">
      <ul>
        <li>Python 3.10+ for the SDK</li>
        <li>Optional CLI binary from GitHub Releases (no Rust required)</li>
        <li>No Lurus API key required for Core (local traces + <code>lumen demo</code>)</li>
      </ul>
    </div>
  </div>
</div>

## What is Lumen?

**Lumen** is the black box for agent failures and spend: open a run and see which step burned money, which tool was refused, and how to continue after a crash.

Delivery: Python SDK (`lumen-ai` on PyPI when published; otherwise install from the [source repo](https://github.com/hanmahong5-arch/lumen)) + Rust CLI/dashboard (`lumen`). LangGraph is the one fully supported integration today.

```python
from lumen.integrations.langgraph import LumenCheckpointer, LumenTracer

checkpointer = LumenCheckpointer(storage_dir="./checkpoints")
tracer = LumenTracer(trace_dir="./traces")
graph = workflow.compile(checkpointer=checkpointer)
graph.invoke(inputs, config={"callbacks": [tracer], "configurable": {"thread_id": "t1"}})
```

Then share the incident:

```bash
lumen export <trace-id>   # self-contained lifecycle HTML
lumen cost --format md    # pasteable spend summary
lumen replay <trace-id>   # zero LLM cost
```

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">Core</span><span class="lurus-stat__label">local traces only</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">$0</span><span class="lurus-stat__label">deterministic replay</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">30+</span><span class="lurus-stat__label">model pricing entries</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Connected</span><span class="lurus-stat__label">optional Kova deepen</span></div>
</div>

---

## Core capabilities

| Capability | What it is | What it is not |
|------|------|------|
| **Replay** | Reconstruct a past run from trace JSON (`lumen replay`, Python `ReplayEngine`) | Re-calling the LLM / live fork-intervene |
| **Cost** | Per-run / per-model USD + outliers (`lumen cost`) | A billing gateway |
| **Crash resume** | LangGraph `LumenCheckpointer` + `resume_hint` on disk | Kova WAL durable execution (that is Kova) |
| **Lifecycle HTML** | `lumen demo` / `lumen export` shareable incident artifact | A hosted SaaS console |
| **Dashboard** | Local web UI over `./traces`; Connected tabs need Kova/Netdata | A second agent control plane |

---

## Installation

**CLI** (recommended — no Rust):

```bash
curl -fsSL https://raw.githubusercontent.com/hanmahong5-arch/lumen/main/docs/install-cli.sh | bash
export PATH="$HOME/.local/bin:$PATH"
lumen --version
lumen demo
```

Windows (PowerShell):

```powershell
irm https://raw.githubusercontent.com/hanmahong5-arch/lumen/main/docs/install-cli.ps1 | iex
```

**Python SDK** — if PyPI publish is live:

```bash
pip install "lumen-ai[langgraph]"
```

Otherwise install from source (always works):

```bash
git clone https://github.com/hanmahong5-arch/lumen.git && cd lumen
pip install -e "./lumen-sdk[langgraph]"
```

Full install notes: [INSTALL.md on GitHub](https://github.com/hanmahong5-arch/lumen/blob/main/docs/INSTALL.md).

---

## Core vs Connected

| Layer | Needs | What you get |
|---|---|---|
| **Core** | Local traces only | `instrument` / `replay` / `cost` / `traces` / lifecycle HTML / Overview |
| **Connected** | `--kova-url` and/or `--netdata-url` | Flow, Terminal, Governor advisory, live Metrics |

Kova is a **deepener**, not a prerequisite. Triple story: Forge orchestrates · Kova proves · Lumen sees.

---

## Relationship with Kova

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Lumen</div>
    <p class="lurus-card__body">Read surface — local traces → replay / cost / lifecycle HTML / dashboard. Never runs your agent loop.</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Kova</div>
    <p class="lurus-card__body">Durable execution engine — WAL, recovery depth, REST. Lumen Connected proxies Kova; it does not replace it.</p>
  </div>
</div>

---

## Related pages

<NextSteps
  :steps="[
    { text: 'Quick start', link: '/en/lumen/quickstart', primary: true },
    { text: 'Python SDK', link: '/en/lumen/python-sdk' },
    { text: 'CLI manual', link: '/en/lumen/cli' },
    { text: 'Integrations', link: '/en/lumen/integration' },
  ]"
  title="Next steps"
/>

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-callout { margin: 20px 0 8px; }
.lumen-page .lurus-stat-strip { margin: 18px 0 4px; }
</style>
