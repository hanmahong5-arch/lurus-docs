---
title: "Migrer d'un Keycloak / Auth0 auto-hébergé vers Lurus Auth"
description: "Le parcours complet : migration des utilisateurs SCIM, fédération SSO et bascule progressive."
---

<div class="mig-oidc-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> Migrer depuis un OIDC auto-hébergé</span>
  <h1 class="lurus-section-head__title">Migrer d'un OIDC auto-hébergé vers Lurus Auth</h1>
  <p class="lurus-section-head__lede">L'entreprise dispose déjà d'un IdP (Keycloak / Auth0 / Okta / Azure AD) et souhaite que ses employés continuent à se connecter avec leur compte d'entreprise, tout en externalisant la couche d'identité vers Lurus.</p>
</div>

## <Icon name="git-branch" :size="20" /> Deux stratégies

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="building-2" :size="20" /></span>
    <div class="lurus-card__title">Stratégie A : Lurus Auth comme IdP secondaire (recommandé)</div>
    <p class="lurus-card__body">Vous ne gérez que le cycle de vie des utilisateurs de l'IdP d'entreprise ; les produits Lurus lisent l'identité via la fédération OIDC.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="import" :size="20" /></span>
    <div class="lurus-card__title">Stratégie B : déménagement complet</div>
    <p class="lurus-card__body">Le Keycloak/Auth0 d'origine est exporté via SCIM vers Lurus Auth (Casdoor), qui devient l'unique source de vérité.</p>
  </div>
</div>

### Stratégie A — topologie de fédération

<ArchitectureDiagram title="策略 A：联邦" chart="graph LR
  IDP[企业 IdP 既有] -->|OIDC 联邦| LA[Lurus Auth]
  LA --> P[所有 Lurus 产品]" />

### Stratégie B — topologie de déménagement

<ArchitectureDiagram title="策略 B：搬家" chart="graph LR
  KC[原 Keycloak/Auth0] -->|SCIM 导出| LA[Lurus Auth · Casdoor]
  LA --> D[所有下游]" />

## <Icon name="building-2" :size="20" /> Étapes de la stratégie A (recommandée)

<ol class="lurus-steps">
<li>

**Créer une connexion de fédération dans la console Lurus** — Rendez-vous sur `auth.lurus.cn` → Paramètres de l'entreprise → Fournisseurs d'identité → Nouveau → choisir OIDC. Renseignez, pour l'IdP de l'entreprise :

- Issuer URL
- Client ID
- Client Secret
- URL de rappel (fournie par Lurus)

</li>
<li>

**Mappage des claims** — Mappez les attributs de l'IdP d'entreprise vers les utilisateurs Lurus.

```yaml
# 将企业 IdP 的属性映射到 Lurus 用户
email:       email
display:     name
department:  department   # custom claim
```

</li>
<li>

**Bascule progressive** — Dans l'IdP d'entreprise, autorisez d'abord 5 % des employés à utiliser le bouton de connexion Lurus. Validez pendant 1 semaine → ouvrez ensuite à l'ensemble du personnel.

</li>
</ol>

## <Icon name="import" :size="20" /> Étapes de la stratégie B

<ol class="lurus-steps">
<li>

**Exporter via SCIM** — Exportez les utilisateurs depuis Keycloak au format JSON :

```bash
./kcadm.sh get users -r myrealm --fields username,email,firstName,lastName -f json > users.json
```

</li>
<li>

**Import en masse dans Lurus**

<ApiEndpoint method="POST" path="/admin/v1/scim/users:batchImport" description="批量导入用户（auth.lurus.cn）" />

```bash
curl -X POST https://auth.lurus.cn/admin/v1/scim/users:batchImport \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d @users.json
```

</li>
<li>

**Politique de mot de passe** — Par défaut, Lurus ne migre pas les mots de passe (hachages incompatibles) ; à la première connexion, le flux « mot de passe oublié » est imposé. Avec la fédération SSO, aucune migration de mot de passe n'est nécessaire.

</li>
</ol>

## <Icon name="shield-check" :size="20" /> Les atouts de la fédération SSO

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="building-2" :size="20" /></span>
    <div class="lurus-card__title">Conformité d'entreprise</div>
    <p class="lurus-card__body">Le cycle de vie des comptes reste entièrement dans l'entreprise.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="user-check" :size="20" /></span>
    <div class="lurus-card__title">Révocation immédiate au départ</div>
    <p class="lurus-card__body">Désactivation dans l'IdP d'entreprise → connexion Lurus impossible aussitôt.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="history" :size="20" /></span>
    <div class="lurus-card__title">Audit unifié</div>
    <p class="lurus-card__body">Les journaux de connexion résident dans l'IdP d'entreprise.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="shield" :size="20" /></span>
    <div class="lurus-card__title">Réutilisation du MFA</div>
    <p class="lurus-card__body">La politique MFA existante de l'entreprise reste en vigueur.</p>
  </div>
</div>

## <Icon name="life-buoy" :size="20" /> Questions fréquentes

<details class="lurus-faq-item">
<summary>Les sessions vont-elles entrer en conflit ?</summary>

Lurus utilise un cookie de session indépendant, sans impact sur le système d'origine.

</details>

<details class="lurus-faq-item">
<summary>Peut-on conserver les PAT / JWT ?</summary>

Oui, les Tokens de niveau API ne sont pas affectés par la migration SSO.

</details>

<details class="lurus-faq-item">
<summary>Comment exporter les journaux d'audit ?</summary>

Tous les événements d'identité peuvent être exportés en masse via l'endpoint ci-dessous :

<ApiEndpoint method="POST" path="/admin/v1/audit:export" description="批量导出身份事件" />

</details>

## Étapes suivantes

<NextSteps :steps="[
  { text: 'Présentation de Lurus Auth', link: '/fr/platform/auth/', primary: true },
  { text: 'OIDC / OAuth2', link: '/fr/platform/auth/oidc' },
  { text: 'Modèles de déploiement en entreprise', link: '/fr/solutions/enterprise-deploy' },
]" />

</div>
