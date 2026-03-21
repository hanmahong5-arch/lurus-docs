---
title: Switch 配置说明
description: Switch 的 AI 工具配置、MCP 服务器管理和成本监控设置。
---

# Switch 配置说明

## 打开配置界面

启动 Switch 后，从以下方式打开配置：

- **菜单栏图标**（macOS / Linux）→ 点击图标 → 「配置」
- **系统托盘**（Windows）→ 右键图标 → 「打开配置」
- **快捷键**：`Ctrl+Shift+S`（Windows/Linux）/ `Cmd+Shift+S`（macOS）

---

## 添加模型提供商

进入「**<Term t="Provider">提供商</Term>**」选项卡，点击「**添加提供商**」。

### Lurus API（推荐）

| 字段 | 值 |
|------|-----|
| 提供商名称 | `Lurus API` |
| API Base URL | `https://api.lurus.cn/v1` |
| API Key | 你的 Lurus API Key（以 `sk-` 开头） |
| 支持的模型 | *(点击「自动检测」获取列表)* |

### OpenAI

| 字段 | 值 |
|------|-----|
| 提供商名称 | `OpenAI` |
| API Base URL | `https://api.openai.com/v1` |
| API Key | `sk-...`（OpenAI 官方 Key）|

### Anthropic Claude

| 字段 | 值 |
|------|-----|
| 提供商名称 | `Anthropic` |
| API Base URL | `https://api.anthropic.com/v1` |
| API Key | `sk-ant-...` |

### 本地 Ollama

| 字段 | 值 |
|------|-----|
| 提供商名称 | `Ollama` |
| API Base URL | `http://localhost:11434/v1` |
| API Key | *(留空)* |

---

## 配置路由规则

「**路由**」选项卡定义了哪个请求走哪个提供商。

### 默认路由

所有未匹配的请求走默认提供商：

```
默认 → Lurus API
```

### 按模型名称路由

| 模型名称模式 | 目标提供商 |
|-------------|-----------|
| `gpt-*` | OpenAI |
| `claude-*` | Anthropic |
| `deepseek-*` | Lurus API |
| `llama*` | Ollama |
| `*`（其他） | Lurus API |

**示例配置（JSON 格式）**：

```json
{
  "rules": [
    { "pattern": "gpt-*",       "provider": "OpenAI" },
    { "pattern": "claude-*",    "provider": "Anthropic" },
    { "pattern": "llama*",      "provider": "Ollama" },
    { "pattern": "*",           "provider": "Lurus API" }
  ]
}
```

### 按应用路由（高级）

可以为不同本地应用设置不同的路由：

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

「**通用**」→「**监听端口**」，默认 `11434`。

如果端口冲突（如与 Ollama 冲突），改为其他端口，如 `11435`：

```python
# 应用侧相应修改 base_url
from openai import OpenAI
client = OpenAI(
    base_url="http://localhost:11435/v1",
    api_key="any-value"  # Switch 使用配置的 provider key，此处随意填写
)
```

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

保存配置后，在「**状态**」选项卡可以看到：

- 所有提供商的连接状态（绿色=正常，红色=失败）
- 当前激活的路由规则
- 最近请求日志

也可以命令行快速验证：

```bash
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"ping"}]}'
```

返回正常 JSON 响应即配置成功。
