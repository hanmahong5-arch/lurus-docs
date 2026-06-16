---
title: Obtener una API Key
description: Pasos completos para registrar una cuenta de Lurus y obtener una API Key.
---

<div class="getkey-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="key-round" :size="14" /> Obtener una API Key</span>
  <h1 class="lurus-section-head__title">Registra una cuenta y crea tu primera Key</h1>
  <p class="lurus-section-head__lede">Consigue una API Key lista para usar en 3 minutos.</p>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Integración OIDC / OAuth</p>
    <div class="lurus-callout__body">Para que los usuarios finales inicien sesión en tu propia aplicación con su cuenta de Lurus, o para que el backend realice llamadas mediante Service User + JWT Profile, puedes optar por la autenticación de identidad unificada: <a href="/es/platform/auth/oidc">Integración OIDC / OAuth2</a> · <a href="/es/platform/auth/api-auth">Autenticación de API (PAT/JWT)</a>. La API Key y el token OIDC coexisten; ambos son válidos.</div>
  </div>
</div>

## Registro y creación de la Key

<ol class="lurus-steps">
<li>

Accede a la [consola de Lurus](https://api.lurus.cn) → «Registrarse» → introduce el correo y la contraseña → completa la verificación del correo.

</li>
<li>

Inicia sesión → «Gestión de tokens» en el panel izquierdo → «Crear nuevo token» → introduce un nombre para el token (para identificarlo fácilmente) → confirma.

</li>
</ol>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Se muestra una sola vez</p>
    <div class="lurus-callout__body">Tras crearla, copia y guarda la API Key de inmediato: <strong>solo se muestra una vez</strong>.</div>
  </div>
</div>

## Formato de la API Key

Comienza con `sk-` y tiene 48 caracteres aleatorios: `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.

## Gestión de la API Key

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="bar-chart-3" :size="22" /></span>
    <div class="lurus-card__title">Ver el consumo</div>
    <p class="lurus-card__body">La página «Gestión de tokens» muestra para cada Key la cuota consumida, la cuota restante y la hora de la última llamada.</p>
  </div>
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="lock" :size="22" /></span>
    <div class="lurus-card__title">Desactivar / eliminar</div>
    <p class="lurus-card__body">Desactivar = suspender el permiso de uso (recuperable); eliminar = borrado permanente (no recuperable).</p>
  </div>
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="filter" :size="22" /></span>
    <div class="lurus-card__title">Configurar permisos de modelos</div>
    <p class="lurus-card__body">Haz clic en «Editar» junto a la Key → «Modelos disponibles» selecciona los modelos permitidos → guarda.</p>
  </div>
</div>

## Recomendaciones de seguridad

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Trata la Key como una contraseña</p>
    <div class="lurus-callout__body">No la divulgues (no la subas a repositorios públicos); rota la Key cada 90 días; usa el mínimo privilegio (concede solo los modelos necesarios); revisa periódicamente los registros de llamadas para detectar anomalías y actuar a tiempo.</div>
  </div>
</div>

## Preguntas frecuentes

<details class="lurus-faq-item">
<summary>¿Qué hago si olvidé la Key?</summary>

No se puede recuperar; crea una nueva Key.

</details>

<details class="lurus-faq-item">
<summary>¿Y si robaron mi Key?</summary>

Desactívala o elimínala de inmediato y crea una nueva Key.

</details>

<details class="lurus-faq-item">
<summary>¿Se agotó la cuota?</summary>

Recarga por tu cuenta o mejora tu plan: primero consulta los niveles (Free / Basic / Pro) en [Detalles de facturación](/es/platform/billing) y luego recarga o mejora el plan en la [consola](https://api.lurus.cn).

</details>

<NextSteps
  title="Siguientes pasos"
  :steps="[
    { text: 'Inicio rápido', link: '/es/guide/quickstart', primary: true },
    { text: 'Modelos compatibles', link: '/guide/models' },
    { text: 'Detalles de facturación', link: '/es/platform/billing' },
  ]"
/>

</div>
