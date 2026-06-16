---
title: Estructuras de datos / Referencia de Schema
description: Estructuras de datos de las solicitudes y respuestas de la API de Lurus, generadas automáticamente a partir de la especificación OpenAPI (relay.json) y siempre coherentes con la implementación del gateway.
---

<div class="api-schemas-page">

# Referencia de estructuras de datos

Las siguientes estructuras de datos de solicitud / respuesta se **generan y sincronizan automáticamente** a partir de la especificación <Term t="OpenAPI">OpenAPI</Term> de newapi (`relay.json`), y se mantienen siempre coherentes con la implementación del gateway. Consulta la lista completa de endpoints en [Resumen de la API](/es/api/overview) y los ejemplos de uso en [Chat Completions](/es/api/chat-completions).

::: info Cómo se actualiza
La zona marcada con `<!-- sync:schemas -->` de esta página se regenera mediante `bun run sync` a partir de `2b-svc-newapi/docs/openapi/relay.json`; no edites esta zona manualmente.
:::

<!-- sync:schemas:start -->
_Total de 35 estructuras de datos (generadas automáticamente a partir de la especificación OpenAPI)._

<details class="lurus-faq-item">
<summary><code>AudioTranscriptionResponse</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `text` | string | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ChatCompletionRequest</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `model` | string | Sí | ID del modelo |
| `messages` | array&lt;Message&gt; | Sí | Lista de mensajes de la conversación |
| `temperature` | number | — | Temperatura de muestreo |
| `top_p` | number | — | Parámetro de muestreo nuclear (nucleus sampling) |
| `n` | integer | — | Cantidad de generaciones |
| `stream` | boolean | — | Si la respuesta es en streaming |
| `stream_options` | object | — |  |
| `stop` | string \| array&lt;string&gt; | — | Secuencias de parada |
| `max_tokens` | integer | — | Número máximo de tokens generados |
| `max_completion_tokens` | integer | — | Número máximo de tokens de completado |
| `presence_penalty` | number | — |  |
| `frequency_penalty` | number | — |  |
| `logit_bias` | object | — |  |
| `user` | string | — |  |
| `tools` | array&lt;Tool&gt; | — |  |
| `tool_choice` | string (`none` / `auto` / `required`) \| object | — |  |
| `response_format` | ResponseFormat | — |  |
| `seed` | integer | — |  |
| `reasoning_effort` | string (`low` / `medium` / `high`) | — | Intensidad de razonamiento (para modelos con soporte de razonamiento) |
| `modalities` | array&lt;string (`text` / `audio`)&gt; | — |  |
| `audio` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ChatCompletionResponse</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `id` | string | — |  |
| `object` | string | — |  |
| `created` | integer | — |  |
| `model` | string | — |  |
| `choices` | array&lt;object&gt; | — |  |
| `usage` | Usage | — |  |
| `system_fingerprint` | string | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ClaudeMessage</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `role` | string (`user` / `assistant`) | Sí |  |
| `content` | string \| array&lt;object&gt; | Sí |  |

</details>

<details class="lurus-faq-item">
<summary><code>ClaudeRequest</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `model` | string | Sí |  |
| `messages` | array&lt;ClaudeMessage&gt; | Sí |  |
| `system` | string \| array&lt;object&gt; | — |  |
| `cache_control` | object | — |  |
| `inference_geo` | string | — |  |
| `max_tokens` | integer | Sí |  |
| `temperature` | number | — |  |
| `top_p` | number | — |  |
| `top_k` | integer | — |  |
| `stream` | boolean | — |  |
| `stop_sequences` | array&lt;string&gt; | — |  |
| `tools` | array&lt;object&gt; | — |  |
| `tool_choice` | object | — |  |
| `thinking` | object | — |  |
| `context_management` | object | — |  |
| `output_config` | object | — |  |
| `output_format` | object | — |  |
| `container` | string \| object | — |  |
| `mcp_servers` | array&lt;object&gt; | — |  |
| `metadata` | object | — |  |
| `speed` | string (`standard` / `fast`) | — |  |
| `service_tier` | string (`auto` / `standard_only`) | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ClaudeResponse</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `id` | string | — |  |
| `type` | string | — |  |
| `role` | string | — |  |
| `content` | array&lt;object&gt; | — |  |
| `model` | string | — |  |
| `stop_reason` | string (`end_turn` / `max_tokens` / `stop_sequence` / `tool_use`) | — |  |
| `usage` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>CompletionRequest</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `model` | string | Sí |  |
| `prompt` | string \| array&lt;string&gt; | Sí |  |
| `max_tokens` | integer | — |  |
| `temperature` | number | — |  |
| `top_p` | number | — |  |
| `n` | integer | — |  |
| `stream` | boolean | — |  |
| `stop` | string \| array&lt;string&gt; | — |  |
| `suffix` | string | — |  |
| `echo` | boolean | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>CompletionResponse</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `id` | string | — |  |
| `object` | string | — |  |
| `created` | integer | — |  |
| `model` | string | — |  |
| `choices` | array&lt;object&gt; | — |  |
| `usage` | Usage | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>EmbeddingRequest</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `model` | string | Sí |  |
| `input` | string \| array&lt;string&gt; | Sí | Texto a incrustar (embedding) |
| `encoding_format` | string (`float` / `base64`) | — |  |
| `dimensions` | integer | — | Dimensión del vector de salida |

