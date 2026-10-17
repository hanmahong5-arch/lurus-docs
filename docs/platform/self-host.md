---
title: 私有化部署
description: 把 Lugo 账号与计费底座装进你自己的环境：每客户独立一套，一条命令安装，装完以「交付就绪」看板全绿为终点。
---

# 私有化部署 <Badge type="tip" text="内部生产使用" />

Lugo 可以按客户独立安装：**一套安装只服务一个客户**，用你自己的域名、数据库、身份源和密钥。我们自己的全部产品也跑在同一套代码上。

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="receipt" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">先说边界</p>
    <div class="lurus-callout__body">设置、产品目录、品牌与支付在一套安装内是全局的，不支持一套服务多客户白标。身份源目前固定为 Zitadel，企业自有身份源（Okta、Entra ID、Keycloak 等）经 OIDC 联合登录接入。支付宝、微信支付直连代码已就绪，但还没有用真实商户号跑通过。</div>
  </div>
</div>

## 你需要准备的

| 项目 | 用途 |
|------|------|
| 一个域名，例如身份入口 `id.example.com` | 签发方、Cookie 与回跳地址都锚定在它上面 |
| Kubernetes 集群与镜像仓库（或一台装了 Docker 的机器） | 运行服务 |
| PostgreSQL 15+，**带一个名为 `lurus` 的非超级用户角色** | 账号与计费数据；组织隔离由行级安全（RLS）强制执行，超级用户会绕过它 |
| Redis 6+；NATS 2.10（推荐） | 缓存与限流；事件流（缺失时降级运行） |
| Zitadel 实例（可随 Helm chart 一起装在集群里） | 身份源 |
| 身份入口的 TLS 证书 | Ingress 引用 |
| SMTP、短信、支付渠道凭据（可选） | 只在开启对应功能时需要 |

## 一条命令安装

安装器 `zita` 随交付一起提供。

```bash
# 单机快速体验：Docker Compose，内含完整依赖，自动生成强随机密钥
zita install docker

# 客户集群：Helm chart（先按下一节创建密钥）
zita install k8s --context <集群> --namespace <命名空间> \
  --values my-values.yaml --platform-url https://id.example.com
```

安装器依次完成：生成配置 → 部署收敛 → 初始化身份源的组织与项目 → 配置登录回跳 → 预检 → 一次「注册 → 登录 → 验签」冒烟测试 → 输出交付就绪看板。每一步要么跳过、要么收敛，**失败后重跑同一条命令就从断点继续**。`--dry-run` 只打印计划，`--format json` 输出机器可读结果。

## 必需的密钥（集群安装）

安装器在 Helm 运行前会预检这个 Secret，缺任何一项都会停下并打印需要补的内容。

| 键 | 说明 |
|----|------|
| `DATABASE_DSN` | 以 `lurus` 角色连接的数据库地址 |
| `INTERNAL_API_KEY` | 服务间调用凭据，至少 32 位 |
| `SESSION_SECRET` | 会话签名密钥 |
| `ZITADEL_ISSUER` / `ZITADEL_JWKS_URL` | `https://<身份入口>` 与 `https://<身份入口>/oauth/v2/keys` |
| `ENTITLEMENT_SIGNING_KEY`（推荐） | RSA 私钥（≥2048）。你的应用凭它签发的权益令牌离线判断用户能用什么；密钥在你的环境里生成，只归你所有，不存在由我们签发的许可证 |

要开出发票，还需要在 values 里填写销售方主体 `config.invoiceSeller.name`。没填时，发票下载接口会拒绝出票，而不是替你编一个。

## 装完：交付就绪看板

打开 `https://<身份入口>/admin` →「交付就绪」：数据库迁移、内部鉴权、身份源可达、登录回跳、计费、支付、邮件、短信、隐私数据加密、已注册应用等逐项显示：

- **绿**：正常工作
- **黄**：需要处理，每一项都写明去哪个页面或执行哪条命令修
- **灰**：功能未开启，不算错误

同样的数据可从 `GET /admin/v1/deploy/checklist` 读取。看板全绿，才算交付完成。

其中最值得盯的是**内部鉴权**一项：有服务调用内部接口被拒时它会变黄，并写明是密钥不对还是根本没带凭据。这类故障平时是静默的。

## 日常运维

- **升级**：`helm upgrade` 到新镜像版本，或重跑 `zita install k8s`（会收敛到目标状态）。
- **配置**：邮件、支付密钥、认证策略、注册开关等运行时设置在控制台修改，保存即生效；少数需要重启的项在界面上有标注。
- **接入新应用**：在 values 的 `appsRegistry.apps` 下加一项，`helm upgrade` 后自动在身份源里创建 OIDC 应用并写好 client_id。
- **接口**：你的实例在 `https://<身份入口>/docs/api` 提供在线可调试的 API 参考（OpenAPI 3.1）；服务等级指标见实例的 `/status` 页。

## 下一步

- [账号与计费概述](/platform/)
- [统一身份认证](/platform/auth/)
- 想了解它装进你的环境是什么样：写信到 [contact@lurus.cn](mailto:contact@lurus.cn)
