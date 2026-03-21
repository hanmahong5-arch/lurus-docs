---
title: Lurus API 常见问题
description: Lurus API 使用中的常见问题与解答，包括计费、兼容性和故障排查。
---

# 常见问题

## 账号与认证

### Q: 如何注册账号？
访问 [api.lurus.cn](https://api.lurus.cn)，点击注册，填写邮箱和密码即可。支持 GitHub / Google 第三方登录。注册后自动获得 5 鹿贝和免费配额，可以立即开始调用 API。所有 Lurus 产品（API、Lucrum、Switch 等）共享同一个账号。

### Q: API Key 丢失了怎么办？
API Key 创建后只显示一次，无法找回。请登录控制台删除旧 Key 并创建新的。建议将 Key 保存在密码管理器或环境变量中，不要写在代码里。每个账号可以创建多个 Key，给不同项目使用独立 Key 是更安全的做法。

### Q: 为什么提示 API Key 无效？
常见原因和排查步骤：
- 检查 Key 是否完整复制（以 `sk-` 开头，不要漏掉字符）
- 确认 Key 状态为「启用」（控制台 → 令牌管理 → 查看状态）
- 检查请求头格式：`Authorization: Bearer sk-xxxx`（Bearer 后有一个空格）
- 检查是否有多余空格或换行符（从控制台重新复制）
- 如果使用环境变量，确认变量名拼写正确且已加载

## 模型与调用

### Q: 支持哪些模型？
支持 OpenAI、Claude、Gemini、DeepSeek 等主流模型，详见 [模型列表](/guide/models)。

### Q: 提示 "no available server"？
- 检查模型名称是否正确
- 确认你的 Key 有权限访问该模型
- 该模型可能暂时没有可用渠道，请联系管理员

### Q: 如何切换模型？
只需更改请求中的 `model` 参数，其他代码无需修改。

### Q: 流式响应如何使用？
在请求中设置 `"stream": true`，响应将通过 SSE 逐块返回。

## 计费与配额

### Q: 如何查看用量？
登录控制台，在「数据看板」或「使用日志」中查看。

### Q: 配额用完了怎么办？
联系管理员充值或升级套餐。

### Q: 不同模型的价格？
详见 [模型列表](/guide/models) 中的定价信息。

## 技术问题

### Q: 请求超时怎么办？
排查步骤：
1. 检查网络连接是否稳定（`curl https://api.lurus.cn/v1/models` 验证）
2. 尝试减少 `max_tokens`（大 token 数 = 更长生成时间）
3. 某些推理模型（如 `deepseek-reasoner`）思考时间较长，属于正常现象
4. SDK 默认超时通常为 60 秒，可以通过 `timeout` 参数调大
5. 如果持续超时，可能是上游服务商故障，换个模型试试

### Q: 返回 429 错误？
表示请求频率超限（<Term t="Rate Limit">Rate Limit</Term>）。解决方案：
- 降低调用频率，在代码中加入指数退避重试（示例见 [错误处理](/api/errors)）
- Free 计划默认 60 RPM，升级到 Pro/Team 可获得更高限额
- 如果已是付费用户仍频繁触发，联系 support@lurus.cn 申请提高限制

### Q: 上下文长度超限？
不同模型支持的最大上下文长度不同（如 `deepseek-chat` 64K，`gemini-3-pro-preview` 1M）。解决方案：
- 减少输入内容，删除不必要的历史消息
- 使用滑动窗口：只保留 system prompt + 最近 N 轮对话
- 切换到支持更长上下文的模型（见 [模型列表](/guide/models)）
- 对超长文档，先做摘要再传入

## 其他问题

### Q: 数据安全吗？
- 全程 HTTPS 加密传输
- 不会存储你的对话内容
- 仅记录调用元数据用于计费

### Q: 有 SLA 保证吗？
企业客户可签订 SLA 协议，请联系商务。

### Q: 如何获取技术支持？
- 邮箱: support@lurus.cn
- GitHub Issues

---

没有找到答案？请 [联系我们](mailto:support@lurus.cn)。
