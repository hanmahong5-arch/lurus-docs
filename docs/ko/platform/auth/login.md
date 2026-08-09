---
title: 로그인 및 다단계 인증 | Casdoor 신원 인증
description: Lurus가 지원하는 로그인 방식(비밀번호, Passkey, 소셜 로그인, 기업 SSO)과 다단계 인증 정책.
---

<div class="auth-login">

# 로그인 및 다단계 인증

Lurus의 모든 제품은 동일한 신원 인증 인프라(**Casdoor**, 대외적으로 `identity.lurus.cn`)를 공유합니다. Lurus API, Switch, Lucrum, Forge 중 무엇을 사용하든 로그인은 동일한 입구를 거치며, 한 번 로그인하면 전 라인이 연동됩니다.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="git-merge" :size="14" /> 흐름</span>
  <h2 class="lurus-section-head__title">1. 로그인 흐름 개요</h2>
  <p class="lurus-section-head__lede">OIDC Authorization Code Flow + PKCE, 클라이언트는 어떠한 키도 저장하지 않습니다.</p>
</div>

사용자가 임의의 제품에 접근할 때 유효한 세션이 없으면, 애플리케이션은 브라우저를 `identity.lurus.cn`으로 리디렉션하여 검증한 뒤 인가 코드를 가지고 되돌아옵니다.

<ArchitectureDiagram
  title="Authorization Code + PKCE 흐름"
  chart="sequenceDiagram; participant B as 사용자 브라우저; participant P as Lurus 제품; participant A as identity.lurus.cn; B->>P: 제품 페이지 접근; P-->>B: 302 리디렉션; B->>A: GET /authorize (client_id, code_challenge, scope); A-->>B: 로그인 페이지 이메일/Passkey/SSO; A-->>B: 302 redirect_uri?code; B->>P: 인가 코드; P->>A: POST /token (code + code_verifier); A-->>P: access_token / id_token; P-->>B: 로그인 성공, 제품 진입"
/>

**PKCE**: 클라이언트는 인가 요청을 보내기 전에 무작위 `code_verifier`를 생성하고, 그 SHA-256 해시 `code_challenge`를 요청과 함께 전송합니다. 인가 코드를 받은 뒤 원래의 verifier로 token을 교환하며, 서버는 둘이 일치하는지 검증해야만 발급합니다. 인가 코드가 가로채여도 token으로 교환할 수 없습니다.

::: info 세션 유효 기간
기본적으로 Access Token은 12시간, Refresh Token은 무중단으로 갱신할 수 있습니다. 구체적인 기간은 조직 정책에 따라 결정되며, 관리자는 콘솔에서 조정할 수 있습니다.
:::

---

## 2. 지원하는 로그인 방식

| 로그인 방식 | 설명 | 적용 시나리오 |
|---------|------|---------|
| **이메일 + 비밀번호** | 표준 가입, 비밀번호는 복잡도 정책 충족 | 모든 사용자 |
| **휴대폰 번호 + 인증 코드** | SMS OTP(관리자 활성화 필요) | 조직 설정에 따라 |
| **Passkey(WebAuthn)** | 비밀번호 없음, 기기 생체 인식 또는 하드웨어 키 | 주요 사용자에게 권장 |
| **GitHub / Google / Microsoft·Azure AD / Apple** | 소셜 로그인(OAuth2 / OIDC) | 조직 설정에 따라 |
| **기업 SSO(OIDC/SAML 2.0)** | B2B 고객이 자체 IdP 연동(Okta, 飞书, 企业微信) | 기업 고객 |
| **LDAP** | 기업 디렉터리 서비스 직접 연결 | 온프레미스 배포 고객 |

::: tip 권장 우선순위
Passkey > 소셜 로그인 > 이메일 비밀번호. Passkey는 비밀번호를 기억할 필요가 없고 피싱에 강해 보안성이 가장 높습니다.
:::

---

## 3. Passkey / WebAuthn

