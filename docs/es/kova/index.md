---
title: Kova — Motor de ejecución persistente para agentes de IA
description: Arquitectura WAL-First construida en Rust, recuperación automática tras fallos, planificación a escala de microsegundos, cero dependencias externas.
---

<div class="kova-page">

<ProductHero product-id="kova" />

<MetricStats :items="[
  { label: 'Planificación FIFO', value: '3.17μs', hint: 'Pipeline completo en Criterion' },
  { label: 'Rendimiento', value: '315K ops/s' },
  { label: 'Líneas de código', value: '178K LOC', hint: 'Workspace de 21 crates' },
  { label: 'Dependencias externas', value: 'Cero', hint: 'Sin Redis / Postgres' },
]" />

## ¿Qué es Kova?

**Kova** es la infraestructura central de agentes de IA de Lurus, un motor de ejecución persistente de alto rendimiento construido en Rust, que resuelve **cómo los agentes pueden ejecutarse de forma fiable durante largos periodos, recuperar su estado tras un fallo y coordinar flujos de trabajo complejos**. Los frameworks tradicionales (LangChain, CrewAI) se ejecutan en memoria y pierden el estado al salir el proceso; Kova adopta una arquitectura con prioridad de <Term t="WAL">WAL (Write-Ahead Log)</Term>: cada paso de ejecución persiste un registro, de modo que incluso ante un fallo puede recuperarse con precisión hasta el punto de interrupción, sin volver a invocar al LLM, sin perder progreso y sin generar costes adicionales.

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="database-backup" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Métricas clave</p>
    <div class="lurus-callout__body">Latencia del pipeline completo <Term t="FIFO">FIFO</Term> de <strong>3.17μs</strong> (benchmark de Criterion, véase <code>docs/benchmark-report.md</code>), rendimiento de <strong>315K ops/s</strong> y <strong>cero dependencias de servicios externos</strong>.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> Capacidades clave</span>
  <h2 class="lurus-section-head__title">Por qué elegir Kova</h2>
  <p class="lurus-section-head__lede">Persistencia WAL-First, planificación a escala de microsegundos, despliegue sin dependencias y cuatro formas de integración.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-kova)"
  :items="[
    { title: 'Recuperación ante fallos con WAL', body: 'Registro de escritura anticipada en cada paso + verificación CRC32; tras un fallo, reproduce desde el punto de interrupción sin volver a invocar al LLM', icon: 'database-backup' },
    { title: 'Latencia de planificación de 3μs', body: 'Pipeline completo FIFO con benchmark de Criterion de 3.17μs y rendimiento de 315K ops/s', icon: 'gauge' },
    { title: 'Cero dependencias externas', body: 'No necesita Redis / Postgres; funciona con solo el archivo WAL local', icon: 'package' },
    { title: 'Cuatro formas de integración', body: 'SDK de Rust / gRPC / REST / MCP, modular con 21 crates de workspace', icon: 'puzzle' },
  ]"
/>

### Persistencia WAL-First

Todos los cambios de estado escriben primero en el WAL antes de ejecutarse, y ante un fallo se reproducen desde el WAL:

<ol class="lurus-steps">
<li>

**Decisión del agente** — el motor determina la siguiente acción

</li>
<li>

**Escritura en el WAL (CRC32)** — registro persistente + suma de verificación contra la corrupción

</li>
<li>

**Ejecución** — invocación real de la herramienta / LLM

</li>
<li>

**Confirmación de finalización** — marca el paso como consolidado; ante un fallo, los pasos sin confirmar se reproducen automáticamente

</li>
</ol>

La verificación CRC32 previene la corrupción; el búfer circular de potencia de 2 aprovecha el almacenamiento de forma eficiente; y el orden de bloqueo **Buffer → Queue → Txn**, garantizado de forma estricta, elimina por completo los interbloqueos.

### Orquestación de agentes

| Modo | Descripción | Casos de uso |
|------|------|---------|
| **Agente único** | Ejecuta tareas de forma independiente | Automatización simple |
| **Flujo de trabajo** | Ejecución ordenada en múltiples pasos | Pipelines de datos, flujos de aprobación |
| **Inteligencia de enjambre (Swarm)** | Colaboración autónoma entre múltiples agentes | Investigación compleja, simulación de múltiples roles |

### Ecosistema de herramientas y multimodelo

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="puzzle" :size="20" /></span>
    <div class="lurus-card__title">Ecosistema de herramientas</div>
    <p class="lurus-card__body">Herramientas integradas (archivos / HTTP / base de datos / Shell), <Term t="MCP">MCP</Term> (conecta cualquier servicio de herramientas compatible con MCP, véase el <a href="/integrations/">directorio de integraciones</a>), <Term t="A2A">A2A</Term> (comunicación directa entre agentes y delegación de tareas) y herramientas personalizadas (extensión mediante Rust o REST API).</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="layers" :size="20" /></span>
    <div class="lurus-card__title">Soporte multimodelo</div>
    <p class="lurus-card__body">A través de <a href="/es/guide/introduction">Lurus API</a> se integran todos los principales LLM (DeepSeek para el día a día / GPT-4o para razonamiento / Claude para textos largos / Gemini para multimodal), cambiando dinámicamente en tiempo de ejecución según la tarea.</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="network" :size="14" /> Arquitectura</span>
  <h2 class="lurus-section-head__title">Visión general de la arquitectura</h2>
  <p class="lurus-section-head__lede">Integración por REST/SDK/gRPC/MCP · planificación en Kova Core · persistencia y recuperación con WAL.</p>
