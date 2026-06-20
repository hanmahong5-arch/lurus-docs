---
title: "Integración unificada de CLI de IA para equipos (Switch + MCP + gateway)"
description: "Usa Switch para gestionar de forma unificada las herramientas CLI de IA, los servidores MCP y los costes de modelos de tu equipo —— una sola configuración central, sincronizada entre Claude Code / Codex / Gemini."
---

<div class="tut-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="monitor" :size="14" /> Tutorial multiproducto</span>
  <h1 class="lurus-section-head__title">Integración unificada de CLI de IA para equipos</h1>
  <p class="lurus-section-head__lede">Reúne la configuración de las CLI de IA, los servidores MCP y las Key de modelos dispersas en cada máquina de los ingenieros en <strong>una sola configuración central</strong>: Switch gestiona MCP y la sincronización, y Lurus API gestiona los modelos y la facturación.</p>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Productos implicados</p>
    <div class="lurus-callout__body">Switch (gestión de herramientas de escritorio) · Lurus API (gateway unificado) · servidores MCP (Kova / GitHub / PostgreSQL, etc.). Este tutorial solo hace referencia a capacidades ya existentes en la documentación de cada producto.</div>
  </div>
</div>

## <Icon name="package" :size="20" /> Lo que obtendrás

| Before (cada uno por su cuenta) | After (unificado con Switch) |
|---|---|
| Cada persona escribe a mano su `mcp_servers.json`, con versiones de herramientas distintas | Una sola `mcp.yaml` central, con `visible_to` para distribuir según necesidad |
| Cada CLI rellena su propia Provider Key | Todo pasa por Lurus API, una sola Key y una sola factura |
| El coste de los modelos es invisible | El panel de costes de Switch agrega por herramienta / modelo |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="rocket" :size="14" /> Paso 1</span>
  <h2 class="lurus-section-head__title">Instala Switch y conéctalo al gateway</h2>
</div>

<ol class="lurus-steps">
<li>

Instala Switch siguiendo la [guía de instalación](/es/switch/install) (macOS / Windows / Linux).

</li>
<li>

En los ajustes, introduce tu <Term t="API Key">API Key</Term> de Lurus ([cómo obtenerla](/es/guide/get-api-key)) para que todas las CLI llamen a los modelos de forma unificada a través de `https://api.lurus.cn/v1` —— una sola Key, una sola factura.

</li>
<li>

Verifica que el proxy local está en marcha (puerto 19090 por defecto):

```bash
curl http://localhost:19090/v1/models
```

</li>
</ol>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="plug" :size="14" /> Paso 2</span>
  <h2 class="lurus-section-head__title">Escribe una configuración MCP central</h2>
  <p class="lurus-section-head__lede">Switch gestiona todos los servidores MCP con un único <code>~/.lurus-switch/mcp.yaml</code>, y <code>visible_to</code> decide cuáles ve cada CLI.</p>
</div>

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

  kova:                       # Kova Agent 作为工具暴露
    url: http://localhost:3333
    type: http
    visible_to: [claude-code, codex, gemini]
```

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shuffle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">visible_to controla la distribución según necesidad</p>
    <div class="lurus-callout__body">Al cambiar a cualquier CLI, Switch genera dinámicamente el <code>mcp_servers.json</code> de esa CLI según <code>visible_to</code>, de modo que cada herramienta solo ve los Server asignados a ella. La lista de servidores integrables está en el <a href="/es/integrations/">catálogo de integraciones</a>, y los detalles de gestión en <a href="/es/switch/mcp-servers">servidores MCP</a>.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> Paso 3</span>
  <h2 class="lurus-section-head__title">Visualiza los costes y luego sincroniza con el equipo</h2>
</div>

<ol class="lurus-steps">
<li>

Abre la <a href="/es/switch/cost-monitoring">monitorización de costes</a> de Switch y consulta el consumo de Token por herramienta / modelo —— como todas las llamadas pasan por la misma Lurus API Key, la facturación es unificada.

</li>
<li>

Una vez confirmada la configuración, usa la <a href="/es/switch/team-config">sincronización de equipo</a> para distribuir este `mcp.yaml` a todo el equipo: los nuevos miembros lo tienen listo desde el primer momento y con la misma versión.

</li>
</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="sparkles" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Qué puedes añadir a continuación</p>
    <div class="lurus-callout__body"><p>Conecta a la CLI la <a href="/es/memx/quickstart">memoria de MemX</a> (herramientas <code>memory_search</code> / <code>memory_add</code>) para que el Agent recuerde las normas del proyecto; o integra <a href="/es/lumen/">Lumen</a> para el seguimiento de llamadas y las alertas de coste.</p></div>
  </div>
</div>

<NextSteps
  title="Próximos pasos"
  :steps="[
    { text: 'Servidores MCP de Switch', link: '/es/switch/mcp-servers', primary: true },
    { text: 'Catálogo de integraciones y MCP', link: '/es/integrations/' },
    { text: 'Tutorial del Agent de memoria', link: '/es/tutorials/memory-agent' },
  ]"
/>

</div>
