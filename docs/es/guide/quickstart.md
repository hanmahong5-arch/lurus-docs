---
title: Inicio rápido
description: Completa tu primera llamada a la API de Lurus en 5 minutos, con soporte para Python, Node.js, Go y cURL.
---

<div class="qs-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="rocket" :size="14" /> Inicio rápido</span>
  <h1 class="lurus-section-head__title">Haz tu primera llamada en 5 minutos</h1>
  <p class="lurus-section-head__lede">Obtén la Key → envía la solicitud → cambia de modelo: listo en tres pasos.</p>
</div>

::: info Requisitos previos
Una cuenta de Lurus (al registrarte obtienes cuota gratuita; el primer paso te guía para crearla) · Python 3.8+ / Node.js 18+ / Go 1.21+ / cURL (a elegir) · conocimientos básicos de terminal. Tiempo estimado: 5 minutos.
:::

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> Paso uno</span>
  <h2 class="lurus-section-head__title">Crea una cuenta —— empieza gratis</h2>
  <p class="lurus-section-head__lede">Al registrarte obtienes cuota gratuita; puedes completar este tutorial sin recargar saldo.</p>
</div>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="coins" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Listo para usar al registrarte, sin pagar</p>
    <div class="lurus-callout__body"><p>Las cuentas nuevas reciben automáticamente <strong>5 鹿贝 + cuota gratuita</strong> (plan Free: <strong>100 llamadas/día</strong>, incluye <code>deepseek-chat</code> y <code>gpt-3.5-turbo</code>), más que suficiente para este tutorial. Para detalles de cuota y mejoras de plan, consulta las <a href="/es/guide/faq">preguntas frecuentes</a> y la <a href="/es/platform/billing">guía de facturación</a>.</p></div>
  </div>
</div>

A continuación, crea una API Key:

<ol class="lurus-steps">
<li>

Accede a [api.lurus.cn](https://api.lurus.cn) e inicia sesión o regístrate

</li>
<li>

Ve a «**Gestión de tokens**» → «**Crear nuevo token**»

</li>
<li>

Copia la Key generada (formato: `sk-xxxxxxxxxxxxxxxx`)

</li>
</ol>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Aviso de seguridad</p>
    <div class="lurus-callout__body"><p>La API Key equivale a una contraseña. <strong>No</strong> la subas a Git ni <strong>la escribas</strong> en el código del frontend. Lo recomendado es pasarla mediante una variable de entorno:</p><pre><code>export LURUS_API_KEY="sk-your-key-here"</code></pre></div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> Paso dos</span>
  <h2 class="lurus-section-head__title">Envía tu primera solicitud</h2>
  <p class="lurus-section-head__lede">Elige tu lenguaje, copia y ejecuta.</p>
</div>

:::tabs
== Python
```bash
pip install openai
```
```python
from openai import OpenAI
import os

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key=os.environ["LURUS_API_KEY"])

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "你是一个有帮助的助手。"},
        {"role": "user", "content": "用一句话介绍什么是人工智能。"}
    ]
)
print(response.choices[0].message.content)
# → 人工智能是让计算机模拟人类智能行为（如学习、推理、理解语言）的技术与科学领域。
```

== cURL
```bash
curl https://api.lurus.cn/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $LURUS_API_KEY" \
  -d '{ "model": "deepseek-chat", "messages": [
      {"role": "system", "content": "你是一个有帮助的助手。"},
      {"role": "user",   "content": "用一句话介绍什么是人工智能。"} ] }'
# 响应：{ "id":"chatcmpl-abc123", "choices":[{ "message":{"role":"assistant","content":"..."}, "finish_reason":"stop" }],
#        "usage":{ "prompt_tokens":32, "completion_tokens":22, "total_tokens":54 } }
```

== Node.js
```bash
npm install openai
```
```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.lurus.cn/v1',
  apiKey: process.env.LURUS_API_KEY
});

const response = await client.chat.completions.create({
  model: 'deepseek-chat',
  messages: [
    { role: 'system', content: '你是一个有帮助的助手。' },
    { role: 'user', content: '用一句话介绍什么是人工智能。' }
  ]
});

console.log(response.choices[0].message.content);
// → 人工智能是让计算机模拟人类智能行为（如学习、推理、理解语言）的技术与科学领域。
```

== Go
```bash
go get github.com/sashabaranov/go-openai
```
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
            Model: "deepseek-chat",
            Messages: []openai.ChatCompletionMessage{
                {Role: "system", Content: "你是一个有帮助的助手。"},
                {Role: "user", Content: "用一句话介绍什么是人工智能。"},
            },
        },
    )
    fmt.Println(resp.Choices[0].Message.Content)
    // → 人工智能是让计算机模拟人类智能行为（如学习、推理、理解语言）的技术与科学领域。
}
```
:::

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="check-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">¿Ves la respuesta del modelo? Tu primera llamada ya funciona 🎉</p>
    <div class="lurus-callout__body"><p>Esta solicitud usó la cuota gratuita de regalo por el registro, sin gastar ni un céntimo. El siguiente paso es probar otro modelo —— casi no hay que tocar el código.</p></div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shuffle" :size="14" /> Paso tres</span>
  <h2 class="lurus-section-head__title">Cambia de modelo</h2>
  <p class="lurus-section-head__lede">Solo cambia el parámetro <code>model</code>, sin modificar ninguna otra parte del código. Elige un modelo y el fragmento de abajo se actualiza al instante: cópialo y ejecútalo.</p>
</div>

<ModelPicker />

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="sparkles" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">¿No sabes cuál elegir?</p>
    <div class="lurus-callout__body"><p><strong>Uso diario</strong> → <code>deepseek-chat</code> (el más económico, el mejor en chino)<br><strong>Razonamiento complejo</strong> → <code>deepseek-reasoner</code><br><strong>Procesamiento de documentos largos</strong> → <code>gemini-3-pro-preview</code></p><p>Para la comparación completa, consulta los <a href="/guide/models">modelos compatibles</a>.</p></div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> Preguntas frecuentes</span>
  <h2 class="lurus-section-head__title">¿No funciona? Empieza por aquí</h2>
</div>

<details class="lurus-faq-item">
<summary>Devuelve <code>401 Unauthorized</code></summary>

```
{"error": {"code": "invalid_api_key", "type": "authentication_error"}}
```

Comprueba:

- Si la Key empieza por `sk-`
- El formato del encabezado de la solicitud: `Authorization: Bearer sk-xxxx` (ojo: hay un espacio después de Bearer)
- Si la Key está en estado «activado» (verifícalo en la consola)

</details>

<details class="lurus-faq-item">
<summary>Devuelve <code>"no available server"</code></summary>

- Comprueba la ortografía del nombre de `model` (distingue mayúsculas y minúsculas)
- Confirma que esa Key tiene permiso para acceder a este modelo
- Si acabas de crear la Key, espera unos 10 segundos y vuelve a intentarlo

</details>

<details class="lurus-faq-item">
<summary>¿Cómo se activa la respuesta en streaming?</summary>

Añade `"stream": true` al cuerpo de la solicitud; para más detalles consulta la [<Term t="Streaming">respuesta en streaming</Term>](/es/api/chat-completions#流式响应).

</details>

<NextSteps
  title="Próximos pasos"
  :steps="[
    { text: 'Documentación completa de Chat Completions', link: '/es/api/chat-completions', primary: true },
    { text: 'Modelos compatibles', link: '/guide/models' },
    { text: 'Configurar un cliente de IA', link: '/es/guide/clients/cherry-studio' },
  ]"
/>

</div>
