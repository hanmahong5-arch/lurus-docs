---
title: Switch — 팀 설정 동기화
description: Git으로 공유 CLI / MCP 설정을 관리하고, Vault로 민감한 자격 증명을 브리징합니다.
---

<div class="switch-page">

# 팀 설정 동기화 <StatusBadge status="dev" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> 팀 동기화</span>
  <h2 class="lurus-section-head__title">설정은 공유, 자격 증명은 비공개</h2>
  <p class="lurus-section-head__lede">팀 전체가 동일한 AI CLI 및 MCP 설정을 공유하되, 민감한 자격 증명은 각자 독립적으로 두어 절대 Git에 들어가지 않게 합니다.</p>
</div>

## 모델 개요

<ArchitectureDiagram
  chart="graph LR; G[Team Git: 비민감 설정] --> S[Switch: 로컬 UI]; V[Vault / OS Keyring: 민감 자격 증명] --> S; S --> G; S --> V"
  title="설정 배포 모델" />

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="git-merge" :size="22" /></span>
    <div class="lurus-card__title">Git 저장소</div>
    <p class="lurus-card__body">설정 골격을 체크인합니다: server 목록, tool 정의, 사전 설정 Prompt.</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="lock" :size="22" /></span>
    <div class="lurus-card__title">Vault / OS Keyring</div>
    <p class="lurus-card__body">API Key, GitHub Token 등 민감 항목을 저장하며, <strong>절대 Git에 들어가지 않습니다</strong>.</p>
  </div>
</div>

## Git 동기화

<ol class="lurus-steps">

<li>

팀 설정 저장소를 처음 바인딩합니다:

```bash
lurus-switch team init git@github.com:your-org/ai-config.git
```

</li>

<li>

일상적인 풀(pull)과 푸시(push):

```bash
lurus-switch team pull
lurus-switch team push
```

`team pull`은 팀이 공유하는 다음 항목을 가져옵니다:

- `mcp.yaml`（MCP Server 목록）
- `cli-configs/*.yaml`（5종 CLI의 공유 가능 부분）
- `prompts/`（Prompt 템플릿）

</li>

</ol>

## Vault 브리징

```yaml
# ~/.lurus-switch/vault.yaml
provider: hashicorp-vault
address: https://vault.internal.example.com
auth:
  method: token
  token_env: VAULT_TOKEN
```

`mcp.yaml`에서 참조합니다:

```yaml
servers:
  github:
    env:
      GITHUB_TOKEN: vault://secret/ai/github#token
```

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shield" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">평문은 절대 디스크에 저장되지 않음</p>
    <div class="lurus-callout__body">Switch는 MCP Server를 시작할 때 Vault에서 값을 동적으로 가져오며, 자격 증명 평문은 절대 디스크에 저장되지 않습니다.</div>
  </div>
</div>

지원되는 Provider:

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="lock" :size="20" /></span>
    <div class="lurus-card__title">HashiCorp Vault</div>
    <p class="lurus-card__body">중앙 집중식 키 관리 서비스</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">macOS Keychain</div>
    <p class="lurus-card__body">시스템 수준 자격 증명 저장소</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">Windows Credential Manager</div>
    <p class="lurus-card__body">시스템 수준 자격 증명 저장소</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">Linux Secret Service</div>
    <p class="lurus-card__body">libsecret 백엔드</p>
  </div>
</div>

## Diff 감사

```bash
lurus-switch team diff
```

로컬과 팀 원격 간의 설정 차이를 표시합니다（민감 항목 제외）.

## 롤백

```bash
lurus-switch team rollback <commit-sha>
```

로컬 설정을 Git의 임의 과거 버전으로 되돌립니다.

## 다음 단계

<NextSteps :steps="[
  { text: '사용 설명서로 돌아가기', link: '/ko/switch/usage', primary: true },
  { text: 'MCP 서버', link: '/ko/switch/mcp-servers' },
  { text: '비용 모니터링', link: '/ko/switch/cost-monitoring' },
]" />

</div>

<style scoped>
.switch-page .lurus-section-head { margin-top: 2.6rem; }
</style>
