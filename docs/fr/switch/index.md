---
title: Switch — Centre de gestion unifié pour les CLI de programmation IA
description: Application de bureau, une seule interface pour gérer la configuration, les serveurs MCP et les coûts de 5 CLI de programmation IA majeurs.
---

<div class="switch-page">

<ProductHero product-id="switch" />

<MetricStats :items="[
  { label: 'CLI gérés', value: '5', hint: 'Claude Code / Codex / Gemini / PicoClaw / NullClaw' },
  { label: 'Taille du paquet', value: '<15MB', hint: 'Un seul exe, zéro dépendance' },
  { label: 'Démarrage', value: '<2s', hint: 'Wails + Go 1.25 + React 18' },
]" />

## Qu’est-ce que Lurus Switch ?

**Lurus Switch** est une application de bureau (un seul exe, zéro dépendance, &lt; 15MB) qui vous permet de gérer depuis une seule interface la configuration, les serveurs MCP et les coûts de **5 CLI de programmation IA majeurs : Claude Code / Codex / Gemini CLI / PicoClaw / NullClaw**. Construite sur **Wails** (Go 1.25 + React 18), elle démarre en &lt; 2 secondes et prend en charge toutes les plateformes Windows / macOS / Linux.

Les développeurs utilisent aujourd’hui plusieurs CLI IA en parallèle, comme Claude Code, Codex et Gemini CLI, avec des configurations éparpillées et des coûts gérés séparément. Switch centralise tout cela.

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Une seule interface, fini de chercher la configuration partout</p>
    <div class="lurus-callout__body">Édition visuelle de la configuration, synchronisation MCP entre outils, coûts agrégés par outil/modèle — plus besoin d’ouvrir le dotfile de chaque CLI séparément.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="sparkles" :size="14" /> Capacités principales</span>
  <h2 class="lurus-section-head__title">Gérez tous vos CLI IA en un seul endroit</h2>
  <p class="lurus-section-head__lede">Configuration, MCP, coûts, clés, proxy — les opérations courantes se font toutes dans la même fenêtre.</p>
</div>

<CapabilityGrid accent="var(--lurus-color-switch)" :items="[
  { title: 'Gestion de la configuration multi-CLI', body: 'Éditez visuellement la configuration de Claude Code / Codex / Gemini CLI / PicoClaw / NullClaw, avec aperçu en temps réel via Monaco Editor.', icon: 'layers' },
  { title: 'Assistant intelligent CLAUDE.md', body: 'Analyse le projet et génère automatiquement CLAUDE.md, attribue une note de qualité et propose des suggestions d’optimisation.', icon: 'sparkles' },
  { title: 'Serveurs MCP visualisés', body: 'Fini le JSON écrit à la main : configurez visuellement les serveurs MCP et synchronisez-les entre outils.', icon: 'plug' },
  { title: 'Tableau de bord de suivi des coûts', body: 'Tendances de consommation de tokens en temps réel, classées par outil/modèle, avec alertes budgétaires.', icon: 'bar-chart-3' },
  { title: 'Gestion unifiée des clés API', body: 'Stockage et utilisation unifiés entre outils, avec chiffrement sécurisé.', icon: 'key' },
  { title: 'Proxy et réseau', body: 'Détection automatique du proxy système, configuration Clash / V2Ray en un clic, endpoint API personnalisable.', icon: 'shuffle' },
  { title: 'Instantanés de configuration', body: 'Enregistrer / restaurer / comparer les diffs, pour expérimenter sans risque.', icon: 'history' },
  { title: 'Bibliothèque de modèles de prompts', body: 'Modèles de haute qualité intégrés + gestion personnalisée + import/export.', icon: 'package' },
  { title: 'Gestion des processus', body: 'Surveillance des processus CLI : liste / arrêt / démarrage / affichage de la sortie.', icon: 'monitor' },
  { title: 'Mise à jour automatique', body: 'Mise à jour automatique via GitHub Releases + vérification des versions d’outils.', icon: 'package-plus' },
]" title="" />

