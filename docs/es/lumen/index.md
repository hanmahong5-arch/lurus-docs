---
title: Lumen — Herramienta de observabilidad y fiabilidad para Agentes
description: SDK de Python como prioridad + motor Rust + CLI opcional, que ofrece a los desarrolladores de Agentes observabilidad, depuración y garantías de fiabilidad.
---

<div class="lumen-page">

<ProductHero product-id="lumen" />

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="check-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Requisitos previos</p>
    <div class="lurus-callout__body"><ul><li>Recomendado: Python 3.9+ (<code>pip install lumen-ai</code>)</li><li>CLI opcional: Rust 1.93+ compilando <code>lumen-cli</code> desde el código fuente</li><li>Una <Term t="API Key">API Key</Term> de Lurus (<a href="/es/guide/get-api-key">cómo obtenerla</a>)</li></ul></div>
  </div>
</div>

## ¿Qué es Lumen?

**Lumen** es una **herramienta de fiabilidad tres en uno** para desarrolladores de Agentes de IA — Replay (repetición sin coste) + Crash Recovery (<Term t="Checkpoint">recuperación ante fallos</Term> a nivel de microsegundos) + Cost Tracking (seguimiento de costes en tiempo real). **Formatos de entrega**: SDK de Python como prioridad (`pip install lumen-ai`, primera opción para LangGraph/Agentes) + motor Rust (`lumen-core`, base de rendimiento) + CLI opcional (`lumen-cli` v0.1.0). Filosofía: *Illuminate your AI agents. Never lose a run. Never burn tokens blindly.*

```python
pip install lumen-ai

from lumen_ai import LumenTracer, LumenCheckpointer, CostTracker

# 三行代码接入 — LangGraph 原生集成
graph = workflow.compile(
    checkpointer=LumenCheckpointer(),   # 崩溃恢复
    callbacks=[LumenTracer()]            # 执行追踪 + 成本追踪
)
```

Impulsado por el motor Rust subyacente (lumen-core), con un SDK de Python que ofrece una interfaz amigable, conectando el [motor de Agentes Kova](/es/kova/) y el ecosistema de Python.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">3 líneas</span><span class="lurus-stat__label">para integrar LangGraph</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">microsegundos</span><span class="lurus-stat__label">recuperación ante fallos</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">30+</span><span class="lurus-stat__label">tabla de precios de modelos</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">v0.1.0</span><span class="lurus-stat__label">lumen-cli</span></div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> Capacidades principales</span>
  <h2 class="lurus-section-head__title">Fiabilidad tres en uno</h2>
  <p class="lurus-section-head__lede">Repetición, recuperación, coste — todo listo con una sola integración.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-lumen)"
  :items="[
    { title: 'Replay — repetición determinista sin coste', icon: 'rewind', body: 'Repite cualquier ejecución a partir del trace JSON, sin llamar al LLM ni gastar dinero, y puede comenzar desde un paso concreto para localizar problemas con precisión. lumen replay TRACE_ID (completa) / --from 5 (desde el paso 5).' },
    { title: 'Crash Recovery — recuperación ante fallos en microsegundos', icon: 'life-buoy', body: 'Implementación completa de LangGraph CheckpointSaver, reemplazo directo del Checkpointer nativo de SQLite/Redis. Doble capa memoria+disco, escritura atómica; la recuperación usa repetición del WAL a nivel de motor, sin dependencias de servicios externos.' },
    { title: 'Cost Tracking — seguimiento de costes en tiempo real', icon: 'coins', body: 'Tabla de precios incorporada de más de 30 modelos (Claude / GPT-4o / Gemini / Llama / DeepSeek); estima el coste aunque el LLM no devuelva el importe. Alerta automática cuando una llamada supera 2x el valor medio. lumen cost --last 24h / lumen traces.' },
  ]"
/>

### Más funciones

| Función | Descripción |
|------|------|
| **Gestión de Agentes** | Crear, iniciar, detener y eliminar Agentes |
| **Depuración de flujos de trabajo** | Ejecutar flujos de trabajo localmente, depurar paso a paso |
| **Visualización de logs** | Ver en tiempo real los logs de ejecución del Agente |
| **Despliegue** | Desplegar el Agente en una instancia en la nube de Kova |
| **Gestión de MCP** | Instalar y configurar servicios de herramientas MCP |
| **REPL interactivo** | Conversar directamente con el Agente en la terminal |

---

## Instalación

