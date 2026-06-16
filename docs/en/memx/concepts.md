---
title: MemX Core Concepts
description: The four core modules of the MemX ACE engine — intelligent distillation, semantic deduplication, decay-based forgetting, and hybrid retrieval.
---

<div class="memx-page">

# Core Concepts

MemX’s ACE (Adaptive Context Engine) is built from four core modules that operate independently and work in concert to deliver full-lifecycle knowledge management.

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="brain" :size="14" /> ACE Engine</span>
  <h2 class="lurus-section-head__title">Four Core Modules</h2>
  <p class="lurus-section-head__lede">Distill → Deduplicate → Decay → Retrieve, covering the full knowledge lifecycle.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-memx)"
  :items="[
    { title: 'Reflector · Knowledge Distillation', body: 'hybrid mode pre-filters with rules + refines with the LLM, 5 detection rules, cutting calls by 90%+ versus full LLM.', icon: 'filter' },
    { title: 'Curator · Semantic Deduplication', body: 'Three-tier cosine-similarity dedup: ≥0.8 merge, 0.5–0.8 flag conflict, below 0.5 write independently.', icon: 'database-backup' },
    { title: 'Decay · Time Decay', body: 'Ebbinghaus forgetting curve, 30-day half-life, recall boosting + three-layer permanent-memory protection.', icon: 'timer' },
    { title: 'Generator · Hybrid Retrieval', body: 'Four-layer search L1–L4, keyword 0.6 + semantic 0.4 fusion, then multiplied by decay/recency/scope boosts.', icon: 'search' },
  ]"
/>

## <Term t="Reflector">Reflector</Term> — Knowledge Distillation Engine

Reflector is MemX’s most central innovation: **ultra-low-cost** intelligent knowledge extraction. Traditional AI memory systems extract knowledge from conversations via the LLM every time, consuming 2–5K tokens. Reflector defaults to **hybrid** mode: rule-based pre-filtering + LLM refinement only on valuable candidates, cutting call overhead by 90%+ versus full LLM.

### Three Operating Modes

| Mode | Description | LLM Overhead |
|------|------|---------|
| `rules` | Pure rules engine, entirely based on pattern matching | Zero LLM calls |
| `hybrid` (default) | Rule pre-filtering + LLM refinement, averaging the scores | Called only on candidates, 90%+ reduction |
| `llm` | Fully relies on the LLM to extract knowledge | 2–5K tokens each time |

**hybrid workflow**: raw conversation → PatternDetector (rule detection) → candidate knowledge items → LLM evaluation + distillation (candidates only) → average of the rule score and the LLM score → KnowledgeScorer (scoring and classification) → PrivacySanitizer (privacy redaction) → BulletDistiller (compression and refinement).

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Hybrid mode by default + automatic fallback</p>
    <div class="lurus-callout__body"><p>When the LLM is unavailable, it automatically switches to pure rules mode — zero calls, zero cost.</p></div>
  </div>
</div>

### Five Detection Rules

| Rule | Detection Logic | Confidence | Typical Scenario |
|------|---------|--------|---------|
| ErrorFixRule | Identifies the "error → solution" structure | 0.8 | "TypeError: ... → turns out you need a type assertion" |
| RetrySuccessRule | Detects the successful path after multiple attempts | 0.7 | "Tried A and B, neither worked, finally solved it with C" |
| ConfigChangeRule | Matches config / environment variable changes | 0.6 | "Changed MAX_POOL_SIZE from 10 to 50" |
| NewToolRule | Identifies a tool/library used for the first time | 0.65 | "First time using pnpm, much faster than npm" |
| RepetitiveOpRule | Counts repeated operations (triggers at ≥3) | 0.5+ | "Have to manually clear the cache on every deploy" |

### Knowledge Classification System

Each piece of knowledge is automatically assigned to two dimensions, **Section** (topic) and **KnowledgeType** (type):

- **8 Sections**: `COMMANDS` · `DEBUGGING` · `ARCHITECTURE` · `WORKFLOW` · `TOOLS` · `PATTERNS` · `PREFERENCES` · `GENERAL`
- **5 KnowledgeTypes**: `METHOD` (methodology) · `TRICK` (technique) · `PITFALL` (gotcha) · `PREFERENCE` (preference) · `KNOWLEDGE` (fact)

### Instructivity Score

Each piece of knowledge receives a 0–100 **instructional-value score**, computed from a combination of pattern-match confidence + specificity/actionability + whether it contains a clear causal relationship. Candidates below `min_score` (default 30) are discarded.

## <Term t="Curator">Curator</Term> — Semantic Deduplication Engine

Curator automatically handles duplicates and contradictions on every write.

### Three-Tier Deduplication Strategy

New knowledge is written → cosine similarity against existing knowledge is computed: **≥ 0.8** auto-merge (keep_best or merge_content); **0.5–0.8** flag as a potential conflict pending confirmation; **< 0.5** treat as independent knowledge and write normally.

**Merge strategies**: `keep_best` (default, keeps the version with the higher instructivity_score) / `merge_content` (merges the two pieces of content into a more complete version).

### Conflict Detection

Proactively scans for contradictory memories (e.g., similarity 0.72 but opposite conclusions — "Setting the Redis connection pool to 10 is enough" vs. "At least 50 for stability"; recommends confirming the best practice and deleting the outdated version). Detect at any time via CLI: `memx conflicts`.

