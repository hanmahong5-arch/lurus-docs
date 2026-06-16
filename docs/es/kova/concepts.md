---
title: Conceptos básicos de Kova
description: Los componentes arquitectónicos centrales y la filosofía de diseño de Kova, como WAL, Agent Loop y Checkpoint.
---

<div class="kova-concepts">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bot" :size="14" /> Conceptos básicos</span>
  <h1 class="lurus-section-head__title">Conceptos básicos de Kova</h1>
  <p class="lurus-section-head__lede">Desde Agent, Workflow y Swarm hasta la persistencia con WAL: comprende los componentes arquitectónicos centrales y la filosofía de diseño de Kova.</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">3μs</span><span class="lurus-stat__label">Latencia de planificación</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">315K</span><span class="lurus-stat__label">ops/s de rendimiento</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">21</span><span class="lurus-stat__label">crates del workspace</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">&lt;10MB</span><span class="lurus-stat__label">binario único</span></div>
</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--kova" href="#agent"><span class="lurus-card__icon"><Icon name="bot" :size="22" /></span><div class="lurus-card__title">Agent</div><p class="lurus-card__body">Unidad de ejecución básica: Prompt + Model + Tools + Memory</p></a>
  <a class="lurus-card lurus-card--kova" href="#workflow"><span class="lurus-card__icon"><Icon name="workflow" :size="22" /></span><div class="lurus-card__title">Workflow</div><p class="lurus-card__body">Orquesta varios Agents en una canalización de ejecución ordenada</p></a>
  <a class="lurus-card lurus-card--kova" href="#swarm-inteligencia-colectiva"><span class="lurus-card__icon"><Icon name="network" :size="22" /></span><div class="lurus-card__title">Swarm</div><p class="lurus-card__body">Colaboración autónoma entre múltiples Agents, comunicación directa con el protocolo A2A</p></a>
  <a class="lurus-card lurus-card--kova" href="#wal-write-ahead-log"><span class="lurus-card__icon"><Icon name="database-backup" :size="22" /></span><div class="lurus-card__title">WAL</div><p class="lurus-card__body">Registro de escritura anticipada + verificación CRC32, recuperación automática ante caídas</p></a>
</div>

---

## Agent

Un Agent es la unidad de ejecución básica y está compuesto por los siguientes elementos:

| Elemento | Descripción |
|------|------|
| **<Term t="System Prompt">System Prompt</Term>** | Define el rol del Agent, los límites de sus capacidades y sus normas de comportamiento |
| **Model** | El modelo LLM utilizado (intercambiable en tiempo de ejecución) |
| **Tools** | El conjunto de herramientas que el Agent puede invocar |
| **Memory** | El historial de conversación y el estado persistente del Agent |

### Ciclo de vida del Agent

<ArchitectureDiagram title="Máquina de estados del Agent" chart="graph LR
  Created --> Idle
  Idle --> Running
  Running --> Completed
  Running --> Paused
  Running --> Failed
  Running --> Recovering
  Paused -.reanudar.-> Running
  Recovering -.reproducir WAL.-> Running" />

| Estado | Significado |
|------|------|
| **Idle** | El Agent está creado y a la espera de una tarea |
| **Running** | Ejecutando una tarea |
| **Paused** | Pausado manualmente, reanudable |
| **Completed** | Tarea completada |
| **Failed** | La ejecución falló (se superó el número de reintentos) |
| **Recovering** | Se detectaron registros WAL incompletos y se recuperan automáticamente |

### Bucle de decisión del Agent

<ArchitectureDiagram title="Bucle de decisión" chart="graph LR
  A[Recibir tarea / resultado del paso anterior] --> B[Inferencia del LLM<br/>análisis + planificación]
  B --> C{¿Se necesita una herramienta?}
  C -->|Yes| D[Invocar herramienta] --> E[Resultado de la herramienta] --> B
  C -->|No| F[Generar respuesta final] --> G[Devolver resultado]" />

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="database-backup" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Cada ronda se persiste en disco</p>
    <div class="lurus-callout__body">Cada ronda de decisión se escribe en el WAL, lo que garantiza que tras una caída se pueda reproducir desde el punto de interrupción sin necesidad de volver a llamar al LLM.</div>
  </div>
