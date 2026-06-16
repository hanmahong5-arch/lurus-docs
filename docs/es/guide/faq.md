---
title: Preguntas frecuentes de la API de Lurus
description: Preguntas frecuentes y respuestas sobre el uso de la API de Lurus, incluyendo facturación, compatibilidad y resolución de problemas.
---

<div class="faq-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> Preguntas frecuentes</span>
  <h1 class="lurus-section-head__title">Preguntas frecuentes</h1>
  <p class="lurus-section-head__lede">Cuenta, modelos, facturación, resolución de problemas —— desplegado por tema.</p>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> Cuenta y autenticación</span>
  <h2 class="lurus-section-head__title">Cuenta y autenticación</h2>
</div>

<details class="lurus-faq-item">
<summary>¿Cómo me registro?</summary>

En [api.lurus.cn](https://api.lurus.cn) introduce tu correo y contraseña (o inicia sesión con GitHub/Google), obtienes automáticamente 5 鹿贝 + cuota gratuita, y todos los productos comparten la misma cuenta.

</details>

<details class="lurus-faq-item">
<summary>¿Perdí mi API Key?</summary>

Solo se muestra una vez y no se puede recuperar; elimina la antigua y crea una nueva en la consola. Guárdala en un gestor de contraseñas o en variables de entorno, no la escribas en el código; cada cuenta puede crear varias Keys, y asignar una Key independiente por proyecto es más seguro.

</details>

<details class="lurus-faq-item">
<summary>¿Cómo diagnostico una Key inválida?</summary>

- La Key está completa (empieza por `sk-` sin caracteres faltantes)
- Su estado es «habilitada» (consola → gestión de tokens)
- Cabecera de la solicitud `Authorization: Bearer sk-xxxx` (un espacio después de Bearer)
- Sin espacios/saltos de línea sobrantes (vuelve a copiarla)
- El nombre de la variable de entorno está bien escrito y ya está cargada

¿Sigue dando `401`? Revisa la lista de comprobación punto por punto en [Resolución de problemas · invalid_api_key](/es/guide/troubleshooting#invalid-api-key).

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Modelos y llamadas</span>
  <h2 class="lurus-section-head__title">Modelos y llamadas</h2>
</div>

<details class="lurus-faq-item">
<summary>¿Qué modelos se admiten?</summary>

OpenAI, Claude, Gemini, DeepSeek, etc., consulta la [lista de modelos](/guide/models).

</details>

<details class="lurus-faq-item">
<summary>Devuelve <code>"no available server"</code></summary>

Comprueba el nombre del modelo; confirma que la Key tiene permiso para ese modelo; puede que ese modelo no tenga canales disponibles por ahora, contacta con el administrador.

</details>

<details class="lurus-faq-item">
<summary>¿Cómo cambio de modelo?</summary>

Solo cambia el parámetro `model`, lo demás sigue igual.

</details>

<details class="lurus-faq-item">
<summary>¿Cómo activo las respuestas en streaming?</summary>

Establece `"stream": true` y la respuesta se devuelve por bloques mediante SSE.

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="wallet" :size="14" /> Facturación y cuota</span>
  <h2 class="lurus-section-head__title">Facturación y cuota</h2>
</div>

<details class="lurus-faq-item">
<summary>¿Cómo consulto el uso?</summary>

En la consola, «Panel de datos» o «Registros de uso».

</details>

<details class="lurus-faq-item">
<summary>¿Se acabó la cuota?</summary>

Contacta con el administrador para recargar o mejorar el plan.

</details>

<details class="lurus-faq-item">
<summary>¿Dónde veo los precios de los modelos?</summary>

Consulta los precios en la [lista de modelos](/guide/models).

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="alert-circle" :size="14" /> Problemas técnicos</span>
  <h2 class="lurus-section-head__title">Problemas técnicos</h2>
</div>

<details class="lurus-faq-item">
<summary>¿Qué hago si la solicitud expira por tiempo?</summary>

1. Comprueba la red (`curl https://api.lurus.cn/v1/models`)
2. Reduce `max_tokens`
3. Es normal que los modelos de razonamiento (`deepseek-reasoner`) tarden más en pensar
4. El tiempo de espera por defecto del SDK es de unos 60 segundos, puedes aumentar `timeout`
5. Si las expiraciones persisten puede ser un fallo del proveedor upstream, cambia de modelo

</details>

<details class="lurus-faq-item">
<summary>Error 429 (límite de <Term t="Rate Limit">Rate Limit</Term> superado)</summary>

Reduce la frecuencia + reintenta con retroceso exponencial (consulta [Manejo de errores](/es/api/errors)); el plan Free tiene 60 RPM por defecto, mejora a Pro/Team para aumentar el límite; si lo activas con frecuencia siendo de pago, contacta con support@lurus.cn.

</details>

<details class="lurus-faq-item">
<summary>Contexto superado (p. ej. <code>deepseek-chat</code> 64K, <code>gemini-3-pro-preview</code> 1M)</summary>

- Reduce la entrada eliminando historial
- Ventana deslizante (conserva el system + las últimas N rondas)
- Cambia a un modelo de contexto más largo
- Resume primero los documentos muy largos antes de pasarlos

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> Otras preguntas</span>
  <h2 class="lurus-section-head__title">Otras preguntas</h2>
</div>

<details class="lurus-faq-item">
<summary>¿Los datos son seguros?</summary>

HTTPS de extremo a extremo; no se almacena el contenido de las conversaciones; solo se registran los metadatos de las llamadas para la facturación.

</details>

<details class="lurus-faq-item">
<summary>¿Hay garantía de SLA?</summary>

Los clientes empresariales pueden firmar un SLA, contacta con el equipo comercial.

</details>

<details class="lurus-faq-item">
<summary>¿Canales de soporte técnico?</summary>

support@lurus.cn / GitHub Issues.

</details>

<div class="lurus-cta">
  <div>
    <p class="lurus-cta__title">¿No encontraste la respuesta?</p>
    <p class="lurus-cta__text">Envíanos tu pregunta y te responderemos en días laborables.</p>
  </div>
  <div class="lurus-cta__actions">
    <a class="lurus-cta__btn lurus-cta__btn--primary" href="mailto:support@lurus.cn">Contáctanos →</a>
  </div>
</div>

</div>
