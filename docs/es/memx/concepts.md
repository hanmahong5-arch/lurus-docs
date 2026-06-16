---
title: Conceptos centrales de MemX
description: "Los cuatro módulos centrales del motor ACE de MemX: destilación inteligente, deduplicación semántica, olvido por decaimiento y recuperación híbrida."
---

<div class="memx-page">

# Conceptos centrales

El motor ACE (Adaptive Context Engine) de MemX está compuesto por cuatro módulos centrales que operan de forma independiente y colaboran entre sí, logrando una gestión completa del ciclo de vida del conocimiento.

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="brain" :size="14" /> Motor ACE</span>
  <h2 class="lurus-section-head__title">Los cuatro módulos centrales</h2>
  <p class="lurus-section-head__lede">Destilación → deduplicación → decaimiento → recuperación, cubriendo el ciclo de vida completo del conocimiento.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-memx)"
  :items="[
    { title: 'Reflector · Destilación de conocimiento', body: 'El modo hybrid combina prefiltrado por reglas + refinamiento por LLM, con 5 reglas de detección, reduciendo en un 90%+ las llamadas frente al LLM completo.', icon: 'filter' },
    { title: 'Curator · Deduplicación semántica', body: 'Deduplicación en tres niveles por similitud de coseno: ≥0.8 fusiona, 0.5~0.8 marca conflicto, menos de 0.5 escribe de forma independiente.', icon: 'database-backup' },
    { title: 'Decay · Decaimiento temporal', body: 'Curva del olvido de Ebbinghaus, vida media de 30 días, refuerzo por recuperación + protección de memoria permanente en tres capas.', icon: 'timer' },
    { title: 'Generator · Recuperación híbrida', body: 'Búsqueda en cuatro capas L1~L4, fusión de palabra clave 0.6 + semántica 0.4, multiplicada luego por bonificaciones de decaimiento/recencia/ámbito.', icon: 'search' },
  ]"
/>

## <Term t="Reflector">Reflector</Term> — Motor de destilación de conocimiento

Reflector es la innovación más central de MemX: extracción inteligente de conocimiento a **costo extremadamente bajo**. Los sistemas de memoria de IA tradicionales dependen del LLM para extraer conocimiento de cada conversación, consumiendo de 2 a 5K tokens. Reflector usa por defecto el modo **hybrid**: prefiltrado por reglas + llamada al LLM para refinar solo los candidatos valiosos, reduciendo en un 90%+ el costo de llamadas frente al LLM completo.

### Tres modos de funcionamiento

| Modo | Descripción | Costo de LLM |
|------|------|---------|
| `rules` | Motor de reglas puro, basado completamente en coincidencia de patrones | Cero llamadas al LLM |
| `hybrid` (por defecto) | Prefiltrado por reglas + refinamiento por LLM, promediando las puntuaciones | Solo llama a los candidatos, reducción del 90%+ |
| `llm` | Depende completamente del LLM para extraer conocimiento | 2-5K tokens cada vez |

**Flujo de trabajo de hybrid**: conversación original → PatternDetector (detección por reglas) → elementos de conocimiento candidatos → evaluación + destilación por LLM (solo candidatos) → promedio entre la puntuación por reglas y la del LLM → KnowledgeScorer (clasificación por puntuación) → PrivacySanitizer (anonimización de privacidad) → BulletDistiller (compresión y refinamiento).

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Modo híbrido por defecto + degradación automática</p>
    <div class="lurus-callout__body"><p>Cuando el LLM no está disponible, cambia automáticamente al modo de reglas puro, sin llamadas ni costo.</p></div>
  </div>
</div>

### Cinco reglas de detección

| Regla | Lógica de detección | Confianza | Escenario típico |
|------|---------|--------|---------|
| ErrorFixRule | Identifica la estructura «error → solución» | 0.8 | "TypeError: ... → resulta que había que añadir una aserción de tipo" |
| RetrySuccessRule | Detecta la ruta de éxito tras varios intentos | 0.7 | "Probé A y B sin éxito, al final lo resolvió la opción C" |
| ConfigChangeRule | Coincide con modificaciones de configuración/variables de entorno | 0.6 | "Cambié MAX_POOL_SIZE de 10 a 50" |
| NewToolRule | Identifica herramientas/bibliotecas usadas por primera vez | 0.65 | "Usé pnpm por primera vez, es mucho más rápido que npm" |
| RepetitiveOpRule | Cuenta operaciones repetidas (se activa con ≥3 veces) | 0.5+ | "En cada despliegue hay que limpiar la caché manualmente" |

