---
layout: page
title: LurusTech Docs — AI 인프라 및 제품 플랫폼
description: LurusTech 플랫폼 문서 — API Reference · Quickstart · Integration Guide
---

<div class="vp-doc lurus-home">

<Hero />

<nav class="persona-jump" aria-label="역할별 빠른 이동">
  <a href="#newbie" class="persona-jump__chip">
    <span class="persona-jump__icon"><Icon name="rocket" :size="14" /></span>
    <span class="persona-jump__label">초보자</span>
    <span class="persona-jump__hint">3분 시작</span>
  </a>
  <a href="#player" class="persona-jump__chip">
    <span class="persona-jump__icon"><Icon name="gamepad-2" :size="14" /></span>
    <span class="persona-jump__label">사용자</span>
    <span class="persona-jump__hint">즉시 사용 도구</span>
  </a>
  <a href="#decider" class="persona-jump__chip">
    <span class="persona-jump__icon"><Icon name="briefcase" :size="14" /></span>
    <span class="persona-jump__label">의사결정자</span>
    <span class="persona-jump__hint">기업 평가</span>
  </a>
  <a href="#dev" class="persona-jump__chip">
    <span class="persona-jump__icon"><Icon name="code" :size="14" /></span>
    <span class="persona-jump__label">개발자</span>
    <span class="persona-jump__hint">시스템 구축</span>
  </a>
</nav>

<div class="topic-grid-head"><Icon name="compass" :size="16" /> <strong>주제별 둘러보기</strong> —— 무엇을 찾는지 아시나요? 해당 주제로 바로 이동하세요.</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--api" href="/ko/guide/introduction"><span class="lurus-card__icon"><Icon name="plug-zap" :size="20" /></span><div class="lurus-card__title">게이트웨이 연동</div><p class="lurus-card__body">하나의 Key로 50개 이상 모델 연결, OpenAI SDK 호환.</p></a>
  <a class="lurus-card lurus-card--kova" href="/ko/kova/"><span class="lurus-card__icon"><Icon name="bot" :size="20" /></span><div class="lurus-card__title">Agent 실행</div><p class="lurus-card__body">Kova WAL-First 엔진, 크래시 시 자동 복구.</p></a>
  <a class="lurus-card lurus-card--memx" href="/ko/memx/"><span class="lurus-card__icon"><Icon name="brain" :size="20" /></span><div class="lurus-card__title">지능형 메모리</div><p class="lurus-card__body">MemX 적응형 메모리, LLM 비용 제로 증류.</p></a>
  <a class="lurus-card lurus-card--lumen" href="/ko/lumen/"><span class="lurus-card__icon"><Icon name="zap" :size="20" /></span><div class="lurus-card__title">관측성</div><p class="lurus-card__body">Lumen Replay + 크래시 복구 + 비용 추적.</p></a>
  <a class="lurus-card lurus-card--lucrum" href="/ko/lucrum/"><span class="lurus-card__icon"><Icon name="trending-up" :size="20" /></span><div class="lurus-card__title">퀀트 트레이딩</div><p class="lurus-card__body">Lucrum이 자연어로 vnpy 전략을 생성하고 백테스트합니다.</p></a>
  <a class="lurus-card lurus-card--switch" href="/ko/switch/"><span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span><div class="lurus-card__title">데스크톱 도구</div><p class="lurus-card__body">Switch로 여러 AI CLI, MCP, 비용을 통합 관리.</p></a>
  <a class="lurus-card lurus-card--api" href="/integrations/"><span class="lurus-card__icon"><Icon name="puzzle" :size="20" /></span><div class="lurus-card__title">통합 및 MCP</div><p class="lurus-card__body">제품 MCP, Switch 내장 서버, 클라이언트 디렉터리.</p></a>
  <a class="lurus-card lurus-card--api" href="/ko/guide/troubleshooting"><span class="lurus-card__icon"><Icon name="life-buoy" :size="20" /></span><div class="lurus-card__title">문제 해결</div><p class="lurus-card__body">401 / 할당량 / 타임아웃 등 자주 발생하는 문제를 한 페이지에서 진단.</p></a>
</div>

## <Icon name="rocket" :size="22" /> 저는 초보자입니다 — 3분 만에 첫 호출 실행하기 {#newbie}

