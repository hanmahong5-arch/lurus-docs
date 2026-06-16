---
title: Inicio rápido de Kova
description: Pon en marcha tu primer Agente Kova en 5 minutos, una guía completa desde la instalación hasta la ejecución.
---

<div class="kova-qs-page">

# Inicio rápido <StatusBadge status="dev" />

Pon en marcha tu primer Agente Kova en 5 minutos.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">5 minutos</span><span class="lurus-stat__label">Tiempo estimado</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3 formas</span><span class="lurus-stat__label">Métodos de instalación</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Cero</span><span class="lurus-stat__label">Dependencias externas</span></div>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Requisitos previos</p>
    <div class="lurus-callout__body">Docker o Rust 1.93+ (a elegir) · Lurus <Term t="API Key">API Key</Term> (<a href="/es/guide/get-api-key">cómo obtenerla</a>) · 8 GB+ de memoria (recomendado) · conocimientos básicos de terminal. Tiempo estimado: 5 minutos.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package" :size="14" /> Instalación</span>
  <h2 class="lurus-section-head__title">Instalar Kova</h2>
  <p class="lurus-section-head__lede">Docker (recomendado), binario precompilado o compilación desde el código fuente; elige una opción.</p>
</div>

<CodeShowcase
  title="Elige un método de instalación"
  :tabs="[
    { lang: 'bash', label: 'Docker (recomendado)', code: 'docker run -d \\\n  --name kova \\\n  -p 8080:8080 \\\n  -v kova-data:/data \\\n  -e LURUS_API_KEY=sk-your-key \\\n  ghcr.io/hanmahong5-arch/kova:latest' },
    { lang: 'bash', label: 'Binario precompilado', code: '# Linux / macOS\nchmod +x kova-linux-amd64\n./kova-linux-amd64 serve --port 8080' },
    { lang: 'bash', label: 'Compilar desde el código fuente', code: 'git clone https://github.com/hanmahong5-arch/agentdrq.git\ncd agentdrq\n\n# 使用 pure-rust 特性（无系统依赖）\ncargo build --workspace --no-default-features --features pure-rust --release' },
  ]"
/>

