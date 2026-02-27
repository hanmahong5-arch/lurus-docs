# OpenCat 配置

[OpenCat](https://opencat.app) 是 iOS / macOS 原生 AI 聊天应用，界面简洁，支持自定义 API。

## 快速配置（URL Scheme）

在浏览器或备忘录中点击以下链接，可一键跳转到 OpenCat 并自动填入配置：

```
opencat://team/join?domain=https://api.lurus.cn&token=YOUR_API_KEY
```

将 `YOUR_API_KEY` 替换为你的 Key（`sk-xxxxxxxxxxxxxxxx`），在 Safari 中打开即可。

::: tip iOS 捷径（推荐）
在 iOS 捷径 App 中新建一个「打开 URL」动作，粘贴上方地址并填入你的 Key，保存到主屏幕，下次换设备也能一键完成配置。
:::

---

## 手动配置

若 URL Scheme 无效（旧版 OpenCat 不支持），手动配置：

1. 打开 OpenCat → **设置**（右上角头像）→ **API 设置**
2. 选择「**自定义 API**」，填入：
   - **API Host**：`https://api.lurus.cn`
   - **API Key**：你的 Key（`sk-xxxxxxxxxxxxxxxx`）
3. 点击「**验证连接**」，提示成功后保存

---

## 选择模型

OpenCat 不会自动拉取模型列表，需手动输入模型名称。常用模型：

| 模型名称 | 特点 |
|---------|------|
| `deepseek-chat` | 高性价比，中文最佳 |
| `deepseek-reasoner` | 数学、代码推理 |
| `gpt-4o` | 综合能力最强 |
| `claude-3-5-sonnet` | 长文本、创意写作 |
| `gemini-3-pro-preview` | 多模态，1M 上下文 |

完整列表见 [支持的模型](/guide/models)。

---

## 常见问题

### 连接测试失败，提示"无效密钥"

- 确认 API Host 末尾**不带斜杠**（`https://api.lurus.cn`，不是 `https://api.lurus.cn/`）
- 确认 API Key 格式正确（以 `sk-` 开头）
- 在 [Lurus 控制台](https://api.lurus.cn) 确认 Key 状态为「启用」

### 模型名称输入后无响应

- 检查模型名称拼写（区分大小写，如 `gpt-4o` 不是 `GPT-4o`）
- 确认你的 Key 有该模型的访问权限

### macOS 版配置在哪里？

macOS 版入口：菜单栏 **OpenCat** → **Preferences**（`⌘,`）→ **API** 选项卡，与 iOS 版配置参数相同。
