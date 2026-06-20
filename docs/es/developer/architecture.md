---
title: "Arquitectura del sistema"
description: "Visión general de la arquitectura de nube híbrida de Lurus: despliegue y gobernanza unificados de servicios basados en Kubernetes + GitOps."
---

<ProductHero product-id="arch" />

<div class="arch-page">

Lurus adopta una arquitectura de nube híbrida, construyendo un sistema unificado de despliegue y gobernanza de servicios basado en Kubernetes + GitOps. Los 12 productos comparten una misma base de cuentas, facturación, memoria, gateway de LLM y observabilidad: no es un ensamblaje de servicios independientes, sino un único diagrama que se puede explicar de una vez.

<MetricStats :items="[
  { label: 'Líneas de producto', value: '12', hint: 'comparten la misma base' },
  { label: 'Canales LLM', value: '50+', hint: 'cortacircuitos por canal' },
  { label: 'Despliegue', value: 'GitOps', hint: 'GHA → GHCR → ArgoCD' },
]" />

## Panorama de la arquitectura

<p class="arch-lede"><span class="lurus-tag"><Icon name="layers" :size="13" /> Vista por capas</span> Desde los productos de cara al consumidor hasta la base operativa, cinco capas de arriba abajo; la capa inferior provee capacidades a la superior, y la superior no percibe la implementación de la inferior.</p>

<ArchitectureDiagram title="Arquitectura por capas" chart="graph TB
  subgraph C[Capa de productos para consumidores]
    Lucrum[Lucrum cuantitativo]
    Switch[Switch escritorio]
    Creator[Creator contenido]
    Lutu[Lutu móvil]
  end
  subgraph B[Capa de productos para empresas]
    API[Lurus API gateway LLM]
    Forge[Forge workbench]
    Lumen[Lumen herramientas de desarrollo]
  end
  subgraph E[Capa de motores núcleo]
    Kova[Kova ejecución persistente Rust]
    MemX[MemX memoria inteligente Python]
  end
  subgraph I[Capa de infraestructura]
    Platform[Platform cuentas y facturación]
    Auth[Auth OIDC]
    Notify[Notification notificación multicanal]
  end
  subgraph O[Capa de operaciones]
    Ops[K8s Traefik ArgoCD Prometheus Grafana Jaeger Loki]
  end
  C --> B
  B --> E
  E --> I
  I --> O" />

::: details Versión en texto del diagrama por capas (accesibilidad / para copiar)
```
┌─────────────────────────────────────────────────────────────────┐
│                      C 端产品层                                  │
│  Lucrum (量化) · Switch (桌面) · Creator (内容) · Lutu (移动)    │
├─────────────────────────────────────────────────────────────────┤
│                      B 端产品层                                  │
│  Lurus API (LLM 网关) · Forge (工作台) · Lumen (开发者工具)     │
├─────────────────────────────────────────────────────────────────┤
│                      核心引擎层                                  │
│  Kova (持久执行, Rust) · MemX (智能记忆, Python)                │
├─────────────────────────────────────────────────────────────────┤
│                      基础设施层                                  │
│  Platform (账号/计费) · Auth (OIDC) · Notification (多渠道通知)  │
├─────────────────────────────────────────────────────────────────┤
│                      运维层                                      │
│  K8s · Traefik · ArgoCD · Prometheus · Grafana · Jaeger · Loki  │
└─────────────────────────────────────────────────────────────────┘
```
:::

## Principios de diseño

<p class="arch-lede"><span class="lurus-tag"><Icon name="sparkles" :size="13" /> Cinco principios</span> Entrada unificada, modelo unificado, despliegue automatizado, observabilidad integrada y autorrecuperación ante fallos.</p>

<CapabilityGrid
  accent="var(--lurus-color-arch)"
  title="Diseño núcleo"
  :items="[
    { title: 'Gateway unificado', body: 'Entrada Traefik, terminación TLS, gestión automática de certificados comodín', icon: 'network' },
    { title: 'Gateway de IA multimodelo', body: 'Acceso unificado a más de 50 canales LLM (OpenAI / Claude / Gemini / Deepseek / Qwen / Moonshot, etc.), protección por cortacircuitos por canal', icon: 'layers' },
    { title: 'Despliegue GitOps', body: 'GitHub Actions → imágenes de contenedor GHCR → sincronización automática ArgoCD', icon: 'git-merge' },
    { title: 'Observabilidad de pila completa', body: 'Métricas Prometheus + paneles Grafana + logs Loki + trazas distribuidas Jaeger', icon: 'activity' },
    { title: 'Diseño de alta disponibilidad', body: 'Conmutación automática ante fallo de canal, enrutamiento por prioridad + peso, protección con PodDisruptionBudget', icon: 'shield-check' },
  ]"
/>

## Flujo de procesamiento de solicitudes

<p class="arch-lede"><span class="lurus-tag"><Icon name="workflow" :size="13" /> Flujo de datos</span> Una solicitud LLM, desde la entrada hasta el upstream, atraviesa cinco controles: autenticación, limitación de tasa, cortacircuitos, facturación y registro.</p>

<ArchitectureDiagram title="Ruta de la solicitud" chart="graph LR
  Client[Client] --> Traefik[Traefik TLS]
  Traefik --> GW[API Gateway]
  GW --> Route[Enrutamiento inteligente]
  Route --> Up[IA upstream 50+ proveedores]
  Up --> Resp[Respuesta]
  GW -.-> Mid[Autenticación / Limitación de tasa / Cortacircuitos / Facturación / Registro]" />

