---
adr: 0003
title: PostgreSQL 用 CNPG operator 而非云 RDS
status: accepted
date: 2025-08
---

# ADR-0003: PostgreSQL 用 CNPG operator 而非云 RDS

## 背景

各产品都需要持久化存储，需统一 PG 方案。云 RDS（阿里云 / 三丰云没有完整 RDS）成本高，跨产品 schema 隔离不灵活。

## 备选方案

| 方案 | 拒绝原因 |
|---|---|
| 云 RDS | 阿里云 RDS 月成本 vs 自建 5x；三丰云无 RDS |
| 单独 VM 跑 PG | 无 HA，没监控，运维负担 |
| **CNPG (CloudNative-PG operator)**（接受） | 声明式集群管理；自动 failover；备份到 MinIO；与 K3s 一致心智 |

## 决定

R1 K3s 跑 CNPG cluster `lurus-pg`，3 副本（1 primary + 2 replica，跨节点）。备份到 MinIO `pg-backups-v2`，30 天 PITR。

各产品分 schema：identity / billing / notification / newapi / lucrum / forge / tally。

## 后果

正面：
- 同集群心智，运维一致
- 自动 failover（跨节点 replica）
- 备份/恢复有标准 SOP
- 成本：无月费，仅磁盘 + 计算

负面：
- 单集群所有产品共享 → 一个产品慢查询拖垮全部（已加 timeout 限制）
- CNPG 升级要测；upstream 频率高
- DR：R1 全挂 → R6 应急路径未演练

## 参考

- [ops/postgres.md](../ops/postgres)
- [ops/db-backup.md](../ops/db-backup)