</div>

---

## Workflow

Un Workflow orquesta varios Agents o pasos en una canalización de ejecución ordenada.

### Tipos de paso

| Tipo | Descripción |
|------|------|
| **Paso de Agent** | Se delega a un Agent específico para su ejecución |
| **Bifurcación condicional** | Elige una ruta distinta según el resultado del paso anterior |
| **Paso paralelo** | Varios pasos se ejecutan simultáneamente |
| **Paso de espera** | Espera un evento externo o una aprobación humana |
| **Paso en bucle** | Se ejecuta repetidamente hasta cumplir una condición |

### Paso de datos

Los pasos se transmiten datos entre sí mediante variables de plantilla:

```
{{input.topic}}              → 工作流输入参数
{{steps.research.output}}    → "research" 步骤的输出
{{steps.research.metadata}}  → "research" 步骤的元数据
```

### Manejo de errores

Cada paso puede configurar su propia estrategia de error independiente:

| Estrategia | Comportamiento |
|------|------|
| `retry` | Reintenta N veces (3 por defecto, retroceso exponencial) |
| `skip` | Omite el paso fallido y continúa la ejecución |
| `abort` | Termina todo el workflow |
| `fallback` | Cambia a un paso alternativo |

---

## <Term t="Swarm">Swarm</Term> (inteligencia colectiva)

El modo Swarm permite que varios Agents colaboren de forma autónoma, sin necesidad de un flujo fijo predefinido.

### Forma de trabajo

<ArchitectureDiagram title="Flujo de colaboración de Swarm" chart="graph LR
  U[Tarea del usuario] --> C[Agent coordinador]
  C --> S[Descomponer en subtareas]
  S --> R[Agent de investigación]
  S --> D[Agent de codificación]
  S --> T[Agent de pruebas]
  R --> M[Recopilar resultados]
  D --> M
  T --> M
  M --> O[Salida combinada]" />

Los Agents se comunican directamente entre sí mediante el protocolo <Term t="A2A">A2A (Agent-to-Agent)</Term>:

```json
{
  "from": "coordinator",
  "to": "researcher",
  "type": "task_delegate",
  "payload": {
    "task": "调研 WebAssembly 在服务端的性能基准",
    "constraints": {
      "max_tokens": 2000,
      "deadline": "5min"
    }
  }
}
```

---

## <Term t="WAL">WAL</Term> (Write-Ahead Log)

El WAL es el mecanismo central de persistencia de Kova, inspirado en el diseño de los sistemas de bases de datos.

### Flujo de escritura

<ArchitectureDiagram title="Flujo de escritura del WAL" chart="graph LR
  A[Cambio de estado del Agent] --> B[Serializar + CRC32<br/>calcular suma de verificación]
  B --> C[Escribir en el archivo WAL<br/>primero el registro]
  C --> D[Ejecutar la operación real]
  D --> E[Marcar el WAL como completado<br/>confirmar commit]" />

### Flujo de recuperación

Al iniciarse, escanea automáticamente el WAL y recupera las operaciones incompletas:

<ol class="lurus-steps">
<li>Registros ya completados —— <strong>se omiten</strong>.</li>
<li>Fallo en la verificación CRC32 —— <strong>se marcan como dañados y se omiten</strong>.</li>
<li>Registros incompletos —— <strong>se vuelven a ejecutar</strong>.</li>
</ol>

### <Term t="Ring Buffer">Búfer circular</Term>

El WAL utiliza un búfer circular cuyo tamaño es una potencia de 2:

- El puntero de escritura se reinicia automáticamente al llegar al final
- Los registros antiguos ya confirmados se sobrescriben con registros nuevos
- Cuando el búfer se llena se desencadena la compactación

