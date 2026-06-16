---
title: Switch — Sincronización de configuración de equipo
description: Gestiona configuraciones compartidas de CLI / MCP mediante Git, con Vault como puente para credenciales sensibles.
---

<div class="switch-page">

# Sincronización de configuración de equipo <StatusBadge status="dev" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> Sincronización de equipo</span>
  <h2 class="lurus-section-head__title">Configuración compartida, credenciales privadas</h2>
  <p class="lurus-section-head__lede">Permite que todo el equipo comparta el mismo conjunto de configuraciones de CLI de IA y MCP, pero con credenciales sensibles independientes para cada persona, que nunca entran en Git.</p>
</div>

## Visión general del modelo

<ArchitectureDiagram
  chart="graph LR; G[Team Git: configuración no sensible] --> S[Switch: UI local]; V[Vault / OS Keyring: credenciales sensibles] --> S; S --> G; S --> V"
  title="Modelo de distribución de configuración" />

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="git-merge" :size="22" /></span>
    <div class="lurus-card__title">Repositorio Git</div>
    <p class="lurus-card__body">Registra el esqueleto de la configuración: lista de servers, definiciones de tools y prompts predefinidos.</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="lock" :size="22" /></span>
    <div class="lurus-card__title">Vault / OS Keyring</div>
    <p class="lurus-card__body">Almacena API Key, GitHub Token y otros elementos sensibles, que <strong>nunca entran en Git</strong>.</p>
  </div>
</div>

## Sincronización con Git

<ol class="lurus-steps">

<li>

Vincula por primera vez el repositorio de configuración del equipo:

```bash
lurus-switch team init git@github.com:your-org/ai-config.git
```

</li>

<li>

Extracción y envío diarios:

```bash
lurus-switch team pull
lurus-switch team push
```

`team pull` extraerá lo que el equipo comparte:

- `mcp.yaml` (lista de MCP Server)
- `cli-configs/*.yaml` (la parte compartible de las 5 CLI)
- `prompts/` (plantillas de Prompt)

</li>

</ol>

## Puente con Vault

```yaml
# ~/.lurus-switch/vault.yaml
provider: hashicorp-vault
address: https://vault.internal.example.com
auth:
  method: token
  token_env: VAULT_TOKEN
```

Referencia en `mcp.yaml`:

```yaml
servers:
  github:
    env:
      GITHUB_TOKEN: vault://secret/ai/github#token
```

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shield" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">El texto plano nunca se escribe en disco</p>
    <div class="lurus-callout__body">Al iniciar el MCP Server, Switch obtiene los valores de Vault de forma dinámica; las credenciales en texto plano nunca se escriben en disco.</div>
  </div>
</div>

Providers compatibles:

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="lock" :size="20" /></span>
    <div class="lurus-card__title">HashiCorp Vault</div>
    <p class="lurus-card__body">Servicio centralizado de gestión de claves</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">macOS Keychain</div>
    <p class="lurus-card__body">Almacenamiento de credenciales a nivel de sistema</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">Windows Credential Manager</div>
    <p class="lurus-card__body">Almacenamiento de credenciales a nivel de sistema</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">Linux Secret Service</div>
    <p class="lurus-card__body">Backend libsecret</p>
  </div>
</div>

## Auditoría de Diff

```bash
lurus-switch team diff
```

Muestra las diferencias de configuración entre el entorno local y el remoto del equipo (sin incluir elementos sensibles).

## Reversión

```bash
lurus-switch team rollback <commit-sha>
```

Devuelve la configuración local a cualquier versión histórica de Git.

## Próximos pasos

<NextSteps :steps="[
  { text: 'Volver al manual de uso', link: '/es/switch/usage', primary: true },
  { text: 'Servidores MCP', link: '/es/switch/mcp-servers' },
  { text: 'Monitoreo de costos', link: '/es/switch/cost-monitoring' },
]" />

</div>

<style scoped>
.switch-page .lurus-section-head { margin-top: 2.6rem; }
</style>
