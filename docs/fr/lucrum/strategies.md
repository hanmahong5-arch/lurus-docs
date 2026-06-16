---
title: Place de marché des stratégies Lucrum
description: L’écosystème ouvert de stratégies de Lucrum, reliant les développeurs de stratégies et les traders.
---

<div class="lucrum-page">

# Place de marché des stratégies

La place de marché des stratégies Lucrum est un écosystème quantitatif ouvert qui relie les développeurs de stratégies et les traders.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">70%</span><span class="lurus-stat__label">Partage pour l’auteur</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">6</span><span class="lurus-stat__label">Packs de stratégies intégrés</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">2 ans+</span><span class="lurus-stat__label">Données de backtest requises</span></div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> Pour les utilisateurs de stratégies</span>
  <h2 class="lurus-section-head__title">Parcourir, évaluer, déployer en un clic</h2>
</div>

### Parcourir et filtrer

Sur la place de marché des stratégies, vous pouvez filtrer les stratégies selon plusieurs dimensions :

| Critère de filtrage | Description |
|---------|------|
| Marché | Actions A (places de Shanghai et Shenzhen) ; actions de Hong Kong, actions américaines et crypto en projet |
| Type de stratégie | Suivi de tendance, retour à la moyenne, arbitrage, multifactoriel |
| Niveau de risque | Conservateur, équilibré, agressif |
| Capital minimum | Capital minimum requis par la stratégie |
| Tri | Rendement, ratio de Sharpe, drawdown maximal, nombre d’abonnements |

### Indicateurs d’évaluation des stratégies

Chaque stratégie publiée affiche des indicateurs quantitatifs vérifiés :

| Indicateur | Critère d’excellence | Description |
|------|---------|------|
| **Rendement annualisé** | &gt; 15% | Rendement composé annualisé |
| **Drawdown maximal** | &lt; 20% | Perte maximale historique (écart pic-creux) |
| **Ratio de Sharpe** | &gt; 1.5 | Rendement excédentaire par unité de risque |
| **Ratio de Calmar** | &gt; 1.0 | Rendement annualisé / drawdown maximal |
| **Taux de réussite** | &gt; 50% | Proportion de transactions gagnantes |
| **Ratio gain/perte** | &gt; 1.5 | Gain moyen / perte moyenne |
| **Jours d’exécution** | &gt; 90 jours | Durée d’exécution réelle de la stratégie |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Comment choisir une stratégie ?</p>
    <div class="lurus-callout__body">Ne vous fiez pas uniquement au rendement. Une stratégie avec un ratio de Sharpe de 2.0 et un drawdown maximal de 10% convient généralement mieux à la plupart des gens qu’une stratégie à 50% de rendement annualisé mais avec 40% de drawdown.</div>
  </div>
</div>

### S’abonner et déployer

<ol class="lurus-steps">
<li>

Choisissez une stratégie → page de détails (avec un **rapport de backtest complet**).

</li>
<li>

« **S’abonner** » pour confirmer les frais.

</li>
<li>

« **Mes stratégies** » pour choisir un compte de trading et définir l’allocation du capital.

</li>
<li>

« **Démarrer** » pour une exécution automatique.

</li>
</ol>