</details>

<details class="lurus-faq-item">
<summary><code>EmbeddingResponse</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `object` | string | — |  |
| `data` | array&lt;object&gt; | — |  |
| `model` | string | — |  |
| `usage` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>GeminiModelsResponse</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `models` | array&lt;object&gt; | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>GeminiResponse</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `candidates` | array&lt;object&gt; | — |  |
| `usageMetadata` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ImageResponse</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `created` | integer | — |  |
| `data` | array&lt;object&gt; | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>Message</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `role` | string (`system` / `user` / `assistant` / `tool` / `developer`) | Sí | Rol del mensaje |
| `content` | string \| array&lt;MessageContent&gt; | Sí | Contenido del mensaje |
| `name` | string | — | Nombre del remitente |
| `tool_calls` | array&lt;ToolCall&gt; | — |  |
| `tool_call_id` | string | — | ID de la llamada a la herramienta (para mensajes con rol tool) |
| `reasoning_content` | string | — | Contenido de razonamiento |

</details>

<details class="lurus-faq-item">
<summary><code>MessageContent</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `type` | string (`text` / `image_url` / `input_audio` / `file` / `video_url`) | — |  |
| `text` | string | — |  |
| `image_url` | object | — |  |
| `input_audio` | object | — |  |
| `file` | object | — |  |
| `video_url` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>Model</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `id` | string | — | ID del modelo |
| `object` | string | — | Tipo de objeto |
| `created` | integer | — | Marca de tiempo de creación |
| `owned_by` | string | — | Propietario del modelo |

</details>

<details class="lurus-faq-item">
<summary><code>ModelsResponse</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `object` | string | — |  |
| `data` | array&lt;Model&gt; | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ModerationRequest</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `input` | string \| array&lt;string&gt; | Sí |  |
| `model` | string | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ModerationResponse</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `id` | string | — |  |
| `model` | string | — |  |
| `results` | array&lt;object&gt; | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>RerankRequest</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `model` | string | Sí |  |
| `query` | string | Sí | Texto de la consulta |
| `documents` | array&lt;string \| object&gt; | Sí | Lista de documentos a reordenar |
| `top_n` | integer | — | Devolver los N primeros resultados |
| `return_documents` | boolean | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>RerankResponse</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `id` | string | — |  |
| `results` | array&lt;object&gt; | — |  |
| `meta` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ResponseFormat</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `type` | string (`text` / `json_object` / `json_schema`) | — |  |
| `json_schema` | object | — | Definición de JSON Schema |

</details>

