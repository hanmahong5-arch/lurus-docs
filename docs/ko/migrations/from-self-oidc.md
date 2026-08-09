---
title: "자체 구축 Keycloak / Auth0에서 Lurus Auth로 마이그레이션"
description: "SCIM 사용자 마이그레이션, SSO 페더레이션, 점진적 전환의 완전한 경로."
---

<div class="mig-oidc-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> 자체 구축 OIDC에서 마이그레이션</span>
  <h1 class="lurus-section-head__title">자체 구축 OIDC에서 Lurus Auth로 마이그레이션</h1>
  <p class="lurus-section-head__lede">이미 IdP(Keycloak / Auth0 / Okta / Azure AD)를 보유한 기업이 직원은 계속 회사 계정으로 로그인하면서, 동시에 신원 계층을 Lurus에 위탁하고자 하는 경우입니다.</p>
</div>

## <Icon name="git-branch" :size="20" /> 두 가지 전략

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="building-2" :size="20" /></span>
    <div class="lurus-card__title">전략 A: Lurus Auth를 2차 IdP로(권장)</div>
    <p class="lurus-card__body">기업 IdP의 사용자 라이프사이클만 관리하면 되며, Lurus 제품은 OIDC 페더레이션을 통해 신원을 읽어 옵니다.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="import" :size="20" /></span>
    <div class="lurus-card__title">전략 B: 완전 이전</div>
    <p class="lurus-card__body">기존 Keycloak/Auth0를 SCIM으로 Lurus Auth(Casdoor)에 내보내어 단일 진실 공급원으로 삼습니다.</p>
  </div>
</div>

### 전략 A — 페더레이션 토폴로지

<ArchitectureDiagram title="전략 A: 페더레이션" chart="graph LR
  IDP[기업 IdP 기존] -->|OIDC 페더레이션| LA[Lurus Auth]
  LA --> P[모든 Lurus 제품]" />

### 전략 B — 이전 토폴로지

<ArchitectureDiagram title="전략 B: 이전" chart="graph LR
  KC[기존 Keycloak/Auth0] -->|SCIM 내보내기| LA[Lurus Auth · Casdoor]
  LA --> D[모든 다운스트림]" />

## <Icon name="building-2" :size="20" /> 전략 A 단계(권장)

<ol class="lurus-steps">
<li>

**Lurus 콘솔에서 페더레이션 연결 생성** — `identity.lurus.cn` 접속 → 기업 설정 → 신원 제공자 → 신규 생성 → OIDC 선택. 기업 IdP의 다음 항목을 입력합니다:

- Issuer URL
- Client ID
- Client Secret
- 콜백 URL(Lurus가 제공)

</li>
<li>

**Claim 매핑** — 기업 IdP의 속성을 Lurus 사용자에 매핑합니다.

```yaml
# 将企业 IdP 的属性映射到 Lurus 用户
email:       email
display:     name
department:  department   # custom claim
```

</li>
<li>

**점진적 전환** — 기업 IdP에서 먼저 직원 5%에게 Lurus 로그인 버튼 사용을 허용합니다. 1주간 검증 → 전 직원으로 확대합니다.

</li>
</ol>

## <Icon name="import" :size="20" /> 전략 B 단계

<ol class="lurus-steps">
<li>

**SCIM 내보내기** — Keycloak에서 사용자를 JSON으로 내보냅니다:

```bash
./kcadm.sh get users -r myrealm --fields username,email,firstName,lastName -f json > users.json
```

</li>
<li>

**Lurus로 일괄 가져오기**

<ApiEndpoint method="POST" path="/admin/v1/scim/users:batchImport" description="사용자 일괄 가져오기(identity.lurus.cn)" />

```bash
curl -X POST https://identity.lurus.cn/admin/v1/scim/users:batchImport \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d @users.json
```

</li>
<li>

**비밀번호 정책** — Lurus는 기본적으로 비밀번호를 마이그레이션하지 않으며(해시 비호환), 최초 로그인 시 "비밀번호 찾기" 흐름을 강제합니다. SSO 페더레이션을 사용하면 비밀번호 마이그레이션은 불필요합니다.

</li>
</ol>

## <Icon name="shield-check" :size="20" /> SSO 페더레이션의 장점

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="building-2" :size="20" /></span>
    <div class="lurus-card__title">기업 컴플라이언스</div>
    <p class="lurus-card__body">계정 라이프사이클이 전적으로 기업에 있습니다.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="user-check" :size="20" /></span>
    <div class="lurus-card__title">퇴사 즉시 차단</div>
    <p class="lurus-card__body">기업 IdP에서 비활성화 → Lurus 로그인이 즉시 불가합니다.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="history" :size="20" /></span>
    <div class="lurus-card__title">감사 통합</div>
    <p class="lurus-card__body">로그인 로그가 기업 IdP에 있습니다.</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="shield" :size="20" /></span>
    <div class="lurus-card__title">MFA 재사용</div>
    <p class="lurus-card__body">기업이 이미 보유한 MFA 정책이 적용됩니다.</p>
  </div>
</div>

## <Icon name="life-buoy" :size="20" /> 자주 묻는 질문

<details class="lurus-faq-item">
<summary>세션이 충돌하나요?</summary>

Lurus는 독립적인 session cookie를 사용하므로 기존 시스템에 영향을 주지 않습니다.

</details>

<details class="lurus-faq-item">
<summary>PAT / JWT를 유지할 수 있나요?</summary>

가능합니다. API 수준 Token은 SSO 마이그레이션의 영향을 받지 않습니다.

</details>

<details class="lurus-faq-item">
<summary>감사 로그는 어떻게 내보내나요?</summary>

모든 신원 이벤트는 아래 엔드포인트를 통해 일괄 내보낼 수 있습니다:

<ApiEndpoint method="POST" path="/admin/v1/audit:export" description="신원 이벤트 일괄 내보내기" />

</details>

## 다음 단계

<NextSteps :steps="[
  { text: 'Lurus Auth 개요', link: '/ko/platform/auth/', primary: true },
  { text: 'OIDC / OAuth2', link: '/ko/platform/auth/oidc' },
  { text: '기업 배포 형태', link: '/ko/solutions/enterprise-deploy' },
]" />

</div>
