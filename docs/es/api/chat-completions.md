---
title: Chat Completions API
description: Referencia de la API Chat Completions de Lurus, totalmente compatible con el formato de la interfaz de OpenAI.
---

<div class="api-chat-page">

# Chat Completions API

La API de conversación más usada, totalmente compatible con la interfaz Chat Completions de OpenAI.

<ApiEndpoint method="POST" path="/v1/chat/completions" description="Crear una conversación de chat" />

```
POST https://api.lurus.cn/v1/chat/completions
```

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--api" href="#respuesta-en-streaming">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Respuesta en streaming</div>
    <p class="lurus-card__body">SSE devuelve token a token</p>
  </a>
  <a class="lurus-card lurus-card--api" href="#function-calling">
    <span class="lurus-card__icon"><Icon name="plug-zap" :size="20" /></span>
    <div class="lurus-card__title">Function Calling</div>
    <p class="lurus-card__body">Deja que el modelo llame a tus funciones</p>
  </a>
  <a class="lurus-card lurus-card--api" href="#entrada-multimodal-vision">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Vision multimodal</div>
    <p class="lurus-card__body">Combina texto e imágenes en la entrada</p>
  </a>
  <a class="lurus-card lurus-card--api" href="#mejores-practicas">
    <span class="lurus-card__icon"><Icon name="sparkles" :size="20" /></span>
    <div class="lurus-card__title">Mejores prácticas</div>
    <p class="lurus-card__body">Temperatura / System Prompt / multironda</p>
  </a>
</div>

---

## Parámetros de la solicitud

### Obligatorios

| Parámetro | Tipo | Descripción |
|------|------|------|
| `model` | string | Nombre del modelo, como `deepseek-chat` o `gpt-4o` |
| `messages` | array | Arreglo de mensajes de la conversación, ver el formato más abajo |

### Parámetros opcionales comunes

