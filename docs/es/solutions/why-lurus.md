---
title: "Por qué elegir Lurus"
description: "Comparativa de TCO frente al desarrollo propio en las cuatro capacidades clave: gateway, agentes, memoria e identidad."
---

<div class="why-lurus-page">

# Por qué elegir Lurus

> Si estás evaluando "desarrollar internamente vs. adquirir", esta página te ofrece la comparativa de TCO de cuatro capacidades clave.

<MetricStats :items="[
  { label: 'Modelos accesibles vía gateway', value: '50+', hint: 'Una sola Key' },
  { label: 'Planificación de Kova', value: '3μs', hint: 'Benchmark con Criterion' },
  { label: 'Identidad unificada', value: 'SSO/MFA', hint: 'Conecta con el IdP corporativo' },
  { label: 'Reglas PII de MemX', value: '12 tipos', hint: 'No evitables' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="award" :size="14" /> Comparativa central</span>
  <h2 class="lurus-section-head__title">Cuatro capacidades clave vs. desarrollo propio</h2>
  <p class="lurus-section-head__lede">Gateway · Ejecución de agentes · Memoria · Identidad: comparación punto por punto del esfuerzo de ingeniería propio.</p>
</div>

<ComparisonTable
  title="Gateway LLM"
  self-label="Lurus API"
  :competitors="['OneAPI propio', 'LiteLLM propio']"
  :rows="[
    { dimension: 'Número de modelos accesibles', self: '50+ (integrados)', alt: { 'OneAPI propio': 'Hay que integrar uno a uno', 'LiteLLM propio': 'Hay que integrar uno a uno' } },
    { dimension: 'Compatibilidad con OpenAI SDK', self: 'Lista para usar', alt: { 'OneAPI propio': 'Parcial', 'LiteLLM propio': 'Parcial' } },
    { dimension: 'Facturación + limitación de tasa', self: 'Integrada', alt: { 'OneAPI propio': 'Hay que desarrollarla', 'LiteLLM propio': 'Hay que desarrollarla' } },
    { dimension: 'Meses-persona de ingeniería', self: '0', alt: { 'OneAPI propio': '2-4 meses-persona', 'LiteLLM propio': '2-3 meses-persona' } },
  ]"
/>

<ComparisonTable
  title="Motor de ejecución de agentes"
  self-label="Kova"
  :competitors="['Temporal propio', 'LangGraph + Redis propio']"
  :rows="[
    { dimension: 'Latencia de planificación', self: '3μs', alt: { 'Temporal propio': '1-10ms', 'LangGraph + Redis propio': '5-20ms' } },
    { dimension: 'Recuperación ante fallos', self: 'WAL automático', alt: { 'Temporal propio': 'Event Sourcing', 'LangGraph + Redis propio': 'Semiautomática' } },
    { dimension: 'Dependencias externas', self: 'Ninguna', alt: { 'Temporal propio': 'Cassandra/MySQL', 'LangGraph + Redis propio': 'Redis/PG' } },
    { dimension: 'Meses-persona de ingeniería', self: '0', alt: { 'Temporal propio': '3-6 meses-persona', 'LangGraph + Redis propio': '2-4 meses-persona' } },
  ]"
/>

<ComparisonTable
  title="Memoria de IA"
  self-label="MemX"
  :competitors="['mem0 propio', 'Weaviate + reglas propio']"
  :rows="[
    { dimension: 'Filtrado de PII', self: '12 reglas integradas', alt: { 'mem0 propio': 'Hay que programarlo', 'Weaviate + reglas propio': 'Hay que programarlo' } },
    { dimension: 'Decaimiento/olvido', self: 'Curva de Ebbinghaus', alt: { 'mem0 propio': 'Inexistente', 'Weaviate + reglas propio': 'Hay que programarlo' } },
    { dimension: 'Coste de destilación con LLM', self: '0 (degradación por reglas)', alt: { 'mem0 propio': 'Coste de LLM en cada caso', 'Weaviate + reglas propio': 'Coste de LLM en cada caso' } },
    { dimension: 'Meses-persona de ingeniería', self: '0', alt: { 'mem0 propio': '1-2 meses-persona', 'Weaviate + reglas propio': '3-5 meses-persona' } },
  ]"
/>

<ComparisonTable
  title="Identidad y cumplimiento"
  self-label="Lurus Auth"
  :competitors="['Keycloak propio', 'Servicio en la nube Auth0']"
  :rows="[
    { dimension: 'Federación SSO', self: 'Lista para usar', alt: { 'Keycloak propio': 'Requiere configuración', 'Servicio en la nube Auth0': 'Pago por uso' } },
    { dimension: 'Criptografía nacional SM4-GCM', self: 'Opcional', alt: { 'Keycloak propio': 'No compatible', 'Servicio en la nube Auth0': 'No compatible' } },
    { dimension: 'Passkey / MFA', self: 'Integrado', alt: { 'Keycloak propio': 'Parcial', 'Servicio en la nube Auth0': 'Integrado' } },
    { dimension: 'Meses-persona de ingeniería', self: '0', alt: { 'Keycloak propio': '2-4 meses-persona', 'Servicio en la nube Auth0': '0, pero los datos salen del país' } },
  ]"
/>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> Balance global</span>
  <h2 class="lurus-section-head__title">TCO global</h2>
  <p class="lurus-section-head__lede">Calcula de una vez los costes ocultos del paquete completo de cuatro componentes: meses-persona, infraestructura, guardias y cumplimiento.</p>
</div>

| Concepto | Paquete propio de cuatro componentes (anual) | Solución Lurus (anual) |
|------|----------------|------------------|
| Meses-persona de ingeniería | **8-18 meses-persona** | 0 |
| Infraestructura | ~¥15-30 万 | Pago por uso, con opción de privatización |
| Guardias de mantenimiento | 24×7 todo el año | SLA de Lurus |
| Auditoría de cumplimiento | A tu cargo | Un único marco de cumplimiento que cubre todos los productos |

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="award" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Un único marco de cumplimiento que cubre todos los productos</p>
    <div class="lurus-callout__body">Las cuatro capacidades comparten la misma capa de identidad, facturación y auditoría: no hace falta repetir la evaluación de cumplimiento para cada componente, y los meses-persona de ingeniería se reducen directamente a cero.</div>
  </div>
</div>

## Enlaces relacionados

<NextSteps :steps="[
  { text: 'Modalidades de despliegue empresarial', link: '/es/solutions/enterprise-deploy', primary: true },
  { text: 'Plataforma de IA empresarial', link: '/es/solutions/ai-midware' },
  { text: 'Contactar con el equipo comercial', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>
