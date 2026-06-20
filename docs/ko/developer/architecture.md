---
title: "시스템 아키텍처"
description: "Lurus 하이브리드 클라우드 아키텍처 개요. Kubernetes + GitOps 기반의 통합 서비스 배포 및 거버넌스 체계."
---

<ProductHero product-id="arch" />

<div class="arch-page">

Lurus는 하이브리드 클라우드 아키텍처를 채택하여 Kubernetes + GitOps 기반의 통합 서비스 배포 및 거버넌스 체계를 구축합니다. 12개 제품이 동일한 계정, 과금, 기억, LLM 게이트웨이, 가관측성 기반을 공유합니다. 독립 서비스를 단순히 짜맞춘 것이 아니라, 한 번에 명확하게 설명할 수 있는 하나의 그림입니다.

<MetricStats :items="[
  { label: '제품 라인', value: '12', hint: '동일 기반 공유' },
  { label: 'LLM 채널', value: '50+', hint: 'per-channel 서킷 브레이커' },
  { label: '배포', value: 'GitOps', hint: 'GHA → GHCR → ArgoCD' },
]" />

## 아키텍처 전경

<p class="arch-lede"><span class="lurus-tag"><Icon name="layers" :size="13" /> 계층 뷰</span> C 측 제품부터 운영 기반까지, 위에서 아래로 다섯 계층입니다. 하위 계층은 상위 계층에 능력을 제공하고, 상위 계층은 하위 계층의 구현을 인지하지 않습니다.</p>

<ArchitectureDiagram title="분층 아키텍처" chart="graph TB
  subgraph C[C 측 제품 계층]
    Lucrum[Lucrum 퀀트]
    Switch[Switch 데스크톱]
    Creator[Creator 콘텐츠]
    Lutu[Lutu 모바일]
  end
  subgraph B[B 측 제품 계층]
    API[Lurus API LLM 게이트웨이]
    Forge[Forge 워크벤치]
    Lumen[Lumen 개발자 도구]
  end
  subgraph E[핵심 엔진 계층]
    Kova[Kova 지속 실행 Rust]
    MemX[MemX 지능형 기억 Python]
  end
  subgraph I[인프라 계층]
    Platform[Platform 계정 과금]
    Auth[Auth OIDC]
    Notify[Notification 멀티 채널 알림]
  end
  subgraph O[운영 계층]
    Ops[K8s Traefik ArgoCD Prometheus Grafana Jaeger Loki]
  end
  C --> B
  B --> E
  E --> I
  I --> O" />

::: details 텍스트 버전 분층도 (접근성 / 복사용)
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

## 설계 원칙

<p class="arch-lede"><span class="lurus-tag"><Icon name="sparkles" :size="13" /> 다섯 가지 원칙</span> 진입 통합, 모델 통합, 배포 자동화, 가관측성 일체화, 장애 자가 복구.</p>

<CapabilityGrid
  accent="var(--lurus-color-arch)"
  title="핵심 설계"
  :items="[
    { title: '통합 게이트웨이', body: 'Traefik 진입, TLS 종료, 와일드카드 인증서 자동 관리', icon: 'network' },
    { title: '멀티 모델 AI 게이트웨이', body: '50+ LLM 채널 통합 연결(OpenAI / Claude / Gemini / Deepseek / Qwen / Moonshot 등), per-channel 서킷 브레이커 보호', icon: 'layers' },
    { title: 'GitOps 배포', body: 'GitHub Actions → GHCR 컨테이너 이미지 → ArgoCD 자동 동기화', icon: 'git-merge' },
    { title: '풀스택 가관측성', body: 'Prometheus 지표 + Grafana 대시보드 + Loki 로그 + Jaeger 분산 추적', icon: 'activity' },
    { title: '고가용성 설계', body: '채널 장애 자동 전환, 우선순위 + 가중치 라우팅, PodDisruptionBudget 보호', icon: 'shield-check' },
  ]"
/>

## 요청 처리 흐름

<p class="arch-lede"><span class="lurus-tag"><Icon name="workflow" :size="13" /> 데이터 흐름</span> 한 번의 LLM 요청이 진입에서 업스트림까지, 인증·레이트 리밋·서킷 브레이커·과금·로그 다섯 관문을 거칩니다.</p>

<ArchitectureDiagram title="요청 경로" chart="graph LR
  Client[Client] --> Traefik[Traefik TLS]
  Traefik --> GW[API Gateway]
  GW --> Route[지능형 라우팅]
  Route --> Up[업스트림 AI 50+ 제공자]
  Up --> Resp[응답]
  GW -.-> Mid[인증 / 레이트 리밋 / 서킷 브레이커 / 과금 / 로그]" />

API Gateway는 모델 이름에 따라 사용 가능한 채널을 자동으로 매칭하며, 우선순위 정렬과 가중치 랜덤 분배를 지원합니다. 고우선순위 채널에 장애가 발생하면 per-channel 서킷 브레이커가 장애 채널을 자동 격리하고, 트래픽이 대체 채널로 전환됩니다.

