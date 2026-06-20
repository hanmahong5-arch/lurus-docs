---
title: "Visión general de soluciones empresariales"
description: "Capacidades empresariales de Lurus clasificadas por industria y por rol de acceso."
---

<div class="solutions-hub">

# Soluciones empresariales

Puntos de entrada diseñados para responsables de decisión, compras, revisión de arquitectura y preparación de cumplimiento.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">50+</span><span class="lurus-stat__label">Modelos integrados</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3</span><span class="lurus-stat__label">Modalidades de despliegue</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">SM4-GCM</span><span class="lurus-stat__label">Cifrado SM nacional</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">1</span><span class="lurus-stat__label">Factura unificada</span></div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> Por rol</span>
  <h2 class="lurus-section-head__title">Encuentra tu punto de entrada</h2>
  <p class="lurus-section-head__lede">El CTO ve la arquitectura y el TCO, el CISO ve los límites de cumplimiento, la PMO ve la facturación y las licencias.</p>
</div>

<div class="action-grid">
  <ActionCard
    name="CTO / Revisión de arquitectura"
    tagline="Why Lurus · Modalidades de despliegue · TCO · Benchmarks de rendimiento"
    icon="compass"
    color="var(--lurus-brand-500)"
    :actions="[
      { label: 'Por qué elegir Lurus', href: '/es/solutions/why-lurus', primary: true },
      { label: 'Modalidades de despliegue empresarial', href: '/es/solutions/enterprise-deploy' },
    ]"
  />
  <ActionCard
    name="CISO / Cumplimiento"
    tagline="Federación SSO · SM4-GCM nacional · Registros de auditoría · Soberanía de datos"
    icon="shield-check"
    color="var(--lurus-color-auth)"
    :actions="[
      { label: 'Identidad y cumplimiento', href: '/es/platform/auth/', primary: true },
      { label: 'Matriz de modalidades de despliegue', href: '/es/solutions/enterprise-deploy' },
    ]"
  />
  <ActionCard
    name="PMO / Compras"
    tagline="Facturación por unidad Lubei · Una sola factura · Licencias on-premise"
    icon="receipt"
    color="var(--lurus-color-platform)"
    :actions="[
      { label: 'Detalles de facturación', href: '/es/platform/billing', primary: true },
      { label: 'Contactar con el equipo comercial', href: 'mailto:business@lurus.cn', external: true },
    ]"
  />
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="briefcase" :size="14" /> Por industria</span>
  <h2 class="lurus-section-head__title">Soluciones combinadas por industria</h2>
  <p class="lurus-section-head__lede">Una combinación de productos validada para cada industria, lista para implementar.</p>
</div>

<div class="action-grid">
  <ActionCard
    name="Finanzas"
    tagline="Lucrum + Auth + Auditoría de cumplimiento"
    icon="landmark"
    color="var(--lurus-color-lucrum)"
    :actions="[
      { label: 'Solución para el sector financiero', href: '/es/solutions/industry-finance', primary: true },
    ]"
  />
  <ActionCard
    name="Contenido"
    tagline="Creator + API + Producción masiva de textos"
    icon="pen-tool"
    color="var(--lurus-color-creator)"
    :actions="[
      { label: 'Solución para el sector de contenido', href: '/es/solutions/industry-content', primary: true },
    ]"
  />
  <ActionCard
    name="Herramientas de desarrollo"
    tagline="Kova + Switch + Lumen, el ciclo cerrado del desarrollador"
    icon="terminal"
    color="var(--lurus-color-switch)"
    :actions="[
      { label: 'Solución de herramientas de desarrollo', href: '/es/solutions/industry-devtools', primary: true },
    ]"
  />
  <ActionCard
    name="Plataforma de IA empresarial"
    tagline="Auth + API + MemX + Kova + Lumen: ciclo cerrado de cinco capas"
    icon="layers"
    color="var(--lurus-color-kova)"
    :actions="[
      { label: 'Solución de plataforma de IA', href: '/es/solutions/ai-midware', primary: true },
    ]"
  />
</div>

## Siguientes pasos

<NextSteps :steps="[
  { text: 'Por qué elegir Lurus', link: '/es/solutions/why-lurus', primary: true },
  { text: 'Contactar con el equipo comercial', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>

<style scoped>
.solutions-hub .lurus-stat-strip { margin: 20px 0 8px; }
</style>
