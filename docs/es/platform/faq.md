---
title: Preguntas frecuentes de la plataforma
description: Preguntas frecuentes y respuestas sobre la cuenta, la facturación y los servicios de la plataforma Lurus.
---

<div class="faq-page">

# Preguntas frecuentes

Preguntas frecuentes sobre la cuenta de la plataforma, la facturación de suscripciones, los 鹿贝 y la seguridad, agrupadas por tema.

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> Cuenta</span>
  <h2 class="lurus-section-head__title">Cuenta</h2>
</div>

<details class="lurus-faq-item">
<summary>¿Una sola cuenta sirve para todos los productos?</summary>

Sí. Sistema de cuenta unificado: te registras una vez e inicias sesión en todos los productos (API, Lucrum, Switch, Creator, etc.), compartiendo el saldo de la billetera y el plan de suscripción.

</details>

<details class="lurus-faq-item">
<summary>¿Cómo cambio la contraseña?</summary>

Inicia sesión en [identity.lurus.cn](https://identity.lurus.cn) → Configuración de la cuenta → Seguridad → Cambiar contraseña.

</details>

<details class="lurus-faq-item">
<summary>¿Qué hago si olvidé mi contraseña?</summary>

En la página de inicio de sesión haz clic en «Olvidé mi contraseña» y recibirás un enlace de restablecimiento en el correo de registro.

</details>

<details class="lurus-faq-item">
<summary>¿Cómo elimino mi cuenta?</summary>

Contacta a [support@lurus.cn](mailto:support@lurus.cn) para darla de baja; todos los datos (API Key / 鹿贝 / historial de transacciones) se eliminan permanentemente y no se pueden recuperar.

</details>

<details class="lurus-faq-item">
<summary>¿Qué inicios de sesión de terceros se admiten?</summary>

GitHub y Google OAuth; se vinculan / desvinculan en la configuración de la cuenta.

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package-2" :size="14" /> Suscripción y facturación</span>
  <h2 class="lurus-section-head__title">Suscripción y facturación</h2>
</div>

<details class="lurus-faq-item">
<summary>¿Cómo subo / bajo de plan?</summary>

Inicia sesión en [identity.lurus.cn](https://identity.lurus.cn) → Gestión de suscripciones → «Cambiar plan»: tanto la mejora como la rebaja se aplican de inmediato, y la diferencia por los días restantes se cobra o se devuelve en la billetera. No se puede cambiar directamente entre pago mensual y anual.

</details>

<details class="lurus-faq-item">
<summary>¿Qué pasa cuando vence la suscripción?</summary>

Tras el vencimiento hay un periodo de gracia de 3 días; después vuelves a Free. La API Key sigue siendo válida pero queda limitada por la cuota de Free, y los datos se conservan para restaurarlos al renovar en cualquier momento.

</details>

<details class="lurus-faq-item">
<summary>¿Qué diferencia hay entre el pago anual y el mensual?</summary>

El pago anual cuesta menos en total que 12 meses de pago mensual; los precios concretos se rigen por la consola. No se puede cambiar directamente entre pago anual y mensual.

</details>

<details class="lurus-faq-item">
<summary>¿Cómo agrego miembros al equipo en la edición Enterprise?</summary>

Consola de administración → Equipo → Invitar miembros → introducir el correo y enviar la invitación → el miembro la acepta y se une → puedes asignar una API Key y una cuota independientes a cada miembro.

</details>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="receipt" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">¿Quieres ver las reglas completas de cuotas y precios?</p>
    <div class="lurus-callout__body">Consulta los <a href="/es/platform/billing">detalles de facturación</a>.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="coins" :size="14" /> 鹿贝</span>
  <h2 class="lurus-section-head__title">鹿贝</h2>
</div>

<details class="lurus-faq-item">
<summary>¿Para qué sirven los 鹿贝?</summary>

Para pagar los cargos por uso de todos los productos (como las llamadas a la API que superen la cuota de la suscripción); también sirven para comprar suscripciones. 1 鹿贝 = 1 CNY.

</details>

<details class="lurus-faq-item">
<summary>¿Los 鹿贝 caducan?</summary>

El saldo obtenido con recargas no caduca; los créditos regalados en promociones pueden tener fecha de vencimiento, según las reglas de la promoción.

</details>

<details class="lurus-faq-item">
<summary>¿Se pueden retirar los 鹿贝?</summary>

No se pueden retirar. Una recarga no utilizada puede reembolsarse como pedido completo dentro de los 7 días tras el pago.

</details>

<details class="lurus-faq-item">
<summary>¿Cómo consulto el saldo y el historial de movimientos?</summary>

Inicia sesión en [identity.lurus.cn](https://identity.lurus.cn) → Billetera, para ver el saldo actual, el detalle de ingresos (recargas / recompensas / ingresos de estrategias) y el detalle de gastos (consumo de API / suscripciones a estrategias).

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="wallet" :size="14" /> Pagos</span>
  <h2 class="lurus-section-head__title">Pagos</h2>
</div>

Métodos de pago:

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="receipt" :size="20" /></span>
    <div class="lurus-card__title">Stripe</div>
    <p class="lurus-card__body">Tarjeta de crédito / débito, a nivel mundial</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="coins" :size="20" /></span>
    <div class="lurus-card__title">Creem</div>
    <p class="lurus-card__body">Criptomonedas</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="wallet" :size="20" /></span>
    <div class="lurus-card__title">Epay</div>
    <p class="lurus-card__body">Alipay / WeChat, China continental</p>
  </div>
</div>

<details class="lurus-faq-item">
<summary>¿Qué hago si el pago no se acredita?</summary>

Normalmente se confirma en menos de 1 minuto; si pasan más de 5 minutos sin acreditarse, verifica si la plataforma de pago realizó el cargo, revisa el correo de confirmación y contacta a [support@lurus.cn](mailto:support@lurus.cn) indicando el número de orden de pago.

</details>

<details class="lurus-faq-item">
<summary>¿Cómo solicito una factura?</summary>

Puedes solicitar una factura en la consola por cada pedido pagado indicando la razón social y el número de identificación fiscal; se emite manualmente y después puedes descargarla.

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> Seguridad</span>
  <h2 class="lurus-section-head__title">Seguridad</h2>
</div>

<details class="lurus-faq-item">
<summary>¿Mis datos están seguros?</summary>

HTTPS de extremo a extremo (TLS 1.3); las contraseñas se almacenan cifradas con bcrypt; los pagos pasan por terceros conformes a PCI DSS; el contenido de las llamadas a la API no se almacena (solo se registran metadatos para la facturación).

</details>

<details class="lurus-faq-item">
<summary>¿Qué hago si me roban la API Key?</summary>

Desactiva de inmediato esa Key en la consola → crea una Key nueva → revisa los registros de llamadas para confirmar consumos anómalos → contacta a soporte para gestionar los cargos indebidos.

</details>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">¿No encontraste la respuesta?</p>
    <div class="lurus-callout__body">Contacta a <a href="mailto:support@lurus.cn">support@lurus.cn</a>.</div>
  </div>
</div>

<NextSteps
  title="Próximos pasos"
  :steps="[
    { text: 'Resumen de la plataforma', link: '/es/platform/', primary: true },
    { text: 'Detalles de facturación', link: '/es/platform/billing' },
    { text: 'Obtener una API Key', link: '/es/guide/get-api-key' },
  ]"
/>

</div>
