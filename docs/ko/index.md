---
layout: page
title: LurusTech 문서
description: "고객 자체 환경의 AI 시스템을 상태는 검증할 수 있고, 데이터는 복구할 수 있으며, 변경은 기록되도록. Witness·Kova·MemX·게이트웨이·플랫폼 기반 문서의 입구입니다."
---

<div class="vp-doc lurus-home">

<Hero />

<section class="home-block" aria-labelledby="home-parts">

## 구성 요소별 문서 {#home-parts}

<ul class="home-parts">
  <li>
    <a class="home-parts__name" href="/witness/">Lurus Witness</a><Badge type="warning" text="초기 파일럿" />
    <p>읽기 전용 수집, 외부 프로빙, 매월 실제 복구 훈련과 월간 증거 보고서. 모든 판독값에 증거의 강도를 명시합니다. 문서는 중국어로 제공됩니다.</p>
  </li>
  <li>
    <a class="home-parts__name" href="/ko/kova/">Kova</a><Badge type="warning" text="초기 파일럿" />
    <p>임베디드 영속 실행 엔진: 선행 기록 로그 기반 크래시 복구, 실행 기록, 리플레이.</p>
  </li>
  <li>
    <a class="home-parts__name" href="/ko/memx/">MemX</a><Badge type="warning" text="초기 파일럿" />
    <p>AI 메모리 엔진: 추출·중복 제거·감쇠·하이브리드 검색. CLI / REST / MCP로 연결.</p>
  </li>
  <li>
    <a class="home-parts__name" href="/ko/guide/quickstart">게이트웨이와 API</a><Badge type="tip" text="내부 프로덕션 사용 중" />
    <p>프라이빗 배포형 멀티테넌트 LLM 게이트웨이로, 오픈소스 New API(AGPLv3)를 기반으로 합니다. 인터페이스 세부 사항은 <a href="/ko/api/overview">API 레퍼런스</a>를 참고하세요.</p>
  </li>
  <li>
    <a class="home-parts__name" href="/ko/platform/">플랫폼 기반</a><Badge type="tip" text="내부 프로덕션 사용 중" />
    <p>모든 구성 요소가 함께 쓰는 계정과 로그인. 기반 계층이며 단독으로 제공하지 않습니다.</p>
  </li>
</ul>

</section>

<section class="home-block" aria-labelledby="home-start">

## 어디서 시작할까 {#home-start}

<dl class="home-start">
  <dt>Witness를 배포하는 운영 담당자</dt>
  <dd>먼저 <a href="/witness/deploy">배포 (중국어)</a>를, 이어서 <a href="/witness/evidence">핵심 개념 (중국어)</a>을 읽고 각 판독값의 출처와 확실성을 파악하세요.</dd>
  <dt>게이트웨이를 연동하는 개발자</dt>
  <dd><a href="/ko/guide/quickstart">빠른 시작</a>로 호출을 한 번 성공시키고, 필드와 오류 코드는 <a href="/ko/api/overview">API 레퍼런스</a>에서 확인하세요.</dd>
  <dt>평가하는 의사결정자</dt>
  <dd><a href="/witness/">Witness 개요 (중국어)</a>의 「무엇이 아닌가」와 「현재 어디까지 왔나」를 읽은 뒤 <a href="/witness/drills">복구 훈련과 월간 보고서 (중국어)</a>를 보세요.</dd>
</dl>

</section>

<section class="home-block" aria-labelledby="home-bounds">

## 경계 {#home-bounds}

<p class="home-bounds">데이터센터나 연산 자원을 재판매하지 않으며, 증명할 수 없는 숫자는 약속하지 않습니다. 성숙도는 네 단계(초기 파일럿·내부 프로덕션 사용 중·오픈소스·설계 중)로만 표시하고, 애매하면 더 보수적인 쪽을 택합니다.</p>

</section>

</div>

<style>
.lurus-home { max-width: 1152px; margin: 0 auto; padding: 24px; }
.lurus-home .home-block { max-width: 44rem; margin: 40px 0 0; }
.lurus-home .home-block h2 {
  font-size: var(--lurus-fs-lg);
  font-weight: 600;
  margin: 0 0 12px;
  padding: 0 0 8px;
  border-top: none;
  border-bottom: 1px solid var(--vp-c-divider);
}
.home-parts { list-style: none; padding: 0 !important; margin: 0; }
.home-parts li {
  margin: 0 !important;
  padding: 14px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}
.home-parts__name { font-weight: 600; text-decoration: none !important; }
.home-parts p { margin: 4px 0 0 !important; color: var(--vp-c-text-2); line-height: 1.6; }
.home-start { margin: 0; }
.home-start dt { font-weight: 600; margin-top: 14px; }
.home-start dd { margin: 4px 0 0; color: var(--vp-c-text-2); line-height: 1.6; }
.home-bounds { color: var(--vp-c-text-2); line-height: 1.7; }
@media (max-width: 640px) {
  .lurus-home { padding: 16px; }
}
</style>
