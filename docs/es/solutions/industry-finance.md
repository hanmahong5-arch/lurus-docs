---
title: "Solución para el sector financiero"
description: "Lucrum + Auth + auditoría de cumplimiento — solución integrada para correduría, gestión de activos y fintech."
---

<div class="finance-page">

# Solución para el sector financiero

<MetricStats :items="[
  { label: 'Asesores de inversión con IA', value: '11', hint: 'multiperspectiva' },
  { label: 'Métricas de backtesting', value: '30+' },
  { label: 'Casos de prueba', value: '3157+', hint: 'Vitest' },
  { label: 'Puesta en producción de estrategias', value: '1-3 días' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> Destinatarios</span>
  <h2 class="lurus-section-head__title">Quién lo usa</h2>
</div>

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="trending-up" :size="20" /></span>
    <div class="lurus-card__title">Operativa propia de correduría</div>
    <p class="lurus-card__body">Cuantitativa de acciones A para cuenta propia o de clientes.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="briefcase" :size="20" /></span>
    <div class="lurus-card__title">Gestoras de activos</div>
    <p class="lurus-card__body">Investigación de estrategias y gestión de carteras.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Fintech</div>
    <p class="lurus-card__body">Productos de asesoramiento de inversión con IA.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="user-check" :size="20" /></span>
    <div class="lurus-card__title">Family offices / inversores profesionales</div>
    <p class="lurus-card__body">Investigación y backtesting de estrategias personales.</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Componentes clave</span>
  <h2 class="lurus-section-head__title">Combinación de productos</h2>
</div>

<div class="action-grid">
  <ActionCard product-id="lucrum" :actions="[{label:'Conocer Lucrum', href:'/es/lucrum/', primary:true}]" />
  <ActionCard product-id="auth" :actions="[{label:'Identidad unificada', href:'/es/platform/auth/', primary:true}]" />
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-merge" :size="14" /> Flujo de datos</span>
  <h2 class="lurus-section-head__title">Arquitectura típica</h2>
  <p class="lurus-section-head__lede">Del lenguaje natural a la operativa real: el analista solo describe la idea y la IA materializa el código.</p>
</div>

<ArchitectureDiagram title="Flujo de datos cuantitativo financiero" chart="graph TB; A[Analista / PM] -->|describe la estrategia en lenguaje natural| B[Lucrum<br/>11 asesores de inversión con IA]; B -->|código vnpy + backtesting| C[Mercado de estrategias]; C -->|suscripción / reparto| D[Operativa real]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> Cumplimiento</span>
  <h2 class="lurus-section-head__title">Aspectos de cumplimiento</h2>
</div>

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="lock" :size="20" /></span>
    <div class="lurus-card__title">Los datos no salen del país</div>
    <p class="lurus-card__body">Despliegue privado, con datos de operativa almacenados localmente.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="calculator" :size="20" /></span>
    <div class="lurus-card__title">Precisión de grado financiero</div>
    <p class="lurus-card__body">Decimal.js de extremo a extremo, validado con 3.157 casos de Vitest.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="history" :size="20" /></span>
    <div class="lurus-card__title">Auditoría integral</div>
    <p class="lurus-card__body">Cada cambio de estrategia, backtest y operación deja rastro.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">Cumplimiento de identidad</div>
    <p class="lurus-card__body">MFA obligatorio, rotación periódica de PAT y federación SSO conectable al IdP interno.</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> Costes</span>
  <h2 class="lurus-section-head__title">Referencia de TCO</h2>
</div>

| Concepto | Construcción propia | Solución Lucrum |
|------|------|-----------|
| Número de analistas | 3-5 personas | 1-2 personas + asesores con IA |
| Ciclo de puesta en producción de estrategias | 2-4 semanas | **1-3 días** |
| Infraestructura de backtesting | Construcción propia | Integrada |

## Siguientes pasos

<NextSteps :steps="[
  { text: 'Inicio rápido de Lucrum', link: '/es/lucrum/quickstart', primary: true },
  { text: 'Flujo completo de estrategias', link: '/es/tutorials/lucrum-strategy-workflow' },
  { text: 'Contactar con ventas', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>
