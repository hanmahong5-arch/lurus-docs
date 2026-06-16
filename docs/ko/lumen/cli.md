---
title: Lumen CLI 매뉴얼
description: lumen-cli의 모든 하위 명령, 옵션, 종료 코드 및 워크플로 스캐폴딩.
---

<div class="lumen-page">

# Lumen CLI 매뉴얼 <StatusBadge status="dev" />

`lumen-cli`는 Lumen의 선택적 CLI(Rust 빌드)로, Python SDK에 의존하지 않는 명령줄 워크플로 기능을 제공합니다.

## 설치

```bash
cargo install lumen-cli
# 또는
curl -fsSL https://lumen.lurus.cn/install.sh | sh
```

## 개요

```
lumen <command> [options]
```

| 명령 | 용도 |
|------|------|
| `doctor` | 환경 자가 점검: Token, 네트워크, 디스크, Python 의존성 |
| `init` | 프로젝트 루트에 `lumen.yaml` 설정 템플릿 생성 |
| `agent` | Agent 수준 작업: 목록 / trace / replay / export |
| `mcp` | MCP 호환 계층: Lumen 기능을 Claude/Codex에 노출 |
| `workflow` | `lumen.yaml` 기반 워크플로 실행기 |
| `deploy` | Agent 정의를 Kova Cluster에 푸시 |
| `config` | 로컬 CLI 설정 조회/수정 |

## 명령 상세

```bash
# doctor — 환경 자가 점검（退出码 0 全通过 / 1 至少一项失败）
lumen doctor
#   ✓ LURUS_API_KEY present  ✓ python3.11 detected  ✓ /var/lumen writable (5.2 GB free)
#   ✗ port 7070 occupied — close the process or set LUMEN_PORT

# init — 项目根生成 lumen.yaml（templates: langgraph / bare / multi-agent）
lumen init --template langgraph

# agent
lumen agent list                  # 列出本地/远端 Agent
lumen agent trace <run-id>        # 打印 trace 树
lumen agent replay <run-id>       # 不消耗 Token 重放
lumen agent export <run-id>       # 导出 JSON / HAR / OTel

# mcp — 启动 MCP 服务端，暴露 Trace/Replay/Cost 为工具
lumen mcp serve --port 3333       # 或 --manifest ./my-tools.yaml
# Claude Code / Codex 的 mcp_servers 指向 http://127.0.0.1:3333 即可调用

# workflow — 按 lumen.yaml 执行多 Agent 编排
lumen workflow run                # 默认 pipeline；-e prod 指定环境；--dry-run 不实际调 LLM

# deploy — 推送 Agent 定义到 Kova Cluster
lumen deploy --target kova://my-cluster

# config
lumen config get api_key
lumen config set api_key sk-xxxx
lumen config unset telemetry.endpoint
```

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="rewind" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">replay와 dry-run은 모두 비용이 들지 않습니다</p>
    <div class="lurus-callout__body"><code>lumen agent replay &lt;run-id&gt;</code>는 이력 기록에서 재생하며 <strong>Token을 소비하지 않습니다</strong>; <code>lumen workflow run --dry-run</code>은 오케스트레이션 프로세스를 끝까지 진행하지만 <strong>실제로 LLM을 호출하지 않으므로</strong>, <code>lumen.yaml</code> 설정 검증에 적합합니다.</div>
  </div>
</div>

## 종료 코드

| Code | 의미 |
|------|------|
| `0` | 성공 |
| `1` | 일반 오류 |
| `2` | 매개변수 오류 |
| `3` | 설정 누락 |
| `4` | 네트워크 오류 |
| `5` | 원격 서비스가 오류를 반환 |

## 다음 단계

<NextSteps :steps="[
  { text: '소개로 돌아가기', link: '/ko/lumen/', primary: true },
  { text: 'Python SDK', link: '/ko/lumen/python-sdk' },
  { text: '생태계 통합', link: '/ko/lumen/integration' },
]" />

<RelatedProducts product-id="lumen" />

</div>

<style>
.lumen-page .lurus-callout { margin: 18px 0; }
</style>
