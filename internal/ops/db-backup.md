---
title: PostgreSQL 备份与恢复
lastReviewed: 2026-04-28
owner: marvin
---

# PostgreSQL 备份与恢复

<div class="lurus-section-head"><span class="lurus-section-head__eyebrow"><Icon name="database-backup" :size="14"/> 数据 · 备份恢复</span><h2 class="lurus-section-head__title">PostgreSQL 备份与恢复</h2><p class="lurus-section-head__lede">CNPG operator 管理 R1 主 PG cluster；备份打到 MinIO pg-backups-v2 bucket。</p></div>

<div class="lurus-callout lurus-callout--info"><span class="lurus-callout__icon"><Icon name="database" :size="18"/></span><div><p class="lurus-callout__title">CNPG（CloudNative-PG）</p><div class="lurus-callout__body">operator 管理 R1 的主 PG cluster。备份打到 MinIO <code>pg-backups-v2</code> bucket。备份链路健康告警见 <a href="/ops/observability">可观测性 SOP</a>。</div></div></div>

## 拓扑

<MermaidBlock id="db-backup-topo" chart="graph TD
  subgraph R1[R1 K3s · namespace database]
    C[Cluster lurus-pg · CNPG operator]
    P[lurus-pg-1 primary · 写入]
    R2a[lurus-pg-2 replica · 备份源]
    R3[lurus-pg-3 replica · 跨 node R2 100.94.177.10]
    C --> P
    C --> R2a
    C --> R3
  end
  subgraph M[MinIO @ 100.79.24.40:9000]
    B[bucket pg-backups-v2]
    Base[base/&lt;timestamp&gt;/ · 基础备份 pg_basebackup]
    Wal[wals/&lt;timestamp&gt;.gz · 连续 WAL 归档]
    B --> Base
    B --> Wal
  end
  R2a -.备份.-> B" />

## 备份策略

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">03:00 UTC</span><span class="lurus-stat__label">基础备份（每日）</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">30 天</span><span class="lurus-stat__label">保留</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">30 天</span><span class="lurus-stat__label">PITR 窗口</span></div>
</div>

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

<div class="lurus-callout lurus-callout--danger"><span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18"/></span><div><p class="lurus-callout__title">永远恢复到新 cluster</p><div class="lurus-callout__body">recover 到一个新 cluster，验证数据后再切流量。<strong>原地恢复 = 旧数据彻底丢失。</strong></div></div></div>

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

<ol class="lurus-steps">
<li>

新建 recovery cluster（同上节）。

</li>
<li>

从 recovery cluster 导出该 schema

```bash
ssh root@100.98.57.55
kubectl exec -n database lurus-pg-recovery-1 -- \
  pg_dump --schema=lucrum --data-only -f /tmp/lucrum.sql lurusdb
```

</li>
<li>

拷出来

```bash
kubectl cp database/lurus-pg-recovery-1:/tmp/lucrum.sql /tmp/lucrum.sql
```

</li>
<li>

在主 cluster 改名当前 schema 留底

```bash
kubectl exec -n database lurus-pg-1 -- psql -c \
  "ALTER SCHEMA lucrum RENAME TO lucrum_broken_$(date +%Y%m%d)"
```

</li>
<li>

创建空 schema 并导入

```bash
kubectl exec -n database lurus-pg-1 -- psql -c "CREATE SCHEMA lucrum"
kubectl cp /tmp/lucrum.sql database/lurus-pg-1:/tmp/lucrum.sql
kubectl exec -n database lurus-pg-1 -- psql -d lurusdb -f /tmp/lucrum.sql
```

</li>
<li>

验证应用工作正常后，drop `_broken_` schema。

</li>
</ol>

## 灾难恢复（R1 全挂）

最坏情况：R1 物理机损坏，数据丢失。

<ol class="lurus-steps">
<li>

R6 应急启 lurus-pg：CNPG cluster + recovery from MinIO

</li>
<li>

改 R1 K3s 内部 DNS（或 Tailscale 路由），让所有应用指向 R6 PG

</li>
<li>

用 R6 顶住，期间在新机器上重建 R1 集群

</li>
</ol>

<div class="lurus-callout lurus-callout--danger"><span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18"/></span><div><p class="lurus-callout__title">这条路径没演练过</p><div class="lurus-callout__body">bus factor = 1 + 没做过 = 风险高。S0 优先级演练待安排。</div></div></div>

## 已知问题

<div class="lurus-callout lurus-callout--warn"><span class="lurus-callout__icon"><Icon name="alert-circle" :size="18"/></span><div><p class="lurus-callout__title">备份链路风险</p><div class="lurus-callout__body"><ul><li>MinIO <code>100.79.24.40</code> 是办公网络的物理 Windows 机，断电就备份链路断。建议加 R6 二次备份。</li><li>WAL 归档失败时 PG 会报 <code>WAL archive failed</code> 但不会停止写入 — 持续失败会撑满磁盘。监控加告警（见 <a href="/ops/observability">可观测性 SOP</a>）。</li><li>跨集群 recovery（R6 拉 R1 备份）当前未测试。</li></ul></div></div></div>
