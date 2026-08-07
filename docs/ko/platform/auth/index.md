---
title: 통합 신원 인증
description: Lurus 전 제품군이 공유하는 신원 체계 — 한 번 로그인으로 전 사이트 통행, SSO, Passkey, 다중 인증, API 인증 및 기업 SSO 페더레이션 지원.
---

<div class="auth-page">

<ProductHero product-id="auth" />

**한 번 로그인, 전 사이트 통행.** Lurus API, Lucrum, Switch, Creator, Lutu, Admin, Forge 등 모든 제품이 동일한 신원 체계를 공유합니다 — 사용자가 어느 제품에서든 로그인하면 나머지 제품이 자동으로 인식하고, 권한과 할당량은 계정 단위로 통합 정산되며, 기업 고객은 자사 SSO를 연동해 직원 온보딩을 완료할 수 있습니다.

이 체계는 `auth.lurus.cn` 에서 서비스를 제공하며, 오픈소스 신원 인프라 [Casdoor](https://casdoor.com) 을 기반으로 자체 배포되어 OIDC / OAuth2 / SAML 표준 프로토콜을 완전히 구현합니다. 사용자 데이터는 전 과정에서 Lurus 자체 K8s 클러스터 내에 보관됩니다.

::: tip 빠른 진입점
- 사용자 셀프 관리: [auth.lurus.cn](https://auth.lurus.cn) — 비밀번호 변경, Passkey 관리, MFA 바인딩, 로그인 기록 조회
- 조직/프로젝트 관리: [auth.lurus.cn](https://auth.lurus.cn)(Casdoor 조직 콘솔) — 기업 고객 멤버 초대, 권한 할당, 감사; 또는 영업에 문의하여 기업 조직 관리 활성화
:::

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="plug-zap" :size="14" /> 연동</span>
  <h2 class="lurus-section-head__title">접속점</h2>
  <p class="lurus-section-head__lede">다섯 개의 표준 엔드포인트가 디스커버리, 권한 부여, 토큰 교환 및 사용자 정보 조회를 포괄합니다.</p>
</div>

| 엔드포인트 | URL | 설명 |
|------|-----|------|
| 콘솔 | `https://auth.lurus.cn` | 사용자 셀프 계정·보안 기기·세션 관리 |
| OIDC Discovery | `https://auth.lurus.cn/.well-known/openid-configuration` | SDK 자동 발견, 모든 엔드포인트와 지원 기능 포함 |
| OAuth2 권한 부여 | `https://auth.lurus.cn/oauth/v2/authorize` | 표준 권한 부여 코드 / PKCE 플로우 진입점 |
| Token 엔드포인트 | `https://auth.lurus.cn/oauth/v2/token` | access token / refresh token 교환 |
| 사용자 정보 | `https://auth.lurus.cn/oidc/v1/userinfo` | 현재 사용자 claims 조회 |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> 기능</span>
  <h2 class="lurus-section-head__title">핵심 기능</h2>
  <p class="lurus-section-head__lede">싱글 사인온부터 기업 SSO 페더레이션까지, 하나의 체계로 개인과 B2B 전 시나리오를 포괄합니다.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-auth)"
  :items="[
    { title: 'SSO 싱글 사인온', body: '한 번 로그인하면 모든 Lurus 제품에 접근할 수 있어 자격 증명을 반복 입력할 필요가 없습니다. 표준 OIDC session 기반으로 애플리케이션 간 사일런트 갱신을 지원합니다.', icon: 'key-round' },
    { title: '다중 인증 / Passkey', body: 'TOTP(Authenticator App), U2F 하드웨어 키 및 Passkey(WebAuthn 패스워드리스 로그인)를 지원합니다. MFA 정책은 조직 또는 프로젝트 수준에서 강제 적용할 수 있습니다.', icon: 'shield' },
    { title: '소셜 로그인', body: 'GitHub, Google, 위챗 등 서드파티 신원 제공자를 연동할 수 있으며, 사용자가 외부 계정으로 바인딩을 완료하면 Lurus 계정과 연결됩니다.', icon: 'users' },
    { title: 'RBAC 와 조직 계층', body: '역할-권한 모델(Role-Based Access Control). 권한은 Grant 를 통해 특정 사용자 또는 서비스 계정에 부여되며, 프로젝트 및 애플리케이션 단위까지 정밀하게 지정할 수 있습니다.', icon: 'user-check' },
    { title: 'B2B 멀티테넌트', body: 'Instance 하위에 여러 Organization 을 생성할 수 있어 기업 고객 격리를 자연스럽게 지원합니다. 각 조직은 브랜드, 로그인 정책, IdP 페더레이션을 독립적으로 구성할 수 있습니다.', icon: 'building-2' },
    { title: 'OIDC / OAuth2 / SAML', body: '3대 표준 프로토콜을 완전히 구현하여 시중 주요 SDK 및 프레임워크와 호환되며, Go, Rust, TypeScript, Flutter 애플리케이션에 매끄럽게 통합됩니다.', icon: 'link' },
    { title: '감사 로그', body: '로그인, MFA 변경, 권한 부여, 비밀번호 재설정 등 핵심 작업은 모두 조회 가능한 불변 로그로 기록되어 컴플라이언스 요구사항을 충족합니다.', icon: 'history' },
    { title: 'Actions 확장', body: '인증 플로우의 핵심 지점에 커스텀 로직(예: 사용자 속성 동기화, 로그인 조건 제한)을 주입할 수 있으며, Casdoor 본체를 fork 할 필요가 없습니다.', icon: 'workflow' },
  ]"
/>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> 모델</span>
  <h2 class="lurus-section-head__title">핵심 개념 요약</h2>
  <p class="lurus-section-head__lede">신원 체계는 다음 계층으로 구성됩니다. 개발자와 관리자는 이 몇 가지 객체 계층이 Lurus 제품에 어떻게 매핑되는지 이해해야 합니다.</p>
</div>

<ArchitectureDiagram
  title="객체 모델 계층"
  chart="graph TD; Instance[Instance · lurus-prod] --> Org[Organization · lurus.cn]; Org --> User[User · Human / Service]; Org --> Project[Project · 제품마다 하나]; Project --> App[Application · client_id]; Project --> Role[Role]; User -. User Grant .-> Role"
/>

| 개념 | 의미 | Lurus 에서의 매핑 |
|------|------|-----------------|
| **Instance** | 최상위 배포 단위, 독립 데이터베이스와 구성 | Lurus 는 단일 Instance 를 운영하며 `auth.lurus.cn` 에 호스팅됩니다 |
| **Organization** | 테넌트 격리 단위, 독립 사용자 저장소와 로그인 정책 | 개인 사용자는 `lurus.cn` 메인 조직에 속하고, 기업 고객은 독립 Organization 을 신청하여 자사 도메인과 IdP 를 구성할 수 있습니다 |
| **Project** | Organization 하위의 애플리케이션 집합, roles 와 grants 를 통합 관리 | 각 제품군(Lurus API, Lucrum, Switch, Forge…)이 하나의 Project 에 대응합니다 |
| **Application** | Project 내의 구체적 클라이언트, `client_id` / `client_secret` 보유 | 각 프런트엔드, 데스크톱, 서버를 각각 하나의 Application 으로 등록합니다 |
| **User** | 로그인 가능한 계정, Human(실제 사용자)과 Service User(머신)로 구분 | 최종 사용자는 Human; 백엔드 서비스 간 호출은 Service User + JWT Profile 사용 |
| **Grant** | Project Role 을 특정 User 에게 부여하는 바인딩 관계 | 사용자의 구체적 제품 내 권한 등급을 제어합니다; [auth.lurus.cn](https://auth.lurus.cn)(Casdoor) 조직 설정을 기준으로 합니다 |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="book-open" :size="14" /> 내비게이션</span>
  <h2 class="lurus-section-head__title">이 섹션 목차</h2>
  <p class="lurus-section-head__lede">개념부터 통합까지, 필요에 따라 각 계층을 깊이 살펴보세요.</p>
</div>

<div class="lurus-cards lurus-cards--2">
  <a class="lurus-card lurus-card--auth" href="/ko/platform/auth/concepts">
    <span class="lurus-card__icon"><Icon name="layers" :size="20" /></span>
    <div class="lurus-card__title">핵심 개념</div>
    <p class="lurus-card__body">Instance / Organization / Project / User / Application / Grant 상세 설명.</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="/ko/platform/auth/login">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">로그인과 다중 인증</div>
    <p class="lurus-card__body">비밀번호 로그인, Passkey, 소셜 로그인, MFA 구성.</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="/ko/platform/auth/oidc">
    <span class="lurus-card__icon"><Icon name="link" :size="20" /></span>
    <div class="lurus-card__title">OIDC / OAuth2 통합</div>
    <p class="lurus-card__body">Discovery, scopes, claims, 권한 부여 코드 플로우, PKCE.</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="/ko/platform/auth/api-auth">
    <span class="lurus-card__icon"><Icon name="key" :size="20" /></span>
    <div class="lurus-card__title">API 인증</div>
    <p class="lurus-card__body">Personal Access Token, Service User, JWT Profile, token 검증.</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="/ko/platform/auth/console">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">콘솔 관리</div>
    <p class="lurus-card__body">조직 / 프로젝트 / 애플리케이션 / 사용자의 일상 관리 작업.</p>
  </a>
</div>

---

## 다른 Lurus 제품과의 연계

| 시나리오 | 경로 |
|------|------|
| API Key 를 받은 후 OAuth token 으로 Lurus API 호출 | [OIDC 통합](/ko/platform/auth/oidc) → [Chat Completions](/ko/api/chat-completions) |
| Switch 에서 로그인하여 Lurus 계정 구성 동기화 | [로그인과 MFA](/ko/platform/auth/login) → [Switch 구성 설명](/ko/switch/configuration) |
| Forge 관리자의 팀 권한 구성 | [콘솔 관리](/ko/platform/auth/console) → [Forge](/forge/) |
| 개발자가 백엔드 서비스를 작성하여 Platform 내부 API 호출 | [API 인증 (PAT/JWT)](/ko/platform/auth/api-auth) |
| 기업 고객이 자사 Azure AD / 페이슈로 로그인 | [로그인과 MFA — Identity Brokering](/ko/platform/auth/login) |

---

## 더 읽어보기

오픈소스 신원 인프라 Casdoor 을 기반으로 구축되었습니다. 하위 메커니즘이나 SDK 세부 사항을 더 깊이 파악하려면 업스트림 문서를 참고하세요:

- [Casdoor 문서 홈](https://casdoor.com/docs) — 빠른 시작, 배포 모드, SDK 통합 가이드
- [핵심 개념](https://casdoor.com/docs/concepts) — Instance, Organization, Project, User, Grant 원리 설명
- [API 참조](https://casdoor.com/docs/apis) — Management API, Auth API, Admin API 의 REST / gRPC 엔드포인트 문서

<RelatedProducts product-id="auth" />

</div>

<style scoped>
.auth-page .lurus-section-head {
  margin-top: 8px;
}
</style>