### Modos de sincronización

| Modo | Descripción | Rendimiento | Durabilidad |
|------|------|------|--------|
| `normal` | El sistema operativo decide cuándo hacer fsync | Alto | Posible pérdida de varios segundos de datos |
| `full` | fsync en cada escritura | Bajo | Cero pérdida de datos |

### Opciones de cifrado

En escenarios sensibles se puede habilitar el cifrado del WAL:

| Algoritmo | Descripción |
|------|------|
| `aes-256-gcm` | Cifrado AES-256 estándar |
| `sm4` | Algoritmo nacional chino SM4 |

También se puede habilitar la verificación de integridad HMAC para evitar que el archivo WAL sea manipulado.

---

## Orden de bloqueos

Kova utiliza internamente un orden estricto de adquisición de bloqueos para eliminar los interbloqueos de raíz:

<ArchitectureDiagram title="Orden de adquisición de bloqueos" chart="graph LR
  A[Buffer Lock] --> B[Queue Lock] --> C[Transaction Lock]" />

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Prevención de interbloqueos en tiempo de compilación</p>
    <div class="lurus-callout__body">Todas las rutas de código deben respetar este orden. Intentar adquirir bloqueos violando el orden desencadena una comprobación en tiempo de compilación (garantizada por el sistema de tipos de Rust).</div>
  </div>
</div>

---

## Sistema de herramientas

### Herramientas integradas

| Herramienta | Función |
|------|------|
| `web_search` | Buscar en Internet |
| `file_read` | Leer archivos |
| `file_write` | Escribir archivos |
| `http_request` | Enviar peticiones HTTP |
| `shell_exec` | Ejecutar comandos de shell (entorno aislado) |
| `db_query` | Consultas a la base de datos |

### Herramientas MCP

Conecta servicios de herramientas externas mediante el [Model Context Protocol](https://modelcontextprotocol.io/):

```toml
# kova.toml
[[mcp.servers]]
name = "github"
command = "npx"
args = ["-y", "@modelcontextprotocol/server-github"]
env = { GITHUB_PERSONAL_ACCESS_TOKEN = "ghp_xxx" }

[[mcp.servers]]
name = "postgres"
command = "npx"
args = ["-y", "@modelcontextprotocol/server-postgres"]
env = { DATABASE_URL = "postgres://..." }
```

El Agent puede invocar las herramientas MCP igual que las herramientas integradas.

### Protocolo A2A

Protocolo de comunicación Agent-to-Agent, que admite:

- **Delegación de tareas**: un Agent entrega una subtarea a otro
- **Consulta de información**: los Agents intercambian información directamente entre sí
- **Notificación de resultados**: se notifica al iniciador cuando la tarea se completa
- **Descubrimiento de capacidades**: consultar qué pueden hacer otros Agents

---

## Niveles de características

Kova controla el alcance de la compilación mediante feature flags de Rust. La compilación mínima solo necesita `pure-rust`, y se van añadiendo según se necesite: `serde` (serialización), `workflow` (orquestación de workflows) → `agent` (motor de Agents) → `swarm` (inteligencia colectiva), `encrypt` (cifrado) → `sm4` (criptografía nacional china) / `wal-hmac` (verificación de integridad), etc.

---

## Próximos pasos

<NextSteps title="Próximos pasos" :steps="[
  { text: 'Inicio rápido — pon en marcha tu primer Agent en 5 minutos', link: '/es/kova/quickstart', primary: true },
  { text: 'Referencia de la API — documentación completa de los endpoints REST', link: '/es/kova/api' },
  { text: 'Motor de memoria MemX — añade memoria persistente a tus Agents', link: '/es/memx/' },
]" />

<RelatedProducts product-id="kova" />

</div>

<style scoped>
.kova-concepts .lurus-stat-strip {
  margin: 1.5rem 0 2rem;
}
.kova-concepts .lurus-cards--compact {
  margin-bottom: 0.5rem;
}
</style>
