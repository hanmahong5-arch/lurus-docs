---
title: Configuración de Switch
description: Configuración de herramientas de IA, gestión de servidores MCP y ajustes de monitoreo de costos de Switch.
---

<div class="switch-page">

# Configuración de Switch

## Abrir la interfaz de configuración

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Icono de la barra de menú</div>
    <p class="lurus-card__body">macOS / Linux: haz clic en el icono de la barra de menú → «Configuración».</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Bandeja del sistema</div>
    <p class="lurus-card__body">Windows: clic derecho en el icono de la bandeja → «Abrir configuración».</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">Atajo de teclado</div>
    <p class="lurus-card__body"><span class="lurus-kbd">Ctrl+Shift+S</span> (Win/Linux) / <span class="lurus-kbd">Cmd+Shift+S</span> (macOS).</p>
  </div>
</div>

---

## Agregar un proveedor de modelos

Pestaña «**<Term t="Provider">Proveedor</Term>**» → «**Agregar proveedor**», completa el nombre del proveedor + API Base URL + API Key:

| Proveedor | API Base URL | API Key |
|------|------|------|
| **Lurus API** <span class="lurus-tag">Recomendado</span> | `https://api.lurus.cn/v1` | Lurus Key (comienza con `sk-`); en modelos haz clic en «Detección automática» |
| **OpenAI** | `https://api.openai.com/v1` | `sk-...` (oficial) |
| **Anthropic** | `https://api.anthropic.com/v1` | `sk-ant-...` |
| **Ollama** (local) | `http://localhost:11434/v1` | (dejar vacío) |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shuffle" :size="14" /> Enrutamiento</span>
  <h2 class="lurus-section-head__title">Configurar reglas de enrutamiento</h2>
  <p class="lurus-section-head__lede">Define qué solicitud va a qué proveedor; las solicitudes sin coincidencia van al proveedor predeterminado (predeterminado → Lurus API).</p>
</div>

**Enrutamiento por nombre de modelo**: `gpt-*` → OpenAI; `claude-*` → Anthropic; `deepseek-*` / `*` (otros) → Lurus API; `llama*` → Ollama. JSON:

```json
{ "rules": [
    { "pattern": "gpt-*", "provider": "OpenAI" },
    { "pattern": "claude-*", "provider": "Anthropic" },
    { "pattern": "llama*", "provider": "Ollama" },
    { "pattern": "*", "provider": "Lurus API" }
  ] }
```

**Enrutamiento por aplicación (avanzado)**: configura enrutamientos distintos para diferentes aplicaciones locales:

```json
{
  "app_rules": [
    {
      "app": "cursor",
      "default_provider": "Lurus API",
      "model_override": "deepseek-reasoner"
    },
    {
      "app": "continue",
      "default_provider": "Ollama"
    }
  ]
}
```

---

## Configuración del puerto del proxy

«**General**» → «**Puerto de escucha**», predeterminado `11434`. Cuando haya un conflicto de puerto (por ejemplo, con Ollama), cámbialo a otro puerto (como `11435`) y modifica en consecuencia, del lado de la aplicación, `base_url=http://localhost:11435/v1` (`api_key` puede ser cualquier valor; Switch usa la provider key configurada).

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Conflicto de puerto</p>
    <div class="lurus-callout__body">El puerto predeterminado <code>11434</code> es el mismo que el puerto predeterminado de Ollama. Cuando ambos se ejecutan en la misma máquina, cambia Switch a otro puerto (como <code>11435</code>) y actualiza de forma sincronizada el <code>base_url</code> del lado de la aplicación.</div>
  </div>
</div>

---

## Archivo de configuración completo

La configuración de Switch se guarda en:

| Plataforma | Ruta |
|------|------|
| Windows | `%APPDATA%\LurusSwitch\config.json` |
| macOS | `~/Library/Application Support/LurusSwitch/config.json` |
| Linux | `~/.config/LurusSwitch/config.json` |

Ejemplo completo de `config.json`:

```json
{
  "listen_port": 11434,
  "log_requests": true,
  "start_on_login": true,
  "providers": [
    {
      "name": "Lurus API",
      "base_url": "https://api.lurus.cn/v1",
      "api_key": "sk-your-lurus-key",
      "enabled": true
    },
    {
      "name": "Ollama",
      "base_url": "http://localhost:11434/v1",
      "api_key": "",
      "enabled": true
    }
  ],
  "routing": {
    "default_provider": "Lurus API",
    "rules": [
      { "pattern": "llama*",  "provider": "Ollama" },
      { "pattern": "qwen*",   "provider": "Ollama" },
      { "pattern": "*",       "provider": "Lurus API" }
    ]
  }
}
```

---

## Verificar la configuración

La pestaña «**Estado**» muestra: el estado de conexión de cada proveedor (verde = correcto, rojo = fallido), las reglas de enrutamiento activas actualmente y el registro de solicitudes recientes. Verificación por línea de comandos (si devuelve un JSON normal, es exitoso):

```bash
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"ping"}]}'
```

---

## Siguientes pasos

<NextSteps :steps="[
  { text: 'Monitoreo de costos', link: '/es/switch/cost-monitoring', primary: true },
  { text: 'Servidores MCP', link: '/es/switch/mcp-servers' },
  { text: 'Configuración de equipo', link: '/es/switch/team-config' },
]" title="" />

</div>

<style>
.switch-page .lurus-section-head { margin-top: 8px; }
</style>
