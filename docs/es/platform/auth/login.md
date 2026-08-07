---
title: Inicio de sesión y autenticación multifactor | Autenticación de identidad Casdoor
description: Métodos de inicio de sesión compatibles con Lurus (contraseña, Passkey, inicio de sesión social, SSO empresarial) y políticas de autenticación multifactor.
---

<div class="auth-login">

# Inicio de sesión y autenticación multifactor

Todos los productos de Lurus comparten la misma infraestructura de autenticación de identidad (**Casdoor**, accesible públicamente en `auth.lurus.cn`). Tanto si usas Lurus API, Switch, Lucrum o Forge, el inicio de sesión pasa por el mismo punto de entrada: una sola autenticación da acceso a toda la plataforma.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-merge" :size="14" /> Flujo</span>
  <h2 class="lurus-section-head__title">1. Resumen del flujo de inicio de sesión</h2>
  <p class="lurus-section-head__lede">OIDC Authorization Code Flow + PKCE; el cliente no almacena ninguna clave.</p>
</div>

Cuando un usuario accede a cualquier producto sin una sesión válida, la aplicación redirige el navegador a `auth.lurus.cn`; tras la verificación, regresa con el código de autorización.

<ArchitectureDiagram
  title="Flujo Authorization Code + PKCE"
  chart="sequenceDiagram; participant B as Navegador del usuario; participant P as Producto Lurus; participant A as auth.lurus.cn; B->>P: Acceder a la página del producto; P-->>B: 302 redirección; B->>A: GET /authorize (client_id, code_challenge, scope); A-->>B: Página de inicio de sesión Correo/Passkey/SSO; A-->>B: 302 redirect_uri?code; B->>P: Código de autorización; P->>A: POST /token (code + code_verifier); A-->>P: access_token / id_token; P-->>B: Inicio de sesión correcto, entrar al producto"
/>

**PKCE**: antes de enviar la solicitud de autorización, el cliente genera un `code_verifier` aleatorio y envía con la solicitud su hash SHA-256 `code_challenge`; tras recibir el código de autorización, lo canjea por un token con el verifier original, y el servidor solo emite el token si ambos coinciden. Aunque se intercepte el código de autorización, no podrá canjearse por un token.

::: info Vigencia de la sesión
Por defecto, el Access Token dura 12 horas y el Refresh Token permite la renovación silenciosa. La duración concreta la determina la política de la organización, y el administrador puede ajustarla en la consola.
:::

---

## 2. Métodos de inicio de sesión compatibles

| Método de inicio de sesión | Descripción | Caso de uso |
|---------|------|---------|
| **Correo + contraseña** | Registro estándar; la contraseña cumple la política de complejidad | Todos los usuarios |
| **Número de teléfono + código** | OTP por SMS (requiere habilitación del administrador) | Según la configuración de la organización |
| **Passkey (WebAuthn)** | Sin contraseña, mediante biometría del dispositivo o clave de hardware | Recomendado para usuarios generales |
| **GitHub / Google / Microsoft·Azure AD / Apple** | Inicio de sesión social (OAuth2 / OIDC) | Según la configuración de la organización |
| **SSO empresarial (OIDC/SAML 2.0)** | Clientes B2B que integran su propio IdP (Okta, Feishu, WeChat Work) | Clientes empresariales |
| **LDAP** | Conexión directa al servicio de directorio empresarial | Clientes con despliegue privado |

::: tip Prioridad recomendada
Passkey > inicio de sesión social > correo y contraseña. Passkey no requiere recordar contraseñas, resiste el phishing y ofrece la mayor seguridad.
:::

---

## 3. Passkey / WebAuthn

**Principio**: se basa en **WebAuthn / FIDO2**, sustituyendo la contraseña por criptografía asimétrica. Durante el registro, el dispositivo genera un par de claves; la **clave privada permanece en el dispositivo** (protegida por biometría/PIN) y la clave pública se sube a `auth.lurus.cn`. Al iniciar sesión, el servidor envía un desafío, el dispositivo lo firma con la clave privada y el servidor lo verifica con la clave pública. En todo el proceso **no se transmite ninguna contraseña**, y una filtración de la base de datos solo expone claves públicas.

