---
title: 部署到 R6（staging / 多租户）
lastReviewed: 2026-04-28
owner: marvin
---

# 部署到 R6（staging / 多租户）

<div class="lurus-section-head"><span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14"/> 部署 · Staging</span><h2 class="lurus-section-head__title">部署到 R6（staging / 多租户）</h2><p class="lurus-section-head__lede">非 K3s 节点；docker-compose + cgroup slice 隔离多租户。新服务默认落点。</p></div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">43.226.38.244</span><span class="lurus-stat__label">公网 IP</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">100.122.83.20</span><span class="lurus-stat__label">Tailscale</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">32C / 32G</span><span class="lurus-stat__label">cloud-ubuntu-6</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">300G SSD</span><span class="lurus-stat__label">存储</span></div>
</div>

<div class="lurus-callout lurus-callout--info"><span class="lurus-callout__icon"><Icon name="server" :size="18"/></span><div><p class="lurus-callout__title">R6 = <code>cloud-ubuntu-6</code></p><div class="lurus-callout__body">公网 <code>43.226.38.244</code> / Tailscale <code>100.122.83.20</code> / 32C 32G 300G SSD。<strong>非 K3s 节点</strong>（k3s/k3s-agent 都 inactive），用 docker-compose + cgroup slice 隔离多租户。监控见 <a href="/ops/observability">可观测性 SOP</a>。</div></div></div>

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

<div class="lurus-callout lurus-callout--warn"><span class="lurus-callout__icon"><Icon name="database" :size="18"/></span><div><p class="lurus-callout__title">Supabase 复用规则</p><div class="lurus-callout__body">不同测试服务<strong>用不同 schema 隔离</strong>，不开新 PG 实例。</div></div></div>

<div class="lurus-callout lurus-callout--warn"><span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18"/></span><div><p class="lurus-callout__title">已知问题：supabase-pooler 持续重启</p><div class="lurus-callout__body">根因 <code>VAULT_ENC_KEY</code> 31 字节（AES-256 需 32）。修复见 <a href="./postgres">postgres SOP</a>。改前确认无已加密 vault 数据。</div></div></div>

## 新服务上 R6 的标准模板

<ol class="lurus-steps">
<li>

在 R6 建服务目录（owner = `lurus-infra`）

```bash
ssh root@100.122.83.20
mkdir -p /data/lurus-infra/<service>
chown -R lurus-infra:lurus-infra /data/lurus-infra/<service>
exit
```

</li>
<li>

本地准备 `docker-compose.yml` + `Dockerfile`

<div class="lurus-callout lurus-callout--warn"><span class="lurus-callout__icon"><Icon name="lock" :size="18"/></span><div><p class="lurus-callout__title">绑定策略</p><div class="lurus-callout__body">对外只绑 <code>127.0.0.1</code> 或 Tailscale IP（<code>100.122.83.20</code>），公网由 host nginx / Traefik 反代。</div></div></div>

</li>
<li>

同步代码到 R6

```bash
rsync -av --exclude='node_modules' --exclude='.git' --exclude='dist*' \
  ./ root@100.122.83.20:/data/lurus-infra/<service>/
```

</li>
<li>

在 R6 用 `lurus-infra` 用户起容器

```bash
ssh root@100.122.83.20 "cd /data/lurus-infra/<service> && \
  sudo -u lurus-infra docker compose -f docker-compose.staging.yml up -d --build"
```

</li>
</ol>

## 端口对外的策略

| 暴露方式 | 适用 | 配置 |
|---|---|---|
| 仅本机回环 | 默认调试用 | `ports: ['127.0.0.1:8XXX:3000']` |
| Tailscale 内部 | 团队内访问、[Netdata](/ops/observability) 类 | `ports: ['100.122.83.20:8XXX:3000']` |
| 公网（需子域 + cert） | 客户预览 | host nginx 反代 + Cloudflare DNS + Traefik wildcard cert |

<div class="lurus-callout lurus-callout--key"><span class="lurus-callout__icon"><Icon name="shield" :size="18"/></span><div><p class="lurus-callout__title">公网收口</p><div class="lurus-callout__body">R6 公网 22 关；只 root 有 SSH（Tailscale）。普通服务别开自己的公网端口，统一走 nginx。</div></div></div>

## 验收（R6 跑 30 天后能否迁 R1）

| 项 | 必须 |
|---|---|
| 30+ 天连续无重启（除部署） | ✅ |
| 0 数据事故 | ✅ |
| 5+ 真实用户 / 客户验证（按场景） | ✅ |
| 内部手册完整 | ✅ |
| [监控接入](/ops/observability)（Netdata 自托管 Agent） | ✅ |

<div class="lurus-callout lurus-callout--info"><span class="lurus-callout__icon"><Icon name="git-merge" :size="18"/></span><div><p class="lurus-callout__title">迁 R1 流程</p><div class="lurus-callout__body">先在 R1 副跑 1 周（双跑） → 切流量 → 关 R6 实例。</div></div></div>

## 当前 R6 跑的服务（2026-04-28）

```
- lurus-platform/platform-core   (identity.lurus.cn)
- lurus-platform/casdoor         (auth.lurus.cn)
- lucrum/lucrum-web              (lucrum.lurus.cn)
- database/lurus-pg              (local PG StatefulSet)
- lurus-system/redis             (local redis)
- lurus-docs-staging             (docs Internal 测试 :8880 Tailscale)
- zhongtie-oa                    (客户项目, 客户 slice)
- kova-registry                  (:5000 docker registry)
```

完整列表查 `lurus.yaml` `environments.staging.current_workloads`。
