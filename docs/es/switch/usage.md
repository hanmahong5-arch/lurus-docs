---
title: Manual de uso de Switch
description: Guía de uso diario de la aplicación de escritorio Switch, incluyendo la integración rápida y las funciones avanzadas.
---

<div class="switch-page">

# Manual de uso de Switch <StatusBadge status="dev" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="rocket" :size="14" /> Primeros pasos</span>
  <h2 class="lurus-section-head__title">Conecta cualquier cliente OpenAI a Switch</h2>
  <p class="lurus-section-head__lede">Una vez iniciado, Switch expone localmente un endpoint compatible con la API de OpenAI; basta con cambiar una línea de <code>base_url</code> para que todas las solicitudes se enruten automáticamente a través de Switch.</p>
</div>

## Integración rápida

Una vez iniciado, Switch expone localmente un endpoint compatible con la API de OpenAI en `http://localhost:19090/v1` (el puerto predeterminado del gateway de Switch es 19090). Cambia el `base_url` de tu aplicación/SDK a esta dirección y todas las solicitudes se enrutarán automáticamente a través de Switch. Pon cualquier valor en `api_key` (por ejemplo, `switch`); Switch utiliza la provider key de la configuración.

<ol class="lurus-steps">

<li>

Apunta el `base_url` del cliente al endpoint local de Switch, pon cualquier valor en `api_key` (por ejemplo, `switch`) y realiza las solicitudes con normalidad:

::: code-group

```bash [cURL]
curl http://localhost:19090/v1/chat/completions \
  -H "Content-Type: application/json" -H "Authorization: Bearer switch" \
  -d '{"model":"gpt-4o","messages":[{"role":"user","content":"Hello"}]}'
```

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:19090/v1",
    api_key="switch",
)
resp = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}],
)
print(resp.choices[0].message.content)
```

```javascript [Node.js]
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "http://localhost:19090/v1",
  apiKey: "switch",
});
const resp = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello" }],
});
console.log(resp.choices[0].message.content);
```

:::

</li>

<li>

Con el SDK de OpenAI (Python / Node.js) solo cambias `base_url`/`baseURL` y `api_key`; el resto de la llamada se mantiene igual. Switch utiliza la provider key de la configuración para realizar el enrutamiento real, y el cliente no necesita conocer el proveedor de destino.

</li>

</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Por qué api_key puede tener cualquier valor</p>
    <div class="lurus-callout__body">Switch actúa como un proxy local y utiliza la provider key real guardada en la configuración para llamar al proveedor de destino. El <code>api_key</code> del lado del cliente solo sirve como marcador de posición; basta con poner <code>switch</code>.</div>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="code" :size="14" /> Integración</span>
  <h2 class="lurus-section-head__title">Uso en herramientas de programación con IA</h2>
  <p class="lurus-section-head__lede">En todas las herramientas, indica <code>http://localhost:19090/v1</code> como API Base / dirección del endpoint, y <code>switch</code> como API Key.</p>
</div>

## Uso en herramientas de programación con IA

En todas las herramientas, indica `http://localhost:19090/v1` como API Base / dirección del endpoint, y `switch` como API Key:

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="code" :size="22" /></span>
    <div class="lurus-card__title">Cursor</div>
    <p class="lurus-card__body">Ajustes (<code>Ctrl+,</code>) → busca «AI» → cambia «OpenAI API Base» a esa dirección → guarda; el autocompletado y el chat pasarán automáticamente por Switch.</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="terminal" :size="22" /></span>
    <div class="lurus-card__title">Continue (VS Code)</div>
    <p class="lurus-card__body">Edita <code>~/.continue/config.json</code> y, en cada elemento de model, define <code>"provider": "openai"</code>, <code>"apiBase": "http://localhost:19090/v1"</code> y <code>"apiKey": "switch"</code>; en <code>"model"</code> pon <code>deepseek-chat</code> / <code>gpt-4o</code>, etc.</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="22" /></span>
    <div class="lurus-card__title">Cherry Studio</div>
    <p class="lurus-card__body">Ajustes → Configuración de API → selecciona «OpenAI compatible personalizado» → indica la dirección y la Key → «Probar conexión».</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="bot" :size="22" /></span>
    <div class="lurus-card__title">Lobe Chat</div>
    <p class="lurus-card__body">Ajustes → Modelos de lenguaje → OpenAI → indica la API Key y la dirección del endpoint.</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> Tiempo de ejecución</span>
  <h2 class="lurus-section-head__title">Monitorización, conmutación y streaming</h2>
