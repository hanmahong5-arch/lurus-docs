---
title: Lurus Platform — 계정 및 결제
description: Lurus 통합 계정 체계, 구독 플랜, 鹿贝 지갑 및 결제 시스템 설명.
---

<div class="platform-page">

<ProductHero product-id="platform" />

## 개요

**Lurus Platform** 은 모든 Lurus 제품이 공유하는 통합 계정 및 결제 인프라입니다. Lurus API, Lucrum, Switch 또는 기타 제품 중 무엇을 사용하든 동일한 Lurus 계정으로 로그인하며, 동일한 지갑 잔액과 구독 플랜을 공유합니다.

<CapabilityGrid
  accent="var(--lurus-color-platform)"
  title="플랫폼의 네 가지 핵심 축"
  :items="[
    { title: '통합 계정', body: '모든 Lurus 제품에서 동일한 신원, 잔액, 구독을 공유', icon: 'user-check' },
    { title: '鹿贝 지갑', body: '통합 결제 단위, 사용량 기반 차감, 실시간 잔액 조회', icon: 'coins' },
    { title: '구독 플랜', body: '무료 한도 + 사용량 기반 결제 + 기업 패키지', icon: 'package-2' },
    { title: 'VIP 체계', body: '누적 충전액에 따라 등급 상승, 구독 할인 적용', icon: 'crown' },
  ]"
/>

---

## 통합 계정

