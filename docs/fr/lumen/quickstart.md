---
title: Lumen Quickstart
description: Install CLI + SDK, see lumen demo, wire LangGraph checkpointer/tracer, export a shareable lifecycle HTML.
---

<div class="lumen-page">

# Lumen Quickstart <StatusBadge status="alpha" />

Goal: install → offline aha (`lumen demo`) → instrument a LangGraph run → share lifecycle HTML.

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="check-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Prerequisites</p>
    <div class="lurus-callout__body">Python 3.10+ · optional Rust-free CLI binary · no API key for Core / <code>lumen demo</code>.</div>
  </div>
</div>

<ol class="lurus-steps">

<li>

**Install the CLI and see a lifecycle**

```bash
curl -fsSL https://raw.githubusercontent.com/hanmahong5-arch/lumen/main/docs/install-cli.sh | bash
export PATH="$HOME/.local/bin:$PATH"
lumen demo
# writes lumen-demo-lifecycle.html and opens it
```

</li>

<li>

**Install the Python SDK**

```bash
# Prefer PyPI when published:
pip install "lumen-ai[langgraph]"

# Or from source:
git clone https://github.com/hanmahong5-arch/lumen.git && cd lumen
pip install -e "./lumen-sdk[langgraph]"
```

Import package name is **`lumen`**, not `lumen_ai`.

</li>

<li>

**Wire LangGraph (manual callback — `instrument()` does not monkey-patch LangGraph)**

```python
from lumen.integrations.langgraph import LumenCheckpointer, LumenTracer
from langgraph.prebuilt import create_react_agent

checkpointer = LumenCheckpointer(storage_dir="./checkpoints")
tracer = LumenTracer(trace_dir="./traces")
graph = create_react_agent(model, tools, checkpointer=checkpointer)

THREAD = "research-1"
graph.invoke(
    {"messages": [("user", "…")]},
    config={
        "configurable": {"thread_id": THREAD},
        "callbacks": [tracer],
    },
)
```

For OpenAI / Anthropic clients without LangGraph, `from lumen import instrument, trace` then `instrument()` patches those SDKs; group calls with `with trace("name"):`.

</li>

<li>

**Inspect and share**

```bash
lumen traces
lumen cost --last 24h --format md
lumen export <trace-id>          # self-contained HTML
lumen replay <trace-id>          # zero LLM cost
lumen dashboard                  # local UI on ./traces
```

</li>

<li>

**After a crash (same `thread_id` + storage dir)**

```python
print(checkpointer.resume_hint("research-1"))
cfg = checkpointer.latest_config("research-1")
graph.invoke(
    None,  # continue; do not re-send the original user turn
    config={"configurable": cfg["configurable"], "callbacks": [tracer]},
)
```

</li>

</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="rewind" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Replay costs nothing</p>
    <div class="lurus-callout__body"><code>lumen replay</code> / <code>ReplayEngine</code> reconstruct from recorded traces and do <strong>not</strong> call the LLM again.</div>
  </div>
</div>

## Next Steps

<NextSteps
  :steps="[
    { text: 'Python SDK', link: '/en/lumen/python-sdk', primary: true },
    { text: 'CLI handbook', link: '/en/lumen/cli' },
    { text: 'Integrations (Kova / OTLP)', link: '/en/lumen/integration' },
  ]"
  title="Next Steps"
/>

</div>
