---
title: Conceptos clave | Autenticación de identidad con Casdoor
description: Explicación detallada del modelo de objetos de Casdoor (Instance / Organization / Project / Application / User / Grant / Administrator), con notas sobre el despliegue real de Lurus.
---

<div class="auth-concepts">

# Conceptos clave

Lurus usa [Casdoor](https://casdoor.com) como proveedor de identidad (IdP) OIDC unificado, con punto de entrada público `auth.lurus.cn`. Esta página describe la jerarquía del modelo de objetos.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Modelo</span>
  <h2 class="lurus-section-head__title">Vista general del modelo de objetos</h2>
  <p class="lurus-section-head__lede">Seis tipos de objetos, contención unidireccional: entiende este diagrama y cada sección posterior será solo su desarrollo.</p>
</div>

<ArchitectureDiagram
  title="Jerarquía del modelo de objetos de Casdoor"
  chart="graph TD; Instance[Instance · lurus-prod] --> Org[Organization · lurus.cn]; Org --> User[User · empleado / cliente / Service Account]; Org --> Project[Project · lurus-api / lucrum / switch …]; Org --> OrgGrant[Grant · otorgar Project a otra Org]; Project --> App[Application · Web / SPA / Native / API / SAML]; Project --> Role[Role · p. ej. lucrum:admin]; User -. User Grant .-> Role"
/>

La relación de contención es **estrictamente unidireccional**: Instance ⊃ Organization ⊃ Project ⊃ (Application, Role). El User pertenece a una Organization y se vincula a un Project Role mediante un User Grant.

---

## Instance (instancia)

La **abstracción de máximo nivel** en la jerarquía de datos, equivalente a un emisor de identidad (issuer) independiente. El `iss` de todos los tokens apunta al dominio de esta Instance.

| Atributo | Descripción |
|------|------|
| Función | Contenedor de configuración por defecto a nivel de sistema (Branding, Login/Password Policy, etc.) |
| Multiinquilino | Una instancia alberga varias Organization, logrando el aislamiento de inquilinos |
| Administrador | El administrador de la Instance abarca todas las Organization y tiene los permisos más altos |
| Instancia virtual | Mediante la System API se pueden crear varias instancias virtuales, idóneo para la distribución multiinquilino SaaS |

::: tip Contexto de Lurus
En el entorno de producción solo existe una instancia, **`lurus-prod`** (`auth.lurus.cn`). No se necesitan instancias virtuales; todas las líneas de producto comparten el mismo issuer.
:::

---

## Organization (organización)

**Unidad de inquilino**, similar a una OU en un servicio de directorio. Puede haber varias dentro de una Instance, con datos de usuario aislados entre sí. Sus posesiones: User & Service Account (pool de usuarios propio), Project (agrupación de productos con sus aplicaciones y roles), Domain (uno o varios, incluido un dominio principal), Policy (puede sobrescribir las políticas de seguridad por defecto de la instancia). Admite **delegación de permisos**: otorgar a otra Organization el derecho de administración de sus propios Project, logrando un IAM B2B de autoservicio.

::: tip Contexto de Lurus
La organización principal actual es **`lurus.cn`**, que alberga las cuentas de empleados internos y los Project de cada producto. Al incorporar clientes empresariales se puede crear una Organization auxiliar independiente para cada empresa y abrir permisos de productos específicos mediante Project Grant.
:::

---

## Project (proyecto)

**Agrupación lógica de productos**; cada Project corresponde a un producto de software o a un límite de servicio. Todas las Application de un mismo Project comparten las mismas definiciones de Role. Componentes: Application (cliente de inicio de sesión), Role (cadena de rol como `admin`/`viewer`), User Grant (otorgar roles a un User), Granted Organization (otorgar el Project completo a otra Org). Los ajustes a nivel de Project incluyen: si se exige que el inicio de sesión incluya la declaración de roles (`urn:casdoor:iam:org:project:roles`), si se permite el inicio de sesión con IdP externos, etc.

::: tip Contexto de Lurus
Cada línea de producto corresponde a un Project independiente; la nomenclatura se encuentra en el registro `capabilities:` de `lurus.yaml`. Las convenciones de roles las define cada equipo de producto.
:::

---

## Application (aplicación)

**Cliente de inicio de sesión concreto**, la entidad de programa que realmente inicia la solicitud de autenticación. Cada uno tiene su propio `client_id` y, según el método de autenticación, su `client_secret` o configuración PKCE.

| Tipo | Escenario típico | Método de autenticación |
|------|---------|---------|
| **Web** | Renderizado en servidor (Spring, Phoenix, Django) | Authorization Code + PKCE o Client Secret |
| **SPA** | Solo frontend de una sola página (React, Vue) | Authorization Code + **PKCE** (obligatorio) |
| **Native** | Escritorio/móvil (Switch, app de Lutu) | Authorization Code + PKCE + Custom Scheme |
| **API** | Solo backend / M2M | Client Credentials (JWT o Basic Auth) / Private Key JWT |
| **SAML** | Aplicaciones empresariales compatibles con SAML 2.0 | Aserción SAML 2.0 |

::: warning Acerca de PKCE
Las aplicaciones que implican interacción del usuario (Web/SPA/Native) usan **PKCE** por defecto. Se prohíbe usar el Implicit Flow en aplicaciones de frontend.
:::

**Configuraciones clave**: `client_id` (todos los tipos, identifica la aplicación); `client_secret` (solo aplicaciones de servidor que puedan guardar la clave de forma segura; SPA/Native usan PKCE en su lugar); Redirect URI (validación estricta de coincidencia exacta; en modo de desarrollo se puede relajar); modo de desarrollo (permite URI sin HTTPS y con comodines, solo para desarrollo local; debe desactivarse en producción).

---

## User (usuario)

Se divide en **Human User** para personas reales y **Machine User** para sistemas automatizados.

- **Human User**: admite Password, MFA (TOTP/SMS), Passkey (FIDO2/WebAuthn), IdP externos (Google/GitHub, etc.). Sus campos incluyen nombre de inicio de sesión, nombre, correo, teléfono, preferencia de idioma y Metadata personalizada (pares clave-valor).
- **Machine User / Service Account**: servicios backend, CI/CD, tareas programadas. Métodos de autenticación: **PAT** (token al portador de larga duración, sencillo) o **JWT Profile** (un JWT firmado con clave privada que se intercambia por un token, más seguro).

**Estados de usuario**: `active` (puede iniciar sesión) / `inactive` (deshabilitado) / `locked` (bloqueado por exceder intentos fallidos) / `deleted` (borrado lógico, conservado para auditoría).

::: tip Restricción importante
Cada User pertenece estrictamente a **una única Organization**. El acceso entre organizaciones debe hacerse mediante el mecanismo de Organization Grant; no se pueden compartir cuentas directamente entre organizaciones.
:::

---

## Grant y Role

Basados en RBAC, con núcleo en Project Role, User Grant y Project Grant.

- **Project Role**: cadena de rol dentro de un Project, con tres campos: Key (identificador de código, como `admin`), Display Name (texto mostrado en la consola, como «Administrador»), Group (agrupación opcional, como `management`). Compartido por todas las Application del mismo Project.
- **User Grant** = `User + Project + Role[]`: tras iniciar sesión, el claim `urn:casdoor:iam:org:project:roles` del access token lleva todos los roles otorgados al usuario en el Project de destino; el backend analiza este claim para la autorización, sin necesidad de llamar a una API adicional.
- **Project Grant** = `Project (Org de origen) → Organization (Org de destino)`: otorga el derecho de administración de todo el Project a otra Organization. Núcleo del multiinquilino B2B: Lurus no necesita crear cuentas para los empleados del cliente; el cliente gestiona por sí mismo los usuarios y permisos dentro de su Organization.

---

## Administrator (administrador)

Cuatro niveles, que siguen el principio de mínimo privilegio:

| Nivel | Alcance | Roles típicos |
|------|--------|---------|
| **IAM / Instance** | Toda la instancia (todas las Organization) | `IAM_OWNER` |
| **Organization** | Todos los recursos dentro de una sola organización | `ORG_OWNER`, `ORG_USER_MANAGER` |
| **Project** | Aplicaciones, roles y autorizaciones dentro de un solo Project | `PROJECT_OWNER` |
| **Project Grant** | Gestión de roles de usuario del Project otorgado | `PROJECT_GRANT_OWNER` |

**Cadenas de rol comunes**: `IAM_OWNER` (máximo a nivel de instancia, gestiona todas las organizaciones/políticas/instancias virtuales), `ORG_OWNER` (gestiona usuarios/Project/dominios/políticas dentro de la organización), `ORG_USER_MANAGER` (solo gestiona usuarios y asignación de roles, no modifica la estructura del Project), `ORG_USER_PERMISSION_EDITOR` (solo edita User Grant), `PROJECT_OWNER` (gestiona Application/Role/Grant dentro del Project), `PROJECT_GRANT_OWNER` (gestiona los roles de usuario de la propia organización dentro del Project otorgado).

::: warning Visibilidad entre organizaciones
Solo `IAM_OWNER` puede ver y administrar entre Organization. `ORG_OWNER` está estrictamente limitado a su propia organización y no puede acceder a los datos de otras organizaciones.
:::

---

## Policy (política)

La capa Instance define los valores por defecto y la capa Organization los sobrescribe según sea necesario.

| Tipo de política | Descripción |
|---------|------|
| **Login Policy** | Qué métodos de autenticación se permiten (Password/Passkey/IdP externo/interruptor de registro) |
| **Password Policy** | Complejidad de la contraseña, longitud mínima, si se prohíben contraseñas del historial |
| **Lockout Policy** | Umbral de intentos fallidos de inicio de sesión, duración del bloqueo |
| **MFA Policy** | Si se exige MFA, qué métodos se permiten |
| **Privacy Policy** | URL de la declaración de privacidad, URL de los ToS |
| **Branding** | Logo de la página de inicio de sesión, esquema de colores, CSS personalizado (personalizable de forma independiente a nivel de Organization) |

Las políticas concretas de la organización principal `lurus.cn` las gestiona el equipo de operaciones de la plataforma en la Casdoor Console; aquí no se codifican de forma fija.

---

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Alineación con el despliegue real de Lurus</p>
    <div class="lurus-callout__body"><ul><li><strong>Nomenclatura de Project</strong>: cada producto corresponde a un Project (<code>lurus-api</code>, <code>lucrum</code>, <code>switch</code>, <code>lutu</code>, <code>admin</code>, <code>forge</code>); la Casdoor Console es la referencia autoritativa.</li><li><strong>Convención de roles</strong>: las cadenas de rol se definen en el CLAUDE.md a nivel de servicio o en el registro <code>capabilities:</code> de <code>lurus.yaml</code>, no se codifican aquí de forma fija.</li><li><strong>Escenario de Machine User</strong>: las llamadas M2M usan de forma unificada Machine User + JWT Profile, evitando compartir cuentas humanas.</li><li><strong>Escenario de PAT</strong>: CI/CD y scripts pueden usar PAT, pero deben establecer la vida útil más corta posible y rotarlos periódicamente.</li><li><strong>Referencia de configuración completa</strong>: la sección <code>capabilities:</code> de <code>lurus.yaml</code> es el único punto de entrada para los cambios de arquitectura.</li></ul></div>
  </div>
</div>

</div>

<style scoped>
.auth-concepts .lurus-section-head { margin-top: 8px; }
</style>