<details class="lurus-faq-item">
<summary><code>ResponsesCompactionRequest</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `model` | string | Sí |  |
| `input` | string \| array&lt;object&gt; | — | Contenido de entrada; puede ser una cadena o un arreglo de mensajes |
| `instructions` | string | — |  |
| `previous_response_id` | string | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ResponsesCompactionResponse</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `id` | string | — |  |
| `object` | string | — |  |
| `created_at` | integer | — |  |
| `output` | array&lt;object&gt; | — |  |
| `usage` | Usage | — |  |
| `error` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ResponsesRequest</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `model` | string | Sí |  |
| `input` | string \| array&lt;object&gt; | — | Contenido de entrada; puede ser una cadena o un arreglo de mensajes |
| `instructions` | string | — |  |
| `max_output_tokens` | integer | — |  |
| `temperature` | number | — |  |
| `top_p` | number | — |  |
| `stream` | boolean | — |  |
| `tools` | array&lt;object&gt; | — |  |
| `tool_choice` | string \| object | — |  |
| `reasoning` | object | — |  |
| `previous_response_id` | string | — |  |
| `truncation` | string (`auto` / `disabled`) | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ResponsesResponse</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `id` | string | — |  |
| `object` | string | — |  |
| `created_at` | integer | — |  |
| `status` | string (`completed` / `failed` / `in_progress` / `incomplete`) | — |  |
| `model` | string | — |  |
| `output` | array&lt;object&gt; | — |  |
| `usage` | Usage | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>SpeechRequest</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `model` | string | Sí |  |
| `input` | string | Sí | Texto a convertir |
| `voice` | string (`alloy` / `echo` / `fable` / `onyx` / `nova` / `shimmer`) | Sí |  |
| `response_format` | string (`mp3` / `opus` / `aac` / `flac` / `wav` / `pcm`) | — |  |
| `speed` | number | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>Tool</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `type` | string | — |  |
| `function` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>ToolCall</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `id` | string | — |  |
| `type` | string | — |  |
| `function` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>Usage</code></summary>

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `prompt_tokens` | integer | — | Número de tokens del prompt |
| `completion_tokens` | integer | — | Número de tokens de completado |
| `total_tokens` | integer | — | Número total de tokens |
| `prompt_tokens_details` | object | — |  |
| `completion_tokens_details` | object | — |  |

</details>

<details class="lurus-faq-item">
<summary><code>VideoRequest</code></summary>

Solicitud de generación de video

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `model` | string | — | ID del modelo/estilo |
| `prompt` | string | — | Prompt de descripción textual |
| `image` | string | — | Entrada de imagen (URL o Base64) |
| `duration` | number | — | Duración del video (segundos) |
| `width` | integer | — | Ancho del video |
| `height` | integer | — | Alto del video |
| `fps` | integer | — | Cuadros por segundo del video |
| `seed` | integer | — | Semilla aleatoria |
| `n` | integer | — | Cantidad de videos a generar |
| `response_format` | string | — | Formato de la respuesta |
| `user` | string | — | Identificador del usuario |
| `metadata` | object | — | Parámetros extendidos (como negative_prompt, style, quality_level, etc.) |

</details>

<details class="lurus-faq-item">
<summary><code>VideoResponse</code></summary>

Respuesta al envío de una tarea de generación de video

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `task_id` | string | — | ID de la tarea |
| `status` | string | — | Estado de la tarea |

</details>

<details class="lurus-faq-item">
<summary><code>VideoTaskError</code></summary>

Información de error de la tarea de video

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `code` | integer | — | Código de error |
| `message` | string | — | Mensaje de error |

</details>

<details class="lurus-faq-item">
<summary><code>VideoTaskMetadata</code></summary>

Metadatos de la tarea de video

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `duration` | number | — | Duración real del video generado |
| `fps` | integer | — | Cuadros por segundo reales |
| `width` | integer | — | Ancho real |
| `height` | integer | — | Alto real |
| `seed` | integer | — | Semilla aleatoria utilizada |

</details>

<details class="lurus-faq-item">
<summary><code>VideoTaskResponse</code></summary>

Respuesta a la consulta del estado de la tarea de video

| Campo | Tipo | Obligatorio | Descripción |
|------|------|------|------|
| `task_id` | string | — | ID de la tarea |
| `status` | string (`queued` / `in_progress` / `completed` / `failed`) | — | Estado de la tarea |
| `url` | string | — | URL del recurso de video (cuando tiene éxito) |
| `format` | string | — | Formato del video |
| `metadata` | VideoTaskMetadata | — |  |
| `error` | VideoTaskError | — |  |

</details>
<!-- sync:schemas:end -->

<NextSteps
  title="Siguientes pasos"
  :steps="[
    { text: 'Resumen de la API', link: '/es/api/overview', primary: true },
    { text: 'Chat Completions', link: '/es/api/chat-completions' },
    { text: 'Directorio de integraciones y MCP', link: '/integrations/' },
    { text: 'Manejo de errores', link: '/es/api/errors' },
  ]"
/>

</div>
