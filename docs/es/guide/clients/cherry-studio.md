---
title: Configuración de Cherry Studio
description: Configura Lurus API en Cherry Studio y conéctate a más de 50 modelos de IA con un solo clic.
---

<div class="cherry-page">

# Configuración de Cherry Studio

[Cherry Studio](https://cherry-ai.com) es un excelente cliente de IA multiplataforma que admite múltiples proveedores de modelos. Esta página te guía para conectarte a Lurus API en pocos minutos.

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">Antes de empezar</p>
<div class="lurus-callout__body">Prepara una <Term t="API Key">API Key</Term> de Lurus (formato <code>sk-xxx</code>). ¿Todavía no tienes una? Ve a <a href="/es/guide/get-api-key">Obtener API Key</a>.</div>
</div>
</div>

## Pasos de configuración

<ol class="lurus-steps">
<li>

Abre los **Ajustes** de Cherry Studio.

</li>
<li>

Selecciona «**Proveedor de API**».

</li>
<li>

Haz clic en «**Añadir proveedor personalizado**».

</li>
<li>

Completa la siguiente información:

| Campo | Valor |
|------|-----|
| Nombre | Lurus API |
| API Base URL | `https://api.lurus.cn/v1` |
| API Key | Tu API Key (`sk-xxx`) |

</li>
<li>

**Guarda** la configuración.

</li>
</ol>

## Enlace de configuración rápida

Haz clic en el siguiente enlace para importar la configuración rápidamente:

```
cherrystudio://providers/api-keys?v=1&data={cherryConfig}
```

Reemplaza `{cherryConfig}` con tu información de configuración.

## Seleccionar modelo

Una vez completada la configuración, selecciona **Lurus API** como proveedor en Cherry Studio para usar todos los modelos compatibles. Consulta la lista completa en [Modelos compatibles](/guide/models).

## Preguntas frecuentes

<details class="lurus-faq-item">
<summary>¿La conexión falla?</summary>

- Comprueba que la API Key sea correcta
- Confirma que la conexión de red funcione correctamente
- Verifica que la Base URL sea correcta (`https://api.lurus.cn/v1`)

</details>

<details class="lurus-faq-item">
<summary>¿La lista de modelos está vacía?</summary>

Intenta actualizar manualmente la lista de modelos en los ajustes, o introduce manualmente el nombre del modelo, como `deepseek-chat`.

</details>

<NextSteps title="Siguientes pasos" :steps="[
  { text: 'Explorar los modelos compatibles', link: '/guide/models' },
  { text: 'Obtener API Key', link: '/es/guide/get-api-key' },
  { text: 'Ver la guía de inicio rápido de la API', link: '/es/guide/quickstart' }
]" />

</div>

<style scoped>
.cherry-page .lurus-steps { margin-top: 1rem; }
</style>
