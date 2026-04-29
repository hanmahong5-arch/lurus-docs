---
title: 密钥轮换 SOP
lastReviewed: 2026-04-28
owner: marvin
---

# 密钥轮换 SOP

> 所有密钥都要有 owner + 轮换周期 + 上次轮换时间。下面这张表先列出来，然后逐项写轮换流程。

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

> ⚠️ "上次轮换" 全是 `?` — 因为没系统记录。第一次走这个 SOP 时建立基线。

## 通用轮换流程

```
1. 生成新 key
2. 在使用方加一份（双 key 共存）
3. 等所有消费者切到新 key（监控旧 key 调用归零）
4. 删旧 key
5. 更新本表 last_rotated 时间
```

**绝对不要"先删旧再加新"** — 中间窗口所有调用都失败。

## 各类型的具体步骤

### Zitadel Service Account JWT

```bash
ssh root@100.98.57.55
# 1. 在 Zitadel UI 新建 SA
# 或用 zitadel-mcp tool: create_service_account
# 拿到 new SA JSON

# 2. 把 new SA JSON 注入到 K8s secret（增量加，旧的还在）
kubectl get secret zitadel-sa -n <ns> -o yaml > /tmp/old.yaml
# 编辑加入新 key（key 名加 -new 后缀）
kubectl apply -f /tmp/new.yaml

# 3. 改服务代码读新 key（或者 env var 名换）
# 滚动重启
kubectl rollout restart deployment/<name> -n <ns>

# 4. 24 小时后 Zitadel UI 删旧 SA
# 5. K8s secret 删旧 key 字段
```

### `INTERNAL_API_KEY`

```bash
# 1. 生成新 key
NEW_KEY=$(openssl rand -hex 32)

# 2. 改 platform 配置接受双 key（代码已支持 INTERNAL_API_KEY + INTERNAL_API_KEY_BACKUP）
ssh root@100.98.57.55
kubectl create secret generic platform-internal-api-key-v2 \
  --from-literal=KEY=$NEW_KEY -n lurus-platform
# 改 platform deployment env，加 INTERNAL_API_KEY_BACKUP（旧 key 改名移过去）
# 保留 INTERNAL_API_KEY（新 key）
kubectl rollout restart deployment/platform-core -n lurus-platform

# 3. 改各消费者（lucrum / switch / lutu / creator / tally）env 用新 key
# 滚动重启

# 4. 监控 platform 日志，确认旧 key 调用归零（关键字 "INTERNAL_API_KEY_BACKUP used"）
ssh root@100.98.57.55 "kubectl logs -n lurus-platform deploy/platform-core | grep -i backup_key"

# 5. 删 INTERNAL_API_KEY_BACKUP
```

### MinIO access/secret

```bash
# 1. MinIO console 新建 user/policy
# 2. 给该 user 同样权限（read pg-backups-v2 + write user-uploads 等）
# 3. 各消费者 secret 改 + 滚动
# 4. 监控旧 access key 调用归零（mc admin trace）
# 5. MinIO console 禁用旧 user
```

### Tailscale auth key

```bash
# 1. Tailscale Admin Console 新建 reusable preauth key（不要 single-use）
# 2. 写到密码管理器
# 3. 删旧 key
# 4. 注：现存机器的 Tailscale 节点不需重新认证（已有节点 token 不依赖 auth key）
```

### TLS（cert-manager 自动）

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

- 部分服务的 secret 是写死在 manifest 而不是 K8s secret 引用 — 改这类 secret 要直接改 manifest，git push。
- Zitadel SA 删除后已签发的 JWT 还有效到 exp（默认 1 小时） — 不算严重但影响"立即吊销"。
- Cloudflare API token 不轮换会逐渐积累 — token 列表 UI 一年看一次。