모델을 잘못 고르면 코드를 잘못 짜는 것보다 10배 비쌉니다. 먼저 게이트웨이로 한 번 실행해 보고, 마이그레이션 여부는 그다음에 결정하세요.

<div class="action-grid">
  <ActionCard
    product-id="lurus-api"
    :actions="[
      { label: '빠른 시작', href: '/ko/guide/quickstart', primary: true },
      { label: 'API Key 발급', href: '/ko/guide/get-api-key' },
      { label: '지원 모델', href: '/guide/models' },
      { label: '콘솔', href: 'https://api.lurus.cn', external: true },
    ]"
  />
  <ActionCard
    product-id="platform"
    :actions="[
      { label: '플랫폼 개요', href: '/ko/platform/', primary: true },
      { label: '요금 상세', href: '/ko/platform/billing' },
      { label: '자주 묻는 질문', href: '/ko/platform/faq' },
    ]"
  />
</div>

---

## <Icon name="gamepad-2" :size="22" /> 저는 사용자입니다 — 바로 쓸 수 있는 AI 도구가 필요해요 {#player}

코드는 이미 다 작성되어 있습니다. 다운로드하면 바로 실행, 설정 한 줄도 필요 없습니다.

<div class="action-grid">
  <ActionCard
    product-id="lucrum"
    :actions="[
      { label: '빠른 시작', href: '/ko/lucrum/quickstart', primary: true },
      { label: '전략 마켓', href: '/ko/lucrum/strategies' },
      { label: '트레이딩 플랫폼', href: 'https://lucrum.lurus.cn', external: true },
    ]"
  />
  <ActionCard
    product-id="switch"
    :actions="[
      { label: '설치 가이드', href: '/ko/switch/install', primary: true },
      { label: '설정 안내', href: '/ko/switch/configuration' },
    ]"
  />
  <ActionCard
    product-id="creator"
    :actions="[
      { label: '설치 가이드', href: '/creator/install', primary: true },
      { label: '활용 사례', href: '/creator/use-cases' },
    ]"
  />
  <ActionCard
    name="Lutu — 모바일 클라이언트"
    tagline="路途 APP · 모바일 AI 어시스턴트 및 가계부"
    icon="smartphone"
    color="var(--lurus-color-creator)"
    status="beta"
    :actions="[
      { label: 'Lutu 다운로드', href: 'https://www.lurus.cn/download#lutu', primary: true, external: true },
    ]"
  />
</div>

---

## <Icon name="briefcase" :size="22" /> 저는 의사결정자입니다 — 기업 도입을 평가합니다 {#decider}

도구 도입이 아니라 인프라 교체입니다. 먼저 TCO와 컴플라이언스 경계를 보고, 그다음에 기능을 보세요.

<div class="action-grid">
  <ActionCard
    name="왜 Lurus인가"
    tagline="4가지 핵심 역량 vs 자체 구축 — TCO, 성능, 컴플라이언스를 한 장의 표로"
    icon="award"
    color="var(--lurus-brand-500)"
    :actions="[
      { label: '기업 솔루션', href: '/solutions/', primary: true },
      { label: 'Why Lurus', href: '/solutions/why-lurus' },
    ]"
  />
  <ActionCard
    name="기업 배포 형태"
    tagline="SaaS · 온프레미스 · 하이브리드 클라우드 · 컴플라이언스 경계를 한 번에 정리"
    icon="server"
    color="var(--lurus-color-platform)"
    :actions="[
      { label: '배포 매트릭스', href: '/solutions/enterprise-deploy', primary: true },
    ]"
  />
  <ActionCard
    product-id="auth"
    :actions="[
      { label: '개요 및 접속점', href: '/ko/platform/auth/', primary: true },
      { label: '기업 SSO 페더레이션', href: '/ko/platform/auth/oidc' },
      { label: '인증 콘솔', href: 'https://auth.lurus.cn', external: true },
    ]"
  />
  <ActionCard
    name="비즈니스 문의"
    tagline="온프레미스 배포 · 라이선스 · 커스터마이징 · 협력 문의"
    icon="mail"
    color="var(--lurus-color-auth)"
    :actions="[
      { label: 'business@lurus.cn', href: 'mailto:business@lurus.cn', primary: true, external: true },
    ]"
  />
