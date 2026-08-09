---
layout: page
title: LurusTech Docs — Infraestructura de IA y plataforma de productos
description: Documentación de la plataforma LurusTech — Referencia de API · Quickstart · Guía de integración
---

<div class="vp-doc lurus-home">

<Hero />

<nav class="persona-jump" aria-label="按角色快速跳转">
  <a href="#newbie" class="persona-jump__chip">
    <span class="persona-jump__icon"><Icon name="rocket" :size="14" /></span>
    <span class="persona-jump__label">Principiante</span>
    <span class="persona-jump__hint">Empieza en 3 minutos</span>
  </a>
  <a href="#player" class="persona-jump__chip">
    <span class="persona-jump__icon"><Icon name="gamepad-2" :size="14" /></span>
    <span class="persona-jump__label">Usuario</span>
    <span class="persona-jump__hint">Herramientas listas</span>
  </a>
  <a href="#decider" class="persona-jump__chip">
    <span class="persona-jump__icon"><Icon name="briefcase" :size="14" /></span>
    <span class="persona-jump__label">Tomador de decisiones</span>
    <span class="persona-jump__hint">Evaluación empresarial</span>
  </a>
  <a href="#dev" class="persona-jump__chip">
    <span class="persona-jump__icon"><Icon name="code" :size="14" /></span>
    <span class="persona-jump__label">Desarrollador</span>
    <span class="persona-jump__hint">Construir sistemas</span>
  </a>
</nav>

<div class="topic-grid-head"><Icon name="compass" :size="16" /> <strong>Explorar por tema</strong> —— ¿Ya sabes qué buscas? Entra directo al tema correspondiente.</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--api" href="/es/guide/introduction"><span class="lurus-card__icon"><Icon name="plug-zap" :size="20" /></span><div class="lurus-card__title">Acceso al gateway</div><p class="lurus-card__body">Una sola Key para conectar más de 50 modelos, compatible con el SDK de OpenAI.</p></a>
  <a class="lurus-card lurus-card--kova" href="/es/kova/"><span class="lurus-card__icon"><Icon name="bot" :size="20" /></span><div class="lurus-card__title">Ejecución de agentes</div><p class="lurus-card__body">Motor WAL-First de Kova, recuperación automática ante caídas.</p></a>
  <a class="lurus-card lurus-card--memx" href="/es/memx/"><span class="lurus-card__icon"><Icon name="brain" :size="20" /></span><div class="lurus-card__title">Memoria inteligente</div><p class="lurus-card__body">Memoria adaptativa de MemX, destilación con cero coste de LLM.</p></a>
  <a class="lurus-card lurus-card--lumen" href="/es/lumen/"><span class="lurus-card__icon"><Icon name="zap" :size="20" /></span><div class="lurus-card__title">Observabilidad</div><p class="lurus-card__body">Lumen Replay + recuperación ante caídas + seguimiento de costes.</p></a>
  <a class="lurus-card lurus-card--lucrum" href="/es/lucrum/"><span class="lurus-card__icon"><Icon name="trending-up" :size="20" /></span><div class="lurus-card__title">Trading cuantitativo</div><p class="lurus-card__body">Lucrum genera estrategias vnpy en lenguaje natural y las prueba con backtesting.</p></a>
  <a class="lurus-card lurus-card--switch" href="/es/switch/"><span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span><div class="lurus-card__title">Herramienta de escritorio</div><p class="lurus-card__body">Switch gestiona de forma unificada múltiples CLI de IA, MCP y costes.</p></a>
  <a class="lurus-card lurus-card--api" href="/integrations/"><span class="lurus-card__icon"><Icon name="puzzle" :size="20" /></span><div class="lurus-card__title">Integraciones y MCP</div><p class="lurus-card__body">MCP de productos, servidores integrados de Switch, catálogo de clientes.</p></a>
  <a class="lurus-card lurus-card--api" href="/es/guide/troubleshooting"><span class="lurus-card__icon"><Icon name="life-buoy" :size="20" /></span><div class="lurus-card__title">Resolución de problemas</div><p class="lurus-card__body">Problemas frecuentes como 401 / cuota / timeout, localizados en una sola página.</p></a>
