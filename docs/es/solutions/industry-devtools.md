---
title: "Solución para la industria de herramientas de desarrollo"
description: "Kova + Switch + Lumen — para empresas de herramientas para desarrolladores y equipos de infraestructura."
---

<div class="devtools-page">

# Solución para la industria de herramientas de desarrollo

<MetricStats :items="[
  { label: 'CLI gestionadas de forma unificada', value: '5', hint: 'Switch' },
  { label: 'Modelos en la pasarela', value: '50+' },
  { label: 'Recuperación de agentes', value: 'a nivel de microsegundos', hint: 'Reanudación desde punto de control WAL' },
  { label: 'Componentes de integración', value: '4', hint: 'Kova · MemX · API · Lumen' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> Público objetivo</span>
  <h2 class="lurus-section-head__title">Quién lo usa</h2>
</div>

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Empresas de herramientas de programación con IA</div>
    <p class="lurus-card__body">Construyen sus propios productos de programación con IA.</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
    <div class="lurus-card__title">Equipos de Platform / DevX</div>
    <p class="lurus-card__body">Experiencia de desarrollador interna de la empresa.</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="terminal" :size="20" /></span>
    <div class="lurus-card__title">Desarrolladores independientes / estudios pequeños</div>
    <p class="lurus-card__body">Inicio ligero, escalado según las necesidades.</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="graduation-cap" :size="20" /></span>
    <div class="lurus-card__title">Instituciones de investigación</div>
    <p class="lurus-card__body">Flujos de trabajo experimentales con agentes.</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Componentes principales</span>
  <h2 class="lurus-section-head__title">Combinación de productos</h2>
</div>

<div class="action-grid">
  <ActionCard product-id="kova"   :actions="[{label:'Kova',   href:'/es/kova/',   primary:true}]" />
  <ActionCard product-id="switch" :actions="[{label:'Switch', href:'/es/switch/', primary:true}]" />
  <ActionCard product-id="lumen"  :actions="[{label:'Lumen',  href:'/es/lumen/',  primary:true}]" />
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="puzzle" :size="14" /> Combinaciones típicas</span>
  <h2 class="lurus-section-head__title">Dos combinaciones de implementación</h2>
</div>

### Escenario A: construir tu propia herramienta de programación con IA

<ArchitectureDiagram title="Construir tu propia herramienta de programación con IA" chart="graph TB; Kova[Kova<br/>Ejecución persistente · recuperación ante fallos] --> MemX[MemX<br/>Recuerda las preferencias del usuario / convenciones del proyecto]; MemX --> API[Lurus API<br/>Más de 50 modelos listos para usar]; API --> Lumen[Lumen<br/>Observabilidad tras el lanzamiento + depuración con Replay]; Lumen --> Auth[Auth<br/>SSO + Passkey para todo el equipo]" />

### Escenario B: optimizar el ROI de los desarrolladores internos

<ArchitectureDiagram title="Optimizar el ROI de los desarrolladores internos" chart="graph TB; Switch[Switch<br/>Gestiona de forma unificada las 5 CLI del equipo] --> Lumen[Lumen<br/>El consumo diario de tokens por persona en un solo gráfico]; Lumen --> ArgoCD[ArgoCD<br/>Sincronización de configuración con Git]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="trending-up" :size="14" /> Beneficios</span>
  <h2 class="lurus-section-head__title">Beneficios típicos</h2>
</div>

| Métrica | Antes | Después |
|------|--------|-------|
| Configuración dispersa de herramientas de IA | 5 archivos JSON | **1 archivo yaml** |
| Coste mensual de tokens | No visible | **Panel de control + alertas** |
| Recuperación ante fallos de agentes | Reiniciar desde cero | **Reanudación desde punto de control a nivel de microsegundos** |
| Ciclo de lanzamiento | Semanas | **Días** |

## Siguientes pasos

<NextSteps :steps="[
  { text: 'Inicio rápido de Kova', link: '/es/kova/quickstart', primary: true },
  { text: 'Configuración de Switch', link: '/es/switch/configuration' },
  { text: 'Inicio rápido de Lumen', link: '/es/lumen/quickstart' },
]" />

</div>
