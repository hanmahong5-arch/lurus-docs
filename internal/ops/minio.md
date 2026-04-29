---
title: MinIO 对象存储
lastReviewed: 2026-04-28
owner: marvin
---

# MinIO 对象存储

## 拓扑

```
office-win-1 (100.79.24.40)
├─ MinIO @ :9000          (S3 API)
└─ console @ :9001        (web UI)

Buckets:
  pg-backups-v2     PostgreSQL CNPG 备份目标
  lucrum-data       Lucrum 行情/策略原始数据
  user-uploads      平台用户上传（头像 / 内容创作素材）
```

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

> office-win-1 是物理 Windows 机器，磁盘满 = MinIO 写失败 = PG 归档失败。建议加 R6 二次备份。

## 用户 / 策略管理

```bash
# 新建用户（用于新服务接入）
mc admin user add lurus <name> <password>
mc admin policy attach lurus readwrite --user <name>

# 看 policy 详情
mc admin policy info lurus readwrite
```

> ⚠️ MinIO 这台机的 root 凭证轮换走 `key-rotation.md`。

## 已知坑

- office-win-1 是 Windows 物理机，断电 / 网络挂 = 整个对象存储不可用。无 HA。
- 没有跨机房备份。PG 备份只此一份。
- MinIO 版本历史保留默认 30 天，超过自动清理。重要恢复要在窗口内做。
- 客户端 mc 默认 endpoint 是 office 内网，跨网络要走 Tailscale。

## TODO

- [ ] 加 R6 备份目标（rclone sync 每天）
- [ ] 加磁盘容量告警（< 20% 触发邮件）
- [ ] root 凭证写入密码管理器（当前在 marvin 个人记录）
