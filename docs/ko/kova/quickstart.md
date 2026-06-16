---
title: Kova 빠른 시작
description: 5분 만에 첫 Kova Agent를 실행하는, 설치부터 구동까지의 완전한 가이드.
---

<div class="kova-qs-page">

# 빠른 시작 <StatusBadge status="dev" />

5분 만에 첫 Kova Agent를 실행하세요.

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">5분</span><span class="lurus-stat__label">예상 소요 시간</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">3가지</span><span class="lurus-stat__label">설치 방식</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">제로</span><span class="lurus-stat__label">외부 의존성</span></div>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">사전 조건</p>
    <div class="lurus-callout__body">Docker 또는 Rust 1.93+(택일) · Lurus <Term t="API Key">API Key</Term>(<a href="/ko/guide/get-api-key">발급 방법</a>) · 8 GB+ 메모리(권장) · 기본 터미널 지식. 예상 5분.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package" :size="14" /> 설치</span>
  <h2 class="lurus-section-head__title">Kova 설치</h2>
  <p class="lurus-section-head__lede">Docker(권장), 사전 컴파일된 바이너리, 또는 소스에서 빌드 중 하나를 선택하세요.</p>
</div>

<CodeShowcase
  title="설치 방식 하나를 선택하세요"
  :tabs="[
    { lang: 'bash', label: 'Docker（권장）', code: 'docker run -d \\\n  --name kova \\\n  -p 8080:8080 \\\n  -v kova-data:/data \\\n  -e LURUS_API_KEY=sk-your-key \\\n  ghcr.io/hanmahong5-arch/kova:latest' },
    { lang: 'bash', label: '사전 컴파일된 바이너리', code: '# Linux / macOS\nchmod +x kova-linux-amd64\n./kova-linux-amd64 serve --port 8080' },
    { lang: 'bash', label: '소스에서 빌드', code: 'git clone https://github.com/hanmahong5-arch/agentdrq.git\ncd agentdrq\n\n# 使用 pure-rust 特性（无系统依赖）\ncargo build --workspace --no-default-features --features pure-rust --release' },
  ]"
/>

