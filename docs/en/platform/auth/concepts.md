---
title: Core Concepts | Zitadel Identity Authentication
description: A detailed walkthrough of the Zitadel object model — Instance / Organization / Project / Application / User / Grant / Administrator — explained alongside the actual Lurus deployment.
---

<div class="auth-concepts">

# Core Concepts

Lurus uses [Zitadel](https://zitadel.com) as its unified OIDC identity provider (IdP), with the public entry point `auth.lurus.cn`. This page lays out the object model hierarchy.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Model</span>
  <h2 class="lurus-section-head__title">Object Model at a Glance</h2>
  <p class="lurus-section-head__lede">Six object types, one-directional containment — understand this diagram, and every section that follows is just its expansion.</p>
</div>

<ArchitectureDiagram
  title="Zitadel Object Model Hierarchy"
  chart="graph TD; Instance[Instance · lurus-prod] --> Org[Organization · lurus.cn]; Org --> User[User · Employee / Customer / Service Account]; Org --> Project[Project · lurus-api / lucrum / switch …]; Org --> OrgGrant[Grant · Grant a Project to another Org]; Project --> App[Application · Web / SPA / Native / API / SAML]; Project --> Role[Role · e.g. lucrum:admin]; User -. User Grant .-> Role"
/>

The containment relationship is **strictly one-directional**: Instance ⊃ Organization ⊃ Project ⊃ (Application, Role). A User belongs to an Organization and is bound to a Project Role through a User Grant.

---

## Instance

The **highest abstraction** in the data hierarchy, equivalent to an independent identity issuer. The `iss` of every token points to this Instance’s domain.

| Attribute | Description |
|------|------|
| Role | A container for system-level default configuration (Branding, Login/Password Policy, etc.) |
| Multi-tenancy | One instance hosts multiple Organizations, achieving tenant isolation |
| Administrator | Instance administrators span all Organizations and hold the highest privileges |
| Virtual instances | Multiple virtual instances can be created via the System API, suitable for SaaS multi-tenant distribution |

::: tip In the Lurus context
The production environment has only one instance, **`lurus-prod`** (`auth.lurus.cn`). Virtual instances are not needed; all product lines share the same issuer.
:::

---

## Organization

The **tenant unit**, similar to an OU in a directory service. An Instance can contain multiple Organizations, with user data isolated from one another. Its holdings: User & Service Account (a dedicated user pool), Project (product grouping plus applications and roles), Domain (one or more, including one primary domain), Policy (can override the instance default security policies). It supports **delegated permissions**: granting management rights over its own Project to another Organization, enabling B2B self-service IAM.

::: tip In the Lurus context
The current primary organization is **`lurus.cn`**, which hosts internal employee accounts and the various product Projects. When onboarding enterprise customers, a separate auxiliary Organization can be created for each enterprise, opening up specific product permissions through Project Grants.
:::

---

## Project

A **logical product grouping**, where each Project corresponds to a software product or service boundary. All Applications under the same Project share the same Role definitions. Composition: Application (login client), Role (role strings such as `admin`/`viewer`), User Grant (assign roles to a User), Granted Organization (grant the entire Project to another Org). Project-level settings include: whether logins are required to carry role claims (`urn:zitadel:iam:org:project:roles`), whether external IdP login is allowed, and so on.

::: tip In the Lurus context
Each product line corresponds to a dedicated Project; for naming, see the `lurus.yaml` `capabilities:` registry. Role conventions are defined by each product team.
:::

---

## Application

A **specific login client**, the program entity that actually initiates authentication requests. Each has its own `client_id`, plus a `client_secret` or PKCE configuration depending on the authentication method.

| Type | Typical Scenario | Authentication Method |
|------|---------|---------|
| **Web** | Server-side rendering (Spring, Phoenix, Django) | Authorization Code + PKCE or Client Secret |
| **SPA** | Pure front-end single-page (React, Vue) | Authorization Code + **PKCE** (required) |
| **Native** | Desktop/mobile (Switch, Lutu APP) | Authorization Code + PKCE + Custom Scheme |
| **API** | Pure back-end / M2M | Client Credentials (JWT or Basic Auth) / Private Key JWT |
| **SAML** | Enterprise applications compatible with SAML 2.0 | SAML 2.0 assertion |

::: warning About PKCE
Applications that involve user interaction (Web/SPA/Native) use **PKCE** by default. Using the Implicit Flow in front-end applications is prohibited.
:::

**Key configuration**: `client_id` (all types, identifies the application); `client_secret` (only for server-side applications that can securely store secrets; SPA/Native use PKCE instead); Redirect URI (strictly validated for an exact match, which can be relaxed in development mode); development mode (allows non-HTTPS and wildcard URIs, for local development only, must be disabled in production).

---

## User

Divided into the **Human User** for real people and the **Machine User** for automated systems.

- **Human User**: supports Password, MFA (TOTP/SMS), Passkey (FIDO2/WebAuthn), and external IdPs (Google/GitHub, etc.). Fields include login name, name, email, phone, language preference, and custom Metadata (key-value pairs).
- **Machine User / Service Account**: back-end services, CI/CD, scheduled tasks. Authentication methods are **PAT** (a long-lived bearer token, simple) or **JWT Profile** (a privately signed JWT exchanged for a token, more secure).

**User states**: `active` (can log in) / `inactive` (disabled) / `locked` (locked after exceeding the failure limit) / `deleted` (soft-deleted, retained for auditing).

::: tip Important constraint
Each User belongs strictly to **exactly one Organization**. Cross-organization access goes through the Organization Grant mechanism; accounts cannot be shared directly across organizations.
:::

---

## Grant and Role

Based on RBAC, with Project Role, User Grant, and Project Grant at its core.

- **Project Role**: a role string within a Project, with three fields — Key (code identifier, such as `admin`), Display Name (shown in the console, such as "Administrator"), and Group (optional grouping, such as `management`). Shared by all Applications under the same Project.
- **User Grant** = `User + Project + Role[]`: after login, the access token’s `urn:zitadel:iam:org:project:roles` claim carries all roles the user has been granted in the target Project. The back-end parses this claim for authorization, with no need to make additional API calls.
- **Project Grant** = `Project (source Org) → Organization (target Org)`: grants management rights over the entire Project to another Organization. The core of B2B multi-tenancy: Lurus does not need to create accounts for customer employees; instead, customers self-manage users and permissions within their own Organization.

---

## Administrator

Four levels, following least privilege:

| Level | Scope | Typical Roles |
|------|--------|---------|
| **IAM / Instance** | The entire instance (across all Organizations) | `IAM_OWNER` |
| **Organization** | All resources within a single organization | `ORG_OWNER`, `ORG_USER_MANAGER` |
| **Project** | Applications, roles, and grants within a single Project | `PROJECT_OWNER` |
| **Project Grant** | User role management for a granted Project | `PROJECT_GRANT_OWNER` |

**Common role strings**: `IAM_OWNER` (the highest at the instance level, manages all organizations/policies/virtual instances), `ORG_OWNER` (manages users/Projects/domains/policies within an organization), `ORG_USER_MANAGER` (manages only users and role assignments, does not change Project structure), `ORG_USER_PERMISSION_EDITOR` (edits only User Grants), `PROJECT_OWNER` (manages Application/Role/Grant within a Project), `PROJECT_GRANT_OWNER` (manages this organization’s user roles within a granted Project).

::: warning Cross-organization visibility
Only `IAM_OWNER` can view and manage across Organizations. `ORG_OWNER` is strictly limited to its own organization and cannot access data from other organizations.
:::

---

## Policy

The Instance layer defines defaults, and the Organization layer overrides them as needed.

| Policy Type | Description |
|---------|------|
| **Login Policy** | Which authentication methods are allowed (Password/Passkey/external IdP/registration toggle) |
| **Password Policy** | Password complexity, minimum length, whether to forbid historical passwords |
| **Lockout Policy** | The login failure count threshold and lockout duration |
| **MFA Policy** | Whether MFA is enforced and which methods are allowed |
| **Privacy Policy** | Privacy statement URL, ToS URL |
| **Branding** | Login page logo, color scheme, custom CSS (can be customized independently at the Organization level) |

The specific policies for the primary organization `lurus.cn` are managed by platform operations in the Zitadel Console and are not hardcoded here.

---

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Aligned with the Actual Lurus Deployment</p>
    <div class="lurus-callout__body"><ul><li><strong>Project naming</strong>: each product corresponds to one Project (<code>lurus-api</code>, <code>lucrum</code>, <code>switch</code>, <code>lutu</code>, <code>admin</code>, <code>forge</code>); the Zitadel Console is authoritative.</li><li><strong>Role conventions</strong>: role strings are defined by the service-level CLAUDE.md or the <code>lurus.yaml</code> <code>capabilities:</code> registry, not hardcoded here.</li><li><strong>Machine User scenario</strong>: M2M calls uniformly use a Machine User + JWT Profile, avoiding shared human accounts.</li><li><strong>PAT scenario</strong>: CI/CD and scripts can use a PAT, which must be given the shortest possible validity period and rotated regularly.</li><li><strong>Full configuration reference</strong>: the <code>lurus.yaml</code> <code>capabilities:</code> section is the single entry point for architecture changes.</li></ul></div>
  </div>
</div>

</div>

<style scoped>
.auth-concepts .lurus-section-head { margin-top: 8px; }
</style>
