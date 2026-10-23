---
title: Lurus Platform — 계정 및 결제
description: Lurus 통합 계정 체계, 구독 플랜, 계정 지갑 및 결제 시스템 설명.
---

<div class="platform-page">

<ProductHero product-id="platform" />

## 개요

**Lurus Platform** 은 모든 Lurus 제품이 공유하는 통합 계정 및 결제 인프라입니다. Lurus API, Lucrum, Switch 또는 기타 제품 중 무엇을 사용하든 동일한 Lurus 계정으로 로그인하며, 동일한 지갑 잔액과 구독 플랜을 공유합니다.

<CapabilityGrid
  accent="var(--lurus-color-platform)"
  title="플랫폼 기본 기능"
  :items="[
    { title: '통합 계정', body: '모든 Lurus 제품에서 동일한 신원, 잔액, 구독을 공유', icon: 'user-check' },
    { title: '계정 지갑', body: '잔액과 거래 내역을 기록하며 사용량 기반 차감에 사용', icon: 'coins' },
    { title: '구독 플랜', body: '개인 구독과 기업 계약 두 가지 방식', icon: 'package-2' },
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
    <span class="lurus-card__icon"><Icon name="mail" :size="20" /></span>
    <div class="lurus-card__title">@lurus.cn 이메일</div>
    <p class="lurus-card__body"><code>username@lurus.cn</code> 자동 개통(Stalwart 기반)</p>
  </div>
</div>

**계정 관리**([identity.lurus.cn](https://identity.lurus.cn) → 계정 설정 로그인): 개인 정보, 로그인 기록, 서드파티 연동, 보안 설정(비밀번호 변경, 2단계 인증).

**한 번 로그인하면 전체 사이트 통행**: OIDC 표준 기반으로, 임의의 제품에 로그인하면 모든 제품 간에 세션이 수립됩니다. Passkey/WebAuthn 무비밀번호, TOTP/하드웨어 키 MFA, GitHub/Google 소셜 로그인을 지원하며, 기업은 Azure AD/飞书/Okta SSO 와 연동할 수 있습니다. 최종 사용자는 하나의 계정으로 API/Lucrum/Switch/Creator/Lutu 를 모두 사용하고, 개발자는 OIDC SDK 로 자체 애플리케이션에 연동하며 백엔드는 Service User + JWT Profile 을 사용합니다. 기업 조직 관리(멤버/권한/감사)는 [identity.lurus.cn](https://identity.lurus.cn)(Casdoor 콘솔)을 통하거나 영업팀에 문의하여 개통합니다.

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

구체적인 가격은 [identity.lurus.cn](https://identity.lurus.cn) 콘솔(구독 관리 페이지)을 기준으로 합니다.

### 사용량 기반 결제

구독에 포함된 한도를 초과하면 계정 지갑 잔액에서 차감됩니다. 모델마다 단가가 다르며, 콘솔에 표시되는 값을 기준으로 합니다.

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="receipt" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">과금 방식과 환불</p>
    <div class="lurus-callout__body"><a href="/ko/platform/billing">요금 안내</a>에서 현재 과금 방식, 잔액 부족 시 처리, 세금계산서와 환불을 설명합니다.</div>
  </div>
</div>

---

## 계정 지갑 {#wallet}

계정 지갑은 잔액과 거래 내역을 기록하며, 구독 한도를 초과한 사용량 결제에 사용됩니다. 잔액, 거래 내역, 충전 입구는 [identity.lurus.cn](https://identity.lurus.cn) 계정 센터에서 확인하세요. 가격, 증정 및 할인 규칙은 콘솔을 기준으로 하며, 이 문서에는 구체적인 수치를 적지 않습니다.

---

## 결제 수단

모든 결제는 Webhook 을 통해 비동기로 확인되어, 네트워크 변동으로 인한 중복 차감을 방지합니다. 이용 가능한 결제 채널은 결제 페이지 표시를 기준으로 하며, 기업 고객은 계약과 법인 계좌 이체를 이용할 수 있습니다.

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
    { text: '신원 인증 (Casdoor)', link: '/ko/platform/auth/', primary: true },
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
