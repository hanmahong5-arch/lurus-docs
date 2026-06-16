---
title: Manejo de errores
description: Formato de respuesta de errores de la API de Lurus, códigos de estado HTTP y métodos para manejar errores comunes.
---

<div class="api-errors-page">

# Manejo de errores

Todas las respuestas de error siguen una estructura unificada; cada código de error incluye `code` + `message` + acción recomendada, lo que facilita el procesamiento automatizado.

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="repeat" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Regla de oro para los reintentos</p>
    <p class="lurus-callout__body">Los errores de autenticación (401) <strong>no se reintentan</strong> y se propagan directamente; los límites de velocidad (429) se reintentan tras un <strong>retroceso exponencial</strong> de <code>2 ** attempt</code> segundos; los demás errores de la API se reintentan hasta el límite de <code>max_retries</code>.</p>
  </div>
</div>

## Formato de respuesta de error

Todas las respuestas de error siguen un formato unificado:

```json
{ "error": { "code": "error_code", "message": "Human readable error message", "type": "error_type", "param": "optional_parameter_name" } }
```

## Códigos de estado HTTP

| Código de estado | Significado | Descripción |
|--------|------|------|
| 200 | Éxito | La solicitud se procesó correctamente |
| 400 | Solicitud incorrecta | Parámetro erróneo o formato incorrecto |
| 401 | No autenticado | API Key inválida o ausente |
| 403 | Acceso prohibido | Sin permiso para acceder a este recurso |
| 404 | No encontrado | El recurso solicitado no existe |
| 429 | Demasiadas solicitudes | Se superó el límite de velocidad |
| 500 | Error del servidor | Error interno del servidor |
| 502 | Error de puerta de enlace | Servicio upstream no disponible |
| 503 | Servicio no disponible | El servicio no está disponible temporalmente |

## Errores comunes

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Localización rápida por síntoma</p>
    <div class="lurus-callout__body">Si quieres partir de "¿qué error he encontrado?", con una lista de verificación punto por punto, consulta <a href="/es/guide/troubleshooting">Solución de problemas</a>. Esta página es la referencia autorizada y completa de los códigos de error y las estrategias de reintento.</div>
  </div>
</div>

| `code` | `type` | message (ejemplo) | Solución |
|--------|--------|------|---------|
| `invalid_api_key` | `authentication_error` | Invalid API key provided | Verifica que la Key se haya copiado correctamente, que comience con `sk-` y que no tenga espacios sobrantes |
| `model_not_found` | `new_api_error` | 模型 xxx 无可用渠道 | Verifica el nombre del modelo; confirma que ese modelo tiene un canal configurado; contacta al administrador para habilitar permisos |
| `insufficient_quota` | `billing_error` | Insufficient quota for this request | Verifica el saldo de la cuenta; contacta al administrador para recargar |
| `rate_limit_exceeded` | `rate_limit_error` | Rate limit exceeded. Please slow down. | Reduce la frecuencia de solicitudes; reintenta con retroceso exponencial; solicita aumentar el límite de velocidad |
| `context_length_exceeded` | `invalid_request_error` | This model’s maximum context length is 8192 tokens | Reduce la longitud de la entrada; cambia a un modelo con contexto más largo; trunca el historial con una ventana deslizante |

Cuerpo de la respuesta de **model_not_found** (HTTP 404, `type: new_api_error`):

```json
{
  "error": {
    "code": "model_not_found",
    "message": "模型 gpt-5 无可用渠道",
    "type": "new_api_error"
  }
}
```

Cuerpo de la respuesta de **insufficient_quota** (HTTP 402, `type: billing_error`):

```json
{
  "error": {
    "code": "insufficient_quota",
    "message": "Insufficient quota for this request",
    "type": "billing_error"
  }
}
```

## Buenas prácticas para el manejo de errores

Puntos clave: los errores de autenticación (401) no se reintentan y se propagan directamente; los límites de velocidad (429) se reintentan tras un retroceso exponencial (`2 ** attempt` segundos); los demás errores de la API se reintentan hasta el límite de `max_retries`.

```python
from openai import OpenAI, APIError, RateLimitError, AuthenticationError
import time

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-your-api-key")

def chat_with_retry(messages, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.chat.completions.create(model="deepseek-chat", messages=messages)
        except AuthenticationError as e:
            print(f"Authentication failed: {e}")  # Key 问题，不重试
            raise
        except RateLimitError:
            wait_time = 2 ** attempt
            print(f"Rate limited. Waiting {wait_time}s...")
            time.sleep(wait_time)
        except APIError as e:
            if attempt == max_retries - 1:
                raise
            print(f"API error: {e}. Retrying...")
            time.sleep(1)
    raise Exception("Max retries exceeded")
```

```javascript
import OpenAI from 'openai';

const client = new OpenAI({ baseURL: 'https://api.lurus.cn/v1', apiKey: 'sk-your-api-key' });

async function chatWithRetry(messages, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await client.chat.completions.create({ model: 'deepseek-chat', messages });
    } catch (error) {
      if (error.status === 401) throw error;  // 认证错误，不重试
      if (error.status === 429) {
        const wait = Math.pow(2, attempt) * 1000;
        console.log(`Rate limited. Waiting ${wait}ms...`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }
      if (attempt === maxRetries - 1) throw error;
      console.log(`Error: ${error.message}. Retrying...`);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}
```

## Contactar con soporte

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">¿El problema persiste? Contacta con support@lurus.cn</p>
    <div class="lurus-callout__body">Proporciona la siguiente información para facilitar una localización rápida:<ul><li>Contenido completo del mensaje de error</li><li>ID de la solicitud (cabecera de respuesta <code>X-Request-ID</code>)</li><li>Hora en que ocurrió</li><li>Pasos para reproducirlo</li></ul></div>
  </div>
</div>

---

<NextSteps
  title="Próximos pasos"
  :steps="[
    { text: 'Chat Completions API', link: '/es/api/chat-completions', primary: true },
    { text: 'Autenticación', link: '/es/api/authentication' },
    { text: 'Descripción general de la API', link: '/es/api/overview' },
  ]"
/>

</div>