## 기술 스택 개요

<p class="arch-lede"><span class="lurus-tag"><Icon name="package" :size="13" /> 기술 선택</span> 다중 언어 하이브리드 스택, 업무에 따라 가장 적합한 런타임을 매칭합니다.</p>

| 계층 | 기술 선택 |
|------|---------|
| 백엔드 서비스 | Go (Gin), Rust, Python (FastAPI) |
| 프론트엔드 | React / Next.js / Vue 3 / Flutter |
| 데스크톱 앱 | Wails (Go + Web), 단일 exe 무의존성 |
| 데이터베이스 | PostgreSQL (CNPG), 서비스별 schema 격리 |
| 캐시 | Redis, 서비스별 DB 격리 |
| 메시지 | NATS JetStream (이벤트 브로드캐스트) |
| 워크플로 | Temporal (구독 갱신/예약 작업) |
| 신원 인증 | Casdoor (OIDC) |
| 컨테이너 | scratch/alpine 최소 이미지, 멀티 스테이지 빌드 |
| 보안 | Kyverno 정책 엔진 + NetworkPolicy + Trivy 컨테이너 스캔 |

## 하이브리드 클라우드 배포

<p class="arch-lede"><span class="lurus-tag"><Icon name="cloud" :size="13" /> 배포 형태</span> 이중 공인망 진입 + 혼합 배치 오케스트레이션. 국내 접근성과 운영 비용을 모두 고려합니다.</p>

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="cloud" :size="20" /></span>
    <div class="lurus-card__title">하이브리드 클라우드 클러스터</div>
    <p class="lurus-card__body">SanFengYun + Alibaba Cloud 이중 공인망 진입, K3s + Docker-Compose 혼합 배치, 업무별 인프라 격리.</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="git-merge" :size="20" /></span>
    <div class="lurus-card__title">GitOps 배포</div>
    <p class="lurus-card__body">GitHub Actions → GHCR → ArgoCD 전체 흐름 자동화, 이미지 tag는 <code>main-&lt;sha7&gt;</code>로 고정.</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">풀스택 가관측</div>
    <p class="lurus-card__body">Grafana + Prometheus + Jaeger + Loki 통합 패널, 지표 / 로그 / 트레이스 일체.</p>
  </div>
</div>

## 보안 설계

<p class="arch-lede"><span class="lurus-tag"><Icon name="shield-check" :size="13" /> 심층 방어</span> 전송부터 컨테이너 런타임까지, 7계층 심층 방어.</p>

| 계층 | 조치 |
|------|------|
| **전송** | 전체 HTTPS (TLS 1.3), 와일드카드 인증서 자동 갱신 |
| **네트워크** | VPN 네트워킹, NetworkPolicy 네임스페이스 격리 |
| **인증** | [통합 신원 인증](/ko/platform/auth/): OIDC JWT + API Key 이중 모드, WebAuthn Passkey, 기업 SSO 페더레이션 |
| **인가** | RBAC 역할 권한 제어, 멀티 테넌트 GORM 자동 격리 |
| **암호화** | ChaCha20-Poly1305 + 국산 암호 SM4-GCM(신창 컴플라이언스) |
| **감사** | 구조화 JSON 로그 + OpenTelemetry 분산 추적 |
| **컨테이너** | readOnlyRootFilesystem, drop ALL capabilities, runAsUser:65534 |

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">데이터 주권</p>
    <div class="lurus-callout__body"><p>국산 암호 SM4-GCM 전 구간 암호화, 온프레미스 배포, 데이터가 기업 경계를 벗어나지 않습니다. 하나의 SSO / Passkey / MFA로 기업의 기존 IdP에 연결할 수 있고, OpenAI SDK와 호환되며, 내보내기 시 종속 이탈 비용이 없습니다.</p></div>
  </div>
</div>

## 상세 아키텍처 문서

<script setup>
import InternalContent from '../../.vitepress/theme/components/InternalContent.vue'
</script>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="git-branch" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">단일 진실 공급원</p>
    <div class="lurus-callout__body"><p>상세 아키텍처 다이어그램은 governance repo에 있습니다: <a href="https://github.com/hanmahong5-arch/lurus/blob/main/lurus.yaml">lurus.yaml</a> + <a href="https://github.com/hanmahong5-arch/lurus/blob/main/doc/architecture.md">doc/architecture.md</a>. 본 사이트는 이중 진실 공급원 유지를 피하기 위해 전체 다이어그램을 더 이상 내장하지 않습니다.</p></div>
  </div>
</div>

</div>

---

<NextSteps
  title="다음 단계"
  :steps="[
    { text: 'Lurus API — LLM 통합 게이트웨이', link: '/ko/guide/introduction', primary: true },
    { text: 'Kova 실행 엔진', link: '/ko/kova/' },
    { text: 'MemX 기억 엔진', link: '/ko/memx/' },
    { text: 'Platform 계정 과금', link: '/ko/platform/' },
    { text: '통합 신원 인증', link: '/ko/platform/auth/' },
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
