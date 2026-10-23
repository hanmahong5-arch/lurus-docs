---
title: Detalles de facturación
description: Forma de facturación actual de Lurus, qué ocurre cuando el saldo es insuficiente, facturas y reembolsos.
---

<div class="billing-page">

# Detalles de facturación

Esta página solo explica la forma de facturación y no incluye precios concretos. Los precios y las cuotas se rigen por la consola y por el contrato.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package-2" :size="14" /> Modalidades</span>
  <h2 class="lurus-section-head__title">Formas de facturación</h2>
</div>

- **Contrato empresarial**: el despliegue privado y la entrega gestionada se liquidan según el alcance acordado en el contrato, mediante transferencia bancaria y con factura. Si necesitas despliegue privado o un centro de datos concreto, escribe a [business@lurus.cn](mailto:business@lurus.cn).
- **Suscripción individual**: consulta los planes y precios disponibles en la página de gestión de suscripciones de [identity.lurus.cn](https://identity.lurus.cn); el consumo que supera la cuota de la suscripción se descuenta del saldo de la [billetera de la cuenta](/es/platform/#wallet).
- **Cuotas por inquilino**: en [Lurus Hub](/hub/), los administradores del inquilino pueden gestionar cuotas por separado para organizaciones, equipos o clientes finales y consultar el uso.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> Cuota</span>
  <h2 class="lurus-section-head__title">Cuota o saldo insuficiente</h2>
</div>

Cada llamada consume cuota según el modelo y el uso de Token; cuando tanto la cuota como el saldo son insuficientes, la solicitud se rechaza con un error de cuota insuficiente. Los pasos de diagnóstico están en [Solución de problemas · Cuota / saldo insuficiente](/es/guide/troubleshooting#insufficient-quota).

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> Facturas</span>
  <h2 class="lurus-section-head__title">Movimientos, facturas y reembolsos</h2>
</div>

- **Consultar movimientos**: inicia sesión en [identity.lurus.cn](https://identity.lurus.cn) para ver el detalle de transacciones y las estadísticas de uso.
- **Facturas**: en los contratos empresariales se emiten según el contrato; en otros casos, contacta con [support@lurus.cn](mailto:support@lurus.cn).
- **Reembolsos**: contacta con [support@lurus.cn](mailto:support@lurus.cn); la parte ya consumida no es reembolsable.

<NextSteps
  title="Próximos pasos"
  :steps="[
    { text: 'Resumen de la plataforma', link: '/es/platform/', primary: true },
    { text: 'Preguntas frecuentes', link: '/es/platform/faq' },
    { text: 'Obtener una API Key', link: '/es/guide/get-api-key' },
  ]"
/>

</div>
