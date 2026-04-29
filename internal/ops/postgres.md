---
title: PostgreSQL 操作
lastReviewed: 2026-04-28
owner: marvin
---

# PostgreSQL 操作

## 拓扑

```
R1 K3s namespace: database
└─ Cluster: lurus-pg (CNPG)
    ├─ lurus-pg-1  primary
    ├─ lurus-pg-2  replica
    └─ lurus-pg-3  replica (R2)

集群内访问: lurus-pg-rw.database.svc:5432  (写)
            lurus-pg-ro.database.svc:5432  (只读)
集群外:     100.98.57.55:30543

R6 staging: 自己一份独立 lurus-pg StatefulSet（local PG）
```

## Schema 划分（业务隔离）

| Schema | 拥有者 | 用途 |
|---|---|---|
| identity | platform | 账户 / VIP / 权益 |
| billing | platform | 钱包 / 订阅 / 支付 / 发票 |
| notification | platform | 通知模板 / 投递记录 |
| newapi | newapi | LLM 渠道 / Token / 日志 |
| forge | forge | Ontology / Sessions |
| lucrum | lucrum | 量化交易数据 |
| tally | tally | 商品 / 库存 / 单据 |

> **不允许跨 schema 直接 SQL** — 跨业务用 capability API。

## 常用操作

### 进入 psql

```bash
# K8s 内
ssh root@100.98.57.55 "kubectl exec -it -n database lurus-pg-1 -- psql -U postgres lurusdb"

# K8s 外（用 service nodeport）
psql "postgresql://postgres:<pwd>@100.98.57.55:30543/lurusdb"
```

### 看连接数 / 锁

```sql
-- 当前活跃连接
SELECT pid, usename, application_name, state, now() - query_start AS duration, query
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY duration DESC;

-- 长事务（> 10 分钟）
SELECT pid, usename, now() - xact_start AS xact_duration, query
FROM pg_stat_activity
WHERE xact_start < now() - interval '10 minutes';

-- 阻塞链
SELECT blocked.pid AS blocked_pid, blocked.query AS blocked_query,
       blocking.pid AS blocking_pid, blocking.query AS blocking_query
FROM pg_locks blocked_l
JOIN pg_stat_activity blocked ON blocked.pid = blocked_l.pid
JOIN pg_locks blocking_l ON blocking_l.locktype = blocked_l.locktype
JOIN pg_stat_activity blocking ON blocking.pid = blocking_l.pid
WHERE NOT blocked_l.granted AND blocking_l.granted;
```

### 杀连接

```sql
-- 取消当前查询（事务还在）
SELECT pg_cancel_backend(<pid>);

-- 强制断连接（事务回滚）
SELECT pg_terminate_backend(<pid>);
```

### 切主（CNPG）

```bash
ssh root@100.98.57.55
# 触发 failover（让 lurus-pg-2 升主）
kubectl cnpg promote lurus-pg lurus-pg-2 -n database

# 自动 failover 触发条件: primary unhealthy 30s
# 看状态
kubectl get cluster lurus-pg -n database
```

### 加新 schema（新业务接入）

```sql
-- 1. 创建 schema
CREATE SCHEMA new_biz AUTHORIZATION postgres;

-- 2. 创建专用 role
CREATE ROLE new_biz_app WITH LOGIN PASSWORD '...';
GRANT USAGE ON SCHEMA new_biz TO new_biz_app;
GRANT ALL ON ALL TABLES IN SCHEMA new_biz TO new_biz_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA new_biz GRANT ALL ON TABLES TO new_biz_app;

-- 3. 加到 lurus.yaml infrastructure.postgresql.schemas
```

### 看库大小

```sql
-- 各数据库
SELECT datname, pg_size_pretty(pg_database_size(datname)) FROM pg_database ORDER BY pg_database_size(datname) DESC;

-- 单库各 schema
SELECT schema_name,
  pg_size_pretty(SUM(pg_total_relation_size(schemaname||'.'||tablename))::bigint) AS size
FROM pg_tables JOIN information_schema.schemata ON schema_name = schemaname
GROUP BY schema_name ORDER BY SUM(pg_total_relation_size(schemaname||'.'||tablename)) DESC;
```

## CNPG operator 操作

```bash
ssh root@100.98.57.55

# operator 状态
kubectl get pods -n cnpg-system

# cluster 状态
kubectl get cluster -A
kubectl describe cluster lurus-pg -n database

# pod 重启（不影响可用性，replica 顶上）
kubectl delete pod lurus-pg-2 -n database

# 升级版本（改 cluster spec.imageName，CNPG 滚动）
kubectl edit cluster lurus-pg -n database
```

## R6 supabase pooler 已知问题

R6 上 zhongtie-oa 项目使用的 supabase stack，13 容器中 `supabase-pooler` 持续重启。

根因：`VAULT_ENC_KEY` 在 `/data/zhongtie-oa/supabase/.env` 是 31 字节，AES-256 需要 32 字节。

修复：

```bash
ssh root@100.122.83.20
cd /data/zhongtie-oa/supabase

# 看现状
docker ps -a | grep supabase-pooler
docker logs supabase-pooler 2>&1 | tail -20

# 改 .env（确认无已加密 vault 数据；当前 pooler 从未成功，应安全）
sed -i 's/VAULT_ENC_KEY=\(.\{31\}\)$/VAULT_ENC_KEY=\1A/' .env

# 重启
docker compose restart supabase-pooler
```

## 已知坑

- CNPG 跨节点的 replica 在 R2（100.94.177.10），跨 Tailscale 网络复制延迟高峰可能滞后。
- 长事务会阻塞 vacuum，autovacuum 难追上 → 表膨胀。看 `pg_stat_user_tables.n_dead_tup`。
- pg_dump/restore 不带索引和约束，恢复时手工加。
- 数据库密码改后必须同时改：CNPG cluster spec、各应用 secret、连接池配置。
