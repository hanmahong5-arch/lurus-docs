---
title: Unified Identity Authentication
description: The identity system shared across all Lurus product lines — log in once, access everything, with support for SSO, Passkeys, multi-factor authentication, API authentication, and enterprise SSO federation.
---

<div class="auth-page">

<ProductHero product-id="auth" />

**Log in once, access everything.** Lurus API, Lucrum, Switch, Creator, Lutu, Admin, Forge, and all other products share the same identity system — when a user logs into any product, the rest recognize them automatically; permissions and quotas are settled uniformly at the account level; and enterprise customers can integrate their own SSO to onboard employees.

The system is served by `auth.lurus.cn`, built and self-hosted on top of the open-source identity infrastructure [Casdoor](https://casdoor.com). It fully implements the OIDC / OAuth2 / SAML standard protocols, and user data remains entirely within Lurus’s own K8s cluster throughout.

::: tip Quick links
- User self-service: [auth.lurus.cn](https://auth.lurus.cn) — change password, manage Passkeys, bind MFA, view login history
- Organization/project management: [auth.lurus.cn](https://auth.lurus.cn) (Casdoor organization console) — member invitations, permission assignment, and audits for enterprise customers; or contact sales to enable enterprise organization management
:::

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="plug-zap" :size="14" /> Integration</span>
  <h2 class="lurus-section-head__title">Endpoints</h2>
  <p class="lurus-section-head__lede">Five standard endpoints cover discovery, authorization, token exchange, and reading user information.</p>
</div>

| Endpoint | URL | Description |
|------|-----|------|
| Console | `https://auth.lurus.cn` | User self-service for accounts, security devices, and sessions |
| OIDC Discovery | `https://auth.lurus.cn/.well-known/openid-configuration` | Automatic SDK discovery, including all endpoints and supported capabilities |
| OAuth2 Authorization | `https://auth.lurus.cn/oauth/v2/authorize` | Entry point for the standard authorization code / PKCE flow |
| Token Endpoint | `https://auth.lurus.cn/oauth/v2/token` | Exchange for access token / refresh token |
| User Info | `https://auth.lurus.cn/oidc/v1/userinfo` | Read the current user’s claims |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> Capabilities</span>
  <h2 class="lurus-section-head__title">Core Capabilities</h2>
  <p class="lurus-section-head__lede">From single sign-on to enterprise SSO federation, one system covers both individual and B2B scenarios end to end.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-auth)"
  :items="[
    { title: 'SSO Single Sign-On', body: 'Log in once to access all Lurus products without re-entering credentials. Based on standard OIDC sessions, with silent refresh across applications.', icon: 'key-round' },
    { title: 'Multi-Factor Authentication / Passkey', body: 'Supports TOTP (Authenticator App), U2F hardware keys, and Passkeys (WebAuthn passwordless login). MFA policies can be enforced at the organization or project level.', icon: 'shield' },
    { title: 'Social Login', body: 'Integrates third-party identity providers such as GitHub, Google, and WeChat; once a user binds an external account, it is linked to their Lurus account.', icon: 'users' },
    { title: 'RBAC and Organization Tiering', body: 'Role-Based Access Control. Permissions are granted to specific users or service accounts via Grants, with precision down to the project and application level.', icon: 'user-check' },
    { title: 'B2B Multi-Tenancy', body: 'Multiple Organizations can be created under an Instance, naturally supporting enterprise customer isolation; each organization can independently configure branding, login policies, and IdP federation.', icon: 'building-2' },
    { title: 'OIDC / OAuth2 / SAML', body: 'Full implementation of the three major standard protocols, compatible with mainstream SDKs and frameworks, for seamless integration with Go, Rust, TypeScript, and Flutter applications.', icon: 'link' },
    { title: 'Audit Logs', body: 'Key operations such as logins, MFA changes, permission grants, and password resets are all recorded in queryable, immutable logs to meet compliance requirements.', icon: 'history' },
    { title: 'Actions Extensions', body: 'Inject custom logic at key points in the authentication flow (such as syncing user attributes or restricting login conditions) without forking Casdoor itself.', icon: 'workflow' },
  ]"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Model</span>
  <h2 class="lurus-section-head__title">Key Concepts at a Glance</h2>
  <p class="lurus-section-head__lede">The identity system is organized into the following layers; developers and administrators need to understand how these object layers map to Lurus products.</p>
</div>

<ArchitectureDiagram
  title="Object Model Hierarchy"
  chart="graph TD; Instance[Instance · lurus-prod] --> Org[Organization · lurus.cn]; Org --> User[User · Human / Service]; Org --> Project[Project · one per product]; Project --> App[Application · client_id]; Project --> Role[Role]; User -. User Grant .-> Role"
/>

| Concept | Meaning | Mapping in Lurus |
|------|------|-----------------|
| **Instance** | Top-level deployment unit, with its own database and configuration | Lurus operates a single Instance, hosted at `auth.lurus.cn` |
| **Organization** | Tenant isolation unit, with its own user store and login policies | Individual users belong to the `lurus.cn` primary organization; enterprise customers apply for a dedicated Organization and can configure their own domain and IdP |
| **Project** | A collection of applications under an Organization, managing roles and grants uniformly | Each product line (Lurus API, Lucrum, Switch, Forge…) corresponds to one Project |
| **Application** | A specific client within a Project, holding `client_id` / `client_secret` | Each frontend, desktop, and server registers a separate Application |
| **User** | A login-capable account, either Human (a real person) or Service User (a machine) | End users are Human; backend service-to-service calls use a Service User + JWT Profile |
| **Grant** | The binding relationship that grants a Project Role to a User | Controls a user’s permission level within a specific product; the [auth.lurus.cn](https://auth.lurus.cn) (Casdoor) organization settings are authoritative |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="book-open" :size="14" /> Navigation</span>
  <h2 class="lurus-section-head__title">In This Section</h2>
  <p class="lurus-section-head__lede">From concepts to integration, dive into each layer as needed.</p>
</div>

<div class="lurus-cards lurus-cards--2">
  <a class="lurus-card lurus-card--auth" href="/en/platform/auth/concepts">
    <span class="lurus-card__icon"><Icon name="layers" :size="20" /></span>
    <div class="lurus-card__title">Core Concepts</div>
    <p class="lurus-card__body">A detailed breakdown of Instance / Organization / Project / User / Application / Grant.</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="/en/platform/auth/login">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">Login and Multi-Factor Authentication</div>
    <p class="lurus-card__body">Password login, Passkeys, social login, and MFA configuration.</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="/en/platform/auth/oidc">
    <span class="lurus-card__icon"><Icon name="link" :size="20" /></span>
    <div class="lurus-card__title">OIDC / OAuth2 Integration</div>
    <p class="lurus-card__body">Discovery, scopes, claims, the authorization code flow, and PKCE.</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="/en/platform/auth/api-auth">
    <span class="lurus-card__icon"><Icon name="key" :size="20" /></span>
    <div class="lurus-card__title">API Authentication</div>
    <p class="lurus-card__body">Personal Access Tokens, Service Users, JWT Profiles, and token verification.</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="/en/platform/auth/console">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Console Management</div>
    <p class="lurus-card__body">Day-to-day management of organizations / projects / applications / users.</p>
  </a>
</div>

---

## Working with Other Lurus Products

| Scenario | Path |
|------|------|
| You have an API Key and want to use an OAuth token to call the Lurus API | [OIDC Integration](/en/platform/auth/oidc) → [Chat Completions](/en/api/chat-completions) |
| Log in within Switch to sync Lurus account configuration | [Login and MFA](/en/platform/auth/login) → [Switch Configuration Guide](/en/switch/configuration) |
| A Forge administrator configuring team permissions | [Console Management](/en/platform/auth/console) → [Forge](/forge/) |
| A developer writing a backend service that calls the Platform internal API | [API Authentication (PAT/JWT)](/en/platform/auth/api-auth) |
| An enterprise customer wanting to log in with their own Azure AD / Feishu | [Login and MFA — Identity Brokering](/en/platform/auth/login) |

---

## Further Reading

Built on top of the open-source identity infrastructure Casdoor. For a deeper dive into the underlying mechanisms or SDK details, refer to the upstream documentation:

- [Casdoor Documentation Home](https://casdoor.com/docs) — getting started, deployment modes, and SDK integration guides
- [Core Concepts](https://casdoor.com/docs/concepts) — explanations of the principles behind Instance, Organization, Project, User, and Grant
- [API Reference](https://casdoor.com/docs/apis) — REST / gRPC endpoint documentation for the Management API, Auth API, and Admin API

<RelatedProducts product-id="auth" />

</div>

<style scoped>
.auth-page .lurus-section-head {
  margin-top: 8px;
}
</style>
