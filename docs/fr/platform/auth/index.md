---
title: Authentification d’identité unifiée
description: "Le système d’identité partagé par toute la gamme de produits Lurus : une seule connexion pour accéder à tout le site, avec prise en charge du SSO, des Passkeys, de l’authentification multifacteur, de l’authentification API et de la fédération SSO d’entreprise."
---

<div class="auth-page">

<ProductHero product-id="auth" />

**Une seule connexion, un accès à tout le site.** Lurus API, Lucrum, Switch, Creator, Lutu, Admin, Forge et tous les autres produits partagent le même système d’identité — l’utilisateur se connecte à n’importe quel produit, et les autres produits le reconnaissent automatiquement ; les permissions et les quotas sont consolidés à l’échelle du compte ; les clients entreprise peuvent intégrer leur propre SSO pour l’intégration de leurs employés.

Ce système est fourni par `auth.lurus.cn`, déployé en interne sur la base de l’infrastructure d’identité open source [Zitadel](https://zitadel.com), implémentant intégralement les protocoles standards OIDC / OAuth2 / SAML ; les données utilisateur restent à tout moment dans le cluster K8s propre à Lurus.

::: tip Accès rapide
- Gestion en libre-service par l’utilisateur : [auth.lurus.cn](https://auth.lurus.cn) — modifier le mot de passe, gérer les Passkeys, lier la MFA, consulter l’historique de connexion
- Gestion des organisations/projets : [auth.lurus.cn](https://auth.lurus.cn) (console d’organisation Zitadel) — invitation de membres, attribution de permissions et audit pour les clients entreprise ; ou contactez le service commercial pour activer la gestion d’organisation entreprise
:::

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="plug-zap" :size="14" /> Intégration</span>
  <h2 class="lurus-section-head__title">Points d’accès</h2>
  <p class="lurus-section-head__lede">Cinq points de terminaison standards couvrant la découverte, l’autorisation, l’échange de jetons et la lecture des informations utilisateur.</p>
</div>

| Point de terminaison | URL | Description |
|------|-----|------|
| Console | `https://auth.lurus.cn` | Gestion en libre-service du compte, des appareils de sécurité et des sessions |
| OIDC Discovery | `https://auth.lurus.cn/.well-known/openid-configuration` | Découverte automatique par le SDK, incluant tous les points de terminaison et les capacités prises en charge |
| Autorisation OAuth2 | `https://auth.lurus.cn/oauth/v2/authorize` | Point d’entrée du flux standard de code d’autorisation / PKCE |
| Point de terminaison Token | `https://auth.lurus.cn/oauth/v2/token` | Échange contre un access token / refresh token |
| Informations utilisateur | `https://auth.lurus.cn/oidc/v1/userinfo` | Lecture des claims de l’utilisateur courant |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> Capacités</span>
  <h2 class="lurus-section-head__title">Capacités principales</h2>
  <p class="lurus-section-head__lede">Du single sign-on à la fédération SSO d’entreprise, un seul système couvre tous les scénarios, du particulier au B2B.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-auth)"
  :items="[
    { title: 'SSO Single Sign-On', body: 'Une seule connexion suffit pour accéder à tous les produits Lurus, sans avoir à saisir à nouveau ses identifiants. Basé sur une session OIDC standard, avec prise en charge du rafraîchissement silencieux entre applications.', icon: 'key-round' },
    { title: 'Authentification multifacteur / Passkey', body: 'Prise en charge du TOTP (application Authenticator), des clés matérielles U2F et des Passkeys (connexion sans mot de passe WebAuthn). La politique MFA peut être imposée au niveau de l\'organisation ou du projet.', icon: 'shield' },
    { title: 'Connexion sociale', body: 'Possibilité d\'intégrer des fournisseurs d\'identité tiers tels que GitHub, Google ou WeChat ; après avoir lié son compte externe, l\'utilisateur est connecté à son compte Lurus.', icon: 'users' },
    { title: 'RBAC et hiérarchie d\'organisation', body: 'Modèle rôle-permission (Role-Based Access Control). Les permissions sont octroyées à des utilisateurs ou comptes de service spécifiques via des Grants, avec une granularité allant jusqu\'au projet et à l\'application.', icon: 'user-check' },
    { title: 'Multi-tenant B2B', body: 'Plusieurs Organizations peuvent être créées sous une Instance, ce qui prend en charge nativement l\'isolation des clients entreprise ; chaque organisation peut configurer indépendamment sa marque, sa politique de connexion et sa fédération d\'IdP.', icon: 'building-2' },
    { title: 'OIDC / OAuth2 / SAML', body: 'Implémentation complète des trois protocoles standards, compatible avec les principaux SDK et frameworks du marché, pour une intégration transparente des applications Go, Rust, TypeScript et Flutter.', icon: 'link' },
    { title: 'Journaux d\'audit', body: 'Les opérations clés telles que la connexion, les changements de MFA, l\'octroi de permissions ou la réinitialisation de mot de passe sont toutes enregistrées dans des journaux immuables et interrogeables, conformément aux exigences de conformité.', icon: 'history' },
    { title: 'Extensions Actions', body: 'Injectez une logique personnalisée aux points clés du flux d\'authentification (par exemple synchroniser les attributs utilisateur, restreindre les conditions de connexion), sans avoir à forker le cœur de Zitadel.', icon: 'workflow' },
  ]"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Modèle</span>
  <h2 class="lurus-section-head__title">Aperçu des concepts clés</h2>
  <p class="lurus-section-head__lede">Le système d’identité est organisé selon les niveaux suivants ; les développeurs et les administrateurs doivent comprendre comment ces couches d’objets se mappent aux produits Lurus.</p>
</div>

<ArchitectureDiagram
  title="Hiérarchie du modèle d’objets"
  chart="graph TD; Instance[Instance · lurus-prod] --> Org[Organization · lurus.cn]; Org --> User[User · Human / Service]; Org --> Project[Project · un par produit]; Project --> App[Application · client_id]; Project --> Role[Role]; User -. User Grant .-> Role"
/>

| Concept | Signification | Mappage dans Lurus |
|------|------|-----------------|
| **Instance** | Unité de déploiement de plus haut niveau, avec base de données et configuration indépendantes | Lurus exploite une Instance unique, hébergée sur `auth.lurus.cn` |
| **Organization** | Unité d’isolation de locataire, avec annuaire d’utilisateurs et politique de connexion indépendants | Les utilisateurs particuliers appartiennent à l’organisation principale `lurus.cn` ; les clients entreprise demandent une Organization dédiée, configurable avec leur propre domaine et leur propre IdP |
| **Project** | Ensemble d’applications sous une Organization, gérant de manière unifiée les roles et les grants | Chaque gamme de produits (Lurus API, Lucrum, Switch, Forge…) correspond à un Project |
| **Application** | Client spécifique au sein d’un Project, détenant un `client_id` / `client_secret` | Chaque frontend, application de bureau ou serveur enregistre une Application distincte |
| **User** | Compte pouvant se connecter, réparti entre Human (personne réelle) et Service User (machine) | Les utilisateurs finaux sont des Human ; les appels entre services backend utilisent un Service User + JWT Profile |
| **Grant** | Relation de liaison octroyant un Project Role à un User donné | Contrôle le niveau de permission de l’utilisateur au sein d’un produit donné ; les paramètres d’organisation [auth.lurus.cn](https://auth.lurus.cn) (Zitadel) font foi |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="book-open" :size="14" /> Navigation</span>
  <h2 class="lurus-section-head__title">Sommaire de cette section</h2>
  <p class="lurus-section-head__lede">Du concept à l’intégration, approfondissez chaque couche selon vos besoins.</p>
</div>

<div class="lurus-cards lurus-cards--2">
  <a class="lurus-card lurus-card--auth" href="/fr/platform/auth/concepts">
    <span class="lurus-card__icon"><Icon name="layers" :size="20" /></span>
    <div class="lurus-card__title">Concepts principaux</div>
    <p class="lurus-card__body">Détail d’Instance / Organization / Project / User / Application / Grant.</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="/fr/platform/auth/login">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">Connexion et authentification multifacteur</div>
    <p class="lurus-card__body">Connexion par mot de passe, Passkey, connexion sociale, configuration de la MFA.</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="/fr/platform/auth/oidc">
    <span class="lurus-card__icon"><Icon name="link" :size="20" /></span>
    <div class="lurus-card__title">Intégration OIDC / OAuth2</div>
    <p class="lurus-card__body">Discovery, scopes, claims, flux de code d’autorisation, PKCE.</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="/fr/platform/auth/api-auth">
    <span class="lurus-card__icon"><Icon name="key" :size="20" /></span>
    <div class="lurus-card__title">Authentification API</div>
    <p class="lurus-card__body">Personal Access Token, Service User, JWT Profile, validation de token.</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="/fr/platform/auth/console">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Gestion via la console</div>
    <p class="lurus-card__body">Opérations de gestion quotidienne des organisations / projets / applications / utilisateurs.</p>
  </a>
</div>

---

## Synergie avec les autres produits Lurus

| Scénario | Parcours |
|------|------|
| Après avoir obtenu une API Key, appeler Lurus API avec un token OAuth | [Intégration OIDC](/fr/platform/auth/oidc) → [Chat Completions](/fr/api/chat-completions) |
| Se connecter dans Switch pour synchroniser la configuration du compte Lurus | [Connexion et MFA](/fr/platform/auth/login) → [Configuration de Switch](/fr/switch/configuration) |
| Un administrateur Forge configure les permissions de l’équipe | [Gestion via la console](/fr/platform/auth/console) → [Forge](/forge/) |
| Un développeur écrit un service backend appelant l’API interne de Platform | [Authentification API (PAT/JWT)](/fr/platform/auth/api-auth) |
| Un client entreprise souhaite se connecter via son propre Azure AD / Feishu | [Connexion et MFA — Identity Brokering](/fr/platform/auth/login) |

---

## Pour aller plus loin

Construit sur la base de l’infrastructure d’identité open source Zitadel ; pour approfondir les mécanismes sous-jacents ou les détails du SDK, consultez la documentation amont :

- [Page d’accueil de la documentation Zitadel](https://zitadel.com/docs) — prise en main, modèles de déploiement, guides d’intégration de SDK
- [Concepts principaux](https://zitadel.com/docs/concepts) — explication des principes d’Instance, Organization, Project, User et Grant
- [Référence API](https://zitadel.com/docs/apis) — documentation des points de terminaison REST / gRPC de la Management API, de l’Auth API et de l’Admin API

<RelatedProducts product-id="auth" />

</div>

<style scoped>
.auth-page .lurus-section-head {
  margin-top: 8px;
}
</style>
