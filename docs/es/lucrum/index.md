---
title: Lucrum — Plataforma de trading cuantitativo con IA
description: Plataforma de trading cuantitativo impulsada por IA, con mercado de estrategias, validación por backtesting y asistente de trading inteligente.
---

<div class="lucrum-page">

<ProductHero product-id="lucrum" />

<MetricStats :items="[
  { label: 'Asesores de inversión', value: '11', hint: 'Agentes multiperspectiva' },
  { label: 'Métricas de backtest', value: '30+', hint: 'Sharpe / drawdown / tasa de acierto…' },
  { label: 'Casos de prueba', value: '3157+', hint: 'Validado con Vitest' },
  { label: 'Precisión', value: 'Decimal.js', hint: 'Cero error de punto flotante' },
]" />

## ¿Qué es Lucrum?

**Lucrum** es la plataforma de decisión de trading cuantitativo AI-Native de Lurus. Idea central: **el lenguaje natural es el mejor lenguaje de programación**: describe la idea de tu estrategia en español, la IA genera el código automáticamente, ejecuta el backtesting y evalúa en múltiples dimensiones. Incluye 11 Agentes asesores de inversión profesionales (perspectivas de Buffett / Peter Lynch / Livermore / Simons, etc.), cálculo de precisión financiera con Decimal.js en toda la plataforma (validado con 3.157 casos de prueba Vitest), cero error de punto flotante.

> El nombre proviene del latín "Lucrum" (ganancia), que evoca la detección precisa de oportunidades de mercado.

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="sparkles" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Etapa actual: beta pública</p>
    <div class="lurus-callout__body"><a href="https://lucrum.lurus.cn">lucrum.lurus.cn</a> ya está en línea; las funciones principales (generación de estrategias / backtesting / asesor de IA) se pueden probar directamente, y los precios están en <a href="https://lucrum.lurus.cn/pricing">/pricing</a>. Aún no ha entrado en GA oficial; algunas capacidades avanzadas (mercado de estrategias, conexión con brokers reales) siguen en desarrollo.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> Capacidades principales</span>
  <h2 class="lurus-section-head__title">De una frase en español a un backtest con calificación</h2>
  <p class="lurus-section-head__lede">Generación de estrategias, investigación con múltiples Agentes, mercado de estrategias, facturación por cuota y ejecución en tiempo real: todo en una sola cadena.</p>
</div>

### Generación de estrategias y backtesting con IA

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="sparkles" :size="20" /></span>
    <div class="lurus-card__title">Lenguaje natural → código</div>
    <p class="lurus-card__body">Describe la intención de la estrategia en español y la IA genera automáticamente el código de estrategia vnpy CtaTemplate.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="calculator" :size="20" /></span>
    <div class="lurus-card__title">Backtesting de grado financiero</div>
    <p class="lurus-card__body">Precisión total con Decimal.js, restricción de lotes de 100 acciones del mercado A, regla T+1, comisiones + impuesto de timbre + tasa de transferencia + slippage.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="bar-chart-3" :size="20" /></span>
    <div class="lurus-card__title">Análisis con más de 30 métricas</div>
    <p class="lurus-card__body">Ratio de Sharpe, máximo drawdown, Sortino, Calmar, tasa de acierto, ratio ganancia/pérdida…</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="star" :size="20" /></span>
    <div class="lurus-card__title">Calificación en 5 niveles S/A/B/C/D</div>
    <p class="lurus-card__body">Ponderación de 4 dimensiones: rentabilidad 30% + control de riesgo 30% + estabilidad 25% + eficiencia 15%.</p>
  </div>
</div>

### 11 asesores de inversión con IA

Sistema de análisis de inversión con múltiples Agentes orquestado sobre LangGraph (4 analistas + 2 investigadores + 4 maestros + 1 moderador de debate = 11):

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="users" :size="20" /></span>
    <div class="lurus-card__title">Perspectivas de 4 maestros de la inversión</div>
    <p class="lurus-card__body">Buffett (valor), Peter Lynch (crecimiento), Livermore (técnico), Simons (cuantitativo).</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="search" :size="20" /></span>
    <div class="lurus-card__title">4 analistas</div>
    <p class="lurus-card__body">Fundamental / técnico / sentimiento / macro, cada uno emite sus conclusiones por separado.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
    <div class="lurus-card__title">2 investigadores + 1 moderador de debate</div>
    <p class="lurus-card__body">Debate alcista vs bajista (Bull vs Bear) para evitar el sesgo de una sola perspectiva.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">Integración con motor de memoria</div>
    <p class="lurus-card__body">A través de <a href="/es/memx/">MemX</a> recuerda tus preferencias de trading y decisiones históricas.</p>
  </div>
</div>

### Mercado de estrategias

Un ecosistema abierto de estrategias cuantitativas que conecta a desarrolladores de estrategias y traders:

| Rol | Funciones |
|------|------|
| **Autor de estrategias** | Subir estrategias, fijar precios, ver el reparto de ingresos |
| **Usuario de estrategias** | Explorar y suscribirse a estrategias, desplegar en trading real con un clic |

