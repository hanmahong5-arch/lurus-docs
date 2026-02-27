---
url: /webmail/client-setup.md
---
# 邮件客户端配置

## 服务器参数

配置任何邮件客户端时，统一使用以下参数：

| 类型 | 服务器地址 | 端口 | 加密方式 |
|------|-----------|------|---------|
| **收件（IMAP）** | mail.lurus.cn | 993 | SSL/TLS |
| **发件（SMTP）** | mail.lurus.cn | 587 | STARTTLS |
| **发件（SMTP）备用** | mail.lurus.cn | 465 | SSL/TLS |

* **用户名**：完整邮箱地址，如 `zhangsan@lurus.cn`
* **密码**：你的 Webmail 登录密码

***

## Microsoft Outlook

### Outlook for Windows / Mac（新版）

1. 打开 Outlook，点击「**文件**」→「**添加账户**」
2. 输入邮箱地址 `your@lurus.cn`，点击「**连接**」
3. 选择「**IMAP**」
4. 填写收件服务器信息：
   * 服务器：`mail.lurus.cn`
   * 端口：`993`
   * 加密：`SSL/TLS`
5. 填写发件服务器信息：
   * 服务器：`mail.lurus.cn`
   * 端口：`587`
   * 加密：`STARTTLS`
6. 输入密码，点击「**连接**」

::: tip
如果自动发现失败，在第 2 步点击「高级选项」→「手动配置账户」。
:::

***

## Apple Mail（macOS / iOS）

### macOS

1. 打开「**邮件**」App
2. 菜单栏「**邮件**」→「**添加账户**」
3. 选择「**其他邮件账户**」，点击「继续」
4. 填写：
   * 姓名：你的姓名
   * 邮件地址：`your@lurus.cn`
   * 密码：登录密码
5. 点击「登录」，如自动发现失败则进入手动配置：
   * 账户类型：**IMAP**
   * 邮件服务器：`mail.lurus.cn`
   * 用户名：完整邮箱地址

完成后系统会自动配置 SMTP 发件服务器。

### iOS（iPhone / iPad）

1. 「**设置**」→「**邮件**」→「**账户**」→「**添加账户**」
2. 选择「**其他**」→「**添加邮件账户**」
3. 填写名称、邮件地址、密码、描述（随意填）
4. 切换到「**IMAP**」选项卡：
   * 收件主机名：`mail.lurus.cn`
   * 用户名：完整邮箱地址
   * 密码：登录密码
5. 发件（SMTP）：
   * 主机名：`mail.lurus.cn`
   * 用户名：完整邮箱地址
   * 密码：登录密码
6. 点击「**存储**」

***

## Mozilla Thunderbird

1. 打开 Thunderbird，点击「**账户设置**」→「**添加邮件账户**」
2. 填写姓名、邮件地址、密码
3. 点击「**手动配置**」
4. 填写：

**收件服务器（IMAP）**：

| 字段 | 值 |
|------|-----|
| 服务器名 | `mail.lurus.cn` |
| 端口 | `993` |
| SSL | `SSL/TLS` |
| 认证 | `正常密码` |

**发件服务器（SMTP）**：

| 字段 | 值 |
|------|-----|
| 服务器名 | `mail.lurus.cn` |
| 端口 | `587` |
| SSL | `STARTTLS` |
| 认证 | `正常密码` |

5. 点击「**重新测试**」确认连接，然后「**完成**」

***

## Android Gmail App

Gmail App 支持添加 IMAP 账户：

1. 打开 Gmail，点击左上角菜单 → 滑到最底「**添加账户**」
2. 选择「**其他**」
3. 输入邮箱地址，点击「**下一步**」
4. 选择「**个人 (IMAP)**」
5. 输入密码
6. 收件服务器设置：
   * 服务器：`mail.lurus.cn`
   * 端口：`993`
   * 安全类型：`SSL/TLS`
7. 发件服务器设置：
   * SMTP 服务器：`mail.lurus.cn`
   * 端口：`587`
   * 安全类型：`STARTTLS`
   * 需要登录：勾选
8. 点击「**下一步**」完成配置

***

## 日历同步（CalDAV）

在支持 CalDAV 的客户端（Apple Calendar、GNOME Calendar、Thunderbird）中添加：

| 参数 | 值 |
|------|-----|
| 服务器 URL | `https://mail.lurus.cn/dav/` |
| 用户名 | 完整邮箱地址 |
| 密码 | 登录密码 |

**Apple Calendar（macOS）步骤**：

1. 菜单「**文件**」→「**添加账户**」→「**其他 CalDAV 账户**」
2. 填写服务器 URL、用户名、密码
3. 点击「登录」

***

## 联系人同步（CardDAV）

| 参数 | 值 |
|------|-----|
| 服务器 URL | `https://mail.lurus.cn/dav/` |
| 用户名 | 完整邮箱地址 |
| 密码 | 登录密码 |

**Apple Contacts（macOS）步骤**：

1. 通讯录 App → 菜单「**通讯录**」→「**添加账户**」→「**其他 CardDAV 账户**」
2. 填写服务器地址、用户名、密码

***

## 配置验证

配置完成后，可通过以下方式验证：

```bash
# 测试 IMAP 连接
openssl s_client -connect mail.lurus.cn:993 -quiet
# 看到 "220 ... ESMTP" 即连接成功

# 测试 SMTP 连接
openssl s_client -connect mail.lurus.cn:465 -quiet
```

或直接在客户端「**测试账户设置**」，看到收件和发件均为绿色勾即配置成功。
