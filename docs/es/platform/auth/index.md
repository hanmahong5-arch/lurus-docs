---
title: Autenticación de identidad unificada
description: "El sistema de identidad compartido por toda la línea de productos Lurus: inicia sesión una vez y accede a todo el sitio, con soporte para SSO, Passkey, autenticación multifactor, autenticación de API y federación SSO empresarial."
---

<div class="auth-page">

<ProductHero product-id="auth" />

**Un solo inicio de sesión, acceso a todo el sitio.** Lurus API, Lucrum, Switch, Creator, Lutu, Admin, Forge y todos los demás productos comparten el mismo sistema de identidad: cuando un usuario inicia sesión en cualquier producto, el resto lo reconoce automáticamente; los permisos y las cuotas se liquidan de forma unificada a nivel de cuenta; los clientes empresariales pueden integrar su propio SSO para incorporar a sus empleados.

Este sistema es provisto por `auth.lurus.cn`, desplegado de forma autogestionada sobre la infraestructura de identidad de código abierto [Zitadel](https://zitadel.com), que implementa por completo los protocolos estándar OIDC / OAuth2 / SAML; los datos de los usuarios permanecen en todo momento dentro del propio clúster K8s de Lurus.

::: tip Accesos rápidos
- Autogestión del usuario: [auth.lurus.cn](https://auth.lurus.cn) — cambiar contraseña, gestionar Passkey, vincular MFA, ver el historial de inicios de sesión
- Gestión de organizaciones/proyectos: [auth.lurus.cn](https://auth.lurus.cn) (consola de organización de Zitadel) — invitar miembros para clientes empresariales, asignar permisos, auditar; o contacta con el área comercial para habilitar la gestión de organización empresarial
:::

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="plug-zap" :size="14" /> Integración</span>
  <h2 class="lurus-section-head__title">Puntos de acceso</h2>
  <p class="lurus-section-head__lede">Cinco endpoints estándar que cubren el descubrimiento, la autorización, el intercambio de tokens y la lectura de la información del usuario.</p>
</div>

| Endpoint | URL | Descripción |
|------|-----|------|
| Consola | `https://auth.lurus.cn` | Autogestión del usuario: cuenta, dispositivos de seguridad, sesiones |
| OIDC Discovery | `https://auth.lurus.cn/.well-known/openid-configuration` | Descubrimiento automático del SDK, incluye todos los endpoints y capacidades soportadas |
| Autorización OAuth2 | `https://auth.lurus.cn/oauth/v2/authorize` | Punto de entrada del flujo estándar de código de autorización / PKCE |
| Endpoint de Token | `https://auth.lurus.cn/oauth/v2/token` | Intercambiar access token / refresh token |
| Información del usuario | `https://auth.lurus.cn/oidc/v1/userinfo` | Leer los claims del usuario actual |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> Capacidades</span>
  <h2 class="lurus-section-head__title">Capacidades principales</h2>
  <p class="lurus-section-head__lede">Desde el inicio de sesión único hasta la federación SSO empresarial, un único sistema cubre todos los escenarios, tanto individuales como B2B.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-auth)"
  :items="[
    { title: 'SSO (inicio de sesión único)', body: 'Inicia sesión una sola vez para acceder a todos los productos Lurus, sin tener que volver a introducir las credenciales. Basado en sesión OIDC estándar, con soporte para renovación silenciosa entre aplicaciones.', icon: 'key-round' },
    { title: 'Autenticación multifactor / Passkey', body: 'Soporta TOTP (Authenticator App), llaves de hardware U2F y Passkey (inicio de sesión sin contraseña con WebAuthn). La política de MFA puede aplicarse de forma obligatoria a nivel de organización o de proyecto.', icon: 'shield' },
    { title: 'Inicio de sesión social', body: 'Permite integrar proveedores de identidad externos como GitHub, Google o WeChat; una vez que el usuario completa la vinculación mediante una cuenta externa, esta queda conectada con su cuenta Lurus.', icon: 'users' },
    { title: 'RBAC y jerarquía de organización', body: 'Modelo de rol-permiso (Role-Based Access Control). Los permisos se conceden a usuarios concretos o a cuentas de servicio mediante Grant, con granularidad precisa a nivel de proyecto y de aplicación.', icon: 'user-check' },
    { title: 'Multiinquilino B2B', body: 'Bajo una Instance se pueden crear múltiples Organization, lo que soporta de forma nativa el aislamiento de clientes empresariales; cada organización puede configurar de forma independiente su marca, sus políticas de inicio de sesión y su federación de IdP.', icon: 'building-2' },
    { title: 'OIDC / OAuth2 / SAML', body: 'Implementa por completo los tres protocolos estándar, compatible con los principales SDK y frameworks del mercado, con integración fluida en aplicaciones Go, Rust, TypeScript y Flutter.', icon: 'link' },
    { title: 'Registros de auditoría', body: 'Las operaciones críticas como inicios de sesión, cambios de MFA, concesión de permisos y restablecimiento de contraseñas quedan registradas en logs inmutables y consultables, cumpliendo los requisitos de conformidad.', icon: 'history' },
    { title: 'Extensión Actions', body: 'Inyecta lógica personalizada en puntos clave del flujo de autenticación (por ejemplo, sincronizar atributos del usuario o restringir condiciones de inicio de sesión), sin necesidad de hacer fork del propio Zitadel.', icon: 'workflow' },
  ]"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> Modelo</span>
  <h2 class="lurus-section-head__title">Vistazo rápido a los conceptos clave</h2>
  <p class="lurus-section-head__lede">El sistema de identidad se organiza en los siguientes niveles; desarrolladores y administradores deben entender cómo estos objetos por capas se mapean a los productos Lurus.</p>
</div>

<ArchitectureDiagram
  title="Niveles del modelo de objetos"
  chart="graph TD; Instance[Instance · lurus-prod] --> Org[Organization · lurus.cn]; Org --> User[User · Human / Service]; Org --> Project[Project · uno por producto]; Project --> App[Application · client_id]; Project --> Role[Role]; User -. User Grant .-> Role"
/>

| Concepto | Significado | Mapeo en Lurus |
|------|------|-----------------|
| **Instance** | Unidad de despliegue de nivel superior, con base de datos y configuración independientes | Lurus opera una única Instance, alojada en `auth.lurus.cn` |
| **Organization** | Unidad de aislamiento de inquilinos, con base de usuarios y políticas de inicio de sesión independientes | Los usuarios individuales pertenecen a la organización principal `lurus.cn`; los clientes empresariales solicitan una Organization independiente, donde pueden configurar su propio dominio y su IdP |
| **Project** | Conjunto de aplicaciones bajo una Organization, que gestiona de forma unificada roles y grants | Cada línea de producto (Lurus API, Lucrum, Switch, Forge…) corresponde a un Project |
| **Application** | Cliente concreto dentro de un Project, que posee `client_id` / `client_secret` | Cada frontend, cliente de escritorio y servidor se registra como una Application independiente |
| **User** | Cuenta con capacidad de inicio de sesión, dividida en Human (persona real) y Service User (máquina) | Los usuarios finales son Human; las llamadas entre servicios de backend usan Service User + JWT Profile |
| **Grant** | Relación de vinculación que concede un Project Role a un User | Controla el nivel de permiso del usuario dentro de un producto concreto; rige la configuración de la organización en [auth.lurus.cn](https://auth.lurus.cn) (Zitadel) |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="book-open" :size="14" /> Navegación</span>
  <h2 class="lurus-section-head__title">Índice de esta sección</h2>
  <p class="lurus-section-head__lede">Desde los conceptos hasta la integración, profundiza en cada capa según lo necesites.</p>
</div>

<div class="lurus-cards lurus-cards--2">
  <a class="lurus-card lurus-card--auth" href="/es/platform/auth/concepts">
    <span class="lurus-card__icon"><Icon name="layers" :size="20" /></span>
    <div class="lurus-card__title">Conceptos principales</div>
    <p class="lurus-card__body">Explicación detallada de Instance / Organization / Project / User / Application / Grant.</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="/es/platform/auth/login">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">Inicio de sesión y autenticación multifactor</div>
    <p class="lurus-card__body">Inicio de sesión con contraseña, Passkey, inicio de sesión social y configuración de MFA.</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="/es/platform/auth/oidc">
    <span class="lurus-card__icon"><Icon name="link" :size="20" /></span>
    <div class="lurus-card__title">Integración OIDC / OAuth2</div>
    <p class="lurus-card__body">Discovery, scopes, claims, flujo de código de autorización y PKCE.</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="/es/platform/auth/api-auth">
    <span class="lurus-card__icon"><Icon name="key" :size="20" /></span>
    <div class="lurus-card__title">Autenticación de API</div>
    <p class="lurus-card__body">Personal Access Token, Service User, JWT Profile y validación de tokens.</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="/es/platform/auth/console">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Gestión de la consola</div>
    <p class="lurus-card__body">Operaciones de gestión diaria de organizaciones / proyectos / aplicaciones / usuarios.</p>
  </a>
</div>

---

## Sinergia con otros productos Lurus

| Escenario | Ruta |
|------|------|
| Ya tengo una API Key y quiero usar un token OAuth para llamar a Lurus API | [Integración OIDC](/es/platform/auth/oidc) → [Chat Completions](/es/api/chat-completions) |
| Iniciar sesión en Switch para sincronizar la configuración de la cuenta Lurus | [Inicio de sesión y MFA](/es/platform/auth/login) → [Configuración de Switch](/es/switch/configuration) |
| Un administrador de Forge configura los permisos del equipo | [Gestión de la consola](/es/platform/auth/console) → [Forge](/forge/) |
| Un desarrollador escribe un servicio de backend que llama a la API interna de Platform | [Autenticación de API (PAT/JWT)](/es/platform/auth/api-auth) |
| Un cliente empresarial quiere iniciar sesión con su propio Azure AD / Feishu | [Inicio de sesión y MFA — Identity Brokering](/es/platform/auth/login) |

---

## Lecturas adicionales

El sistema está construido sobre la infraestructura de identidad de código abierto Zitadel; si necesitas profundizar en los mecanismos subyacentes o en los detalles del SDK, puedes consultar la documentación oficial:

- [Página principal de la documentación de Zitadel](https://zitadel.com/docs) — primeros pasos, modos de despliegue y guía de integración de SDK
- [Conceptos principales](https://zitadel.com/docs/concepts) — explicación de los principios de Instance, Organization, Project, User y Grant
- [Referencia de la API](https://zitadel.com/docs/apis) — documentación de los endpoints REST / gRPC de la Management API, Auth API y Admin API

<RelatedProducts product-id="auth" />

</div>

<style scoped>
.auth-page .lurus-section-head {
  margin-top: 8px;
}
</style>
