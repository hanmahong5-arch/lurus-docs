---
url: /guide/clients/lobe-chat.md
---
# Lobe Chat 配置

[Lobe Chat](https://lobehub.com) 是一款现代化的开源 AI 聊天应用。

## 在线配置

点击以下链接直接配置：

```
https://chat-preview.lobehub.com/?settings={"keyVaults":{"openai":{"apiKey":"YOUR_API_KEY","baseURL":"https://api.lurus.cn/v1"}}}
```

将 `YOUR_API_KEY` 替换为你的 API Key。

## 手动配置

1. 打开 Lobe Chat 设置
2. 选择「语言模型」
3. 在 OpenAI 配置中：
   * API Key: 输入你的 Lurus API Key
   * API Proxy: `https://api.lurus.cn/v1`
4. 保存设置

## 使用建议

* Lobe Chat 默认使用 OpenAI 模型名，需要在对话中手动切换
* 推荐使用 `deepseek-chat` 获得最佳性价比
