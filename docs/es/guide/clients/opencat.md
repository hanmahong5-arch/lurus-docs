---
title: Configuración de OpenCat
description: Configura la API de Lurus en el cliente OpenCat para iOS/macOS.
---

<div class="opencat-page">

# Configuración de OpenCat

[OpenCat](https://opencat.app) es una aplicación nativa de chat con IA para iOS / macOS, con una interfaz sencilla y soporte para APIs personalizadas. Esta página ofrece dos métodos: configuración con un clic mediante URL Scheme y configuración manual.

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">Antes de empezar</p>
<div class="lurus-callout__body">Prepara una <Term t="API Key">API Key</Term> de Lurus (con formato <code>sk-xxxxxxxxxxxxxxxx</code>). ¿Aún no tienes una? Ve a <a href="/es/guide/get-api-key">Obtener una API Key</a>.</div>
</div>
</div>

## Configuración rápida (URL Scheme)

Haz clic en el siguiente enlace desde tu navegador o las notas para saltar a OpenCat con un solo clic y rellenar la configuración automáticamente:

```
opencat://team/join?domain=https://api.lurus.cn&token=YOUR_API_KEY
```

Reemplaza `YOUR_API_KEY` con tu Key (`sk-xxxxxxxxxxxxxxxx`) y ábrelo en Safari.

<div class="lurus-callout lurus-callout--tip">
<span class="lurus-callout__icon"><Icon name="smartphone" :size="18" /></span>
<div>
<p class="lurus-callout__title">Atajo de iOS (recomendado)</p>
<div class="lurus-callout__body">En la app Atajos de iOS, crea una acción «Abrir URL», pega la dirección de arriba y rellena tu Key. Guárdala en la pantalla de inicio para completar la configuración con un solo clic la próxima vez que cambies de dispositivo.</div>
</div>
</div>

---

## Configuración manual

Si el URL Scheme no funciona (las versiones antiguas de OpenCat no lo admiten), configúralo manualmente:

<ol class="lurus-steps">
<li>

Abre OpenCat → **Ajustes** (avatar en la esquina superior derecha) → **Ajustes de API**.

</li>
<li>

Selecciona «**API personalizada**» y rellena:

- **API Host**: `https://api.lurus.cn`
- **API Key**: tu Key (`sk-xxxxxxxxxxxxxxxx`)

</li>
<li>

Haz clic en «**Verificar conexión**» y, cuando indique que se ha realizado correctamente, guarda.

</li>
</ol>

---

## Elegir un modelo

OpenCat no obtiene la lista de modelos automáticamente; debes introducir el nombre del modelo manualmente. Modelos habituales:

| Nombre del modelo | Características |
|---------|------|
| `deepseek-chat` | Gran relación calidad-precio, el mejor en chino |
| `deepseek-reasoner` | Razonamiento matemático y de código |
| `gpt-4o` | La capacidad general más sólida |
| `claude-3-5-sonnet` | Texto largo, escritura creativa |
| `gemini-3-pro-preview` | Multimodal, contexto de 1M |

Consulta la lista completa en [Modelos compatibles](/guide/models).

---

## Preguntas frecuentes

<details class="lurus-faq-item">
<summary>La prueba de conexión falla con el mensaje "clave no válida"</summary>

- Comprueba que el API Host **no termina con barra** (`https://api.lurus.cn`, no `https://api.lurus.cn/`)
- Comprueba que el formato de la API Key es correcto (empieza por `sk-`)
- En la [consola de Lurus](https://api.lurus.cn) confirma que el estado de la Key es «Activada»

</details>

<details class="lurus-faq-item">
<summary>No hay respuesta tras introducir el nombre del modelo</summary>

- Revisa la ortografía del nombre del modelo (distingue mayúsculas y minúsculas, p. ej. `gpt-4o` y no `GPT-4o`)
- Confirma que tu Key tiene permiso de acceso a ese modelo

</details>

<details class="lurus-faq-item">
<summary>¿Dónde está la configuración en la versión de macOS?</summary>

Acceso en la versión de macOS: barra de menús **OpenCat** → **Preferences** (<span class="lurus-kbd">⌘,</span>) → pestaña **API**; los parámetros de configuración son los mismos que en la versión de iOS.

</details>

<NextSteps title="Siguientes pasos" :steps="[
  { text: 'Explorar los modelos compatibles', link: '/guide/models' },
  { text: 'Obtener una API Key', link: '/es/guide/get-api-key' },
  { text: 'Ver el inicio rápido de la API', link: '/es/guide/quickstart' }
]" />

</div>

<style scoped>
.opencat-page .lurus-steps { margin-top: 1rem; }
</style>
