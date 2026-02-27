# 其他客户端

任何支持 OpenAI API 的客户端都可以使用 Lurus API。

## 通用配置

| 配置项 | 值 |
|--------|-----|
| API Base URL | `https://api.lurus.cn/v1` |
| API Key | `sk-your-api-key` |

## 支持的客户端

### 桌面应用
- **Cherry Studio** - 跨平台，功能丰富
- **ChatBox** - 简洁易用
- **BetterChatGPT** - 开源免费

### 移动应用
- **OpenCat** (iOS/macOS)
- **ChatGPT Next Web** (PWA)

### Web 应用
- **Lobe Chat**
- **ChatGPT Web**
- **Open WebUI**

### IDE 插件
- **Continue** (VS Code)
- **Codeium**
- **Cursor**

### 命令行工具
- **llm-cli**
- **aichat**

## 配置示例

### Cursor

1. 设置 → OpenAI API
2. API Key: 输入 Lurus Key
3. Base URL: `https://api.lurus.cn/v1`

### Continue (VS Code)

编辑 `~/.continue/config.json`:

```json
{
  "models": [
    {
      "title": "Lurus DeepSeek",
      "provider": "openai",
      "model": "deepseek-chat",
      "apiBase": "https://api.lurus.cn/v1",
      "apiKey": "sk-your-api-key"
    }
  ]
}
```

## 不支持的功能

部分客户端特有功能可能不完全兼容：
- 实时语音对话
- 图像编辑
- 特定厂商的专有 API

如有问题，请联系技术支持。