**Registro (acción del usuario)**:

<ol class="lurus-steps">
<li>Inicia sesión en <code>auth.lurus.cn</code>.</li>
<li>Ve a <strong>Configuración de la cuenta → Seguridad → Añadir Passkey</strong>.</li>
<li>Asigna un nombre a la Passkey (por ejemplo, "MacBook Touch ID").</li>
<li>Completa la identificación biométrica (Touch ID / Face ID / PIN / clave de hardware).</li>
<li>En el próximo inicio de sesión, elige Passkey para entrar sin contraseña.</li>
</ol>

::: tip Recomendamos registrar varias Passkeys
Registra una en tu teléfono principal y otra en tu portátil para no quedarte sin acceso si pierdes un dispositivo.
:::

**Sincronización multidispositivo**:

| Plataforma | Método de sincronización |
|------|---------|
| iOS / macOS | Apple Keychain (iCloud Keychain), entre dispositivos Apple |
| Android / Chrome OS | Google Password Manager, entre Android y Chrome |
| Multiplataforma | Gestores de contraseñas compatibles con Passkey como 1Password o Dashlane |
| Clave de hardware | Tokens FIDO2 como YubiKey o SoloKey (sin necesidad de sincronización) |

**Compatibilidad con navegadores**: Chrome/Chromium 108+ (con sincronización), Safari 16+ (macOS Ventura / iOS 16, Apple Keychain), Edge 108+ (igual que Chrome, compatible con Windows Hello), Firefox 119+ (compatible con WebAuthn, aún sin sincronización en la nube de Passkeys).

::: warning Política de dispositivos empresariales
Algunas empresas deshabilitan la autenticación biométrica de plataforma o WebAuthn mediante GPO / MDM. Si aparece "no se puede crear la Passkey", contacta con el administrador de TI o usa una clave de hardware (YubiKey).
:::

---

## 4. Autenticación multifactor (MFA)

**Segundos factores disponibles**:

| Factor | Descripción | Herramienta recomendada |
|------|------|---------|
| **TOTP** | Contraseña de un solo uso basada en tiempo (se renueva cada 30 segundos) | Google Authenticator, 1Password, Authy, Microsoft Authenticator |
| **Clave de hardware U2F / WebAuthn** | FIDO2 como YubiKey o SoloKey, con pulsación física | Serie YubiKey 5 |
| **Autenticador de plataforma WebAuthn** | Biometría integrada en el dispositivo (Face ID, Windows Hello, huella dactilar) | Integrado |
| **Email OTP / SMS OTP** | Código enviado al correo / al teléfono vinculado (el SMS requiere habilitación del administrador) | Bandeja de entrada / SMS del teléfono |

::: tip Buenas prácticas de TOTP
Usa una app de TOTP con copia de seguridad en la nube (1Password, Authy) para no perder el acceso si pierdes el teléfono. Las versiones antiguas de Google Authenticator no admiten migración, así que exporta antes de migrar.
:::

**Políticas de MFA** (consola, **Política de seguridad**): **No obligatorio** (el usuario lo vincula a su criterio) / **Obligatorio (todos los usuarios)** (tras el primer inicio de sesión hay que registrar al menos un segundo factor) / **Obligatorio solo para usuarios locales** (los inicios de sesión por IdP/SSO externo están exentos; las cuentas locales deben vincularlo). Escenarios habituales de obligatoriedad: las cuentas de alto privilegio (administradores, finanzas) siempre son obligatorias; en organizaciones de clientes B2B lo configura por separado el administrador del cliente; los inicios de sesión de riesgo (IP de otra ubicación / dispositivo nuevo) pueden activar la verificación escalonada (Step-up Auth).

