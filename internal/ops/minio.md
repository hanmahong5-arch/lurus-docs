---
title: MinIO 对象存储
lastReviewed: 2026-04-28
owner: marvin
---

# MinIO 对象存储

<div class="lurus-section-head"><span class="lurus-section-head__eyebrow"><Icon name="hard-drive" :size="14"/> 对象存储</span><h2 class="lurus-section-head__title">MinIO @ office-win-1</h2><p class="lurus-section-head__lede">单节点物理 Windows 机，承载 PG 备份 + 用户上传 + Lucrum 数据 — 无 HA，断电即全停。</p></div>

<div class="lurus-stat-strip"><div class="lurus-stat"><span class="lurus-stat__value">9000</span><span class="lurus-stat__label">S3 API 端口</span></div><div class="lurus-stat"><span class="lurus-stat__value">9001</span><span class="lurus-stat__label">Console 端口</span></div><div class="lurus-stat"><span class="lurus-stat__value">3</span><span class="lurus-stat__label">Buckets</span></div><div class="lurus-stat"><span class="lurus-stat__value">30 天</span><span class="lurus-stat__label">版本保留</span></div></div>

## 拓扑

<MermaidBlock id="minio-topo" chart="graph TD
  H[&quot;office-win-1<br/>100.79.24.40&quot;]
  H --> A[&quot;MinIO :9000<br/>S3 API&quot;]
  H --> C[&quot;console :9001<br/>web UI&quot;]
  A --> B1[&quot;pg-backups-v2&quot;]
  A --> B2[&quot;lucrum-data&quot;]
  A --> B3[&quot;user-uploads&quot;]" />

| Bucket | 用途 |
|---|---|
| `pg-backups-v2` | PostgreSQL CNPG 备份目标 |
| `lucrum-data` | Lucrum 行情/策略原始数据 |
| `user-uploads` | 平台用户上传（头像 / 内容创作素材） |

host `office-win-1 (100.79.24.40)`；MinIO `:9000`（S3 API）；console `:9001`（web UI）。

## 访问

```bash
# 装 mc client
brew install minio/stable/mc  # macOS
# 或 https://min.io/docs/minio/linux/reference/minio-mc.html

# 配 alias
mc alias set lurus http://100.79.24.40:9000 <ACCESS_KEY> <SECRET_KEY>

# 列 bucket
mc ls lurus

# 列单 bucket
mc ls --recursive lurus/pg-backups-v2/ | tail
```

console 在 http://100.79.24.40:9001 — 仅 Tailscale 内访问。

## 备份恢复

每个 bucket 默认开版本控制。误删可恢复：

```bash
# 看历史版本
mc ls --versions lurus/<bucket>/<path>

# 恢复某版本到本地
mc cp --version-id <vid> lurus/<bucket>/<path> /tmp/recovered
```

## 容量监控

```bash
mc admin info lurus
# 看 Online drives / Used / Available
```

<div class="lurus-callout lurus-callout--warn"><span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18"/></span><div><p class="lurus-callout__title">磁盘满 = 备份链断</p><div class="lurus-callout__body">office-win-1 是物理 Windows 机器，磁盘满 = MinIO 写失败 = PG 归档失败。建议加 R6 二次备份。容量/磁盘告警接入见 <a href="/ops/observability">可观测性 Runbook</a>。</div></div></div>

## 用户 / 策略管理

```bash
# 新建用户（用于新服务接入）
mc admin user add lurus <name> <password>
mc admin policy attach lurus readwrite --user <name>

# 看 policy 详情
mc admin policy info lurus readwrite
```

<div class="lurus-callout lurus-callout--key"><span class="lurus-callout__icon"><Icon name="key-round" :size="18"/></span><div><p class="lurus-callout__title">凭证轮换</p><div class="lurus-callout__body">MinIO 这台机的 root 凭证轮换走 <a href="/ops/key-rotation">密钥轮换 SOP</a>。</div></div></div>

## 已知坑

<div class="lurus-callout lurus-callout--danger"><span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18"/></span><div><p class="lurus-callout__title">单点 + 单份备份</p><div class="lurus-callout__body"><ul><li>office-win-1 是 Windows 物理机，断电 / 网络挂 = 整个对象存储不可用。<strong>无 HA</strong>。</li><li>没有跨机房备份。<strong>PG 备份只此一份。</strong></li><li>MinIO 版本历史保留默认 30 天，超过自动清理。重要恢复要在窗口内做。</li><li>客户端 mc 默认 endpoint 是 office 内网，跨网络要走 Tailscale。</li></ul></div></div></div>

## TODO

- [ ] 加 R6 备份目标（rclone sync 每天）
- [ ] 加磁盘容量告警（< 20% 触发邮件）
- [ ] root 凭证写入密码管理器（当前在 marvin 个人记录）