## <Term t="Decay">Decay</Term> — Time Decay Engine

Simulates the natural forgetting curve of human memory to keep the knowledge base perpetually "fresh."

### Decay Formula

```
base_weight = 2^(-age_days / half_life)
boosted     = base_weight × (1 + boost_factor × recall_count)
final       = clamp(boosted, 0.0, 1.0)
```

**Core parameters**:

| Parameter | Default | Description |
|------|--------|------|
| `half_life` | 30 days | Number of days for the weight to decay to 50% |
| `boost_factor` | 0.1 | Weight-boost coefficient per recall |

**Numeric examples** (half_life=30, boost_factor=0.1):

| Scenario | age_days | recall_count | base_weight | final |
|------|----------|-------------|-------------|-------|
| Just written | 0 | 0 | 1.0 | **1.0** (protection period) |
| Unused for 30 days | 30 | 0 | 0.5 | **0.5** |
| Unused for 60 days | 60 | 0 | 0.25 | **0.25** |
| 30 days, retrieved 5 times | 30 | 5 | 0.5 | **0.75** |
| 90 days, retrieved 15 times | 90 | 15 | 0.125 | **1.0** (recall>=15 triggers permanent memory, skipping the formula) |

### Three-Layer Protection Mechanism

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Three-layer protection</p>
    <div class="lurus-callout__body"><ul><li><code>recall_count ≥ 15</code> → permanent memory (weight fixed at 1.0)</li><li><code>age ≤ 7 days</code> → protection period (weight fixed at 1.0)</li><li><code>weight &lt; 0.02</code> → archival candidate (can be cleaned up)</li></ul></div>
  </div>
</div>

Intuition: what you just learned (within 7 days) is remembered clearly; what you recall often grows ever stronger; used more than 15 times it becomes "muscle memory"; long unused, it gradually fades.

### Decay’s Effect at Retrieval Time

The decay weight directly factors into the final score of retrieval ranking:

```
Final Score = Blended Search Score × DecayWeight × RecencyBoost × ScopeBoost
```

- `RecencyBoost`: knowledge created within 7 days gets a 1.2x boost
- `ScopeBoost`: knowledge matching the current scope gets a 1.3x boost

## Generator — Hybrid Retrieval Engine

Breaking past the limits of pure <Term t="Vector Search">vector search</Term>, the four-layer search covers the full spectrum from exact matching to semantic understanding.

### Four-Layer Search Architecture

| Layer | Engine | Match Method | Best-Fit Scenario |
|------|------|---------|---------|
| L1 | ExactMatcher | Exact word match | "pytest -v", API names |
| L2 | FuzzyMatcher | Fuzzy token match | Spelling variants, morphological changes |
| L3 | MetadataMatcher | Jaccard similarity over tools / entities / tags | "knowledge about Redis" |
| L4 | VectorSearcher | Vector-embedding semantic search | "how to improve test performance" |

### Score Fusion Formula

```
NormKeyword = (L1 + L2 + L3) / 35.0        # 归一化到 [0, 1]
Blended     = NormKeyword × 0.6 + Semantic × 0.4
Final       = Blended × DecayWeight × RecencyBoost × ScopeBoost
```

The keyword-search weight (0.6) is higher than the semantic-search weight (0.4), ensuring exact-match results are shown first.

**Numeric example**: query "pytest timeout"; score calculation for one memory:
- L1 (exact)=8, L2 (fuzzy)=5, L3 (metadata)=3 → NormKeyword = (8+5+3)/35 = 0.457
- L4 (semantic) = 0.72
- Blended = 0.457×0.6 + 0.72×0.4 = 0.562
- DecayWeight=0.89, RecencyBoost=1.0, ScopeBoost=1.3
- **Final = 0.562 × 0.89 × 1.0 × 1.3 = 0.650**

### Graceful Degradation

When L4 vector search is unavailable (embedding model fails to load), it automatically degrades to pure keyword mode (`keyword_weight=1.0, semantic_weight=0.0`). A failure in any single search layer never interrupts service.

## Token Budget Management

Retrieval results are doubly constrained: `max_results` (maximum number of results returned, default 5) + `token_budget` (maximum token budget, default 2000).

**CJK-aware** (ensuring Chinese text isn’t over-truncated due to incorrect token estimation): CJK characters at 1.5 chars/token; Latin characters at 4.0 chars/token.

## Hierarchical Scopes

Knowledge is organized by hierarchy to implement access control: `global` (visible to all projects) → `project:my-backend` (that project only) → `workspace:feat-auth` (that workspace only). Knowledge matching the current scope gets a 1.3x score boost; upper scopes are visible to lower ones (global is visible to all projects), but lower scopes are not visible to upper ones.

---

<NextSteps
  title="Next Steps"
  :steps="[
    { text: 'Architecture — the complete pipeline architecture and data flow', link: '/en/memx/architecture', primary: true },
    { text: 'Quickstart — experience MemX core features in 5 minutes', link: '/en/memx/quickstart' },
    { text: 'FAQ — answers to common questions during use', link: '/en/memx/faq' },
  ]"
/>

</div>

<style>
.memx-page .lurus-section-head {
  margin-top: 2.5rem;
}
.memx-page .cap-grid {
  margin: 1.5rem 0 2.25rem;
}
.memx-page .lurus-callout {
  margin: 1.25rem 0;
}
</style>