**Códigos de recuperación**: al vincular MFA se genera un conjunto de códigos de recuperación de un solo uso (**Configuración de la cuenta → Seguridad → Códigos de recuperación**). Imprímelos o guárdalos en un gestor de contraseñas (**no hagas una captura de pantalla guardada en el álbum de la nube**). Si pierdes el dispositivo MFA, inicia sesión con cualquier código de recuperación y vuelve a vincular MFA de inmediato. Cada código deja de ser válido tras usarse; cuando los agotes, genera un nuevo conjunto enseguida.

---

## 5. Política de contraseñas (Password Policy)

A continuación se muestra la referencia predeterminada de la instancia de Casdoor, que el administrador puede ajustar en la consola; los requisitos reales se indican en tiempo real al registrarse o cambiar la contraseña.

**Complejidad** (valores predeterminados): longitud mínima de 8 caracteres; al menos 1 mayúscula, 1 minúscula, 1 dígito y 1 carácter especial (`!@#$%^&*`, etc.).

**Caducidad e historial**: vigencia máxima (0 = nunca caduca); aviso previo a la caducidad (N días antes; la versión actual no envía correo, solo muestra un aviso en la página al iniciar sesión); comprobación del historial de contraseñas (impide reutilizar las últimas N).

**Bloqueo por fallos de inicio de sesión (Lockout)**: número máximo de fallos de contraseña / número máximo de fallos de OTP (establecer 0 deshabilita el bloqueo correspondiente). Tras el bloqueo, **el administrador debe desbloquear manualmente en la consola**; no se desbloquea automáticamente.

::: warning Gestión del bloqueo de cuenta
Si la cuenta se bloquea por errores consecutivos de contraseña u OTP, contacta con el administrador de tu organización o escribe a **support@lurus.cn** (indicando el correo de la cuenta); el desbloqueo se gestiona en horario laboral.
:::

---

## 6. Intermediación de identidad / Identity Brokering

Casdoor actúa como IdP intermediario y se integra con uno o varios **IdP externos upstream** (Azure AD/Okta empresariales, o sociales como GitHub/Google). El usuario pulsa "Iniciar sesión con XXX" → salta al IdP upstream para verificarse → Casdoor recibe el resultado → emite el token unificado de Lurus.

<ArchitectureDiagram
  title="Cadena de Identity Brokering"
  chart="graph LR; P[Producto Lurus] --> Z[auth.lurus.cn · Casdoor]; Z --> U[IdP upstream · Azure AD / Okta / GitHub …]; U -. Aserción de identidad del usuario OIDC/SAML .-> Z; Z -. Emite access_token / id_token de Lurus .-> P"
/>

**Cuándo usarlo**: SSO B2B para clientes empresariales (los empleados inician sesión directamente con su propio Azure AD/Okta, sin registrarse); enrutamiento automático por dominio (tras introducir el correo corporativo, salta al IdP correspondiente según el dominio, Domain Discovery); vinculación de cuentas (asociar una cuenta de Lurus existente a GitHub/Google); creación Just-in-Time (el primer inicio de sesión por IdP externo crea automáticamente la cuenta y le asigna el rol predeterminado).

**Pasos de configuración (administrador)**: consola → **Configuración de la instancia / Configuración de la organización → Proveedores de identidad → Añadir** → elegir plantilla (EntraID / Okta / GitHub / Google / SAML genérico, etc.) → introducir el Client ID/Secret upstream (OIDC) o EntityID/Metadata URL (SAML) → en **Política de inicio de sesión**, habilitarlo y definir si se permite la creación automática de cuentas → probar el inicio de sesión y confirmar la asignación de roles/permisos.

::: info Protocolos compatibles
**OIDC**: Google, GitHub, Feishu, WeChat Work, Okta, etc. **SAML 2.0**: Azure AD (EntraID), ADFS, SSO de nivel empresarial. **LDAP**: Active Directory interno de la empresa u OpenLDAP.
:::

---

## 7. Personalización de la interfaz de inicio de sesión (Branding)

