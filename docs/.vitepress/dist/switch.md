---
url: /switch.md
---
# Lurus Switch — 智能桌面客户端

## 什么是 Lurus Switch？

**Lurus Switch** 是一个桌面端 AI 模型网关，基于 **Wails**（Go + Web 技术栈）构建，支持 Windows / macOS / Linux 全平台。

它在本地监听一个 HTTP 代理端口，将你的 AI 请求按配置的规则路由到不同的模型服务（Lurus API、OpenAI、本地 Ollama 等），实现一键切换，不需要修改任何应用配置。

## 适用场景

| 场景 | 说明 |
|------|------|
| **多模型切换** | 不同任务快速切换 GPT / Claude / DeepSeek，不改代码 |
| **企业统一出口** | 团队所有 AI 请求走同一个出口，集中管控 API Key |
| **网络代理** | 在网络受限环境下，通过 Switch 代理访问国际 AI 服务 |
| **离线配置** | 本地保存所有模型配置，无需依赖云端 |
| **请求监控** | 实时查看所有 AI 请求的 Token 用量和延迟 |

## 工作原理

```
你的应用 (OpenAI SDK)
        │
        ▼
Lurus Switch (localhost:11434)
        │
  ┌─────┼──────────────┐
  │     │              │
  ▼     ▼              ▼
Lurus  OpenAI        Ollama
 API   直连        (本地模型)
```

Switch 在本地暴露一个兼容 OpenAI API 的端点（默认 `http://localhost:11434/v1`），你的应用只需将 `base_url` 改为这个本地地址，后续路由完全由 Switch 接管。

## 支持的平台

| 平台 | 版本要求 |
|------|---------|
| Windows | Windows 10 64-bit 及以上 |
| macOS | macOS 12 (Monterey) 及以上 |
| Linux | Ubuntu 20.04 / Debian 11 及以上 |

## 下一步

* [安装指南](/switch/install) — 下载并完成首次安装
* [配置说明](/switch/configuration) — 添加模型、设置路由规则
* [使用手册](/switch/usage) — 日常使用和高级功能