---

## Comment ça marche

Switch expose localement un endpoint compatible avec l’API OpenAI (par défaut `http://localhost:11434/v1`). Votre application n’a qu’à remplacer son `base_url` par cette adresse locale, et tout le routage est ensuite pris en charge par Switch.

<ArchitectureDiagram
  title="Proxy local + routage multi-fournisseurs"
  chart="graph TD
    App[Votre application<br/>OpenAI SDK] --> SW[Lurus Switch<br/>localhost:11434]
    SW --> L[Lurus API]
    SW --> O[OpenAI en direct]
    SW --> OL[Ollama<br/>modèle local]"
/>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="plug-zap" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Intégration sans intrusion</p>
    <div class="lurus-callout__body">Une seule modification du <code>base_url</code> et tous vos appels OpenAI SDK existants sont connectés ; les règles de routage sont maintenues de manière centralisée dans Switch, sans que le code de l’application ait à le savoir.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> Cas d’usage</span>
  <h2 class="lurus-section-head__title">Qui utilise Switch</h2>
</div>

<UserScenarios title="" :scenarios="[
  { role: 'Utilisateur multi-CLI', title: 'Gestion multi-CLI', summary: 'Utilise plusieurs CLI parmi Claude Code / Codex / Gemini CLI / PicoClaw / NullClaw en même temps et a besoin d’une gestion unifiée de la configuration.', link: '/fr/switch/configuration' },
  { role: 'Responsable des coûts', title: 'Contrôle des coûts', summary: 'Utilise plusieurs CLI en parallèle et a besoin d’une vue unifiée des dépenses et d’un contrôle budgétaire.', link: '/fr/switch/cost-monitoring' },
  { role: 'Équipe technique', title: 'Standardisation d’équipe', summary: 'Distribution unifiée de la configuration pour garantir que les membres de l’équipe utilisent des réglages de CLI IA cohérents.', link: '/fr/switch/team-config' },
  { role: 'Développeur en Chine', title: 'Réseau domestique', summary: 'A besoin d’une configuration de contournement, d’une interface en chinois et d’un basculement en un clic entre modèles nationaux et internationaux.', link: '/fr/switch/configuration' },
]" />

---

## Comparaison avec d’autres solutions

<ComparisonTable
  self-label="Switch"
  :competitors="['Aider', 'Cursor', 'Gestion manuelle']"
  :rows="[
    { dimension: 'Couverture CLI', self: '5 unifiés', alt: { Aider: '1', Cursor: 'IDE intégré', 'Gestion manuelle': 'N/A' } },
    { dimension: 'Gestion MCP', self: 'Visuelle + synchronisée', alt: { Aider: 'Aucune', Cursor: 'Configuration séparée', 'Gestion manuelle': 'JSON manuel' } },
    { dimension: 'Suivi des coûts', self: 'Tableau de bord agrégé', alt: { Aider: 'Aucun', Cursor: 'Aucun', 'Gestion manuelle': 'Aucun' } },
    { dimension: 'Synchronisation d’équipe', self: 'Git + Vault', alt: { Aider: 'Aucune', Cursor: 'Aucune', 'Gestion manuelle': 'Aucune' } },
  ]"
  title=""
/>

---

## Plateformes prises en charge

| Plateforme | Version requise |
|------|---------|
| Windows | Windows 10 64 bits ou supérieur |
| macOS | macOS 12 (Monterey) ou supérieur |
| Linux | Ubuntu 20.04 / Debian 11 ou supérieur |

---

## Étapes suivantes

<NextSteps :steps="[
  { text: 'Guide d’installation', link: '/fr/switch/install', primary: true },
  { text: 'Guide de configuration', link: '/fr/switch/configuration' },
  { text: 'Manuel d’utilisation', link: '/fr/switch/usage' },
]" title="" />

<RelatedProducts product-id="switch" />

</div>

<style>
.switch-page .lurus-section-head { margin-top: 8px; }
.switch-page .cap-grid__heading { display: none; }
</style>
