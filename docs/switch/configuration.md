---
title: Switch 配置说明
description: Switch 的 AI 工具配置、MCP 服务器管理和成本监控设置。
---

# Switch 配置说明

## 打开配置界面

- **菜单栏图标**（macOS / Linux）→「配置」· **系统托盘**（Windows）右键 →「打开配置」· **快捷键** `Ctrl+Shift+S`（Win/Linux）/ `Cmd+Shift+S`（macOS）。

---

## 添加模型提供商

「**<Term t="Provider">提供商</Term>**」选项卡 →「**添加提供商**」，填提供商名称 + API Base URL + API Key：

| 提供商 | API Base URL | API Key |
|------|------|------|
| **Lurus API**（推荐） | `https://api.lurus.cn/v1` | Lurus Key（`sk-` 开头）；模型点「自动检测」 |
| **OpenAI** | `https://api.openai.com/v1` | `sk-...`（官方） |
| **Anthropic** | `https://api.anthropic.com/v1` | `sk-ant-...` |
| **Ollama**（本地） | `http://localhost:11434/v1` | （留空） |

---

## 配置路由规则

「**路由**」选项卡定义哪个请求走哪个提供商，未匹配的请求走默认提供商（`默认 → Lurus API`）。

**按模型名称路由**：`gpt-*` → OpenAI；`claude-*` → Anthropic；`deepseek-*` / `*`（其他）→ Lurus API；`llama*` → Ollama。JSON：

```json
{ "rules": [
    { "pattern": "gpt-*", "provider": "OpenAI" },
    { "pattern": "claude-*", "provider": "Anthropic" },
    { "pattern": "llama*", "provider": "Ollama" },
    { "pattern": "*", "provider": "Lurus API" }
  ] }
```

**按应用路由（高级）**：为不同本地应用设置不同路由：

```json
{
  "app_rules": [
    {
      "app": "cursor",
      "default_provider": "Lurus API",
      "model_override": "deepseek-reasoner"
    },
    {
      "app": "continue",
      "default_provider": "Ollama"
    }
  ]
}
```

---

## 代理端口配置

「**通用**」→「**监听端口**」，默认 `11434`。端口冲突（如与 Ollama）时改为其他端口（如 `11435`），应用侧相应修改 `base_url=http://localhost:11435/v1`（`api_key` 随意填，Switch 用配置的 provider key）。

---

## 完整配置文件

Switch 配置保存在：

| 平台 | 路径 |
|------|------|
| Windows | `%APPDATA%\LurusSwitch\config.json` |
| macOS | `~/Library/Application Support/LurusSwitch/config.json` |
| Linux | `~/.config/LurusSwitch/config.json` |

完整 `config.json` 示例：

```json
{
  "listen_port": 11434,
  "log_requests": true,
  "start_on_login": true,
  "providers": [
    {
      "name": "Lurus API",
      "base_url": "https://api.lurus.cn/v1",
      "api_key": "sk-your-lurus-key",
      "enabled": true
    },
    {
      "name": "Ollama",
      "base_url": "http://localhost:11434/v1",
      "api_key": "",
      "enabled": true
    }
  ],
  "routing": {
    "default_provider": "Lurus API",
    "rules": [
      { "pattern": "llama*",  "provider": "Ollama" },
      { "pattern": "qwen*",   "provider": "Ollama" },
      { "pattern": "*",       "provider": "Lurus API" }
    ]
  }
}
```

---

## 验证配置

「**状态**」选项卡显示：各提供商连接状态（绿=正常，红=失败）、当前激活路由规则、最近请求日志。命令行验证（返回正常 JSON 即成功）：

```bash
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"ping"}]}'
```
