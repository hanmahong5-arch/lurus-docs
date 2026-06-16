---
title: Lucrum — Plateforme de trading quantitatif IA
description: Plateforme de trading quantitatif pilotée par l’IA, avec marché de stratégies, validation par backtest et assistant de trading intelligent.
---

<div class="lucrum-page">

<ProductHero product-id="lucrum" />

<MetricStats :items="[
  { label: 'Conseillers en investissement', value: '11', hint: 'Agents multi-perspectives' },
  { label: 'Indicateurs de backtest', value: '30+', hint: 'Sharpe / drawdown / taux de réussite…' },
  { label: 'Cas de test', value: '3157+', hint: 'Validés par Vitest' },
  { label: 'Précision', value: 'Decimal.js', hint: 'Zéro erreur de virgule flottante' },
]" />

## Qu’est-ce que Lucrum ?

**Lucrum** est la plateforme de décision de trading quantitatif AI-Native lancée par Lurus. Idée centrale : **le langage naturel est le meilleur langage de programmation** — décrivez votre idée de stratégie en français, et l’IA génère automatiquement le code, exécute le backtest et procède à une évaluation multidimensionnelle. Elle intègre 11 agents conseillers en investissement professionnels (perspectives Buffett / Peter Lynch / Livermore / Simons, etc.) et effectue tous les calculs avec une précision financière Decimal.js sur l’ensemble de la plateforme (validée par 3 157 cas de test Vitest), sans aucune erreur de virgule flottante.

> Le nom provient du latin « Lucrum » (gain), évoquant une perception précise des opportunités de marché.

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="sparkles" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Étape actuelle : bêta publique (beta)</p>
    <div class="lurus-callout__body"><a href="https://lucrum.lurus.cn">lucrum.lurus.cn</a> est déjà en ligne, et les fonctionnalités principales (génération de stratégies / backtest / conseiller IA) sont directement accessibles ; voir la tarification sur <a href="https://lucrum.lurus.cn/pricing">/pricing</a>. La version GA officielle n’est pas encore atteinte ; certaines capacités avancées (marché de stratégies, connexion à des courtiers réels) sont encore en cours de finalisation.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> Capacités principales</span>
  <h2 class="lurus-section-head__title">D’une phrase en français à un backtest noté</h2>
  <p class="lurus-section-head__lede">Génération de stratégies, recherche multi-agents, marché de stratégies, facturation par quota, exécution en temps réel — toute la chaîne reliée.</p>
</div>

### Génération de stratégies IA et backtest

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="sparkles" :size="20" /></span>
    <div class="lurus-card__title">Langage naturel → code</div>
    <p class="lurus-card__body">Décrivez l’intention de la stratégie en français, et l’IA génère automatiquement le code de stratégie vnpy CtaTemplate.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="calculator" :size="20" /></span>
    <div class="lurus-card__title">Backtest de niveau financier</div>
    <p class="lurus-card__body">Précision intégrale Decimal.js, contrainte de multiples entiers de 100 actions pour les actions A, règle T+1, commissions + droit de timbre + frais de transfert + slippage.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="bar-chart-3" :size="20" /></span>
    <div class="lurus-card__title">Analyse avec plus de 30 indicateurs</div>
    <p class="lurus-card__body">Ratio de Sharpe, drawdown maximal, Sortino, Calmar, taux de réussite, ratio gains/pertes…</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="star" :size="20" /></span>
    <div class="lurus-card__title">Notation à cinq niveaux S/A/B/C/D</div>
    <p class="lurus-card__body">Pondération sur 4 dimensions : rendement 30 % + gestion des risques 30 % + stabilité 25 % + efficacité 15 %.</p>
  </div>
</div>

### 11 conseillers en investissement IA

Système d’analyse d’investissement multi-agents orchestré par LangGraph (4 analystes + 2 chercheurs + 4 maîtres + 1 animateur de débat = 11) :

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="users" :size="20" /></span>
    <div class="lurus-card__title">Perspectives de 4 maîtres de l’investissement</div>
    <p class="lurus-card__body">Buffett (valeur), Peter Lynch (croissance), Livermore (technique), Simons (quantitatif).</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="search" :size="20" /></span>
    <div class="lurus-card__title">4 analystes</div>
    <p class="lurus-card__body">Fondamental / technique / sentiment / macro, chacun produisant ses conclusions.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
    <div class="lurus-card__title">2 chercheurs + 1 animateur de débat</div>
    <p class="lurus-card__body">Débat haussier vs baissier (Bull vs Bear), pour éviter le biais d’une perspective unique.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">Intégration du moteur de mémoire</div>
    <p class="lurus-card__body">Mémorise vos préférences de trading et vos décisions passées grâce à <a href="/fr/memx/">MemX</a>.</p>
  </div>
</div>

### Marché de stratégies

Un écosystème ouvert de stratégies quantitatives, reliant développeurs de stratégies et traders :

| Rôle | Fonctionnalité |
|------|------|
| **Auteur de stratégie** | Mettre en ligne des stratégies, fixer un prix, consulter le partage des revenus |
| **Utilisateur de stratégie** | Parcourir, s’abonner à des stratégies, déployer en un clic sur un compte réel |

