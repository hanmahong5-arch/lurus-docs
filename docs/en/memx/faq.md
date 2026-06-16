---
title: MemX FAQ
description: Frequently asked questions and answers about the MemX AI memory engine.
---

<div class="memx-faq">

# FAQ

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="brain" :size="14" /> Basics</span>
  <h2 class="lurus-section-head__title">Basic Questions</h2>
</div>

<details class="lurus-faq-item"><summary>What is the relationship between MemX and mem0?</summary>

MemX is an enhanced version (superset) of [mem0](https://github.com/mem0ai/mem0), adding the ACE intelligent memory management layer. When `ace_enabled=False`, its behavior is fully identical to mem0 with zero overhead.

</details>

<details class="lurus-faq-item"><summary>Do I need a GPU?</summary>

No. The local embedding model all-MiniLM-L6-v2 runs on CPU via ONNX Runtime (&lt; 5ms per item); the Reflector's rule-based pre-filtering does not depend on a GPU, and hybrid mode's LLM refinement goes through a remote API.

</details>

<details class="lurus-faq-item"><summary>Will it incur extra LLM token consumption?</summary>

The default `hybrid` mode only calls the LLM for valuable candidates, reducing calls by 90%+ compared to mem0's full-volume calling; when the LLM is unavailable it automatically degrades to pure rules with zero cost. To disable explicitly, set `reflector.mode="rules"`.

</details>

<details class="lurus-faq-item"><summary>Which vector databases are supported?</summary>

It inherits all of mem0's (Qdrant, Chroma, Pinecone, Weaviate, Milvus, etc.); the default in-memory storage is suitable for development and testing.

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> Usage</span>
  <h2 class="lurus-section-head__title">Usage Questions</h2>
</div>

<details class="lurus-faq-item"><summary>How do I migrate from mem0?</summary>

<ol class="lurus-steps">
<li>

`pip install git+https://github.com/UU114/memx.git`

</li>
<li>

Change `from mem0 import Memory` to `from memx import Memory`

</li>
<li>

Existing code requires no changes (ACE is disabled by default).

</li>
<li>

When you're ready, add `config={"ace_enabled": True}` to enable the intelligent features.

</li>
</ol>

</details>

<details class="lurus-faq-item"><summary>Where is the data stored?</summary>

It depends on the configured vector database backend; the default is in-memory (lost on restart), and persistence with Qdrant/Chroma is recommended for production. The local embedding model is cached in `~/.memx/models/`.

</details>

<details class="lurus-faq-item"><summary>How do I control the decay speed?</summary>

| Parameter | Effect |
|------|------|
| `decay.half_life_days` | Increase → slower decay (default 30 days) |
| `decay.boost_factor` | Increase → more pronounced recall reinforcement (default 0.1) |
| `decay.permanent_threshold` | Decrease → easier to become permanent memory (default 15 times) |

</details>

<details class="lurus-faq-item"><summary>How do I handle misjudged knowledge?</summary>

<ol class="lurus-steps">
<li>

`memx list --scope project:my-app` — view

</li>
<li>

`memx forget <memory-id>` — delete

</li>
<li>

`memx learn "correct knowledge"` — add manually

</li>
</ol>

</details>

<details class="lurus-faq-item"><summary>How can multiple people / multiple agents share memory?</summary>

Enable daemon mode, where multiple agents share the same knowledge base via an IPC socket (IDE plugins, team collaboration), using `scope` to distinguish projects/workspaces.

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> Privacy</span>
  <h2 class="lurus-section-head__title">Privacy Questions</h2>
</div>

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Filtering cannot be turned off</p>
    <div class="lurus-callout__body"><p>The 12 built-in sensitive-information filtering rules are a non-disableable security baseline; you can only add extra rules through <code>privacy_custom_patterns</code>.</p></div>
  </div>
</div>

<details class="lurus-faq-item"><summary>Which types of sensitive information filtering are supported?</summary>

| Type | Example |
|---------|------|
| PEM private key | `-----BEGIN RSA PRIVATE KEY-----` |
| Bearer / JWT Token | `Bearer eyJhbG...` |
| Anthropic API Key | `sk-ant-api03-*` |
| OpenAI API Key | `sk-proj-*` |
| GitHub Token | `ghp_*`, `github_pat_*` |
| AWS Access Key | `AKIA*` |
| AWS Secret Key | 40-character base64 |
| Database connection string | `postgres://user:pass@host/db` |
| Operating system path | `/home/user/.ssh/id_rsa` |
| Custom rule | Added via `privacy_custom_patterns` |

::: info
These 12 rules focus on sensitive information of the **secrets and local paths** kind (secrets + user paths), and are not PII in the traditional sense (email / phone / ID numbers, etc.). If you need PII filtering, extend it yourself through `privacy_custom_patterns`.
:::

</details>

<details class="lurus-faq-item"><summary>Where does the filtered original value go?</summary>

It is replaced by a placeholder (such as `[REDACTED:api_key]`), and the original value is not stored anywhere. Filtering is performed at the very front of the write pipeline.

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> Performance</span>
  <h2 class="lurus-section-head__title">Performance Questions</h2>
</div>

<details class="lurus-faq-item"><summary>How many memories can it store?</summary>

It depends on the vector database backend's capacity; MemX itself has no hard limit; the decay engine automatically archives to keep the active scale reasonable.

</details>

<details class="lurus-faq-item"><summary>Does the RecallReinforcer affect search performance?</summary>

No. It is an asynchronous background thread that only updates `recall_count` after results are returned, without blocking the search.

</details>

<details class="lurus-faq-item"><summary>How large is the retrieval latency? (&lt; 10,000 memories)</summary>

| Operation | Latency |
|------|------|
| Four-layer hybrid search | 10-50ms |
| Pure keyword search (L4 degradation) | 5-20ms |
| Local embedding computation | &lt; 5ms |
| Write (including Reflector + Curator) | 20-100ms |

</details>

## Next Steps

<NextSteps
  :steps="[
    { text: 'Quickstart — experience core features in 5 minutes', link: '/en/memx/quickstart', primary: true },
    { text: 'Core Concepts — dive into the ACE engine', link: '/en/memx/concepts' },
    { text: 'Architecture — the complete system architecture', link: '/en/memx/architecture' },
  ]"
/>

</div>
