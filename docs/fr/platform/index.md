---
title: Lurus Platform — Compte et facturation
description: Présentation du système de comptes unifiés, des plans d’abonnement, du portefeuille 鹿贝 et de la facturation de Lurus.
---

<div class="platform-page">

<ProductHero product-id="platform" />

## Aperçu

**Lurus Platform** est l’infrastructure unifiée de comptes et de facturation partagée par tous les produits Lurus. Que vous utilisiez Lurus API, Lucrum, Switch ou un autre produit, vous vous connectez avec le même compte Lurus et partagez le même solde de portefeuille et le même plan d’abonnement.

<CapabilityGrid
  accent="var(--lurus-color-platform)"
  title="Les quatre piliers de la plateforme"
  :items="[
    { title: 'Compte unifié', body: 'Une seule identité, un seul solde et un seul abonnement partagés par tous les produits Lurus', icon: 'user-check' },
    { title: 'Portefeuille 鹿贝', body: 'Unité de facturation unifiée, débit à l\'usage, consultation du solde en temps réel', icon: 'coins' },
    { title: 'Plans d\'abonnement', body: 'Quota gratuit + paiement à l\'usage + offres entreprise', icon: 'package-2' },
    { title: 'Système VIP', body: 'Plus vous consommez, plus vous débloquez des modèles exclusifs et un support dédié', icon: 'crown' },
  ]"
/>

---

## Compte unifié