El API Gateway empareja automáticamente los canales disponibles según el nombre del modelo, con soporte para ordenamiento por prioridad y asignación aleatoria ponderada. Cuando un canal de alta prioridad falla, el cortacircuitos por canal aísla automáticamente el canal averiado y el tráfico se conmuta a un canal alternativo.

## Visión general de la pila tecnológica

<p class="arch-lede"><span class="lurus-tag"><Icon name="package" :size="13" /> Elección tecnológica</span> Pila híbrida multilenguaje, eligiendo el runtime más adecuado según el negocio.</p>

| Capa | Elección tecnológica |
|------|---------|
| Servicios backend | Go (Gin), Rust, Python (FastAPI) |
| Frontend | React / Next.js / Vue 3 / Flutter |
| Aplicaciones de escritorio | Wails (Go + Web), un solo exe sin dependencias |
| Base de datos | PostgreSQL (CNPG), aislamiento por schema según servicio |
| Caché | Redis, aislamiento por DB según servicio |
| Mensajería | NATS JetStream (difusión de eventos) |
| Flujos de trabajo | Temporal (renovación de suscripciones / tareas programadas) |
| Autenticación de identidad | Casdoor (OIDC) |
| Contenedores | Imágenes mínimas scratch/alpine, construcción multietapa |
| Seguridad | Motor de políticas Kyverno + NetworkPolicy + escaneo de contenedores Trivy |

## Despliegue en nube híbrida

<p class="arch-lede"><span class="lurus-tag"><Icon name="cloud" :size="13" /> Forma de despliegue</span> Doble entrada de red pública + orquestación de despliegue mixto: equilibra la accesibilidad nacional y el coste operativo.</p>

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="cloud" :size="20" /></span>
    <div class="lurus-card__title">Clúster de nube híbrida</div>
    <p class="lurus-card__body">Doble entrada de red pública con Sanfengyun + Alibaba Cloud, despliegue mixto K3s + Docker-Compose, infraestructura aislada según el negocio.</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="git-merge" :size="20" /></span>
    <div class="lurus-card__title">Despliegue GitOps</div>
    <p class="lurus-card__body">Automatización completa GitHub Actions → GHCR → ArgoCD, con tag de imagen fijado en <code>main-&lt;sha7&gt;</code>.</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">Observabilidad de pila completa</div>
    <p class="lurus-card__body">Panel unificado Grafana + Prometheus + Jaeger + Loki, integrando métricas / logs / trazas.</p>
  </div>
</div>

## Diseño de seguridad

<p class="arch-lede"><span class="lurus-tag"><Icon name="shield-check" :size="13" /> Defensa en profundidad</span> Desde el transporte hasta el runtime de contenedores, siete capas de defensa en profundidad.</p>

| Capa | Medidas |
|------|------|
| **Transporte** | HTTPS en todo el sitio (TLS 1.3), renovación automática de certificados comodín |
| **Red** | Red VPN, aislamiento de namespaces con NetworkPolicy |
| **Autenticación** | [Autenticación de identidad unificada](/es/platform/auth/): modo dual OIDC JWT + API Key, Passkey WebAuthn, federación SSO empresarial |
| **Autorización** | Control de permisos por roles RBAC, aislamiento automático multitenant con GORM |
| **Cifrado** | ChaCha20-Poly1305 + SM4-GCM nacional (cumplimiento Xinchuang) |
| **Auditoría** | Logs JSON estructurados + trazas distribuidas OpenTelemetry |
| **Contenedores** | readOnlyRootFilesystem, drop ALL capabilities, runAsUser:65534 |

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Soberanía de los datos</p>
    <div class="lurus-callout__body"><p>Cifrado de extremo a extremo con SM4-GCM nacional, despliegue privado y datos que no salen del perímetro de la empresa. Un único conjunto de SSO / Passkey / MFA permite integrar el IdP existente de la empresa, compatible con el SDK de OpenAI, con coste de salida cero al exportar.</p></div>
  </div>
</div>

## Documentación detallada de la arquitectura

<script setup>
import InternalContent from '../../.vitepress/theme/components/InternalContent.vue'
</script>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="git-branch" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Fuente única de verdad</p>
    <div class="lurus-callout__body"><p>Los diagramas detallados de arquitectura se encuentran en el repositorio de gobernanza: <a href="https://github.com/hanmahong5-arch/lurus/blob/main/lurus.yaml">lurus.yaml</a> + <a href="https://github.com/hanmahong5-arch/lurus/blob/main/doc/architecture.md">doc/architecture.md</a>. Este sitio ya no incrusta el diagrama completo, para evitar mantener una doble fuente de verdad.</p></div>
  </div>
</div>

</div>

---

<NextSteps
  title="Próximos pasos"
  :steps="[
    { text: 'Lurus API — Gateway LLM unificado', link: '/es/guide/introduction', primary: true },
    { text: 'Motor de ejecución Kova', link: '/es/kova/' },
    { text: 'Motor de memoria MemX', link: '/es/memx/' },
    { text: 'Cuentas y facturación de Platform', link: '/es/platform/' },
    { text: 'Autenticación de identidad unificada', link: '/es/platform/auth/' },
  ]"
/>

<RelatedProducts product-id="arch" />

<style>
.arch-page .lurus-cards { margin: 1rem 0 1.4rem; }
.arch-page .arch-lede {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  color: var(--vp-c-text-2);
  font-size: 0.92rem;
  margin: 0.4rem 0 1rem;
}
.arch-page .arch-lede .lurus-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}
</style>
