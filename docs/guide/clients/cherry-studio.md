---
title: Cherry Studio 配置
description: 在 Cherry Studio 中配置 Lurus API，一键接入 50+ AI 模型。
---

# Cherry Studio 配置

[Cherry Studio](https://cherry-ai.com) 是一款优秀的跨平台 AI 客户端，支持多种模型供应商。

## 配置步骤

1. 打开 Cherry Studio 设置
2. 选择「API 提供商」
3. 点击「添加自定义供应商」
4. 填写以下信息：

| 字段 | 值 |
|------|-----|
| 名称 | Lurus API |
| API Base URL | `https://api.lurus.cn/v1` |
| API Key | 你的 API Key (sk-xxx) |

5. 保存配置

## 快速配置链接

点击以下链接可快速导入配置：

```
cherrystudio://providers/api-keys?v=1&data={cherryConfig}
```

将 `{cherryConfig}` 替换为你的配置信息。

## 选择模型

配置完成后，在 Cherry Studio 中选择 Lurus API 作为供应商，即可使用所有支持的模型。

## 常见问题

### 连接失败？

- 检查 API Key 是否正确
- 确认网络连接正常
- 检查 Base URL 是否正确

### 模型列表为空？

尝试在设置中手动刷新模型列表，或手动输入模型名称如 `deepseek-chat`。
