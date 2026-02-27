# Webmail — 企业邮件平台

## 什么是 Lurus Webmail？

**Lurus Webmail** 是基于 Stalwart Mail Server 的自建企业邮件系统，前端使用 Next.js，后端使用 Nitro 处理 IMAP/SMTP 同步。

- **Web 访问**：[mail.lurus.cn](https://mail.lurus.cn)
- **邮件域**：`@lurus.cn`
- **特点**：针对中国网络环境优化送达率，QQ / 网易 / 阿里邮箱送达率 ≥ 99%

## 核心功能

### 📧 完整邮件协议支持

| 协议 | 端口 | 加密 | 用途 |
|------|------|------|------|
| IMAP | 993 | SSL/TLS | 收取邮件 |
| SMTP | 465 | SSL/TLS | 发送邮件 |
| SMTP | 587 | STARTTLS | 提交邮件（推荐） |
| ManageSieve | 4190 | STARTTLS | 邮件过滤规则 |

### 📅 日历与联系人（CalDAV / CardDAV）

- 日历同步（CalDAV）：集成 Apple Calendar、Thunderbird、GNOME Calendar
- 联系人同步（CardDAV）：集成 Apple Contacts、各平台通讯录

### 🛡️ 邮件安全

- **SPF / DKIM / DMARC** 全配置，防止邮件伪造
- **TLS 端到端加密**传输
- **反垃圾邮件**：Rspamd 引擎过滤

### 🌏 中国送达率优化

- 国内主流域名（QQ、网易、阿里）通过 **SendCloud** 中继发送
- 国际邮件通过 Stalwart 直接发送

## 用户类型

| 用户类型 | 说明 |
|----------|------|
| 企业员工 | 使用 `username@lurus.cn` 地址收发邮件 |
| 管理员 | 管理账号、域名、别名、配额 |

## 下一步

- [快速开始](/webmail/quickstart) — 首次登录和发送第一封邮件
- [客户端配置](/webmail/client-setup) — 配置 Outlook、Apple Mail、Thunderbird
- [常见问题](/webmail/faq) — 送达问题、密码重置等