</div>

---

## <Icon name="code" :size="22" /> 저는 개발자입니다 — AI 시스템을 구축합니다 {#dev}

LLM 애플리케이션의 4가지 기본 구성 요소: 실행 · 메모리 · 게이트웨이 · CLI. 각각 단독으로도 쓸 수 있고, 조합하면 더 강력합니다.

<div class="action-grid">
  <ActionCard
    product-id="kova"
    :actions="[
      { label: '빠른 시작', href: '/ko/kova/quickstart', primary: true },
      { label: '핵심 개념', href: '/ko/kova/concepts' },
      { label: 'API 참조', href: '/ko/kova/api' },
    ]"
  />
  <ActionCard
    product-id="memx"
    :actions="[
      { label: '빠른 시작', href: '/ko/memx/quickstart', primary: true },
      { label: '핵심 개념', href: '/ko/memx/concepts' },
      { label: '아키텍처 설계', href: '/ko/memx/architecture' },
    ]"
  />
  <ActionCard
    product-id="lumen"
    :actions="[
      { label: '빠른 시작', href: '/ko/lumen/quickstart', primary: true },
      { label: 'Python SDK', href: '/ko/lumen/python-sdk' },
      { label: 'CLI 매뉴얼', href: '/ko/lumen/cli' },
    ]"
  />
  <ActionCard
    product-id="api-ref"
    :actions="[
      { label: 'API 개요', href: '/ko/api/overview', primary: true },
      { label: '인증', href: '/ko/api/authentication' },
      { label: 'Chat Completions', href: '/ko/api/chat-completions' },
    ]"
  />
  <ActionCard
    product-id="arch"
    :actions="[
      { label: '아키텍처 보기', href: '/developer/architecture', primary: true },
    ]"
  />
  <ActionCard
    product-id="forge"
    :actions="[
      { label: '제품 철학', href: '/forge/', primary: true },
      { label: 'Ontology', href: '/forge/ontology' },
    ]"
  />
</div>

---

## 크로스 제품 튜토리얼 · 마이그레이션 가이드

<div class="action-grid action-grid--compact">
  <ActionCard
    name="튜토리얼 센터"
    tagline="MemX + Kova · Lumen + LangGraph · Lucrum 엔드투엔드"
    icon="graduation-cap"
    color="var(--lurus-color-kova)"
    :actions="[
      { label: '크로스 제품 튜토리얼', href: '/tutorials/', primary: true },
    ]"
  />
  <ActionCard
    name="마이그레이션 가이드"
    tagline="OpenAI · LangGraph · 자체 구축 OIDC → 5분 만에 이전"
    icon="import"
    color="var(--lurus-color-lurus-api)"
    :actions="[
      { label: '마이그레이션 센터', href: '/migrations/', primary: true },
    ]"
  />
  <ActionCard
    name="용어집"
    tagline="47개 이상의 기술 용어를 주제별로 분류, 제품 간 빠른 조회"
    icon="book-a"
    color="var(--lurus-color-memx)"
    :actions="[
      { label: '용어 전체 표', href: '/guide/glossary', primary: true },
    ]"
  />
</div>

---

## 왜 Lurus인가?

4가지 판단 포인트 — 또 하나의 도구가 아니라, 한 번의 인프라 교체입니다.

