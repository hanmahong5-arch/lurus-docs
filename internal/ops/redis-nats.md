---
title: Redis / NATS 排障
lastReviewed: 2026-04-28
owner: marvin
---

# Redis / NATS

## Redis

### 拓扑

```
namespace: messaging
└─ Deployment: redis
    └─ host: redis.messaging.svc:6379

DB allocation:
  0  api          (legacy lurus-hub, 现 newapi)
  1  lucrum
  2  ratelimit    (跨服务限流)
  3  identity     (platform)
  4  notification (platform)
  5  tally
```

### 常用命令

```bash
# 进 redis-cli
ssh root@100.98.57.55 "kubectl exec -it -n messaging deploy/redis -- redis-cli"

# 选 DB
SELECT 3
# 看 keys
KEYS *
# 谨慎用 SCAN 替代大库
SCAN 0 MATCH "user:*" COUNT 100
# 大 key
MEMORY USAGE <key>

# 全局信息
INFO memory
INFO clients
INFO stats
```

### 排障

| 症状 | 检查 |
|---|---|
| 应用连不上 | service DNS / NetworkPolicy |
| OOM | INFO memory，maxmemory + eviction policy |
| 慢 | SLOWLOG GET 10，看是否有 KEYS / 大 SMEMBERS |

```bash
# 慢查询 top 10
ssh root@100.98.57.55 "kubectl exec -n messaging deploy/redis -- redis-cli SLOWLOG GET 10"

# 客户端
ssh root@100.98.57.55 "kubectl exec -n messaging deploy/redis -- redis-cli CLIENT LIST | head -20"
```

### 已知坑

- 没有持久化（aof + rdb 都关）— 重启数据全丢。session/cache 类没问题，幂等 dedup 类要改。
- 单实例无 HA — redis 挂 = 业务挂（限流 / 钱包 dedup / session）。
- DB 0 历史遗留 lurus-hub 用，现 newapi 也写到 0。命名空间要梳理。

### 紧急清空某 DB（高危）

```bash
ssh root@100.98.57.55 "kubectl exec -n messaging deploy/redis -- redis-cli -n 2 FLUSHDB"
# 这会删该 DB 所有 key。仅在确认没幂等数据时用。
```

---

## NATS

### 拓扑

```
namespace: messaging
└─ StatefulSet: nats
    └─ host: nats.messaging.svc:4222
       external: 100.98.57.55:30422

JetStream Streams:
  LLM_EVENTS       发布: newapi          消费: notification
  LUCRUM_EVENTS    发布: lucrum          消费: notification
  IDENTITY_EVENTS  发布: platform        消费: notification
  PSI_EVENTS       发布: tally           消费: tally / notification
```

### 监控 + 排障

```bash
# 进 nats-cli
ssh root@100.98.57.55 "kubectl exec -it -n messaging sts/nats -- nats stream ls"

# 看某 stream 状态
ssh root@100.98.57.55 "kubectl exec -n messaging sts/nats -- nats stream info LLM_EVENTS"

# 看消费者
ssh root@100.98.57.55 "kubectl exec -n messaging sts/nats -- nats consumer ls LLM_EVENTS"

# 看 lag（消费者落后多少）
ssh root@100.98.57.55 "kubectl exec -n messaging sts/nats -- nats consumer info LLM_EVENTS notification-consumer"
```

### 重要字段

- `Stream.Messages` — stream 当前消息数
- `Stream.LastSeq` — 最新写入序号
- `Consumer.AckFloor` — 已 ack 的最小序号
- `Consumer.NumPending` — 待消费消息数（消费 lag）

NumPending 持续增长 = 消费者跟不上。

### 紧急 purge stream

```bash
# 仅在测试 / 知道在干嘛时用
ssh root@100.98.57.55 "kubectl exec -n messaging sts/nats -- nats stream purge LUCRUM_EVENTS --force"
```

### 已知坑

- NATS 跑在 office-debian-2（家用网络），断网 = 整个 NATS 不可用。计划迁 R1 但有数据迁移成本。
- JetStream 持久化在 PVC（office-debian），无副本，数据丢失风险。
- 消费者 ack_wait 太短会重复消费，太长 lag 难追上。各 consumer 默认 30s。
- LLM_EVENTS 量大（每次 chat call 一条），单个事件 KB 级，stream 长期保留要监控磁盘。

### 重启策略

```bash
# Redis（无副本）
ssh root@100.98.57.55 "kubectl rollout restart deployment/redis -n messaging"
# 重启 = 内存数据全丢

# NATS（StatefulSet，PVC 保留）
ssh root@100.98.57.55 "kubectl rollout restart sts/nats -n messaging"
# 重启会有 30s 不可用窗口
```