**Partage des revenus** : plateforme 30 % / auteur de stratégie 70 %.

### Quota et facturation

<ol class="lurus-steps">
<li>

**Plafond du plan** — le nombre mensuel d’appels IA inclus dans l’abonnement.

</li>
<li>

**Comptage mensuel Redis** — suit en temps réel la consommation du mois en cours.

</li>
<li>

**Solde Lubei en filet de sécurité** — une fois le quota épuisé, le débit s’effectue automatiquement depuis le [portefeuille Lubei](/platform/billing#wallet), 1 Lubei = 10 000 tokens.

</li>
</ol>

### Données et exécution en temps réel

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">Couverture du marché</div>
    <p class="lurus-card__body">Actions A (marchés de Shanghai et Shenzhen, ~5000+ titres, sources de données adata + Eastmoney) ; actions de Hong Kong / actions américaines / crypto prévues.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Trading simulé</div>
    <p class="lurus-card__body">Mock Broker intégré, simulant intégralement la règle T+1, les lots de 100 actions, les commissions et le droit de timbre.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="shield" :size="20" /></span>
    <div class="lurus-card__title">Moteur de gestion des risques</div>
    <p class="lurus-card__body">Limites de position, stop-loss et take-profit, protection contre le drawdown maximal.</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> Public visé</span>
  <h2 class="lurus-section-head__title">Faire du quantitatif sans écrire de code</h2>
</div>

| Type d’utilisateur | Comment Lucrum vous aide |
|---------|-----------------|
| **Débutant en quantitatif** | L’assistant IA guide la prise en main ; il suffit de décrire l’idée de stratégie en langage naturel pour générer un squelette de code |
| **Investisseur particulier** | Choisir une stratégie déjà validée sur le marché de stratégies, la déployer en un clic, sans programmation |
| **Développeur de stratégies** | Une chaîne d’outils complète développement-backtest-mise en production ; publier une stratégie pour générer un revenu passif |
| **Équipe de trading professionnelle** | Interface API, intégrable à un système de trading existant |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-merge" :size="14" /> Comparaison</span>
  <h2 class="lurus-section-head__title">En quoi est-ce différent des plateformes quantitatives traditionnelles</h2>
</div>

<ComparisonTable
  self-label="Lucrum"
  :competitors="['vnpy', '掘金', '米筐', '聚宽']"
  :rows="[
    { dimension: 'Écriture de stratégie', self: 'Génération en langage naturel', alt: { vnpy: 'Code Python manuel', '掘金': 'Code Python manuel', '米筐': 'Code Python manuel', '聚宽': 'Code Python manuel' } },
    { dimension: 'Conseiller en investissement IA', self: '11 multi-perspectives', alt: { vnpy: 'Aucun', '掘金': 'Aucun', '米筐': 'Aucun', '聚宽': 'Aucun' } },
    { dimension: 'Précision', self: 'Decimal.js précision intégrale', alt: { vnpy: 'float', '掘金': 'float', '米筐': 'float', '聚宽': 'float' } },
    { dimension: 'Marché de stratégies', self: 'Intégré + notation', alt: { vnpy: 'Aucun', '掘金': 'Oui', '米筐': 'Oui', '聚宽': 'Oui' } },
  ]"
  title="Comparaison avec les plateformes quantitatives traditionnelles"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> Architecture technique</span>
  <h2 class="lurus-section-head__title">Du navigateur au moteur de règlement</h2>
</div>

<ArchitectureDiagram
  title="Architecture en couches de Lucrum"
  chart="graph TD;
    A[Navigateur / mobile] --> B[Lucrum Web<br/>Next.js 14 + TS<br/>Panneau de trading·Éditeur de stratégies·Dialogue IA];
    B --> C[Lucrum Backend<br/>Python 3.11 + FastAPI<br/>vnpy 4.x + LangGraph<br/>Moteur de stratégies·Passerelle de cotations·Gestion des risques·Règlement];
    C --> D[Assistant IA<br/>Lurus API];
    C --> E[Moteur de mémoire<br/>MemX];
    C --> F[(PostgreSQL<br/>Stratégies / transactions)];
    C --> G[(Redis<br/>Cotations / quota)];
    C --> H[NATS<br/>Événements]"
/>

---

<NextSteps
  :steps="[
    { text: 'Démarrage rapide', link: '/fr/lucrum/quickstart', primary: true },
    { text: 'Marché de stratégies', link: '/fr/lucrum/strategies' },
    { text: 'Questions fréquentes', link: '/fr/lucrum/faq' },
    { text: 'Plateforme de trading', link: 'https://lucrum.lurus.cn', external: true },
  ]"
  title="Étapes suivantes"
/>

<!-- lurus:related-block -->

## Produits liés

<RelatedProducts product-id="lucrum" />

</div>

<style>
.lucrum-page .lurus-card--lucrum .lurus-card__body a { color: var(--lurus-color-lucrum, var(--vp-c-brand-1)); }
</style>