<div class="diff-grid">
  <article class="diff-card diff-card--brand">
    <header class="diff-card__head">
      <span class="diff-card__icon"><Icon name="layers" :size="20" /></span>
      <h3 class="diff-card__title">풀스택 자체 개발</h3>
    </header>
    <p class="diff-card__lede">Rust 실행 엔진부터 Flutter 모바일까지 전부 자체 개발. 계정 / 요금 / 메모리 / 게이트웨이를 공유합니다.</p>
    <ul class="diff-card__points">
      <li>문제가 생겨도 세 업체가 서로 책임을 떠넘기길 기다릴 필요 없음</li>
      <li>쓸수록 가치가 커짐 — 메모리, 요금, 모델이 하나의 풀에서 복리로 쌓임</li>
    </ul>
  </article>

  <article class="diff-card diff-card--accent-kova">
    <header class="diff-card__head">
      <span class="diff-card__icon"><Icon name="zap" :size="20" /></span>
      <h3 class="diff-card__title">엔진급 성능</h3>
    </header>
    <p class="diff-card__lede">Kova 스케줄링 <strong>3μs</strong>(Criterion 벤치마크) · 315K ops/s 처리량.</p>
    <ul class="diff-card__points">
      <li>실행 엔진을 직접 작성했지, Temporal 위에 한 겹 더 감싼 게 아님</li>
      <li>MemX는 LLM을 호출하지 않고도 증류 · Lucrum은 전체 정밀도로 부동소수점 드리프트 없음</li>
    </ul>
  </article>

  <article class="diff-card diff-card--accent-platform">
    <header class="diff-card__head">
      <span class="diff-card__icon"><Icon name="shield-check" :size="20" /></span>
      <h3 class="diff-card__title">데이터 주권</h3>
    </header>
    <p class="diff-card__lede">한 번 배포하면 어떤 클라우드 업체에도 세금을 내지 않습니다. 국산 암호 SM4-GCM으로 전 구간 암호화.</p>
    <ul class="diff-card__points">
      <li>하나의 SSO / Passkey / MFA로 기존 IdP에 연결</li>
      <li>OpenAI SDK 호환 · 떠나고 싶을 때 언제든 데이터를 가지고 떠날 수 있음</li>
    </ul>
  </article>

  <article class="diff-card diff-card--accent-memx">
    <header class="diff-card__head">
      <span class="diff-card__icon"><Icon name="receipt" :size="20" /></span>
      <h3 class="diff-card__title">TCO 투명성</h3>
    </header>
    <p class="diff-card__lede">鹿贝 단위 통합 요금 — 50개 이상 모델, 하나의 청구서.</p>
    <ul class="diff-card__points">
      <li>대사(정산) 시간이 하루에서 5분으로</li>
      <li>언제든 이전 가능, 이탈 비용 제로</li>
    </ul>
  </article>
</div>

<details class="diff-table">
  <summary>전체 비교표 펼치기(8개 차원 × 자체 구축 비교)</summary>

| 차원 | Lurus의 강점 | 자체 구축 대비 |
|------|-------------|---------|
| **풀스택 자체 개발** | Rust 실행 엔진부터 Flutter 모바일까지 핵심 기술을 완전히 자체 통제 | 다중 벤더 조립, 버전 락인 리스크 |
| **엔진급 성능** | Kova 3μs 스케줄링 지연, 315K ops/s(Criterion 벤치마크), 외부 의존성 제로 | 자체 구축 Temporal/LangGraph는 한 단계 느림 |
| **데이터 주권** | 온프레미스 배포, 데이터가 기업 경계를 벗어나지 않음, 국산 암호 SM4-GCM 지원 | 퍼블릭 클라우드는 컴플라이언스·감사 난이도가 높음 |
| **통합 신원** | 모든 제품이 SSO, Passkey, MFA를 공유하고 기업 IdP 페더레이션에 연결 | Keycloak / Auth0 자체 운영 |
| **생태계 시너지** | 12개 제품이 계정/요금/메모리/LLM 게이트웨이를 공유, 쓸수록 가치 상승 | 도구 스택 파편화 |
| **경제적 효율** | MemX는 LLM 비용 제로로 증류; Lucrum은 Decimal.js 전체 정밀도로 오차 제로 | 메모리 / 정밀도 문제에 추가 투자 필요 |
| **TCO 투명성** | 鹿贝 단위 통합 요금, 사용량 과금 + 무료 한도 | 여러 업체 청구서 대사가 복잡 |
| **개방성·이전 가능** | OpenAI SDK 호환, PAT/JWT 표준 인증, 락인 없이 내보내기 | 벤더 락인으로 이탈 비용이 높음 |

</details>

---

## 준비되셨나요?

