---
title: Autenticación de la API
description: Métodos de autenticación de la API de Lurus, incluido el formato de la API Key y la configuración de los encabezados de solicitud.
---

<div class="api-auth-page">

# Autenticación

Todas las solicitudes a la API de Lurus requieren autenticación. Se admiten **dos modos complementarios**; elige uno según el caso de uso:

<div class="lurus-cards lurus-cards--2">
  <a class="lurus-card lurus-card--auth" href="#metodos-de-autenticacion">
    <span class="lurus-card__icon"><Icon name="key" :size="20" /></span>
    <div class="lurus-card__title">API Key <span class="lurus-tag">El inicio más rápido</span></div>
    <p class="lurus-card__body">Bearer Token, ideal para scripts y proyectos personales. Es el tema principal de esta página.</p>
  </a>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">Token OIDC / OAuth2</div>
    <p class="lurus-card__body">Basado en el sistema de identidad unificado, ideal para aplicaciones que requieren inicio de sesión de usuario, SSO empresarial y M2M. Consulta <a href="/es/platform/auth/oidc">Integración OIDC</a> y <a href="/es/platform/auth/api-auth">PAT / JWT</a>.</p>
  </div>
</div>

## Métodos de autenticación

Usa un <Term t="Bearer Token">Bearer Token</Term> y envía la <Term t="API Key">API Key</Term> en el encabezado HTTP:

```http
Authorization: Bearer sk-your-api-key
```

## Ejemplo de solicitud

```bash
curl https://api.lurus.cn/v1/chat/completions \
  -H "Authorization: Bearer sk-your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"model": "deepseek-chat", "messages": [{"role": "user", "content": "Hi"}]}'
```

::: code-group

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="https://api.lurus.cn/v1",
    api_key="sk-your-api-key",  # 建议改为 os.environ.get("LURUS_API_KEY")
)
```

```javascript [Node.js]
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.lurus.cn/v1',
  apiKey: 'sk-your-api-key',  // 建议改为 process.env.LURUS_API_KEY
});
```

:::

La lista completa de SDK se encuentra en [Descripción general de la API — Compatibilidad con SDK](/es/api/overview#sdk-支持).

## Variables de entorno

Se recomienda almacenar la API Key en variables de entorno para evitar codificarla directamente en el código:

```bash
# .env
LURUS_API_KEY=sk-your-api-key
```

```python
import os
from openai import OpenAI

client = OpenAI(base_url="https://api.lurus.cn/v1", api_key=os.environ.get("LURUS_API_KEY"))
```

## Errores de autenticación

| Código de estado | `code` | `type` | Causas comunes |
|--------|--------|--------|---------|
| **401** Unauthorized | `invalid_api_key` | `authentication_error` | Formato de Key incorrecto / deshabilitada o eliminada / formato del encabezado Authorization incorrecto |
| **403** Forbidden | `access_denied` | `authorization_error` | La Key no tiene permiso para ese modelo / cuenta suspendida / cuota agotada |

La estructura JSON de la respuesta de error y la estrategia de reintentos se encuentran en [Gestión de errores](/es/api/errors).

## Buenas prácticas de seguridad

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="server" :size="20" /></span>
    <div class="lurus-card__title">Usa variables de entorno</div>
    <p class="lurus-card__body">No codifiques la API Key directamente en el código</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">No la expongas</div>
    <p class="lurus-card__body">No la subas a un repositorio Git</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="filter" :size="20" /></span>
    <div class="lurus-card__title">Limita los permisos</div>
    <p class="lurus-card__body">Concede a la Key solo los permisos mínimos necesarios</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="repeat" :size="20" /></span>
    <div class="lurus-card__title">Rótala periódicamente</div>
    <p class="lurus-card__body">Cambia la API Key de forma periódica</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="search" :size="20" /></span>
    <div class="lurus-card__title">Monitorea los registros</div>
    <p class="lurus-card__body">Revisa periódicamente los registros de llamadas a la API</p>
  </div>
</div>

---

<NextSteps
  title="Próximos pasos"
  :steps="[
    { text: 'Chat Completions API', link: '/es/api/chat-completions', primary: true },
    { text: 'Gestión de errores', link: '/es/api/errors' },
    { text: 'Descripción general de la API', link: '/es/api/overview' },
    { text: 'Integración OIDC', link: '/es/platform/auth/oidc' },
  ]"
/>

</div>
