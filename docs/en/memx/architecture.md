---
title: MemX Architecture
description: A detailed walkthrough of MemX's pipeline architecture, covering the ingest pipeline, the retrieval pipeline, and the per-component independent degradation design.
---

<div class="memx-page">

# Architecture

MemX uses a pipeline architecture in which ingestion and retrieval are orchestrated by independent pipelines, and every component supports independent failure and graceful degradation.

<MetricStats
  :items="[
    { label: 'Memory API', value: '5 methods', hint: 'add / search / status / detect_conflicts / export' },
    { label: 'Core pipelines', value: '2', hint: 'Ingest + Retrieval' },
    { label: 'Degradation', value: 'Component-level', hint: 'A single component failure does not interrupt the service' },
  ]"
/>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="network" :size="14" /> Topology</span>
  <h2 class="lurus-section-head__title">System Overview</h2>
  <p class="lurus-section-head__lede">Two independent pipelines feed into the Decay Engine and the vector store.</p>
</div>

<ArchitectureDiagram title="MemX Pipeline Architecture" chart="graph TB
  API[Memory API<br/>add / search / status / detect_conflicts / export]
  API --> Ingest[IngestPipeline ingest]
  API --> Retrieval[RetrievalPipeline retrieval]
  Ingest --> I1[Privacy Sanitizer] --> I2[Reflector] --> I3[Curator] --> I4[mem0.add]
  Retrieval --> R1[Generator L1-L4] --> R2[ScoreMerger] --> R3[TokenBudgetTrimmer] --> R4[RecallReinforcer]
  I4 --> Decay[Decay Engine<br/>async decay computation]
  R4 --> Decay
  Decay --> Store[(Vector Store<br/>mem0 Backend)]" />

## Ingest Pipeline — IngestPipeline

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">The privacy gateway cannot be bypassed</p>
    <div class="lurus-callout__body"><p>The Privacy Sanitizer is the first stop in the pipeline and cannot be skipped. Its 12 built-in sensitive-information rules perform interception before data is written to the vector store, and the sanitizer never throws an exception.</p></div>
  </div>
</div>

`Raw Input` passes through, in order:

1. **Privacy Sanitizer** (cannot be bypassed) — 12 built-in sensitive-information rules plus custom regexes; the sanitizer never throws an exception.
2. **Reflector** — hybrid mode (rule pre-filter + LLM refinement): PatternDetector (detects 5 pattern types) → KnowledgeScorer (scoring + classification) → PrivacySanitizer (redacts candidate knowledge) → BulletDistiller (compresses into refined entries). On failure, falls back to the raw add.
3. **Curator** — cosine-similarity deduplication: ≥0.8 merge (merge_content/keep_best), 0.5–0.8 flag potential conflict, <0.5 independent knowledge passes through. On failure, skips deduplication and writes directly.
4. **BulletFactory** — metadata format conversion → `mem0.add()` persists to the vector database.

### Degradation Paths in the Ingest Pipeline

Each stage has independent error handling:

| Stage | Failure behavior | Data impact |
|------|---------|---------|
| Privacy Sanitizer | Never fails (internal try-catch) | Raw data passes through |
| Reflector | Falls back to raw `mem0.add()` | Knowledge is stored directly without distillation |
| Curator | Skips deduplication | May produce duplicate entries |
| mem0.add | Throws an exception | Write fails |

## Retrieval Pipeline — RetrievalPipeline

`Query` passes through, in order:

1. **Generator Engine** — L1 ExactMatcher (exact words) / L2 FuzzyMatcher (fuzzy tokens) / L3 MetadataMatcher (metadata Jaccard) / L4 VectorSearcher (vector semantics). L4 failure → keyword-only mode.
2. **ScoreMerger** (weighted fusion): `NormKW = (L1+L2+L3)/35`; `Blended = KW×0.6 + S×0.4`; `Final = Blended×Decay×Recency×Scope`.
3. **TokenBudgetTrimmer** (dual constraints): `max_results=5` + `token_budget=2000`, with CJK-aware token estimation.
4. Returns results to the caller while asynchronously running the **RecallReinforcer** to increment the `recall_count` of the hit memories (without blocking the search response).