### Sistema de clasificación del conocimiento

Cada elemento de conocimiento se asigna automáticamente a dos dimensiones: **Section** (tema) y **KnowledgeType** (tipo):

- **8 Section**: `COMMANDS` · `DEBUGGING` · `ARCHITECTURE` · `WORKFLOW` · `TOOLS` · `PATTERNS` · `PREFERENCES` · `GENERAL`
- **5 KnowledgeType**: `METHOD` (metodología) · `TRICK` (truco) · `PITFALL` (escollo) · `PREFERENCE` (preferencia) · `KNOWLEDGE` (hecho)

### Instructivity Score

Cada elemento de conocimiento obtiene una **puntuación de valor didáctico** de 0 a 100, calculada combinando la confianza de la coincidencia de patrones + la concreción/operatividad + la presencia de una relación causal clara. Los candidatos por debajo de `min_score` (30 por defecto) se descartan.

## <Term t="Curator">Curator</Term> — Motor de deduplicación semántica

Curator procesa automáticamente duplicados y contradicciones en cada escritura.

### Estrategia de deduplicación en tres niveles

Nuevo conocimiento a escribir → calcula la similitud de coseno con el conocimiento existente: **≥ 0.8** fusiona automáticamente (keep_best o merge_content); **0.5~0.8** marca un posible conflicto a la espera de confirmación; **< 0.5** se considera conocimiento independiente y se escribe con normalidad.

**Estrategias de fusión**: `keep_best` (por defecto, conserva la versión con mayor instructivity_score) / `merge_content` (combina ambos contenidos para generar una versión más completa).

### Detección de conflictos

Escanea de forma proactiva memorias contradictorias (ejemplo: similitud 0.72 pero conclusiones opuestas — "basta con poner el pool de conexiones de Redis en 10" vs "al menos 50 para que sea estable", recomienda confirmar la mejor práctica y eliminar la versión obsoleta). Detección en cualquier momento desde la CLI: `memx conflicts`.

## <Term t="Decay">Decay</Term> — Motor de decaimiento temporal

Simula la curva natural del olvido de la memoria humana, asegurando que la base de conocimiento se mantenga siempre "fresca".

### Fórmula de decaimiento

```
base_weight = 2^(-age_days / half_life)
boosted     = base_weight × (1 + boost_factor × recall_count)
final       = clamp(boosted, 0.0, 1.0)
```

**Parámetros centrales**:

| Parámetro | Valor por defecto | Descripción |
|------|--------|------|
| `half_life` | 30 días | Días necesarios para que el peso decaiga al 50% |
| `boost_factor` | 0.1 | Coeficiente de bonificación de peso por cada recuperación |

**Ejemplo numérico** (half_life=30, boost_factor=0.1):

| Escenario | age_days | recall_count | base_weight | final |
|------|----------|-------------|-------------|-------|
| Recién escrito | 0 | 0 | 1.0 | **1.0** (periodo de protección) |
| 30 días sin uso | 30 | 0 | 0.5 | **0.5** |
| 60 días sin uso | 60 | 0 | 0.25 | **0.25** |
| 30 días, recuperado 5 veces | 30 | 5 | 0.5 | **0.75** |
| 90 días, recuperado 15 veces | 90 | 15 | 0.125 | **1.0** (recall>=15 activa la memoria permanente y omite la fórmula) |

### Mecanismo de protección en tres capas

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Protección en tres capas</p>
    <div class="lurus-callout__body"><ul><li><code>recall_count ≥ 15</code> → memoria permanente (weight fijo en 1.0)</li><li><code>age ≤ 7 días</code> → periodo de protección (weight fijo en 1.0)</li><li><code>weight &lt; 0.02</code> → candidato a archivado (se puede limpiar)</li></ul></div>
  </div>
</div>