</div>

## <Icon name="rocket" :size="22" /> Soy principiante — Ejecuta tu primera llamada en 3 minutos {#newbie}

Elegir mal el modelo cuesta 10 veces más que escribir mal el código. Primero haz una llamada con nuestro gateway y luego decide si migrar.

<div class="action-grid">
  <ActionCard
    product-id="lurus-api"
    :actions="[
      { label: 'Inicio rápido', href: '/es/guide/quickstart', primary: true },
      { label: 'Obtener API Key', href: '/es/guide/get-api-key' },
      { label: 'Modelos compatibles', href: '/guide/models' },
      { label: 'Consola', href: 'https://api.lurus.cn', external: true },
    ]"
  />
  <ActionCard
    product-id="platform"
    :actions="[
      { label: 'Visión general de la plataforma', href: '/es/platform/', primary: true },
      { label: 'Detalle de facturación', href: '/es/platform/billing' },
      { label: 'Preguntas frecuentes', href: '/es/platform/faq' },
    ]"
  />
</div>

---

## <Icon name="gamepad-2" :size="22" /> Soy usuario — Quiero herramientas de IA listas para usar {#player}

El código ya está escrito por ti. Descárgalo y úsalo, sin escribir ni una línea de configuración.

<div class="action-grid">
  <ActionCard
    product-id="lucrum"
    :actions="[
      { label: 'Inicio rápido', href: '/es/lucrum/quickstart', primary: true },
      { label: 'Mercado de estrategias', href: '/es/lucrum/strategies' },
      { label: 'Plataforma de trading', href: 'https://lucrum.lurus.cn', external: true },
    ]"
  />
  <ActionCard
    product-id="switch"
    :actions="[
      { label: 'Guía de instalación', href: '/es/switch/install', primary: true },
      { label: 'Instrucciones de configuración', href: '/es/switch/configuration' },
    ]"
  />
  <ActionCard
    product-id="creator"
    :actions="[
      { label: 'Guía de instalación', href: '/creator/install', primary: true },
      { label: 'Casos de uso', href: '/creator/use-cases' },
    ]"
  />
  <ActionCard
    name="Lutu — Cliente móvil"
    tagline="App Lutu · Asistente de IA y contabilidad en el móvil"
    icon="smartphone"
    color="var(--lurus-color-creator)"
    status="beta"
    :actions="[
      { label: 'Descargar Lutu', href: 'https://www.lurus.cn/download#lutu', primary: true, external: true },
    ]"
  />
</div>

---

## <Icon name="briefcase" :size="22" /> Soy tomador de decisiones — Evaluar una compra empresarial {#decider}

No es la compra de una herramienta, es un reemplazo de infraestructura. Mira primero el TCO y los límites de cumplimiento, luego las funciones.

<div class="action-grid">
  <ActionCard
    name="Por qué elegir Lurus"
    tagline="Cuatro capacidades clave vs. construir en casa — TCO, rendimiento y cumplimiento en una sola tabla"
    icon="award"
    color="var(--lurus-brand-500)"
    :actions="[
      { label: 'Soluciones empresariales', href: '/solutions/', primary: true },
      { label: 'Why Lurus', href: '/solutions/why-lurus' },
    ]"
  />
  <ActionCard
    name="Modalidades de despliegue empresarial"
    tagline="SaaS · On-premise · Nube híbrida · Límites de cumplimiento explicados de una vez"
    icon="server"
    color="var(--lurus-color-platform)"
    :actions="[
      { label: 'Matriz de despliegue', href: '/solutions/enterprise-deploy', primary: true },
    ]"
  />
  <ActionCard
    product-id="auth"
    :actions="[
      { label: 'Visión general y puntos de acceso', href: '/es/platform/auth/', primary: true },
      { label: 'Federación SSO empresarial', href: '/es/platform/auth/oidc' },
      { label: 'Consola de autenticación', href: 'https://identity.lurus.cn', external: true },
    ]"
  />
  <ActionCard
    name="Contactar con ventas"
    tagline="Despliegue on-premise · Licencias · Personalización · Consultas de colaboración"
    icon="mail"
    color="var(--lurus-color-auth)"
    :actions="[
      { label: 'business@lurus.cn', href: 'mailto:business@lurus.cn', primary: true, external: true },
    ]"
  />
