---
title: Lumen — Agent 관측성 및 신뢰성 도구
description: Python SDK 우선 + Rust 엔진 + 선택형 CLI로, Agent 개발자에게 관측성, 디버깅, 신뢰성 보장을 제공합니다.
---

<div class="lumen-page">

<ProductHero product-id="lumen" />

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="check-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">사전 조건</p>
    <div class="lurus-callout__body"><ul><li>우선: Python 3.9+(<code>pip install lumen-ai</code>)</li><li>선택형 CLI: Rust 1.93+ 에서 소스 컴파일 <code>lumen-cli</code></li><li>Lurus <Term t="API Key">API Key</Term> 1개(<a href="/ko/guide/get-api-key">발급 방법</a>)</li></ul></div>
  </div>
</div>

## Lumen이란?

**Lumen**은 AI Agent 개발자를 위한 **3-in-1 신뢰성 도구**입니다 — Replay(제로 비용 재실행) + Crash Recovery(마이크로초급 <Term t="Checkpoint">크래시 복구</Term>) + Cost Tracking(실시간 비용 추적). **제공 형태**: Python SDK 우선(`pip install lumen-ai`, LangGraph/Agent 우선) + Rust 엔진(`lumen-core` 성능 기반) + 선택형 CLI(`lumen-cli` v0.1.0). 이념: *Illuminate your AI agents. Never lose a run. Never burn tokens blindly.*

```python
pip install lumen-ai

from lumen_ai import LumenTracer, LumenCheckpointer, CostTracker

# 三行代码接入 — LangGraph 原生集成
graph = workflow.compile(
    checkpointer=LumenCheckpointer(),   # 崩溃恢复
    callbacks=[LumenTracer()]            # 执行追踪 + 成本追踪
)
```

하단의 Rust 엔진(lumen-core)이 구동하고, Python SDK가 친숙한 인터페이스를 제공하며, [Kova Agent 엔진](/ko/kova/)과 Python 생태계를 연결합니다.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">3 줄</span><span class="lurus-stat__label">LangGraph 연동</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">마이크로초급</span><span class="lurus-stat__label">크래시 복구</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">30+</span><span class="lurus-stat__label">모델 가격표</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">v0.1.0</span><span class="lurus-stat__label">lumen-cli</span></div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="zap" :size="14" /> 핵심 기능</span>
  <h2 class="lurus-section-head__title">3-in-1 신뢰성</h2>
  <p class="lurus-section-head__lede">재실행, 복구, 비용 — 한 번 연동하면 모두 준비됩니다.</p>
</div>

<CapabilityGrid
  accent="var(--lurus-color-lumen)"
  :items="[
    { title: 'Replay — 제로 비용 결정적 재실행', icon: 'rewind', body: 'trace JSON에서 임의의 실행을 재실행하며, LLM을 호출하지 않아 비용이 들지 않고, 지정한 단계부터 시작해 문제를 정밀하게 특정할 수 있습니다. lumen replay TRACE_ID(전체) / --from 5(5번째 단계부터).' },
    { title: 'Crash Recovery — 마이크로초급 크래시 복구', icon: 'life-buoy', body: 'LangGraph CheckpointSaver를 완전히 구현하여 네이티브 SQLite/Redis Checkpointer를 그대로 대체합니다. 메모리+디스크 2계층, 원자적 쓰기, 복구는 엔진 레벨 WAL 재실행을 거치며 외부 서비스 의존성이 없습니다.' },
    { title: 'Cost Tracking — 실시간 비용 추적', icon: 'coins', body: '30+ 모델 가격표(Claude / GPT-4o / Gemini / Llama / DeepSeek)를 내장하여, LLM이 비용을 반환하지 않아도 추정할 수 있습니다. 단일 호출이 평균값의 2배를 초과하면 자동으로 경고합니다. lumen cost --last 24h / lumen traces.' },
  ]"
/>

### 추가 기능

| 기능 | 설명 |
|------|------|
| **Agent 관리** | Agent 생성, 시작, 중지, 삭제 |
| **워크플로 디버깅** | 로컬에서 워크플로 실행, 단계별 디버깅 |
| **로그 조회** | Agent 실행 로그 실시간 조회 |
| **배포** | Agent를 Kova 클라우드 인스턴스에 배포 |
| **MCP 관리** | MCP 도구 서비스 설치 및 구성 |
| **인터랙티브 REPL** | 터미널에서 Agent와 직접 대화 |

---

## 설치

