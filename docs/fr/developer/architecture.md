---
title: "Architecture du système"
description: "Vue d’ensemble de l’architecture cloud hybride de Lurus, fondée sur un système unifié de déploiement et de gouvernance des services basé sur Kubernetes + GitOps."
---

<ProductHero product-id="arch" />

<div class="arch-page">

Lurus adopte une architecture cloud hybride et construit un système unifié de déploiement et de gouvernance des services basé sur Kubernetes + GitOps. Les 12 produits partagent un même socle de compte, facturation, mémoire, passerelle LLM et observabilité — non pas un assemblage de services indépendants, mais un schéma unique que l’on peut expliquer d’un seul tenant.

<MetricStats :items="[
  { label: 'Lignes de produits', value: '12', hint: 'partagent le même socle' },
  { label: 'Canaux LLM', value: '50+', hint: 'coupe-circuit par canal' },
  { label: 'Déploiement', value: 'GitOps', hint: 'GHA → GHCR → ArgoCD' },
]" />

## Panorama de l’architecture

<p class="arch-lede"><span class="lurus-tag"><Icon name="layers" :size="13" /> Vue en couches</span> Des produits grand public au socle d’exploitation, cinq couches de haut en bas ; chaque couche inférieure fournit des capacités à la couche supérieure, qui n’a pas connaissance de l’implémentation sous-jacente.</p>

<ArchitectureDiagram title="Architecture en couches" chart="graph TB
  subgraph C[Couche produits grand public]
    Lucrum[Lucrum quantitatif]
    Switch[Switch desktop]
    Creator[Creator contenu]
    Lutu[Lutu mobile]
  end
  subgraph B[Couche produits entreprise]
    API[Lurus API passerelle LLM]
    Forge[Forge atelier]
    Lumen[Lumen outils développeur]
  end
  subgraph E[Couche moteurs cœur]
    Kova[Kova exécution durable Rust]
    MemX[MemX mémoire intelligente Python]
  end
  subgraph I[Couche infrastructure]
    Platform[Platform compte facturation]
    Auth[Auth OIDC]
    Notify[Notification notifications multicanal]
  end
  subgraph O[Couche exploitation]
    Ops[K8s Traefik ArgoCD Prometheus Grafana Jaeger Loki]
  end
  C --> B
  B --> E
  E --> I
  I --> O" />

::: details Version texte du schéma en couches (accessibilité / copie)
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

## Principes de conception

<p class="arch-lede"><span class="lurus-tag"><Icon name="sparkles" :size="13" /> Cinq principes</span> Point d’entrée unifié, modèles unifiés, déploiement automatisé, observabilité intégrée, auto-réparation en cas de panne.</p>

<CapabilityGrid
  accent="var(--lurus-color-arch)"
  title="Conception cœur"
  :items="[
    { title: 'Passerelle unifiée', body: 'Point d’entrée Traefik, terminaison TLS, gestion automatique des certificats wildcard', icon: 'network' },
    { title: 'Passerelle IA multi-modèles', body: 'Accès unifié à 50+ canaux LLM (OpenAI / Claude / Gemini / Deepseek / Qwen / Moonshot, etc.), protection par coupe-circuit par canal', icon: 'layers' },
    { title: 'Déploiement GitOps', body: 'GitHub Actions → images conteneur GHCR → synchronisation automatique ArgoCD', icon: 'git-merge' },
    { title: 'Observabilité full-stack', body: 'Métriques Prometheus + tableaux de bord Grafana + journaux Loki + traçage distribué Jaeger', icon: 'activity' },
    { title: 'Conception haute disponibilité', body: 'Bascule automatique en cas de panne de canal, routage par priorité + pondération, protection PodDisruptionBudget', icon: 'shield-check' },
  ]"
/>

## Flux de traitement des requêtes

<p class="arch-lede"><span class="lurus-tag"><Icon name="workflow" :size="13" /> Flux de données</span> Une requête LLM, de l’entrée jusqu’à l’amont, traverse cinq points de contrôle : authentification, limitation de débit, coupe-circuit, facturation, journalisation.</p>

<ArchitectureDiagram title="Chaîne de requête" chart="graph LR
  Client[Client] --> Traefik[Traefik TLS]
  Traefik --> GW[API Gateway]
  GW --> Route[Routage intelligent]
  Route --> Up[IA amont 50+ fournisseurs]
  Up --> Resp[Réponse]
  GW -.-> Mid[Authentification / Limitation / Coupe-circuit / Facturation / Journalisation]" />

L’API Gateway associe automatiquement un canal disponible selon le nom du modèle, avec prise en charge du tri par priorité et de la répartition aléatoire pondérée. Lorsqu’un canal de haute priorité tombe en panne, le coupe-circuit par canal isole automatiquement le canal défaillant et bascule le trafic vers un canal de secours.

