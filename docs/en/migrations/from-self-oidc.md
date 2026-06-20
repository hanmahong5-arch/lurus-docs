---
title: "Migrate from Self-Hosted Keycloak / Auth0 to Lurus Auth"
description: "Complete path for SCIM user migration, SSO federation, and phased cutover."
---

<div class="mig-oidc-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> Migrate from Self-Hosted OIDC</span>
  <h1 class="lurus-section-head__title">Migrate from Self-Hosted OIDC to Lurus Auth</h1>
  <p class="lurus-section-head__lede">The enterprise already runs an IdP (Keycloak / Auth0 / Okta / Azure AD) and wants employees to keep signing in with their corporate accounts while outsourcing the identity layer to Lurus.</p>
</div>

## <Icon name="git-branch" :size="20" /> Two Strategies

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="building-2" :size="20" /></span>
    <div class="lurus-card__title">Strategy A: Lurus Auth as a Secondary IdP (Recommended)</div>
    <p class="lurus-card__body">You manage only the user lifecycle in your corporate IdP; Lurus products read identities through OIDC federation.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="import" :size="20" /></span>
    <div class="lurus-card__title">Strategy B: Full Relocation</div>
    <p class="lurus-card__body">Export your existing Keycloak/Auth0 to Lurus Auth (Casdoor) via SCIM and make it the single source of truth.</p>
  </div>
</div>

### Strategy A — Federation Topology

<ArchitectureDiagram title="Strategy A: Federation" chart="graph LR
  IDP[Existing Enterprise IdP] -->|OIDC Federation| LA[Lurus Auth]
  LA --> P[All Lurus Products]" />

### Strategy B — Relocation Topology

<ArchitectureDiagram title="Strategy B: Relocation" chart="graph LR
  KC[Original Keycloak/Auth0] -->|SCIM Export| LA[Lurus Auth · Casdoor]
  LA --> D[All Downstream]" />

## <Icon name="building-2" :size="20" /> Strategy A Steps (Recommended)

<ol class="lurus-steps">
<li>

**Create a federation connection in the Lurus console** — Go to `auth.lurus.cn` → Enterprise Settings → Identity Providers → New → choose OIDC. Enter your corporate IdP's:

- Issuer URL
- Client ID
- Client Secret
- Callback URL (provided by Lurus)

</li>
<li>

**Claim mapping** — Map your corporate IdP's attributes to Lurus users.

```yaml
# 将企业 IdP 的属性映射到 Lurus 用户
email:       email
display:     name
department:  department   # custom claim
```

</li>
<li>

**Phased rollout** — In your corporate IdP, first allow 5% of employees to use the Lurus sign-in button. Verify for 1 week → roll out to everyone.

</li>
</ol>

## <Icon name="import" :size="20" /> Strategy B Steps

<ol class="lurus-steps">
<li>

**Export SCIM** — Export users from Keycloak as JSON:

```bash
./kcadm.sh get users -r myrealm --fields username,email,firstName,lastName -f json > users.json
```

</li>
<li>

**Batch import into Lurus**

<ApiEndpoint method="POST" path="/admin/v1/scim/users:batchImport" description="Batch import users (auth.lurus.cn)" />

```bash
curl -X POST https://auth.lurus.cn/admin/v1/scim/users:batchImport \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d @users.json
```

</li>
<li>

**Password policy** — By default Lurus does not migrate passwords (incompatible hashes); the first login forces a "forgot password" flow. If you use SSO federation, no password migration is needed.

</li>
</ol>

## <Icon name="shield-check" :size="20" /> Benefits of SSO Federation

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="building-2" :size="20" /></span>
    <div class="lurus-card__title">Enterprise Compliance</div>
    <p class="lurus-card__body">The account lifecycle stays entirely within the enterprise.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="user-check" :size="20" /></span>
    <div class="lurus-card__title">Instant Offboarding</div>
    <p class="lurus-card__body">Deactivate in the corporate IdP → Lurus access is revoked immediately.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="history" :size="20" /></span>
    <div class="lurus-card__title">Unified Auditing</div>
    <p class="lurus-card__body">Sign-in logs live in the corporate IdP.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="shield" :size="20" /></span>
    <div class="lurus-card__title">MFA Reuse</div>
    <p class="lurus-card__body">Your existing MFA policies remain in effect.</p>
  </div>
</div>

## <Icon name="life-buoy" :size="20" /> FAQ

<details class="lurus-faq-item">
<summary>Will sessions conflict?</summary>

Lurus uses its own session cookie and does not affect your original system.

</details>

<details class="lurus-faq-item">
<summary>Can PAT / JWT be kept?</summary>

Yes — API-level tokens are unaffected by the SSO migration.

</details>

<details class="lurus-faq-item">
<summary>How do I export audit logs?</summary>

All identity events can be batch-exported through the endpoint below:

<ApiEndpoint method="POST" path="/admin/v1/audit:export" description="Batch export identity events" />

</details>

## Next Steps

<NextSteps :steps="[
  { text: 'Lurus Auth Overview', link: '/en/platform/auth/', primary: true },
  { text: 'OIDC / OAuth2', link: '/en/platform/auth/oidc' },
  { text: 'Enterprise Deployment Topologies', link: '/en/solutions/enterprise-deploy' },
]" />

</div>
