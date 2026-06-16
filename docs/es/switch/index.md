---
title: Switch — Centro unificado de gestión de CLI de programación con IA
description: Aplicación de escritorio que gestiona desde una sola interfaz la configuración, los servidores MCP y los costos de 5 CLI de programación con IA líderes.
---

<div class="switch-page">

<ProductHero product-id="switch" />

<MetricStats :items="[
  { label: 'CLI gestionados', value: '5', hint: 'Claude Code / Codex / Gemini / PicoClaw / NullClaw' },
  { label: 'Tamaño del paquete', value: '<15MB', hint: 'Un solo exe sin dependencias' },
  { label: 'Arranque', value: '<2s', hint: 'Wails + Go 1.25 + React 18' },
]" />

## ¿Qué es Lurus Switch?

**Lurus Switch** es una aplicación de escritorio (un solo exe sin dependencias, &lt; 15MB) que te permite gestionar desde una sola interfaz la configuración, los servidores MCP y los costos de **5 CLI de programación con IA líderes: Claude Code / Codex / Gemini CLI / PicoClaw / NullClaw**. Construida sobre **Wails** (Go 1.25 + React 18), arranca en &lt; 2 segundos y es compatible con Windows / macOS / Linux en todas las plataformas.

Actualmente, los desarrolladores usan a la vez varios CLI de IA como Claude Code, Codex y Gemini CLI, con la configuración dispersa por todas partes y los costos gestionados de forma independiente. Switch centraliza toda esa gestión.

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Una sola interfaz, adiós a buscar la configuración por todas partes</p>
    <div class="lurus-callout__body">Edición visual de la configuración, sincronización de MCP entre herramientas, agregación de costos por herramienta/modelo: ya no necesitas abrir el dotfile de cada CLI por separado.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="sparkles" :size="14" /> Capacidades clave</span>
  <h2 class="lurus-section-head__title">Gestiona todos tus CLI de IA desde un solo lugar</h2>
  <p class="lurus-section-head__lede">Configuración, MCP, costos, claves, proxy: todas las operaciones habituales se realizan en una misma ventana.</p>
</div>

<CapabilityGrid accent="var(--lurus-color-switch)" :items="[
  { title: 'Gestión de configuración multi-CLI', body: 'Edita visualmente la configuración de Claude Code / Codex / Gemini CLI / PicoClaw / NullClaw, con vista previa en tiempo real en Monaco Editor.', icon: 'layers' },
  { title: 'Asistente inteligente de CLAUDE.md', body: 'Escanea el proyecto y genera automáticamente el CLAUDE.md, con puntuación de calidad y sugerencias de optimización.', icon: 'sparkles' },
  { title: 'Visualización de servidores MCP', body: 'Adiós a escribir JSON a mano: configura los servidores MCP de forma visual y sincronízalos entre herramientas.', icon: 'plug' },
  { title: 'Panel de monitoreo de costos', body: 'Tendencias de consumo de tokens en tiempo real, clasificadas por herramienta/modelo, con alertas de presupuesto.', icon: 'bar-chart-3' },
  { title: 'Gestión unificada de API Key', body: 'Almacenamiento y uso unificados entre herramientas, con cifrado seguro.', icon: 'key' },
  { title: 'Proxy y red', body: 'Detección automática del proxy del sistema, configuración de Clash / V2Ray con un clic y endpoint de API personalizable.', icon: 'shuffle' },
  { title: 'Instantáneas de configuración', body: 'Guarda / restaura / compara diferencias: experimenta sin coste alguno.', icon: 'history' },
  { title: 'Biblioteca de plantillas de prompts', body: 'Plantillas integradas de alta calidad + gestión personalizada + importación y exportación.', icon: 'package' },
  { title: 'Gestión de procesos', body: 'Monitoreo de procesos de CLI: lista / terminar / iniciar / ver salida.', icon: 'monitor' },
  { title: 'Actualización automática', body: 'Autoactualización mediante GitHub Releases + verificación de versiones de las herramientas.', icon: 'package-plus' },
]" title="" />

