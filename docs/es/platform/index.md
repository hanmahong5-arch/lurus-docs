---
title: Lurus Platform — Cuentas y facturación
description: Descripción del sistema unificado de cuentas, los planes de suscripción, la billetera 鹿贝 y el sistema de facturación de Lurus.
---

<div class="platform-page">

<ProductHero product-id="platform" />

## Descripción general

**Lurus Platform** es la infraestructura unificada de cuentas y facturación que comparten todos los productos de Lurus. Tanto si usas Lurus API, Lucrum, Switch u otros productos, todos inician sesión con la misma cuenta de Lurus y comparten el mismo saldo de la billetera y el mismo plan de suscripción.

<CapabilityGrid
  accent="var(--lurus-color-platform)"
  title="Los cuatro pilares de la plataforma"
  :items="[
    { title: 'Cuenta unificada', body: 'Identidad, saldo y suscripción compartidos entre todos los productos de Lurus', icon: 'user-check' },
    { title: 'Billetera 鹿贝', body: 'Unidad de facturación unificada, cobro por uso y consulta de saldo en tiempo real', icon: 'coins' },
    { title: 'Planes de suscripción', body: 'Cuota gratuita + pago por uso + planes empresariales', icon: 'package-2' },
    { title: 'Programa VIP', body: 'Sube de nivel según tus recargas acumuladas; las suscripciones tienen descuento', icon: 'crown' },
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
    <span class="lurus-card__icon"><Icon name="coins" :size="20" /></span>
    <div class="lurus-card__title">Billetera 鹿贝</div>
    <p class="lurus-card__body">Se abre al registrarte; 1 CNY = 1 鹿贝, compartida entre todos los productos</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="gauge" :size="20" /></span>
    <div class="lurus-card__title">Cuota gratuita</div>
    <p class="lurus-card__body">Tras registrarte puedes probar Lurus API de inmediato</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="mail" :size="20" /></span>
    <div class="lurus-card__title">Correo @lurus.cn</div>
    <p class="lurus-card__body">Se habilita automáticamente <code>username@lurus.cn</code> (basado en Stalwart)</p>
  </div>
</div>

**Gestión de la cuenta** (inicia sesión en [identity.lurus.cn](https://identity.lurus.cn) → Configuración de la cuenta): información personal, historial de inicios de sesión, vinculaciones de terceros, configuración de seguridad (cambiar contraseña, verificación en dos pasos).

**Un solo inicio de sesión, acceso en todo el sitio**: basado en el estándar OIDC, al iniciar sesión en cualquier producto se establece una sesión entre todos los productos; admite Passkey/WebAuthn sin contraseña, MFA con TOTP/llaves de hardware, e inicio de sesión social con GitHub/Google, y las empresas pueden integrar SSO con Azure AD/Feishu/Okta. Los usuarios finales usan una sola cuenta para API/Lucrum/Switch/Creator/Lutu; los desarrolladores integran sus propias aplicaciones con el SDK de OIDC, y el backend usa Service User + JWT Profile; la gestión organizativa empresarial (miembros/permisos/auditoría) se realiza a través de [identity.lurus.cn](https://identity.lurus.cn) (consola de Zitadel) o contactando con el equipo comercial para activarla.

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

También hay un plan independiente para Claude Code. Los precios concretos se rigen por la consola de [identity.lurus.cn](https://identity.lurus.cn) (página de gestión de suscripciones).

### Facturación por uso

Una vez superada la cuota incluida en la suscripción, el cobro se realiza automáticamente desde la billetera 鹿贝. El precio unitario varía según el modelo; se rige por lo que muestre la consola.

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="receipt" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">¿Quieres ver los precios completos, las reglas de cuota y los ratios de recarga?</p>
    <div class="lurus-callout__body"><a href="/es/platform/billing">Detalles de facturación</a> desglosa la comparación de planes de suscripción, el cálculo de cuotas, las reglas de recarga de 鹿贝 y la política de reembolsos.</div>
  </div>
</div>

---

## Billetera 鹿贝 {#wallet}

**鹿贝 (LB)** es la unidad contable de la billetera de la plataforma Lurus: 1 鹿贝 = 1 CNY. Se utiliza para pagar los cargos por uso de todos los productos.

### Obtener 鹿贝

| Vía | Recompensa | Descripción |
|------|------|------|
| **Compra con recarga** | 1 CNY = 1 鹿贝 | Recibes exactamente lo que recargas; si hay una promoción de recarga, vale lo que muestre la página de recarga |
| **Registro diario** | 0,1 鹿贝 al día | ×1,5 por cada racha completa de 7 días seguidos, máximo 1 鹿贝 al día |
| **Recomendar amigos** | 5 鹿贝 por persona | Cuando un amigo se registra con tu enlace de recomendación, tú recibes 5 鹿贝; sin límite de invitaciones |

### Usar 鹿贝

Se pueden usar para: pagar los cargos por uso de todos los productos (como las llamadas a la API que exceden la cuota de la suscripción) y comprar suscripciones.

### Niveles VIP

El nivel VIP se determina por el importe acumulado de recargas (o por una suscripción anual). El descuento VIP se aplica automáticamente al comprar y renovar suscripciones; las recargas y los cargos por uso no tienen descuento. Los umbrales predeterminados son recargas acumuladas de ¥500 / ¥2,000 / ¥10,000 / ¥50,000, con un 2% / 5% / 8% / 10% de descuento respectivamente; prevalece lo que indique la consola.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">Standard</span><span class="lurus-stat__label">Inicial</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Silver</span><span class="lurus-stat__label">Plata</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Gold</span><span class="lurus-stat__label">Oro</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Platinum</span><span class="lurus-stat__label">Platino</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Diamond</span><span class="lurus-stat__label">Diamante</span></div>
</div>

Consulta los umbrales y descuentos en la página VIP del centro de cuentas de [identity.lurus.cn](https://identity.lurus.cn).

---

## Métodos de pago

Todos los pagos se confirman de forma asíncrona mediante un Webhook seguro, para evitar cobros duplicados por fluctuaciones de la red.

| Método | Escenario | Descripción |
|------|----------|------|
| **Stripe** | Suscripción + recarga | Tarjeta de crédito/débito (Visa, Mastercard) |
| **Creem** | Recarga | Pago con criptomonedas |
| **Epay** | Recarga | Alipay/WeChat Pay (terceros) |

---

## Programa de recomendación

En [identity.lurus.cn](https://identity.lurus.cn) copia tu enlace de recomendación exclusivo (con código de referido) y compártelo con tus amigos. Recompensa: cuando un amigo se registra a través de tu enlace, tú recibes 5 鹿贝; sin límite de invitaciones.

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
    { text: 'Autenticación de identidad (Zitadel)', link: '/es/platform/auth/', primary: true },
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
