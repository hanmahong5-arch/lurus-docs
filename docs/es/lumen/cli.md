---
title: Manual de Lumen CLI
description: Todos los subcomandos, opciones, códigos de salida y andamiaje de flujos de trabajo de lumen-cli.
---

<div class="lumen-page">

# Manual de Lumen CLI <StatusBadge status="dev" />

`lumen-cli` es la CLI opcional de Lumen (compilada en Rust), que ofrece capacidades de flujo de trabajo desde la línea de comandos sin depender del SDK de Python.

## Instalación

```bash
cargo install lumen-cli
# 或
curl -fsSL https://lumen.lurus.cn/install.sh | sh
```

## Visión general

```
lumen <command> [options]
```

| Comando | Propósito |
|------|------|
| `doctor` | Autodiagnóstico del entorno: Token, red, disco, dependencias de Python |
| `init` | Genera la plantilla de configuración `lumen.yaml` en la raíz del proyecto |
| `agent` | Operaciones a nivel de Agente: lista / trace / replay / export |
| `mcp` | Capa de compatibilidad MCP: expone las capacidades de Lumen a Claude/Codex |
| `workflow` | Ejecutor de flujos de trabajo basado en `lumen.yaml` |
| `deploy` | Envía las definiciones de Agente al Kova Cluster |
| `config` | Consulta/modifica la configuración local de la CLI |

## Detalle de los comandos

```bash
# doctor — 环境自检（退出码 0 全通过 / 1 至少一项失败）
lumen doctor
#   ✓ LURUS_API_KEY present  ✓ python3.11 detected  ✓ /var/lumen writable (5.2 GB free)
#   ✗ port 7070 occupied — close the process or set LUMEN_PORT

# init — 项目根生成 lumen.yaml（templates: langgraph / bare / multi-agent）
lumen init --template langgraph

# agent
lumen agent list                  # 列出本地/远端 Agent
lumen agent trace <run-id>        # 打印 trace 树
lumen agent replay <run-id>       # 不消耗 Token 重放
lumen agent export <run-id>       # 导出 JSON / HAR / OTel

# mcp — 启动 MCP 服务端，暴露 Trace/Replay/Cost 为工具
lumen mcp serve --port 3333       # 或 --manifest ./my-tools.yaml
# Claude Code / Codex 的 mcp_servers 指向 http://127.0.0.1:3333 即可调用

# workflow — 按 lumen.yaml 执行多 Agent 编排
lumen workflow run                # 默认 pipeline；-e prod 指定环境；--dry-run 不实际调 LLM

# deploy — 推送 Agent 定义到 Kova Cluster
lumen deploy --target kova://my-cluster

# config
lumen config get api_key
lumen config set api_key sk-xxxx
lumen config unset telemetry.endpoint
```

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="rewind" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">replay y dry-run no cuestan nada</p>
    <div class="lurus-callout__body"><code>lumen agent replay &lt;run-id&gt;</code> reproduce a partir del historial, <strong>sin consumir Token</strong>; <code>lumen workflow run --dry-run</code> recorre todo el flujo de orquestación pero <strong>sin llamar realmente al LLM</strong>, ideal para validar la configuración de <code>lumen.yaml</code>.</div>
  </div>
</div>

## Códigos de salida

| Code | Significado |
|------|------|
| `0` | Éxito |
| `1` | Error general |
| `2` | Error de argumentos |
| `3` | Configuración faltante |
| `4` | Error de red |
| `5` | El servicio remoto devolvió un error |

## Siguientes pasos

<NextSteps :steps="[
  { text: 'Volver a la introducción', link: '/es/lumen/', primary: true },
  { text: 'SDK de Python', link: '/es/lumen/python-sdk' },
  { text: 'Integración con el ecosistema', link: '/es/lumen/integration' },
]" />

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-callout { margin: 18px 0; }
</style>