</div>

---

## <Icon name="code" :size="22" /> Soy desarrollador — Construir sistemas de IA {#dev}

Los cuatro componentes base de una aplicación LLM: ejecución · memoria · gateway · CLI. Cada uno funciona por sí solo; combinados son más potentes.

<div class="action-grid">
  <ActionCard
    product-id="kova"
    :actions="[
      { label: 'Inicio rápido', href: '/es/kova/quickstart', primary: true },
      { label: 'Conceptos clave', href: '/es/kova/concepts' },
      { label: 'Referencia de API', href: '/es/kova/api' },
    ]"
  />
  <ActionCard
    product-id="memx"
    :actions="[
      { label: 'Inicio rápido', href: '/es/memx/quickstart', primary: true },
      { label: 'Conceptos clave', href: '/es/memx/concepts' },
      { label: 'Diseño de la arquitectura', href: '/es/memx/architecture' },
    ]"
  />
  <ActionCard
    product-id="lumen"
    :actions="[
      { label: 'Inicio rápido', href: '/es/lumen/quickstart', primary: true },
      { label: 'Python SDK', href: '/es/lumen/python-sdk' },
      { label: 'Manual de la CLI', href: '/es/lumen/cli' },
    ]"
  />
  <ActionCard
    product-id="api-ref"
    :actions="[
      { label: 'Visión general de la API', href: '/es/api/overview', primary: true },
      { label: 'Autenticación', href: '/es/api/authentication' },
      { label: 'Chat Completions', href: '/es/api/chat-completions' },
    ]"
  />
  <ActionCard
    product-id="arch"
    :actions="[
      { label: 'Ver la arquitectura', href: '/developer/architecture', primary: true },
    ]"
  />
  <ActionCard
    product-id="forge"
    :actions="[
      { label: 'Filosofía del producto', href: '/forge/', primary: true },
      { label: 'Ontology', href: '/forge/ontology' },
    ]"
  />
</div>

---

## Tutoriales multiproducto · Guías de migración

<div class="action-grid action-grid--compact">
  <ActionCard
    name="Centro de tutoriales"
    tagline="MemX + Kova · Lumen + LangGraph · Lucrum de extremo a extremo"
    icon="graduation-cap"
    color="var(--lurus-color-kova)"
    :actions="[
      { label: 'Tutoriales multiproducto', href: '/tutorials/', primary: true },
    ]"
  />
  <ActionCard
    name="Guía de migración"
    tagline="OpenAI · LangGraph · OIDC propio → mudanza en 5 minutos"
    icon="import"
    color="var(--lurus-color-lurus-api)"
    :actions="[
      { label: 'Centro de migración', href: '/migrations/', primary: true },
    ]"
  />
  <ActionCard
    name="Glosario"
    tagline="Más de 47 términos técnicos agrupados por tema, consulta rápida multiproducto"
    icon="book-a"
    color="var(--lurus-color-memx)"
    :actions="[
      { label: 'Tabla completa de términos', href: '/guide/glossary', primary: true },
    ]"
  />
</div>

---

## ¿Por qué elegir Lurus?

Cuatro puntos de decisión — no es una herramienta más, es un reemplazo de infraestructura.

