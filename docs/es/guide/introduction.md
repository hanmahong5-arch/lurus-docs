---
title: Introducción a la API de Lurus
description: Una sola API Key para acceder a más de 50 modelos de IA líderes, totalmente compatible con el SDK de OpenAI, con solo dos líneas de cambio.
---

<div class="lurus-api-intro">

<ProductHero product-id="lurus-api" />

<MetricStats :items="[
  { label: 'Modelos disponibles', value: '50+' },
  { label: 'Cuota gratuita', value: '100 / día' },
  { label: 'Compatibilidad', value: 'OpenAI SDK' },
]" />

**Una sola <Term t="API Key">API Key</Term> para acceder a más de 50 modelos de IA líderes.** Totalmente compatible con el <Term t="SDK">SDK</Term> de OpenAI; tu código actual solo necesita dos líneas de cambio, sin reescrituras.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> Elige tu ruta</span>
  <h2 class="lurus-section-head__title">¿Qué tipo de usuario eres?</h2>
  <p class="lurus-section-head__lede">Tres puntos de entrada: elige uno según tu perfil y empieza de inmediato.</p>
</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--api" href="/es/guide/clients/cherry-studio">
    <span class="lurus-card__icon"><Icon name="rocket" :size="22" /></span>
    <div class="lurus-card__title">Quiero probarlo rápido, sin conocimientos técnicos</div>
    <p class="lurus-card__body">Configura primero un cliente de IA (Cherry Studio / Lobe Chat), introduce tu API Key y empieza a conversar; no necesitas escribir nada de código.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/es/guide/quickstart">
    <span class="lurus-card__icon"><Icon name="code" :size="22" /></span>
    <div class="lurus-card__title">Soy desarrollador y quiero integrar capacidades de IA</div>
    <p class="lurus-card__body">Realiza tu primera llamada a la API en 5 minutos, con soporte para Python / Node.js / Go / cURL.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/migrations/from-openai">
    <span class="lurus-card__icon"><Icon name="shuffle" :size="22" /></span>
    <div class="lurus-card__title">Ya uso OpenAI y quiero cambiarme / reducir costes</div>
    <p class="lurus-card__body">Migra reemplazando solo dos líneas de código; todas las funciones del SDK de OpenAI son totalmente compatibles.</p>
  </a>
</div>

::: info Ya uso OpenAI y quiero cambiarme / reducir costes
Migra reemplazando solo dos líneas de código; todas las funciones del SDK de OpenAI son totalmente compatibles:
```python
# 改这两行，其余代码不动
base_url="https://api.lurus.cn/v1"
api_key="sk-your-lurus-key"
```
:::

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> Capacidades clave</span>
  <h2 class="lurus-section-head__title">Una pasarela, cuatro funciones</h2>
  <p class="lurus-section-head__lede">Acceso unificado, enrutamiento inteligente, control de costes y gestión de acceso de nivel empresarial.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-lurus-api)"
  :items="[
    { title: 'API unificada', body: 'Una sola interfaz para todos los modelos; basta con cambiar el nombre del model, sin necesidad de escribir un adaptador para cada proveedor.', icon: 'plug-zap' },
    { title: 'Enrutamiento inteligente y conmutación automática por error', body: 'Respaldo multicanal (cambio automático cuando falla el canal principal), balanceo de carga ponderado (distribución proporcional para equilibrar coste y velocidad) y estrategia por prioridad (primero los canales de bajo coste y, al superar el límite, cambio al respaldo de mayor coste).', icon: 'shuffle' },
    { title: 'Control de costes detallado', body: 'Define una cuota de Tokens por API Key con bloqueo al excederla; consulta por día/mes el número de llamadas, los Tokens y el detalle de gastos; alerta cuando queda menos del 20 % de la cuota.', icon: 'wallet' },
    { title: 'Gestión de acceso de nivel empresarial', body: 'Asignación de múltiples Keys por proyecto, listas blancas de modelos, listas blancas de IP y registros de auditoría completos, con el modelo/Token/latencia de cada solicitud registrados.', icon: 'shield-check' },
  ]"
/>

**Ejemplo de API unificada** —— basta con cambiar el nombre del `model` para cambiar de proveedor:

