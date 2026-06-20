---
title: "Centro de tutoriales multiproducto"
description: "Tutoriales integrales que conectan varios productos de Lurus, agrupados por rol."
---

<div class="tut-hub">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="graduation-cap" :size="14" /> Tutoriales multiproducto</span>
  <h1 class="lurus-section-head__title">Centro de tutoriales multiproducto</h1>
  <p class="lurus-section-head__lede">La guía de inicio rápido de cada producto individual está en su propia documentación. Aquí encontrarás <strong>casos de combinación entre productos</strong>: combinar MemX + Kova + API, Lumen + LangGraph y más para resolver problemas reales de ingeniería.</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">4</span><span class="lurus-stat__label">tutoriales integrales</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">5+</span><span class="lurus-stat__label">productos combinados</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">2</span><span class="lurus-stat__label">rutas por rol</span></div>
</div>

## <Icon name="users" :size="20" /> Por rol

<div class="action-grid">
  <ActionCard
    name="Desarrollador de Agentes"
    tagline="Añade memoria al Agente · recuperación ante caídas · depuración con Replay"
    icon="bot"
    color="var(--lurus-color-kova)"
    :actions="[
      { label: 'Agente con memoria', href: '/es/tutorials/memory-agent', primary: true },
      { label: 'Lumen × LangGraph × Kova', href: '/es/tutorials/lumen-kova-langgraph' },
    ]"
  />
  <ActionCard
    name="Trading cuantitativo"
    tagline="El ciclo completo, de la estrategia en lenguaje natural a su publicación en el mercado de estrategias"
    icon="trending-up"
    color="var(--lurus-color-lucrum)"
    :actions="[
      { label: 'Flujo completo de estrategia de Lucrum', href: '/es/tutorials/lucrum-strategy-workflow', primary: true },
    ]"
  />
</div>

## <Icon name="layers" :size="20" /> Por tema

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--memx" href="/es/tutorials/memory-agent">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">Memoria + Agente</div>
    <p class="lurus-card__body">Memoria a largo plazo de MemX + recuperación ante caídas de Kova + llamadas a la Lurus API para montar un servicio de atención que recuerda al usuario.</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="/es/tutorials/lumen-kova-langgraph">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Observabilidad</div>
    <p class="lurus-card__body">Sustituye el Checkpointer predeterminado de LangGraph por Lumen, despliega en Kova y compara el comportamiento de recuperación ante caídas.</p>
  </a>
  <a class="lurus-card lurus-card--lucrum" href="/es/tutorials/lucrum-strategy-workflow">
    <span class="lurus-card__icon"><Icon name="trending-up" :size="20" /></span>
    <div class="lurus-card__title">Ciclo cuantitativo</div>
    <p class="lurus-card__body">Describe la estrategia en lenguaje natural → la IA genera código vnpy → backtesting → optimización → publicación en el mercado de estrategias.</p>
  </a>
  <a class="lurus-card lurus-card--switch" href="/es/tutorials/switch-mcp-team">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Unificación de herramientas del equipo</div>
    <p class="lurus-card__body">Switch reúne la configuración MCP de las CLI de IA del equipo, las Key de modelos y el panel de costes en una única configuración central.</p>
  </a>
</div>

## <Icon name="workflow" :size="20" /> Ruta recomendada

<ol class="lurus-steps">
<li>

Empieza por la guía de inicio rápido de cada producto individual (comienza por [Lurus API](/es/guide/quickstart))

</li>
<li>

Después revisa un tutorial multiproducto de esta sección que se ajuste a tu caso de negocio

</li>
<li>

Por último, sustituye tu stack actual siguiendo la [guía de migración](/es/migrations/)

</li>
</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Combinar es capitalizar</p>
    <div class="lurus-callout__body"><p>Cada tutorial solo usa capacidades que ya existen en la documentación de cada producto. Primero pon en marcha cada producto por separado y luego conéctalos siguiendo el tutorial: la cuenta, la facturación y los modelos comparten un mismo pool, sin necesidad de integrarlos de nuevo.</p></div>
  </div>
</div>

## Siguientes pasos

<NextSteps :steps="[
  { text: 'Agente con memoria', link: '/es/tutorials/memory-agent', primary: true },
  { text: 'Guía de migración', link: '/es/migrations/' },
  { text: 'Soluciones para empresas', link: '/es/solutions/' },
]" />

</div>