</div>

## Monitorización de solicitudes

La pestaña «**Registros**» muestra los registros de solicitudes en tiempo real, con los campos: hora (marca de tiempo), modelo, proveedor (destino de enrutamiento real), duración (ms), Token (prompt/completion) y estado (200 / 4xx-5xx). Con «Exportar CSV» puedes exportar los registros de los últimos 7 días para el cálculo de costes.

## Conmutación de proveedor con un clic

Al hacer clic en el icono de la barra de menús (macOS) / la bandeja del sistema (Windows) puedes: cambiar el «proveedor activo actual», desactivar temporalmente un proveedor (depuración) y ver un resumen del consumo de hoy.

## Respuestas en streaming

Compatible por completo con las respuestas en streaming SSE, que se transmiten directamente desde el proveedor de destino: tras `chat.completions.create(..., stream=True)`, itera sobre `chunk.choices[0].delta.content`.

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shuffle" :size="14" /> Avanzado</span>
  <h2 class="lurus-section-head__title">Balanceo de carga</h2>
  <p class="lurus-section-head__lede">Cuando configuras varios proveedores para un mismo modelo, puedes distribuir las solicitudes por turnos (round-robin) o por peso.</p>
</div>

## Avanzado: balanceo de carga

Cuando configuras varios proveedores para un mismo modelo, puedes distribuir las solicitudes por turnos (round-robin) o por peso:

```json
{
  "routing": {
    "rules": [
      {
        "pattern": "deepseek-chat",
        "providers": [
          { "name": "Lurus API", "weight": 70 },
          { "name": "DeepSeek Official", "weight": 30 }
        ],
        "strategy": "weighted_random"
      }
    ]
  }
}
```

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> Solución de problemas</span>
  <h2 class="lurus-section-head__title">Solución de problemas</h2>
  <p class="lurus-section-head__lede">Despliega el síntoma correspondiente para ver los pasos de resolución.</p>
</div>

## Solución de problemas

<details class="lurus-faq-item">
<summary>"connection refused" — conexión rechazada</summary>

Switch no está iniciado o el puerto es incorrecto. Comprueba el proceso y el puerto:

- Proceso: Windows `tasklist | findstr LurusSwitch` / macOS·Linux `ps aux | grep lurus-switch`
- Puerto: `curl http://localhost:19090/v1/models`

</details>

<details class="lurus-faq-item">
<summary>401 / 403 — fallo de autenticación</summary>

La API Key del proveedor está mal configurada. Vuelve a introducirla en la interfaz de configuración y haz clic en «Probar» para verificar la conectividad.

</details>

<details class="lurus-faq-item">
<summary>Latencia anormalmente alta</summary>

1. Comprueba en los registros si el enrutamiento llega al proveedor correcto.
2. Una latencia alta en proveedores extranjeros (OpenAI / Anthropic) es normal (300-1500 ms).
3. Cambia a un nodo nacional de Lurus API (normalmente &lt; 200 ms).

</details>

<details class="lurus-faq-item">
<summary>La aplicación de macOS no responde</summary>

Haz clic derecho en la barra de menús → «Salir» y reinicia, o ejecuta en la terminal:

```bash
pkill -f LurusSwitch && open -a "Lurus Switch"
```

</details>

## Siguientes pasos

<NextSteps :steps="[
  { text: 'Gestión de servidores MCP', link: '/es/switch/mcp-servers', primary: true },
  { text: 'Monitorización de costes', link: '/es/switch/cost-monitoring' },
  { text: 'Sincronización de configuración del equipo', link: '/es/switch/team-config' },
]" />

</div>

<style scoped>
.switch-page .lurus-section-head { margin-top: 2.6rem; }
</style>
