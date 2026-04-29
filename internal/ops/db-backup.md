---
title: PostgreSQL 备份与恢复
lastReviewed: 2026-04-28
owner: marvin
---

# PostgreSQL 备份与恢复

> CNPG（CloudNative-PG）operator 管理 R1 的主 PG cluster。备份打到 MinIO `pg-backups-v2` bucket。

## 拓扑

```
R1 K3s
└─ namespace: database
    └─ Cluster: lurus-pg (CNPG operator)
        ├─ lurus-pg-1 (primary)  ← 写入
        ├─ lurus-pg-2 (replica)  ← 备份源
        └─ lurus-pg-3 (replica, 跨 node R2 100.94.177.10)

MinIO @ 100.79.24.40:9000
└─ bucket: pg-backups-v2
    ├─ base/<timestamp>/        基础备份（pg_basebackup）
    └─ wals/<timestamp>.gz      连续 WAL 归档
```

## 备份策略

| 类型 | 频率 | 保留 |
|---|---|---|
| 基础备份 | 每日 03:00 UTC | 30 天 |
| WAL 归档 | 实时（写满即归档） | 30 天 |

PITR 窗口：30 天内任意时间点。

## 检查备份健康

```bash
ssh root@100.98.57.55

# 最近 backup 时间
kubectl get backups -n database --sort-by=.metadata.creationTimestamp \
  | tail -5

# 备份是否 succeeded
kubectl get backups -n database -o json \
  | jq -r '.items[] | select(.status.phase != "completed") | .metadata.name'
# 输出空 = 全部成功

# MinIO 最新文件
mc ls --recursive lurus/pg-backups-v2/ | tail -20
```

## 手动触发备份

```bash
ssh root@100.98.57.55
kubectl create -f - <<EOF
apiVersion: postgresql.cnpg.io/v1
kind: Backup
metadata:
  name: manual-$(date +%Y%m%d-%H%M)
  namespace: database
spec:
  cluster:
    name: lurus-pg
EOF
```

## 恢复（创新 cluster，**不要原地恢复**）

> 永远 recover 到一个新 cluster，验证数据后再切流量。原地恢复 = 旧数据彻底丢失。

```yaml
# /tmp/recovery-cluster.yaml
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: lurus-pg-recovery
  namespace: database
spec:
  instances: 1
  bootstrap:
    recovery:
      source: lurus-pg
      recoveryTarget:
        targetTime: "2026-04-28 14:30:00.00000+00"  # PITR 时间
  externalClusters:
    - name: lurus-pg
      barmanObjectStore:
        destinationPath: "s3://pg-backups-v2/"
        s3Credentials:
          accessKeyId: { name: minio-cred, key: ACCESS_KEY }
          secretAccessKey: { name: minio-cred, key: SECRET_KEY }
        endpointURL: "http://100.79.24.40:9000"
  storage:
    size: 50Gi
```

```bash
ssh root@100.98.57.55
kubectl apply -f /tmp/recovery-cluster.yaml
# 等 cluster Up
kubectl get cluster -n database lurus-pg-recovery -w

# 验证数据
kubectl exec -n database lurus-pg-recovery-1 -- psql -c "SELECT now()"
kubectl exec -n database lurus-pg-recovery-1 -- psql -c "\dn"  # schemas
```

## 单 schema 恢复（更常见）

如果只是某个 schema 的数据要回滚（例如 `lucrum`）：

```bash
# 1. 新建 recovery cluster（同上）
# 2. 从 recovery cluster 导出该 schema
ssh root@100.98.57.55
kubectl exec -n database lurus-pg-recovery-1 -- \
  pg_dump --schema=lucrum --data-only -f /tmp/lucrum.sql lurusdb

# 3. 拷出来
kubectl cp database/lurus-pg-recovery-1:/tmp/lucrum.sql /tmp/lucrum.sql

# 4. 在主 cluster 改名当前 schema 留底
kubectl exec -n database lurus-pg-1 -- psql -c \
  "ALTER SCHEMA lucrum RENAME TO lucrum_broken_$(date +%Y%m%d)"

# 5. 创建空 schema 并导入
kubectl exec -n database lurus-pg-1 -- psql -c "CREATE SCHEMA lucrum"
kubectl cp /tmp/lucrum.sql database/lurus-pg-1:/tmp/lucrum.sql
kubectl exec -n database lurus-pg-1 -- psql -d lurusdb -f /tmp/lucrum.sql

# 6. 验证应用工作正常后，drop _broken_ schema
```

## 灾难恢复（R1 全挂）

最坏情况：R1 物理机损坏，数据丢失。

1. R6 应急启 lurus-pg：CNPG cluster + recovery from MinIO
2. 改 R1 K3s 内部 DNS（或 Tailscale 路由），让所有应用指向 R6 PG
3. 用 R6 顶住，期间在新机器上重建 R1 集群

> 这条路径**没演练过**。bus factor = 1 + 没做过 = 风险高。S0 优先级演练待安排。

## 已知问题

- MinIO 100.79.24.40 是办公网络的物理 Windows 机，断电就备份链路断。建议加 R6 二次备份。
- WAL 归档失败时 PG 会报 `WAL archive failed` 但不会停止写入 — 持续失败会撑满磁盘。监控加告警。
- 跨集群 recovery（R6 拉 R1 备份）当前未测试。
