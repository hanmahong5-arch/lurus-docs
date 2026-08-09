---
title: Login & Multi-Factor Authentication | Casdoor Identity Authentication
description: Login methods supported by Lurus (password, Passkey, social login, enterprise SSO) and multi-factor authentication policies.
---

<div class="auth-login">

# Login & Multi-Factor Authentication

All Lurus products share the same identity authentication infrastructure (**Casdoor**, publicly at `identity.lurus.cn`). Whether you use the Lurus API, Switch, Lucrum, or Forge, login goes through a single entry point — one login covers the entire suite.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-merge" :size="14" /> Flow</span>
  <h2 class="lurus-section-head__title">1. Login Flow Overview</h2>
  <p class="lurus-section-head__lede">OIDC Authorization Code Flow + PKCE; the client stores no secrets.</p>
</div>

When a user accesses any product without a valid session, the application redirects the browser to `identity.lurus.cn`, and after verification redirects back with an authorization code.

<ArchitectureDiagram
  title="Authorization Code + PKCE Flow"
  chart="sequenceDiagram; participant B as User Browser; participant P as Lurus Product; participant A as identity.lurus.cn; B->>P: Access product page; P-->>B: 302 redirect; B->>A: GET /authorize (client_id, code_challenge, scope); A-->>B: Login page Email/Passkey/SSO; A-->>B: 302 redirect_uri?code; B->>P: Authorization code; P->>A: POST /token (code + code_verifier); A-->>P: access_token / id_token; P-->>B: Login succeeds, enter product"
/>

**PKCE**: Before sending the authorization request, the client generates a random `code_verifier` and sends its SHA-256 hash `code_challenge` along with the request; after retrieving the authorization code, it exchanges the code for a token using the original verifier, and the server issues the token only if the two match. Even if the authorization code is intercepted, it cannot be exchanged for a token.

::: info Session Lifetime
By default the Access Token lasts 12 hours, and the Refresh Token can renew silently. The exact durations are governed by organization policy and can be adjusted by an administrator in the console.
:::

---

## 2. Supported Login Methods

| Login Method | Description | Use Case |
|---------|------|---------|
| **Email + Password** | Standard registration; password meets the complexity policy | All users |
| **Phone Number + Verification Code** | SMS OTP (requires administrator to enable) | Depends on organization config |
| **Passkey (WebAuthn)** | Passwordless; device biometrics or hardware key | Recommended for mainstream users |
| **GitHub / Google / Microsoft·Azure AD / Apple** | Social login (OAuth2 / OIDC) | Depends on organization config |
| **Enterprise SSO (OIDC/SAML 2.0)** | B2B customers integrating their own IdP (Okta, Feishu, WeCom) | Enterprise customers |
| **LDAP** | Direct connection to enterprise directory services | On-premises deployment customers |

::: tip Recommended Priority
Passkey > Social login > Email & password. Passkeys require no memorized password, resist phishing, and offer the highest security.
:::

---

## 3. Passkey / WebAuthn

**How it works**: Based on **WebAuthn / FIDO2**, asymmetric cryptography replaces passwords. At registration the device generates a key pair, **the private key stays on the device** (protected by biometrics/PIN), and the public key is uploaded to `identity.lurus.cn`; at login the server issues a challenge, the device signs it with the private key, and the server verifies it with the public key. The entire process involves **zero password transmission**, so even a database breach yields only public keys.

**Registration (user steps)**:

<ol class="lurus-steps">
<li>Log in to <code>identity.lurus.cn</code>.</li>
<li>Go to <strong>Account Settings → Security → Add Passkey</strong>.</li>
<li>Name the Passkey (e.g. "MacBook Touch ID").</li>
<li>Complete biometric verification (Touch ID / Face ID / PIN / hardware key).</li>
<li>Next time, select Passkey to log in without a password.</li>
</ol>

::: tip Register Multiple Passkeys
Register one each on your primary phone and laptop to avoid being locked out if a single device is lost.
:::

**Multi-device sync**:

