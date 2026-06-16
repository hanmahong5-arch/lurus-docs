---
title: Switch — Monitoreo de costos
description: Agrega los costos de 5 CLI, alertas por umbral, análisis de atribución y sinergia con Lumen.
---

<div class="switch-page">

# Monitoreo de costos <StatusBadge status="dev" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bar-chart-3" :size="14" /> Panel de costos</span>
  <h2 class="lurus-section-head__title">Reúne el consumo de Tokens de 5 CLI en un solo lugar</h2>
  <p class="lurus-section-head__lede">Switch agrega de forma unificada el consumo de Tokens de herramientas como Claude Code / Codex / Gemini / PicoClaw / NullClaw, y alerta antes de superar el presupuesto.</p>
</div>

## Agregación de costos

Después de iniciar el proceso en segundo plano de Switch, todas las solicitudes de los procesos CLI lanzados por Switch pasan por el proxy local (por defecto `127.0.0.1:41234`) y se registran en una base SQLite local:

```
~/.lurus-switch/costs.db
```

Dimensiones de agregación:

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="terminal" :size="20" /></span>
    <div class="lurus-card__title">Herramienta</div>
    <p class="lurus-card__body">claude-code / codex / gemini / picoclaw / nullclaw</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">Modelo</div>
    <p class="lurus-card__body">claude-sonnet-4 / gpt-5 / gemini-3-pro, etc.</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="package" :size="20" /></span>
    <div class="lurus-card__title">Proyecto</div>
    <p class="lurus-card__body">Por el root del repositorio git donde se encuentra el CWD</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="timer" :size="20" /></span>
    <div class="lurus-card__title">Tiempo</div>
    <p class="lurus-card__body">Día / semana / mes</p>
  </div>
</div>

## Alertas por umbral

Se configuran en la página de ajustes de Switch:

| Tipo de alerta | Ejemplo |
|---------|------|
| Presupuesto diario | Notificación del sistema al superar ¥50/día |
| Llamada individual | Marcado en rojo al superar ¥2/llamada |
| Proporción por modelo | Aviso para cambiar de gama cuando Claude Opus > 60% |

Canales de alerta: <span class="lurus-tag">Notificación del sistema</span> <span class="lurus-tag">Correo</span> <span class="lurus-tag">Webhook</span>

## Análisis de atribución

> "¿Por qué hoy se gastó de repente tanto?"

Switch ofrece una atribución **tipo gráfico de llamas**, profundizando capa por capa hasta el culpable concreto:

```
总消费 ¥38.2 (↑ 250% vs 昨日)
├─ claude-code   ¥28.4 (74%)  ← 主因
│   └─ 项目: 2l-bs-docs       ¥21.3  ← 具体元凶
│       └─ 模型: claude-opus  ¥19.8
├─ codex         ¥6.5
└─ gemini        ¥3.3
```

## Sinergia con Lumen

Para proyectos de Agent que usan el SDK de Lumen, Switch puede fusionar los datos de Trace de grano fino de Lumen:

```
Switch 粗粒度: 项目 / 工具 / 模型
     +
Lumen 细粒度: Graph / Node / LLM Call
     =
完整成本拓扑
```

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="git-merge" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Activar la integración con Lumen</p>
    <div class="lurus-callout__body">En los ajustes de Switch, activa «Integración con Lumen» y apúntala a <code>http://localhost:7070</code> para fusionar los costos de grano grueso de Switch con los Trace de nivel Graph / Node / LLM Call de Lumen en una topología de costos completa.</div>
  </div>
</div>

## Exportar

Desde la interfaz:

```
右键 → 导出为 CSV / JSON
```

O por línea de comandos:

```bash
lurus-switch export --format csv --since 30d > costs.csv
```

## Siguiente paso

<NextSteps :steps="[
  { text: 'Gestión de servidores MCP', link: '/es/switch/mcp-servers', primary: true },
  { text: 'Sincronización de equipo', link: '/es/switch/team-config' },
  { text: 'Seguimiento de costos de Lumen', link: '/es/lumen/python-sdk' },
]" />

</div>

<style scoped>
.switch-page .lurus-section-head { margin-top: 2.6rem; }
</style>