**원리**: **WebAuthn / FIDO2** 기반으로, 비대칭 암호화가 비밀번호를 대체합니다. 등록 시 기기가 키 쌍을 생성하며, **개인 키는 기기에 남고**(생체 인식/PIN으로 보호) 공개 키는 `identity.lurus.cn`에 업로드됩니다. 로그인 시 서버가 챌린지를 보내면 기기 개인 키가 서명하고 서버가 공개 키로 검증합니다. 전 과정 **비밀번호 전송이 전혀 없으며**, 데이터베이스가 유출되어도 공개 키만 얻을 수 있습니다.

**등록(사용자 조작)**:

<ol class="lurus-steps">
<li><code>identity.lurus.cn</code>에 로그인합니다.</li>
<li><strong>계정 설정 → 보안 → Passkey 추가</strong>로 이동합니다.</li>
<li>Passkey에 이름을 붙입니다(예: "MacBook Touch ID").</li>
<li>생체 인식을 완료합니다(Touch ID / Face ID / PIN / 하드웨어 키).</li>
<li>다음 로그인부터 Passkey를 선택하면 비밀번호 없이 로그인할 수 있습니다.</li>
</ol>

::: tip 여러 개의 Passkey 등록 권장
주력 휴대폰과 노트북에 각각 하나씩 등록하여, 단일 기기를 분실해도 로그인할 수 없게 되는 것을 방지합니다.
:::

**다중 기기 동기화**:

| 플랫폼 | 동기화 방식 |
|------|---------|
| iOS / macOS | Apple Keychain(iCloud Keychain), Apple 기기 간 동기화 |
| Android / Chrome OS | Google Password Manager, Android와 Chrome 간 동기화 |
| 크로스 플랫폼 | 1Password, Dashlane 등 Passkey를 지원하는 비밀번호 관리자 |
| 하드웨어 키 | YubiKey, SoloKey 등 FIDO2 토큰(동기화 불필요) |

**브라우저 호환성**: Chrome/Chromium 108+(동기화 포함), Safari 16+(macOS Ventura / iOS 16, Apple Keychain), Edge 108+(Chrome과 동일, Windows Hello 지원), Firefox 119+(WebAuthn 지원, 클라우드 동기화 Passkey는 아직 미지원).

::: warning 기업 기기 정책
일부 기업은 GPO / MDM을 통해 플랫폼 생체 인증이나 WebAuthn을 비활성화합니다. "Passkey를 생성할 수 없음" 문제가 발생하면 IT 관리자에게 문의하거나 하드웨어 키(YubiKey)로 변경하세요.
:::

---

## 4. 다단계 인증 (MFA)

**사용 가능한 두 번째 요소**:

| 요소 | 설명 | 권장 도구 |
|------|------|---------|
| **TOTP** | 시간 기반 일회용 비밀번호(30초 갱신) | Google Authenticator, 1Password, Authy, Microsoft Authenticator |
| **U2F / WebAuthn 하드웨어 키** | YubiKey, SoloKey 등 FIDO2, 물리적 버튼 누름 | YubiKey 5 시리즈 |
| **WebAuthn 플랫폼 인증기** | 기기 내장 생체 인식(Face ID, Windows Hello, 지문) | 내장 |
| **Email OTP / SMS OTP** | 인증 코드를 이메일로 발송 / 휴대폰 번호 연동(SMS는 관리자 활성화 필요) | 받은 편지함 / 휴대폰 문자 |

::: tip TOTP 모범 사례
클라우드 백업을 지원하는 TOTP 앱(1Password, Authy)을 사용하여 휴대폰 분실 시 접근 권한을 잃지 않도록 하세요. Google Authenticator 구버전은 마이그레이션을 지원하지 않으므로 이전 전에 반드시 내보내기를 해야 합니다.
:::

**MFA 정책**(콘솔 **보안 정책**): **강제하지 않음**(사용자가 자율적으로 연동) / **강제(모든 사용자)**(첫 로그인 후 반드시 최소 하나의 두 번째 요소를 등록) / **로컬 사용자만 강제**(외부 IdP/SSO 로그인은 면제, 로컬 계정은 반드시 연동). 일반적인 강제 시나리오: 고권한 계정(관리자, 재무)은 항상 강제하고, B2B 고객 조직은 고객 관리자가 별도로 설정하며, 위험 로그인(타지역 IP/새 기기)은 단계별 검증(Step-up Auth)을 트리거할 수 있습니다.