## Data Model

The complete metadata carried by each memory (Bullet):

```python
{
    "id": "mem_a1b2c3d4",
    "content": "pytest 超时问题：使用 -x --timeout=30 逐个运行",
    "section": "DEBUGGING",
    "knowledge_type": "TRICK",
    "instructivity_score": 78,
    "source_type": "INTERACTION",

    # Decay tracking
    "recall_count": 3,
    "decay_weight": 0.89,
    "created_at": "2026-02-20T10:30:00Z",
    "last_recalled_at": "2026-02-27T15:00:00Z",

    # Taxonomy
    "related_tools": ["pytest"],
    "key_entities": ["timeout", "test-isolation"],
    "tags": ["python", "testing"],
    "scope": "project:my-backend"
}
```

## Local Embeddings

MemX runs the embedding model locally with ONNX Runtime — no external API required, fully offline with no privacy leakage: model all-MiniLM-L6-v2, dimension 384, stored at `~/.memx/models/`, ~90MB first-time download, inference < 5ms per entry.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">all-MiniLM-L6-v2</span><span class="lurus-stat__label">Embedding model</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">384</span><span class="lurus-stat__label">Vector dimension</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">~90MB</span><span class="lurus-stat__label">First-time download</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">&lt;5ms</span><span class="lurus-stat__label">Per-entry inference</span></div>
</div>

## Daemon Mode

An optional background daemon lets multiple agents/processes (Agent A/B/C) share a single Vector Store through the **MemX Daemon (IPC Socket)**. IPC Socket communication avoids database connection contention; the daemon exits automatically on idle timeout (default 300 seconds); suitable for IDE plugins, multiple windows, and similar scenarios.

<ArchitectureDiagram title="Daemon Shared Topology" chart="graph LR
  A[Agent A] --> D[MemX Daemon<br/>IPC Socket]
  B[Agent B] --> D
  C[Agent C] --> D
  D --> S[(Shared Vector Store)]" />

## Configuration Reference

```python
from memx import Memory

m = Memory(config={
    # ACE Engine
    "ace_enabled": True,

    # Reflector — hybrid mode: rule pre-filter + LLM refinement
    "reflector": {
        "mode": "hybrid",       # "rules" | "hybrid"(default) | "llm"
        "min_score": 30.0,      # minimum knowledge score threshold
        "llm_model": "openai/gpt-4o-mini",
    },

    # Curator — semantic deduplication
    "curator": {
        "similarity_threshold": 0.8,    # auto-merge threshold
        "merge_strategy": "keep_best",  # "keep_best" or "merge_content"
    },

    # Decay — bionic forgetting curve
    "decay": {
        "half_life_days": 30.0,         # days to decay to 50%
        "boost_factor": 0.1,            # recall reinforcement coefficient
        "permanent_threshold": 15,      # min recalls for permanent memory
    },

    # Retrieval — hybrid 4-layer search
    "retrieval": {
        "keyword_weight": 0.6,
        "semantic_weight": 0.4,
        "max_results": 5,
        "token_budget": 2000,
    },

    # Privacy — sensitive data filtering (secrets / tokens / local paths)
    "privacy": {
        "custom_patterns": [
            r"INTERNAL_KEY_\w+"
        ],
    },
})
```

---

<NextSteps
  title="Next Steps"
  :steps="[
    { text: 'Core Concepts — A deep dive into the four core modules of the ACE engine', link: '/en/memx/concepts', primary: true },
    { text: 'Quickstart — Try the core features of MemX in 5 minutes', link: '/en/memx/quickstart' },
    { text: 'FAQ — Answers to common questions when using MemX', link: '/en/memx/faq' },
  ]"
/>

</div>

<style>
.memx-page .lurus-section-head {
  margin-top: 2.5rem;
}
.memx-page .metric-stats,
.memx-page .lurus-stat-strip {
  margin: 1.5rem 0 2rem;
}
.memx-page .lurus-callout {
  margin: 1.25rem 0;
}
</style>