| Parámetro | Tipo | Valor por defecto | Descripción |
|------|------|--------|------|
| `temperature` | number | 1.0 | Aleatoriedad (0–2). Usa 0.1 para código/matemáticas, 0.9 para escritura creativa |
| `max_tokens` | integer | — | Número máximo de tokens a generar. Si no se establece, lo decide el modelo |
| `stream` | boolean | false | <Term t="Streaming">Salida en streaming</Term> (SSE), ver [Respuesta en streaming](#respuesta-en-streaming) |
| `top_p` | number | 1.0 | Muestreo de núcleo, normalmente se ajusta como alternativa a temperature |
| `stop` | string/array | — | Detiene la generación al encontrar esta cadena |
| `n` | integer | 1 | Cuántas respuestas candidatas generar a la vez |
| `user` | string | — | Identificador de usuario, usado en los registros de auditoría |

### Formato de Messages

```json
[
  {"role": "system",    "content": "你是一位专业的技术顾问。"},
  {"role": "user",      "content": "什么是 RESTful API？"},
  {"role": "assistant", "content": "RESTful API 是…"},
  {"role": "user",      "content": "能举个例子吗？"}
]
```

| Rol | Uso |
|------|------|
| `system` | Define el comportamiento, el tono y las restricciones de la IA. Va en el primer elemento del arreglo |
| `user` | La entrada del usuario |
| `assistant` | La respuesta de la IA. En conversaciones multironda hay que incluir las respuestas históricas |

La definición completa de todos los campos del cuerpo de la solicitud (`ChatCompletionRequest`) y del mensaje (`Message`) se encuentra en la [Referencia de estructuras de datos](/es/api/schemas).

---

## Ejemplo básico

:::tabs
== Python
```python
from openai import OpenAI

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-your-key")

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "你是一位专业的技术顾问，回复简洁，不超过 100 字。"},
        {"role": "user",   "content": "什么是 RESTful API？"}
    ],
    temperature=0.3,
    max_tokens=200
)

print(response.choices[0].message.content)
print(f"Token 用量：{response.usage.total_tokens}")  # usage.total_tokens
```

== cURL
```bash
curl https://api.lurus.cn/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $LURUS_API_KEY" \
  -d '{
    "model": "deepseek-chat",
    "messages": [
      {"role": "system", "content": "你是一位专业的技术顾问，回复简洁，不超过 100 字。"},
      {"role": "user",   "content": "什么是 RESTful API？"}
    ],
    "temperature": 0.3
  }'
```

== Node.js
```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.lurus.cn/v1',
  apiKey: process.env.LURUS_API_KEY
});

const response = await client.chat.completions.create({
  model: 'deepseek-chat',
  messages: [
    { role: 'system', content: '你是一位专业的技术顾问，回复简洁，不超过 100 字。' },
    { role: 'user',   content: '什么是 RESTful API？' }
  ],
  temperature: 0.3,
  max_tokens: 200
});

console.log(response.choices[0].message.content);
console.log(`Token 用量：${response.usage.total_tokens}`);
```

== Go
```go
package main

import (
    "context"
    "fmt"
    "os"
    openai "github.com/sashabaranov/go-openai"
)

func main() {
    cfg := openai.DefaultConfig(os.Getenv("LURUS_API_KEY"))
    cfg.BaseURL = "https://api.lurus.cn/v1"
    client := openai.NewClientWithConfig(cfg)

    resp, _ := client.CreateChatCompletion(context.Background(),
        openai.ChatCompletionRequest{
            Model:       "deepseek-chat",
            Temperature: 0.3,
            Messages: []openai.ChatCompletionMessage{
                {Role: "system", Content: "你是一位专业的技术顾问，回复简洁，不超过 100 字。"},
                {Role: "user", Content: "什么是 RESTful API？"},
            },
        },
    )
    fmt.Println(resp.Choices[0].Message.Content)
    fmt.Printf("Token 用量：%d\n", resp.Usage.TotalTokens)
}
```
:::

---

## Respuesta en streaming

Establece `stream: true` y la respuesta se devuelve token a token mediante Server-Sent Events, ideal para aplicaciones de tipo chat.

:::tabs
== Python
```python
stream = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "写一首关于秋天的四行诗"}],
    stream=True
)

for chunk in stream:
    delta = chunk.choices[0].delta
    if delta.content:
        print(delta.content, end="", flush=True)
print()  # 换行
```

== Node.js
```javascript
const stream = await client.chat.completions.create({
  model: 'deepseek-chat',
  messages: [{ role: 'user', content: '写一首关于秋天的四行诗' }],
  stream: true
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? '');
}
```
:::

### Formato de los datos en streaming

```
data: {"id":"chatcmpl-abc","choices":[{"delta":{"content":"落"},"index":0}]}
data: {"id":"chatcmpl-abc","choices":[{"delta":{"content":"叶"},"index":0}]}
...
data: [DONE]
```

::: tip
El último `data: [DONE]` indica el final del flujo; en ese momento `delta.content` está vacío.
:::

---

## Function Calling

Deja que la IA decida cuándo llamar a las funciones que le proporcionas y devuelva parámetros estructurados (<Term t="Tool Call">Tool Call</Term>). Es útil para escenarios como búsquedas, consultas a bases de datos, llamadas a APIs externas, etc.

### Flujo de trabajo

<ArchitectureDiagram
  title="Flujo de llamada de Function Calling"
  chart="graph LR; A[Tu solicitud<br/>con definición de tools] --> B[El modelo devuelve<br/>finish_reason: tool_calls]; B --> C[Ejecutas la función<br/>el resultado se devuelve con role: tool]; C --> D[El modelo combina el resultado<br/>y genera la respuesta final]"
/>

### Ejemplo completo: consultar el clima

:::tabs
== Python
```python
import json
from openai import OpenAI

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-your-key")

# 定义可调用的函数
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "获取指定城市的当前天气",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "城市名称，如"北京"、"上海""
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "温度单位"
                    }
                },
                "required": ["city"]
            }
        }
    }
]

# 第一轮：AI 决定调用哪个函数
messages = [{"role": "user", "content": "北京今天天气怎么样？"}]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    tools=tools,
    tool_choice="auto"
)

msg = response.choices[0].message

# AI 返回了 tool_calls，说明它想调用函数
if msg.tool_calls:
    tool_call = msg.tool_calls[0]
    args = json.loads(tool_call.function.arguments)
    print(f"AI 想调用：{tool_call.function.name}({args})")
    # → AI 想调用：get_weather({'city': '北京', 'unit': 'celsius'})

    # 执行你自己的函数（这里模拟返回数据）
    weather_result = {"city": "北京", "temperature": 8, "condition": "晴，有北风"}

    # 第二轮：把函数结果传回给 AI
    messages.append(msg)  # 保留 AI 的 tool_calls 消息
    messages.append({
        "role": "tool",
        "tool_call_id": tool_call.id,
        "content": json.dumps(weather_result, ensure_ascii=False)
    })

    final = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        tools=tools
    )
    print(final.choices[0].message.content)
    # → 北京今天天气晴，气温 8°C，有北风，出门建议穿厚外套。
```
:::

::: warning Soporte de modelos
Function Calling requiere que el modelo lo soporte. Se recomienda usar `gpt-4o`, `gpt-4o-mini` o `claude-3-5-sonnet`.
La serie DeepSeek también lo soporta, pero el formato de los parámetros tiene diferencias sutiles; verifícalo durante las pruebas.
:::

---

## Entrada multimodal (Vision)

Algunos modelos pueden entender el contenido de las imágenes; combina texto e imágenes en el campo `content`.

:::tabs
== Imagen por URL
```json
{
  "model": "gpt-4o",
  "messages": [{
    "role": "user",
    "content": [
      {"type": "text", "text": "这张图里有什么？"},
      {"type": "image_url", "image_url": {"url": "https://example.com/photo.jpg"}}
    ]
  }]
}
```

== Imagen en Base64
```json
{
  "model": "gpt-4o",
  "messages": [{
    "role": "user",
    "content": [
      {"type": "text", "text": "识别图中的文字"},
      {"type": "image_url", "image_url": {
        "url": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
      }}
    ]
  }]
}
```
:::

::: info Modelos compatibles con Vision
`gpt-4o`, `gpt-4o-mini`, `gemini-3-pro-preview`, `gemini-3-pro-image-preview`

Límites de tamaño de imagen: las imágenes por URL deben ser accesibles públicamente; para Base64 se recomienda no superar los 5 MB por imagen.
:::

---

## Mejores prácticas

### Cómo escribir el System Prompt

```json
{
  "role": "system",
  "content": "你是一位专业客服。请用友好简洁的语气回答，每条回复不超过 150 字。如遇无法回答的问题，引导用户联系 support@lurus.cn。"
}
```

**Un buen System Prompt incluye: definición del rol + requisitos de tono + límite de longitud + manejo de los casos límite.**

### Referencia de ajustes de temperatura

| Escenario | temperature | Descripción |
|------|-------------|------|
| Generación de código, cálculo matemático | 0.0–0.2 | Alta determinación, reduce la aleatoriedad |
| Preguntas y respuestas, resúmenes, clasificación | 0.3–0.6 | Preciso pero con cierta flexibilidad |
| Escritura creativa, lluvia de ideas | 0.7–1.0 | Gran diversidad |
| Historias aleatorias, juego de roles | 1.0–1.5 | Alta creatividad, puede ser inestable |

### Gestión de conversaciones multironda

```python
conversation = [
    {"role": "system", "content": "你是一位历史老师。"}
]

def chat(user_input: str) -> str:
    conversation.append({"role": "user", "content": user_input})
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=conversation,
        max_tokens=500
    )
    reply = response.choices[0].message.content
    conversation.append({"role": "assistant", "content": reply})
    return reply

print(chat("秦始皇是谁？"))
print(chat("他有哪些重要成就？"))  # 模型能记住上文的"秦始皇"
```

::: tip Gestión de la ventana de contexto
Cada modelo tiene una longitud de contexto limitada (por ejemplo, `deepseek-chat` es de 64K tokens). Cuando la conversación es demasiado larga, puedes:
1. Truncar los mensajes más antiguos (conservar system + las últimas N rondas)
2. Resumir periódicamente la conversación histórica para comprimir el uso de tokens
:::

---

## Manejo de errores

Códigos de estado comunes: `400` formato de solicitud incorrecto → revisa la estructura JSON y los parámetros obligatorios; `401` Key inválida/caducada; `403` sin permiso para acceder a este modelo → contacta al administrador; `429` se superó el límite de velocidad → reintenta con retroceso exponencial; `500/502` anomalía del modelo upstream → reintenta o cambia a un modelo de respaldo. Los códigos de error completos y las estrategias de reintento se encuentran en [Manejo de errores](/es/api/errors).

---

<NextSteps
  title="Próximos pasos"
  :steps="[
    { text: 'Manejo de errores', link: '/api/errors', primary: true },
    { text: 'Estructuras de datos / Schema', link: '/api/schemas' },
    { text: 'Autenticación', link: '/api/authentication' },
    { text: 'Descripción general de la API', link: '/api/overview' },
    { text: 'Modelos compatibles', link: '/guide/models' },
  ]"
/>

</div>

<style>
.api-chat-page .lurus-card__body code {
  font-size: 0.85em;
}
</style>
