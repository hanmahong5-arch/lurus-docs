---
title: 핵심 개념 | Casdoor 신원 인증
description: Instance / Organization / Project / Application / User / Grant / Administrator 등 Casdoor 객체 모델에 대한 상세 설명으로, Lurus 실제 배포와 결합하여 설명합니다.
---

<div class="auth-concepts">

# 핵심 개념

Lurus는 [Casdoor](https://casdoor.com)을 통합 OIDC 신원 제공자(IdP)로 사용하며, 공용 진입점은 `identity.lurus.cn`입니다. 이 페이지에서는 객체 모델 계층 구조를 정리합니다.

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> 모델</span>
  <h2 class="lurus-section-head__title">객체 모델 한눈에 보기</h2>
  <p class="lurus-section-head__lede">여섯 가지 객체, 단방향 포함——이 그림을 이해하면, 이후 모든 절은 그 전개일 뿐입니다.</p>
</div>

<ArchitectureDiagram
  title="Casdoor 객체 모델 계층"
  chart="graph TD; Instance[Instance · lurus-prod] --> Org[Organization · lurus.cn]; Org --> User[User · 직원 / 고객 / Service Account]; Org --> Project[Project · lurus-api / lucrum / switch …]; Org --> OrgGrant[Grant · Project를 다른 Org에 위임]; Project --> App[Application · Web / SPA / Native / API / SAML]; Project --> Role[Role · 예: lucrum:admin]; User -. User Grant .-> Role"
/>

포함 관계는 **엄격히 단방향**입니다: Instance ⊃ Organization ⊃ Project ⊃ (Application, Role). User는 Organization에 속하며, User Grant를 통해 Project Role에 바인딩됩니다.

---

## Instance 인스턴스

데이터 계층의 **최상위 추상**으로, 독립적인 신원 발급자(issuer)와 동등합니다. 모든 token의 `iss`는 해당 Instance 도메인을 가리킵니다.

| 속성 | 설명 |
|------|------|
| 역할 | 시스템 수준 기본 설정 컨테이너(Branding, Login/Password Policy 등) |
| 멀티테넌트 | 하나의 인스턴스가 여러 Organization을 수용하여 테넌트 격리 구현 |
| 관리자 | Instance 관리자는 모든 Organization을 가로질러 권한이 가장 높음 |
| 가상 인스턴스 | System API를 통해 여러 가상 인스턴스를 생성할 수 있으며, SaaS 멀티테넌트 배포에 적합 |

::: tip Lurus 맥락
프로덕션 환경에는 단 하나의 인스턴스 **`lurus-prod`**(`identity.lurus.cn`)만 존재합니다. 가상 인스턴스가 필요 없으며, 모든 제품 라인이 동일한 issuer를 공유합니다.
:::

---

## Organization 조직

**테넌트 단위**로, 디렉터리 서비스의 OU와 유사합니다. 하나의 Instance 내에 여러 개가 존재할 수 있으며, 사용자 데이터는 서로 격리됩니다. 소유물: User & Service Account(전용 사용자 풀), Project(제품 그룹 및 애플리케이션, 역할), Domain(하나 이상, 하나의 기본 도메인 포함), Policy(인스턴스 기본 보안 정책을 재정의 가능). **권한 위임**을 지원합니다: 자신의 Project 관리 권한을 다른 Organization에 부여하여 B2B 셀프서비스 IAM을 구현합니다.

::: tip Lurus 맥락
현재 주 조직은 **`lurus.cn`**으로, 내부 직원 계정과 각 제품 Project를 수용합니다. 기업 고객을 연동할 때 각 기업마다 독립적인 보조 Organization을 생성하고, Project Grant를 통해 특정 제품 권한을 개방할 수 있습니다.
:::

---

## Project 프로젝트

**논리적 제품 그룹**으로, 각 Project는 하나의 소프트웨어 제품 또는 서비스 경계에 대응합니다. 동일한 Project 하의 모든 Application은 동일한 Role 정의를 공유합니다. 구성: Application(로그인 클라이언트), Role(`admin`/`viewer` 같은 역할 문자열), User Grant(역할을 User에게 부여), Granted Organization(전체 Project를 다른 Org에 위임). Project 수준 설정에는 다음이 포함됩니다: 로그인 시 역할 선언(`urn:casdoor:iam:org:project:roles`) 포함을 요구할지 여부, 외부 IdP 로그인을 허용할지 여부 등.

::: tip Lurus 맥락
각 제품 라인은 하나의 독립적인 Project에 대응하며, 명명 규칙은 `lurus.yaml` `capabilities:` 레지스트리를 참조하세요. 역할 규약은 각 제품 팀이 정의합니다.
:::

---

## Application 애플리케이션

**구체적인 로그인 클라이언트**로, 실제로 인증 요청을 시작하는 프로그램 개체입니다. 각각 독립적인 `client_id`를 가지며, 인증 방식에 따라 `client_secret` 또는 PKCE 구성을 갖습니다.

| 유형 | 일반적인 시나리오 | 인증 방식 |
|------|---------|---------|
| **Web** | 서버 사이드 렌더링(Spring, Phoenix, Django) | Authorization Code + PKCE 또는 Client Secret |
| **SPA** | 순수 프론트엔드 단일 페이지(React, Vue) | Authorization Code + **PKCE**(필수) |
| **Native** | 데스크톱/모바일(Switch, Lutu APP) | Authorization Code + PKCE + Custom Scheme |
| **API** | 순수 백엔드 / M2M | Client Credentials(JWT 또는 Basic Auth) / Private Key JWT |
| **SAML** | SAML 2.0 호환 기업 애플리케이션 | SAML 2.0 어설션 |

::: warning PKCE에 관하여
사용자 상호작용이 포함된 애플리케이션(Web/SPA/Native)은 기본적으로 **PKCE**를 사용합니다. 프론트엔드 애플리케이션에서 Implicit Flow 사용을 금지합니다.
:::

**핵심 구성**: `client_id`(모든 유형, 애플리케이션 식별); `client_secret`(서버 사이드에서 키를 안전하게 보관할 수 있는 애플리케이션만, SPA/Native는 PKCE로 대체); Redirect URI(완전 일치를 엄격히 검증, 개발 모드에서는 완화 가능); 개발 모드(비 HTTPS 및 와일드카드 URI 허용, 로컬 개발 전용이며 프로덕션에서는 반드시 비활성화).

---

## User 사용자

실제 인원인 **Human User**와 자동화 시스템인 **Machine User**로 나뉩니다.

- **Human User**: Password, MFA(TOTP/SMS), Passkey(FIDO2/WebAuthn), 외부 IdP(Google/GitHub 등)를 지원합니다. 필드에는 로그인 이름, 이름, 이메일, 전화번호, 언어 선호, 사용자 정의 Metadata(키-값 쌍)가 포함됩니다.
- **Machine User / Service Account**: 백엔드 서비스, CI/CD, 예약 작업. 인증 방식은 **PAT**(장기 무기명 token, 간단함) 또는 **JWT Profile**(개인 키로 서명한 JWT로 token 교환, 더 안전함)입니다.

**사용자 상태**: `active`(로그인 가능) / `inactive`(비활성화) / `locked`(실패 한도 초과로 잠김) / `deleted`(소프트 삭제, 감사용으로 보존).

::: tip 중요한 제약
각 User는 엄격히 **단 하나의 Organization**에만 속합니다. 조직 간에는 Organization Grant 메커니즘을 거쳐야 하며, 조직을 가로질러 계정을 직접 공유할 수 없습니다.
:::

---

## Grant 및 Role

RBAC 기반이며, 핵심은 Project Role, User Grant, Project Grant입니다.

- **Project Role**: Project 내 역할 문자열로, 세 개의 필드 Key(`admin` 같은 코드 식별자), Display Name(콘솔 표시, 예: 「관리자」), Group(선택적 그룹, 예: `management`)을 갖습니다. 동일한 Project 하의 모든 Application이 공유합니다.
- **User Grant** = `User + Project + Role[]`: 로그인 후 access token의 `urn:casdoor:iam:org:project:roles` claim은 대상 Project에서 사용자에게 부여된 모든 역할을 담으며, 백엔드는 이 claim을 파싱하여 권한을 확인하므로 추가 API 호출이 필요 없습니다.
- **Project Grant** = `Project (소스 Org) → Organization (대상 Org)`: 전체 Project 관리 권한을 다른 Organization에 부여합니다. B2B 멀티테넌트의 핵심으로, Lurus는 고객 직원의 계정을 생성할 필요 없이, 고객이 자신의 Organization 내에서 사용자와 권한을 스스로 관리합니다.

---

## Administrator 관리자

네 개의 계층이 있으며, 최소 권한 원칙을 따릅니다:

| 계층 | 범위 | 일반적인 역할 |
|------|--------|---------|
| **IAM / Instance** | 전체 인스턴스(모든 Organization을 가로질러) | `IAM_OWNER` |
| **Organization** | 단일 조직 내 모든 리소스 | `ORG_OWNER`, `ORG_USER_MANAGER` |
| **Project** | 단일 Project 내 애플리케이션, 역할, 위임 | `PROJECT_OWNER` |
| **Project Grant** | 위임받은 Project의 사용자 역할 관리 | `PROJECT_GRANT_OWNER` |

**흔한 역할 문자열**: `IAM_OWNER`(인스턴스 수준 최고, 모든 조직/정책/가상 인스턴스 관리), `ORG_OWNER`(조직 내 사용자/Project/도메인/정책 관리), `ORG_USER_MANAGER`(사용자 및 역할 할당만 관리, Project 구조 변경 불가), `ORG_USER_PERMISSION_EDITOR`(User Grant만 편집), `PROJECT_OWNER`(Project 내 Application/Role/Grant 관리), `PROJECT_GRANT_OWNER`(위임받은 Project 내 자기 조직 사용자 역할 관리).

::: warning 조직 간 가시성
`IAM_OWNER`만이 Organization을 가로질러 조회 및 관리할 수 있습니다. `ORG_OWNER`는 엄격히 자기 조직에 한정되며, 다른 조직의 데이터에 접근할 수 없습니다.
:::

---

## Policy 정책

Instance 계층에서 기본값을 정의하고, Organization 계층에서 필요에 따라 재정의합니다.

| 정책 유형 | 설명 |
|---------|------|
| **Login Policy** | 어떤 인증 방식을 허용할지(Password/Passkey/외부 IdP/가입 스위치) |
| **Password Policy** | 비밀번호 복잡도, 최소 길이, 이전 비밀번호 금지 여부 |
| **Lockout Policy** | 로그인 실패 횟수 임계값, 잠금 시간 |
| **MFA Policy** | MFA 강제 여부, 어떤 방식을 허용할지 |
| **Privacy Policy** | 개인정보 처리방침 URL, ToS URL |
| **Branding** | 로그인 페이지 Logo, 배색, 사용자 정의 CSS(Organization 수준에서 독립적으로 맞춤화 가능) |

주 조직 `lurus.cn`의 구체적인 정책은 플랫폼 운영팀이 Casdoor Console에서 관리하며, 여기에 하드코딩하지 않습니다.

---

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Lurus 실제 배포에 정렬</p>
    <div class="lurus-callout__body"><ul><li><strong>Project 명명</strong>: 각 제품은 하나의 Project에 대응하며(<code>lurus-api</code>, <code>lucrum</code>, <code>switch</code>, <code>lutu</code>, <code>admin</code>, <code>forge</code>), Casdoor Console을 기준으로 합니다.</li><li><strong>역할 규약</strong>: 역할 문자열은 서비스 수준 CLAUDE.md 또는 <code>lurus.yaml</code> <code>capabilities:</code> 레지스트리에서 정의하며, 여기에 하드코딩하지 않습니다.</li><li><strong>Machine User 시나리오</strong>: M2M 호출은 통일적으로 Machine User + JWT Profile을 사용하여, 인간 계정 공유를 피합니다.</li><li><strong>PAT 시나리오</strong>: CI/CD와 스크립트는 PAT를 사용할 수 있으며, 최단 유효 기간을 설정하고 정기적으로 교체해야 합니다.</li><li><strong>전체 구성 참조</strong>: <code>lurus.yaml</code> <code>capabilities:</code> 절이 아키텍처 변경의 유일한 진입점입니다.</li></ul></div>
  </div>
</div>

</div>

<style scoped>
.auth-concepts .lurus-section-head { margin-top: 8px; }
</style>
