# Lurus Switch — AI 编程工具统一管理中心 <StatusBadge status="dev" />

## 什么是 Lurus Switch？

**Lurus Switch** 是一个桌面应用（单 exe，< 15MB），让你用一个界面管理所有 AI 编程工具的配置、MCP 服务器和成本。基于 **Wails**（Go 1.25 + React 18）构建，启动 < 2 秒，支持 Windows / macOS / Linux 全平台。

当前开发者同时使用 Claude Code、Codex、Gemini CLI 等多个 AI 工具，配置散落各处、成本各自为政。Switch 将这一切集中管理。

## 核心能力

| 功能 | 说明 |
|------|------|
| **多工具配置管理** | 可视化编辑 Claude Code (JSON)、Codex (TOML)、Gemini CLI (MD) 等配置，Monaco Editor 实时预览 |
| **CLAUDE.md 智能助手** | 扫描项目自动生成 CLAUDE.md，质量评分，优化建议 |
| **MCP 服务器可视化** | 告别手写 JSON，可视化配置 MCP 服务器，跨工具同步 |
| **成本监控仪表盘** | 实时 Token 消耗趋势，按工具/模型分类，预算预警 |
| **API Key 统一管理** | 跨工具统一存储和使用，安全加密 |
| **代理与网络** | 系统代理自动检测，Clash/V2Ray 一键配置，API Endpoint 自定义 |
| **配置快照** | 保存/恢复/对比 diff，试错零成本 |
| **Prompt 模板库** | 内置高质量模板 + 自定义管理 + 导入导出 |
| **进程管理** | CLI 进程监控（列表/终止/启动/输出查看） |
| **自动更新** | GitHub Releases 自更新 + 工具版本检查 |

## 适用场景

| 场景 | 说明 |
|------|------|
| **多工具管理** | 同时使用 2-3 个 AI CLI 工具，需要统一配置管理 |
| **成本控制** | 多工具并行使用，需要统一的费用视图和预算管控 |
| **团队标准化** | 统一配置分发，确保团队成员使用一致的 AI 工具设置 |
| **中国开发者** | 需要翻墙配置、中文界面、国内/海外模型一键切换 |

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

- [安装指南](/switch/install) — 下载并完成首次安装
- [配置说明](/switch/configuration) — 添加模型、设置路由规则
- [使用手册](/switch/usage) — 日常使用和高级功能
