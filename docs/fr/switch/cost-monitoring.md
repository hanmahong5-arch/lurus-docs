---
title: Switch — Suivi des coûts
description: Agréger les coûts de 5 CLI, alertes de seuil, analyse d’attribution, synergie avec Lumen.
---

<div class="switch-page">

# Suivi des coûts <StatusBadge status="dev" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bar-chart-3" :size="14" /> Tableau de bord des coûts</span>
  <h2 class="lurus-section-head__title">Regrouper la consommation de tokens de 5 CLI au même endroit</h2>
  <p class="lurus-section-head__lede">Switch agrège de façon unifiée la consommation de tokens des outils tels que Claude Code / Codex / Gemini / PicoClaw / NullClaw, et alerte avant de dépasser le budget.</p>
</div>

## Agrégation des coûts

Une fois le processus en arrière-plan de Switch démarré, toutes les requêtes des processus CLI lancés par Switch passent par le proxy local (par défaut `127.0.0.1:41234`) et sont enregistrées dans une base SQLite locale :

```
~/.lurus-switch/costs.db
```

Dimensions d’agrégation :

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="terminal" :size="20" /></span>
    <div class="lurus-card__title">Outil</div>
    <p class="lurus-card__body">claude-code / codex / gemini / picoclaw / nullclaw</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">Modèle</div>
    <p class="lurus-card__body">claude-sonnet-4 / gpt-5 / gemini-3-pro, etc.</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="package" :size="20" /></span>
    <div class="lurus-card__title">Projet</div>
    <p class="lurus-card__body">selon la racine du dépôt git où se trouve le CWD</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="timer" :size="20" /></span>
    <div class="lurus-card__title">Période</div>
    <p class="lurus-card__body">jour / semaine / mois</p>
  </div>
</div>

## Alertes de seuil

Configurez dans la page des paramètres de Switch :

| Type d’alerte | Exemple |
|---------|------|
| Budget journalier | Notification système au-delà de ¥50/jour |
| Appel unitaire | Mise en rouge au-delà de ¥2/appel |
| Part de modèle | Rappel de changer de palier lorsque Claude Opus > 60 % |

Canaux d’alerte : <span class="lurus-tag">Notification système</span> <span class="lurus-tag">E-mail</span> <span class="lurus-tag">Webhook</span>

## Analyse d’attribution

> « Pourquoi ai-je soudainement dépensé autant aujourd’hui ? »

Switch propose une attribution **de type flame graph**, qui descend couche par couche jusqu’au coupable précis :

```
总消费 ¥38.2 (↑ 250% vs 昨日)
├─ claude-code   ¥28.4 (74%)  ← 主因
│   └─ 项目: 2l-bs-docs       ¥21.3  ← 具体元凶
│       └─ 模型: claude-opus  ¥19.8
├─ codex         ¥6.5
└─ gemini        ¥3.3
```

## Synergie avec Lumen

Pour les projets d’agents utilisant le SDK Lumen, Switch peut fusionner les données de Trace à granularité fine de Lumen :

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
    <p class="lurus-callout__title">Activer l’intégration Lumen</p>
    <div class="lurus-callout__body">Dans les paramètres de Switch, activez « Intégration Lumen » et pointez vers <code>http://localhost:7070</code> pour fusionner les coûts à granularité grossière de Switch avec les Traces de niveau Graph / Node / LLM Call de Lumen en une topologie de coûts complète.</div>
  </div>
</div>

## Export

Depuis l’interface :

```
右键 → 导出为 CSV / JSON
```

Ou en ligne de commande :

```bash
lurus-switch export --format csv --since 30d > costs.csv
```

## Étapes suivantes

<NextSteps :steps="[
  { text: 'Gestion des serveurs MCP', link: '/fr/switch/mcp-servers', primary: true },
  { text: 'Synchronisation d\'équipe', link: '/fr/switch/team-config' },
  { text: 'Suivi des coûts Lumen', link: '/fr/lumen/python-sdk' },
]" />

</div>

<style scoped>
.switch-page .lurus-section-head { margin-top: 2.6rem; }
</style>
