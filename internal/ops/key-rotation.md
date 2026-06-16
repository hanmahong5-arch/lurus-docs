---
title: 密钥轮换 SOP
lastReviewed: 2026-04-28
owner: marvin
---

# 密钥轮换 SOP

<div class="lurus-section-head"><span class="lurus-section-head__eyebrow"><Icon name="key-round" :size="14"/> 安全运维</span><h2 class="lurus-section-head__title">密钥轮换 SOP</h2><p class="lurus-section-head__lede">所有密钥都要有 owner + 轮换周期 + 上次轮换时间。先看清单，再按类型逐项执行。</p></div>

## 密钥清单（active）

| 类别 | 名称 | 用途 | 上次轮换 | 周期 |
|---|---|---|---|---|
| 认证 | Zitadel admin | 管理用户、应用注册 | ? | 90 天 |
| 认证 | Zitadel SA JWT (各 MCP) | MCP server 调 Zitadel API | ? | 180 天 |
| 内部 API | `INTERNAL_API_KEY` | platform 内部 API 鉴权 | ? | 90 天 |
| GitHub | GHCR push PAT | CI 推镜像 | ? | 180 天 |
| GitHub | repo deploy key | CI checkout | ? | 不轮换（可读） |
| 数据库 | PG superuser password | CNPG admin | ? | 180 天 |
| 数据库 | 各 schema 应用密码 | 服务连库 | ? | 90 天 |
| 对象存储 | MinIO access/secret | 备份 + 用户上传 | ? | 90 天 |
| 邮件 | Stalwart admin | 邮件管理 | ? | 90 天 |
| 邮件 | SendCloud user/pass | 中继出站 | ? | 180 天 |
| 网络 | Cloudflare API token | DNS 管理 | ? | 90 天 |
| 网络 | 三丰云 / 阿里云 console | 控制台访问 | ? | 90 天 + MFA |
| Tailscale | auth keys | 新机器接入 | ? | 60 天 |
| TLS | `lurus-cn-wildcard-tls` | 通配符证书 | 自动续 | acme cert-manager |

<div class="lurus-callout lurus-callout--warn"><span class="lurus-callout__icon"><Icon name="history" :size="18"/></span><div><p class="lurus-callout__title">基线缺失</p><div class="lurus-callout__body">"上次轮换" 全是 <code>?</code> — 因为没系统记录。第一次走这个 SOP 时建立基线。</div></div></div>

## 通用轮换流程

<ol class="lurus-steps">
<li>生成新 key</li>
<li>在使用方加一份（<strong>双 key 共存</strong>）</li>
<li>等所有消费者切到新 key（监控旧 key 调用归零）</li>
<li>删旧 key</li>
<li>更新本表 <code>last_rotated</code> 时间</li>
</ol>

<div class="lurus-callout lurus-callout--danger"><span class="lurus-callout__icon"><Icon name="alert-circle" :size="18"/></span><div><p class="lurus-callout__title">顺序铁律</p><div class="lurus-callout__body"><strong>绝对不要"先删旧再加新"</strong> — 中间窗口所有调用都失败。</div></div></div>

## 各类型的具体步骤

### Zitadel Service Account JWT

<ol class="lurus-steps">
<li>

在 Zitadel UI 新建 SA（或用 zitadel-mcp tool `create_service_account`），拿到 new SA JSON：

```bash
ssh root@100.98.57.55
```

</li>
<li>

把 new SA JSON 注入到 K8s secret（增量加，旧的还在；新 key 名加 `-new` 后缀）：

```bash
kubectl get secret zitadel-sa -n <ns> -o yaml > /tmp/old.yaml
# 编辑加入新 key（key 名加 -new 后缀）
kubectl apply -f /tmp/new.yaml
```

</li>
<li>

改服务代码读新 key（或者 env var 名换），滚动重启：

```bash
kubectl rollout restart deployment/<name> -n <ns>
```

</li>
<li>24 小时后 Zitadel UI 删旧 SA。</li>
<li>K8s secret 删旧 key 字段。</li>
</ol>