```bash
pip install lumen-ai                          # Python SDK（推荐）
curl -fsSL https://get.lurus.cn/lumen | sh    # CLI macOS/Linux
# Windows (PowerShell): irm https://get.lurus.cn/lumen.ps1 | iex
# 从源码（Rust 1.93+，首次编译约 2-3 分钟）：
git clone https://github.com/hanmahong5-arch/lumen.git && cd lumen && cargo build --release
# 二进制在 target/release/lumen
```

Verificación: `lumen --version` (→ `lumen 0.1.0`); `lumen doctor` (comprueba Lurus API connected / Kova optional).

---

## Primeros pasos

```bash
# 初始化项目（结构: agent.toml / prompts/system.md / tools/search.yaml / workflows/main.yaml）
lumen init my-agent && cd my-agent

# 配置 API Key
lumen auth login                              # 浏览器登录授权自动配置
lumen config set api_key sk-your-lurus-key    # 或直接设置

# 本地运行 Agent
lumen run --interactive                       # 交互模式
lumen run "分析这段代码的性能问题" --file ./main.py
lumen run "翻译这段文本" --model gpt-4o        # 指定模型

# 工作流调试
lumen workflow run main --input topic="AI trends"
lumen workflow run main --step-by-step        # 逐步调试（每步暂停）
lumen workflow history main --last            # 上次运行结果
```

---

## Comandos habituales

```bash
# Agent 管理
lumen agent list / create researcher / info researcher / logs researcher / delete researcher
# MCP 工具
lumen mcp list / install github / test github / remove github
# 部署
lumen deploy --target kova        # 或 --target docker
lumen deploy status
# 配置
lumen config list / set api_key xxx / get api_key
```

---

## Archivo de configuración

`agent.toml` es la configuración central de un proyecto de Agente:

```toml
[agent]
name = "my-researcher"
model = "deepseek-chat"
max_iterations = 20

[agent.llm]
base_url = "https://api.lurus.cn/v1"
temperature = 0.7
max_tokens = 4096

[tools]
builtin = ["web_search", "file_read", "file_write"]

[[tools.mcp]]
name = "github"
command = "npx"
args = ["-y", "@modelcontextprotocol/server-github"]

[deploy]
target = "kova"
```

---

## Relación con Kova

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Lumen</div>
    <p class="lurus-card__body">Herramienta de línea de comandos para desarrolladores — desarrollo, depuración y despliegue local. Runtime ligero <code>lumen run</code>, listo para usar al instante.</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Kova</div>
    <p class="lurus-card__body">Motor de runtime de Agentes — ejecución persistente, WAL, gestión de clústeres. Tras <code>lumen deploy</code> obtienes capacidades completas de persistencia y clúster.</p>
  </div>
</div>

Para el desarrollo local se usa el runtime ligero (`lumen run`); tras desplegar en Kova (`lumen deploy`) obtienes capacidades completas de persistencia y clúster.

---

## Comparación con otras soluciones

<ComparisonTable
  self-label="Lumen"
  :competitors="['Temporal', 'LangGraph Checkpointer', 'Conductor']"
  :rows="[
    { dimension: 'Replay', self: 'repetición LLM sin coste', alt: { Temporal: 'Event replay', 'LangGraph Checkpointer': 'parcial', Conductor: 'Workflow replay' } },
    { dimension: 'Coste de integración', self: '3 líneas de código', alt: { Temporal: 'Worker + SDK', 'LangGraph Checkpointer': 'configuración', Conductor: 'Worker' } },
    { dimension: 'Seguimiento de coste', self: 'incorporado', alt: { Temporal: 'ninguno', 'LangGraph Checkpointer': 'ninguno', Conductor: 'ninguno' } },
  ]"
  title="Comparativa"
/>

---

## Productos relacionados y siguientes pasos

<NextSteps
  :steps="[
    { text: 'Inicio rápido', link: '/es/lumen/quickstart', primary: true },
    { text: 'Python SDK', link: '/es/lumen/python-sdk' },
    { text: 'Manual de la CLI', link: '/es/lumen/cli' },
    { text: 'Integraciones y catálogo de MCP', link: '/integrations/' },
    { text: 'Documentación oficial del protocolo MCP', link: 'https://modelcontextprotocol.io/', external: true },
  ]"
  title="Siguientes pasos"
/>

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-callout { margin: 20px 0 8px; }
.lumen-page .lurus-stat-strip { margin: 18px 0 4px; }
</style>
