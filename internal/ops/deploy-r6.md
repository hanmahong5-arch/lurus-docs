---
title: 部署到 R6（staging / 多租户）
lastReviewed: 2026-04-28
owner: marvin
---

# 部署到 R6（staging / 多租户）

> R6 = `cloud-ubuntu-6` / 公网 `43.226.38.244` / Tailscale `100.122.83.20` / 32C 32G 300G SSD。
> **非 K3s 节点**（k3s/k3s-agent 都 inactive）。docker-compose + cgroup slice 隔离多租户。

## 多租户拓扑

| Slice | 用户 | 用途 | 限额 |
|---|---|---|---|
| `lurus-infra.slice` | `lurus-infra` (UID 1003) | Lurus 基础设施测试服务 | 4C / 5G |
| `zhongtie.slice` | 客户项目用户 | 中铁/秒搭 OA + 自建 supabase | （客户项目用） |
| `kova.slice` | kova-registry | 内部 docker registry :5000 | 小 |

每个 slice 通过 systemd cgroup 隔离 CPU/RAM。新服务申请 R6 资源 = 加新 slice 或落在已有 slice。

## 现有基础设施（**复用，不要重起**）

| 资源 | 位置 | 用途 |
|---|---|---|
| Supabase（13 容器） | `/data/zhongtie-oa/supabase/` | 测试服务连这套作 DB / 存储 / auth |
| Kong API gateway | `:8100` HTTP / `:8443` HTTPS | Supabase 入口 |
| PostgreSQL（容器内） | `:5432` | 容器间用；host 用 `docker exec supabase-db` |
| `kova-registry` | `:5000` | 内部 docker registry |

> ⚠️ Supabase 不同测试服务**用不同 schema 隔离**，不开新 PG 实例。

> ⚠️ 已知问题：`supabase-pooler` 持续重启，根因 `VAULT_ENC_KEY` 31 字节（AES-256 需 32）。修复见 [postgres SOP](./postgres)。改前确认无已加密 vault 数据。

## 新服务上 R6 的标准模板

```bash
# 1. 在 R6 建服务目录（owner = lurus-infra）
ssh root@100.122.83.20
mkdir -p /data/lurus-infra/<service>
chown -R lurus-infra:lurus-infra /data/lurus-infra/<service>
exit

# 2. 本地准备 docker-compose.yml + Dockerfile
# 注意：对外只绑 127.0.0.1 或 Tailscale IP（100.122.83.20），公网由 host nginx / Traefik 反代

# 3. 同步代码到 R6
rsync -av --exclude='node_modules' --exclude='.git' --exclude='dist*' \
  ./ root@100.122.83.20:/data/lurus-infra/<service>/

# 4. 在 R6 用 lurus-infra 用户起容器
ssh root@100.122.83.20 "cd /data/lurus-infra/<service> && \
  sudo -u lurus-infra docker compose -f docker-compose.staging.yml up -d --build"
```

## 端口对外的策略

| 暴露方式 | 适用 | 配置 |
|---|---|---|
| 仅本机回环 | 默认调试用 | `ports: ['127.0.0.1:8XXX:3000']` |
| Tailscale 内部 | 团队内访问、grafana 类 | `ports: ['100.122.83.20:8XXX:3000']` |
| 公网（需子域 + cert） | 客户预览 | host nginx 反代 + Cloudflare DNS + Traefik wildcard cert |

> R6 公网 22 关；只 root 有 SSH（Tailscale）。普通服务别开自己的公网端口，统一走 nginx。

## 验收（R6 跑 30 天后能否迁 R1）

| 项 | 必须 |
|---|---|
| 30+ 天连续无重启（除部署） | ✅ |
| 0 数据事故 | ✅ |
| 5+ 真实用户 / 客户验证（按场景） | ✅ |
| 内部手册完整 | ✅ |
| 监控告警接入 | ✅ |

迁 R1 流程：先在 R1 副跑 1 周（双跑） → 切流量 → 关 R6 实例。

## 当前 R6 跑的服务（2026-04-28）

```
- lurus-platform/platform-core   (identity.lurus.cn)
- lurus-platform/zitadel         (auth.lurus.cn)
- lucrum/lucrum-web              (lucrum.lurus.cn)
- database/lurus-pg              (local PG StatefulSet)
- lurus-system/redis             (local redis)
- lurus-docs-staging             (docs Internal 测试 :8880 Tailscale)
- zhongtie-oa                    (客户项目, 客户 slice)
- kova-registry                  (:5000 docker registry)
```

完整列表查 `lurus.yaml` `environments.staging.current_workloads`。