사전 컴파일된 바이너리는 [GitHub Releases](https://github.com/hanmahong5-arch/agentdrq/releases)에서 내려받으세요:

| 플랫폼 | 파일 |
|------|------|
| Linux x86_64 | `kova-linux-amd64` |
| macOS (Apple Silicon) | `kova-darwin-arm64` |
| macOS (Intel) | `kova-darwin-amd64` |
| Windows | `kova-windows-amd64.exe` |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="zap" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Rust 버전 요구 사항</p>
    <div class="lurus-callout__body">Kova는 Rust 1.93+ (Edition 2024)를 요구합니다. rustup으로 툴체인을 관리하는 것을 권장합니다.</div>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> 설정</span>
  <h2 class="lurus-section-head__title">설정</h2>
</div>

설정 파일 `kova.toml`을 생성하세요:

```toml
[server]
port = 8080
data_dir = "./data"

[llm]
# 通过 Lurus API 接入所有模型
provider = "openai-compatible"
base_url = "https://api.lurus.cn/v1"
api_key = "sk-your-lurus-key"
default_model = "deepseek-chat"

[wal]
# WAL 持久化配置
enabled = true
sync_mode = "normal"  # "normal" | "full" (每次写入 fsync)

[security]
# 可选：启用 WAL 加密
# encrypt = true
# encrypt_algorithm = "aes-256-gcm"
```

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bot" :size="14" /> 시작하기</span>
  <h2 class="lurus-section-head__title">첫 Agent 실행하기</h2>
  <p class="lurus-section-head__lede">REST / Rust SDK / CLI 중 택일하여 Agent를 생성하고, 작업을 전송하고, 실행을 스트리밍으로 확인하세요.</p>
</div>

구동한 뒤, 익숙한 접속 방식을 선택해 첫 Agent를 생성하고 실행하세요(전체 엔드포인트는 [API 참조](/ko/kova/api) 참고).

:::tabs
== REST API

1. **Agent 생성** — `POST /api/v1/agents`, 응답에 `id="agt_a1b2c3d4"`, `status="idle"` 포함

```bash
curl -X POST http://localhost:8080/api/v1/agents \
  -H "Content-Type: application/json" \
  -d '{ "name": "researcher", "system_prompt": "你是一个专业的技术研究员，深入分析主题并给出结构化研究报告。", "model": "deepseek-chat", "tools": ["web_search", "file_write"] }'
```

2. **작업 전송** — `POST /api/v1/agents/{id}/tasks`, 응답에 `task_id="tsk_e5f6g7h8"`, `status="running"` 포함

```bash
curl -X POST http://localhost:8080/api/v1/agents/agt_a1b2c3d4/tasks \
  -H "Content-Type: application/json" \
  -d '{ "message": "研究 Rust 在 AI 基础设施中的应用趋势，输出一份 500 字的报告" }'
```

3. **확인 / 스트리밍 추적** — `GET /api/v1/tasks/{id}` 또는 WebSocket으로 실행 과정을 실시간 확인

```bash
curl http://localhost:8080/api/v1/tasks/tsk_e5f6g7h8
wscat -c ws://localhost:8080/api/v1/tasks/tsk_e5f6g7h8/stream
```

== Rust SDK

프로세스 내부에 Kova 엔진을 직접 임베드하면, 크래시 후 로컬 WAL에서 자동으로 복구됩니다:

```rust
use kova::prelude::*;

let engine = KovaBuilder::new()
    .wal_dir("./agent-state")
    .build()?;

let agent = engine.create_agent("researcher")
    .model("deepseek-chat")
    .tools(&["web_search", "file_read"])
    .build()?;

// Agent 崩溃 → 从 WAL 自动恢复，不重调 LLM
agent.run("帮我调研 WASM Component Model").await?;
```

== CLI

Kova에는 TUI(터미널 대화형 인터페이스)와 커맨드라인이 내장되어 있습니다:

```bash
# 启动 TUI
kova tui

# 或直接用 CLI 命令
kova agent create --name researcher --model deepseek-chat
kova agent run researcher "分析 Rust 在 AI 领域的应用"
kova agent list
kova agent logs researcher --tail 50
```
:::

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> 워크플로</span>
  <h2 class="lurus-section-head__title">워크플로 생성</h2>
</div>

워크플로는 여러 단계를 순서가 있는 실행 파이프라인으로 연결합니다(단계 간에는 템플릿 변수로 값을 전달하며, 예시는 아래 참고):

```bash
curl -X POST http://localhost:8080/api/v1/workflows \
  -H "Content-Type: application/json" \
  -d '{ "name": "content-pipeline", "steps": [
    { "name": "research", "agent": "researcher", "prompt": "研究主题：{{input.topic}}" },
    { "name": "write", "agent": "writer", "prompt": "基于研究报告撰写博客：\n{{steps.research.output}}" },
    { "name": "review", "agent": "editor", "prompt": "审校并优化：\n{{steps.write.output}}" }
  ] }'

# 触发
curl -X POST http://localhost:8080/api/v1/workflows/content-pipeline/run \
  -H "Content-Type: application/json" -d '{"input": {"topic": "边缘计算与 AI 推理"}}'
```

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="database-backup" :size="14" /> 영속성</span>
  <h2 class="lurus-section-head__title">영속성 검증</h2>
  <p class="lurus-section-head__lede">프로세스를 강제 종료하고 재시작하면, 작업이 WAL의 중단 지점에서 자동으로 복구됩니다.</p>
</div>

Kova의 크래시 복구 능력을 테스트해 보세요:

<ol class="lurus-steps">
<li>

**장시간 작업 시작**

```bash
kova agent run researcher "写一份 5000 字的深度报告"
```

</li>
<li>

**작업 실행 중 프로세스를 강제 종료**

```bash
kill -9 $(pgrep kova)
```

</li>
<li>

**Kova 재시작**

```bash
./kova serve
```

</li>
<li>

**작업 상태 확인** — 중단 지점에서 자동 복구

```bash
kova task status
```

</li>
</ol>

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">복구가 가능한 이유</p>
    <div class="lurus-callout__body">각 단계 실행 전에 먼저 <Term t="WAL">WAL</Term>(CRC32 검증 포함)을 기록합니다. 프로세스가 크래시되면, 완료 확인되지 않은 단계는 재시작 후 중단 지점부터 재생됩니다——LLM을 다시 호출하지 않고, 진행 상황을 잃지 않습니다. 자세한 내용은 <a href="/ko/kova/concepts">핵심 개념</a> 참고.</div>
  </div>
</div>

---

## 다음 단계

<NextSteps
  :steps="[
    { text: '핵심 개념 — Agent, Workflow, WAL 아키텍처 깊이 이해하기', link: '/ko/kova/concepts', primary: true },
    { text: 'API 참조 — 완전한 REST API 엔드포인트 목록', link: '/ko/kova/api' },
    { text: 'Lurus API — 기반 LLM 게이트웨이 알아보기', link: '/ko/guide/introduction' },
  ]"
/>

</div>