**복구 코드**: MFA 연동 후 일회용 복구 코드 한 세트가 생성됩니다(**계정 설정 → 보안 → 복구 코드**). 인쇄하거나 비밀번호 관리자에 저장하세요(**스크린샷으로 클라우드 앨범에 저장하지 마세요**). MFA 기기를 잃었을 때 임의의 복구 코드로 로그인한 뒤 즉시 MFA를 다시 연동하세요. 각 코드는 사용 후 즉시 무효화되며, 모두 사용하면 즉시 새 세트를 다시 생성하세요.

---

## 5. 비밀번호 정책 (Password Policy)

다음은 Casdoor 인스턴스의 기본 기준이며, 관리자는 콘솔에서 조정할 수 있습니다. 실제 요구 사항은 가입/비밀번호 변경 시 실시간으로 안내됩니다.

**복잡도**(기본값): 최소 길이 8자, 대문자·소문자·숫자·특수 문자(`!@#$%^&*` 등) 각 최소 1개.

**만료 및 이력**: 최대 유효 기간(0=만료 없음), 만료 사전 경고(N일 전, 현재 버전은 이메일을 발송하지 않고 로그인 시 페이지로만 안내), 이력 비밀번호 검사(최근 N회 재사용 방지).

**로그인 실패 잠금 (Lockout)**: 비밀번호 최대 실패 횟수 / OTP 최대 실패 횟수(0으로 설정하면 해당 잠금 비활성화). 잠긴 후에는 반드시 **관리자가 콘솔에서 수동으로 잠금 해제**해야 하며, 자동으로 해제되지 않습니다.

::: warning 계정 잠금 처리
연속으로 비밀번호나 OTP를 잘못 입력하여 잠긴 경우, 소속 조직 관리자에게 문의하거나 **support@lurus.cn**로 이메일(계정 이메일 제공)을 보내면 업무 시간 내에 잠금 해제 처리됩니다.
:::

---

## 6. 신원 브로커링 / Identity Brokering

Casdoor은 중간 IdP 역할을 하며, 하나 또는 여러 개의 **상위 외부 IdP**(기업 Azure AD/Okta 또는 소셜 GitHub/Google)와 연동합니다. 사용자가 "XXX로 로그인"을 클릭하면 → 상위 IdP로 이동하여 검증 → Casdoor이 결과를 수신 → Lurus 통합 token을 발급합니다.

<ArchitectureDiagram
  title="Identity Brokering 링크"
  chart="graph LR; P[Lurus 제품] --> Z[identity.lurus.cn · Casdoor]; Z --> U[상위 IdP · Azure AD / Okta / GitHub …]; U -. 사용자 신원 어서션 OIDC/SAML .-> Z; Z -. Lurus access_token / id_token 발급 .-> P"
/>

**사용 시점**: 기업 고객 B2B SSO(직원이 자사 Azure AD/Okta로 직접 로그인, 가입 불필요), 도메인 자동 라우팅(기업 이메일 입력 후 도메인에 따라 해당 IdP로 이동, Domain Discovery), 계정 연결(기존 Lurus 계정에 GitHub/Google 연결), Just-in-Time 생성(첫 외부 IdP 로그인 시 자동으로 계정을 만들고 기본 역할 할당).

**구성 단계(관리자)**: 콘솔 → **인스턴스 설정 / 조직 설정 → 신원 제공자 → 추가** → 템플릿 선택(EntraID / Okta / GitHub / Google / SAML 범용 등) → 상위 Client ID/Secret(OIDC) 또는 EntityID/Metadata URL(SAML) 입력 → **로그인 정책**에서 활성화하고 계정 자동 생성 허용 여부 설정 → 로그인 테스트, 역할/권한 매핑 확인.

::: info 지원하는 프로토콜
**OIDC**: Google, GitHub, 飞书, 企业微信, Okta 등. **SAML 2.0**: Azure AD(EntraID), ADFS, 기업급 SSO. **LDAP**: 기업 내부 Active Directory 또는 OpenLDAP.
:::

---

## 7. 로그인 화면 커스터마이징 (Branding)

