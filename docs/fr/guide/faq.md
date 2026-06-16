---
title: FAQ Lurus API
description: Questions fréquentes et réponses sur l’utilisation de Lurus API, incluant la facturation, la compatibilité et le dépannage.
---

<div class="faq-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> Foire aux questions</span>
  <h1 class="lurus-section-head__title">Foire aux questions</h1>
  <p class="lurus-section-head__lede">Compte, modèles, facturation, dépannage —— dépliez par thème.</p>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> Compte et authentification</span>
  <h2 class="lurus-section-head__title">Compte et authentification</h2>
</div>

<details class="lurus-faq-item">
<summary>Comment s’inscrire ?</summary>

Sur [api.lurus.cn](https://api.lurus.cn), renseignez votre e-mail et mot de passe (ou connectez-vous via GitHub/Google) ; vous obtenez automatiquement 5 鹿贝 + un quota gratuit, et tous les produits partagent le même compte.

</details>

<details class="lurus-faq-item">
<summary>J’ai perdu ma clé API ?</summary>

Elle ne s’affiche qu’une seule fois et ne peut être récupérée : supprimez l’ancienne et créez-en une nouvelle dans la console. Stockez-la dans un gestionnaire de mots de passe ou une variable d’environnement, ne l’écrivez pas dans le code ; chaque compte peut créer plusieurs clés, et attribuer une clé indépendante par projet est plus sûr.

</details>

<details class="lurus-faq-item">
<summary>Comment diagnostiquer une clé invalide ?</summary>

- La clé est complète (commence par `sk-`, sans caractère manquant)
- Statut « Activée » (console → Gestion des jetons)
- En-tête de requête `Authorization: Bearer sk-xxxx` (un espace après Bearer)
- Aucun espace/saut de ligne superflu (recopiez-la)
- Le nom de la variable d’environnement est correctement orthographié et bien chargé

Toujours une erreur `401` ? Suivez la liste de contrôle point par point dans [Dépannage · invalid_api_key](/fr/guide/troubleshooting#invalid-api-key).

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Modèles et appels</span>
  <h2 class="lurus-section-head__title">Modèles et appels</h2>
</div>

<details class="lurus-faq-item">
<summary>Quels modèles sont pris en charge ?</summary>

OpenAI, Claude, Gemini, DeepSeek, etc. — voir la [liste des modèles](/guide/models).

</details>

<details class="lurus-faq-item">
<summary>Retour de <code>"no available server"</code></summary>

Vérifiez le nom du modèle ; confirmez que la clé a accès à ce modèle ; ce modèle n’a peut-être aucun canal disponible pour le moment, contactez l’administrateur.

</details>

<details class="lurus-faq-item">
<summary>Comment changer de modèle ?</summary>

Modifiez uniquement le paramètre `model`, sans rien changer d’autre.

</details>

<details class="lurus-faq-item">
<summary>Comment activer la réponse en flux continu ?</summary>

Définissez `"stream": true` ; la réponse est renvoyée bloc par bloc via SSE.

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="wallet" :size="14" /> Facturation et quotas</span>
  <h2 class="lurus-section-head__title">Facturation et quotas</h2>
</div>

<details class="lurus-faq-item">
<summary>Comment consulter ma consommation ?</summary>

Dans la console, « Tableau de bord » ou « Journaux d’utilisation ».

</details>

<details class="lurus-faq-item">
<summary>Mon quota est épuisé ?</summary>

Contactez l’administrateur pour recharger ou mettre à niveau votre forfait.

</details>

<details class="lurus-faq-item">
<summary>Où voir le prix des modèles ?</summary>

Voir la tarification dans la [liste des modèles](/guide/models).

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="alert-circle" :size="14" /> Problèmes techniques</span>
  <h2 class="lurus-section-head__title">Problèmes techniques</h2>
</div>

<details class="lurus-faq-item">
<summary>Que faire en cas de délai d’attente dépassé ?</summary>

1. Vérifiez le réseau (`curl https://api.lurus.cn/v1/models`)
2. Réduisez `max_tokens`
3. Les modèles de raisonnement (`deepseek-reasoner`) ont un long temps de réflexion, c’est normal
4. Le délai par défaut des SDK est d’environ 60 secondes, vous pouvez augmenter `timeout`
5. Des délais persistants peuvent indiquer une panne en amont, changez de modèle

</details>

<details class="lurus-faq-item">
<summary>Erreur 429 (<Term t="Rate Limit">Rate Limit</Term> dépassé)</summary>

Réduisez la fréquence + réessayez avec un repli exponentiel (voir [Gestion des erreurs](/fr/api/errors)) ; Free est limité par défaut à 60 RPM, mettez à niveau vers Pro/Team pour augmenter la limite ; si cela se déclenche encore fréquemment en formule payante, contactez support@lurus.cn.

</details>

<details class="lurus-faq-item">
<summary>Dépassement de contexte (par ex. <code>deepseek-chat</code> 64K, <code>gemini-3-pro-preview</code> 1M)</summary>

- Réduisez l’entrée en supprimant l’historique
- Fenêtre glissante (conservez le system + les N derniers tours)
- Passez à un modèle à contexte plus long
- Résumez d’abord les documents très longs avant de les transmettre

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> Autres questions</span>
  <h2 class="lurus-section-head__title">Autres questions</h2>
</div>

<details class="lurus-faq-item">
<summary>Les données sont-elles sécurisées ?</summary>

HTTPS de bout en bout ; le contenu des conversations n’est pas stocké ; seules les métadonnées d’appel sont enregistrées à des fins de facturation.

</details>

<details class="lurus-faq-item">
<summary>Y a-t-il une garantie SLA ?</summary>

Les clients entreprise peuvent signer un SLA, contactez le service commercial.

</details>

<details class="lurus-faq-item">
<summary>Quels canaux de support technique ?</summary>

support@lurus.cn / GitHub Issues.

</details>

<div class="lurus-cta">
  <div>
    <p class="lurus-cta__title">Vous n’avez pas trouvé de réponse ?</p>
    <p class="lurus-cta__text">Envoyez-nous votre question, réponse sous un jour ouvré.</p>
  </div>
  <div class="lurus-cta__actions">
    <a class="lurus-cta__btn lurus-cta__btn--primary" href="mailto:support@lurus.cn">Contactez-nous →</a>
  </div>
</div>

</div>
