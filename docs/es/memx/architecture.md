---
title: Diseño de arquitectura de MemX
description: Explicación detallada de la arquitectura de canalización de MemX, incluyendo la canalización de escritura, la canalización de recuperación y el diseño de degradación independiente por componente.
---

<div class="memx-page">

# Diseño de arquitectura

MemX adopta una arquitectura de canalización (Pipeline), donde la escritura y la recuperación se orquestan mediante canalizaciones independientes, y todos los componentes admiten fallos independientes y degradación elegante.

<MetricStats
  :items="[
    { label: 'Memory API', value: '5 métodos', hint: 'add / search / status / detect_conflicts / export' },
    { label: 'Canalizaciones principales', value: '2', hint: 'Ingest (escritura) + Retrieval (recuperación)' },
    { label: 'Degradación', value: 'Por componente', hint: 'El fallo de un solo componente no interrumpe el servicio' },
  ]"
/>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="network" :size="14" /> Topología</span>
  <h2 class="lurus-section-head__title">Visión general del sistema</h2>
  <p class="lurus-section-head__lede">Dos canalizaciones independientes que convergen en el Decay Engine y el almacén de vectores.</p>
</div>

<ArchitectureDiagram title="Arquitectura de canalización de MemX" chart="graph TB
  API[Memory API<br/>add / search / status / detect_conflicts / export]
  API --> Ingest[IngestPipeline escritura]
  API --> Retrieval[RetrievalPipeline recuperación]
  Ingest --> I1[Privacy Sanitizer] --> I2[Reflector] --> I3[Curator] --> I4[mem0.add]
  Retrieval --> R1[Generator L1-L4] --> R2[ScoreMerger] --> R3[TokenBudgetTrimmer] --> R4[RecallReinforcer]
  I4 --> Decay[Decay Engine<br/>cálculo de decaimiento asíncrono]
  R4 --> Decay
  Decay --> Store[(Vector Store<br/>mem0 Backend)]" />

## Canalización de escritura — IngestPipeline

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">La pasarela de privacidad no se puede eludir</p>
    <div class="lurus-callout__body"><p>Privacy Sanitizer es la primera estación de la canalización y no se puede omitir; 12 reglas integradas de información sensible completan el bloqueo antes de que los datos se escriban en el almacén de vectores, y el sanitizador nunca lanza excepciones.</p></div>
  </div>
</div>

`Raw Input` pasa sucesivamente por:

1. **Privacy Sanitizer** (no se puede eludir) — 12 reglas integradas de información sensible + expresiones regulares personalizadas; el sanitizador nunca lanza excepciones.
2. **Reflector** — modo hybrid (precribado por reglas + refinamiento por LLM): PatternDetector (detección de 5 tipos de patrones) → KnowledgeScorer (puntuación + clasificación) → PrivacySanitizer (anonimización del conocimiento candidato) → BulletDistiller (compresión en entradas refinadas). En caso de fallo, recurre al `add` original.
3. **Curator** — deduplicación por similitud de coseno: ≥0.8 fusión (merge_content/keep_best), 0.5-0.8 marcado como posible conflicto, <0.5 el conocimiento independiente pasa. En caso de fallo, omite la deduplicación y escribe directamente.
4. **BulletFactory** — conversión de formato de metadatos → `mem0.add()` para persistir en la base de datos vectorial.

### Rutas de degradación de la canalización de escritura

Cada etapa cuenta con su propio manejo de errores independiente:

| Etapa | Comportamiento ante fallo | Impacto en los datos |
|------|---------|---------|
| Privacy Sanitizer | Nunca falla (try-catch interno) | Los datos originales pasan |
| Reflector | Recurre al `mem0.add()` original | El conocimiento se almacena directamente sin refinamiento |
| Curator | Omite la deduplicación | Pueden generarse entradas duplicadas |
| mem0.add | Lanza una excepción | Fallo de escritura |

## Canalización de recuperación — RetrievalPipeline

`Query` pasa sucesivamente por:

1. **Generator Engine** — L1 ExactMatcher (coincidencia exacta de palabras) / L2 FuzzyMatcher (token difuso) / L3 MetadataMatcher (Jaccard de metadatos) / L4 VectorSearcher (semántica vectorial). Fallo de L4 → modo de solo palabras clave.
2. **ScoreMerger** (fusión ponderada): `NormKW = (L1+L2+L3)/35`; `Blended = KW×0.6 + S×0.4`; `Final = Blended×Decay×Recency×Scope`.
3. **TokenBudgetTrimmer** (doble restricción): `max_results=5` + `token_budget=2000`, estimación de tokens consciente de CJK.
4. Devuelve los resultados al llamador y, de forma asíncrona, **RecallReinforcer** incrementa el `recall_count` de las memorias acertadas (sin bloquear la respuesta de la búsqueda).

## Modelo de datos

Los metadatos completos que lleva cada memoria (Bullet):

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

## Embeddings locales

MemX usa ONNX Runtime para ejecutar el modelo de embeddings de forma local, sin necesidad de API externas, completamente sin conexión y sin fuga de privacidad: modelo all-MiniLM-L6-v2, dimensión 384, almacenamiento en `~/.memx/models/`, primera descarga de aproximadamente 90MB, inferencia < 5ms por entrada.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">all-MiniLM-L6-v2</span><span class="lurus-stat__label">Modelo de embeddings</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">384</span><span class="lurus-stat__label">Dimensión del vector</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">~90MB</span><span class="lurus-stat__label">Primera descarga</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">&lt;5ms</span><span class="lurus-stat__label">Inferencia por entrada</span></div>
</div>

## Modo demonio

Demonio en segundo plano opcional; múltiples agentes/múltiples procesos (Agent A/B/C) comparten el mismo Vector Store a través del **MemX Daemon (IPC Socket)**. La comunicación por IPC Socket evita la contención de conexiones a la base de datos; se cierra automáticamente tras un tiempo de inactividad (300 segundos por defecto); es adecuado para complementos de IDE, múltiples ventanas, etc.

<ArchitectureDiagram title="Topología compartida del demonio" chart="graph LR
  A[Agent A] --> D[MemX Daemon<br/>IPC Socket]
  B[Agent B] --> D
  C[Agent C] --> D
  D --> S[(Vector Store compartido)]" />

## Referencia de configuración

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
  title="Próximos pasos"
  :steps="[
    { text: 'Conceptos básicos — Comprende en profundidad los cuatro módulos principales del motor ACE', link: '/es/memx/concepts', primary: true },
    { text: 'Inicio rápido — Prueba las funciones principales de MemX en 5 minutos', link: '/es/memx/quickstart' },
    { text: 'Preguntas frecuentes — Respuestas a las dudas comunes durante el uso', link: '/es/memx/faq' },
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
