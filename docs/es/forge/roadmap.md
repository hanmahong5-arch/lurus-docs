---
title: "Forge — Hoja de ruta y solicitud de beta privada"
description: "Capacidades actuales en beta, el Dependency Guardian / visualización de Agentes / base de conocimiento planificados, y cómo solicitar la beta privada."
---

<div class="forge-rm-page">

# Hoja de ruta de Forge <StatusBadge status="beta" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="check-circle" :size="14" /> Disponible</span>
  <h2 class="lurus-section-head__title">Capacidades actuales en Beta</h2>
</div>

| Capacidad | Estado | Descripción |
|------|------|------|
| Árbol visual de Ontology | <StatusBadge status="beta" /> | Árbol plegable + tarjetas de nodo |
| Sesión PM/Architect/Code | <StatusBadge status="beta" /> | Colaboración conversacional entre tres tipos de Agente |
| Trazabilidad de decisiones WAL | <StatusBadge status="beta" /> | Depende del motor Kova |
| Automatización de PR | <StatusBadge status="dev" /> | El Code Agent abre PR directamente |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="compass" :size="14" /> Planificado</span>
  <h2 class="lurus-section-head__title">Lo que viene a continuación</h2>
</div>

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="git-merge" :size="20" /></span>
    <div class="lurus-card__title">Dependency Guardian <StatusBadge status="plan" /></div>
    <p class="lurus-card__body">Detección de cambios de interfaz entre Epics / Stories: cuando se modifica un contrato de API, localiza automáticamente todas las Sesiones y PR afectados.</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="workflow" :size="20" /></span>
    <div class="lurus-card__title">Visualización de Agentes <StatusBadge status="plan" /></div>
    <p class="lurus-card__body">El proceso de razonamiento del Agente en la Sesión, las llamadas a herramientas y los resultados intermedios se muestran en una <strong>línea de tiempo visual</strong>, en lugar de un log de texto plano.</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">Base de conocimiento <StatusBadge status="plan" /></div>
    <p class="lurus-card__body">Integrar <a href="/es/memx/">MemX</a> en Forge como capa de memoria a largo plazo donde el Agente recupera, dentro de la Sesión, decisiones históricas / normas / registros de problemas encontrados.</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="history" :size="14" /> Línea de tiempo</span>
  <h2 class="lurus-section-head__title">Hitos recientes</h2>
</div>

<ol class="lurus-steps">
<li>

**2026 Q2** — GA de Automatización de PR

</li>
<li>

**2026 Q3** — Dependency Guardian beta

</li>
<li>

**2026 Q4** — Visualización de Agentes beta

</li>
<li>

**2027 Q1** — Base de conocimiento beta (integración profunda con MemX)

</li>
</ol>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="mail" :size="14" /> Solicitud de beta privada</span>
  <h2 class="lurus-section-head__title">Canal de beta privada por invitación</h2>
</div>

Actualmente, Forge se posiciona como una **herramienta interna de I+D** de Lurus, **no es un producto comercial a la venta**.

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="mail" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Cómo solicitarla</p>
    <div class="lurus-callout__body">Envía un correo a <code>business@lurus.cn</code> (con el asunto "Solicitud de beta privada de Forge"), indicando el tamaño del equipo, la herramienta de gestión de requisitos actual y los problemas que esperas resolver.</div>
  </div>
</div>

---

## Productos relacionados

<RelatedProducts product-id="forge" />

</div>
