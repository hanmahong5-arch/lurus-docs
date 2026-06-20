---
title: "Migrar de OpenAI a Lurus API"
description: "Cambia tus llamadas de OpenAI a Lurus API en 5 minutos, sin perder la forma de usar el SDK."
---

<div class="mig-openai-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="import" :size="14" /> Migrar de OpenAI</span>
  <h1 class="lurus-section-head__title">Migrar de OpenAI a Lurus API</h1>
  <p class="lurus-section-head__lede">Cambia una línea de <code>base_url</code> y todas tus llamadas del SDK de OpenAI quedan conectadas, sin reescribir la lógica de negocio.</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">5 minutos</span><span class="lurus-stat__label">Tiempo estimado</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">1 cambio</span><span class="lurus-stat__label">Modificación de código</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">0 veces</span><span class="lurus-stat__label">Reinicios</span></div>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Requisitos previos</p>
    <div class="lurus-callout__body"><p>Ya tienes una <Term t="API Key">API Key</Term> de Lurus (<a href="/es/guide/get-api-key">cómo obtenerla</a>).</p></div>
  </div>
</div>

## <Icon name="repeat" :size="20" /> Un solo cambio

```diff
- from openai import OpenAI
-
- client = OpenAI(api_key="sk-openai-...")
+ from openai import OpenAI
+
+ client = OpenAI(
+     api_key="sk-lurus-...",
+     base_url="https://api.lurus.cn/v1",
+ )
```

Eso es todo. Ninguna de tus llamadas `client.chat.completions.create(...)` necesita cambios.

## <Icon name="layers" :size="20" /> Equivalencia de nombres de modelo

| Modelo de OpenAI | Equivalente recomendado en Lurus |
|-------------|----------------|
| gpt-5 | `gpt-5` (directo) o `deepseek-chat` / `claude-sonnet-4` |
| gpt-4o-mini | `deepseek-chat` / `qwen-turbo` |
| gpt-4o | `claude-sonnet-4` / `gemini-3-pro` |
| o1 | `deepseek-reasoner` |
| text-embedding-3-small | `bge-m3` (local) / `text-embedding-3-small` |

Consulta la lista completa en [Modelos compatibles](/es/guide/models).

## <Icon name="workflow" :size="20" /> Pasos para la puesta en producción

<ol class="lurus-steps">
<li>

**Verificar la conectividad** — ejecútalo una vez; si recibes una respuesta, todo funciona.

```python
resp = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "你好"}],
)
print(resp.choices[0].message.content)
```

</li>
<li>

**Despliegue gradual** — desvía el tráfico de OpenAI a Lurus por porcentaje, subiendo poco a poco de `0.1` → `0.5` → `1.0`.

```python
import os, random

def get_client():
    if random.random() < float(os.getenv("LURUS_TRAFFIC", "0.1")):
        return OpenAI(api_key=os.getenv("LURUS_API_KEY"),
                      base_url="https://api.lurus.cn/v1")
    return OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
```

</li>
<li>

**Reversión** — elimina `base_url` para volver a las llamadas de OpenAI. **No requiere reinicio** (surte efecto por solicitud).

</li>
</ol>

## <Icon name="life-buoy" :size="20" /> Preguntas frecuentes

<details class="lurus-faq-item">
<summary>¿No encuentras el nombre del modelo?</summary>

Búscalo en el [catálogo de modelos](/es/guide/models) o abre un Issue.

</details>

<details class="lurus-faq-item">
<summary>¿Se admiten las llamadas a funciones / el modo JSON?</summary>

Lurus es totalmente compatible con las llamadas a funciones / el JSON Schema de OpenAI.

</details>

<details class="lurus-faq-item">
<summary>¿Hace falta un ID de organización?</summary>

Lurus no requiere el campo `organization`; si lo incluyes de más, no da error.

</details>

## Siguientes pasos

<NextSteps :steps="[
  { text: 'Catálogo de modelos', link: '/es/guide/models', primary: true },
  { text: 'Referencia de la API', link: '/es/api/overview' },
  { text: 'Facturación de Lurus', link: '/es/platform/billing' },
]" />

</div>
