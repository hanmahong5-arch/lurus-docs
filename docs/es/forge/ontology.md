---
title: "Forge — Ontología"
description: "Gestiona las historias de usuario, la arquitectura, el stack tecnológico y las especificaciones de diseño de un producto con una estructura en árbol."
---

<div class="forge-ont-page">

# Ontología <StatusBadge status="beta" />

La Ontología es el primer modelo de datos central de Forge: describe todo el "conocimiento" de un producto con una estructura en árbol, permitiendo que los Agentes de IA y las personas colaboren sobre la misma estructura visual. Unifica las historias de usuario dispersas (Jira/Feishu/chats), la arquitectura y la implementación separadas, los ajustes no registrados del stack tecnológico y las especificaciones de diseño fragmentadas en un único árbol de conocimiento **trazable, reversible y escribible por Agentes**.

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="network" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">En una frase</p>
    <div class="lurus-callout__body">La Ontología es conocimiento estructurado <strong>estático</strong>; la <a href="/es/forge/sessions">Session</a> es una línea de tiempo <strong>dinámica</strong>. Las decisiones tomadas en una Session se escriben en / modifican los nodos de la Ontología.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Modelo de datos</span>
  <h2 class="lurus-section-head__title">Tipos de nodo</h2>
  <p class="lurus-section-head__lede">Seis tipos de nodos describen en paralelo distintas dimensiones del conocimiento del producto.</p>
</div>

| Tipo | Significado | Hoja típica |
|------|------|---------|
| `UserStory` | Historia de usuario | "Como X quiero Y para Z" |
| `Architecture` | Decisión de arquitectura | "Adoptamos un enfoque orientado a eventos, porque…" |
| `TechStack` | Stack tecnológico | "Backend Go + Gin + PG" |
| `DesignSpec` | Especificación de diseño | "Botones con radio de 8px, color primario #C67B5C" |
| `Decision` | Decisión puntual | "Descartar Redis Streams, cambiar a NATS" |
| `Risk` | Elemento de riesgo | "Limitación de tasa 429 de la API de terceros" |

## Estructura en árbol

```
产品: Lurus Forge
├─ UserStory
│  ├─ PM 创建需求
│  ├─ Architect 设计方案
│  └─ Dev 实现并提 PR
├─ Architecture
│  ├─ Ontology + Session 双核心
│  └─ WAL 决策回溯（依赖 Kova）
├─ TechStack
│  ├─ Elixir/Phoenix + LiveView
│  └─ PostgreSQL + ltree
└─ DesignSpec
   └─ Lurus 铜棕视觉系统
```

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bot" :size="14" /> Modo de colaboración</span>
  <h2 class="lurus-section-head__title">Escritura automática por Agentes · Visualización · Exportación</h2>
</div>

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Escritura automática por Agentes</div>
    <p class="lurus-card__body">Cuando el Agente PM genera historias de usuario en una <a href="/es/forge/sessions">Session</a>, los nodos se crean automáticamente en la Ontología; cuando el Agente Architect toma una decisión de arquitectura, la escribe en el subárbol <code>Architecture</code> y la vincula con la Story correspondiente.</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Visualización</div>
    <p class="lurus-card__body">El frontend web lo muestra con un árbol plegable + tarjetas de nodo; cada nodo incluye: creador (persona / Agente), Session asociada, revisiones anteriores y estado (borrador / en revisión / finalizado).</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="import" :size="20" /></span>
    <div class="lurus-card__title">Exportación</div>
    <p class="lurus-card__body">Exporta el árbol completo como JSON, o como GraphML para importarlo en yEd / Gephi y hacer análisis de grafos (ver los comandos más abajo).</p>
  </div>
</div>

### Comandos de exportación

```bash
forge export --ontology json     # 整棵树 → JSON
forge export --ontology graphml  # 可导入 yEd / Gephi
```

---

## Próximos pasos

<NextSteps :steps="[
  { text: 'Flujo de trabajo de Session', link: '/es/forge/sessions', primary: true },
  { text: 'Hoja de ruta', link: '/es/forge/roadmap' },
  { text: 'Volver a la introducción de Forge', link: '/es/forge/' },
]" />

</div>
