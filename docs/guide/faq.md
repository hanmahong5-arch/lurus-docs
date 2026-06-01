---
title: Lurus API 常见问题
description: Lurus API 使用中的常见问题与解答，包括计费、兼容性和故障排查。
---

# 常见问题

## 账号与认证

- **如何注册**：[api.lurus.cn](https://api.lurus.cn) 填邮箱密码（或 GitHub/Google 登录），自动得 5 鹿贝 + 免费配额，所有产品共享同一账号。
- **API Key 丢失**：只显示一次无法找回，控制台删旧建新。存密码管理器/环境变量勿写代码；每账号可建多个 Key，按项目分配独立 Key 更安全。
- **Key 无效排查**：Key 完整（`sk-` 开头无漏字符）；状态「启用」（控制台 → 令牌管理）；请求头 `Authorization: Bearer sk-xxxx`（Bearer 后一空格）；无多余空格/换行（重新复制）；环境变量名拼写正确且已加载。

## 模型与调用

- **支持哪些模型**：OpenAI、Claude、Gemini、DeepSeek 等，见 [模型列表](/guide/models)。
- **"no available server"**：检查模型名；确认 Key 有该模型权限；该模型可能暂无可用渠道，联系管理员。
- **如何切换模型**：只改 `model` 参数，其他不变。
- **流式响应**：设 `"stream": true`，响应经 SSE 逐块返回。

## 计费与配额

- **查用量**：控制台「数据看板」或「使用日志」。
- **配额用完**：联系管理员充值或升级套餐。
- **模型价格**：见 [模型列表](/guide/models) 定价。

## 技术问题

- **请求超时**：① 检查网络（`curl https://api.lurus.cn/v1/models`）② 减小 `max_tokens` ③ 推理模型（`deepseek-reasoner`）思考时间长属正常 ④ SDK 默认超时约 60 秒，可调大 `timeout` ⑤ 持续超时可能上游故障，换模型。
- **429 错误**（<Term t="Rate Limit">Rate Limit</Term> 超限）：降低频率 + 指数退避重试（见 [错误处理](/api/errors)）；Free 默认 60 RPM，升级 Pro/Team 提高限额；付费仍频繁触发联系 support@lurus.cn。
- **上下文超限**（如 `deepseek-chat` 64K、`gemini-3-pro-preview` 1M）：减少输入删历史；滑动窗口（保留 system + 最近 N 轮）；切更长上下文模型；超长文档先摘要再传入。

## 其他问题

- **数据安全吗**：全程 HTTPS；不存对话内容；仅记调用元数据用于计费。
- **SLA 保证**：企业客户可签 SLA，联系商务。
- **技术支持**：support@lurus.cn / GitHub Issues。

---

没有找到答案？请 [联系我们](mailto:support@lurus.cn)。
