---
title: Dépannage
description: Une page pour localiser les problèmes fréquents de tous les produits Lurus —— 401 / aucun canal pour le modèle / 429 / quota insuffisant / dépassement de contexte / délai dépassé, avec codes d’erreur et chemins de résolution.
---

<div class="troubleshooting-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> Dépannage</span>
  <h1 class="lurus-section-head__title">Un problème ? Commencez ici</h1>
  <p class="lurus-section-head__lede">Localisez d’abord la destination selon le symptôme, puis déroulez ci-dessous le tableau des problèmes fréquents pour le dépannage. Pas de contenu redondant : on vous oriente seulement vers la page de référence.</p>
</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--api" href="/fr/api/errors">
    <span class="lurus-card__icon"><Icon name="alert-circle" :size="22" /></span>
    <div class="lurus-card__title">Erreur API (4xx / 5xx)</div>
    <p class="lurus-card__body">Codes d’erreur complets, structure des réponses et stratégie de réessai —— 401 / 402 / 404 / 429 / 5xx en un coup d’œil.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/fr/guide/faq">
    <span class="lurus-card__icon"><Icon name="key-round" :size="22" /></span>
    <div class="lurus-card__title">Compte, clé et authentification</div>
    <p class="lurus-card__body">Inscription, perte de clé API, diagnostic d’une clé invalide, questions courantes sur les modèles et les appels en streaming.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/fr/platform/billing">
    <span class="lurus-card__icon"><Icon name="wallet" :size="22" /></span>
    <div class="lurus-card__title">Facturation et quota</div>
    <p class="lurus-card__body">Quota gratuit, plans d’abonnement, règles de débit des 鹿贝, et que faire une fois le quota épuisé.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/fr/guide/clients/others">
    <span class="lurus-card__icon"><Icon name="plug" :size="22" /></span>
    <div class="lurus-card__title">Le client n’arrive pas à se connecter</div>
    <p class="lurus-card__body">Intégration et dépannage des clients tiers comme Cherry Studio / Lobe Chat / OpenCat, etc.</p>
  </a>
  <a class="lurus-card lurus-card--api" href="/fr/platform/faq">
    <span class="lurus-card__icon"><Icon name="layers" :size="22" /></span>
    <div class="lurus-card__title">Problèmes spécifiques à un produit</div>
    <p class="lurus-card__body">Plateforme, MemX, Lucrum, etc. disposent chacun d’une FAQ dédiée : consultez d’abord la page des questions courantes de la documentation du produit concerné.</p>
  </a>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="search" :size="14" /> Symptômes fréquents</span>
  <h2 class="lurus-section-head__title">Dépannage par message d’erreur</h2>
  <p class="lurus-section-head__lede">Déroulez l’erreur que vous rencontrez et suivez la liste de vérification. Pour les codes d’erreur détaillés, voir <a href="/fr/api/errors">Gestion des erreurs</a>.</p>
</div>

<details class="lurus-faq-item" id="invalid-api-key">
<summary>Retourne <code>401 Unauthorized</code> / <code>invalid_api_key</code></summary>

```json
{ "error": { "code": "invalid_api_key", "type": "authentication_error" } }
```

`authentication_error` indique que la clé est invalide ou absente. Vérifiez point par point :

- La clé est complète, commence par `sk-`, sans espace ni saut de ligne superflu (recopiez-la une fois)
- Le format de l’en-tête est `Authorization: Bearer sk-xxxx` (un espace après `Bearer`)
- L’état de la clé est « activé » (console → gestion des jetons)
- Le nom de la variable d’environnement est correctement orthographié et bien chargé

**Ne réessayez pas** un 401 : corrigez la clé puis renvoyez la requête. Voir [Authentification](/fr/api/authentication) et [Questions courantes : comment diagnostiquer une clé invalide](/fr/guide/faq).

</details>

<details class="lurus-faq-item">
<summary>Retourne <code>"no available server"</code> / <code>model_not_found</code> (HTTP 404)</summary>

```json
{ "error": { "code": "model_not_found", "message": "模型 xxx 无可用渠道", "type": "new_api_error" } }
```

- Vérifiez l’orthographe du nom de `model` (sensible à la casse)
- Confirmez que cette clé a le droit d’accéder à ce modèle
- Ce modèle peut temporairement n’avoir aucun canal disponible
- Si vous venez de créer la clé, patientez environ 10 secondes puis réessayez

Pour la liste des modèles disponibles, voir [Modèles pris en charge](/guide/models).

</details>

<details class="lurus-faq-item">
<summary>Retourne <code>429 Too Many Requests</code> / <code>rate_limit_exceeded</code></summary>

```json
{ "error": { "code": "rate_limit_exceeded", "type": "rate_limit_error" } }
```

Limite de débit dépassée. Comment procéder :

- Réduisez la fréquence des requêtes, réessayez après un **backoff exponentiel** de `2 ** attempt` secondes
- Le plan Free est limité par défaut à 60 RPM ; passez à Pro / Team pour relever la limite
- Si cela se déclenche encore fréquemment après paiement, contactez <a href="mailto:support@lurus.cn">support@lurus.cn</a>

Pour un exemple de code de réessai, voir [Gestion des erreurs · Bonnes pratiques](/fr/api/errors#错误处理最佳实践).

</details>

<details class="lurus-faq-item" id="insufficient-quota">
<summary>Retourne <code>402</code> / <code>insufficient_quota</code> (quota / solde insuffisant)</summary>

```json
{ "error": { "code": "insufficient_quota", "type": "billing_error" } }
```

- Vérifiez d’abord si le quota gratuit du jour est épuisé (plan Free : 100 appels/jour)
- Consultez le solde de 鹿贝 : [identity.lurus.cn/wallet](https://identity.lurus.cn/wallet)
- Rechargez en libre-service ou montez de plan ; pour les règles, voir [Facturation](/fr/platform/billing)

</details>

<details class="lurus-faq-item">
<summary><code>context_length_exceeded</code> (dépassement de contexte)</summary>

```json
{ "error": { "code": "context_length_exceeded", "type": "invalid_request_error" } }
```

Par exemple `deepseek-chat` 64K, `gemini-3-pro-preview` 1M : lorsque vous dépassez la limite du modèle :

- Réduisez l’entrée, supprimez des messages de l’historique
- Utilisez une fenêtre glissante (conservez le system + les N derniers tours)
- Passez à un modèle au contexte plus long

</details>

<details class="lurus-faq-item">
<summary>Délai dépassé / aucune réponse pendant longtemps</summary>

1. Vérifiez la connectivité réseau : `curl https://api.lurus.cn/v1/models`
2. Réduisez `max_tokens`
3. Les modèles de raisonnement (`deepseek-reasoner`) ont un long temps de réflexion, c’est normal
4. Le délai par défaut du SDK est d’environ 60 secondes ; vous pouvez augmenter `timeout`
5. Un délai persistant peut indiquer une panne en amont : changez de modèle et réessayez

</details>

---

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Rien trouvé ? Contactez support@lurus.cn</p>
    <div class="lurus-callout__body">Joignez : le contenu complet du message d’erreur, l’ID de requête (en-tête de réponse <code>X-Request-ID</code>), l’heure de l’incident et les étapes de reproduction, pour un diagnostic rapide.</div>
  </div>
</div>

<NextSteps
  title="Documents associés"
  :steps="[
    { text: 'Gestion des erreurs (codes d\'erreur complets)', link: '/fr/api/errors', primary: true },
    { text: 'Questions courantes', link: '/fr/guide/faq' },
    { text: 'Facturation', link: '/fr/platform/billing' },
  ]"
/>

</div>
