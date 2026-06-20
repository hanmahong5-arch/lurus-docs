---
title: "Tutoriel — Stratégie Lucrum : du local à la publication"
description: "Le cycle complet : langage naturel → code vnpy → backtest → optimisation → publication sur le marché des stratégies."
---

<div class="lucrum-tut-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="trending-up" :size="14" /> Cycle quantitatif Lucrum</span>
  <h1 class="lurus-section-head__title">Le flux complet d’une stratégie Lucrum</h1>
  <p class="lurus-section-head__lede"><strong>Objectif</strong> : faire passer l’idée « double moyenne mobile + filtre RSI » d’une description en langage naturel jusqu’à sa publication sur le marché des stratégies.</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">5 étapes</span><span class="lurus-stat__label">de la description à la publication</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">S/A/B/C/D</span><span class="lurus-stat__label">notation à cinq niveaux</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">vnpy</span><span class="lurus-stat__label">pile de génération du code</span></div>
</div>

## <Icon name="network" :size="20" /> Architecture

Du langage naturel à la publication, la note sert d’aiguillage : une note ≥ A déclenche la publication directe, en dessous de A le parcours passe par l’optimisation IA puis un nouveau backtest.

<ArchitectureDiagram title="Cycle d’une stratégie Lucrum" chart="graph TB
  NL[Langage naturel] --> GEN[Génération IA de la stratégie]
  GEN --> CODE[Code vnpy]
  CODE --> BT[Backtest sur données historiques]
  BT --> SCORE{Notation}
  SCORE -->|En dessous de A| OPT[Suggestions d’optimisation IA]
  OPT --> BT
  SCORE -->|Niveau A atteint| MKT[Publication sur le marché des stratégies]" />

## <Icon name="workflow" :size="20" /> Processus complet

<ol class="lurus-steps">
<li>

**Description en langage naturel** — accédez à [lucrum.lurus.cn](https://lucrum.lurus.cn) → Nouvelle stratégie → collez la description :

> Stratégie de croisement de deux moyennes mobiles : acheter lorsque la moyenne 5 jours croise à la hausse la moyenne 20 jours, vendre lorsqu’elle croise à la baisse. Ajouter un filtre RSI(14) : pas d’achat lorsque le RSI > 70. Stop-loss 5 %, take-profit 15 %.

</li>
<li>

**Génération IA du code vnpy**

```python
from vnpy.app.cta_strategy import CtaTemplate
import talib

class MA_RSI_Strategy(CtaTemplate):
    fast_window = 5
    slow_window = 20
    rsi_window = 14
    rsi_upper = 70
    stop_loss_pct = 0.05
    take_profit_pct = 0.15

    def on_bar(self, bar):
        self.am.update_bar(bar)
        if not self.am.inited:
            return
        fast_ma = talib.SMA(self.am.close_array, self.fast_window)[-1]
        slow_ma = talib.SMA(self.am.close_array, self.slow_window)[-1]
        rsi = talib.RSI(self.am.close_array, self.rsi_window)[-1]

        if self.pos == 0 and fast_ma > slow_ma and rsi < self.rsi_upper:
            self.buy(bar.close_price, 1)
        elif self.pos > 0 and (fast_ma < slow_ma):
            self.sell(bar.close_price, self.pos)
```

</li>
<li>

**Backtest** — choisissez la période de backtest (2 dernières années par défaut), puis cliquez sur Exécuter :

```
回测期间: 2024-01-01 ~ 2025-12-31
夏普比率: 1.15
最大回撤: 11.3%
胜率: 56%
年化收益: 18.4%
评级: B (收益良好，风控合格)
```

</li>
<li>

**Optimisation IA** — Lucrum propose des pistes d’amélioration :

> Le seuil actuel du filtre RSI (70) est trop permissif : 8 faux signaux de cassure dans le backtest. Recommandations :
> 1. Resserrer le seuil RSI à 65
> 2. Ajouter un filtre par moyenne mobile 5 jours du volume
> 3. Élargir le stop-loss de 5 % à 7 % (pour éviter les sorties dues au bruit)
>
> Sharpe estimé → 1,42, drawdown → 9,2 %

Acceptez les suggestions et relancez le backtest :

```
夏普比率: 1.44
最大回撤: 9.1%
胜率: 62%
评级: A (收益优秀，风控良好)
```

</li>
<li>

**Publication sur le marché des stratégies** — accédez aux détails de la stratégie → bouton Publier → renseignez la tarification :

| Champ | Exemple |
|------|------|
| Nom de la stratégie | MA_RSI_A股趋势 v2 |
| Partage des revenus | Auteur 70 % / Plateforme 30 % |
| Période d’essai | 7 jours |
| Prix d’abonnement recommandé | 99 Lubei/mois |

Une fois la revue de conformité validée, la stratégie peut être publiée sur le [marché des stratégies](/fr/lucrum/strategies).

</li>
</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="sparkles" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Le passage de B à A vient du tour d’optimisation</p>
    <div class="lurus-callout__body"><p>Le premier backtest donne la note B (Sharpe 1,15). Après acceptation des suggestions d’optimisation IA et un nouveau backtest, le Sharpe monte à 1,44 et le drawdown descend à 9,1 %, atteignant le niveau A — qui ouvre l’aiguillage vers la publication.</p></div>
  </div>
</div>

## <Icon name="book-open" :size="20" /> Concepts clés

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--lucrum">
    <div class="lurus-card__title"><Term t="Sharpe Ratio">Ratio de Sharpe</Term></div>
    <p class="lurus-card__body">Le rendement excédentaire par unité de risque.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <div class="lurus-card__title"><Term t="Max Drawdown">Drawdown maximal</Term></div>
    <p class="lurus-card__body">La baisse entre le plus haut historique et le creux le plus bas.</p>
  </div>
  <div class="lurus-card lurus-card--lucrum">
    <div class="lurus-card__title"><Term t="CtaTemplate">CtaTemplate</Term></div>
    <p class="lurus-card__body">La classe de base des stratégies de vnpy.</p>
  </div>
</div>

## Étapes suivantes

<NextSteps :steps="[
  { text: 'Découvrir Lucrum', link: '/fr/lucrum/', primary: true },
  { text: 'Marché des stratégies', link: '/fr/lucrum/strategies' },
  { text: 'FAQ', link: '/fr/lucrum/faq' },
]" />

</div>