<div class="diff-grid">
  <article class="diff-card diff-card--brand">
    <header class="diff-card__head">
      <span class="diff-card__icon"><Icon name="layers" :size="20" /></span>
      <h3 class="diff-card__title">Desarrollo propio de extremo a extremo</h3>
    </header>
    <p class="diff-card__lede">Desde el motor de ejecución en Rust hasta el cliente móvil en Flutter, todo desarrollado en casa. Cuentas / facturación / memoria / gateway compartidos.</p>
    <ul class="diff-card__points">
      <li>Cuando hay un problema, no esperas a que tres proveedores se echen la culpa entre ellos</li>
      <li>Cuanto más lo usas, más vale: memoria, facturación y modelos capitalizan en un mismo pool</li>
    </ul>
  </article>

  <article class="diff-card diff-card--accent-kova">
    <header class="diff-card__head">
      <span class="diff-card__icon"><Icon name="zap" :size="20" /></span>
      <h3 class="diff-card__title">Rendimiento a nivel de motor</h3>
    </header>
    <p class="diff-card__lede">Planificación de Kova en <strong>3μs</strong> (benchmark de Criterion) · 315K ops/s de rendimiento.</p>
    <ul class="diff-card__points">
      <li>Escribimos el motor de ejecución, no envolvimos otra capa sobre Temporal</li>
      <li>MemX destila sin llamar al LLM · Lucrum con precisión total sin deriva de coma flotante</li>
    </ul>
  </article>

  <article class="diff-card diff-card--accent-platform">
    <header class="diff-card__head">
      <span class="diff-card__icon"><Icon name="shield-check" :size="20" /></span>
      <h3 class="diff-card__title">Soberanía de los datos</h3>
    </header>
    <p class="diff-card__lede">Un solo despliegue, sin pagar tributo a ningún proveedor de nube. Cifrado de extremo a extremo con SM4-GCM del estándar criptográfico nacional.</p>
    <ul class="diff-card__points">
      <li>Un único SSO / Passkey / MFA, conectado a tu IdP existente</li>
      <li>Compatible con el SDK de OpenAI · si quieres irte, te llevas los datos cuando quieras</li>
    </ul>
  </article>

  <article class="diff-card diff-card--accent-memx">
    <header class="diff-card__head">
      <span class="diff-card__icon"><Icon name="receipt" :size="20" /></span>
      <h3 class="diff-card__title">TCO transparente</h3>
    </header>
    <p class="diff-card__lede">Facturación unificada en unidades 鹿贝 — más de 50 modelos, un solo estado de cuenta.</p>
    <ul class="diff-card__points">
      <li>El tiempo de conciliación pasa de un día a 5 minutos</li>
      <li>Migra cuando quieras, con cero coste de salida</li>
    </ul>
  </article>
</div>

<details class="diff-table">
  <summary>Desplegar la tabla comparativa completa (8 dimensiones × comparación con construir en casa)</summary>

| Dimensión | La ventaja de Lurus | Frente a construir en casa |
|------|-------------|---------|
| **Desarrollo propio de extremo a extremo** | Desde el motor de ejecución en Rust hasta el cliente móvil en Flutter, la tecnología central es totalmente autónoma y controlable | Ensamblaje de múltiples proveedores, riesgo de bloqueo de versiones |
| **Rendimiento a nivel de motor** | Latencia de planificación de 3μs en Kova, 315K ops/s (benchmark de Criterion), cero dependencias externas | Construir Temporal/LangGraph en casa es un orden de magnitud más lento |
| **Soberanía de los datos** | Despliegue on-premise, los datos no salen del perímetro de la empresa, compatible con SM4-GCM del estándar criptográfico nacional | Alta dificultad de cumplimiento y auditoría en la nube pública |
| **Identidad unificada** | Todos los productos comparten SSO, Passkey, MFA, con federación al IdP empresarial | Auto-operación de Keycloak / Auth0 |
| **Sinergia del ecosistema** | 12 productos comparten cuentas/facturación/memoria/gateway de LLM, cuanto más lo usas más vale | Stack de herramientas fragmentado |
| **Económico y eficiente** | Destilación con cero coste de LLM en MemX; precisión total y cero error con Decimal.js en Lucrum | Los problemas de memoria / precisión requieren inversión adicional |
| **TCO transparente** | Facturación unificada en unidades 鹿贝, cobro por consumo + cuota gratuita | Conciliación compleja entre múltiples facturas |
| **Abierto y migrable** | Compatible con el SDK de OpenAI, autenticación estándar PAT/JWT, exportación sin bloqueo | Alto coste de salida por bloqueo de proveedor |

</details>

---

## ¿Listo?

