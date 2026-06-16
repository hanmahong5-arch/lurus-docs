---
title: 콘솔 관리 | Zitadel 신원 인증
description: auth.lurus.cn 콘솔로 조직, 사용자, 프로젝트, 애플리케이션, 신원 정책을 관리하는 전체 운영 가이드.
---

<div class="console-page">

# 콘솔 관리

Lurus는 [Zitadel](https://zitadel.com)을 통합 신원 인증 플랫폼으로 사용하며, 콘솔 진입점은 [auth.lurus.cn](https://auth.lurus.cn)입니다. 본 문서는 **조직 관리자 / IT 운영**을 대상으로 일상 운영의 전체 흐름을 다룹니다.

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">누가 읽어야 하나</p>
    <div class="lurus-callout__body">조직, 사용자, 프로젝트, 애플리케이션 및 신원 정책을 관리해야 하는 <strong>Org Owner / IT 운영</strong>. 로그인 연동만 원하는 개발자는 <a href="/ko/platform/auth/oidc">OIDC / OAuth2</a>와 <a href="/ko/platform/auth/api-auth">API 인증</a>을 참고하세요.</div>
  </div>
</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--auth" href="#_2-组织管理-organization">
    <span class="lurus-card__icon"><Icon name="building-2" :size="20" /></span>
    <div class="lurus-card__title">조직 관리</div>
    <p class="lurus-card__body">생성 / 전환, 도메인 검증, 멤버 역할, 메타데이터</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="#_3-用户管理-users">
    <span class="lurus-card__icon"><Icon name="users" :size="20" /></span>
    <div class="lurus-card__title">사용자 관리</div>
    <p class="lurus-card__body">Human / Service User, PAT, 상태 전이, 감사</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="#_4-项目管理-projects">
    <span class="lurus-card__icon"><Icon name="layers" :size="20" /></span>
    <div class="lurus-card__title">프로젝트와 애플리케이션</div>
    <p class="lurus-card__body">Roles, Grant, Redirect URI, Token 설정</p>
  </a>
  <a class="lurus-card lurus-card--auth" href="#_7-策略管理-policies">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">신원 정책</div>
    <p class="lurus-card__body">로그인 / 비밀번호 / 잠금 / 브랜딩 / 알림 정책</p>
  </a>
</div>

---

## 1. 콘솔 내비게이션

로그인하면 Management Console로 진입하며, 세 영역으로 나뉩니다:

- **상단 Breadcrumb**: 현재 계층을 표시합니다(**Instance 레벨** 전역 / **Organization 레벨** 단일 테넌트). 조직 이름 드롭다운을 누르면 전환하거나 새로 만들 수 있습니다(**New organization**). Instance 레벨 작업에는 Instance Manager 권한이 필요하며, 일반 Org Owner는 자신의 Organization만 볼 수 있습니다.
- **왼쪽 메뉴**:

| 메뉴 항목 | 기능 |
|--------|------|
| **Users** | Human User / Service User 관리 |
| **Projects** | 프로젝트, 애플리케이션, Role 관리 |
| **Actions** | 커스텀 이벤트 트리거 스크립트 |
| **Settings** | Login / Password Policy / Branding 등 정책 |
| **IDP** | 외부 신원 제공자(Google / GitHub / SAML 등) |

- **오른쪽 패널**: 목록의 리소스를 클릭하면 상세 패널이 펼쳐지며, 필드를 직접 편집하고 저장할 수 있습니다.

---

## 2. 조직 관리(Organization）

### 2.1 조직 생성 및 전환

**생성**: 상단 드롭다운 → **New organization** → 이름 입력 → 초기 관리자 신원 선택(**Current User** 현재 계정을 Org Owner로 설정 / **New Account** 별도로 관리 계정 생성) → 확인.

**전환**: 상단 Breadcrumb 드롭다운 → 대상 조직 이름 클릭.

**셀프 서비스 등록 진입점(B2B)**: 고객이 `https://auth.lurus.cn/ui/login/register/org`에 접속하여 직접 조직을 등록합니다.

### 2.2 기본 Organization 설정

왼쪽 **Organizations**(Instance 레벨) → 대상 조직 행의 **"..."** → **Set as default organization**(행에 **Default** 라벨 표시).

> 사용자가 로그인할 때 조직 컨텍스트를 가지고 있지 않으면(`urn:zitadel:iam:org:id:{id}` scope 없음), 기본 Organization의 정책과 브랜딩 설정이 적용됩니다.

### 2.3 도메인 검증

회사 이메일 도메인을 Organization에 바인딩하면 도메인 기반 라우팅 로그인과 단일 직접 접속을 활성화할 수 있습니다.

대상 Organization → **Settings → Organization Domains → Add Domain** → 도메인 입력(예: `lurus.cn`) → 검증 방식 선택(**DNS Challenge**: DNS에 TXT 레코드 추가, 값은 Zitadel이 생성 / **HTTP Challenge**: 웹의 지정 경로에 검증 파일 배치) → **Verify** → 통과 후 **Set as primary**로 기본 도메인 설정 가능.

::: warning
DNS TXT 레코드는 검증 후 **삭제하지 마세요**. Zitadel이 주기적으로 재검증하며, 삭제하면 도메인 상태가 무효화됩니다.
:::

### 2.4 멤버 관리(Organization Members)

**추가**: Organization → **Members → Add Member** → 사용자 검색(email / 사용자명) → 역할 할당 → **Save**. **제거**: Members 목록 해당 행 오른쪽의 삭제 아이콘.

| 역할 | 권한 범위 |
|------|---------|
| **Org Owner** | 조직 내 모든 권한, 멤버 관리 포함 |
| **Org User Manager** | Human / Service User 관리 |
| **Org User Viewer** | 사용자 읽기 전용 조회 |
| **Org Project Creator** | 새 Project 생성 |
| **Org Project Permission Editor** | Project Grant 및 역할 권한 관리 |

### 2.5 메타데이터(Metadata)

Organization → **Metadata → Add Metadata** → Key / Value 입력 → 저장. 임의의 key-value이며, API를 통해 읽어 비즈니스 확장 필드로 사용할 수 있습니다.

---

## 3. 사용자 관리(Users）

### 3.1 Human User: 생성

**Users → New** → First/Last Name, Email(**Email verified**를 체크하면 검증 건너뜀), Username(기본값은 Email과 동일), Phone(선택) 입력 → 초기 비밀번호 정책 선택(**Setup authentication later** 최초 로그인 시 직접 설정 / **Send an invitation E-Mail** 초대 메일 발송 / **Set an initial password** 관리자가 직접 설정) → **Create**.

### 3.2 Human User: 일상 운영

- **비밀번호 재설정**: 사용자 상세 → **Security → Send Password Reset Email**, 또는 **Set New Password**로 직접 설정.
- **잠금/잠금 해제**: 상세 페이지 우측 상단 **Lock** / **Unlock**(잠금 후 로그인 불가, 기존 Session은 다음 인증 시 무효화).
- **초기 비밀번호 메일 발송**: 상세 페이지 → **Resend Initialization Email**.
- **MFA 재설정**: 상세 → **Security → Authenticators** → 대상 MFA 기기 삭제(TOTP / Passkey / U2F) → 사용자가 다음 로그인 시 재등록 필요.

### 3.3 사용자 상태 전이

<ArchitectureDiagram title="사용자 상태 머신" chart="stateDiagram-v2
  [*] --> Initial: 생성
  Initial --> Active: 초기화 완료
  Active --> Locked: Lock / 정책 트리거
  Locked --> Active: Unlock
  Active --> Inactive: 비활성화
  Active --> Deleted: 삭제
  Deleted --> [*]" />

::: details 텍스트 버전 상태도
```
[Initial] →(完成初始化)→ [Active]
[Active]  →(Lock / 策略触发)→ [Locked] →(Unlock)→ [Active]
[Active]  →(停用)→ [Inactive]    [Active]→(删除)→[Deleted]
```
:::

| 상태 | 설명 |
|------|------|
| **Initial** | 생성 후 초기 비밀번호 설정 또는 이메일 검증을 완료하지 않음 |
| **Active** | 정상적으로 로그인 가능 |
| **Inactive** | 관리자에 의해 비활성화되어 로그인 불가 |
| **Locked** | 비밀번호 오류 한도 초과 또는 수동 잠금 |
| **Deleted** | 삭제됨, 데이터는 감사를 위해 보존 |

### 3.4 Service User: 생성 및 구성

머신 간 통신(CI/CD, 백엔드 호출)에 사용하며, 비밀번호 로그인을 사용하지 않습니다.

- **생성**: **Users → Service Users → New** → Username과 Display Name 입력(Description 선택) → **Create**.
- **PAT 생성**: 상세 → **Personal Access Tokens → New** → 만료 시간 선택 가능 → 생성 후 **즉시 복사**(한 번만 표시) → 호출 측에서 환경 변수 `Authorization: Bearer <token>` 설정.
- **JWT 공개 키 업로드(Key File)**: 상세 → **Keys → Add Key** → 타입 **JSON** + 만료 시간 → **Add** → JSON Key 파일 다운로드(개인 키 포함, 한 번만) → 서버 측에서 개인 키로 JWT를 서명하여 token endpoint에서 Access Token으로 교환.

### 3.5 감사 및 로그인 이력

- **로그인 이력**: 상세 → **Login History**(시간, IP, User Agent, 성공/실패).
- **리소스 변경 이력**: 임의의 리소스 상세 페이지 하단 **Changes**(Which User / Timestamp / Field / Old → New Value).

---

## 4. 프로젝트 관리(Projects）

### 4.1 프로젝트 생성

**Projects → Create New Project** → 이름 입력(예: `lurus-api`, `lucrum`, `switch`) → **Continue**.

### 4.2 프로젝트 설정(Settings 탭)

| 설정 항목 | 설명 |
|--------|------|
| **Assert Roles on Authentication** | 로그인 시 Roles를 Token과 Userinfo에 주입; 활성화 권장 |
| **Check Role Assignment on Authentication** | 사용자가 해당 Project에 최소 하나의 Role Grant를 가질 것을 요구, 없으면 로그인 거부 |
| **Check for Project on Authentication** | 사용자가 속한 Organization이 해당 Project의 Grant를 이미 받았는지 검증 |

**Branding 정책**: **Unspecified**(시스템 기본) / **Enforce project’s policy**(전 과정에서 프로젝트가 속한 Org 브랜딩 사용) / **Allow login user policy**(초기에는 프로젝트 브랜딩, 사용자를 식별한 후 사용자 자신의 Org 브랜딩으로 전환).

### 4.3 역할 정의(Project Roles)

역할은 문자열 식별자일 뿐이며, 의미는 비즈니스가 정의합니다. 상세 → **Roles → New Role** → **Key**(코드 식별자, Project 내 고유, 예: `admin`/`viewer`/`trader`), **Display Name**(콘솔 표시명), **Group**(선택, 그룹별 표시) 입력 → **Save**.

### 4.4 User Grant(사용자에게 역할 부여)

상세 → **Authorizations → New** → 대상 사용자 검색(Human / Service) → Role 체크(다중 선택 가능) → **Save**.

### 4.5 Project Grant(조직 간 권한 부여, B2B)

전체 Project를 다른 Organization에 권한 부여하여, 해당 조직이 본 조직 사용자의 해당 프로젝트 내 역할을 관리할 수 있게 합니다. 상세 → **Project Grants → New** → 파트너 Organization 도메인을 검색하여 선택 → 허용할 Role 체크(하위 집합으로 제한 가능) → **Save**.

> 권한을 부여받은 Organization 관리자는 **Granted Projects** 아래에서 해당 프로젝트를 볼 수 있으며, 자신의 조직 사용자에게 Role을 할당할 수 있습니다.

---

## 5. 애플리케이션 관리(Applications）

### 5.1 애플리케이션 타입 선택

상세 → **Applications → New Application** → 타입 선택:

| 타입 | 적용 시나리오 | 인증 흐름 |
|------|---------|---------|
| **Web** | 서버 사이드 렌더링(Spring / PHP / Django) | Authorization Code(PKCE 권장) + Client Secret |
| **SPA(User Agent)** | 프런트엔드 단일 페이지(React / Vue) | Authorization Code + PKCE(Client Secret 없음) |
| **Native** | 데스크톱/모바일(Electron / iOS) | Authorization Code + PKCE |
| **API** | 머신 간 통신(마이크로서비스/스크립트) | Client Credentials / JWT Profile |
| **SAML** | 엔터프라이즈 통합(OIDC 미지원 시스템) | SAML 2.0, Metadata XML 업로드 또는 URL 입력 |

### 5.2 Redirect URI 구성

- **정확히 일치**하며 대소문자를 구분합니다; 여러 개 추가 가능(프로덕션/프리릴리스/로컬을 각각 구성).
- Native App은 커스텀 프로토콜(`myapp://callback`)을 지원하며; IPv6는 대괄호를 이스케이프해야 합니다 `http://\[::1\]:8080/callback`.
- 일반적인 Web 구성: `https://app.lurus.cn/auth/callback`, `https://staging.lurus.cn/auth/callback`, `http://localhost:3000/auth/callback`(Development Mode를 켜야 함).
- **Post-Logout Redirect URI**: 로그아웃 후 이동할 주소이며, 마찬가지로 정확히 일치, 여러 개 가능.

### 5.3 Token 설정(Token Settings)

| 필드 | 설명 | 권장값 |
|------|------|--------|
| **Token Type** | `JWT`(클라이언트가 서명 검증) 또는 `Opaque`(Userinfo 콜백 필요) | JWT |
| **Access Token Lifetime** | Access Token 유효 기간 | 15 min |
| **Refresh Token Lifetime** | Refresh Token 최대 유효 기간 | 7 days |
| **Refresh Token Idle Lifetime** | Refresh Token 무활동 만료 | 24 h |
| **ID Token Lifetime** | ID Token 유효 기간 | 1 h |
| **Add User Roles to Token** | Project Roles를 Token claims에 기록 | 필요에 따라 |
| **Add User Info to ID Token** | 사용자 정보를 ID Token에 병합(Userinfo 요청 감소) | 선택 |
| **Clock Skew** | 허용되는 서버 시계 오차 허용값 | 기본값 |

### 5.4 Development Mode

상세 → **Redirect Settings** → **Development Mode** 체크: `http://` Redirect URI, Glob 패턴 매칭(`*`, `/**`, `?`) 허용.

::: warning
로컬 개발 전용이며, **프로덕션 환경에서는 켜지 마세요**.
:::

### 5.5 Client Secret

Web 애플리케이션 생성 후 자동으로 생성됩니다: 생성 시 팝업으로 한 번 표시되니 **즉시 복사**하세요. 재생성: 상세 → **Generate New Client Secret**(기존 Secret 즉시 무효화).

---

## 6. 신원 제공자(Identity Providers, IdP）

### 6.1 내장 IdP 타입

Organization → **Settings → IDP → Add IDP**:

| 타입 | 설명 |
|------|------|
| **Google** | OAuth2, Google Cloud Console Client ID/Secret 필요 |
| **GitHub** | OAuth2, GitHub OAuth App 자격 증명 필요 |
| **GitLab** | OAuth2, GitLab.com 또는 셀프 호스팅 지원 |
| **Microsoft** | Azure AD / Entra ID, 단일/다중 테넌트 |
| **Apple** | Sign in with Apple, Apple Developer 계정 필요 |
| **Generic OIDC** | 임의의 표준 OIDC Provider, Discovery URL 입력 |
| **Generic SAML** | 임의의 SAML 2.0 IdP, Metadata 업로드 |
| **LDAP** | 엔터프라이즈 AD / OpenLDAP |
| **JWT IDP** | 커스텀 JWT 토큰 발급자 |

### 6.2 Generic OIDC IdP 추가(예시)

**Add IDP → Generic OIDC** → **Name**(로그인 페이지 버튼 텍스트), **Client ID / Secret**(IdP 측 등록), **Issuer / Discovery URL**(예: `https://accounts.google.com`) 입력 → 필드 매핑 구성(**ID Attribute**는 보통 `sub`; First/Last Name / Email / Display Name을 IdP claims에 매핑) → **Auto Linking** 설정(**None** 연결하지 않고 매번 신규 생성 / **By Email** 동일 이메일 병합 / **By Username** 사용자명으로 병합) → **Save**. 활성화하면 로그인 페이지에 해당 버튼이 표시됩니다.

### 6.3 Login Policy에서 IdP 활성화

**Settings → Login Behavior and Security → External IDPs** → 방금 추가한 IdP 체크 → 저장.

---

## 7. 정책 관리(Policies）

Organization은 Instance 기본 정책을 재정의할 수 있습니다(Organization → **Settings** 각 하위 메뉴).

### 7.1 Login Policy(**Login Behavior and Security**)

| 스위치 | 설명 |
|------|------|
| **Username / Password** | 사용자명 비밀번호 로그인 허용 |
| **Registration** | 셀프 서비스 등록 허용 |
| **External IDP** | 서드파티 IdP 로그인 허용 |
| **Hide Password Reset** | 「비밀번호 찾기」 링크 숨김 |
| **Email / Phone as Login Name** | 이메일/휴대폰 번호를 사용자명으로 사용 허용 |
| **Domain Discovery** | 이메일 도메인에 따라 해당 Organization으로 자동 라우팅 |
| **Passkey / WebAuthn** | 비밀번호 없는 로그인 활성화 |
| **Force MFA** | 모든 사용자에게 MFA 활성화 강제 |

**세션 시간**: Password Check Lifetime(비밀번호 검증 주기) / External IDP Check Lifetime / MFA Init Skip Lifetime(MFA 설정을 건너뛸 수 있는 유예 기간) / Second Factor Check Lifetime.

### 7.2 Password Complexity(**Password Complexity**)

설정 가능: 최소 길이(Min Length), 대문자/소문자/숫자/특수 기호 요구 여부.

### 7.3 Lockout(**Lockout**)

**Max Password Attempts** / **Max OTP / TOTP Attempts**(0은 무제한). 잠금 후에는 반드시 관리자가 수동으로 잠금을 해제해야 합니다(상세 → **Unlock**).

### 7.4 Password Age(**Password Age**)

**Max Age in Days**(만료 후 로그인 시 강제 재설정) / **Expiry Warning in Days**(N일 전부터 로그인 페이지에 경고).

### 7.5 Branding(**Branding**)

Logo/Icon(라이트/다크 각 한 세트), Primary Color, Background Color, Warning Color, Font, **Hide Watermark**("Powered by ZITADEL" 숨김), **Login Name Suffix**(로그인 이름 접미사 표시 여부).

### 7.6 Privacy Policy(**Privacy Policy**)

등록/로그인 페이지의 규정 준수 링크 영역에 표시되는 URL을 구성합니다: Terms of Service, Privacy Policy, Help, Support Email(<code v-pre>{{.Lang}}</code> 언어 변수 지원).

### 7.7 Domain Policy(**Domain Policy**)

| 스위치 | 설명 |
|------|------|
| **Username must contain org domain** | 사용자명이 `{user}@{org}.{instance-domain}` 형태가 됨 |
| **Validate Organization Domains** | DNS/HTTP 검증을 통과해야 도메인 사용 가능 |
| **SMTP sender address must match domain** | 알림 메일 발신자 도메인이 조직 도메인과 일치해야 함 |
| **Email as username** | Email을 로그인 사용자명으로 직접 사용 허용 |

### 7.8 Notification(**Notifications**)

트리거 이벤트: 도메인 클레임, 사용자 초기화(초대/초기 비밀번호), Passkey 등록 확인, 비밀번호 재설정, Email 검증, 비밀번호 변경 성공. 채널은 **Settings → SMTP** / **SMS Providers**(Twilio)를 통해 자격 증명을 구성합니다.

---

## 8. Actions(커스텀 코드 확장）

::: info
Actions는 로그인/등록/사용자 생성 등 핵심 이벤트 트리거 시점에 **JavaScript**(Zitadel 서버 측 샌드박스)를 실행하며, 실행 결과가 흐름의 계속 또는 중단에 영향을 줄 수 있습니다.
:::

왼쪽 **Actions → New Action** → 이름 입력, 트리거 Flow와 Trigger Type 선택 → JS 처리 함수 작성 → 활성화하고 Flow에 바인딩.

**일반적인 용도**: 사용자 등록 시 비즈니스 Webhook을 호출하여 CRM/데이터 웨어하우스에 동기화; Token에 커스텀 Claim 주입(`tenant_id`, `plan_tier`); 등록 시 이메일 도메인 화이트리스트 검증.

**Flow 타입(자주 사용)**:

| Flow | 트리거 시나리오 |
|------|---------|
| **Complement Token** | Access/ID Token 생성 시 추가 claims 주입 |
| **Internal Authentication** | 비밀번호/Passkey 인증 성공 후 |
| **External Authentication** | 외부 IdP 인증 성공 후 |
| **Save success login** | 로그인 성공 기록 시 |
| **User Creation** | 신규 사용자 생성 완료 후 |

---

## 9. 감사 및 로그

- **Events 스트림**: Instance 레벨 상단 **Events** / Organization 레벨 진입 후 **Events**. 타임라인에 모든 변경을 나열합니다(Event Type / Aggregate / Editor / 타임스탬프).
- **리소스 레벨 변경 이력**: 각 리소스 상세 페이지 하단 **Changes**(Who / When / Field + Old → New Value).
- **SIEM 연동**: **Events API**(`/v2/events`)는 이벤트 타입/시간/리소스 ID로 필터링하여 Elasticsearch / Loki / Splunk로 푸시해 규정 준수 감사를 수행합니다.

---

## 10. Lurus 일반적인 운영 시나리오

<p class="console-scenario-lede"><span class="lurus-tag"><Icon name="life-buoy" :size="13" /> 빠른 참조</span> 네 가지 고빈도 운영 플레이북 — 펼쳐서 그대로 따라 하세요.</p>

<details class="lurus-faq-item">
<summary><Icon name="user-check" :size="16" /> 신규 직원 온보딩</summary>

<ol class="lurus-steps">
<li><strong>Users → Human Users → New</strong>, 이름과 업무 이메일을 입력하고 <strong>Send Invitation Email</strong>을 선택합니다.</li>
<li><code>lurus-api</code> 프로젝트 → <strong>Authorizations → New</strong> → 해당 사용자 검색 → 역할 할당.</li>
<li><code>lucrum</code>, <code>switch</code> 등 프로젝트에 대해 Grant 할당을 반복합니다(직무에 따라).</li>
<li>직원에게 초기화 메일을 확인하도록 알리고, 비밀번호 설정과 MFA 등록을 완료합니다.</li>
</ol>

</details>

<details class="lurus-faq-item">
<summary><Icon name="bot" :size="16" /> CI / 머신 계정</summary>

<ol class="lurus-steps">
<li><strong>Users → Service Users → New</strong>, Username은 <code>ci-&lt;service-name&gt;</code>을 권장합니다.</li>
<li>상세 → <strong>Personal Access Tokens → New</strong>에서 만료 시간을 설정하고 Token을 복사; 또는 <strong>Keys → Add Key</strong>에서 JSON Key 파일을 다운로드하여 CI에 개인 키를 구성.</li>
<li>해당 Project → <strong>Authorizations</strong>에서 필요한 Role을 할당.</li>
</ol>

</details>

<details class="lurus-faq-item">
<summary><Icon name="lock" :size="16" /> 직원 퇴사</summary>

<ol class="lurus-steps">
<li>상세 페이지 우측 상단 <strong>Lock</strong>(즉시 로그인을 차단하되 계정과 감사 데이터는 보존).</li>
<li>연관된 각 Project → <strong>Authorizations</strong> → 해당 사용자 찾기 → 삭제 아이콘으로 모든 Grant 취소.</li>
<li>감사 데이터가 더 이상 필요 없음을 확인하면(보통 권장하지 않음) 추가로 <strong>Delete User</strong>를 수행할 수 있습니다.</li>
</ol>

</details>

<details class="lurus-faq-item">
<summary><Icon name="building-2" :size="16" /> 엔터프라이즈 고객 연동(B2B)</summary>

<ol class="lurus-steps">
<li>Instance 레벨 → <strong>Organizations → New Organization</strong>, 이름은 고객 회사명을 사용합니다.</li>
<li>Org Owner를 추가합니다(고객 IT 관리자 계정).</li>
<li>Organization → <strong>Settings → Organization Domains</strong>에서 고객 도메인을 검증합니다.</li>
<li>고객이 자체 IdP(Azure AD)를 보유한 경우: Organization → <strong>Settings → IDP</strong>에서 SAML/OIDC IdP를 추가합니다.</li>
<li><code>lurus-api</code> 프로젝트 → <strong>Project Grants → New</strong> → 해당 고객 Organization 선택 → 허용할 Role 할당.</li>
<li>고객 Org Owner가 로그인한 후 <strong>Granted Projects</strong> 아래에서 직원에게 역할을 할당합니다.</li>
</ol>

</details>

---

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="link" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">관련 문서</p>
    <div class="lurus-callout__body"><a href="/ko/platform/auth/">인증 개요 및 접속점</a> · <a href="/ko/platform/auth/oidc">OIDC / OAuth2</a> · <a href="/ko/platform/auth/api-auth">API 인증</a> · <a href="https://auth.lurus.cn">인증 콘솔 ↗</a></div>
  </div>
</div>

*Zitadel 셀프 호스팅 인스턴스(`auth.lurus.cn`) 기반이며, 인터페이스 세부 사항은 실제 버전을 기준으로 합니다. 정책 변경 시 본 문서를 동기화하세요.*

</div>

<style>
.console-page .lurus-cards { margin: 1.1rem 0 1.4rem; }
.console-page .console-scenario-lede {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}
.console-page .console-scenario-lede .lurus-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.console-page .lurus-faq-item { margin: 0.6rem 0; }
.console-page .lurus-faq-item summary {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
