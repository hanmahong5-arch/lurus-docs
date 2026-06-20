---
title: "System Architecture"
description: "Overview of the Lurus hybrid-cloud architecture: a unified service deployment and governance system built on Kubernetes + GitOps."
---

<ProductHero product-id="arch" />

<div class="arch-page">

Lurus uses a hybrid-cloud architecture, building a unified service deployment and governance system on Kubernetes + GitOps. All 12 products share the same account, billing, memory, LLM gateway, and observability foundation — not a patchwork of independent services, but a single picture you can explain in one pass.

<MetricStats :items="[
  { label: 'Product lines', value: '12', hint: 'Share one foundation' },
  { label: 'LLM channels', value: '50+', hint: 'Per-channel circuit breaking' },
  { label: 'Deployment', value: 'GitOps', hint: 'GHA → GHCR → ArgoCD' },
]" />

## Architecture Overview

<p class="arch-lede"><span class="lurus-tag"><Icon name="layers" :size="13" /> Layered view</span> Five layers top to bottom, from consumer-facing products down to the operations foundation; each layer provides capabilities to the one above, and the upper layers are unaware of how the lower ones are implemented.</p>

<ArchitectureDiagram title="Layered Architecture" chart="graph TB
  subgraph C[Consumer Product Layer]
    Lucrum[Lucrum Quant]
    Switch[Switch Desktop]
    Creator[Creator Content]
    Lutu[Lutu Mobile]
  end
  subgraph B[Business Product Layer]
    API[Lurus API LLM Gateway]
    Forge[Forge Workbench]
    Lumen[Lumen Developer Tools]
  end
  subgraph E[Core Engine Layer]
    Kova[Kova Durable Execution Rust]
    MemX[MemX Smart Memory Python]
  end
  subgraph I[Infrastructure Layer]
    Platform[Platform Account Billing]
    Auth[Auth OIDC]
    Notify[Notification Multi-channel]
  end
  subgraph O[Operations Layer]
    Ops[K8s Traefik ArgoCD Prometheus Grafana Jaeger Loki]
  end
  C --> B
  B --> E
  E --> I
  I --> O" />

::: details Text version of the layered diagram (for accessibility / copying)
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

## Design Principles

<p class="arch-lede"><span class="lurus-tag"><Icon name="sparkles" :size="13" /> Five principles</span> Unified entry, unified models, automated deployment, integrated observability, and self-healing failures.</p>

<CapabilityGrid
  accent="var(--lurus-color-arch)"
  title="Core Design"
  :items="[
    { title: 'Unified gateway', body: 'Traefik ingress, TLS termination, automatic wildcard certificate management', icon: 'network' },
    { title: 'Multi-model AI gateway', body: 'Unified access to 50+ LLM channels (OpenAI / Claude / Gemini / Deepseek / Qwen / Moonshot, etc.), with per-channel circuit-breaker protection', icon: 'layers' },
    { title: 'GitOps deployment', body: 'GitHub Actions → GHCR container images → ArgoCD auto-sync', icon: 'git-merge' },
    { title: 'Full-stack observability', body: 'Prometheus metrics + Grafana dashboards + Loki logs + Jaeger distributed tracing', icon: 'activity' },
    { title: 'High-availability design', body: 'Automatic channel failover, priority + weighted routing, PodDisruptionBudget protection', icon: 'shield-check' },
  ]"
/>

## Request Processing Flow

<p class="arch-lede"><span class="lurus-tag"><Icon name="workflow" :size="13" /> Data flow</span> A single LLM request travels from entry to upstream through five gates: authentication, rate limiting, circuit breaking, billing, and logging.</p>

<ArchitectureDiagram title="Request Path" chart="graph LR
  Client[Client] --> Traefik[Traefik TLS]
  Traefik --> GW[API Gateway]
  GW --> Route[Smart Routing]
  Route --> Up[Upstream AI 50+ Providers]
  Up --> Resp[Response]
  GW -.-> Mid[Auth / Rate Limit / Circuit Breaker / Billing / Logging]" />

The API Gateway automatically matches an available channel based on the model name, supporting priority ordering and weighted random distribution. When a high-priority channel fails, the per-channel circuit breaker automatically isolates the faulty channel and shifts traffic to a fallback channel.

## Technology Stack Overview