---

## Cómo funciona

Switch expone localmente un endpoint compatible con la API de OpenAI (por defecto `http://localhost:11434/v1`); tu aplicación solo necesita cambiar el `base_url` por esta dirección local, y a partir de ahí Switch se encarga por completo del enrutamiento.

<ArchitectureDiagram
  title="Proxy local + enrutamiento multiproveedor"
  chart="graph TD
    App[Tu aplicación<br/>OpenAI SDK] --> SW[Lurus Switch<br/>localhost:11434]
    SW --> L[Lurus API]
    SW --> O[Conexión directa a OpenAI]
    SW --> OL[Ollama<br/>Modelos locales]"
/>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="plug-zap" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Integración sin intrusión</p>
    <div class="lurus-callout__body">Cambia solo el <code>base_url</code> en un único lugar y todas las llamadas existentes del SDK de OpenAI quedan conectadas; las reglas de enrutamiento se mantienen centralizadas en Switch y el código de la aplicación no necesita enterarse.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> Casos de uso</span>
  <h2 class="lurus-section-head__title">Quién usa Switch</h2>
</div>

<UserScenarios title="" :scenarios="[
  { role: 'Usuario multi-CLI', title: 'Gestión multi-CLI', summary: 'Usa a la vez varios de los CLI Claude Code / Codex / Gemini CLI / PicoClaw / NullClaw y necesita una gestión unificada de la configuración.', link: '/es/switch/configuration' },
  { role: 'Responsable de costos', title: 'Control de costos', summary: 'Uso paralelo de varios CLI que requiere una vista unificada de gastos y control de presupuesto.', link: '/es/switch/cost-monitoring' },
  { role: 'Equipo técnico', title: 'Estandarización del equipo', summary: 'Distribución unificada de la configuración para garantizar que los miembros del equipo usen ajustes coherentes de los CLI de IA.', link: '/es/switch/team-config' },
  { role: 'Desarrollador en China', title: 'Red local', summary: 'Necesita configuración de VPN, interfaz en chino y cambio con un clic entre modelos nacionales / del extranjero.', link: '/es/switch/configuration' },
]" />

---

## Comparación con otras soluciones

<ComparisonTable
  self-label="Switch"
  :competitors="['Aider', 'Cursor', 'Gestión manual']"
  :rows="[
    { dimension: 'Cobertura de CLI', self: '5 unificados', alt: { Aider: '1', Cursor: 'IDE integrado', '手动管理': 'N/A' } },
    { dimension: 'Gestión de MCP', self: 'Visual + sincronización', alt: { Aider: 'No', Cursor: 'Configuración aparte', '手动管理': 'JSON a mano' } },
    { dimension: 'Monitoreo de costos', self: 'Panel agregado', alt: { Aider: 'No', Cursor: 'No', '手动管理': 'No' } },
    { dimension: 'Sincronización en equipo', self: 'Git + Vault', alt: { Aider: 'No', Cursor: 'No', '手动管理': 'No' } },
  ]"
  title=""
/>

---

## Plataformas compatibles

| Plataforma | Requisitos de versión |
|------|---------|
| Windows | Windows 10 64-bit o superior |
| macOS | macOS 12 (Monterey) o superior |
| Linux | Ubuntu 20.04 / Debian 11 o superior |

---

## Siguiente paso

<NextSteps :steps="[
  { text: 'Guía de instalación', link: '/es/switch/install', primary: true },
  { text: 'Detalles de configuración', link: '/es/switch/configuration' },
  { text: 'Manual de uso', link: '/es/switch/usage' },
]" title="" />

<RelatedProducts product-id="switch" />

</div>

<style>
.switch-page .lurus-section-head { margin-top: 8px; }
.switch-page .cap-grid__heading { display: none; }
</style>
