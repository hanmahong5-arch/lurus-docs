---
title: Switch — Synchronisation de la configuration d’équipe
description: Gérer les configurations CLI / MCP partagées via Git, avec un pont Vault pour les identifiants sensibles.
---

<div class="switch-page">

# Synchronisation de la configuration d’équipe <StatusBadge status="dev" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> Synchronisation d’équipe</span>
  <h2 class="lurus-section-head__title">Configuration partagée, identifiants privés</h2>
  <p class="lurus-section-head__lede">Permettez à toute l’équipe de partager la même configuration des CLI d’IA et de MCP, tout en gardant les identifiants sensibles indépendants pour chacun, jamais versionnés dans Git.</p>
</div>

## Vue d’ensemble du modèle

<ArchitectureDiagram
  chart="graph LR; G[Team Git: config non sensible] --> S[Switch: UI locale]; V[Vault / OS Keyring: identifiants sensibles] --> S; S --> G; S --> V"
  title="Modèle de distribution de la configuration" />

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="git-merge" :size="22" /></span>
    <div class="lurus-card__title">Dépôt Git</div>
    <p class="lurus-card__body">Versionnez le squelette de configuration : liste des serveurs, définitions des tools, prompts prédéfinis.</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="lock" :size="22" /></span>
    <div class="lurus-card__title">Vault / OS Keyring</div>
    <p class="lurus-card__body">Stocke les éléments sensibles comme les clés API et les tokens GitHub, <strong>jamais versionnés dans Git</strong>.</p>
  </div>
</div>

## Synchronisation Git

<ol class="lurus-steps">

<li>

Liez pour la première fois le dépôt de configuration de l’équipe :

```bash
lurus-switch team init git@github.com:your-org/ai-config.git
```

</li>

<li>

Tirer (pull) et pousser (push) au quotidien :

```bash
lurus-switch team pull
lurus-switch team push
```

`team pull` récupère les éléments partagés par l’équipe :

- `mcp.yaml` (liste des serveurs MCP)
- `cli-configs/*.yaml` (la partie partageable des 5 CLI)
- `prompts/` (modèles de prompts)

</li>

</ol>

## Pont Vault

```yaml
# ~/.lurus-switch/vault.yaml
provider: hashicorp-vault
address: https://vault.internal.example.com
auth:
  method: token
  token_env: VAULT_TOKEN
```

Référence dans `mcp.yaml` :

```yaml
servers:
  github:
    env:
      GITHUB_TOKEN: vault://secret/ai/github#token
```

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shield" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Le texte en clair n’est jamais écrit sur disque</p>
    <div class="lurus-callout__body">Au démarrage d’un serveur MCP, Switch récupère dynamiquement les valeurs depuis Vault ; les identifiants en clair ne sont jamais écrits sur disque.</div>
  </div>
</div>

Providers pris en charge :

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="lock" :size="20" /></span>
    <div class="lurus-card__title">HashiCorp Vault</div>
    <p class="lurus-card__body">Service centralisé de gestion des secrets</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">macOS Keychain</div>
    <p class="lurus-card__body">Stockage d’identifiants au niveau système</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">Windows Credential Manager</div>
    <p class="lurus-card__body">Stockage d’identifiants au niveau système</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">Linux Secret Service</div>
    <p class="lurus-card__body">Backend libsecret</p>
  </div>
</div>

## Audit des diff

```bash
lurus-switch team diff
```

Affiche les différences de configuration entre le local et le distant de l’équipe (sans les éléments sensibles).

## Rollback

```bash
lurus-switch team rollback <commit-sha>
```

Ramène la configuration locale à n’importe quelle version de l’historique Git.

## Étapes suivantes

<NextSteps :steps="[
  { text: 'Retour au manuel d\'utilisation', link: '/fr/switch/usage', primary: true },
  { text: 'Serveurs MCP', link: '/fr/switch/mcp-servers' },
  { text: 'Suivi des coûts', link: '/fr/switch/cost-monitoring' },
]" />

</div>

<style scoped>
.switch-page .lurus-section-head { margin-top: 2.6rem; }
</style>