</div>

<ArchitectureDiagram
  title="Arquitectura de ejecución de Kova"
  chart="graph LR
  A[Client SDK / gRPC / REST] --> B[Kova Core]
  B --> C[WAL Writer<br/>CRC32]
  B --> D[Scheduler<br/>FIFO]
  B --> E[Tool Runtime<br/>MCP]
  C -.recover.-> B
  D --> F[LLM Provider<br/>via Lurus API]"
/>

```
Kova REST API (Axum: 35+ endpoints, WebSocket)
 → Kova Core: Agent Engine(单/多 Agent) + Workflow(有序编排)
              → WAL + Ring Buffer(持久化状态管理 CRC32)
              子 crate: kova-llm / kova-tools / kova-mcp
```

Kova es un workspace de **21 crates de Rust**, con **178.284 líneas de código**, **más de 1.565 pruebas** (concurrencia con loom / proptest / chaos) y **4 objetivos de fuzz**. Actualmente en **prelanzamiento v0.2.0** (rumbo a 1.0.0-beta.1), con lints estrictos plenamente activados (`#[deny(clippy::unwrap_used, clippy::panic, missing_docs)]`).

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="briefcase" :size="14" /> Escenarios</span>
  <h2 class="lurus-section-head__title">Casos de uso</h2>
</div>

| Escenario | La ventaja de Kova |
|------|-----------|
| **Agentes de larga ejecución** | Persistencia con WAL, recuperación automática tras un fallo |
| **Flujos de trabajo complejos** | Orquestación de múltiples pasos, ramificación condicional, ejecución en paralelo |
| **Colaboración entre múltiples agentes** | Modo Swarm, comunicación directa entre agentes |
| **Despliegue de nivel empresarial** | Rendimiento de Rust, bajo consumo de recursos, sin pausas de GC |
| **Integración de herramientas MCP** | Soporte nativo de Model Context Protocol |
| **Escenarios sensibles a la seguridad** | Cifrado opcional (SM4/AES), verificación de integridad del WAL con HMAC |

<UserScenarios
  title="Empieza según tu rol"
  :scenarios="[
    { role: 'Desarrollador', title: 'Pon en marcha un agente persistente en 5 minutos', summary: 'cargo add kova + 3 líneas de código', link: '/es/kova/quickstart' },
    { role: 'Arquitecto', title: 'Reemplaza el Checkpointer de LangGraph', summary: 'Usa Kova para guardar checkpoints en tu proyecto de LangGraph', link: '/tutorials/lumen-kova-langgraph' },
  ]"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Comparativa</span>
  <h2 class="lurus-section-head__title">Comparación con otros frameworks de agentes</h2>
</div>

| Capacidad | LangChain | CrewAI | AutoGen | **Kova** |
|------|-----------|--------|---------|----------|
| Lenguaje | Python | Python | Python | **Rust** |
| Persistencia de estado | Ninguna (requiere externa) | Ninguna | Ninguna | **WAL-First** |
| Recuperación ante fallos | Ninguna | Ninguna | Ninguna | **Recuperación automática** |
| Rendimiento | Medio | Medio | Medio | **Muy alto** |
| Eficiencia de memoria | Baja | Baja | Baja | **Muy alta** |
| Soporte de MCP | De terceros | Ninguno | Ninguno | **Nativo** |
| Protocolo A2A | Ninguno | Ninguno | Ninguno | **Nativo** |
| Capacidad de cifrado | Ninguna | Ninguna | Ninguna | **SM4-GCM / ChaCha20** |
| Multiprotocolo | Ninguno | Ninguno | Ninguno | **Cuatro formas de integración: SDK de Rust / gRPC / REST / MCP** |
| Forma de despliegue | Proceso Python | Proceso Python | Proceso Python | **Binario único / contenedor / biblioteca embebida** |

---

## Siguientes pasos

<NextSteps
  :steps="[
    { text: 'Inicio rápido — pon en marcha tu primer agente de Kova', link: '/es/kova/quickstart', primary: true },
    { text: 'Conceptos básicos — comprende a fondo WAL, Agent y Workflow', link: '/es/kova/concepts' },
    { text: 'Referencia de API — documentación completa de la REST API', link: '/es/kova/api' },
    { text: 'Directorio de integraciones y MCP', link: '/integrations/' },
  ]"
/>

<!-- lurus:related-block -->

<RelatedProducts product-id="kova" />

</div>

<style>
.kova-page .lurus-card--kova .lurus-card__body a {
  color: var(--lurus-color-kova);
  font-weight: 600;
}
</style>
