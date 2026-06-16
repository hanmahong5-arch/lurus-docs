---
title: MemX — Motor de memoria adaptativa para IA
description: Motor de memoria para IA construido sobre ACE v2.0, con destilación inteligente, olvido biomimético y protección de privacidad de extremo a extremo.
---

<div class="memx-page">

<ProductHero product-id="memx" />

## ¿Qué es MemX?

**MemX** es el motor de memoria adaptativa para IA de Lurus, construido sobre **<Term t="ACE">ACE (Adaptive Context Engine)</Term>v2.0**. Proporciona a los agentes de IA una gestión completa del ciclo de vida del conocimiento: **<Term t="Knowledge Distillation">destilación inteligente</Term> → <Term t="Semantic Dedup">deduplicación semántica</Term> → olvido por decaimiento → recuperación híbrida**, dotando a la IA de una verdadera "memoria" similar a la humana.

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="brain" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Tres ventajas clave</p>
    <div class="lurus-callout__body"><ul><li><strong>Modo híbrido por defecto + degradación automática</strong> — cuando el LLM no está disponible, conmuta a reglas puras: cero llamadas, cero coste.</li><li><strong>Curva de olvido biomimética</strong> — decaimiento exponencial de Ebbinghaus, vida media de 30 días por defecto; los elementos muy recuperados ascienden a memoria permanente.</li><li><strong>Protección de privacidad de extremo a extremo</strong> — la información sensible nunca entra en la base de datos vectorial.</li></ul></div>
  </div>
</div>

<MetricStats :items="[
  { label: 'Reglas de filtrado de PII', value: '12 reglas', hint: 'no evitables' },
  { label: 'Recuperación híbrida', value: '4 capas', hint: 'fusión ponderada L1→L4' },
  { label: 'Vida media de decaimiento', value: '30 días', hint: 'por defecto, configurable' },
  { label: 'Formato de entrega', value: 'Python · REST · MCP' },
]" />

## Características principales

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="sparkles" :size="14" /> Cuatro módulos</span>
  <h2 class="lurus-section-head__title">De la conversación a la memoria recuperable</h2>
  <p class="lurus-section-head__lede">Para el detalle de reglas, fórmulas y parámetros, consulta <a href="/es/memx/concepts">Conceptos básicos</a> y <a href="/es/memx/architecture">Diseño de arquitectura</a>.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-memx)"
  :items="[
    { title: 'Destilación inteligente de conocimiento (Reflector)', body: 'El modo hybrid (precribado por reglas + refinamiento con LLM) identifica 5 patrones de conocimiento: corrección de errores / reintento exitoso / cambio de configuración / uso de una nueva herramienta / operación repetida, con una puntuación de 0-100 por entrada para filtrar el ruido de baja puntuación.', icon: 'filter' },
    { title: 'Deduplicación semántica y detección de conflictos (Curator)', body: 'Similitud del coseno ≥0,8 fusiona automáticamente, 0,5-0,8 marca posibles conflictos, por debajo de 0,5 se considera conocimiento independiente.', icon: 'git-merge' },
    { title: 'Decaimiento biomimético de la memoria', body: 'Periodo de protección de 7 días + decaimiento exponencial + refuerzo por recuperación; recuperado más de 15 veces, asciende a memoria permanente y deja de decaer.', icon: 'timer' },
    { title: 'Recuperación híbrida de cuatro capas', body: 'L1 exacta → L2 difusa → L3 metadatos → L4 vectorial; tras la fusión ponderada de ScoreMerger se multiplica por DecayWeight × RecencyBoost × ScopeBoost, y la capa vectorial degrada automáticamente si no está disponible.', icon: 'search' },
    { title: 'Diseño con la privacidad por delante', body: '12 reglas integradas de filtrado de información sensible (claves / Token / cadenas de conexión a bases de datos / rutas locales / regex personalizadas) que interceptan automáticamente antes de la escritura.', icon: 'shield-check' },
  ]"
/>

## Visión general de la arquitectura

El conocimiento fluye desde la conversación y pasa sucesivamente por destilación, filtrado de privacidad y deduplicación, hasta caer en los almacenes vectorial y de metadatos; las solicitudes de recuperación recorren el pipeline híbrido de cuatro capas, y el motor de decaimiento mantiene de forma continua la actividad de la memoria en segundo plano.

