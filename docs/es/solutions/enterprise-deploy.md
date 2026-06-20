---
title: "Modalidades de despliegue empresarial"
description: "Comparativa de tres modalidades de despliegue (SaaS / on-premise / nube híbrida) y sus límites de cumplimiento."
---

<div class="deploy-page">

# Modalidades de despliegue empresarial

<MetricStats :items="[
  { label: 'Modalidades de despliegue', value: '3', hint: 'SaaS · On-premise · Nube híbrida' },
  { label: 'Puesta en marcha on-premise', value: '2-4 semanas' },
  { label: 'Disponibilidad empresarial', value: '99.95%', hint: 'SaaS empresarial' },
  { label: 'Cifrado SM nacional', value: 'SM4-GCM' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="server" :size="14" /> Comparativa de modalidades</span>
  <h2 class="lurus-section-head__title">Matriz de modalidades de despliegue</h2>
  <p class="lurus-section-head__lede">Un mismo producto, tres formas de implementarlo: elige según la soberanía de datos y el plazo de puesta en marcha.</p>
</div>

| Capacidad | SaaS | On-premise | Nube híbrida |
|------|------|-------|--------|
| Gateway de Lurus API | ✅ Listo para usar | ✅ Imagen on-premise | ✅ |
| Motor de ejecución Kova | ✅ | ✅ | ✅ |
| Motor de memoria MemX | ✅ | ✅ | ✅ |
| Trading cuantitativo Lucrum | ✅ | 🔜 2026 H2 | ✅ |
| Switch / Creator | ✅ Escritorio | ✅ Escritorio | ✅ |
| Identidad y cumplimiento | ✅ | ✅ | ✅ |
| Soberanía de datos | AWS / Alibaba Cloud | **Interno de la empresa** | Híbrida |
| SM4-GCM nacional | — | ✅ | ✅ |
| Plazo de puesta en marcha | Inmediato | 2-4 semanas | 1-2 semanas |

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> Cumplimiento</span>
  <h2 class="lurus-section-head__title">Capacidades de cumplimiento</h2>
  <p class="lurus-section-head__lede">Soberanía de datos, trazabilidad de auditoría y cifrado SM nacional: todo claro para tu revisión en una sola vista.</p>
</div>

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="lock" :size="20" /></span>
    <div class="lurus-card__title">Los datos no salen del país</div>
    <p class="lurus-card__body">Despliegue on-premise: ningún dato pasa por la nube pública de Lurus.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="history" :size="20" /></span>
    <div class="lurus-card__title">Registros de auditoría</div>
    <p class="lurus-card__body">Todas las llamadas a la API, eventos de identidad y operaciones administrativas quedan registrados en disco.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="shield" :size="20" /></span>
    <div class="lurus-card__title">Soporte de criptografía SM nacional</div>
    <p class="lurus-card__body">Cifrado simétrico SM4-GCM, asimétrico SM2 (en hoja de ruta).</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="award" :size="20" /></span>
    <div class="lurus-card__title">MLPS / certificaciones sectoriales</div>
    <p class="lurus-card__body">Contacta con <a href="mailto:business@lurus.cn">business@lurus.cn</a> para obtener la lista actualizada.</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="key-round" :size="14" /> Federación de identidad</span>
  <h2 class="lurus-section-head__title">Federación SSO</h2>
  <p class="lurus-section-head__lede">Los empleados inician sesión en todos los productos de Lurus con su cuenta corporativa, sin necesidad de crear identidades nuevas.</p>
</div>

Las empresas que ya cuentan con un IdP (Okta / Azure AD / Keycloak autogestionado) permiten a sus empleados iniciar sesión con la cuenta corporativa:

<ArchitectureDiagram title="Inicio de sesión federado con el IdP empresarial" chart="graph LR; A[企业 IdP] -->|OIDC| B[Lurus Casdoor]; B --> C[所有 Lurus 产品]" />

Protocolos compatibles: OIDC / OAuth 2.0 / SAML 2.0 / SCIM (ciclo de vida de usuarios).

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="activity" :size="14" /> Nivel de servicio</span>
  <h2 class="lurus-section-head__title">SLA</h2>
</div>

| Modalidad | Disponibilidad | Respuesta a incidentes |
|------|--------|---------|
| SaaS estándar | 99.9% | Horario laboral |
| SaaS empresarial | 99.95% | 7×24 |
| On-premise | Según contrato | Guardia dedicada |

## Siguientes pasos

<NextSteps :steps="[
  { text: 'Identidad y cumplimiento', link: '/es/platform/auth/', primary: true },
  { text: 'Por qué elegir Lurus', link: '/es/solutions/why-lurus' },
  { text: 'Contactar con ventas', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>