## Vue d’ensemble de la pile technique

<p class="arch-lede"><span class="lurus-tag"><Icon name="package" :size="13" /> Choix techniques</span> Pile hybride multilingue, qui associe à chaque métier le runtime le plus adapté.</p>

| Couche | Choix techniques |
|------|---------|
| Services backend | Go (Gin), Rust, Python (FastAPI) |
| Frontend | React / Next.js / Vue 3 / Flutter |
| Applications desktop | Wails (Go + Web), un seul exe sans dépendance |
| Base de données | PostgreSQL (CNPG), isolation par schéma de service |
| Cache | Redis, isolation par DB de service |
| Messagerie | NATS JetStream (diffusion d’événements) |
| Workflow | Temporal (renouvellements d’abonnement / tâches planifiées) |
| Authentification d’identité | Casdoor (OIDC) |
| Conteneurs | images minimales scratch/alpine, build multi-étapes |
| Sécurité | moteur de politiques Kyverno + NetworkPolicy + scan de conteneurs Trivy |

## Déploiement cloud hybride

<p class="arch-lede"><span class="lurus-tag"><Icon name="cloud" :size="13" /> Forme de déploiement</span> Double point d’entrée public + orchestration en déploiement mixte — concilie accessibilité en Chine et coût d’exploitation.</p>

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="cloud" :size="20" /></span>
    <div class="lurus-card__title">Cluster cloud hybride</div>
    <p class="lurus-card__body">Double point d’entrée public Sanfeng Cloud + Alibaba Cloud, déploiement mixte K3s + Docker-Compose, infrastructure isolée par métier.</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="git-merge" :size="20" /></span>
    <div class="lurus-card__title">Déploiement GitOps</div>
    <p class="lurus-card__body">GitHub Actions → GHCR → ArgoCD, automatisation de bout en bout, tag d’image verrouillé sur <code>main-&lt;sha7&gt;</code>.</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">Observabilité full-stack</div>
    <p class="lurus-card__body">Tableau de bord unifié Grafana + Prometheus + Jaeger + Loki, métriques / journaux / traces intégrés.</p>
  </div>
</div>

## Conception de la sécurité

<p class="arch-lede"><span class="lurus-tag"><Icon name="shield-check" :size="13" /> Défense en profondeur</span> Du transport au runtime des conteneurs, sept couches de défense en profondeur.</p>

| Couche | Mesures |
|------|------|
| **Transport** | HTTPS sur tout le site (TLS 1.3), renouvellement automatique des certificats wildcard |
| **Réseau** | Réseau VPN, isolation des namespaces par NetworkPolicy |
| **Authentification** | [Authentification d’identité unifiée](/fr/platform/auth/) : double mode OIDC JWT + API Key, WebAuthn Passkey, fédération SSO entreprise |
| **Autorisation** | Contrôle d’accès par rôles RBAC, isolation multitenant automatique via GORM |
| **Chiffrement** | ChaCha20-Poly1305 + SM4-GCM (conformité Xinchuang) |
| **Audit** | Journaux JSON structurés + traçage distribué OpenTelemetry |
| **Conteneurs** | readOnlyRootFilesystem, drop ALL capabilities, runAsUser:65534 |

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Souveraineté des données</p>
    <div class="lurus-callout__body"><p>Chiffrement de bout en bout SM4-GCM, déploiement on-premise, données ne quittant jamais le périmètre de l’entreprise. Un même socle SSO / Passkey / MFA suffit à se raccorder à l’IdP existant de l’entreprise, compatible avec le SDK OpenAI, export sans coût de sortie.</p></div>
  </div>
</div>

## Documentation d’architecture détaillée

<script setup>
import InternalContent from '../../.vitepress/theme/components/InternalContent.vue'
</script>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="git-branch" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Source unique de vérité</p>
    <div class="lurus-callout__body"><p>Les schémas d’architecture détaillés se trouvent dans le repo de gouvernance : <a href="https://github.com/hanmahong5-arch/lurus/blob/main/lurus.yaml">lurus.yaml</a> + <a href="https://github.com/hanmahong5-arch/lurus/blob/main/doc/architecture.md">doc/architecture.md</a>. Ce site n’intègre plus le schéma complet, afin d’éviter la maintenance d’une double source de vérité.</p></div>
  </div>
</div>

</div>

---

<NextSteps
  title="Étapes suivantes"
  :steps="[
    { text: 'Lurus API — passerelle LLM unifiée', link: '/fr/guide/introduction', primary: true },
    { text: 'Moteur d’exécution Kova', link: '/fr/kova/' },
    { text: 'Moteur de mémoire MemX', link: '/fr/memx/' },
    { text: 'Platform compte et facturation', link: '/fr/platform/' },
    { text: 'Authentification d’identité unifiée', link: '/fr/platform/auth/' },
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