**Reparto de ingresos**: plataforma 30% / autor de la estrategia 70%.

### Cuotas y facturación

<ol class="lurus-steps">
<li>

**Límite del plan** — número de llamadas a la IA mensuales incluidas en el plan de suscripción.

</li>
<li>

**Conteo mensual en Redis** — seguimiento en tiempo real del uso del mes en curso.

</li>
<li>

**Respaldo con saldo de 鹿贝** — al agotar la cuota se descuenta automáticamente de la [billetera de 鹿贝](/es/platform/billing#wallet); 1 鹿贝 = 10.000 tokens.

</li>
</ol>

### Datos y ejecución en tiempo real

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">Cobertura de mercados</div>
    <p class="lurus-card__body">Mercado A (Shanghái y Shenzhen, ~5000+ valores, fuentes de datos adata + Eastmoney); Hong Kong / EE. UU. / cripto en planificación.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Trading simulado</div>
    <p class="lurus-card__body">Mock Broker integrado, que simula por completo la regla T+1, lotes de 100 acciones, comisiones e impuesto de timbre.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="shield" :size="20" /></span>
    <div class="lurus-card__title">Motor de control de riesgo</div>
    <p class="lurus-card__body">Límites de posición, stop-loss y take-profit, protección de máximo drawdown.</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> Público objetivo</span>
  <h2 class="lurus-section-head__title">Trading cuantitativo sin escribir código</h2>
</div>

| Tipo de usuario | Cómo te ayuda Lucrum |
|---------|-----------------|
| **Principiante en cuantitativo** | El asistente de IA te guía desde cero; basta describir la idea de la estrategia en lenguaje natural para generar el esqueleto del código |
| **Inversor particular** | Elige estrategias ya validadas del mercado de estrategias y despliégalas con un clic, sin programar |
| **Desarrollador de estrategias** | Cadena de herramientas completa de desarrollo-backtesting-publicación; publica estrategias y gana ingresos pasivos |
| **Equipo de trading profesional** | Interfaz API para integrarse en sistemas de trading existentes |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-merge" :size="14" /> Comparativa</span>
  <h2 class="lurus-section-head__title">En qué se diferencia de las plataformas cuantitativas tradicionales</h2>
</div>

<ComparisonTable
  self-label="Lucrum"
  :competitors="['vnpy', '掘金', '米筐', '聚宽']"
  :rows="[
    { dimension: 'Escritura de estrategias', self: 'Generación por lenguaje natural', alt: { vnpy: 'Python a mano', '掘金': 'Python a mano', '米筐': 'Python a mano', '聚宽': 'Python a mano' } },
    { dimension: 'Asesor de inversión con IA', self: '11 multiperspectiva', alt: { vnpy: 'No', '掘金': 'No', '米筐': 'No', '聚宽': 'No' } },
    { dimension: 'Precisión', self: 'Decimal.js precisión total', alt: { vnpy: 'float', '掘金': 'float', '米筐': 'float', '聚宽': 'float' } },
    { dimension: 'Mercado de estrategias', self: 'Integrado + calificación', alt: { vnpy: 'No', '掘金': 'Sí', '米筐': 'Sí', '聚宽': 'Sí' } },
  ]"
  title="Comparativa con plataformas cuantitativas tradicionales"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> Arquitectura técnica</span>
  <h2 class="lurus-section-head__title">Del navegador al motor de liquidación</h2>
</div>

<ArchitectureDiagram
  title="Arquitectura por capas de Lucrum"
  chart="graph TD;
    A[Navegador / móvil] --> B[Lucrum Web<br/>Next.js 14 + TS<br/>Panel de trading·Editor de estrategias·Chat de IA];
    B --> C[Lucrum Backend<br/>Python 3.11 + FastAPI<br/>vnpy 4.x + LangGraph<br/>Motor de estrategias·Gateway de cotizaciones·Control de riesgo·Liquidación];
    C --> D[Asistente de IA<br/>Lurus API];
    C --> E[Motor de memoria<br/>MemX];
    C --> F[(PostgreSQL<br/>Estrategias / operaciones)];
    C --> G[(Redis<br/>Cotizaciones / cuotas)];
    C --> H[NATS<br/>Eventos]"
/>

---

<NextSteps
  :steps="[
    { text: 'Inicio rápido', link: '/es/lucrum/quickstart', primary: true },
    { text: 'Mercado de estrategias', link: '/es/lucrum/strategies' },
    { text: 'Preguntas frecuentes', link: '/es/lucrum/faq' },
    { text: 'Plataforma de trading', link: 'https://lucrum.lurus.cn', external: true },
  ]"
  title="Próximos pasos"
/>

<!-- lurus:related-block -->

## Productos relacionados

<RelatedProducts product-id="lucrum" />

</div>

<style>
.lucrum-page .lurus-card--lucrum .lurus-card__body a { color: var(--lurus-color-lucrum, var(--vp-c-brand-1)); }
</style>
