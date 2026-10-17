---
title: Detalles de facturación
description: Explicación detallada de los planes de suscripción, la gestión de cuotas y el sistema económico de 鹿贝 de Lurus.
---

<div class="billing-page">

# Detalles de facturación <StatusBadge status="live" />

Planes de suscripción, gestión de cuotas y sistema económico de 鹿贝.

<MetricStats
  :items="[
    { label: 'Planes de suscripción', value: '5 niveles', hint: 'Free → Enterprise, más un plan para Claude Code' },
    { label: 'Métodos de pago', value: '3 tipos', hint: 'Stripe / Creem / Epay' },
    { label: '鹿贝', value: '1 CNY = 1 LB', hint: 'recibes exactamente lo que recargas' },
    { label: 'Ventana de reembolso', value: '7 días', hint: 'pedido completo, dentro de los 7 días tras el pago' },
  ]"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package-2" :size="14" /> Suscripción</span>
  <h2 class="lurus-section-head__title">Comparativa de planes de suscripción</h2>
  <p class="lurus-section-head__lede">Desde la prueba gratuita hasta el SLA empresarial: elige según tu nivel de uso.</p>
</div>

| Plan | Posicionamiento | Descripción |
|------|------|------|
| **Free** | Prueba gratuita | Cuota gratuita diaria, menos modelos disponibles |
| **Basic** | Suscripción mensual de iniciación | Desarrolladores individuales |
| **Pro** | Suscripción avanzada, mensual o anual | El pago anual cuesta menos en total que 12 meses de pago mensual |
| **Enterprise** | Equipos / empresas | Despliegue privado, SLA, etc., según acuerdo comercial |

El precio, la cuota diaria y los modelos disponibles de cada nivel se rigen por la consola de [identity.lurus.cn](https://identity.lurus.cn) (página de gestión de suscripciones); los cambios del administrador se aplican al instante, por lo que esta página no mantiene una copia de las cifras. También hay un plan independiente para Claude Code, que igualmente se rige por la consola.

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="briefcase" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Plan empresarial</p>
    <div class="lurus-callout__body">¿Necesitas despliegue privado, centro de datos a elección o SLA? Contacta con <a href="mailto:business@lurus.cn">business@lurus.cn</a>.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> Cuota</span>
  <h2 class="lurus-section-head__title">Gestión de cuotas</h2>
  <p class="lurus-section-head__lede">Primero se usa la cuota de la suscripción; al agotarse, se cobra de la billetera de 鹿贝 según el precio unitario del modelo.</p>
</div>

### Cálculo de la cuota

Cada llamada se factura según el precio unitario del modelo y el uso de Token: los modelos de chat cobran la entrada y la salida por separado, y la generación de imágenes y similares se cobra por llamada. Los precios unitarios de cada modelo son los que muestra la consola.

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
    <div class="lurus-callout__body">Recibes un aviso cuando el saldo de la billetera baja del umbral que hayas configurado; si el saldo es insuficiente, la solicitud devuelve 402 directamente: no se genera una deuda para reclamarla después.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="coins" :size="14" /> 鹿贝</span>
  <h2 class="lurus-section-head__title">Economía de 鹿贝</h2>
  <p class="lurus-section-head__lede">La unidad contable de la billetera: 1 鹿贝 = 1 CNY.</p>
</div>

### Recarga

Al recargar 1 CNY recibes 1 鹿贝, sin bonificaciones escalonadas. Si el administrador ha configurado una promoción de recarga, vale el importe a pagar que muestre la página de recarga.

### Descuentos VIP

El nivel VIP se determina por el importe acumulado de recargas (o por una suscripción anual), y el descuento se aplica automáticamente al comprar y renovar suscripciones; las recargas y los cargos por uso no tienen descuento.

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="crown" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Ejemplo: Tarjeta Oro con 5% de descuento</p>
    <div class="lurus-callout__body">Con los umbrales predeterminados, alcanzas la Tarjeta Oro con ¥2,000 de recargas acumuladas; al renovar una suscripción mensual de ¥99 pagas <code>99 × 0.95 = ¥94.05</code>. Los umbrales y descuentos se rigen por la consola.</div>
  </div>
</div>

### Vigencia de 鹿贝

El saldo obtenido con recargas no caduca; los créditos de promociones pueden tener fecha de vencimiento, según las condiciones de la promoción.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> Facturas</span>
  <h2 class="lurus-section-head__title">Facturas y comprobantes</h2>
</div>

- **Consultar la factura** ([identity.lurus.cn/wallet](https://identity.lurus.cn/wallet)): resumen mensual de consumo, detalle de transacciones, movimientos de 鹿贝 y estadísticas de uso de cuota.
- **Emitir comprobante**: puedes solicitar un comprobante por cada pedido pagado indicando la razón social y el número de identificación fiscal; se emite manualmente y después puedes descargarlo desde la consola.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="repeat" :size="14" /> Reembolsos</span>
  <h2 class="lurus-section-head__title">Política de reembolsos</h2>
</div>

| Tipo | Política |
|------|------|
| Suscripción | Se solicita en la consola dentro de los 7 días tras el pago; una vez aprobada, se reembolsa el pedido completo |
| Recarga | Dentro de los 7 días tras el pago, si esa recarga no se ha usado, puede solicitarse el reembolso del pedido completo |
| Parte ya consumida | No reembolsable |

Los pagos con Alipay, WeChat Pay y Stripe se reembolsan al medio de pago original; los demás métodos se reembolsan a la billetera.

<NextSteps
  title="Próximos pasos"
  :steps="[
    { text: 'Resumen de la plataforma', link: '/es/platform/', primary: true },
    { text: 'Preguntas frecuentes', link: '/es/platform/faq' },
    { text: 'Obtener una API Key', link: '/es/guide/get-api-key' },
  ]"
/>

</div>