Intuición: lo recién aprendido (en los últimos 7 días) se recuerda con claridad; lo que se recuerda con frecuencia se afianza cada vez más; al usarse más de 15 veces se convierte en "memoria muscular"; lo que no se usa por mucho tiempo se va olvidando.

### Impacto del decaimiento en la recuperación

El peso de decaimiento participa directamente en la puntuación final del ordenamiento de la recuperación:

```
Final Score = Blended Search Score × DecayWeight × RecencyBoost × ScopeBoost
```

- `RecencyBoost`: el conocimiento creado en los últimos 7 días obtiene una bonificación de 1.2x
- `ScopeBoost`: el conocimiento que coincide con el ámbito actual obtiene una bonificación de 1.3x

## Generator — Motor de recuperación híbrida

Supera las limitaciones de la <Term t="Vector Search">búsqueda vectorial</Term> pura, con una búsqueda en cuatro capas que cubre el espectro completo desde la coincidencia exacta hasta la comprensión semántica.

### Arquitectura de búsqueda en cuatro capas

| Capa | Motor | Método de coincidencia | Escenario ventajoso |
|------|------|---------|---------|
| L1 | ExactMatcher | Coincidencia exacta de palabras | "pytest -v", nombres de API |
| L2 | FuzzyMatcher | Coincidencia difusa de tokens | Variantes ortográficas, cambios morfológicos |
| L3 | MetadataMatcher | Similitud de Jaccard de tools / entities / tags | "conocimiento sobre Redis" |
| L4 | VectorSearcher | Búsqueda semántica por embeddings vectoriales | "cómo mejorar el rendimiento de las pruebas" |

### Fórmula de fusión de puntuaciones

```
NormKeyword = (L1 + L2 + L3) / 35.0        # 归一化到 [0, 1]
Blended     = NormKeyword × 0.6 + Semantic × 0.4
Final       = Blended × DecayWeight × RecencyBoost × ScopeBoost
```

El peso de la búsqueda por palabra clave (0.6) es mayor que el de la búsqueda semántica (0.4), asegurando que los resultados de coincidencia exacta se muestren primero.

**Ejemplo numérico**: consulta "pytest timeout", cálculo de la puntuación de una memoria:
- L1 (exacta)=8, L2 (difusa)=5, L3 (metadatos)=3 → NormKeyword = (8+5+3)/35 = 0.457
- L4 (semántica) = 0.72
- Blended = 0.457×0.6 + 0.72×0.4 = 0.562
- DecayWeight=0.89, RecencyBoost=1.0, ScopeBoost=1.3
- **Final = 0.562 × 0.89 × 1.0 × 1.3 = 0.650**

### Degradación elegante

Cuando la búsqueda vectorial L4 no está disponible (fallo al cargar el modelo de embeddings), se degrada automáticamente al modo de solo palabra clave (`keyword_weight=1.0, semantic_weight=0.0`). El fallo de cualquier capa de búsqueda individual no interrumpe el servicio.

## Gestión del presupuesto de tokens

Los resultados de la recuperación tienen una doble restricción: `max_results` (número máximo de resultados devueltos, 5 por defecto) + `token_budget` (presupuesto máximo de tokens, 2000 por defecto).

**Conciencia de CJK** (asegura que el chino no se recorte en exceso por una estimación errónea de tokens): caracteres CJK 1.5 caracteres/token; caracteres latinos 4.0 caracteres/token.

## Ámbitos jerárquicos

El conocimiento se organiza por jerarquía para implementar el control de acceso: `global` (visible para todos los proyectos) → `project:my-backend` (solo ese proyecto) → `workspace:feat-auth` (solo ese espacio de trabajo). El conocimiento que coincide con el scope actual obtiene una bonificación de puntuación de 1.3x; el scope superior es visible para los inferiores (global para todos los proyectos), pero los inferiores no son visibles para los superiores.

---

<NextSteps
  title="Próximos pasos"
  :steps="[
    { text: 'Diseño de arquitectura — Arquitectura completa de la canalización y flujo de datos', link: '/es/memx/architecture', primary: true },
    { text: 'Inicio rápido — Experimenta las funciones centrales de MemX en 5 minutos', link: '/es/memx/quickstart' },
    { text: 'Preguntas frecuentes — Respuestas a las dudas habituales de uso', link: '/es/memx/faq' },
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