| Platform | Sync Method |
|------|---------|
| iOS / macOS | Apple Keychain (iCloud Keychain), across Apple devices |
| Android / Chrome OS | Google Password Manager, across Android and Chrome |
| Cross-platform | Password managers that support Passkeys, such as 1Password and Dashlane |
| Hardware key | FIDO2 tokens such as YubiKey, SoloKey (no sync needed) |

**Browser compatibility**: Chrome/Chromium 108+ (with sync), Safari 16+ (macOS Ventura / iOS 16, Apple Keychain), Edge 108+ (same as Chrome, supports Windows Hello), Firefox 119+ (supports WebAuthn, does not yet support cloud-synced Passkeys).

::: warning Enterprise Device Policies
Some enterprises disable platform biometric authentication or WebAuthn via GPO / MDM. If you encounter "cannot create Passkey," contact your IT administrator, or switch to a hardware key (YubiKey).
:::

---

## 4. Multi-Factor Authentication (MFA)

**Available second factors**:

| Factor | Description | Recommended Tools |
|------|------|---------|
| **TOTP** | Time-based one-time password (refreshes every 30 seconds) | Google Authenticator, 1Password, Authy, Microsoft Authenticator |
| **U2F / WebAuthn hardware key** | FIDO2 such as YubiKey, SoloKey, physical press | YubiKey 5 series |
| **WebAuthn platform authenticator** | Device-built-in biometrics (Face ID, Windows Hello, fingerprint) | Built-in |
| **Email OTP / SMS OTP** | Verification code sent to email / bound phone number (SMS requires administrator to enable) | Inbox / phone SMS |

::: tip TOTP Best Practices
Use a TOTP app that supports cloud backup (1Password, Authy) to avoid losing access if your phone is lost. Older versions of Google Authenticator do not support migration — be sure to export before migrating.
:::

**MFA policies** (console **Security Policy**): **Not enforced** (users bind voluntarily) / **Enforced (all users)** (must register at least one second factor after first login) / **Enforced for local users only** (external IdP/SSO logins are exempt; local accounts must bind). Common enforcement scenarios: high-privilege accounts (administrators, finance) are always enforced; B2B customer organizations are configured separately by the customer’s administrator; risky logins (off-site IP / new device) can trigger Step-up Auth.

**Recovery codes**: After binding MFA, a set of one-time recovery codes is generated (**Account Settings → Security → Recovery Codes**). Print them or store them in a password manager (**do not screenshot to a cloud photo album**). When you lose your MFA device, log in with any recovery code and immediately re-bind MFA. Each code becomes invalid after use; once they are all used, regenerate a new set immediately.

---

## 5. Password Policy

The following is the default baseline of the Casdoor instance; administrators can adjust it in the console, and the actual requirements are shown in real time during registration / password change.

**Complexity** (defaults): minimum length 8 characters; at least 1 each of uppercase, lowercase, digit, and special character (`!@#$%^&*`, etc.).

**Expiration and history**: maximum validity (0 = never expires); expiration warning (N days in advance; the current version sends no email and only shows a page prompt at login); password history check (prevents reusing the last N passwords).

**Login failure lockout (Lockout)**: maximum password failures / maximum OTP failures (set 0 to disable the corresponding lockout). After lockout, an **administrator must manually unlock in the console** — it does not unlock automatically.

::: warning Handling Account Lockout
If you are locked out due to repeatedly entering the wrong password or OTP, contact your organization administrator or email **support@lurus.cn** (providing your account email); unlocking is processed during business hours.
:::

---

## 6. Identity Brokering

Casdoor acts as an intermediary IdP, integrating one or more **upstream external IdPs** (enterprise Azure AD/Okta, or social GitHub/Google). The user clicks "Sign in with XXX" → is redirected to the upstream IdP for verification → Casdoor receives the result → issues a unified Lurus token.

<ArchitectureDiagram
  title="Identity Brokering Path"
  chart="graph LR; P[Lurus Product] --> Z[identity.lurus.cn · Casdoor]; Z --> U[Upstream IdP · Azure AD / Okta / GitHub …]; U -. User identity assertion OIDC/SAML .-> Z; Z -. Issue Lurus access_token / id_token .-> P"
/>

