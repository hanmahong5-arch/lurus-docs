---
title: Lurus Platform — Cuentas y facturación
description: Descripción del sistema unificado de cuentas, los planes de suscripción, la billetera de la cuenta y el sistema de facturación de Lurus.
---

<div class="platform-page">

<ProductHero product-id="platform" />

## Descripción general

**Lurus Platform** es la infraestructura unificada de cuentas y facturación que comparten todos los productos de Lurus. Tanto si usas Lurus API, Lucrum, Switch u otros productos, todos inician sesión con la misma cuenta de Lurus y comparten el mismo saldo de la billetera y el mismo plan de suscripción.

<CapabilityGrid
  accent="var(--lurus-color-platform)"
  title="Capacidades básicas de la plataforma"
  :items="[
    { title: 'Cuenta unificada', body: 'Identidad, saldo y suscripción compartidos entre todos los productos de Lurus', icon: 'user-check' },
    { title: 'Billetera de la cuenta', body: 'Registra el saldo y el detalle de transacciones para el cobro por uso', icon: 'coins' },
    { title: 'Planes de suscripción', body: 'Suscripción individual o contrato empresarial', icon: 'package-2' },
  ]"
/>

---

## Cuenta unificada

Visita cualquier producto de Lurus ([hub.lurus.cn](https://hub.lurus.cn), [lucrum.lurus.cn](https://lucrum.lurus.cn), etc.) para registrarte o iniciar sesión. **Métodos de inicio de sesión**: correo + contraseña, GitHub (OAuth), Google (OAuth).

Al registrarte con éxito obtienes:

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="user-check" :size="20" /></span>
    <div class="lurus-card__title">Identidad de usuario unificada</div>
    <p class="lurus-card__body">Una sola cuenta común a todos los productos</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="mail" :size="20" /></span>
    <div class="lurus-card__title">Correo @lurus.cn</div>
    <p class="lurus-card__body">Se habilita automáticamente <code>username@lurus.cn</code> (basado en Stalwart)</p>
  </div>
</div>

**Gestión de la cuenta** (inicia sesión en [identity.lurus.cn](https://identity.lurus.cn) → Configuración de la cuenta): información personal, historial de inicios de sesión, vinculaciones de terceros, configuración de seguridad (cambiar contraseña, verificación en dos pasos).

**Un solo inicio de sesión, acceso en todo el sitio**: basado en el estándar OIDC, al iniciar sesión en cualquier producto se establece una sesión entre todos los productos; admite Passkey/WebAuthn sin contraseña, MFA con TOTP/llaves de hardware, e inicio de sesión social con GitHub/Google, y las empresas pueden integrar SSO con Azure AD/Feishu/Okta. Los usuarios finales usan una sola cuenta para API/Lucrum/Switch/Creator/Lutu; los desarrolladores integran sus propias aplicaciones con el SDK de OIDC, y el backend usa Service User + JWT Profile; la gestión organizativa empresarial (miembros/permisos/auditoría) se realiza a través de [identity.lurus.cn](https://identity.lurus.cn) (consola de Casdoor) o contactando con el equipo comercial para activarla.

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Profundiza en la autenticación de identidad</p>
    <div class="lurus-callout__body"><a href="/es/platform/auth/">Autenticación de identidad unificada</a> · <a href="/es/platform/auth/oidc">Integración OIDC / OAuth2</a> · <a href="/es/platform/auth/api-auth">Autenticación de API</a></div>
  </div>
</div>

---

## Sistema de facturación

Lurus utiliza un modelo de facturación de doble vía «suscripción + por uso», que se adapta con flexibilidad a distintos niveles de consumo.

### Planes de suscripción

| Plan | Posicionamiento | Ideal para |
|------|------|------|
| **Free** | Cuota básica, uso gratuito | Pruebas personales |
| **Basic** | Suscripción mensual de inicio | Desarrolladores individuales |
| **Pro** | Suscripción mensual avanzada + modelos prioritarios | Usuarios intensivos |
| **Pro anual** | Descuento por pago anual de Pro | Usuarios estables |
| **Enterprise** | Personalización empresarial + SLA | Equipos / empresas |

Los precios concretos se rigen por la consola de [identity.lurus.cn](https://identity.lurus.cn) (página de gestión de suscripciones).

### Facturación por uso

Una vez superada la cuota incluida en la suscripción, el cobro se realiza desde el saldo de la billetera de la cuenta. El precio unitario varía según el modelo; se rige por lo que muestre la consola.

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="receipt" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Forma de facturación y reembolsos</p>
    <div class="lurus-callout__body"><a href="/es/platform/billing">Detalles de facturación</a> explica la forma de facturación actual, qué ocurre cuando el saldo es insuficiente, las facturas y los reembolsos.</div>
  </div>
</div>

---

## Billetera de la cuenta {#wallet}

La billetera de la cuenta registra el saldo y el detalle de transacciones, y se usa para pagar el consumo que supera la cuota de la suscripción. El saldo, el historial de transacciones y la recarga están en el centro de cuentas de [identity.lurus.cn](https://identity.lurus.cn). Los precios, bonificaciones y descuentos se rigen por la consola; esta documentación no incluye cifras concretas.

---

## Métodos de pago

Todos los pagos se confirman de forma asíncrona mediante Webhook, para evitar cobros duplicados por fluctuaciones de la red. Los canales de pago disponibles son los que muestre la página de pago; los clientes empresariales pueden pagar por contrato y transferencia bancaria.

---

## Servicio de notificaciones

Notificaciones multicanal (en la configuración de la cuenta puedes personalizar el canal de recepción de cada tipo de notificación):

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
    <div class="lurus-card__title">Mensajes internos</div>
    <p class="lurus-card__body">Cambios de cuenta / alertas de seguridad / anuncios del sistema</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="mail" :size="20" /></span>
    <div class="lurus-card__title">Correo electrónico</div>
    <p class="lurus-card__body">Confirmación de pago / alerta de cuota / vencimiento de suscripción</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">WebSocket</div>
    <p class="lurus-card__body">Notificaciones en tiempo real de errores de API / saldo insuficiente</p>
  </div>
</div>

---

## Seguridad de los datos

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">Autenticación de identidad de nivel empresarial</div>
    <p class="lurus-card__body">Sistema basado en el estándar <Term t="OIDC">OIDC</Term></p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="lock" :size="20" /></span>
    <div class="lurus-card__title">HTTPS en todo el sitio</div>
    <p class="lurus-card__body">Cifrado TLS 1.3 durante toda la transmisión</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="key" :size="20" /></span>
    <div class="lurus-card__title">Contraseñas sin texto plano</div>
    <p class="lurus-card__body">Almacenamiento cifrado con bcrypt</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="receipt" :size="20" /></span>
    <div class="lurus-card__title">Pasarela de pago conforme a normativa</div>
    <p class="lurus-card__body">Los pagos pasan por un tercero conforme a PCI DSS</p>
  </div>
</div>

Los datos de los usuarios están estrictamente aislados y no se comparten.

---

<NextSteps
  title="Siguientes pasos"
  :steps="[
    { text: 'Autenticación de identidad (Casdoor)', link: '/es/platform/auth/', primary: true },
    { text: 'Detalles de facturación', link: '/es/platform/billing' },
    { text: 'Preguntas frecuentes', link: '/es/platform/faq' },
    { text: 'Obtener API Key', link: '/es/guide/get-api-key' },
  ]"
/>

<!-- lurus:related-block -->

<RelatedProducts product-id="platform" />

</div>

<style>
.platform-page .lurus-card code {
  font-size: 0.85em;
}
</style>