<div class="finalcta">
  <div class="finalcta__text">
    <h3>5줄의 코드로 게이트웨이를 전환, OpenAI SDK 호환</h3>
    <p>base_url 하나만 바꾸면 기존 호출이 전부 연결됩니다. 하나의 Key로 50개 이상 모델 연결, 가입 시 무료 한도 제공.</p>
  </div>
  <div class="finalcta__actions">
    <a href="/ko/guide/quickstart" class="finalcta__btn finalcta__btn--primary">3분 시작 →</a>
    <a href="https://api.lurus.cn" target="_blank" rel="noopener noreferrer" class="finalcta__btn finalcta__btn--alt">콘솔로 이동 ↗</a>
    <a href="mailto:business@lurus.cn" class="finalcta__btn finalcta__btn--ghost">기업 문의</a>
  </div>
</div>

## 문의하기

<div class="contact-grid">
  <a href="mailto:support@lurus.cn" class="contact-card">
    <span class="contact-card__icon"><Icon name="life-buoy" :size="22" /></span>
    <span class="contact-card__name">기술 지원</span>
    <span class="contact-card__addr">support@lurus.cn</span>
  </a>
  <a href="mailto:business@lurus.cn" class="contact-card contact-card--accent">
    <span class="contact-card__icon"><Icon name="briefcase" :size="22" /></span>
    <span class="contact-card__name">비즈니스 협력</span>
    <span class="contact-card__addr">business@lurus.cn</span>
  </a>
  <a href="https://github.com/hanmahong5-arch" target="_blank" rel="noopener noreferrer" class="contact-card">
    <span class="contact-card__icon"><Icon name="github" :size="22" /></span>
    <span class="contact-card__name">GitHub</span>
    <span class="contact-card__addr">hanmahong5-arch ↗</span>
  </a>
</div>

</div>

<style>
.lurus-home { max-width: 1152px; margin: 0 auto; padding: 24px; }
.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 20px 0 28px;
}
.action-grid--compact {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}
.lurus-home h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--lurus-fs-xl);
  font-weight: 700;
  margin-top: 44px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--vp-c-divider);
  background:
    linear-gradient(to right,
      var(--vp-c-brand-1),
      color-mix(in srgb, var(--vp-c-brand-1) 35%, transparent) 60%,
      transparent 100%)
    bottom left / 36% 1px no-repeat;
  scroll-margin-top: 88px;
}
.lurus-home h2 .lurus-icon { color: var(--vp-c-brand-1); }
.lurus-home hr {
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--vp-c-brand-soft), transparent);
  margin: 40px 0;
}
@media (max-width: 640px) {
  .lurus-home { padding: 16px; }
}

/* ============================================================
 * Persona jump chips — sits under Hero, anchors into 4 personas
 * ============================================================ */
.persona-jump {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: -8px 0 4px;
  padding: 6px 4px;
  background: transparent;
  border: none;
  align-items: center;
  justify-content: center;
}
.persona-jump__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--lurus-radius-pill);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--vp-c-text-2) !important;
  text-decoration: none !important;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  transition: transform var(--lurus-dur-fast) var(--lurus-ease-out),
              border-color var(--lurus-dur-fast),
              color var(--lurus-dur-fast);
}
.persona-jump__chip:hover {
  transform: var(--lurus-hover-rise);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1) !important;
}
.persona-jump__icon {
  display: inline-flex;
  color: var(--vp-c-brand-1);
}
.persona-jump__hint {
  color: var(--vp-c-text-3);
  font-weight: 400;
  font-size: 0.74rem;
}
.persona-jump__chip:hover .persona-jump__hint { color: inherit; opacity: 0.85; }
@media (max-width: 640px) {
  .persona-jump__hint { display: none; }
}

/* anchored personas: leave room for VitePress sticky nav (~64px) + breathing space */
#newbie, #player, #decider, #dev { scroll-margin-top: 88px; }

/* ============================================================
 * Differentiators — 4 cards replacing the 8-row why-Lurus table
 * ============================================================ */