<div class="finalcta">
  <div class="finalcta__text">
    <h3>Cambia de gateway con 5 líneas de código, compatible con el SDK de OpenAI</h3>
    <p>Cambia un solo base_url y todas tus llamadas existentes quedan conectadas. Una sola Key para más de 50 modelos; al registrarte recibes cuota gratuita.</p>
  </div>
  <div class="finalcta__actions">
    <a href="/es/guide/quickstart" class="finalcta__btn finalcta__btn--primary">Empieza en 3 minutos →</a>
    <a href="https://api.lurus.cn" target="_blank" rel="noopener noreferrer" class="finalcta__btn finalcta__btn--alt">Ir a la consola ↗</a>
    <a href="mailto:business@lurus.cn" class="finalcta__btn finalcta__btn--ghost">Consulta empresarial</a>
  </div>
</div>

## Contáctanos

<div class="contact-grid">
  <a href="mailto:support@lurus.cn" class="contact-card">
    <span class="contact-card__icon"><Icon name="life-buoy" :size="22" /></span>
    <span class="contact-card__name">Soporte técnico</span>
    <span class="contact-card__addr">support@lurus.cn</span>
  </a>
  <a href="mailto:business@lurus.cn" class="contact-card contact-card--accent">
    <span class="contact-card__icon"><Icon name="briefcase" :size="22" /></span>
    <span class="contact-card__name">Colaboración comercial</span>
    <span class="contact-card__addr">business@lurus.cn</span>
  </a>
  <a href="https://github.com/hanmahong5-arch" target="_blank" rel="noopener noreferrer" class="contact-card">
    <span class="contact-card__icon"><Icon name="github" :size="22" /></span>
    <span class="contact-card__name">GitHub</span>
    <span class="contact-card__addr">hanmahong5-arch ↗</span>
  </a>
</div>

</div>

<style>
.lurus-home { max-width: 1152px; margin: 0 auto; padding: 24px; }
.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 20px 0 28px;
}
.action-grid--compact {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}
.lurus-home h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--lurus-fs-xl);
  font-weight: 700;
  margin-top: 44px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--vp-c-divider);
  background:
    linear-gradient(to right,
      var(--vp-c-brand-1),
      color-mix(in srgb, var(--vp-c-brand-1) 35%, transparent) 60%,
      transparent 100%)
    bottom left / 36% 1px no-repeat;
  scroll-margin-top: 88px;
}
.lurus-home h2 .lurus-icon { color: var(--vp-c-brand-1); }
.lurus-home hr {
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--vp-c-brand-soft), transparent);
  margin: 40px 0;
}
@media (max-width: 640px) {
  .lurus-home { padding: 16px; }
}

/* ============================================================
 * Persona jump chips — sits under Hero, anchors into 4 personas
 * ============================================================ */
.persona-jump {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: -8px 0 4px;
  padding: 6px 4px;
  background: transparent;
  border: none;
  align-items: center;
  justify-content: center;
}
.persona-jump__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--lurus-radius-pill);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--vp-c-text-2) !important;
  text-decoration: none !important;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  transition: transform var(--lurus-dur-fast) var(--lurus-ease-out),
              border-color var(--lurus-dur-fast),
              color var(--lurus-dur-fast);
}
.persona-jump__chip:hover {
  transform: var(--lurus-hover-rise);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1) !important;
}
.persona-jump__icon {
  display: inline-flex;
  color: var(--vp-c-brand-1);
}
.persona-jump__hint {
  color: var(--vp-c-text-3);
  font-weight: 400;
  font-size: 0.74rem;
}
.persona-jump__chip:hover .persona-jump__hint { color: inherit; opacity: 0.85; }
@media (max-width: 640px) {
  .persona-jump__hint { display: none; }
}

/* anchored personas: leave room for VitePress sticky nav (~64px) + breathing space */
#newbie, #player, #decider, #dev { scroll-margin-top: 88px; }

/* ============================================================
 * Differentiators — 4 cards replacing the 8-row why-Lurus table
 * ============================================================ */
