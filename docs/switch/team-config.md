---
title: Switch — 团队配置同步
description: 通过 Git 管理共享 CLI / MCP 配置，Vault 桥接敏感凭证。
---

# 团队配置同步 <StatusBadge status="dev" />

让整个团队共享同一套 AI CLI 与 MCP 配置，但敏感凭证各自独立。

## 模式总览

```
  ┌─────────────┐       ┌─────────────┐      ┌───────────────┐
  │  Team Git   │◄────► │   Switch    │◄────►│ Vault/OS Keyring │
  │ (非敏感配置)│       │  (本地 UI)  │      │  (敏感凭证)    │
  └─────────────┘       └─────────────┘      └───────────────┘
```

- **Git 仓库**：签入配置骨架（server 列表、tool 定义、预设 Prompt）
- **Vault / OS Keyring**：存 API Key、GitHub Token 等敏感项，**永远不入 Git**

## Git 同步

```bash
# 首次
lurus-switch team init git@github.com:your-org/ai-config.git

# 日常
lurus-switch team pull
lurus-switch team push
```

`team pull` 会拉取团队共享的：

- `mcp.yaml`（MCP Server 列表）
- `cli-configs/*.yaml`（5 款 CLI 的可分享部分）
- `prompts/`（Prompt 模板）

## Vault 桥接

```yaml
# ~/.lurus-switch/vault.yaml
provider: hashicorp-vault
address: https://vault.internal.example.com
auth:
  method: token
  token_env: VAULT_TOKEN
```

在 `mcp.yaml` 引用：

```yaml
servers:
  github:
    env:
      GITHUB_TOKEN: vault://secret/ai/github#token
```

Switch 在启动 MCP Server 时动态从 Vault 取值，明文永不落盘。

支持的 Provider：

- HashiCorp Vault
- macOS Keychain
- Windows Credential Manager
- Linux Secret Service (libsecret)

## Diff 审计

```bash
lurus-switch team diff
```

显示本地与团队远端的配置差异（不含敏感项）。

## 回滚

```bash
lurus-switch team rollback <commit-sha>
```

本地配置回到 Git 任意历史版本。

## 下一步

<NextSteps :steps="[
  { text: '回到使用手册', link: '/switch/usage', primary: true },
  { text: 'MCP 服务器', link: '/switch/mcp-servers' },
  { text: '成本监控', link: '/switch/cost-monitoring' },
]" />
