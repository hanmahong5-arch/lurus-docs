---
title: Démarrage rapide Lucrum
description: Prenez en main l’assistant de trading quantitatif IA Lucrum en 5 minutes.
---

<div class="lucrum-page">

# Démarrage rapide

Prenez en main l’assistant de trading IA Lucrum en 5 minutes — de l’inscription à votre premier backtest.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">5</span><span class="lurus-stat__label">minutes pour démarrer</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">11</span><span class="lurus-stat__label">conseillers en investissement</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Actions A</span><span class="lurus-stat__label">marchés de Shanghai et Shenzhen</span></div>
</div>

<ol class="lurus-steps">
<li>

### Inscription et connexion

Rendez-vous sur [lucrum.lurus.cn](https://lucrum.lurus.cn) → « Inscription » avec votre compte unifié Lurus (e-mail / GitHub / Google) → accédez au tableau de bord de trading. Si vous possédez déjà un compte sur n’importe quel produit Lurus, vous pouvez vous connecter directement (le système de comptes est partagé).

</li>
<li>

### Découvrir l’assistant de trading IA

Une fois connecté, l’accès à l’assistant IA se trouve en bas à droite ; il comprend le langage naturel et peut répondre à toute question liée au trading. Exemples de questions :

- **Analyse de marché** — « Pourquoi l’indice composite de Shanghai a-t-il baissé aujourd’hui ? »
- **Conseils de stratégie** — « Stratégie prudente recommandée pour 100 000 yuans de capital »
- **Indicateurs techniques** — « Calcule les bandes de Bollinger de CATL »
- **Évaluation des risques** — « Est-il risqué d’investir tout mon capital dans BYD ? »

</li>
<li>

### Parcourir le marché des stratégies

« **Marché des stratégies** » en haut → filtrez par rendement / drawdown / type → la fiche de stratégie affiche le rendement annualisé, le drawdown maximal, le ratio de Sharpe (&gt; 1 est excellent) et la durée d’exécution (explication détaillée des indicateurs dans [Marché des stratégies](/fr/lucrum/strategies)) → « S’abonner » pour déployer sur votre compte.

</li>
<li>

### Configurer un compte de trading

Le trading réel nécessite de relier un courtier : « **Paramètres** » → « **Compte de trading** » → choisissez un courtier → autorisez en suivant les instructions.

</li>
<li>

### Créer votre première stratégie (développeurs)

Rendez-vous dans l'« **Atelier de stratégies** » pour écrire votre code, puis cliquez sur « **Backtest** » pour consulter les performances historiques :

```python
# 示例：简单的双均线策略
from lucrum import Strategy, Signal

class DualMA(Strategy):
    """双均线交叉策略"""

    fast_period = 5    # 快线周期
    slow_period = 20   # 慢线周期

    def on_bar(self, bar):
        fast_ma = self.sma(bar.close, self.fast_period)
        slow_ma = self.sma(bar.close, self.slow_period)

        if fast_ma > slow_ma and self.position <= 0:
            return Signal.BUY
        elif fast_ma < slow_ma and self.position >= 0:
            return Signal.SELL

        return Signal.HOLD
```

</li>
</ol>

<div class="lucrum-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="shield" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Avertissement sur les risques</p>
    <div class="lurus-callout__body">Le trading quantitatif comporte un risque de perte. Validez d’abord pleinement votre stratégie en compte de démonstration avant de passer en réel. Lucrum ne fournit aucun conseil en investissement ni garantie de rendement.</div>
  </div>
</div>

---

## Intégration de l’API

Une API REST complète est intégrable à votre propre système de trading :

<ApiEndpoint method="POST" path="/api/v1/advisor/chat" description="Obtenir une analyse IA" />

```bash
curl https://lucrum.lurus.cn/api/v1/advisor/chat \
  -H "Authorization: Bearer $LURUS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "分析上证指数趋势"}'
```

<ApiEndpoint method="GET" path="/api/v1/strategies" description="Obtenir la liste des stratégies" />

```bash
curl https://lucrum.lurus.cn/api/v1/strategies \
  -H "Authorization: Bearer $LURUS_TOKEN"
```

---

<NextSteps
  :steps="[
    { text: 'Marché des stratégies', link: '/fr/lucrum/strategies', primary: true },
    { text: 'Questions fréquentes', link: '/fr/lucrum/faq' },
    { text: 'API Lurus', link: '/fr/guide/introduction' },
    { text: 'MemX, le moteur de mémoire', link: '/fr/memx/' },
  ]"
  title="Étapes suivantes"
/>

</div>