Descarga el binario precompilado desde [GitHub Releases](https://github.com/hanmahong5-arch/agentdrq/releases):

| Plataforma | Archivo |
|------|------|
| Linux x86_64 | `kova-linux-amd64` |
| macOS (Apple Silicon) | `kova-darwin-arm64` |
| macOS (Intel) | `kova-darwin-amd64` |
| Windows | `kova-windows-amd64.exe` |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="zap" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Requisito de versión de Rust</p>
    <div class="lurus-callout__body">Kova requiere Rust 1.93+ (Edition 2024). Se recomienda usar rustup para gestionar la cadena de herramientas.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Configuración</span>
  <h2 class="lurus-section-head__title">Configuración</h2>
</div>

Crea el archivo de configuración `kova.toml`:

```toml
[server]
port = 8080
data_dir = "./data"

[llm]
# 通过 Lurus API 接入所有模型
provider = "openai-compatible"
base_url = "https://api.lurus.cn/v1"
api_key = "sk-your-lurus-key"
default_model = "deepseek-chat"

[wal]
# WAL 持久化配置
enabled = true
sync_mode = "normal"  # "normal" | "full" (每次写入 fsync)

[security]
# 可选：启用 WAL 加密
# encrypt = true
# encrypt_algorithm = "aes-256-gcm"
```

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bot" :size="14" /> Primeros pasos</span>
  <h2 class="lurus-section-head__title">Inicia tu primer Agente</h2>
  <p class="lurus-section-head__lede">Elige entre REST / Rust SDK / CLI para crear un Agente, enviar tareas y ver la ejecución en streaming.</p>
</div>

Una vez iniciado, elige el método de acceso que prefieras para crear y ejecutar tu primer Agente (consulta los endpoints completos en la [Referencia de la API](/es/kova/api)).

:::tabs
== REST API

1. **Crear un Agente** — `POST /api/v1/agents`, la respuesta incluye `id="agt_a1b2c3d4"` y `status="idle"`

```bash
curl -X POST http://localhost:8080/api/v1/agents \
  -H "Content-Type: application/json" \
  -d '{ "name": "researcher", "system_prompt": "你是一个专业的技术研究员，深入分析主题并给出结构化研究报告。", "model": "deepseek-chat", "tools": ["web_search", "file_write"] }'
```

2. **Enviar una tarea** — `POST /api/v1/agents/{id}/tasks`, la respuesta incluye `task_id="tsk_e5f6g7h8"` y `status="running"`

```bash
curl -X POST http://localhost:8080/api/v1/agents/agt_a1b2c3d4/tasks \
  -H "Content-Type: application/json" \
  -d '{ "message": "研究 Rust 在 AI 基础设施中的应用趋势，输出一份 500 字的报告" }'
```

3. **Consultar / seguir en streaming** — `GET /api/v1/tasks/{id}` o ver el proceso de ejecución en tiempo real vía WebSocket

```bash
curl http://localhost:8080/api/v1/tasks/tsk_e5f6g7h8
wscat -c ws://localhost:8080/api/v1/tasks/tsk_e5f6g7h8/stream
```

== Rust SDK

Integra el motor de Kova directamente dentro del proceso; tras un fallo se recupera automáticamente desde el WAL local:

```rust
use kova::prelude::*;

let engine = KovaBuilder::new()
    .wal_dir("./agent-state")
    .build()?;

let agent = engine.create_agent("researcher")
    .model("deepseek-chat")
    .tools(&["web_search", "file_read"])
    .build()?;

// Agent 崩溃 → 从 WAL 自动恢复，不重调 LLM
agent.run("帮我调研 WASM Component Model").await?;
```

== CLI

Kova incluye una TUI (interfaz interactiva de terminal) y una línea de comandos:

```bash
# 启动 TUI
kova tui

# 或直接用 CLI 命令
kova agent create --name researcher --model deepseek-chat
kova agent run researcher "分析 Rust 在 AI 领域的应用"
kova agent list
kova agent logs researcher --tail 50
```
:::

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> Flujo de trabajo</span>
  <h2 class="lurus-section-head__title">Crear un flujo de trabajo</h2>
</div>

Un flujo de trabajo encadena varios pasos en una canalización de ejecución ordenada (los pasos se pasan valores entre sí mediante variables de plantilla, véase el ejemplo a continuación):

```bash
curl -X POST http://localhost:8080/api/v1/workflows \
  -H "Content-Type: application/json" \
  -d '{ "name": "content-pipeline", "steps": [
    { "name": "research", "agent": "researcher", "prompt": "研究主题：{{input.topic}}" },
    { "name": "write", "agent": "writer", "prompt": "基于研究报告撰写博客：\n{{steps.research.output}}" },
    { "name": "review", "agent": "editor", "prompt": "审校并优化：\n{{steps.write.output}}" }
  ] }'

# 触发
curl -X POST http://localhost:8080/api/v1/workflows/content-pipeline/run \
  -H "Content-Type: application/json" -d '{"input": {"topic": "边缘计算与 AI 推理"}}'
```

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="database-backup" :size="14" /> Persistencia</span>
  <h2 class="lurus-section-head__title">Verificar la persistencia</h2>
  <p class="lurus-section-head__lede">Mata el proceso y, tras reiniciar, la tarea se recupera automáticamente desde el punto de interrupción del WAL.</p>
</div>

Prueba la capacidad de recuperación ante fallos de Kova:

<ol class="lurus-steps">
<li>

**Inicia una tarea larga**

```bash
kova agent run researcher "写一份 5000 字的深度报告"
```

</li>
<li>

**Mientras la tarea se ejecuta, termina el proceso por la fuerza**

```bash
kill -9 $(pgrep kova)
```

</li>
<li>

**Reinicia Kova**

```bash
./kova serve
```

</li>
<li>

**Consulta el estado de la tarea** — se recupera automáticamente desde el punto de interrupción

```bash
kova task status
```

</li>
</ol>

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Por qué puede recuperarse</p>
    <div class="lurus-callout__body">Antes de ejecutar cada paso se escribe primero en el <Term t="WAL">WAL</Term> (con verificación CRC32). Cuando el proceso falla, los pasos cuya finalización no se confirmó se reproducen desde el punto de interrupción tras el reinicio, sin volver a llamar al LLM ni perder progreso. Más detalles en <a href="/es/kova/concepts">Conceptos básicos</a>.</div>
  </div>
</div>

---

## Siguientes pasos

<NextSteps
  :steps="[
    { text: 'Conceptos básicos — Comprende en profundidad la arquitectura de Agentes, Workflows y WAL', link: '/es/kova/concepts', primary: true },
    { text: 'Referencia de la API — Lista completa de endpoints de la REST API', link: '/es/kova/api' },
    { text: 'Lurus API — Conoce la pasarela LLM subyacente', link: '/es/guide/introduction' },
  ]"
/>

</div>
