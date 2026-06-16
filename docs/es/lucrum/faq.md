---
title: Preguntas frecuentes de Lucrum
description: Preguntas frecuentes y respuestas de la plataforma de trading cuantitativo con IA Lucrum.
---

<div class="lucrum-page">

# Preguntas frecuentes

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> Cuenta e introducción</span>
  <h2 class="lurus-section-head__title">Registro, pago y cobertura de mercados</h2>
</div>

<details class="lurus-faq-item">
<summary>¿Cómo me registro?</summary>

En [lucrum.lurus.cn](https://lucrum.lurus.cn) inicia sesión con la cuenta unificada de Lurus (todos los productos comparten la misma cuenta).

</details>

<details class="lurus-faq-item">
<summary>¿Es de pago?</summary>

Hay dos modalidades: gratuita y de pago; al superar la cuota gratuita se cobra desde el [monedero de 鹿贝](/es/platform/billing#wallet).

| Función | Gratuita | De pago |
|------|------|------|
| Asistente de trading con IA | Conversaciones diarias limitadas | Sin límite |
| Explorar el mercado de estrategias / estrategias gratuitas | Todas visibles / disponibles | Todas visibles / disponibles |
| Suscripción a estrategias de pago | No disponible | Suscribible |
| Desarrollo de estrategias | Backtesting básico | Funcionalidad completa |

</details>

<details class="lurus-faq-item">
<summary>¿Qué mercados soporta?</summary>

Actualmente acciones A (las bolsas de Shanghái y Shenzhen); acciones de Hong Kong / EE. UU. / cripto en proceso de integración.

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bot" :size="14" /> Asistente de IA</span>
  <h2 class="lurus-section-head__title">Precisión, memoria y generación de código</h2>
</div>

<details class="lurus-faq-item">
<summary>¿Es preciso el análisis?</summary>

Ofrece referencias basadas en LLM + análisis técnico, **no constituye asesoramiento de inversión**. Es bueno interpretando indicadores técnicos / velas, ordenando la lógica del mercado y asistiendo en la concepción de estrategias y el código; no es bueno prediciendo subidas y bajadas a corto plazo: úsalo como referencia para decidir, no como fundamento.

</details>

<details class="lurus-faq-item">
<summary>¿Recuerda las conversaciones?</summary>

Sí. Integra el [motor de memoria MemX](/es/memx/); recuerda preferencias / sectores de interés / conversaciones históricas, aislado por usuario y sin filtraciones.

</details>

<details class="lurus-faq-item">
<summary>¿Puedo escribir código de estrategias con IA?</summary>

Sí. Describe la idea y la IA genera un esqueleto de código Python que puedes validar directamente con backtesting en el banco de trabajo de estrategias.

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bar-chart-3" :size="14" /> Sobre las estrategias</span>
  <h2 class="lurus-section-head__title">Fiabilidad del backtesting, retiros y protección del código</h2>
</div>

<details class="lurus-faq-item">
<summary>¿Son fiables los datos de backtesting?</summary>

Usa cotizaciones históricas reales, pero no considera el coste de impacto ni el slippage (hay diferencias con capital grande), la optimización excesiva tiende al sobreajuste y el pasado no garantiza el futuro. Se recomienda validar primero con una cuenta de simulación tras el backtesting.

</details>

<details class="lurus-faq-item">
<summary>¿Cómo retiro los ingresos de las estrategias?</summary>

Los ingresos entran al monedero en 鹿贝 → inicia sesión en [identity.lurus.cn](https://identity.lurus.cn) → «Monedero» → «Retirar» → introduce el importe y la tarjeta bancaria → normalmente el abono se realiza en 1-3 días hábiles.

</details>

<details class="lurus-faq-item">
<summary>¿Se puede filtrar el código de la estrategia?</summary>

No. Se almacena cifrado en el servidor; los usuarios solo ven la descripción / los indicadores / el informe de backtesting, y no pueden ver el código fuente.

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="code" :size="14" /> Problemas técnicos</span>
  <h2 class="lurus-section-head__title">Límite de tasa, latencia y lenguaje de estrategias</h2>
</div>

<details class="lurus-faq-item">
<summary>¿La API devuelve 429?</summary>

Has superado el límite de frecuencia de solicitudes (varía según el plan); reduce la frecuencia o mejora el plan.

</details>

<details class="lurus-faq-item">
<summary>¿La ejecución de la estrategia tiene mucha latencia?</summary>

Comprueba la estabilidad de la red; para cálculos complejos de la estrategia se recomienda precalcular y cachear; evita los periodos de alta concurrencia en la apertura / el cierre del mercado.

</details>

<details class="lurus-faq-item">
<summary>¿Qué lenguajes soporta para escribir estrategias?</summary>

Actualmente Python; el SDK de estrategias ofrece una biblioteca de indicadores técnicos e interfaces de ejecución de operaciones.

</details>

---

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="mail" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">¿No encuentras la respuesta?</p>
    <div class="lurus-callout__body">Ponte en contacto con <a href="mailto:support@lurus.cn">support@lurus.cn</a>.</div>
  </div>
</div>

<NextSteps
  :steps="[
    { text: 'Inicio rápido', link: '/es/lucrum/quickstart', primary: true },
    { text: 'Mercado de estrategias', link: '/es/lucrum/strategies' },
    { text: 'Visión general del producto', link: '/es/lucrum/' },
  ]"
  title="Siguientes pasos"
/>

</div>
