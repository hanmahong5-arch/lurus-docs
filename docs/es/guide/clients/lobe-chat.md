---
title: Configuración de Lobe Chat
description: Configura Lurus API como proveedor de modelos en Lobe Chat.
---

<div class="lobe-page">

# Configuración de Lobe Chat

[Lobe Chat](https://lobehub.com) es una aplicación moderna de chat con IA de código abierto. Esta página describe dos métodos: la configuración en línea con un clic y la configuración manual.

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">Antes de empezar</p>
<div class="lurus-callout__body">Ten preparada una <Term t="API Key">API Key</Term> de Lurus. ¿Aún no tienes una? Ve a <a href="/es/guide/get-api-key">Obtener API Key</a>.</div>
</div>
</div>

## Configuración en línea

Haz clic en el siguiente enlace para configurarlo directamente:

```
https://chat-preview.lobehub.com/?settings={"keyVaults":{"openai":{"apiKey":"YOUR_API_KEY","baseURL":"https://api.lurus.cn/v1"}}}
```

Reemplaza `YOUR_API_KEY` por tu API Key.

## Configuración manual

<ol class="lurus-steps">
<li>

Abre los **Ajustes** de Lobe Chat.

</li>
<li>

Selecciona «**Modelos de lenguaje**».

</li>
<li>

En la configuración de OpenAI, completa:

- **API Key**: introduce tu API Key de Lurus
- **API Proxy**: `https://api.lurus.cn/v1`

</li>
<li>

**Guarda** los ajustes.

</li>
</ol>

## Recomendaciones de uso

<div class="lurus-callout lurus-callout--tip">
<span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
<div>
<p class="lurus-callout__title">Sugerencia</p>
<div class="lurus-callout__body"><ul><li>Lobe Chat usa nombres de modelos de OpenAI de forma predeterminada, por lo que debes cambiarlos manualmente durante la conversación</li><li>Se recomienda usar <code>deepseek-chat</code> para obtener la mejor relación calidad-precio</li></ul></div>
</div>
</div>

<NextSteps title="Siguientes pasos" :steps="[
  { text: 'Explorar los modelos compatibles', link: '/guide/models' },
  { text: 'Obtener API Key', link: '/es/guide/get-api-key' },
  { text: 'Ver la guía de inicio rápido de la API', link: '/es/guide/quickstart' }
]" />

</div>

<style scoped>
.lobe-page .lurus-steps { margin-top: 1rem; }
</style>