**Frais** : certaines stratégies sont gratuites, d’autres sont sur abonnement mensuel ; les frais d’abonnement sont prélevés depuis le [portefeuille 鹿贝](/fr/platform/billing#wallet) ; les frais de courtage de transaction sont perçus par le courtier et n’ont aucun lien avec Lucrum.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="code" :size="14" /> Pour les développeurs de stratégies</span>
  <h2 class="lurus-section-head__title">Développer, faire valider, générer des revenus passifs</h2>
</div>

### Processus de publication

<ol class="lurus-steps">
<li>

**Développement local** de la logique de la stratégie.

</li>
<li>

**Validation par backtest** (au moins 2 ans de données historiques).

</li>
<li>

**Soumission pour validation** (description / niveau de risque / marché applicable).

</li>
<li>

**Validation par la plateforme** de la conformité et du contrôle des risques (généralement 1 à 3 jours ouvrés).

</li>
<li>

**Publication** visible par tous les utilisateurs.

</li>
<li>

**Perception des revenus**, réglés en 鹿贝 vers le portefeuille.

</li>
</ol>

### Critères de validation

| Élément | Exigence |
|------|------|
| Volume de données de backtest | Couvrir au moins 2 ans de données historiques |
| Drawdown maximal | Ne pas dépasser 50% (au-delà, signalement spécifique du risque requis) |
| Mesures de contrôle des risques | Doit inclure une logique de stop-loss |
| Qualité du code | Aucune fuite de mémoire, aucun risque de boucle infinie |
| Description de la stratégie | Explication complète de la logique de la stratégie, du marché applicable et des avertissements de risque |

### Partage des revenus

Les revenus d’abonnement générés par une stratégie sont répartis selon les proportions suivantes :

| Rôle | Proportion du partage |
|------|---------|
| Auteur de la stratégie | **70%** |
| Plateforme | **30%** |

Les revenus sont réglés sous forme de 鹿贝 vers votre portefeuille et peuvent être retirés vers une carte bancaire.

### Packs de stratégies intégrés

Lucrum intègre 6 grands packs de stratégies + la prise en charge d’extensions personnalisées :

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="shield" :size="20" /></span>
    <div class="lurus-card__title"><code>VALUE_BLUECHIP</code></div>
    <p class="lurus-card__body">Valeur blue chip (faible valorisation, grandes capitalisations solides).</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="trending-up" :size="20" /></span>
    <div class="lurus-card__title"><code>GROWTH_MOMENTUM</code></div>
    <p class="lurus-card__body">Momentum de croissance (forte croissance + filtrage par momentum).</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="star" :size="20" /></span>
    <div class="lurus-card__title"><code>SECTOR_LEADER</code></div>
    <p class="lurus-card__body">Leaders sectoriels (titres en tête de leur secteur).</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title"><code>LOW_VOL_STABLE</code></div>
    <p class="lurus-card__body">Faible volatilité et solidité (type défensif à faible volatilité).</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="shuffle" :size="20" /></span>
    <div class="lurus-card__title"><code>MEAN_REVERSION</code></div>
    <p class="lurus-card__body">Retour à la moyenne (rebond après survente).</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title"><code>EVENT_DRIVEN</code></div>
    <p class="lurus-card__body">Piloté par les événements (catalyseurs tels qu’annonces, résultats financiers, etc.).</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="filter" :size="14" /> Types de stratégies</span>
  <h2 class="lurus-section-head__title">Principe et cas d’usage de quatre stratégies courantes</h2>
</div>

| Type | Principe | Signaux/facteurs typiques | Convient à |
|------|------|------|------|
| **Suivi de tendance** | Aller dans le sens du marché, entrer à la formation de la tendance et sortir à sa fin | Croisement de moyennes mobiles, cassure de canal, indicateurs de momentum | Marchés directionnels (haussier/baissier), inadapté aux marchés de range |
| **Retour à la moyenne** | Le prix revient vers sa moyenne après s’en être écarté, acheter en survente et vendre en surachat | RSI, bandes de Bollinger, Z-Score | Marchés de range, inadapté aux tendances directionnelles |
| **Sélection multifactorielle** | Noter les actions à partir de plusieurs facteurs, acheter celles ayant un score élevé | PE/PB (valorisation), ROE (rentabilité), momentum sur 12 mois, volatilité | Détention à moyen-long terme, faible fréquence de rotation |
| **Trading de paires** | Lorsque l’écart de prix entre deux actions très corrélées s’écarte de la moyenne, vendre à découvert celle qui a le plus monté et acheter celle qui a le plus baissé | — | Stratégie solide et neutre au marché, à faible drawdown |

---

<div class="lurus-callout lurus-callout--danger">
  <span class="lurus-callout__icon"><Icon name="shield" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">L’investissement comporte des risques</p>
    <div class="lurus-callout__body"><ul><li>Les performances historiques de backtest ne préjugent pas des rendements futurs</li><li>Une stratégie quantitative peut devenir inefficace dans certains environnements de marché</li><li>Allouez votre capital de manière raisonnable en fonction de votre propre tolérance au risque</li><li>Lucrum ne fournit aucun conseil en investissement ni aucune garantie de rendement</li></ul></div>
  </div>
</div>

---

<NextSteps
  :steps="[
    { text: 'Démarrage rapide', link: '/fr/lucrum/quickstart', primary: true },
    { text: 'Questions fréquentes', link: '/fr/lucrum/faq' },
    { text: 'Aperçu du produit', link: '/fr/lucrum/' },
    { text: 'Plateforme de trading', link: 'https://lucrum.lurus.cn', external: true },
  ]"
  title="Étapes suivantes"
/>

</div>
