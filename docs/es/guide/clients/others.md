---
title: Otros clientes
description: Configura la API de Lurus en otros clientes compatibles con la API de OpenAI.
---

<div class="others-page">

# Otros clientes

Cualquier cliente compatible con la API de OpenAI puede usar la API de Lurus. A continuación se ofrecen los parámetros de configuración generales, una lista de clientes habituales y ejemplos de configuración listos para copiar.

## Configuración general

Solo tienes que rellenar estos dos campos en los ajustes de compatibilidad con OpenAI del cliente:

| Campo de configuración | Valor |
|--------|-----|
| API Base URL | `https://api.lurus.cn/v1` |
| API Key | `sk-your-api-key` |

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">¿Aún no tienes una Key?</p>
<div class="lurus-callout__body">Ve a <a href="/es/guide/get-api-key">Obtener API Key</a>. Los nombres de los modelos puedes consultarlos en <a href="/guide/models">Modelos compatibles</a>.</div>
</div>
</div>

## Clientes compatibles

<div class="lurus-h3">Aplicaciones de escritorio</div>

<div class="lurus-cards lurus-cards--compact">
<a class="lurus-card lurus-card--api" href="/es/guide/clients/cherry-studio">
<span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
<div class="lurus-card__title">Cherry Studio</div>
<p class="lurus-card__body">Multiplataforma, con muchas funciones</p>
</a>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
<div class="lurus-card__title">ChatBox</div>
<p class="lurus-card__body">Sencillo y fácil de usar</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
<div class="lurus-card__title">BetterChatGPT</div>
<p class="lurus-card__body">Código abierto y gratuito</p>
</div>
</div>

<div class="lurus-h3">Aplicaciones móviles</div>

<div class="lurus-cards lurus-cards--compact">
<a class="lurus-card lurus-card--api" href="/es/guide/clients/opencat">
<span class="lurus-card__icon"><Icon name="smartphone" :size="20" /></span>
<div class="lurus-card__title">OpenCat</div>
<p class="lurus-card__body">iOS / macOS</p>
</a>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="smartphone" :size="20" /></span>
<div class="lurus-card__title">ChatGPT Next Web</div>
<p class="lurus-card__body">PWA</p>
</div>
</div>

<div class="lurus-h3">Aplicaciones web</div>

<div class="lurus-cards lurus-cards--compact">
<a class="lurus-card lurus-card--api" href="/es/guide/clients/lobe-chat">
<span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
<div class="lurus-card__title">Lobe Chat</div>
<p class="lurus-card__body">Interfaz de chat de código abierto y moderna</p>
</a>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
<div class="lurus-card__title">ChatGPT Web</div>
<p class="lurus-card__body">En el navegador</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="server" :size="20" /></span>
<div class="lurus-card__title">Open WebUI</div>
<p class="lurus-card__body">Autoalojado</p>
</div>
</div>

<div class="lurus-h3">Plugins de IDE</div>

<div class="lurus-cards lurus-cards--compact">
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">Continue</div>
<p class="lurus-card__body">VS Code</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">Codeium</div>
<p class="lurus-card__body">Autocompletado en el IDE</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">Cursor</div>
<p class="lurus-card__body">Editor con IA</p>
</div>
</div>

<div class="lurus-h3">Herramientas de línea de comandos</div>

<div class="lurus-cards lurus-cards--compact">
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">llm-cli</div>
<p class="lurus-card__body">Llamada desde la terminal</p>
</div>
<div class="lurus-card lurus-card--api">
<span class="lurus-card__icon"><Icon name="code" :size="20" /></span>
<div class="lurus-card__title">aichat</div>
<p class="lurus-card__body">Llamada desde la terminal</p>
</div>
</div>

## Ejemplos de configuración

### Cursor

<ol class="lurus-steps">
<li>

Abre **Ajustes → OpenAI API**.

</li>
<li>

**API Key**: introduce tu Key de Lurus.

</li>
<li>

**Base URL**: `https://api.lurus.cn/v1`.

</li>
</ol>

### Continue (VS Code)

Edita `~/.continue/config.json`:

```json
{
  "models": [
    {
      "title": "Lurus DeepSeek",
      "provider": "openai",
      "model": "deepseek-chat",
      "apiBase": "https://api.lurus.cn/v1",
      "apiKey": "sk-your-api-key"
    }
  ]
}
```

## Funciones no compatibles

Es posible que algunas funciones propias de ciertos clientes no sean totalmente compatibles:

<div class="lurus-callout lurus-callout--warn">
<span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
<div>
<p class="lurus-callout__title">Aviso de compatibilidad</p>
<div class="lurus-callout__body"><ul><li>Conversación de voz en tiempo real</li><li>Edición de imágenes</li><li>API propietarias de proveedores específicos</li></ul><p>Si tienes algún problema, ponte en contacto con el soporte técnico.</p></div>
</div>
</div>

<NextSteps title="Siguientes pasos" :steps="[
  { text: 'Explorar los modelos compatibles', link: '/guide/models' },
  { text: 'Obtener API Key', link: '/es/guide/get-api-key' },
  { text: 'Ver el inicio rápido de la API', link: '/es/guide/quickstart' }
]" />

</div>

<style scoped>
.others-page .lurus-h3 { margin-top: 1.6rem; }
.others-page .lurus-steps { margin-top: 1rem; }
</style>