```python
from openai import OpenAI
client = OpenAI(base_url="https://api.lurus.cn/v1", api_key="sk-your-api-key")
# model 可填 deepseek-chat / gpt-4o / claude-3-5-sonnet / gemini-3-pro-preview
response = client.chat.completions.create(model="deepseek-chat", messages=[{"role": "user", "content": "你好"}])
```

### <Icon name="shield-check" :size="20" /> Gestión de acceso de nivel empresarial

| Función | Descripción |
|------|------|
| Gestión de múltiples Keys | Asigna Keys independientes a distintos proyectos/equipos |
| Lista blanca de modelos | Restringe una Key para que solo acceda a modelos específicos |
| Lista blanca de IP | Permite las llamadas únicamente desde rangos de IP específicos |
| Registros de auditoría completos | El modelo, los Tokens y la latencia de cada solicitud quedan registrados |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="briefcase" :size="14" /> Casos de uso</span>
  <h2 class="lurus-section-head__title">Quién usa la API de Lurus</h2>
</div>

| Caso de uso | Qué puedes hacer |
|------|-----------|
| **Desarrollo de aplicaciones de IA** | Accede a todos los proveedores con el mismo código y realiza pruebas A/B rápidas entre distintos modelos |
| **Optimización de costes** | Las tareas cotidianas van por DeepSeek (bajo coste) y las complejas por GPT-4o (alta calidad) |
| **Estabilidad del servicio** | Redundancia multicanal: el fallo de un proveedor no afecta a tu servicio |
| **Gestión de equipos** | Asigna Keys + cuotas y consulta de forma centralizada el uso y los costes de IA de todo el equipo |
| **Clientes de IA** | Proporciona un backend unificado a herramientas como Cherry Studio, Lobe Chat, OpenCat, etc. |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="network" :size="14" /> Visión general de la arquitectura</span>
  <h2 class="lurus-section-head__title">Cómo fluye una solicitud</h2>
</div>

<ArchitectureDiagram
  title="Flujo de datos de la pasarela de la API de Lurus"
  chart="graph LR; A[Tu aplicación / cliente de IA] --> B[Lurus API Gateway]; B --> C[Autenticación]; C --> D[Enrutamiento]; D --> E[Límite de tasa]; E --> F[Facturación]; F --> G[Registros]; D --> H[OpenAI]; D --> I[Claude]; D --> J[Gemini]; D --> K[DeepSeek]"
/>

La pasarela enruta según la prioridad de canales configurada y, cuando un proveedor devuelve un error, reintenta automáticamente con el siguiente, sin que el código perciba el cambio.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="graduation-cap" :size="14" /> Ruta de aprendizaje recomendada</span>
  <h2 class="lurus-section-head__title">Recorre todo el flujo en 20 minutos</h2>
  <p class="lurus-section-head__lede">¿Es tu primera vez? Sigue el orden.</p>
</div>

<ol class="lurus-steps">
<li>

[Obtener una API Key](/es/guide/get-api-key) —— Regístrate y crea tu primera Key (3 minutos)

</li>
<li>

[Inicio rápido](/es/guide/quickstart) —— Envía tu primera solicitud a la API (5 minutos)

</li>
<li>

[Modelos compatibles](/guide/models) —— Conoce qué modelos están disponibles y cómo elegir

</li>
<li>

[API de Chat Completions](/es/api/chat-completions) —— Domina la interfaz más utilizada

</li>
</ol>

::: details Los usuarios avanzados pueden saltar directamente a…
- [Function Calling](/es/api/chat-completions#function-calling) — Haz que la IA llame a tus funciones
- [Respuestas en streaming](/es/api/chat-completions#流式响应) — Salida palabra por palabra para mejorar la experiencia
- [Visión general de la referencia de la API](/es/api/overview) — Lista completa de endpoints
:::

<NextSteps
  title="Siguiente paso"
  :steps="[
    { text: 'Inicio rápido', link: '/es/guide/quickstart', primary: true },
    { text: 'Modelos compatibles', link: '/guide/models' },
    { text: 'Consola', link: 'https://api.lurus.cn', external: true },
  ]"
/>

<RelatedProducts product-id="lurus-api" />

</div>
