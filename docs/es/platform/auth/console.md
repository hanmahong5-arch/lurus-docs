---
title: Administración de la consola | Autenticación de identidad Casdoor
description: Manual operativo completo para administrar organizaciones, usuarios, proyectos, aplicaciones y políticas de identidad mediante la consola identity.lurus.cn.
---

<div class="console-page">

# Administración de la consola

Lurus usa [Casdoor](https://casdoor.com) como plataforma unificada de autenticación de identidad; el punto de entrada de la consola es [identity.lurus.cn](https://identity.lurus.cn). Este artículo está dirigido a **administradores de organización / operaciones de TI** y cubre el flujo completo de las operaciones cotidianas.

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Quién debería leer esto</p>
    <div class="lurus-callout__body">Quienes necesiten administrar organizaciones, usuarios, proyectos, aplicaciones y políticas de identidad: <strong>Org Owner / operaciones de TI</strong>. Los desarrolladores que solo quieran integrar el inicio de sesión deben consultar <a href="/es/platform/auth/oidc">OIDC / OAuth2</a> y <a href="/es/platform/auth/api-auth">Autenticación de API</a>.</div>
  </div>
</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--auth" href="#_2-administracion-de-organizaciones-organization">
    <span class="lurus-card__icon"><Icon name="building-2" :size="20" /></span>
    <div class="lurus-card__title">Administración de organizaciones</div>
    <p class="lurus-card__body">Crear / cambiar, verificación de dominios, roles de miembros, metadatos</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="#_3-administracion-de-usuarios-users">
    <span class="lurus-card__icon"><Icon name="users" :size="20" /></span>
    <div class="lurus-card__title">Administración de usuarios</div>
    <p class="lurus-card__body">Human / Service User, PAT, transiciones de estado, auditoría</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="#_4-administracion-de-proyectos-projects">
    <span class="lurus-card__icon"><Icon name="layers" :size="20" /></span>
    <div class="lurus-card__title">Proyectos y aplicaciones</div>
    <p class="lurus-card__body">Roles, Grant, Redirect URI, configuración de Token</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="#_7-administracion-de-politicas-policies">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">Políticas de identidad</div>
    <p class="lurus-card__body">Políticas de inicio de sesión / contraseña / bloqueo / marca / notificaciones</p>
  </a>
</div>

---

## 1. Navegación de la consola

Tras iniciar sesión accedes a la Management Console, dividida en tres zonas:

- **Breadcrumb superior**: muestra el nivel actual (**nivel Instance** global / **nivel Organization** de un solo inquilino). Haz clic en el menú desplegable del nombre de la organización para cambiar o crear una nueva (**New organization**). Las operaciones a nivel Instance requieren el permiso de Instance Manager; un Org Owner normal solo ve su propia Organization.
- **Menú lateral izquierdo**:

| Elemento del menú | Función |
|--------|------|
| **Users** | Administración de Human User / Service User |
| **Projects** | Administración de proyectos, aplicaciones y Role |
| **Actions** | Scripts personalizados desencadenados por eventos |
| **Settings** | Políticas como Login / Password Policy / Branding, etc. |
| **IDP** | Proveedores de identidad externos (Google / GitHub / SAML, etc.) |

- **Panel derecho**: al hacer clic en un recurso de la lista se despliega su panel de detalle, que permite editar campos directamente y guardarlos.

---

## 2. Administración de organizaciones (Organization)

### 2.1 Crear y cambiar de organización

**Crear**: menú desplegable superior → **New organization** → escribe el nombre → elige la identidad del administrador inicial (**Current User** establece la cuenta actual como Org Owner / **New Account** crea una cuenta de administrador independiente) → confirma.

**Cambiar**: menú desplegable del Breadcrumb superior → haz clic en el nombre de la organización destino.

**Punto de entrada de autorregistro (B2B)**: los clientes acceden a `https://identity.lurus.cn/ui/login/register/org` para registrar su organización por sí mismos.

### 2.2 Establecer la Organization predeterminada

**Organizations** del menú izquierdo (nivel Instance) → **"..."** en la fila de la organización destino → **Set as default organization** (la fila muestra la etiqueta **Default**).

> Si un usuario inicia sesión sin un contexto de organización (sin el scope `urn:casdoor:iam:org:id:{id}`), queda bajo las políticas y la configuración de marca de la Organization predeterminada.

### 2.3 Verificación de dominio

Vincula el dominio del correo corporativo a la Organization para habilitar el enrutamiento de inicio de sesión por dominio y el acceso directo de inicio de sesión único.

Organization destino → **Settings → Organization Domains → Add Domain** → escribe el dominio (por ejemplo `lurus.cn`) → elige el método de verificación (**DNS Challenge**: añade un registro TXT en el DNS, cuyo valor genera Casdoor / **HTTP Challenge**: coloca el archivo de verificación en una ruta específica de la web) → **Verify** → una vez aprobado puedes usar **Set as primary** para fijar el dominio principal.

::: warning
Tras verificar el registro TXT del DNS, **no lo elimines**: Casdoor lo revalida periódicamente; eliminarlo invalidará el estado del dominio.
:::

### 2.4 Administración de miembros (Organization Members)

**Añadir**: Organization → **Members → Add Member** → busca el usuario (email / nombre de usuario) → asigna un rol → **Save**. **Quitar**: icono de eliminar a la derecha de la fila correspondiente en la lista de Members.

| Rol | Alcance de permisos |
|------|---------|
| **Org Owner** | Todos los permisos dentro de la organización, incluida la administración de miembros |
| **Org User Manager** | Administra Human / Service User |
| **Org User Viewer** | Visualización de usuarios en solo lectura |
| **Org Project Creator** | Crea nuevos Project |
| **Org Project Permission Editor** | Administra los Project Grant y la concesión de roles |

### 2.5 Metadatos (Metadata)

Organization → **Metadata → Add Metadata** → escribe Key / Value → guarda. Cualquier par clave-valor; puede leerse mediante la API para campos de extensión de negocio.

---

## 3. Administración de usuarios (Users)

### 3.1 Human User: crear

**Users → New** → completa First/Last Name, Email (puedes marcar **Email verified** para omitir la verificación), Username (igual al Email por defecto), Phone (opcional) → elige la política de contraseña inicial (**Setup authentication later**: el usuario la define en el primer inicio de sesión / **Send an invitation E-Mail**: envía un correo de invitación / **Set an initial password**: el administrador la define directamente) → **Create**.

### 3.2 Human User: operaciones cotidianas

- **Restablecer contraseña**: detalle del usuario → **Security → Send Password Reset Email**, o **Set New Password** para definirla directamente.
- **Bloquear/desbloquear**: **Lock** / **Unlock** en la esquina superior derecha de la página de detalle (una vez bloqueado no puede iniciar sesión; las sesiones existentes pierden validez en la siguiente autenticación).
- **Enviar correo de contraseña inicial**: página de detalle → **Resend Initialization Email**.
- **Restablecer MFA**: detalle → **Security → Authenticators** → elimina el dispositivo MFA destino (TOTP / Passkey / U2F) → el usuario deberá registrarlo de nuevo en el próximo inicio de sesión.

### 3.3 Transiciones de estado del usuario

<ArchitectureDiagram title="Máquina de estados del usuario" chart="stateDiagram-v2
  [*] --> Initial: Crear
  Initial --> Active: Completar inicialización
  Active --> Locked: Lock / disparado por política
  Locked --> Active: Unlock
  Active --> Inactive: Desactivar
  Active --> Deleted: Eliminar
  Deleted --> [*]" />

::: details Versión en texto del diagrama de estados
```
[Initial] →(完成初始化)→ [Active]
[Active]  →(Lock / 策略触发)→ [Locked] →(Unlock)→ [Active]
[Active]  →(停用)→ [Inactive]    [Active]→(删除)→[Deleted]
```
:::

| Estado | Descripción |
|------|------|
| **Initial** | Creado pero sin completar el establecimiento de la contraseña inicial ni la verificación por correo |
| **Active** | Normal, puede iniciar sesión |
| **Inactive** | Desactivado por el administrador, no puede iniciar sesión |
| **Locked** | Excedió los intentos de contraseña fallidos o fue bloqueado manualmente |
| **Deleted** | Eliminado; los datos se conservan para auditoría |

### 3.4 Service User: crear y configurar

Se usa para la comunicación entre máquinas (CI/CD, llamadas de backend); no inicia sesión con contraseña.

- **Crear**: **Users → Service Users → New** → completa Username y Display Name (Description opcional) → **Create**.
- **Generar PAT**: detalle → **Personal Access Tokens → New** → fecha de expiración opcional → **cópialo de inmediato** tras crearlo (solo se muestra una vez) → la parte que llama establece la variable de entorno `Authorization: Bearer <token>`.
- **Subir la clave pública JWT (Key File)**: detalle → **Keys → Add Key** → tipo **JSON** + fecha de expiración → **Add** → descarga el archivo JSON Key (contiene la clave privada, solo una vez) → el lado servidor firma el JWT con la clave privada y lo canjea por un Access Token en el token endpoint.

### 3.5 Auditoría e historial de inicios de sesión

- **Historial de inicios de sesión**: detalle → **Login History** (hora, IP, User Agent, éxito/fallo).
- **Historial de cambios de recursos**: **Changes** al pie de la página de detalle de cualquier recurso (Which User / Timestamp / Field / Old → New Value).

---

## 4. Administración de proyectos (Projects)

### 4.1 Crear un proyecto

**Projects → Create New Project** → escribe el nombre (por ejemplo `lurus-api`, `lucrum`, `switch`) → **Continue**.

### 4.2 Configuración del proyecto (pestaña Settings)

| Opción de configuración | Descripción |
|--------|------|
| **Assert Roles on Authentication** | Inyecta los Roles en el Token y el Userinfo al iniciar sesión; se recomienda activarla |
| **Check Role Assignment on Authentication** | Exige que el usuario tenga al menos un Role Grant en ese Project; de lo contrario, deniega el inicio de sesión |
| **Check for Project on Authentication** | Verifica si la Organization del usuario ya obtuvo el Grant de ese Project |

**Política de Branding**: **Unspecified** (predeterminado del sistema) / **Enforce project’s policy** (usa la marca de la Org del proyecto durante todo el flujo) / **Allow login user policy** (marca inicial del proyecto y, una vez identificado el usuario, cambia a la marca de la propia Org del usuario).

### 4.3 Definición de roles (Project Roles)

Los roles son solo identificadores de cadena; su semántica la define el negocio. Detalle → **Roles → New Role** → completa **Key** (identificador de código, único dentro del Project, por ejemplo `admin`/`viewer`/`trader`), **Display Name** (nombre mostrado en la consola), **Group** (opcional, para agrupar la presentación) → **Save**.

### 4.4 User Grant (conceder roles a usuarios)

Detalle → **Authorizations → New** → busca el usuario destino (Human / Service) → marca el Role (selección múltiple) → **Save**.

### 4.5 Project Grant (autorización entre organizaciones, B2B)

Concede todo un Project a otra Organization, lo que le permite administrar los roles de los usuarios de la organización propia dentro de ese proyecto. Detalle → **Project Grants → New** → escribe el dominio de la Organization colaboradora para buscar y seleccionar → marca los Role permitidos (puedes limitar a un subconjunto) → **Save**.

> El administrador de la Organization autorizada verá ese proyecto bajo **Granted Projects** y podrá asignar Role a los usuarios de su propia organización.

---

## 5. Administración de aplicaciones (Applications)

### 5.1 Selección del tipo de aplicación

Detalle → **Applications → New Application** → elige el tipo:

| Tipo | Escenario aplicable | Flujo de autenticación |
|------|---------|---------|
| **Web** | Renderizado del lado servidor (Spring / PHP / Django) | Authorization Code (se recomienda PKCE) + Client Secret |
| **SPA (User Agent)** | Página única del frontend (React / Vue) | Authorization Code + PKCE (sin Client Secret) |
| **Native** | Escritorio/móvil (Electron / iOS) | Authorization Code + PKCE |
| **API** | Comunicación entre máquinas (microservicios/scripts) | Client Credentials / JWT Profile |
| **SAML** | Integración empresarial (sistemas que no admiten OIDC) | SAML 2.0, sube el Metadata XML o indica la URL |

### 5.2 Configuración de Redirect URI

- **Coincidencia exacta**, sensible a mayúsculas y minúsculas; puedes añadir varias (configura producción/preproducción/local por separado).
- Native App admite protocolos personalizados (`myapp://callback`); para IPv6 hay que escapar los corchetes `http://\[::1\]:8080/callback`.
- Configuración Web típica: `https://app.lurus.cn/auth/callback`, `https://staging.lurus.cn/auth/callback`, `http://localhost:3000/auth/callback` (requiere activar Development Mode).
- **Post-Logout Redirect URI**: dirección de redirección tras el cierre de sesión; también con coincidencia exacta y se pueden indicar varias.

### 5.3 Configuración de Token (Token Settings)

| Campo | Descripción | Valor recomendado |
|------|------|--------|
| **Token Type** | `JWT` (verificación de firma por el cliente) u `Opaque` (requiere consulta a Userinfo) | JWT |
| **Access Token Lifetime** | Vigencia del Access Token | 15 min |
| **Refresh Token Lifetime** | Vigencia máxima del Refresh Token | 7 days |
| **Refresh Token Idle Lifetime** | Expiración del Refresh Token por inactividad | 24 h |
| **ID Token Lifetime** | Vigencia del ID Token | 1 h |
| **Add User Roles to Token** | Escribe los Project Roles en los claims del Token | Según se necesite |
| **Add User Info to ID Token** | Combina la información del usuario en el ID Token (reduce las solicitudes a Userinfo) | Opcional |
| **Clock Skew** | Tolerancia permitida para la desviación del reloj del servidor | Predeterminado |

### 5.4 Development Mode

Detalle → **Redirect Settings** → marca **Development Mode**: permite Redirect URI con `http://` y coincidencia por patrón Glob (`*`, `/**`, `?`).

::: warning
Solo para desarrollo local; **prohibido activarlo en el entorno de producción**.
:::

### 5.5 Client Secret

Se genera automáticamente tras crear la aplicación Web: se muestra una vez en una ventana emergente al crearla; **cópialo de inmediato**. Para regenerarlo: detalle → **Generate New Client Secret** (el Secret anterior queda invalidado de inmediato).

---

## 6. Proveedores de identidad (Identity Providers, IdP)

### 6.1 Tipos de IdP integrados

Organization → **Settings → IDP → Add IDP**:

| Tipo | Descripción |
|------|------|
| **Google** | OAuth2, requiere el Client ID/Secret de Google Cloud Console |
| **GitHub** | OAuth2, requiere las credenciales de una GitHub OAuth App |
| **GitLab** | OAuth2, admite GitLab.com o autoalojado |
| **Microsoft** | Azure AD / Entra ID, mono/multiinquilino |
| **Apple** | Sign in with Apple, requiere una cuenta de Apple Developer |
| **Generic OIDC** | Cualquier proveedor OIDC estándar; indica la Discovery URL |
| **Generic SAML** | Cualquier IdP SAML 2.0; sube el Metadata |
| **LDAP** | AD empresarial / OpenLDAP |
| **JWT IDP** | Emisor de tokens JWT personalizado |

### 6.2 Añadir un IdP Generic OIDC (ejemplo)

**Add IDP → Generic OIDC** → completa **Name** (texto del botón en la página de inicio de sesión), **Client ID / Secret** (registrados en el IdP), **Issuer / Discovery URL** (por ejemplo `https://accounts.google.com`) → configura el mapeo de campos (**ID Attribute** normalmente `sub`; mapea First/Last Name / Email / Display Name a los claims del IdP) → define **Auto Linking** (**None**: no vincula y crea uno nuevo cada vez / **By Email**: fusiona por el mismo correo / **By Username**: fusiona por nombre de usuario) → **Save**. Una vez activado, la página de inicio de sesión muestra el botón correspondiente.

### 6.3 Habilitar el IdP en la Login Policy

**Settings → Login Behavior and Security → External IDPs** → marca el IdP recién añadido → guarda.

---

## 7. Administración de políticas (Policies)

La Organization puede sobrescribir las políticas predeterminadas del Instance (Organization → **Settings**, en cada submenú).

### 7.1 Login Policy (**Login Behavior and Security**)

| Interruptor | Descripción |
|------|------|
| **Username / Password** | Permite el inicio de sesión con nombre de usuario y contraseña |
| **Registration** | Permite el autorregistro |
| **External IDP** | Permite el inicio de sesión con IdP de terceros |
| **Hide Password Reset** | Oculta el enlace «¿Olvidaste tu contraseña?» |
| **Email / Phone as Login Name** | Permite usar el correo/número de teléfono como nombre de usuario |
| **Domain Discovery** | Enruta automáticamente a la Organization correspondiente según el dominio del correo |
| **Passkey / WebAuthn** | Habilita el inicio de sesión sin contraseña |
| **Force MFA** | Obliga a todos los usuarios a habilitar MFA |

**Duración de la sesión**: Password Check Lifetime (periodo de verificación de la contraseña) / External IDP Check Lifetime / MFA Init Skip Lifetime (periodo de gracia durante el que se puede omitir la configuración de MFA) / Second Factor Check Lifetime.

### 7.2 Password Complexity (**Password Complexity**)

Configurable: longitud mínima (Min Length), si se exigen mayúsculas/minúsculas/números/símbolos especiales.

### 7.3 Lockout (**Lockout**)

**Max Password Attempts** / **Max OTP / TOTP Attempts** (0 significa sin límite). Tras el bloqueo, el administrador debe desbloquear manualmente (detalle → **Unlock**).

### 7.4 Password Age (**Password Age**)

**Max Age in Days** (tras expirar, el inicio de sesión obliga a restablecerla) / **Expiry Warning in Days** (advertencia en la página de inicio de sesión N días antes).

### 7.5 Branding (**Branding**)

Logo/Icon (un juego para claro y otro para oscuro), Primary Color, Background Color, Warning Color, Font, **Hide Watermark** (oculta "Powered by Casdoor"), **Login Name Suffix** (si se muestra el sufijo del nombre de inicio de sesión).

### 7.6 Privacy Policy (**Privacy Policy**)

Configura las URL que se muestran en la zona de enlaces de cumplimiento de las páginas de registro/inicio de sesión: Terms of Service, Privacy Policy, Help, Support Email (admite la variable de idioma <code v-pre>{{.Lang}}</code>).

### 7.7 Domain Policy (**Domain Policy**)

| Interruptor | Descripción |
|------|------|
| **Username must contain org domain** | El nombre de usuario pasa a ser `{user}@{org}.{instance-domain}` |
| **Validate Organization Domains** | Exige superar la verificación DNS/HTTP para poder usar el dominio |
| **SMTP sender address must match domain** | El dominio del remitente de los correos de notificación debe coincidir con el dominio de la organización |
| **Email as username** | Permite usar directamente el Email como nombre de usuario de inicio de sesión |

### 7.8 Notification (**Notifications**)

Eventos que la desencadenan: reclamación de dominio, inicialización de usuario (invitación/contraseña inicial), confirmación de registro de Passkey, restablecimiento de contraseña, verificación de Email, cambio de contraseña exitoso. Los canales configuran sus credenciales mediante **Settings → SMTP** / **SMS Providers** (Twilio).

---

## 8. Actions (extensiones de código personalizado)

::: info
Las Actions ejecutan **JavaScript** (en un entorno aislado del lado servidor de Casdoor) en puntos clave de eventos como inicio de sesión, registro y creación de usuarios; el resultado de la ejecución puede determinar si el flujo continúa o se interrumpe.
:::

**Actions → New Action** del menú izquierdo → completa el nombre, elige el Flow desencadenante y el Trigger Type → escribe la función de procesamiento en JS → actívala y vincúlala al Flow.

**Usos habituales**: invocar un Webhook de negocio al registrarse un usuario para sincronizar con el CRM/almacén de datos; inyectar un Claim personalizado en el Token (`tenant_id`, `plan_tier`); validar la lista blanca de dominios de correo durante el registro.

**Tipos de Flow (habituales)**:

| Flow | Escenario de activación |
|------|---------|
| **Complement Token** | Al generar el Access/ID Token, inyecta claims adicionales |
| **Internal Authentication** | Tras una autenticación exitosa por contraseña/Passkey |
| **External Authentication** | Tras una autenticación exitosa por IdP externo |
| **Save success login** | Al registrar un inicio de sesión exitoso |
| **User Creation** | Tras completarse la creación de un nuevo usuario |

---

## 9. Auditoría y registros

- **Flujo de Events**: a nivel Instance, **Events** en la parte superior / a nivel Organization, **Events** tras entrar en ella. La línea de tiempo enumera todos los cambios (Event Type / Aggregate / Editor / marca de tiempo).
- **Historial de cambios a nivel de recurso**: **Changes** al pie de la página de detalle de cada recurso (Who / When / Field + Old → New Value).
- **Integración con SIEM**: la **Events API** (`/v2/events`) filtra por tipo de evento/hora/ID de recurso y los envía a Elasticsearch / Loki / Splunk para auditoría de cumplimiento.

---

## 10. Escenarios operativos habituales en Lurus

<p class="console-scenario-lede"><span class="lurus-tag"><Icon name="life-buoy" :size="13" /> Referencia rápida</span> Cuatro guiones operativos de alta frecuencia: despliega y sigue los pasos.</p>

<details class="lurus-faq-item">
<summary><Icon name="user-check" :size="16" /> Incorporación de un nuevo empleado</summary>

<ol class="lurus-steps">
<li><strong>Users → Human Users → New</strong>, completa el nombre y el correo de trabajo, elige <strong>Send Invitation Email</strong>.</li>
<li>Proyecto <code>lurus-api</code> → <strong>Authorizations → New</strong> → busca ese usuario → asigna el rol.</li>
<li>Repite la asignación de Grant en proyectos como <code>lucrum</code>, <code>switch</code>, etc. (según el puesto).</li>
<li>Avisa al empleado de que revise el correo de inicialización y complete el establecimiento de la contraseña y el registro de MFA.</li>
</ol>

</details>

<details class="lurus-faq-item">
<summary><Icon name="bot" :size="16" /> Cuenta de CI / máquina</summary>

<ol class="lurus-steps">
<li><strong>Users → Service Users → New</strong>; se recomienda como Username <code>ci-&lt;service-name&gt;</code>.</li>
<li>Detalle → <strong>Personal Access Tokens → New</strong>, establece la fecha de expiración y copia el Token; o <strong>Keys → Add Key</strong> para descargar el archivo JSON Key y configurar la clave privada en CI.</li>
<li>Proyecto correspondiente → <strong>Authorizations</strong>, asigna el Role necesario.</li>
</ol>

</details>

<details class="lurus-faq-item">
<summary><Icon name="lock" :size="16" /> Baja de un empleado</summary>

<ol class="lurus-steps">
<li><strong>Lock</strong> en la esquina superior derecha de la página de detalle (impide el inicio de sesión de inmediato y conserva la cuenta y la auditoría).</li>
<li>En cada Project asociado → <strong>Authorizations</strong> → localiza ese usuario → revoca todos los Grant con el icono de eliminar.</li>
<li>Si confirmas que ya no necesitas los datos de auditoría (en general no se recomienda), puedes proceder además a <strong>Delete User</strong>.</li>
</ol>

</details>

<details class="lurus-faq-item">
<summary><Icon name="building-2" :size="16" /> Incorporación de cliente empresarial (B2B)</summary>

<ol class="lurus-steps">
<li>Nivel Instance → <strong>Organizations → New Organization</strong>, usa como nombre el de la empresa cliente.</li>
<li>Añade un Org Owner (la cuenta del administrador de TI del cliente).</li>
<li>Organization → <strong>Settings → Organization Domains</strong> para verificar el dominio del cliente.</li>
<li>Si el cliente tiene su propio IdP (Azure AD): Organization → <strong>Settings → IDP</strong> para añadir un IdP SAML/OIDC.</li>
<li>Proyecto <code>lurus-api</code> → <strong>Project Grants → New</strong> → elige la Organization de ese cliente → asigna los Role permitidos.</li>
<li>El Org Owner del cliente, tras iniciar sesión, asigna roles a sus empleados bajo <strong>Granted Projects</strong>.</li>
</ol>

</details>

---

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="link" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Documentación relacionada</p>
    <div class="lurus-callout__body"><a href="/es/platform/auth/">Descripción de la autenticación y puntos de acceso</a> · <a href="/es/platform/auth/oidc">OIDC / OAuth2</a> · <a href="/es/platform/auth/api-auth">Autenticación de API</a> · <a href="https://identity.lurus.cn">Consola de autenticación ↗</a></div>
  </div>
</div>

*Basado en una instancia autoalojada de Casdoor (`identity.lurus.cn`); los detalles de la interfaz dependen de la versión real. Por favor, sincroniza este documento cuando cambien las políticas.*

</div>

<style>
.console-page .lurus-cards { margin: 1.1rem 0 1.4rem; }
.console-page .console-scenario-lede {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}
.console-page .console-scenario-lede .lurus-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.console-page .lurus-faq-item { margin: 0.6rem 0; }
.console-page .lurus-faq-item summary {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
