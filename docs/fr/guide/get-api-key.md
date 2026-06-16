---
title: Obtenir une clé API
description: Étapes complètes pour créer un compte Lurus et obtenir une clé API.
---

<div class="getkey-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="key-round" :size="14" /> Obtenir une clé API</span>
  <h1 class="lurus-section-head__title">Créez un compte et votre première clé</h1>
  <p class="lurus-section-head__lede">Obtenez une clé API utilisable en 3 minutes.</p>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Intégration OIDC / OAuth</p>
    <div class="lurus-callout__body">Pour permettre à vos utilisateurs finaux de se connecter à votre propre application avec un compte Lurus, ou à votre backend d’appeler via un Service User + JWT Profile, vous pouvez utiliser l’authentification d’identité unifiée : <a href="/fr/platform/auth/oidc">Intégration OIDC / OAuth2</a> · <a href="/fr/platform/auth/api-auth">Authentification API (PAT/JWT)</a>. La clé API et le token OIDC coexistent, les deux restent valides.</div>
  </div>
</div>

## S’inscrire et créer une clé

<ol class="lurus-steps">
<li>

Accédez à la [console Lurus](https://api.lurus.cn) → « S’inscrire » → saisissez votre e-mail et votre mot de passe → validez votre e-mail.

</li>
<li>

Connectez-vous → « Gestion des tokens » dans le menu de gauche → « Créer un nouveau token » → saisissez un nom de token (pour faciliter l’identification) → confirmez.

</li>
</ol>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Affichée une seule fois</p>
    <div class="lurus-callout__body">Après la création, copiez et conservez immédiatement votre clé API : elle <strong>n’est affichée qu’une seule fois</strong> !</div>
  </div>
</div>

## Format de la clé API

Commence par `sk-`, suivie de 48 caractères aléatoires : `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.

## Gérer les clés API

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="bar-chart-3" :size="22" /></span>
    <div class="lurus-card__title">Consulter la consommation</div>
    <p class="lurus-card__body">La page « Gestion des tokens » affiche pour chaque clé le quota utilisé, le quota restant et l’heure du dernier appel.</p>
  </div>
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="lock" :size="22" /></span>
    <div class="lurus-card__title">Désactiver / Supprimer</div>
    <p class="lurus-card__body">Désactiver = suspendre le droit d’utilisation (réversible) ; supprimer = suppression définitive (irréversible).</p>
  </div>
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="filter" :size="22" /></span>
    <div class="lurus-card__title">Définir les permissions de modèles</div>
    <p class="lurus-card__body">Cliquez sur « Modifier » à côté de la clé → « Modèles disponibles » sélectionnez les modèles autorisés → enregistrez.</p>
  </div>
</div>

## Recommandations de sécurité

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Traitez la clé comme un mot de passe</p>
    <div class="lurus-callout__body">Ne la divulguez pas (ne la committez pas dans un dépôt public) ; faites tourner la clé tous les 90 jours ; appliquez le moindre privilège (n’accordez que les modèles nécessaires) ; vérifiez régulièrement les journaux d’appels pour détecter et traiter rapidement toute anomalie.</div>
  </div>
</div>

## Questions fréquentes

<details class="lurus-faq-item">
<summary>J’ai oublié ma clé, que faire ?</summary>

Impossible de la récupérer, créez une nouvelle clé.

</details>

<details class="lurus-faq-item">
<summary>Ma clé a été compromise ?</summary>

Désactivez ou supprimez immédiatement cette clé et créez-en une nouvelle.

</details>

<details class="lurus-faq-item">
<summary>Mon quota est épuisé ?</summary>

Rechargez en libre-service ou passez à un forfait supérieur : consultez d’abord les paliers (Free / Basic / Pro) dans la [tarification détaillée](/fr/platform/billing), puis rendez-vous sur la [console](https://api.lurus.cn) pour recharger ou mettre à niveau.

</details>

<NextSteps
  title="Étapes suivantes"
  :steps="[
    { text: 'Démarrage rapide', link: '/fr/guide/quickstart', primary: true },
    { text: 'Modèles pris en charge', link: '/guide/models' },
    { text: 'Tarification détaillée', link: '/fr/platform/billing' },
  ]"
/>

</div>