```bash
pip install lumen-ai                          # Python SDK（推荐）
curl -fsSL https://get.lurus.cn/lumen | sh    # CLI macOS/Linux
# Windows (PowerShell): irm https://get.lurus.cn/lumen.ps1 | iex
# 从源码（Rust 1.93+，首次编译约 2-3 分钟）：
git clone https://github.com/hanmahong5-arch/lumen.git && cd lumen && cargo build --release
# 二进制在 target/release/lumen
```

검증: `lumen --version`(→ `lumen 0.1.0`); `lumen doctor`(Lurus API connected / Kova optional 확인).

---

## 빠른 시작

```bash
# 初始化项目（结构: agent.toml / prompts/system.md / tools/search.yaml / workflows/main.yaml）
lumen init my-agent && cd my-agent

# 配置 API Key
lumen auth login                              # 浏览器登录授权自动配置
lumen config set api_key sk-your-lurus-key    # 或直接设置

# 本地运行 Agent
lumen run --interactive                       # 交互模式
lumen run "分析这段代码的性能问题" --file ./main.py
lumen run "翻译这段文本" --model gpt-4o        # 指定模型

# 工作流调试
lumen workflow run main --input topic="AI trends"
lumen workflow run main --step-by-step        # 逐步调试（每步暂停）
lumen workflow history main --last            # 上次运行结果
```

---

## 자주 쓰는 명령어

```bash
# Agent 管理
lumen agent list / create researcher / info researcher / logs researcher / delete researcher
# MCP 工具
lumen mcp list / install github / test github / remove github
# 部署
lumen deploy --target kova        # 或 --target docker
lumen deploy status
# 配置
lumen config list / set api_key xxx / get api_key
```

---

## 구성 파일

`agent.toml`은 Agent 프로젝트의 핵심 구성입니다:

```toml
[agent]
name = "my-researcher"
model = "deepseek-chat"
max_iterations = 20

[agent.llm]
base_url = "https://api.lurus.cn/v1"
temperature = 0.7
max_tokens = 4096

[tools]
builtin = ["web_search", "file_read", "file_write"]

[[tools.mcp]]
name = "github"
command = "npx"
args = ["-y", "@modelcontextprotocol/server-github"]

[deploy]
target = "kova"
```

---

## Kova와의 관계

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Lumen</div>
    <p class="lurus-card__body">개발자용 커맨드라인 도구 — 로컬 개발, 디버깅, 배포. 경량 런타임 <code>lumen run</code> 으로 즉시 실행할 수 있습니다.</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Kova</div>
    <p class="lurus-card__body">Agent 런타임 엔진 — 영속 실행, WAL, 클러스터 관리. <code>lumen deploy</code> 이후 완전한 영속성과 클러스터 능력을 얻습니다.</p>
  </div>
</div>

로컬 개발에는 경량 런타임(`lumen run`)을 사용하고, Kova에 배포(`lumen deploy`)한 후에는 완전한 영속성과 클러스터 능력을 얻습니다.

---

## 다른 솔루션과의 비교

<ComparisonTable
  self-label="Lumen"
  :competitors="['Temporal', 'LangGraph Checkpointer', 'Conductor']"
  :rows="[
    { dimension: 'Replay', self: '제로 비용 LLM 재실행', alt: { Temporal: 'Event replay', 'LangGraph Checkpointer': '부분 지원', Conductor: 'Workflow replay' } },
    { dimension: '연동 비용', self: '3 줄 코드', alt: { Temporal: 'Worker + SDK', 'LangGraph Checkpointer': '구성 필요', Conductor: 'Worker' } },
    { dimension: 'Cost 추적', self: '내장', alt: { Temporal: '없음', 'LangGraph Checkpointer': '없음', Conductor: '없음' } },
  ]"
  title="비교"
/>

---

## 관련 제품 및 다음 단계

<NextSteps
  :steps="[
    { text: '빠른 시작', link: '/ko/lumen/quickstart', primary: true },
    { text: 'Python SDK', link: '/ko/lumen/python-sdk' },
    { text: 'CLI 핸드북', link: '/ko/lumen/cli' },
    { text: '통합 및 MCP 디렉터리', link: '/integrations/' },
    { text: 'MCP 프로토콜 공식 문서', link: 'https://modelcontextprotocol.io/', external: true },
  ]"
  title="다음 단계"
/>

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-callout { margin: 20px 0 8px; }
.lumen-page .lurus-stat-strip { margin: 18px 0 4px; }
</style>
