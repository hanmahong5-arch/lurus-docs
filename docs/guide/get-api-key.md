---
title: 获取 API Key
description: 注册 Lurus 账号并获取 API Key 的完整步骤。
---

# 获取 API Key

::: tip OIDC / OAuth 接入
让终端用户以 Lurus 账号登录自有应用，或后端以 Service User + JWT Profile 调用，可改用统一身份认证：[OIDC / OAuth2 集成](/platform/auth/oidc) · [API 认证（PAT/JWT）](/platform/auth/api-auth)。API Key 与 OIDC Token 共存，两种均有效。
:::

## 注册与创建 Key

1. 访问 [Lurus 控制台](https://api.lurus.cn) →「注册」→ 填邮箱密码 → 完成邮箱验证。
2. 登录 → 左侧「令牌管理」→「创建新令牌」→ 填令牌名称（便于识别）→ 确认。

::: tip
创建后请立即复制保存 API Key，**只显示一次**！
:::

## API Key 格式

以 `sk-` 开头，48 位随机字符：`sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`。

## 管理 API Key

- **查看用量**：「令牌管理」页面显示每个 Key 的已用额度、剩余额度、最近调用时间。
- **禁用 / 删除**：禁用 = 暂停使用权限（可恢复）；删除 = 永久删除（不可恢复）。
- **设置模型权限**：点 Key 旁「编辑」→「可用模型」选允许的模型 → 保存。

## 安全建议

不泄露（不提交公开仓库）；每 90 天轮换一次 Key；最小权限（只授予必需模型）；定期检查调用日志发现异常及时处理。

## 常见问题

- **忘记 Key**：无法找回，创建新 Key。
- **Key 被盗用**：立即禁用或删除该 Key 并创建新 Key。
- **额度用完**：自助充值或升级套餐——先在 [计费详解](/platform/billing) 看档位（Free / Basic / Pro），再到 [控制台](https://api.lurus.cn) 充值或升级。
