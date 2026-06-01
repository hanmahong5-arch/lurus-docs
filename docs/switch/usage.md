---
title: Switch 使用手册
description: Switch 桌面应用的日常使用指南，包括快速接入和高级功能。
---

# Switch 使用手册

## 快速接入

Switch 启动后本地暴露兼容 OpenAI API 的端点 `http://localhost:19090/v1`（Switch gateway 默认端口 19090）。把应用/SDK 的 `base_url` 改为此地址，所有请求自动由 Switch 路由。`api_key` 填任意值（如 `switch`），Switch 用配置中的 provider key。

```bash
curl http://localhost:19090/v1/chat/completions \
  -H "Content-Type: application/json" -H "Authorization: Bearer switch" \
  -d '{"model":"gpt-4o","messages":[{"role":"user","content":"Hello"}]}'
```

OpenAI SDK（Python / Node.js）同理：`base_url`/`baseURL = http://localhost:19090/v1`，`api_key = "switch"`，照常 `chat.completions.create(...)`。

---

## 在 AI 编程工具中使用

所有工具的 API Base / 接口地址均填 `http://localhost:19090/v1`，API Key 填 `switch`：

- **Cursor**：设置（`Ctrl+,`）→ 搜「AI」→「OpenAI API Base」改为该地址 → 保存，补全和对话自动走 Switch。
- **Continue（VS Code）**：编辑 `~/.continue/config.json`，每个 model 项设 `"provider": "openai"`, `"apiBase": "http://localhost:19090/v1"`, `"apiKey": "switch"`, `"model"` 填 `deepseek-chat`/`gpt-4o` 等。
- **Cherry Studio**：设置 → API 配置 → 选「自定义 OpenAI 兼容」→ 填地址和 Key →「测试连接」。
- **Lobe Chat**：设置 → 语言模型 → OpenAI → 填 API Key 和接口地址。

---

## 请求监控

「**日志**」选项卡查看实时请求日志，字段：时间（时间戳）、模型、提供商（实际路由目标）、耗时（ms）、Token（prompt/completion）、状态（200 / 4xx-5xx）。「导出 CSV」可导出近 7 天记录用于成本统计。

---

## 一键切换提供商

菜单栏图标（macOS）/ 系统托盘（Windows）点击可：切换「当前活跃提供商」、临时禁用某提供商（调试）、查看今日用量概览。

---

## 流式响应

完全支持 SSE 流式响应并透传下游：`chat.completions.create(..., stream=True)` 后迭代 `chunk.choices[0].delta.content`。

---

## 高级：负载均衡

同一模型配置多个提供商时可轮询或按权重分配：

```json
{
  "routing": {
    "rules": [
      {
        "pattern": "deepseek-chat",
        "providers": [
          { "name": "Lurus API", "weight": 70 },
          { "name": "DeepSeek Official", "weight": 30 }
        ],
        "strategy": "weighted_random"
      }
    ]
  }
}
```

---

## 故障排查

- **"connection refused"**：Switch 未启动或端口不对。检查进程（Windows `tasklist | findstr LurusSwitch` / macOS·Linux `ps aux | grep lurus-switch`）和端口（`curl http://localhost:19090/v1/models`）。
- **401 / 403**：提供商 API Key 配置错误，配置界面重新填写并「测试」。
- **延迟异常高**：① 日志查路由是否命中正确提供商 ② 海外提供商（OpenAI/Anthropic）高延迟正常（300-1500ms）③ 改用 Lurus API 国内节点（通常 < 200ms）。
- **macOS 应用无响应**：菜单栏右键「退出」后重启，或终端 `pkill -f LurusSwitch && open -a "Lurus Switch"`。
