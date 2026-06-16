---
title: Switch — Gestión de servidores MCP
description: Configura / depura servidores MCP de forma visual, sincronizados entre CLIs de IA.
---

<div class="switch-page">

# Gestión de servidores MCP <StatusBadge status="dev" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="plug" :size="14" /> Gestión unificada</span>
  <h2 class="lurus-section-head__title">Una configuración central, sincronizada entre CLIs</h2>
  <p class="lurus-section-head__lede">Switch unifica la gestión de la configuración dispersa en los distintos <code>mcp_servers.json</code> de Claude Code / Codex / Gemini, y ofrece depuración visual.</p>
</div>

## Gestor de MCP

Abre Switch → "Servidores MCP" en el panel izquierdo, donde podrás ver:

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">Estado de registro</div>
    <p class="lurus-card__body">Todos los MCP Server registrados actualmente, con su estado <span class="lurus-tag">running</span> <span class="lurus-tag">stopped</span> <span class="lurus-tag">errored</span></p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="share-2" :size="20" /></span>
    <div class="lurus-card__title">Relaciones de referencia</div>
    <p class="lurus-card__body">Qué CLIs referencian cada Server</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="history" :size="20" /></span>
    <div class="lurus-card__title">Registro de llamadas</div>
    <p class="lurus-card__body">Las últimas N llamadas a herramientas</p>
  </div>
</div>

## Formato de configuración

Switch usa un único `~/.lurus-switch/mcp.yaml` central:

```yaml
servers:
  github:
    command: npx
    args: [-y, '@modelcontextprotocol/server-github']
    env:
      GITHUB_TOKEN: ${GITHUB_TOKEN}
    visible_to: [claude-code, codex]

  postgres:
    command: docker
    args: [run, -i, --rm, mcp/postgres, 'postgres://localhost/dev']
    visible_to: [claude-code]

  kova:
    url: http://localhost:3333
    type: http
    visible_to: [claude-code, codex, gemini]
```

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shuffle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">visible_to controla la distribución bajo demanda</p>
    <div class="lurus-callout__body">Al cambiar a cualquier CLI, Switch genera dinámicamente el <code>mcp_servers.json</code> de ese CLI según <code>visible_to</code>, de modo que cada herramienta solo ve los Server que se le han asignado.</div>
  </div>
</div>

## Depuración

Selecciona un Server y, en el panel de depuración de la derecha:

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="puzzle" :size="20" /></span>
    <div class="lurus-card__title">Lista de Tools</div>
    <p class="lurus-card__body">Todas las herramientas que expone el Server, incluido el schema de parámetros de entrada</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Llamada manual</div>
    <p class="lurus-card__body">Rellena los parámetros y pruébala directamente</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="search" :size="20" /></span>
    <div class="lurus-card__title">Request Log</div>
    <p class="lurus-card__body">El JSON completo de las últimas request/response</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="rewind" :size="20" /></span>
    <div class="lurus-card__title">Reiniciar</div>
    <p class="lurus-card__body">Reinicio a nivel de proceso</p>
  </div>
</div>

## Integración rápida de Server habituales

Switch incluye botones de instalación con un clic, sin necesidad de escribir la configuración a mano:

| Server | Uso |
|--------|------|
| `github` | Leer/escribir issues / PR / archivos |
| `postgres` | Consultar la base de datos |
| `filesystem` | Leer/escribir archivos locales |
| `slack` | Enviar mensajes / leer canales |
| `kova` | Agente Kova como herramienta |
| `lumen` | Lumen Trace / Replay |

## Sincronizar con el equipo

Consulta [Sincronización de equipo](/es/switch/team-config).

## Siguiente paso

<NextSteps :steps="[
  { text: 'Monitorización de costes', link: '/es/switch/cost-monitoring', primary: true },
  { text: 'Sincronización de equipo', link: '/es/switch/team-config' },
  { text: 'Volver al manual de uso', link: '/es/switch/usage' },
]" />

</div>

<style scoped>
.switch-page .lurus-section-head { margin-top: 2.6rem; }
</style>