**인스턴스** 또는 **조직** 단위로 커스터마이징: Logo(밝은/어두운, SVG/PNG), 테마 색상, 글꼴, 배경, 사용자 지정 도메인(`auth.yourcompany.com`, DNS 필요). Lurus는 기본적으로 메인 사이트 통합 배색을 사용합니다. B2B 고객은 **조직 설정 → 외관**에서 구성할 수 있으며, 다른 조직에는 영향을 주지 않습니다.

::: tip 사용자 지정 도메인과 Passkey
B2B 조직에 사용자 지정 로그인 도메인(`auth.client.com`)을 구성하려면 **반드시 첫 Passkey를 등록하기 전에 완료**해야 합니다. Passkey는 등록 시점의 도메인(RP ID)에 바인딩되며, 이후에 변경하면 기존 Passkey가 무효화됩니다.
:::

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="life-buoy" :size="14" /> 문제 해결</span>
  <h2 class="lurus-section-head__title">8. 자주 묻는 질문과 문제 해결</h2>
  <p class="lurus-section-head__lede">네 가지 빈번한 로그인 / 권한 문제의 원인과 처리 단계.</p>
</div>

<details class="lurus-faq-item">
<summary>서브도메인 간 Cookie 무효 — 로그인 후 다른 서브도메인 접근 시 재로그인 요구?</summary>

`app.lurus.cn`에서 로그인한 뒤 `docs.lurus.cn`에 접근하면 여전히 재로그인을 요구합니다. **원인**: OIDC 세션 Cookie의 `Domain`이 올바르지 않거나 CORS가 서브도메인 간 접근을 제한합니다. **문제 해결**: 모든 서브도메인이 동일한 최상위 도메인인지 확인하고 Cookie에 `Domain=.lurus.cn`을 설정합니다. iframe으로 로그인 페이지를 임베드하려면 `SameSite=None; Secure`와 HTTPS가 필요합니다.

</details>

<details class="lurus-faq-item">
<summary>MFA 연동 기기 분실 — TOTP 인증 코드를 생성할 수 없음?</summary>

처리 단계: ① MFA 검증 화면에서 **복구 코드로 로그인**을 클릭 ② 임의의 복구 코드 입력 ③ 로그인 후 즉시 **계정 설정 → 보안**에서 기존 MFA를 해제하고 새 기기를 다시 연동 ④ 복구 코드도 분실했다면 조직 관리자에게 연락하여 MFA를 강제 재설정.

</details>

<details class="lurus-faq-item">
<summary>기업 SSO 로그인 후 리소스가 보이지 않음 — SSO는 성공했으나 권한이 없거나 리소스가 비어 있음?</summary>

**원인**: ① User Grant 미구성(사용자를 해당 Project에 인가하지 않음) ② Project Role 누락(인가했으나 `viewer`/`editor`를 할당하지 않음) ③ JIT 생성 계정이 그룹에 미포함. **문제 해결**: 콘솔 → **사용자** → 해당 계정 → **인가 (Grants)** 탭에서 프로젝트와 역할을 확인.

</details>

<details class="lurus-faq-item">
<summary>회사 컴퓨터에서 Passkey를 사용할 수 없음 — "자격 증명을 생성할 수 없음" 안내?</summary>

**원인**: 기업 MDM/GPO가 플랫폼 인증기 또는 WebAuthn을 비활성화. **해결**: IT에 연락하여 제한 해제 / YubiKey 등 크로스 플랫폼 하드웨어 키 사용 / TOTP + 비밀번호로 회귀.

</details>

---

## 관련 문서

<NextSteps
  title="다음 단계"
  :steps="[
    { text: 'OIDC / OAuth2 통합', link: '/ko/platform/auth/oidc', primary: true },
    { text: 'API 인증 (PAT / JWT)', link: '/ko/platform/auth/api-auth' },
    { text: '인증 콘솔', link: 'https://identity.lurus.cn', external: true },
  ]"
/>

- [청구 및 구독](../billing.md) · [플랫폼 자주 묻는 질문](../faq.md) · [Lurus API 연동 가이드](/ko/api/overview) · [Casdoor 공식 문서](https://casdoor.com/docs)(영문)

</div>

<style scoped>
.auth-login .lurus-section-head { margin-top: 8px; }
</style>
