---
layout: home

hero:
  name: "Lurus Docs"
  text: "一站式产品文档"
  tagline: Lurus API · GuShen · Webmail · Switch — 所有产品的完整文档
  image:
    src: /hero-image.svg
    alt: Lurus Platform
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quickstart
    - theme: alt
      text: 获取 API Key
      link: /guide/get-api-key
    - theme: alt
      text: 控制台 ↗
      link: https://api.lurus.cn

features:
  - icon: 🔌
    title: Lurus API — LLM 统一网关
    details: 一个 API Key 接入 50+ 主流 AI 模型（GPT、Claude、Gemini、DeepSeek），完全兼容 OpenAI SDK，3 行代码迁移。
    link: /guide/introduction
    linkText: 查看 API 文档
  - icon: 📈
    title: GuShen — AI 量化交易
    details: 自然语言描述策略需求，AI 自动生成可回测的量化代码。支持 A 股、期货、加密货币多市场。
    link: /gushen/
    linkText: 查看 GuShen 文档
  - icon: 📧
    title: Webmail — 企业邮件
    details: 自建企业邮件系统，针对中国网络环境优化送达率（99%），支持 IMAP/SMTP/CalDAV/CardDAV 全协议。
    link: /webmail/
    linkText: 查看 Webmail 文档
  - icon: 🖥️
    title: Lurus Switch — 智能客户端
    details: 桌面端 AI 模型网关，Windows/macOS/Linux 全平台，本地代理路由，一键切换模型服务，离线可用。
    link: /switch/
    linkText: 查看 Switch 文档

---

## 产品快速入口

<div class="action-grid">
  <ActionCard
    name="Lurus API"
    tagline="一个 Key 接入 50+ AI 模型，兼容 OpenAI SDK"
    icon="🔌"
    color="#C67B5C"
    :actions="[
      { label: '快速开始', href: '/guide/quickstart', primary: true },
      { label: '获取 API Key', href: '/guide/get-api-key' },
      { label: '支持的模型', href: '/guide/models' },
      { label: 'API 控制台', href: 'https://api.lurus.cn', external: true },
    ]"
  />
  <ActionCard
    name="GuShen"
    tagline="自然语言生成量化策略，A股·期货·加密货币"
    icon="📈"
    color="#4F46E5"
    :actions="[
      { label: '快速开始', href: '/gushen/quickstart', primary: true },
      { label: '策略编写指南', href: '/gushen/strategy' },
      { label: 'API 参考', href: '/gushen/api' },
      { label: '进入平台', href: 'https://gushen.lurus.cn', external: true },
    ]"
  />
  <ActionCard
    name="Webmail"
    tagline="企业邮件，99% 送达率，IMAP/SMTP/CalDAV"
    icon="📧"
    color="#2563EB"
    :actions="[
      { label: '快速开始', href: '/webmail/quickstart', primary: true },
      { label: '客户端配置', href: '/webmail/client-setup' },
      { label: '常见问题', href: '/webmail/faq' },
      { label: '进入邮箱', href: 'https://mail.lurus.cn', external: true },
    ]"
  />
  <ActionCard
    name="Switch"
    tagline="桌面 AI 网关，全平台，本地路由，离线可用"
    icon="🖥️"
    color="#16A34A"
    :actions="[
      { label: '安装指南', href: '/switch/install', primary: true },
      { label: '配置说明', href: '/switch/configuration' },
      { label: '使用手册', href: '/switch/usage' },
    ]"
  />
</div>

<style>
.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  margin: 24px 0 40px;
}
</style>

---

## 快速上手

### Lurus API — 3 行代码接入所有 AI

```bash
curl https://api.lurus.cn/v1/chat/completions \
  -H "Authorization: Bearer $LURUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"你好"}]}'
```

→ [完整文档](/guide/quickstart) · [API 参考](/api/overview) · [控制台 ↗](https://api.lurus.cn)

---

### GuShen — 自然语言生成量化策略

```python
# 在 GuShen 平台描述你的策略需求：
# "当 5 日均线上穿 20 日均线时买入，跌破时卖出"
# AI 自动生成以下可执行代码：

def strategy(context):
    ma5  = context.ta.sma(period=5)
    ma20 = context.ta.sma(period=20)
    if ma5[-1] > ma20[-1] and ma5[-2] <= ma20[-2]:
        context.order_percent("000001.SZ", 0.5)
    elif ma5[-1] < ma20[-1] and ma5[-2] >= ma20[-2]:
        context.order_percent("000001.SZ", 0)
```

→ [快速开始](/gushen/quickstart) · [策略指南](/gushen/strategy) · [进入平台 ↗](https://gushen.lurus.cn)

---

### Webmail — 邮件客户端参数

| 协议 | 服务器 | 端口 | 加密 |
|------|--------|------|------|
| IMAP | mail.lurus.cn | 993 | SSL/TLS |
| SMTP | mail.lurus.cn | 465 | SSL/TLS |
| SMTP | mail.lurus.cn | 587 | STARTTLS |

→ [快速开始](/webmail/quickstart) · [客户端配置](/webmail/client-setup) · [进入邮箱 ↗](https://mail.lurus.cn)

---

### Switch — 下载与安装

| 平台 | 最低要求 | 安装说明 |
|------|---------|---------|
| Windows | Windows 10 64-bit | [安装指南](/switch/install#windows) |
| macOS | macOS 12+ | [安装指南](/switch/install#macos) |
| Linux | Ubuntu 20.04+ | [安装指南](/switch/install#linux) |

→ [安装指南](/switch/install) · [配置说明](/switch/configuration)

---

## 联系我们

- **技术支持**: support@lurus.cn
- **商务合作**: business@lurus.cn
- **GitHub**: [hanmahong5-arch](https://github.com/hanmahong5-arch)
