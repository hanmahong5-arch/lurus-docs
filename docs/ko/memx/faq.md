---
title: MemX 자주 묻는 질문
description: MemX AI 메모리 엔진의 자주 묻는 질문과 답변.
---

<div class="memx-faq">

# 자주 묻는 질문

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="brain" :size="14" /> 기초</span>
  <h2 class="lurus-section-head__title">기초 질문</h2>
</div>

<details class="lurus-faq-item"><summary>MemX와 mem0은 어떤 관계인가요?</summary>

MemX는 [mem0](https://github.com/mem0ai/mem0)의 강화 버전(상위 집합)으로, ACE 지능형 메모리 관리 계층이 추가되었습니다. `ace_enabled=False`일 때는 mem0와 동작이 완전히 동일하며 오버헤드가 없습니다.

</details>

<details class="lurus-faq-item"><summary>GPU가 필요한가요?</summary>

필요하지 않습니다. 로컬 임베딩 모델 all-MiniLM-L6-v2는 ONNX Runtime을 통해 CPU에서 실행되며(&lt; 5ms/건), Reflector 규칙 사전 필터링은 GPU에 의존하지 않고, hybrid의 LLM 정제는 원격 API를 사용합니다.

</details>

<details class="lurus-faq-item"><summary>추가 LLM 토큰 소비가 발생하나요?</summary>

기본값인 `hybrid`는 가치 있는 후보에 대해서만 LLM을 호출하여 mem0의 전량 호출 대비 90% 이상 감소시킵니다. LLM을 사용할 수 없을 때는 자동으로 순수 규칙 모드로 다운그레이드되어 비용이 없습니다. 명시적으로 끄려면 `reflector.mode="rules"`로 설정합니다.

</details>

<details class="lurus-faq-item"><summary>어떤 벡터 데이터베이스를 지원하나요?</summary>

mem0의 전부(Qdrant, Chroma, Pinecone, Weaviate, Milvus 등)를 상속하며, 기본 메모리 저장은 개발 및 테스트에 적합합니다.

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> 사용</span>
  <h2 class="lurus-section-head__title">사용 질문</h2>
</div>

<details class="lurus-faq-item"><summary>mem0에서 어떻게 마이그레이션하나요?</summary>

<ol class="lurus-steps">
<li>

`pip install git+https://github.com/UU114/memx.git`

</li>
<li>

`from mem0 import Memory`를 `from memx import Memory`로 변경합니다.

</li>
<li>

기존 코드는 수정할 필요가 없습니다(ACE는 기본적으로 꺼져 있습니다).

</li>
<li>

준비가 되면 `config={"ace_enabled": True}`를 추가하여 지능형 기능을 활성화합니다.

</li>
</ol>

</details>

<details class="lurus-faq-item"><summary>데이터는 어디에 저장되나요?</summary>

구성된 벡터 데이터베이스 백엔드에 따라 다릅니다. 기본값은 메모리(재시작 시 손실)이며, 프로덕션에서는 Qdrant/Chroma 영속화를 권장합니다. 로컬 임베딩 모델은 `~/.memx/models/`에 캐시됩니다.

</details>

<details class="lurus-faq-item"><summary>감쇠 속도는 어떻게 제어하나요?</summary>

| 매개변수 | 효과 |
|------|------|
| `decay.half_life_days` | 증가 → 감쇠가 느려짐(기본값 30일) |
| `decay.boost_factor` | 증가 → 리콜 강화가 더 뚜렷해짐(기본값 0.1) |
| `decay.permanent_threshold` | 감소 → 영구 메모리가 되기 더 쉬움(기본값 15회) |

</details>

<details class="lurus-faq-item"><summary>잘못 판단된 지식은 어떻게 처리하나요?</summary>

<ol class="lurus-steps">
<li>

`memx list --scope project:my-app` — 확인

</li>
<li>

`memx forget <memory-id>` — 삭제

</li>
<li>

`memx learn "correct knowledge"` — 수동 추가

</li>
</ol>

</details>

<details class="lurus-faq-item"><summary>여러 사람 / 여러 에이전트가 메모리를 어떻게 공유하나요?</summary>

데몬 프로세스 모드를 활성화하면 여러 에이전트가 IPC Socket을 통해 동일한 지식 베이스를 공유합니다(IDE 플러그인, 팀 협업). `scope`를 사용하여 프로젝트/워크스페이스를 구분합니다.

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> 개인정보 보호</span>
  <h2 class="lurus-section-head__title">개인정보 보호 질문</h2>
</div>

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">필터링은 끌 수 없음</p>
    <div class="lurus-callout__body"><p>12개의 내장 민감 정보 필터링 규칙은 비활성화할 수 없는 보안 하한선이며, <code>privacy_custom_patterns</code>를 통해 추가 규칙만 더할 수 있습니다.</p></div>
  </div>
</div>

<details class="lurus-faq-item"><summary>어떤 민감 정보 유형의 필터링을 지원하나요?</summary>

| 유형 | 예시 |
|---------|------|
| PEM 개인 키 | `-----BEGIN RSA PRIVATE KEY-----` |
| Bearer / JWT Token | `Bearer eyJhbG...` |
| Anthropic API Key | `sk-ant-api03-*` |
| OpenAI API Key | `sk-proj-*` |
| GitHub Token | `ghp_*`, `github_pat_*` |
| AWS Access Key | `AKIA*` |
| AWS Secret Key | 40자 base64 |
| 데이터베이스 연결 문자열 | `postgres://user:pass@host/db` |
| 운영 체제 경로 | `/home/user/.ssh/id_rsa` |
| 사용자 정의 규칙 | `privacy_custom_patterns`를 통해 추가 |

::: info
이 12개 규칙은 **키와 로컬 경로** 유형의 민감 정보(secrets + user paths)에 초점을 맞추며, 전통적 의미의 PII(이메일 / 전화 / 신분증 등)가 아닙니다. PII 필터링이 필요하면 `privacy_custom_patterns`를 통해 직접 확장하세요.
:::

</details>

<details class="lurus-faq-item"><summary>필터링된 원본 값은 어디로 갔나요?</summary>

플레이스홀더(예: `[REDACTED:api_key]`)로 대체되며, 원본 값은 어디에도 저장되지 않습니다. 필터링은 쓰기 파이프라인의 가장 앞단에서 실행됩니다.

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> 성능</span>
  <h2 class="lurus-section-head__title">성능 질문</h2>
</div>

<details class="lurus-faq-item"><summary>메모리를 몇 건이나 저장할 수 있나요?</summary>

벡터 데이터베이스 백엔드 용량에 따라 다르며, MemX 자체에는 하드 제한이 없습니다. 감쇠 엔진이 자동으로 아카이브하여 활성 규모를 적정하게 유지합니다.

</details>

<details class="lurus-faq-item"><summary>RecallReinforcer가 검색 성능에 영향을 주나요?</summary>

아니요. 비동기 백그라운드 스레드로, 결과를 반환한 후에야 `recall_count`를 업데이트하므로 검색을 차단하지 않습니다.

</details>

<details class="lurus-faq-item"><summary>검색 지연 시간은 어느 정도인가요?(&lt; 10,000건 메모리)</summary>

| 작업 | 지연 시간 |
|------|------|
| 4계층 하이브리드 검색 | 10-50ms |
| 순수 키워드 검색(L4 다운그레이드) | 5-20ms |
| 로컬 임베딩 계산 | &lt; 5ms |
| 쓰기(Reflector + Curator 포함) | 20-100ms |

</details>

## 다음 단계

<NextSteps
  :steps="[
    { text: '빠른 시작 — 5분 만에 핵심 기능 체험', link: '/ko/memx/quickstart', primary: true },
    { text: '핵심 개념 — ACE 엔진 심화', link: '/ko/memx/concepts' },
    { text: '아키텍처 설계 — 전체 시스템 아키텍처', link: '/ko/memx/architecture' },
  ]"
/>

</div>
