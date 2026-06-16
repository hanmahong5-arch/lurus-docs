---
title: Detalles de facturación
description: Explicación detallada de los planes de suscripción, la gestión de cuotas y el sistema económico de 鹿贝 de Lurus.
---

<div class="billing-page">

# Detalles de facturación <StatusBadge status="live" />

Planes de suscripción, gestión de cuotas y sistema económico de 鹿贝.

<MetricStats
  :items="[
    { label: 'Planes de suscripción', value: '4 niveles', hint: 'Free → Enterprise' },
    { label: 'Métodos de pago', value: '3 tipos', hint: 'Stripe / Creem / Epay' },
    { label: 'Bonificación por recarga', value: 'hasta 5%', hint: 'primeras 6 renovaciones' },
    { label: 'Ventana de reembolso', value: '7 días', hint: 'reembolso íntegro en la primera suscripción' },
  ]"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package-2" :size="14" /> Suscripción</span>
  <h2 class="lurus-section-head__title">Comparativa de planes de suscripción</h2>
  <p class="lurus-section-head__lede">Desde la prueba gratuita hasta el SLA empresarial: elige según tu nivel de uso.</p>
</div>

| Plan | Llamadas a la API | Modelos disponibles | Lucrum | Soporte / Otros |
|------|---------|---------|--------|------------|
| **Free** | 100 veces/día | Básicos (deepseek-chat, gpt-3.5-turbo) | Asistente IA: 10 conversaciones/día | Soporte de la comunidad |
| **Basic** | Suscripción mensual de iniciación, precio según la consola | — | — | Para que desarrolladores individuales lo prueben |
| **Pro** (mensual/anual, descuento en el pago anual) | 10,000 veces/mes | Todos | Asistente IA ilimitado; despliegue de hasta 3 estrategias | Tickets por correo (respuesta en 24 h) |
| **Enterprise** (personalizado) | Bajo demanda | Todos + despliegue privado | Miembros del equipo ilimitados | SLA 99.9%; gestor de cuenta dedicado + respuesta inmediata; centro de datos a elección |

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="briefcase" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Plan empresarial</p>
    <div class="lurus-callout__body">¿Necesitas despliegue privado, centro de datos a elección o SLA 99.9%? Contacta con <a href="mailto:business@lurus.cn">business@lurus.cn</a>.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> Cuota</span>
  <h2 class="lurus-section-head__title">Gestión de cuotas</h2>
  <p class="lurus-section-head__lede">Cada llamada consume cuota según el modelo y el uso de Token; al superar el límite se cobra automáticamente en 鹿贝.</p>
</div>

### Cálculo de la cuota

La cuota consumida en cada llamada a la API depende del modelo y del uso de Token:

| Tipo de modelo | Regla de consumo de cuota |
|---------|-------------|
| Modelos básicos (deepseek-chat, etc.) | 1 llamada = 1 cuota |
| Modelos avanzados (gpt-4o, etc.) | 1 llamada = 3 cuotas |
| Generación de imágenes/vídeo | Según la complejidad de la tarea = 5-20 cuotas |

### Gestión del exceso de cuota

<ol class="lurus-steps">
<li>Llega la solicitud y primero se comprueba la cuota de suscripción.</li>
<li>Cuota <strong>suficiente</strong> → procesamiento normal.</li>
<li>Cuota <strong>insuficiente</strong> → se comprueba el saldo de 鹿贝: si el saldo es suficiente, se cobra automáticamente y se procesa con normalidad.</li>
<li>Saldo <strong>insuficiente</strong> → se devuelve el error <code>402</code>.</li>
</ol>

¿Recibiste `402` / `insufficient_quota`? Consulta los pasos de diagnóstico en [Solución de problemas · Cuota / saldo insuficiente](/es/guide/troubleshooting#insufficient-quota).

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">No falla en silencio</p>
    <div class="lurus-callout__body">Cuando el saldo es insuficiente, se avisa con antelación por correo + mensaje interno; el servicio no se interrumpe sin que lo sepas.</div>
  </div>
</div>

### Alertas de cuota

| Umbral de alerta | Forma de notificación |
|---------|---------|
| 30% restante | Mensaje interno |
| 10% restante | Mensaje interno + correo |
| Cuota agotada | Mensaje interno + correo + notificación WebSocket |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="coins" :size="14" /> 鹿贝</span>
  <h2 class="lurus-section-head__title">Economía de 鹿贝</h2>
  <p class="lurus-section-head__lede">Moneda de puntos unificada, canjeable proporcionalmente por Token y número de llamadas.</p>
</div>

### Valor de 鹿贝

Valor de referencia de 1 鹿贝 (LB):

| Recurso | 1 LB equivale a |
|------|------------|
| Token (modelos básicos) | aprox. 10,000 tokens |
| Token (modelos avanzados) | aprox. 3,000 tokens |
| Llamadas a la API | aprox. 5-10 veces (depende del modelo) |

### Tasas de recarga

| Importe de recarga (CNY) | 鹿贝 obtenidos | Precio unitario |
|----------------|---------|------|
| ¥10 | 10 LB | ¥1.00/LB |
| ¥50 | 55 LB | ¥0.91/LB |
| ¥100 | 115 LB | ¥0.87/LB |
| ¥500 | 600 LB | ¥0.83/LB |

Cuanto más recargues, menor será el precio unitario.

### Descuentos VIP acumulables

El descuento VIP se aplica automáticamente al gastar 鹿贝.

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="crown" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Ejemplo: Tarjeta Oro con 10% de descuento</p>
    <div class="lurus-callout__body">Un usuario con Tarjeta Oro que llama a gpt-4o (3 LB/vez) paga en realidad = <code>3 × 0.9 = 2.7 LB/次</code>.</div>
  </div>
</div>

### Vigencia de 鹿贝

Los 鹿贝 comprados son válidos de forma permanente; los obtenidos en promociones se rigen por las condiciones de la promoción; los reembolsos solo cubren la parte pagada en efectivo, los 鹿贝 de regalo no se reembolsan.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> Facturas</span>
  <h2 class="lurus-section-head__title">Facturas y comprobantes</h2>
</div>

- **Consultar la factura** ([identity.lurus.cn/wallet](https://identity.lurus.cn/wallet)): resumen mensual de consumo, detalle de transacciones, movimientos de 鹿贝 y estadísticas de uso de cuota.
- **Emitir comprobante** (admite factura del IVA ordinaria/especial): «Facturas» → «Solicitar comprobante» → completar los datos del comprobante (tras guardarlos la primera vez se rellenan automáticamente) → elegir el importe y el mes. El comprobante electrónico suele enviarse por correo en un plazo de 1 día hábil.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="repeat" :size="14" /> Reembolsos</span>
  <h2 class="lurus-section-head__title">Política de reembolsos</h2>
</div>

| Tipo | Política |
|------|------|
| Reembolso de suscripción | Reembolso íntegro dentro de los 7 días de la primera suscripción |
| Reembolso de recarga de 鹿贝 | Los 鹿贝 no utilizados pueden solicitarse para reembolso (descontando la parte de regalo) |
| Parte ya consumida | No reembolsable |

Para reembolsos, contacta con [support@lurus.cn](mailto:support@lurus.cn).

<NextSteps
  title="Próximos pasos"
  :steps="[
    { text: 'Resumen de la plataforma', link: '/es/platform/', primary: true },
    { text: 'Preguntas frecuentes', link: '/es/platform/faq' },
    { text: 'Obtener una API Key', link: '/es/guide/get-api-key' },
  ]"
/>

</div>