임의의 Lurus 제품([hub.lurus.cn](https://hub.lurus.cn), [lucrum.lurus.cn](https://lucrum.lurus.cn) 등)에 접속하면 바로 가입/로그인할 수 있습니다. **로그인 방식**: 이메일+비밀번호, GitHub(OAuth), Google(OAuth).

가입에 성공하면 다음을 받습니다:

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="user-check" :size="20" /></span>
    <div class="lurus-card__title">통합 사용자 신원</div>
    <p class="lurus-card__body">하나의 계정으로 모든 제품에서 공통 사용</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="coins" :size="20" /></span>
    <div class="lurus-card__title">鹿贝 지갑</div>
    <p class="lurus-card__body">가입 시 바로 개설, 1위안 = 1 鹿贝, 모든 제품에서 공용</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="gauge" :size="20" /></span>
    <div class="lurus-card__title">무료 할당량</div>
    <p class="lurus-card__body">가입 후 즉시 Lurus API 체험 가능</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="mail" :size="20" /></span>
    <div class="lurus-card__title">@lurus.cn 이메일</div>
    <p class="lurus-card__body"><code>username@lurus.cn</code> 자동 개통(Stalwart 기반)</p>
  </div>
</div>

**계정 관리**([identity.lurus.cn](https://identity.lurus.cn) → 계정 설정 로그인): 개인 정보, 로그인 기록, 서드파티 연동, 보안 설정(비밀번호 변경, 2단계 인증).

**한 번 로그인하면 전체 사이트 통행**: OIDC 표준 기반으로, 임의의 제품에 로그인하면 모든 제품 간에 세션이 수립됩니다. Passkey/WebAuthn 무비밀번호, TOTP/하드웨어 키 MFA, GitHub/Google 소셜 로그인을 지원하며, 기업은 Azure AD/飞书/Okta SSO 와 연동할 수 있습니다. 최종 사용자는 하나의 계정으로 API/Lucrum/Switch/Creator/Lutu 를 모두 사용하고, 개발자는 OIDC SDK 로 자체 애플리케이션에 연동하며 백엔드는 Service User + JWT Profile 을 사용합니다. 기업 조직 관리(멤버/권한/감사)는 [identity.lurus.cn](https://identity.lurus.cn)(Zitadel 콘솔)을 통하거나 영업팀에 문의하여 개통합니다.

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">신원 인증 자세히 보기</p>
    <div class="lurus-callout__body"><a href="/ko/platform/auth/">통합 신원 인증</a> · <a href="/ko/platform/auth/oidc">OIDC / OAuth2 연동</a> · <a href="/ko/platform/auth/api-auth">API 인증</a></div>
  </div>
</div>

---

## 결제 체계

Lurus 는 「구독 + 사용량」 이중 트랙 결제 모델을 채택하여 다양한 사용량 수준에 유연하게 대응합니다.

### 구독 플랜

| 플랜 | 포지셔닝 | 적합 대상 |
|------|------|------|
| **Free** | 기본 한도, 무료 사용 | 개인 체험 |
| **Basic** | 입문 월간 구독 | 개인 개발자 |
| **Pro** | 고급 월간 구독 + 우선 모델 | 헤비 유저 |
| **Pro 연간 결제** | Pro 연간 결제 할인 | 안정적인 사용자 |
| **Enterprise** | 기업 맞춤 + SLA | 팀 / 기업 |

이 밖에 Claude Code 전용 독립 플랜도 있습니다. 구체적인 가격은 [identity.lurus.cn](https://identity.lurus.cn) 콘솔(구독 관리 페이지)을 기준으로 합니다.

### 사용량 기반 결제

구독에 포함된 한도를 초과하면 鹿贝 지갑에서 자동으로 차감됩니다. 모델마다 단가가 다르며, 콘솔에 표시되는 값을 기준으로 합니다.

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="receipt" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">전체 가격, 할당량 규칙과 충전 비율이 궁금하신가요?</p>
    <div class="lurus-callout__body"><a href="/ko/platform/billing">결제 상세</a> 에서 구독 플랜 비교, 할당량 계산, 鹿贝 충전 규칙과 환불 정책을 분석합니다.</div>
  </div>
</div>

---

## 鹿贝 지갑 {#wallet}

**鹿贝(LB)** 는 Lurus 플랫폼 지갑의 회계 단위로, 1 鹿贝 = 1위안(CNY)이며 모든 제품의 사용량 기반 요금 결제에 사용됩니다.

### 鹿贝 획득

| 경로 | 보상 | 설명 |
|------|------|------|
| **충전 구매** | 1위안 = 1 鹿贝 | 충전한 만큼 그대로 입금; 충전 혜택이 있으면 충전 페이지 표시를 기준으로 함 |
| **매일 출석 체크** | 하루 0.1 鹿贝 | 연속 출석 7일을 채울 때마다 보상 ×1.5, 하루 최대 1 鹿贝 |
| **친구 추천** | 친구 1명당 최대 45 鹿贝 + 수수료 | 친구가 내 링크로 가입 시 5, 첫 유료 충전 시 +10, 첫 유료 구독 시 +30, 이후 유료 구독·갱신마다 5%(최대 6회); 초대 횟수 제한 없음 |

### 鹿贝 사용

다음 용도로 사용할 수 있습니다: 구독 할당량을 초과한 API 호출 등 모든 제품의 사용량 기반 요금 결제, 그리고 구독 구매.

### VIP 등급

누적 충전 금액(또는 연간 구독)에 따라 VIP 등급이 정해집니다. VIP 할인은 구독 구매 및 갱신 시 자동 적용되며, 충전과 사용량 기반 차감에는 할인이 적용되지 않습니다. 기본 기준은 누적 충전 ¥500 / ¥2,000 / ¥10,000 / ¥50,000이며 각각 2% / 5% / 8% / 10% 할인이고, 콘솔을 기준으로 합니다.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">Standard</span><span class="lurus-stat__label">입문</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Silver</span><span class="lurus-stat__label">실버</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Gold</span><span class="lurus-stat__label">골드</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Platinum</span><span class="lurus-stat__label">플래티넘</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Diamond</span><span class="lurus-stat__label">다이아몬드</span></div>
</div>

임계값과 할인은 [identity.lurus.cn](https://identity.lurus.cn) 계정 센터 VIP 페이지를 참조하세요.

---

## 결제 수단

모든 결제는 안전한 Webhook 을 통해 비동기로 확인되어, 네트워크 변동으로 인한 중복 차감을 방지합니다.

| 수단 | 시나리오 | 설명 |
|------|----------|------|
| **Stripe** | 구독 + 충전 | 신용카드/체크카드(Visa, Mastercard) |
| **Creem** | 충전 | 암호화폐 결제 |
| **Epay** | 충전 | 알리페이/위챗페이(서드파티) |

---

## 추천 프로그램

[identity.lurus.cn](https://identity.lurus.cn) 에서 전용 추천 링크(추천 코드 포함)를 복사하여 친구에게 공유하세요. 보상은 모두 추천인에게 지급됩니다: 친구 가입 시 5 鹿贝, 첫 유료 충전 시 +10, 첫 유료 구독 시 +30, 이후 유료 구독·갱신마다 금액의 5%(최대 6회). 실제 결제만 인정되며 증정 금액, 선불 교환 코드, 수동 개통은 제외됩니다. 초대 횟수 제한은 없습니다.

---

## 알림 서비스

다중 채널 알림(계정 설정에서 각 유형별 알림의 수신 채널을 사용자 지정 가능):

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
    <div class="lurus-card__title">사이트 내 메시지</div>
    <p class="lurus-card__body">계정 변경 / 보안 경고 / 시스템 공지</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="mail" :size="20" /></span>
    <div class="lurus-card__title">이메일</div>
    <p class="lurus-card__body">결제 확인 / 할당량 경고 / 구독 만료</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="activity" :size="20" /></span>
    <div class="lurus-card__title">WebSocket</div>
    <p class="lurus-card__body">API 이상 / 잔액 부족 실시간 푸시</p>
  </div>
</div>

---

## 데이터 보안

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">기업급 신원 인증</div>
    <p class="lurus-card__body"><Term t="OIDC">OIDC</Term> 표준 기반 시스템</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="lock" :size="20" /></span>
    <div class="lurus-card__title">전체 사이트 HTTPS</div>
    <p class="lurus-card__body">전송 전 구간 TLS 1.3 암호화</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="key" :size="20" /></span>
    <div class="lurus-card__title">비밀번호 평문 미저장</div>
    <p class="lurus-card__body">bcrypt 암호화 저장</p>
  </div>
  <div class="lurus-card lurus-card--platform">
    <span class="lurus-card__icon"><Icon name="receipt" :size="20" /></span>
    <div class="lurus-card__title">규정 준수 결제 게이트웨이</div>
    <p class="lurus-card__body">결제는 PCI DSS 규정을 준수하는 서드파티 경유</p>
  </div>
</div>

사용자 데이터는 엄격히 격리되어 공유되지 않습니다.

---

<NextSteps
  title="다음 단계"
  :steps="[
    { text: '신원 인증 (Zitadel)', link: '/ko/platform/auth/', primary: true },
    { text: '결제 상세', link: '/ko/platform/billing' },
    { text: '자주 묻는 질문', link: '/ko/platform/faq' },
    { text: 'API Key 발급', link: '/ko/guide/get-api-key' },
  ]"
/>

<!-- lurus:related-block -->

<RelatedProducts product-id="platform" />

</div>

<style>
.platform-page .lurus-card code {
  font-size: 0.85em;
}
</style>
