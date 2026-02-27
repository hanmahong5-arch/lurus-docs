---
url: /switch/usage.md
---
# Switch 使用手册

## 快速接入

Switch 启动后，本地暴露一个兼容 OpenAI API 的端点：

```
http://localhost:11434/v1
```

只需将你的应用/SDK 的 `base_url` 改为这个地址，所有请求自动由 Switch 路由。

### Python（openai SDK）

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="switch"   # 任意值，Switch 使用配置中的 provider key
)

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "你好"}]
)
print(response.choices[0].message.content)
```

### Node.js（openai SDK）

```javascript
import OpenAI from 'openai'

const client = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'switch'
})

const response = await client.chat.completions.create({
  model: 'deepseek-chat',
  messages: [{ role: 'user', content: '你好' }]
})
console.log(response.choices[0].message.content)
```

### curl

```bash
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer switch" \
  -d '{"model":"gpt-4o","messages":[{"role":"user","content":"Hello"}]}'
```

***

## 在 AI 编程工具中使用

### Cursor

1. 打开 Cursor → 设置（`Ctrl+,`）→ 搜索「AI」
2. 找到「OpenAI API Base」，改为 `http://localhost:11434/v1`
3. API Key 填写任意值（如 `switch`）
4. 保存，Cursor 的代码补全和对话功能自动走 Switch

### Continue（VS Code 插件）

编辑 `~/.continue/config.json`：

```json
{
  "models": [
    {
      "title": "DeepSeek via Switch",
      "provider": "openai",
      "model": "deepseek-chat",
      "apiBase": "http://localhost:11434/v1",
      "apiKey": "switch"
    },
    {
      "title": "GPT-4o via Switch",
      "provider": "openai",
      "model": "gpt-4o",
      "apiBase": "http://localhost:11434/v1",
      "apiKey": "switch"
    }
  ]
}
```

### Cherry Studio

1. 设置 → API 配置
2. 选择「自定义 OpenAI 兼容」
3. API Base URL：`http://localhost:11434/v1`
4. API Key：`switch`
5. 点击「测试连接」

### Lobe Chat

1. 设置 → 语言模型 → OpenAI
2. API Key：`switch`
3. 接口地址：`http://localhost:11434/v1`

***

## 请求监控

Switch 内置实时请求日志，在「**日志**」选项卡查看：

| 字段 | 说明 |
|------|------|
| 时间 | 请求时间戳 |
| 模型 | 请求的模型名称 |
| 提供商 | 实际路由到哪个提供商 |
| 耗时 | 请求总耗时（ms） |
| Token | prompt\_tokens / completion\_tokens |
| 状态 | 200 成功 / 4xx 5xx 失败 |

### 导出日志

日志 → 「导出 CSV」，可导出近 7 天的请求记录用于成本统计。

***

## 一键切换提供商

在菜单栏图标（macOS）或系统托盘（Windows）点击，可以直接：

* 切换「当前活跃提供商」
* 临时禁用某个提供商（调试用）
* 查看今日用量概览

***

## 流式响应

Switch 完全支持 SSE 流式响应，透传到下游客户端：

```python
stream = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "写一首诗"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
```

***

## 高级：负载均衡

如果同一个模型配置了多个提供商，Switch 可以轮询或按权重分配：

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

***

## 故障排查

### 请求返回 "connection refused"

Switch 未启动或端口不对：

```bash
# 检查进程是否运行
# Windows
tasklist | findstr LurusSwitch

# macOS / Linux
ps aux | grep lurus-switch

# 检查端口
curl http://localhost:11434/v1/models
```

### 请求返回 401 / 403

提供商 API Key 配置错误，在 Switch 配置界面重新填写并点击「测试」。

### 延迟异常高

1. 检查路由是否命中正确提供商（日志中查看）
2. 如果走了海外提供商（OpenAI / Anthropic），高延迟属正常（300-1500ms）
3. 改用 Lurus API 国内节点延迟更低（通常 < 200ms）

### macOS：应用无响应

尝试完全退出（菜单栏右键 → 「退出」）后重新启动，或在终端：

```bash
pkill -f LurusSwitch
open -a "Lurus Switch"
```
