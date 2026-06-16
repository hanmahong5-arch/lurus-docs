---
title: Concepts fondamentaux | Authentification d’identité Zitadel
description: Présentation détaillée du modèle d’objets Zitadel — Instance / Organization / Project / Application / User / Grant / Administrator — illustrée par le déploiement réel de Lurus.
---

<div class="auth-concepts">

# Concepts fondamentaux

Lurus utilise [Zitadel](https://zitadel.com) comme fournisseur d’identité OIDC (IdP) unifié, avec le point d’entrée public `auth.lurus.cn`. Cette page présente la hiérarchie du modèle d’objets.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Modèle</span>
  <h2 class="lurus-section-head__title">Vue d’ensemble du modèle d’objets</h2>
  <p class="lurus-section-head__lede">Six catégories d’objets, une inclusion unidirectionnelle — comprenez ce schéma et chaque section qui suit n’en sera que le développement.</p>
</div>

<ArchitectureDiagram
  title="Hiérarchie du modèle d’objets Zitadel"
  chart="graph TD; Instance[Instance · lurus-prod] --> Org[Organization · lurus.cn]; Org --> User[User · Employé / Client / Service Account]; Org --> Project[Project · lurus-api / lucrum / switch …]; Org --> OrgGrant[Grant · Octroyer un Project à une autre Org]; Project --> App[Application · Web / SPA / Native / API / SAML]; Project --> Role[Role · ex. lucrum:admin]; User -. User Grant .-> Role"
/>

La relation d’inclusion est **strictement unidirectionnelle** : Instance ⊃ Organization ⊃ Project ⊃ (Application, Role). Un User appartient à une Organization et est lié à un Project Role via un User Grant.

---

## Instance (instance)

L'**abstraction la plus élevée** de la hiérarchie de données, équivalente à un émetteur d’identité indépendant (issuer). Le champ `iss` de tous les tokens pointe vers le domaine de cette Instance.

| Attribut | Description |
|------|------|
| Rôle | Conteneur de configuration par défaut au niveau système (Branding, Login/Password Policy, etc.) |
| Multi-locataire | Une instance héberge plusieurs Organizations, assurant l’isolation des locataires |
| Administrateur | L’administrateur de l’Instance dispose de droits sur toutes les Organizations, avec les privilèges les plus élevés |
| Instances virtuelles | La System API permet de créer plusieurs instances virtuelles, adaptées à la distribution multi-locataire en SaaS |

::: tip Contexte Lurus
L’environnement de production ne comporte qu’une seule instance, **`lurus-prod`** (`auth.lurus.cn`). Aucune instance virtuelle n’est nécessaire ; toutes les gammes de produits partagent le même issuer.
:::

---

## Organization (organisation)

**Unité de locataire**, semblable à une OU dans un service d’annuaire. Une Instance peut en contenir plusieurs, et les données utilisateur y sont mutuellement isolées. Elle possède : User & Service Account (pool d’utilisateurs dédié), Project (regroupement de produits avec applications et rôles), Domain (un ou plusieurs, dont un domaine principal), Policy (peut surcharger la politique de sécurité par défaut de l’instance). Elle prend en charge la **délégation de droits** : confier la gestion de ses propres Projects à une autre Organization, pour réaliser un IAM B2B en libre-service.

::: tip Contexte Lurus
L’organisation principale actuelle est **`lurus.cn`**, qui héberge les comptes des employés internes et les différents Projects de produits. Lors de l’intégration de clients entreprise, on peut créer une Organization auxiliaire dédiée à chaque entreprise et ouvrir l’accès à des produits spécifiques via un Project Grant.
:::

---

## Project (projet)

**Regroupement logique de produits** : chaque Project correspond à un produit logiciel ou à une frontière de service. Toutes les Applications d’un même Project partagent les mêmes définitions de Role. Composition : Application (client de connexion), Role (chaîne de rôle telle que `admin`/`viewer`), User Grant (octroi d’un rôle à un User), Granted Organization (l’ensemble du Project octroyé à une autre Org). Les réglages au niveau Project incluent : exiger ou non que la connexion porte une déclaration de rôles (`urn:zitadel:iam:org:project:roles`), autoriser ou non la connexion via un IdP externe, etc.

::: tip Contexte Lurus
Chaque gamme de produits correspond à un Project indépendant ; le nommage figure dans le registre `capabilities:` de `lurus.yaml`. Les conventions de rôles sont définies par chaque équipe produit.
:::

---

## Application (application)

**Client de connexion concret** : l’entité logicielle qui initie réellement les requêtes d’authentification. Chacune possède un `client_id` propre, ainsi qu’un `client_secret` ou une configuration PKCE selon la méthode d’authentification.

| Type | Cas typique | Méthode d’authentification |
|------|---------|---------|
| **Web** | Rendu côté serveur (Spring, Phoenix, Django) | Authorization Code + PKCE ou Client Secret |
| **SPA** | Single Page côté client uniquement (React, Vue) | Authorization Code + **PKCE** (obligatoire) |
| **Native** | Bureau / mobile (Switch, application Lutu) | Authorization Code + PKCE + Custom Scheme |
| **API** | Backend pur / M2M | Client Credentials (JWT ou Basic Auth) / Private Key JWT |
| **SAML** | Applications entreprise compatibles SAML 2.0 | Assertion SAML 2.0 |

::: warning À propos de PKCE
Les applications impliquant une interaction utilisateur (Web/SPA/Native) utilisent **PKCE** par défaut. L’usage de l’Implicit Flow est interdit dans les applications front-end.
:::

**Configurations clés** : `client_id` (tous les types, identifie l’application) ; `client_secret` (uniquement pour les applications côté serveur pouvant stocker un secret en sécurité ; SPA/Native utilisent PKCE à la place) ; Redirect URI (vérification stricte de la correspondance exacte ; le mode développement peut l’assouplir) ; mode développement (autorise les URI non-HTTPS et les jokers, réservé au développement local, à désactiver en production).

---

## User (utilisateur)

On distingue le **Human User**, désignant une personne réelle, et le **Machine User**, désignant un système automatisé.

- **Human User** : prend en charge le mot de passe, la MFA (TOTP/SMS), les Passkey (FIDO2/WebAuthn), les IdP externes (Google/GitHub, etc.). Les champs incluent le nom de connexion, le nom, l’e-mail, le téléphone, la préférence de langue et des Metadata personnalisées (paires clé-valeur).
- **Machine User / Service Account** : services backend, CI/CD, tâches planifiées. Méthode d’authentification : **PAT** (token au porteur de longue durée, simple) ou **JWT Profile** (échange d’un JWT signé par clé privée contre un token, plus sécurisé).

**États de l’utilisateur** : `active` (peut se connecter) / `inactive` (désactivé) / `locked` (verrouillé après trop d’échecs) / `deleted` (suppression logique, conservée pour l’audit).

::: tip Contrainte importante
Chaque User appartient strictement à **une seule Organization**. L’accès inter-organisations passe par le mécanisme d’Organization Grant ; il est impossible de partager directement un compte entre organisations.
:::

---

## Grant et Role

Reposant sur le RBAC, les éléments centraux sont le Project Role, le User Grant et le Project Grant.

- **Project Role** : chaîne de rôle au sein d’un Project, avec trois champs — Key (identifiant code, ex. `admin`), Display Name (affichage en console, ex. « Administrateur »), Group (regroupement optionnel, ex. `management`). Partagée par toutes les Applications d’un même Project.
- **User Grant** = `User + Project + Role[]` : après connexion, la claim `urn:zitadel:iam:org:project:roles` de l’access token porte l’ensemble des rôles octroyés à l’utilisateur sur le Project cible ; le backend analyse cette claim pour l’autorisation, sans appel d’API supplémentaire.
- **Project Grant** = `Project (Org source) → Organization (Org cible)` : confier la gestion de l’ensemble du Project à une autre Organization. Cœur du multi-locataire B2B : Lurus n’a pas besoin de créer de comptes pour les employés du client ; ce dernier gère lui-même utilisateurs et droits au sein de son Organization.

---

## Administrator (administrateur)

Quatre niveaux, suivant le moindre privilège :

| Niveau | Portée | Rôles typiques |
|------|--------|---------|
| **IAM / Instance** | L’instance entière (toutes les Organizations) | `IAM_OWNER` |
| **Organization** | Toutes les ressources d’une organisation | `ORG_OWNER`, `ORG_USER_MANAGER` |
| **Project** | Applications, rôles et octrois d’un seul Project | `PROJECT_OWNER` |
| **Project Grant** | Gestion des rôles utilisateur d’un Project octroyé | `PROJECT_GRANT_OWNER` |

**Chaînes de rôles courantes** : `IAM_OWNER` (privilège maximal au niveau instance, gère toutes les organisations/politiques/instances virtuelles), `ORG_OWNER` (gère utilisateurs/Project/domaines/politiques d’une organisation), `ORG_USER_MANAGER` (gère uniquement les utilisateurs et l’attribution des rôles, sans modifier la structure du Project), `ORG_USER_PERMISSION_EDITOR` (édite uniquement les User Grants), `PROJECT_OWNER` (gère Application/Role/Grant au sein d’un Project), `PROJECT_GRANT_OWNER` (gère les rôles des utilisateurs de sa propre organisation au sein d’un Project octroyé).

::: warning Visibilité inter-organisations
Seul `IAM_OWNER` peut consulter et administrer plusieurs Organizations. `ORG_OWNER` est strictement limité à sa propre organisation et ne peut accéder aux données des autres organisations.
:::

---

## Policy (politique)

La couche Instance définit les valeurs par défaut ; la couche Organization les surcharge au besoin.

| Type de politique | Description |
|---------|------|
| **Login Policy** | Quelles méthodes d’authentification autoriser (Password/Passkey/IdP externe/activation de l’inscription) |
| **Password Policy** | Complexité du mot de passe, longueur minimale, interdiction des mots de passe historiques |
| **Lockout Policy** | Seuil du nombre d’échecs de connexion, durée de verrouillage |
| **MFA Policy** | Imposer ou non la MFA, quelles méthodes autoriser |
| **Privacy Policy** | URL de la déclaration de confidentialité, URL des ToS |
| **Branding** | Logo de la page de connexion, palette de couleurs, CSS personnalisé (personnalisable indépendamment au niveau Organization) |

Les politiques concrètes de l’organisation principale `lurus.cn` sont gérées par l’exploitation de la plateforme dans la Zitadel Console et ne sont pas codées en dur ici.

---

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Alignement avec le déploiement réel de Lurus</p>
    <div class="lurus-callout__body"><ul><li><strong>Nommage des Projects</strong> : chaque produit correspond à un Project (<code>lurus-api</code>, <code>lucrum</code>, <code>switch</code>, <code>lutu</code>, <code>admin</code>, <code>forge</code>), la Zitadel Console faisant foi.</li><li><strong>Conventions de rôles</strong> : les chaînes de rôles sont définies par le CLAUDE.md au niveau service ou par le registre <code>capabilities:</code> de <code>lurus.yaml</code>, et ne sont pas codées en dur ici.</li><li><strong>Cas Machine User</strong> : les appels M2M utilisent uniformément un Machine User + JWT Profile, pour éviter de partager des comptes humains.</li><li><strong>Cas PAT</strong> : la CI/CD et les scripts peuvent utiliser un PAT, à condition de fixer la durée de validité la plus courte et d’effectuer une rotation régulière.</li><li><strong>Référence de configuration complète</strong> : la section <code>capabilities:</code> de <code>lurus.yaml</code> est l’unique point d’entrée pour les changements d’architecture.</li></ul></div>
  </div>
</div>

</div>

<style scoped>
.auth-concepts .lurus-section-head { margin-top: 8px; }
</style>
