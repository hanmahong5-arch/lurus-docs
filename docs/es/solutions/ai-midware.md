---
title: "Plataforma central de IA empresarial"
description: "Ciclo cerrado de cinco capas — Auth · API · MemX · Kova · Lumen, para que las empresas construyan su propia plataforma central de IA."
---

<div class="midware-page">

# Plataforma central de IA empresarial

<MetricStats :items="[
  { label: 'Capas de capacidad', value: '5 capas', hint: 'Uso independiente · Ciclo cerrado combinado' },
  { label: 'Modelos del gateway', value: '50+' },
  { label: 'Recuperación de Kova', value: 'Nivel microsegundo', hint: 'Reanudación desde checkpoint con WAL' },
  { label: 'Ruta de implementación', value: '10 semanas', hint: 'Referencia' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Arquitectura</span>
  <h2 class="lurus-section-head__title">Ciclo cerrado de cinco capas</h2>
  <p class="lurus-section-head__lede">De arriba abajo: cada capa es útil por sí sola y, al combinarse, el valor del ciclo cerrado es mayor.</p>
</div>

<ArchitectureDiagram title="Ciclo cerrado de cinco capas de la plataforma central de IA" chart="graph TB; App[Capa de aplicaciones de negocio<br/>Atención al cliente · Base de conocimiento · Informes · Herramientas para desarrolladores] --> Lumen[Lumen Observabilidad<br/>Trace / Replay / Cost]; Lumen --> Kova[Kova Motor de ejecución de agentes<br/>WAL / Checkpoint]; Kova --> MemX[MemX Memoria inteligente<br/>Destilación / Deduplicación / Decaimiento / Recuperación]; MemX --> API[Lurus API Gateway unificado<br/>50+ modelos / Medición / Limitación]; API --> Auth[Lurus Auth Identidad unificada<br/>SSO · MFA · OIDC · Federación]" />

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Lumen — Observabilidad</div>
    <p class="lurus-card__body">Trace / Replay / Cost.</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Kova — Motor de ejecución de agentes</div>
    <p class="lurus-card__body">WAL / Checkpoint, reanudación desde checkpoint tras un fallo.</p>
  </div>
  <div class="lurus-card lurus-card--memx">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">MemX — Memoria inteligente</div>
    <p class="lurus-card__body">Destilación / Deduplicación / Decaimiento / Recuperación.</p>
  </div>
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="plug-zap" :size="20" /></span>
    <div class="lurus-card__title">Lurus API — Gateway unificado de LLM</div>
    <p class="lurus-card__body">50+ modelos / Medición / Limitación.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">Lurus Auth — Identidad unificada</div>
    <p class="lurus-card__body">SSO · MFA · OIDC · Federación.</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-merge" :size="14" /> Comparación de valor</span>
  <h2 class="lurus-section-head__title">Uso independiente vs colaboración de cinco capas</h2>
</div>

| Dimensión | Uso independiente | Colaboración de cinco capas |
|------|---------|---------|
| Identidad | Implementación propia de cada uno | **SSO una sola vez** |
| Cálculo de costos | A cargo de uno mismo | **Correlación automática Lumen + API** |
| Recuperación tras fallo | Añadida manualmente | **Respaldo con WAL de Kova** |
| Acumulación de conocimiento | Dispersa | **Destilación unificada con MemX** |
| Cumplimiento | Evaluación caso por caso | **Una cobertura de cumplimiento única** |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package" :size="14" /> Entrega</span>
  <h2 class="lurus-section-head__title">Entrega típica</h2>
</div>

| Modalidad | Descripción | Plazo |
|------|------|------|
| SaaS | Disponible de inmediato | 0 |
| On-premise | Despliegue de imágenes en el K8s de la empresa | 2-4 semanas |
| Operación gestionada | Lurus de guardia, en la red interna de la empresa | A convenir |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> Hoja de ruta</span>
  <h2 class="lurus-section-head__title">Ruta de implementación de referencia</h2>
  <p class="lurus-section-head__lede">Integración por fases en 10 semanas, entregando una capa cada dos semanas, verificable de forma independiente.</p>
</div>

<ol class="lurus-steps">
  <li><strong>W1-2</strong>: integrar <a href="/es/guide/introduction">Lurus API</a> para reemplazar las llamadas a LLM existentes</li>
  <li><strong>W3-4</strong>: integrar <a href="/es/platform/auth/">Auth</a> para implementar SSO</li>
  <li><strong>W5-6</strong>: usar <a href="/es/memx/">MemX</a> para acumular conocimiento de negocio</li>
  <li><strong>W7-8</strong>: migrar los agentes principales a <a href="/es/kova/">Kova</a></li>
  <li><strong>W9-10</strong>: integrar la observabilidad de extremo a extremo con <a href="/es/lumen/">Lumen</a></li>
</ol>

## Próximos pasos

<NextSteps :steps="[
  { text: 'Por qué elegir Lurus', link: '/es/solutions/why-lurus', primary: true },
  { text: 'Modalidades de despliegue empresarial', link: '/es/solutions/enterprise-deploy' },
  { text: 'Contactar con el equipo comercial', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>
