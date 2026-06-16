---
title: Switch — Gestion des serveurs MCP
description: Configurez / déboguez visuellement les serveurs MCP, synchronisés entre vos différents CLI d’IA.
---

<div class="switch-page">

# Gestion des serveurs MCP <StatusBadge status="dev" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="plug" :size="14" /> Gestion unifiée</span>
  <h2 class="lurus-section-head__title">Une configuration centrale, synchronisée entre les CLI</h2>
  <p class="lurus-section-head__lede">Switch regroupe sous une gestion unifiée les configurations dispersées dans les <code>mcp_servers.json</code> respectifs de Claude Code / Codex / Gemini, et offre un débogage visuel.</p>
</div>

## Gestionnaire MCP

Ouvrez Switch → « Serveurs MCP » dans le panneau de gauche, où vous pouvez voir :

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">État d’enregistrement</div>
    <p class="lurus-card__body">Tous les MCP Server actuellement enregistrés, avec leur état <span class="lurus-tag">running</span> <span class="lurus-tag">stopped</span> <span class="lurus-tag">errored</span></p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="share-2" :size="20" /></span>
    <div class="lurus-card__title">Relations de référence</div>
    <p class="lurus-card__body">Quels CLI référencent chaque Server</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="history" :size="20" /></span>
    <div class="lurus-card__title">Historique des appels</div>
    <p class="lurus-card__body">Les N derniers appels d’outils enregistrés</p>
  </div>
</div>

## Format de configuration

Switch utilise un fichier central `~/.lurus-switch/mcp.yaml` :

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
    <p class="lurus-callout__title">visible_to pilote la distribution à la demande</p>
    <div class="lurus-callout__body">Lors du passage à un CLI quelconque, Switch génère dynamiquement le <code>mcp_servers.json</code> de ce CLI selon <code>visible_to</code> ; chaque outil ne voit que les Server qui lui sont attribués.</div>
  </div>
</div>

## Débogage

Sélectionnez un Server pour afficher le panneau de débogage à droite :

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="puzzle" :size="20" /></span>
    <div class="lurus-card__title">Liste des Tools</div>
    <p class="lurus-card__body">Tous les outils exposés par le Server, y compris le schéma des paramètres d’entrée</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Appel manuel</div>
    <p class="lurus-card__body">Renseignez les paramètres pour tester directement</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="search" :size="20" /></span>
    <div class="lurus-card__title">Request Log</div>
    <p class="lurus-card__body">Le JSON complet des dernières request/response</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="rewind" :size="20" /></span>
    <div class="lurus-card__title">Redémarrage</div>
    <p class="lurus-card__body">Redémarrage au niveau du processus</p>
  </div>
</div>

## Intégration rapide des Server courants

Switch intègre des boutons d’installation en un clic, sans avoir à écrire la configuration à la main :

| Server | Usage |
|--------|------|
| `github` | Lire/écrire issues / PR / file |
| `postgres` | Interroger la base de données |
| `filesystem` | Lire/écrire des fichiers locaux |
| `slack` | Envoyer des messages / lire des canaux |
| `kova` | Agent Kova comme outil |
| `lumen` | Lumen Trace / Replay |

## Synchroniser avec l’équipe

Voir [Synchronisation d’équipe](/fr/switch/team-config).

## Étape suivante

<NextSteps :steps="[
  { text: 'Surveillance des coûts', link: '/fr/switch/cost-monitoring', primary: true },
  { text: 'Synchronisation d\'équipe', link: '/fr/switch/team-config' },
  { text: 'Retour au manuel d\'utilisation', link: '/fr/switch/usage' },
]" />

</div>

<style scoped>
.switch-page .lurus-section-head { margin-top: 2.6rem; }
</style>