Rendez-vous sur n’importe quel produit Lurus ([api.lurus.cn](https://api.lurus.cn), [lucrum.lurus.cn](https://lucrum.lurus.cn), etc.) pour vous inscrire / vous connecter. **Méthodes de connexion** : e-mail + mot de passe, GitHub (OAuth), Google (OAuth).

À l’inscription, vous obtenez :

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="user-check" :size="20" /></span>
    <div class="lurus-card__title">Identité utilisateur unifiée</div>
    <p class="lurus-card__body">Un seul compte commun à tous les produits</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="coins" :size="20" /></span>
    <div class="lurus-card__title">5 鹿贝 de départ</div>
    <p class="lurus-card__body">Offerts dès l’inscription, utilisables immédiatement</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="gauge" :size="20" /></span>
    <div class="lurus-card__title">Quota gratuit</div>
    <p class="lurus-card__body">Essayez Lurus API immédiatement après l’inscription</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="mail" :size="20" /></span>
    <div class="lurus-card__title">Adresse e-mail @lurus.cn</div>
    <p class="lurus-card__body">Activation automatique de <code>username@lurus.cn</code> (basé sur Stalwart)</p>
  </div>
</div>

**Gestion du compte** (connectez-vous sur [identity.lurus.cn](https://identity.lurus.cn) → paramètres du compte) : informations personnelles, historique de connexion, liaisons tierces, paramètres de sécurité (changement de mot de passe, double authentification).

**Une seule connexion, accès à tout le site** : basé sur le standard OIDC, se connecter à n’importe quel produit établit une session entre tous les produits ; prise en charge de Passkey/WebAuthn sans mot de passe, du MFA par TOTP/clé matérielle, de la connexion sociale GitHub/Google, et les entreprises peuvent intégrer le SSO Azure AD/Feishu/Okta. Les utilisateurs finaux disposent d’un seul compte pour API/Lucrum/Switch/Creator/Lutu ; les développeurs intègrent leurs propres applications via le SDK OIDC, et côté backend via Service User + JWT Profile ; la gestion organisationnelle d’entreprise (membres/permissions/audit) se fait via [identity.lurus.cn](https://identity.lurus.cn) (console Casdoor) ou en contactant le service commercial.

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Approfondir l’authentification d’identité</p>
    <div class="lurus-callout__body"><a href="/fr/platform/auth/">Authentification d’identité unifiée</a> · <a href="/fr/platform/auth/oidc">Intégration OIDC / OAuth2</a> · <a href="/fr/platform/auth/api-auth">Authentification API</a></div>
  </div>
</div>

---

## Système de facturation

Lurus adopte un modèle de facturation double « abonnement + à l’usage », adaptable avec souplesse à différents volumes d’utilisation.

### Plans d’abonnement

| Plan | Positionnement | Idéal pour |
|------|------|------|
| **Free** | Quota de base, utilisation gratuite | Essai personnel |
| **Basic** | Abonnement mensuel d’entrée de gamme | Développeurs individuels |
| **Pro** | Abonnement mensuel avancé + modèles prioritaires | Utilisateurs intensifs |
| **Pro annuel** | Réduction sur l’abonnement Pro annuel | Utilisateurs réguliers |
| **Enterprise** | Personnalisation entreprise + SLA | Équipes / entreprises |

Les tarifs précis font foi sur la console [identity.lurus.cn](https://identity.lurus.cn) (page de gestion des abonnements).

### Facturation à l’usage

Une fois le quota inclus dans l’abonnement dépassé, le débit s’effectue automatiquement depuis le portefeuille 鹿贝. Les tarifs unitaires varient selon les modèles ; ceux affichés sur la console font foi.

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="receipt" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Vous voulez voir les tarifs complets, les règles de quota et les ratios de recharge ?</p>
    <div class="lurus-callout__body"><a href="/fr/platform/billing">Facturation en détail</a> décompose la comparaison des plans d’abonnement, le calcul des quotas, le ratio de conversion des 鹿贝 et la politique de remboursement.</div>
  </div>
</div>

---

## Portefeuille 鹿贝 {#wallet}

Les **鹿贝 (LB)** sont la monnaie de points universelle de la plateforme Lurus, utilisée pour régler tous les frais d’usage en dépassement.

### Obtenir des 鹿贝

| Moyen | Récompense | Description |
|------|------|------|
| **Inscription d’un nouvel utilisateur** | 5 LB | Offerts dès l’inscription |
| **Première recharge** | 10 LB en bonus | Bonus supplémentaire à la première recharge |
| **Premier abonnement** | 30 LB en bonus | Au premier abonnement à n’importe quel plan payant |
| **Renouvellement d’abonnement** | montant rechargé x 5 % | Cashback pour les 6 premiers renouvellements |
| **Pointage quotidien** | LB aléatoires | À récupérer au pointage quotidien |
| **Parrainage d’amis** | Récompense de parrainage | Les deux parties sont récompensées après l’inscription de l’ami |
| **Revenus de stratégie** | Règlement des parts | Revenus d’abonnement aux stratégies Lucrum |
| **Achat par recharge** | Conversion au prorata | Achat direct de 鹿贝 |

### Utiliser les 鹿贝

Utilisables pour : régler les frais d’appels API dépassant le quota d’abonnement, vous abonner aux stratégies payantes Lucrum, acheter des fonctionnalités avancées / packs d’extension.

### Niveaux VIP

La consommation cumulée de 鹿贝 débloque plusieurs niveaux VIP, dont la remise s’applique automatiquement à toutes les dépenses en 鹿贝.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">Standard</span><span class="lurus-stat__label">Débutant</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Silver</span><span class="lurus-stat__label">Argent</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Gold</span><span class="lurus-stat__label">Or</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Platinum</span><span class="lurus-stat__label">Platine</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Diamond</span><span class="lurus-stat__label">Diamant</span></div>
</div>

Les seuils et remises sont détaillés sur la page VIP du centre de compte [identity.lurus.cn](https://identity.lurus.cn).

---

## Moyens de paiement

Tous les paiements sont confirmés de manière asynchrone via un Webhook sécurisé, évitant les doubles débits dus aux fluctuations du réseau.

| Moyen | Cas d’usage | Description |
|------|----------|------|
| **Stripe** | Abonnement + recharge | Carte de crédit/débit (Visa, Mastercard) |
| **Creem** | Recharge | Paiement en cryptomonnaie |
| **Epay** | Recharge | Alipay/WeChat Pay (tiers) |

---

## Programme de parrainage

Sur [identity.lurus.cn](https://identity.lurus.cn), copiez votre lien de parrainage personnel (incluant votre code de parrainage) et partagez-le avec vos amis. Récompenses : lorsqu’un ami s’inscrit via le lien, les deux parties reçoivent des 鹿贝 ; lorsqu’un ami souscrit son premier abonnement payant, vous recevez en plus un cashback correspondant à un certain pourcentage du montant de l’abonnement ; aucune limite au nombre de parrainages.

---

## Service de notifications

Notifications multicanal (les paramètres du compte permettent de personnaliser le canal de réception de chaque type de notification) :

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
    <div class="lurus-card__title">Messages internes</div>
    <p class="lurus-card__body">Modification du compte / alertes de sécurité / annonces système</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="mail" :size="20" /></span>
    <div class="lurus-card__title">E-mail</div>
    <p class="lurus-card__body">Confirmation de paiement / alerte de quota / expiration d’abonnement</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">WebSocket</div>
    <p class="lurus-card__body">Notification en temps réel des anomalies API / solde insuffisant</p>
  </div>
</div>

---

## Sécurité des données

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">Authentification d’identité de niveau entreprise</div>
    <p class="lurus-card__body">Système basé sur le standard <Term t="OIDC">OIDC</Term></p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="lock" :size="20" /></span>
    <div class="lurus-card__title">HTTPS sur tout le site</div>
    <p class="lurus-card__body">Chiffrement TLS 1.3 de bout en bout du transport</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="key" :size="20" /></span>
    <div class="lurus-card__title">Mots de passe jamais stockés en clair</div>
    <p class="lurus-card__body">Stockage chiffré avec bcrypt</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="receipt" :size="20" /></span>
    <div class="lurus-card__title">Passerelle de paiement conforme</div>
    <p class="lurus-card__body">Les paiements passent par un tiers conforme PCI DSS</p>
  </div>
</div>

Les données des utilisateurs sont strictement isolées et ne sont jamais partagées.

---

<NextSteps
  title="Étapes suivantes"
  :steps="[
    { text: 'Authentification d\'identité (Casdoor)', link: '/fr/platform/auth/', primary: true },
    { text: 'Facturation en détail', link: '/fr/platform/billing' },
    { text: 'Questions fréquentes', link: '/fr/platform/faq' },
    { text: 'Obtenir une clé API', link: '/fr/guide/get-api-key' },
  ]"
/>

<!-- lurus:related-block -->

<RelatedProducts product-id="platform" />

</div>

<style>
.platform-page .lurus-card code {
  font-size: 0.85em;
}
</style>
