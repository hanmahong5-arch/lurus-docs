---
title: "Migrar desde Keycloak / Auth0 autoalojado a Lurus Auth"
description: "Ruta completa de migración de usuarios SCIM, federación SSO y conmutación gradual."
---

<div class="mig-oidc-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> Migrar desde OIDC autoalojado</span>
  <h1 class="lurus-section-head__title">Migrar desde OIDC autoalojado a Lurus Auth</h1>
  <p class="lurus-section-head__lede">La empresa ya tiene un IdP (Keycloak / Auth0 / Okta / Azure AD) y quiere que los empleados sigan iniciando sesión con su cuenta corporativa, a la vez que externaliza la capa de identidad a Lurus.</p>
</div>

## <Icon name="git-branch" :size="20" /> Dos estrategias

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="building-2" :size="20" /></span>
    <div class="lurus-card__title">Estrategia A: Lurus Auth como IdP secundario (recomendada)</div>
    <p class="lurus-card__body">Tú solo gestionas el ciclo de vida de los usuarios en el IdP corporativo; los productos Lurus leen la identidad mediante federación OIDC.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="import" :size="20" /></span>
    <div class="lurus-card__title">Estrategia B: Migración completa</div>
    <p class="lurus-card__body">El Keycloak/Auth0 original se exporta mediante SCIM a Lurus Auth (Casdoor), que pasa a ser la única fuente de verdad.</p>
  </div>
</div>

### Estrategia A — Topología de federación

<ArchitectureDiagram title="Estrategia A: Federación" chart="graph LR
  IDP[IdP corporativo existente] -->|Federación OIDC| LA[Lurus Auth]
  LA --> P[Todos los productos Lurus]" />

### Estrategia B — Topología de migración

<ArchitectureDiagram title="Estrategia B: Migración" chart="graph LR
  KC[Keycloak/Auth0 original] -->|Exportación SCIM| LA[Lurus Auth · Casdoor]
  LA --> D[Todos los sistemas posteriores]" />

## <Icon name="building-2" :size="20" /> Pasos de la estrategia A (recomendada)

<ol class="lurus-steps">
<li>

**Crear la conexión de federación en la consola de Lurus** — Accede a `auth.lurus.cn` → Configuración de empresa → Proveedores de identidad → Nuevo → selecciona OIDC. Introduce los datos del IdP corporativo:

- Issuer URL
- Client ID
- Client Secret
- URL de callback (la proporciona Lurus)

</li>
<li>

**Mapeo de claims** — Asigna los atributos del IdP corporativo a los usuarios de Lurus.

```yaml
# 将企业 IdP 的属性映射到 Lurus 用户
email:       email
display:     name
department:  department   # custom claim
```

</li>
<li>

**Conmutación gradual** — En el IdP corporativo, habilita primero el botón de inicio de sesión de Lurus para el 5 % de los empleados. Valida durante 1 semana → amplía a toda la plantilla.

</li>
</ol>

## <Icon name="import" :size="20" /> Pasos de la estrategia B

<ol class="lurus-steps">
<li>

**Exportar SCIM** — Exporta los usuarios de Keycloak a JSON:

```bash
./kcadm.sh get users -r myrealm --fields username,email,firstName,lastName -f json > users.json
```

</li>
<li>

**Importación masiva a Lurus**

<ApiEndpoint method="POST" path="/admin/v1/scim/users:batchImport" description="Importar usuarios de forma masiva (auth.lurus.cn)" />

```bash
curl -X POST https://auth.lurus.cn/admin/v1/scim/users:batchImport \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d @users.json
```

</li>
<li>

**Política de contraseñas** — Por defecto, Lurus no migra las contraseñas (los hashes no son compatibles); en el primer inicio de sesión se fuerza el flujo de "contraseña olvidada". Si se usa federación SSO, no es necesario migrar contraseñas.

</li>
</ol>

## <Icon name="shield-check" :size="20" /> Ventajas de la federación SSO

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="building-2" :size="20" /></span>
    <div class="lurus-card__title">Cumplimiento corporativo</div>
    <p class="lurus-card__body">El ciclo de vida de las cuentas reside por completo en la empresa.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="user-check" :size="20" /></span>
    <div class="lurus-card__title">Baja inmediata</div>
    <p class="lurus-card__body">Si el IdP corporativo desactiva una cuenta → Lurus deja de permitir el acceso al instante.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="history" :size="20" /></span>
    <div class="lurus-card__title">Auditoría unificada</div>
    <p class="lurus-card__body">Los registros de inicio de sesión permanecen en el IdP corporativo.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="shield" :size="20" /></span>
    <div class="lurus-card__title">Reutilización de MFA</div>
    <p class="lurus-card__body">Se aplican las políticas de MFA que ya tiene la empresa.</p>
  </div>
</div>

## <Icon name="life-buoy" :size="20" /> Preguntas frecuentes

<details class="lurus-faq-item">
<summary>¿Habrá conflictos de sesión?</summary>

Lurus usa una cookie de sesión independiente, que no afecta al sistema original.

</details>

<details class="lurus-faq-item">
<summary>¿Se pueden conservar los PAT / JWT?</summary>

Sí; los tokens a nivel de API no se ven afectados por la migración a SSO.

</details>

<details class="lurus-faq-item">
<summary>¿Cómo se exportan los registros de auditoría?</summary>

Todos los eventos de identidad pueden exportarse de forma masiva mediante el siguiente endpoint:

<ApiEndpoint method="POST" path="/admin/v1/audit:export" description="Exportar eventos de identidad de forma masiva" />

</details>

## Siguientes pasos

<NextSteps :steps="[
  { text: 'Resumen de Lurus Auth', link: '/es/platform/auth/', primary: true },
  { text: 'OIDC / OAuth2', link: '/es/platform/auth/oidc' },
  { text: 'Modelos de despliegue empresarial', link: '/es/solutions/enterprise-deploy' },
]" />

</div>