<ArchitectureDiagram
  title="Flujo de datos del motor ACE"
  chart="graph TB
  Input[Flujo de conversación] --> Reflector[Reflector destilación de conocimiento]
  Reflector --> PII[Filtrado de PII 12 reglas]
  PII --> Curator[Curator deduplicación semántica]
  Curator --> Store[(Vectorial + metadatos)]
  Store --> Decay[Decay Engine Ebbinghaus]
  Query[Solicitud de recuperación] --> Hybrid[Recuperación híbrida de cuatro capas]
  Hybrid --> Store"
/>

## Casos de uso

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
    <div class="lurus-card__title">Asistente de programación</div>
    <p class="lurus-card__body">Recuerda tus hábitos de código, los escollos que has encontrado y las convenciones del proyecto.</p>
  </div>
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="life-buoy" :size="20" /></span>
    <div class="lurus-card__title">Sistema de atención al cliente</div>
    <p class="lurus-card__body">Acumula el conocimiento del historial de interacciones del cliente para ofrecer un servicio personalizado.</p>
  </div>
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="book-open" :size="20" /></span>
    <div class="lurus-card__title">Base de conocimiento personal</div>
    <p class="lurus-card__body">Extrae y organiza conocimiento automáticamente a partir de las conversaciones diarias.</p>
  </div>
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="users" :size="20" /></span>
    <div class="lurus-card__title">Colaboración en equipo</div>
    <p class="lurus-card__body">Comparte la memoria a nivel de equipo para que los nuevos miembros obtengan rápidamente el contexto.</p>
  </div>
</div>

## Comparación con los sistemas de memoria tradicionales

<ComparisonTable
  self-label="MemX (ACE)"
  :competitors="['Solución tradicional (mem0)']"
  title="Por qué no es otra base de datos vectorial más"
  :rows="[
    { dimension: 'Extracción de conocimiento', self: 'motor híbrido hybrid (precribado por reglas + refinamiento con LLM, reduce más del 90 % de las llamadas)', alt: { 'Solución tradicional (mem0)': 'LLM (2-5K tokens cada vez)' } },
    { dimension: 'Deduplicación', self: 'fusión automática por similitud del coseno', alt: { 'Solución tradicional (mem0)': 'evaluación del LLM entrada por entrada' } },
    { dimension: 'Olvido', self: 'decaimiento exponencial + refuerzo por recuperación', alt: { 'Solución tradicional (mem0)': 'almacenamiento permanente, sin descarte posible' } },
    { dimension: 'Búsqueda', self: 'búsqueda híbrida de cuatro capas', alt: { 'Solución tradicional (mem0)': 'solo búsqueda vectorial' } },
    { dimension: 'Privacidad', self: '12 reglas integradas de filtrado de información sensible', alt: { 'Solución tradicional (mem0)': 'sin protección integrada' } },
    { dimension: 'Ámbito', self: 'jerárquico (global / project / workspace)', alt: { 'Solución tradicional (mem0)': 'plano (user / agent)' } },
    { dimension: 'Gestión de Token', self: 'recorte de presupuesto integrado (con detección de CJK)', alt: { 'Solución tradicional (mem0)': 'gestión a cargo del invocador' } },
    { dimension: 'Embeddings locales', self: 'inferencia local ONNX, totalmente sin conexión', alt: { 'Solución tradicional (mem0)': 'requiere API' } },
  ]"
/>

## Siguientes pasos

<NextSteps
  :steps="[
    { text: 'Inicio rápido — experimenta las funciones principales en 5 minutos', link: '/es/memx/quickstart', primary: true },
    { text: 'Conceptos básicos — profundiza en los principios de diseño del motor ACE', link: '/es/memx/concepts' },
    { text: 'Diseño de arquitectura — arquitectura completa del sistema', link: '/es/memx/architecture' },
    { text: 'Integraciones y catálogo MCP', link: '/integrations/' },
    { text: 'Preguntas frecuentes', link: '/es/memx/faq' },
  ]"
/>

<!-- lurus:related-block -->

## Productos relacionados y siguientes pasos

<RelatedProducts product-id="memx" />

</div>

<style>
.memx-page .lurus-callout {
  margin: 20px 0;
}
.memx-page .lurus-section-head {
  margin-top: 8px;
}
</style>
