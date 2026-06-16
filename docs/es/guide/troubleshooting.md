---
title: Solución de problemas
description: Una sola página para localizar los problemas frecuentes de todos los productos Lurus —— 401 / modelo sin canal / 429 / cuota insuficiente / contexto excedido / tiempo de espera, con códigos de error y rutas de solución.
---

<div class="troubleshooting-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> Solución de problemas</span>
  <h1 class="lurus-section-head__title">¿Tienes un problema? Empieza aquí</h1>
  <p class="lurus-section-head__lede">Primero localiza el destino según el síntoma y luego despliega la tabla de problemas frecuentes para revisar. No repetimos contenido, solo te dirigimos a la página autoritativa.</p>
</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--api" href="/es/api/errors">
    <span class="lurus-card__icon"><Icon name="alert-circle" :size="22" /></span>
    <div class="lurus-card__title">Errores de la API (4xx / 5xx)</div>
    <p class="lurus-card__body">Códigos de error completos, estructura de respuesta y estrategia de reintento —— 401 / 402 / 404 / 429 / 5xx de un vistazo.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/es/guide/faq">
    <span class="lurus-card__icon"><Icon name="key-round" :size="22" /></span>
    <div class="lurus-card__title">Cuenta, Key y autenticación</div>
    <p class="lurus-card__body">Registro, pérdida de la API Key, diagnóstico de Key inválida, y problemas frecuentes con modelos y llamadas en streaming.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/es/platform/billing">
    <span class="lurus-card__icon"><Icon name="wallet" :size="22" /></span>
    <div class="lurus-card__title">Facturación y cuota</div>
    <p class="lurus-card__body">Cuota gratuita, planes de suscripción, reglas de cobro de 鹿贝, y qué hacer cuando se agota la cuota.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/es/guide/clients/others">
    <span class="lurus-card__icon"><Icon name="plug" :size="22" /></span>
    <div class="lurus-card__title">El cliente no conecta</div>
    <p class="lurus-card__body">Integración y diagnóstico de clientes de terceros como Cherry Studio / Lobe Chat / OpenCat.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/es/platform/faq">
    <span class="lurus-card__icon"><Icon name="layers" :size="22" /></span>
    <div class="lurus-card__title">Problemas específicos del producto</div>
    <p class="lurus-card__body">Plataforma, MemX, Lucrum y demás productos tienen su propia FAQ; consulta primero la página de preguntas frecuentes de la documentación del producto correspondiente.</p>
  </a>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="search" :size="14" /> Síntomas frecuentes</span>
  <h2 class="lurus-section-head__title">Diagnóstico por mensaje de error</h2>
  <p class="lurus-section-head__lede">Despliega el error que encontraste y sigue la lista de comprobación. Para los códigos de error detallados, consulta <a href="/es/api/errors">Manejo de errores</a>.</p>
</div>

<details class="lurus-faq-item" id="invalid-api-key">
<summary>Devuelve <code>401 Unauthorized</code> / <code>invalid_api_key</code></summary>

```json
{ "error": { "code": "invalid_api_key", "type": "authentication_error" } }
```

`authentication_error` indica que la Key es inválida o falta. Revisa punto por punto:

- La Key está completa, empieza por `sk-`, sin espacios ni saltos de línea de más (cópiala de nuevo)
- El formato del encabezado de la petición es `Authorization: Bearer sk-xxxx` (hay un espacio después de `Bearer`)
- El estado de la Key es «habilitada» (consola → gestión de tokens)
- El nombre de la variable de entorno está bien escrito y ya se ha cargado

**No reintentes** un 401; corrige primero la Key y vuelve a enviar. Más detalles en [Autenticación](/es/api/authentication) y [Preguntas frecuentes: cómo diagnosticar una Key inválida](/es/guide/faq).

</details>

<details class="lurus-faq-item">
<summary>Devuelve <code>"no available server"</code> / <code>model_not_found</code> (HTTP 404)</summary>

```json
{ "error": { "code": "model_not_found", "message": "模型 xxx 无可用渠道", "type": "new_api_error" } }
```

- Verifica la ortografía del nombre del `model` (distingue mayúsculas y minúsculas)
- Confirma que esta Key tiene permiso para acceder a este modelo
- Es posible que este modelo no tenga ningún canal disponible por ahora
- Si acabas de crear la Key, espera unos 10 segundos y vuelve a intentarlo

La lista de modelos disponibles está en [Modelos compatibles](/guide/models).

</details>

<details class="lurus-faq-item">
<summary>Devuelve <code>429 Too Many Requests</code> / <code>rate_limit_exceeded</code></summary>

```json
{ "error": { "code": "rate_limit_exceeded", "type": "rate_limit_error" } }
```

Se ha superado el límite de velocidad. Cómo proceder:

- Reduce la frecuencia de las peticiones y reintenta con **retroceso exponencial** de `2 ** attempt` segundos
- Free permite 60 RPM por defecto; sube a Pro / Team para aumentar el límite
- Si tras pagar sigue activándose con frecuencia, contacta con <a href="mailto:support@lurus.cn">support@lurus.cn</a>

Un ejemplo de código de reintento está en [Manejo de errores · Buenas prácticas](/es/api/errors#错误处理最佳实践).

</details>

<details class="lurus-faq-item" id="insufficient-quota">
<summary>Devuelve <code>402</code> / <code>insufficient_quota</code> (cuota / saldo insuficiente)</summary>

```json
{ "error": { "code": "insufficient_quota", "type": "billing_error" } }
```

- Comprueba primero si has agotado la cuota gratuita del día (el plan Free permite 100 veces/día)
- Consulta el saldo de 鹿贝: [identity.lurus.cn/wallet](https://identity.lurus.cn/wallet)
- Recarga por autoservicio o sube de plan; las reglas están en [Información de facturación](/es/platform/billing)

</details>

<details class="lurus-faq-item">
<summary><code>context_length_exceeded</code> (contexto excedido)</summary>

```json
{ "error": { "code": "context_length_exceeded", "type": "invalid_request_error" } }
```

Como `deepseek-chat` con 64K o `gemini-3-pro-preview` con 1M, cuando se supera el tope del modelo:

- Reduce la entrada, recorta los mensajes del historial
- Usa una ventana deslizante (conserva el system + las últimas N rondas)
- Cambia a un modelo con contexto más largo

</details>

<details class="lurus-faq-item">
<summary>Petición agotada / sin respuesta durante mucho tiempo</summary>

1. Comprueba la conectividad de red: `curl https://api.lurus.cn/v1/models`
2. Reduce `max_tokens`
3. Que los modelos de razonamiento (`deepseek-reasoner`) tarden en pensar es normal
4. El tiempo de espera por defecto del SDK es de unos 60 segundos; puedes aumentar `timeout`
5. Un tiempo de espera persistente puede deberse a un fallo upstream; prueba con otro modelo

</details>

---

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">¿No lo encontraste? Contacta con support@lurus.cn</p>
    <div class="lurus-callout__body">Adjunta: el contenido completo del mensaje de error, el ID de la petición (encabezado de respuesta <code>X-Request-ID</code>), la hora en que ocurrió y los pasos para reproducirlo, para localizarlo rápidamente.</div>
  </div>
</div>

<NextSteps
  title="Documentación relacionada"
  :steps="[
    { text: 'Manejo de errores (códigos de error completos)', link: '/es/api/errors', primary: true },
    { text: 'Preguntas frecuentes', link: '/es/guide/faq' },
    { text: 'Información de facturación', link: '/es/platform/billing' },
  ]"
/>

</div>