**When to use**: enterprise B2B SSO (employees log in directly with their own Azure AD/Okta, no registration needed); automatic domain routing (after entering an enterprise email, route to the corresponding IdP by domain — Domain Discovery); account linking (link an existing Lurus account to GitHub/Google); Just-in-Time creation (first external IdP login automatically creates an account and assigns the default role).

**Configuration steps (administrator)**: console → **Instance Settings / Organization Settings → Identity Providers → Add** → select a template (EntraID / Okta / GitHub / Google / generic SAML, etc.) → fill in the upstream Client ID/Secret (OIDC) or EntityID/Metadata URL (SAML) → enable in **Login Policy** and set whether automatic account creation is allowed → test the login and confirm role/permission mapping.

::: info Supported Protocols
**OIDC**: Google, GitHub, Feishu, WeCom, Okta, etc. **SAML 2.0**: Azure AD (EntraID), ADFS, enterprise-grade SSO. **LDAP**: internal enterprise Active Directory or OpenLDAP.
:::

---

## 7. Login Interface Customization (Branding)

Customize at the **instance** or **organization** level: logo (light/dark, SVG/PNG), theme color, font, background, custom domain (`auth.yourcompany.com`, requires DNS). Lurus uses the main site’s unified color scheme by default. B2B customers can configure under **Organization Settings → Appearance** without affecting other organizations.

::: tip Custom Domains and Passkeys
Configuring a custom login domain (`auth.client.com`) for a B2B organization **must be completed before the first Passkey is registered**. A Passkey is bound to the domain (RP ID) at registration, and changing it afterward invalidates existing Passkeys.
:::

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> Troubleshooting</span>
  <h2 class="lurus-section-head__title">8. FAQ & Troubleshooting</h2>
  <p class="lurus-section-head__lede">Causes and handling steps for four common login / permission issues.</p>
</div>

<details class="lurus-faq-item">
<summary>Cross-subdomain cookie invalid — still prompted to re-login on other subdomains after logging in?</summary>

After logging in at `app.lurus.cn`, accessing `docs.lurus.cn` still prompts a re-login. **Cause**: the OIDC session cookie’s `Domain` is incorrect, or CORS restricts cross-subdomain access. **Troubleshooting**: confirm all subdomains share the same top-level domain and the cookie is set to `Domain=.lurus.cn`; embedding the login page in an iframe requires `SameSite=None; Secure` and HTTPS.

</details>

<details class="lurus-faq-item">
<summary>Lost MFA-bound device — TOTP cannot generate a verification code?</summary>

Steps: ① On the MFA verification screen, click **Log in with recovery code** ② Enter any recovery code ③ After logging in, immediately go to **Account Settings → Security** to unbind the old MFA and bind a new device ④ If you also lost the recovery codes, contact your organization administrator to force-reset MFA.

</details>

<details class="lurus-faq-item">
<summary>No resources visible after enterprise SSO login — SSO succeeds but there are no permissions or resources are empty?</summary>

**Cause**: ① User Grant not configured (the user has not been granted access to the corresponding Project) ② Project Role missing (granted but no `viewer`/`editor` assigned) ③ JIT-created account not added to a group. **Troubleshooting**: console → **Users** → the account → **Grants** tab, confirm the project and role.

</details>

<details class="lurus-faq-item">
<summary>Passkey unusable on company computer — prompts "cannot create credential"?</summary>

**Cause**: enterprise MDM/GPO disables the platform authenticator or WebAuthn. **Solution**: contact IT to lift the restriction / use a cross-platform hardware key such as YubiKey / fall back to TOTP + password.

</details>

---

## Related Documentation

<NextSteps
  title="Next Steps"
  :steps="[
    { text: 'OIDC / OAuth2 Integration', link: '/en/platform/auth/oidc', primary: true },
    { text: 'API Authentication (PAT / JWT)', link: '/en/platform/auth/api-auth' },
    { text: 'Authentication Console', link: 'https://identity.lurus.cn', external: true },
  ]"
/>

- [Billing & Subscriptions](../billing.md) · [Platform FAQ](../faq.md) · [Lurus API Integration Guide](/en/api/overview) · [Casdoor Official Documentation](https://casdoor.com/docs) (English)

</div>

<style scoped>
.auth-login .lurus-section-head { margin-top: 8px; }
</style>
