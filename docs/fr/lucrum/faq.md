---
title: Questions fréquentes Lucrum
description: Questions fréquentes et réponses sur la plateforme de trading quantitatif IA Lucrum.
---

<div class="lucrum-page">

# Questions fréquentes

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> Compte et prise en main</span>
  <h2 class="lurus-section-head__title">Inscription, paiement et couverture des marchés</h2>
</div>

<details class="lurus-faq-item">
<summary>Comment s’inscrire ?</summary>

Sur [lucrum.lurus.cn](https://lucrum.lurus.cn), connectez-vous avec le compte unifié Lurus (tous les produits partagent le même compte).

</details>

<details class="lurus-faq-item">
<summary>Faut-il payer ?</summary>

Deux formules, gratuite / payante ; au-delà du quota gratuit, les frais sont prélevés depuis le [portefeuille 鹿贝](/fr/platform/billing#wallet).

| Fonctionnalité | Gratuit | Payant |
|------|------|------|
| Assistant de trading IA | Conversations quotidiennes limitées | Illimité |
| Consultation du marché de stratégies / stratégies gratuites | Toutes visibles / utilisables | Toutes visibles / utilisables |
| Abonnement aux stratégies payantes | Indisponible | Abonnement possible |
| Développement de stratégies | Backtest de base | Fonctionnalités complètes |

</details>

<details class="lurus-faq-item">
<summary>Quels marchés sont pris en charge ?</summary>

Actuellement les actions A (places de Shanghai et Shenzhen) ; les actions de Hong Kong / américaines / les cryptos sont en cours d’intégration.

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bot" :size="14" /> Assistant IA</span>
  <h2 class="lurus-section-head__title">Précision, mémoire et génération de code</h2>
</div>

<details class="lurus-faq-item">
<summary>Les analyses sont-elles précises ?</summary>

Elles s’appuient sur un LLM + l’analyse technique pour fournir des repères, et **ne constituent pas un conseil en investissement**. L’IA excelle à interpréter les indicateurs techniques / les chandeliers, à clarifier la logique du marché, à aider à la conception de stratégies et au code ; elle est moins douée pour prédire les hausses ou baisses à court terme — à utiliser comme référence pour la décision, et non comme fondement.

</details>

<details class="lurus-faq-item">
<summary>Mémorise-t-elle les conversations ?</summary>

Oui. Grâce à l’intégration du [moteur de mémoire MemX](/fr/memx/), elle retient vos préférences / secteurs suivis / historique de conversations, isolés par utilisateur et sans fuite.

</details>

<details class="lurus-faq-item">
<summary>Peut-on écrire du code de stratégie avec l’IA ?</summary>

Oui. Décrivez votre idée et l’IA génère un squelette de code Python, que vous pouvez valider directement par backtest dans l’atelier de stratégies.

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bar-chart-3" :size="14" /> À propos des stratégies</span>
  <h2 class="lurus-section-head__title">Fiabilité des backtests, retraits et protection du code</h2>
</div>

<details class="lurus-faq-item">
<summary>Les données de backtest sont-elles fiables ?</summary>

Elles utilisent des cours historiques réels, mais ne tiennent pas compte du coût d’impact ni du slippage (différence pour les gros capitaux), une suroptimisation conduit facilement au surapprentissage, et le passé ne garantit pas l’avenir. Il est recommandé, après un backtest, de valider d’abord en compte de simulation.

</details>

<details class="lurus-faq-item">
<summary>Comment retirer les revenus d’une stratégie ?</summary>

Les revenus arrivent en 鹿贝 dans le portefeuille → connectez-vous à [identity.lurus.cn](https://identity.lurus.cn) → « Portefeuille » → « Retrait » → saisissez le montant et la carte bancaire → crédité en général sous 1 à 3 jours ouvrés.

</details>

<details class="lurus-faq-item">
<summary>Le code de la stratégie peut-il fuiter ?</summary>

Non. Il est stocké chiffré côté serveur ; les utilisateurs ne voient que la description / les indicateurs / le rapport de backtest, et ne peuvent pas consulter le code source.

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="code" :size="14" /> Questions techniques</span>
  <h2 class="lurus-section-head__title">Limitation de débit, latence et langage de stratégie</h2>
</div>

<details class="lurus-faq-item">
<summary>L’API renvoie 429 ?</summary>

Vous avez dépassé la limite de fréquence des requêtes (variable selon la formule) ; réduisez la fréquence ou passez à une formule supérieure.

</details>

<details class="lurus-faq-item">
<summary>Latence d’exécution élevée des stratégies ?</summary>

Vérifiez la stabilité du réseau ; pour les calculs complexes d’une stratégie, il est recommandé de précalculer et mettre en cache ; évitez les périodes de forte affluence à l’ouverture / à la clôture.

</details>

<details class="lurus-faq-item">
<summary>Quels langages sont pris en charge pour écrire des stratégies ?</summary>

Actuellement Python ; le SDK de stratégies fournit une bibliothèque d’indicateurs techniques et une interface d’exécution des transactions.

</details>

---

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="mail" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Vous n’avez pas trouvé de réponse ?</p>
    <div class="lurus-callout__body">Veuillez contacter <a href="mailto:support@lurus.cn">support@lurus.cn</a>.</div>
  </div>
</div>

<NextSteps
  :steps="[
    { text: 'Démarrage rapide', link: '/fr/lucrum/quickstart', primary: true },
    { text: 'Marché de stratégies', link: '/fr/lucrum/strategies' },
    { text: 'Aperçu du produit', link: '/fr/lucrum/' },
  ]"
  title="Étapes suivantes"
/>

</div>