<p class="arch-lede"><span class="lurus-tag"><Icon name="package" :size="13" /> Tech choices</span> A polyglot hybrid stack, matching the most appropriate runtime to each workload.</p>

| Layer | Technology |
|------|---------|
| Backend services | Go (Gin), Rust, Python (FastAPI) |
| Frontend | React / Next.js / Vue 3 / Flutter |
| Desktop apps | Wails (Go + Web), single dependency-free exe |
| Database | PostgreSQL (CNPG), per-service schema isolation |
| Cache | Redis, per-service DB isolation |
| Messaging | NATS JetStream (event broadcasting) |
| Workflow | Temporal (subscription renewals / scheduled tasks) |
| Identity | Casdoor (OIDC) |
| Containers | Minimal scratch/alpine images, multi-stage builds |
| Security | Kyverno policy engine + NetworkPolicy + Trivy container scanning |

## Hybrid-Cloud Deployment

<p class="arch-lede"><span class="lurus-tag"><Icon name="cloud" :size="13" /> Deployment topology</span> Dual public-network ingress + mixed orchestration — balancing domestic reachability with operational cost.</p>

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="cloud" :size="20" /></span>
    <div class="lurus-card__title">Hybrid-cloud cluster</div>
    <p class="lurus-card__body">Dual public ingress across Sanfengyun + Alibaba Cloud, mixed K3s + Docker-Compose deployment, with infrastructure isolated per workload.</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="git-merge" :size="20" /></span>
    <div class="lurus-card__title">GitOps deployment</div>
    <p class="lurus-card__body">End-to-end automation via GitHub Actions → GHCR → ArgoCD, with image tags locked to <code>main-&lt;sha7&gt;</code>.</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">Full-stack observability</div>
    <p class="lurus-card__body">A unified Grafana + Prometheus + Jaeger + Loki panel, integrating metrics, logs, and traces.</p>
  </div>
</div>

## Security Design

<p class="arch-lede"><span class="lurus-tag"><Icon name="shield-check" :size="13" /> Defense in depth</span> Seven layers of defense in depth, from transport to container runtime.</p>

| Layer | Measure |
|------|------|
| **Transport** | Site-wide HTTPS (TLS 1.3), automatic wildcard certificate renewal |
| **Network** | VPN networking, NetworkPolicy namespace isolation |
| **Authentication** | [Unified identity authentication](/en/platform/auth/): dual-mode OIDC JWT + API Key, WebAuthn Passkey, enterprise SSO federation |
| **Authorization** | RBAC role-based access control, automatic multi-tenant GORM isolation |
| **Encryption** | ChaCha20-Poly1305 + SM4-GCM (Chinese state cryptography, compliance) |
| **Audit** | Structured JSON logs + OpenTelemetry distributed tracing |
| **Containers** | readOnlyRootFilesystem, drop ALL capabilities, runAsUser:65534 |

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Data sovereignty</p>
    <div class="lurus-callout__body"><p>End-to-end SM4-GCM encryption, on-premises deployment, and data that never leaves the enterprise boundary. A single SSO / Passkey / MFA setup integrates with your existing IdP, is compatible with the OpenAI SDK, and offers zero exit cost for export.</p></div>
  </div>
</div>

## Detailed Architecture Docs

<script setup>
import InternalContent from '../../.vitepress/theme/components/InternalContent.vue'
</script>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="git-branch" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Single source of truth</p>
    <div class="lurus-callout__body"><p>The detailed architecture diagrams live in the governance repo: <a href="https://github.com/hanmahong5-arch/lurus/blob/main/lurus.yaml">lurus.yaml</a> + <a href="https://github.com/hanmahong5-arch/lurus/blob/main/doc/architecture.md">doc/architecture.md</a>. This site no longer embeds the full diagram, to avoid maintaining two sources of truth.</p></div>
  </div>
</div>

</div>

---

<NextSteps
  title="Next Steps"
  :steps="[
    { text: 'Lurus API — Unified LLM Gateway', link: '/en/guide/introduction', primary: true },
    { text: 'Kova Execution Engine', link: '/en/kova/' },
    { text: 'MemX Memory Engine', link: '/en/memx/' },
    { text: 'Platform Account & Billing', link: '/en/platform/' },
    { text: 'Unified Identity Authentication', link: '/en/platform/auth/' },
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