Personalizable a nivel de **instancia** o de **organización**: logotipo (claro/oscuro, SVG/PNG), color del tema, fuente, fondo y dominio personalizado (`auth.yourcompany.com`, requiere DNS). Lurus usa por defecto la combinación de colores unificada del sitio principal. Los clientes B2B pueden configurarlo en **Configuración de la organización → Apariencia**, sin afectar a otras organizaciones.

::: tip Dominio personalizado y Passkey
Configurar un dominio de inicio de sesión personalizado (`auth.client.com`) para una organización B2B **debe completarse antes de registrar la primera Passkey**. La Passkey se vincula al dominio del momento del registro (RP ID); cambiarlo después invalidará las Passkeys existentes.
:::

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> Solución de problemas</span>
  <h2 class="lurus-section-head__title">8. Preguntas frecuentes y solución de problemas</h2>
  <p class="lurus-section-head__lede">Causas y pasos de resolución de cuatro tipos frecuentes de problemas de inicio de sesión / permisos.</p>
</div>

<details class="lurus-faq-item">
<summary>Cookie inválida entre subdominios — ¿se solicita un nuevo inicio de sesión al acceder a otros subdominios?</summary>

Tras iniciar sesión en `app.lurus.cn`, al acceder a `docs.lurus.cn` se pide iniciar sesión de nuevo. **Causa**: el `Domain` de la cookie de sesión OIDC es incorrecto o hay restricciones CORS entre subdominios. **Resolución**: confirma que todos los subdominios comparten el mismo dominio de nivel superior y establece la cookie con `Domain=.lurus.cn`; para incrustar la página de inicio de sesión en un iframe se requiere `SameSite=None; Secure` y HTTPS.

</details>

<details class="lurus-faq-item">
<summary>Pérdida del dispositivo vinculado a MFA — ¿TOTP no puede generar el código?</summary>

Pasos a seguir: ① En la pantalla de verificación de MFA, pulsa **Iniciar sesión con código de recuperación** ② Introduce cualquier código de recuperación ③ Tras iniciar sesión, ve de inmediato a **Configuración de la cuenta → Seguridad** para desvincular el MFA antiguo y vincular el nuevo dispositivo ④ Si también pierdes los códigos de recuperación, contacta con el administrador de la organización para forzar el restablecimiento del MFA.

</details>

<details class="lurus-faq-item">
<summary>No se ven recursos tras el inicio de sesión por SSO empresarial — ¿el SSO funciona pero no hay permisos o los recursos están vacíos?</summary>

**Causa**: ① No se ha configurado el User Grant (el usuario no está autorizado en el Project correspondiente) ② Falta el Project Role (autorizado pero sin asignar `viewer`/`editor`) ③ La cuenta creada por JIT no se ha añadido al grupo. **Resolución**: consola → **Usuarios** → la cuenta en cuestión → pestaña **Autorizaciones (Grants)**, confirma el proyecto y el rol.

</details>

<details class="lurus-faq-item">
<summary>La Passkey no funciona en el ordenador de la empresa — ¿aparece "no se puede crear la credencial"?</summary>

**Causa**: el MDM/GPO de la empresa deshabilita el autenticador de plataforma o WebAuthn. **Solución**: contacta con TI para levantar la restricción / usa una clave de hardware multiplataforma como YubiKey / recurre a TOTP + contraseña.

</details>

---

## Documentos relacionados

<NextSteps
  title="Próximos pasos"
  :steps="[
    { text: 'Integración OIDC / OAuth2', link: '/es/platform/auth/oidc', primary: true },
    { text: 'Autenticación de API (PAT / JWT)', link: '/es/platform/auth/api-auth' },
    { text: 'Consola de autenticación', link: 'https://auth.lurus.cn', external: true },
  ]"
/>

- [Facturación y suscripción](../billing.md) · [Preguntas frecuentes de la plataforma](../faq.md) · [Guía de integración de Lurus API](/es/api/overview) · [Documentación oficial de Casdoor](https://casdoor.com/docs) (en inglés)

</div>

<style scoped>
.auth-login .lurus-section-head { margin-top: 8px; }
</style>