.diff-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
  margin: 18px 0 14px;
}
.diff-card {
  --accent: var(--vp-c-brand-1);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--lurus-radius-lg);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  transition: transform var(--lurus-dur-base) var(--lurus-ease-out),
              border-color var(--lurus-dur-base),
              box-shadow var(--lurus-dur-base);
}
.diff-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent);
}
.diff-card:hover {
  transform: var(--lurus-hover-rise);
  border-color: var(--accent);
  box-shadow: var(--lurus-shadow-3);
}
.diff-card--brand            { --accent: var(--vp-c-brand-1); }
.diff-card--accent-kova      { --accent: var(--lurus-color-kova); }
.diff-card--accent-platform  { --accent: var(--lurus-color-platform); }
.diff-card--accent-memx      { --accent: var(--lurus-color-memx); }
.diff-card__head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.diff-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--lurus-radius-md);
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  color: var(--accent);
  flex-shrink: 0;
}
.diff-card__title {
  margin: 0;
  font-size: 1.02rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  border: none !important;
  padding: 0 !important;
}
.diff-card__lede {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}
.diff-card__lede strong {
  color: var(--accent);
  font-feature-settings: 'tnum';
}
.diff-card__points {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.diff-card__points li {
  position: relative;
  padding-left: 16px;
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
.diff-card__points li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.65;
}

.diff-table {
  margin: 12px 0 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--lurus-radius-md);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}
.diff-table > summary {
  cursor: pointer;
  padding: 12px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  user-select: none;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background var(--lurus-dur-fast);
}
.diff-table > summary::-webkit-details-marker { display: none; }
.diff-table > summary::before {
  content: '▸';
  display: inline-block;
  transition: transform var(--lurus-dur-fast);
  color: var(--vp-c-brand-1);
}
.diff-table[open] > summary::before { transform: rotate(90deg); }
.diff-table > summary:hover { background: var(--vp-c-bg-mute); }
.diff-table table { margin: 0 18px 18px; }

/* ============================================================
 * Final CTA — bottom strip "ready?"
 * ============================================================ */
.finalcta {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 24px;
  align-items: center;
  margin: 24px 0 16px;
  padding: 28px 32px;
  border-radius: var(--lurus-radius-xl);
  background:
    radial-gradient(120% 140% at 0% 0%, color-mix(in srgb, var(--vp-c-brand-1) 14%, transparent), transparent 60%),
    radial-gradient(120% 140% at 100% 100%, color-mix(in srgb, var(--lurus-color-kova) 12%, transparent), transparent 55%),
    var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}
.finalcta__text h3 {
  margin: 0 0 6px;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  border: none !important;
  padding: 0 !important;
}
.finalcta__text p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
.finalcta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
}
.finalcta__btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: var(--lurus-radius-pill);
  text-decoration: none !important;
  transition: transform var(--lurus-dur-fast),
              filter var(--lurus-dur-fast),
              border-color var(--lurus-dur-fast),
              color var(--lurus-dur-fast);
}
.finalcta__btn:hover { transform: var(--lurus-hover-rise); }
.finalcta__btn--primary {
  background: var(--vp-c-brand-1);
  color: #fff !important;
}
.finalcta__btn--primary:hover { filter: brightness(1.08); }
.finalcta__btn--alt {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1) !important;
  border: 1px solid var(--vp-c-divider);
}
.finalcta__btn--alt:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1) !important;
}
.finalcta__btn--ghost {
  color: var(--vp-c-text-2) !important;
}
.finalcta__btn--ghost:hover { color: var(--vp-c-brand-1) !important; }

@media (max-width: 720px) {
  .finalcta {
    grid-template-columns: 1fr;
    padding: 22px 20px;
  }
  .finalcta__actions { justify-content: flex-start; }
}

/* ============================================================
 * Contact card grid
 * ============================================================ */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin: 16px 0 8px;
}
.contact-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 18px 20px;
  border-radius: var(--lurus-radius-lg);
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  text-decoration: none !important;
  color: var(--vp-c-text-1) !important;
  transition: transform var(--lurus-dur-base),
              border-color var(--lurus-dur-base),
              box-shadow var(--lurus-dur-base);
}
.contact-card:hover {
  transform: var(--lurus-hover-rise);
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--lurus-shadow-2);
}
.contact-card--accent { border-color: color-mix(in srgb, var(--vp-c-brand-1) 30%, var(--vp-c-divider)); }
.contact-card__icon {
  color: var(--vp-c-brand-1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: var(--lurus-radius-md);
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
}
.contact-card__name {
  font-weight: 700;
  font-size: 0.95rem;
}
.contact-card__addr {
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  font-family: var(--lurus-font-mono);
}
</style>