.diff-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
  margin: 18px 0 14px;
}
.diff-card {
  --accent: var(--vp-c-brand-1);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--lurus-radius-lg);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  transition: transform var(--lurus-dur-base) var(--lurus-ease-out),
              border-color var(--lurus-dur-base),
              box-shadow var(--lurus-dur-base);
}
.diff-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent);
}
.diff-card:hover {
  transform: var(--lurus-hover-rise);
  border-color: var(--accent);
  box-shadow: var(--lurus-shadow-3);
}
.diff-card--brand            { --accent: var(--vp-c-brand-1); }
.diff-card--accent-kova      { --accent: var(--lurus-color-kova); }
.diff-card--accent-platform  { --accent: var(--lurus-color-platform); }
.diff-card--accent-memx      { --accent: var(--lurus-color-memx); }
.diff-card__head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.diff-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--lurus-radius-md);
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  color: var(--accent);
  flex-shrink: 0;
}
.diff-card__title {
  margin: 0;
  font-size: 1.02rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  border: none !important;
  padding: 0 !important;
}
.diff-card__lede {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}
.diff-card__lede strong {
  color: var(--accent);
  font-feature-settings: 'tnum';
}
.diff-card__points {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.diff-card__points li {
  position: relative;
  padding-left: 16px;
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
.diff-card__points li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.65;
}

.diff-table {
  margin: 12px 0 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--lurus-radius-md);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}
.diff-table > summary {
  cursor: pointer;
  padding: 12px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  user-select: none;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background var(--lurus-dur-fast);
}
.diff-table > summary::-webkit-details-marker { display: none; }
.diff-table > summary::before {
  content: '▸';
  display: inline-block;
  transition: transform var(--lurus-dur-fast);
  color: var(--vp-c-brand-1);
}
.diff-table[open] > summary::before { transform: rotate(90deg); }
.diff-table > summary:hover { background: var(--vp-c-bg-mute); }
.diff-table table { margin: 0 18px 18px; }

/* ============================================================
 * Final CTA — bottom strip "ready?"
 * ============================================================ */
.finalcta {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 24px;
  align-items: center;
  margin: 24px 0 16px;
  padding: 28px 32px;
  border-radius: var(--lurus-radius-xl);
  background:
    radial-gradient(120% 140% at 0% 0%, color-mix(in srgb, var(--vp-c-brand-1) 14%, transparent), transparent 60%),
    radial-gradient(120% 140% at 100% 100%, color-mix(in srgb, var(--lurus-color-kova) 12%, transparent), transparent 55%),
    var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}
.finalcta__text h3 {
  margin: 0 0 6px;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  border: none !important;
  padding: 0 !important;
}
.finalcta__text p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
.finalcta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
}
.finalcta__btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: var(--lurus-radius-pill);
  text-decoration: none !important;
  transition: transform var(--lurus-dur-fast),
              filter var(--lurus-dur-fast),
              border-color var(--lurus-dur-fast),
              color var(--lurus-dur-fast);
}
.finalcta__btn:hover { transform: var(--lurus-hover-rise); }
.finalcta__btn--primary {
  background: var(--vp-c-brand-1);
  color: #fff !important;
}
.finalcta__btn--primary:hover { filter: brightness(1.08); }
.finalcta__btn--alt {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1) !important;
  border: 1px solid var(--vp-c-divider);
}
.finalcta__btn--alt:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1) !important;
}
.finalcta__btn--ghost {
  color: var(--vp-c-text-2) !important;
}
.finalcta__btn--ghost:hover { color: var(--vp-c-brand-1) !important; }

@media (max-width: 720px) {
  .finalcta {
    grid-template-columns: 1fr;
    padding: 22px 20px;
  }
  .finalcta__actions { justify-content: flex-start; }
}

/* ============================================================
 * Contact card grid
 * ============================================================ */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin: 16px 0 8px;
}
.contact-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 18px 20px;
  border-radius: var(--lurus-radius-lg);
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  text-decoration: none !important;
  color: var(--vp-c-text-1) !important;
  transition: transform var(--lurus-dur-base),
              border-color var(--lurus-dur-base),
              box-shadow var(--lurus-dur-base);
}
.contact-card:hover {
  transform: var(--lurus-hover-rise);
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--lurus-shadow-2);
}
.contact-card--accent { border-color: color-mix(in srgb, var(--vp-c-brand-1) 30%, var(--vp-c-divider)); }
.contact-card__icon {
  color: var(--vp-c-brand-1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: var(--lurus-radius-md);
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
}
.contact-card__name {
  font-weight: 700;
  font-size: 0.95rem;
}
.contact-card__addr {
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  font-family: var(--lurus-font-mono);
}
</style>