### `INTERNAL_API_KEY`

<ol class="lurus-steps">
<li>

生成新 key：

```bash
NEW_KEY=$(openssl rand -hex 32)
```

</li>
<li>

改 platform 配置接受双 key（代码已支持 `INTERNAL_API_KEY` + `INTERNAL_API_KEY_BACKUP`）。旧 key 改名移到 `INTERNAL_API_KEY_BACKUP`，新 key 留在 `INTERNAL_API_KEY`：

```bash
ssh root@100.98.57.55
kubectl create secret generic platform-internal-api-key-v2 \
  --from-literal=KEY=$NEW_KEY -n lurus-platform
# 改 platform deployment env，加 INTERNAL_API_KEY_BACKUP（旧 key 改名移过去）
# 保留 INTERNAL_API_KEY（新 key）
kubectl rollout restart deployment/platform-core -n lurus-platform
```

</li>
<li>改各消费者（lucrum / switch / lutu / creator / tally）env 用新 key，滚动重启。</li>
<li>

监控 platform 日志，确认旧 key 调用归零（关键字 `INTERNAL_API_KEY_BACKUP used`）：

```bash
ssh root@100.98.57.55 "kubectl logs -n lurus-platform deploy/platform-core | grep -i backup_key"
```

</li>
<li>删 <code>INTERNAL_API_KEY_BACKUP</code>。</li>
</ol>

### MinIO access/secret

<ol class="lurus-steps">
<li>MinIO console 新建 user/policy。</li>
<li>给该 user 同样权限（read <code>pg-backups-v2</code> + write <code>user-uploads</code> 等）。</li>
<li>各消费者 secret 改 + 滚动。</li>
<li>监控旧 access key 调用归零（<code>mc admin trace</code>）。</li>
<li>MinIO console 禁用旧 user。</li>
</ol>

### Tailscale auth key

<ol class="lurus-steps">
<li>Tailscale Admin Console 新建 reusable preauth key（不要 single-use）。</li>
<li>写到密码管理器。</li>
<li>删旧 key。</li>
<li>

<div class="lurus-callout lurus-callout--info"><span class="lurus-callout__icon"><Icon name="check-circle" :size="18"/></span><div><p class="lurus-callout__title">现存机器不受影响</p><div class="lurus-callout__body">现存机器的 Tailscale 节点不需重新认证（已有节点 token 不依赖 auth key）。</div></div></div>

</li>
</ol>

### TLS（cert-manager 自动）

wildcard cert 自动续期，详见 <a href="/ops/cert">TLS 证书管理</a>。

```bash
# wildcard cert 自动续期，跑这个查健康
ssh root@100.98.57.55 "kubectl get certificate -A"
ssh root@100.98.57.55 "kubectl describe certificate lurus-cn-wildcard-tls -A"

# 失败时人工触发
ssh root@100.98.57.55 "kubectl annotate certificate lurus-cn-wildcard-tls cert-manager.io/issue-temporary-certificate='true' --overwrite"
```

## 轮换演练日程（每季度）

| 月份 | 演练目标 |
|---|---|
| 1 月 | INTERNAL_API_KEY |
| 4 月 | Zitadel SA + GHCR PAT |
| 7 月 | MinIO + PG passwords |
| 10 月 | Cloudflare + Tailscale + Stalwart |

执行完更新本文档 `last_rotated` 列。

## 已知坑

<div class="lurus-callout lurus-callout--warn"><span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18"/></span><div><p class="lurus-callout__title">轮换陷阱</p><div class="lurus-callout__body"><ul><li>部分服务的 secret 是<strong>写死在 manifest</strong> 而不是 K8s secret 引用 — 改这类 secret 要直接改 manifest，git push。</li><li>Zitadel SA 删除后已签发的 JWT 还有效到 exp（默认 1 小时）— 不算严重但影响"立即吊销"。</li><li>Cloudflare API token 不轮换会逐渐积累 — token 列表 UI 一年看一次。</li></ul></div></div></div>
