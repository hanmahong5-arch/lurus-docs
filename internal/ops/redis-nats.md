---
title: Redis / NATS 排障
lastReviewed: 2026-04-28
owner: marvin
---

# Redis / NATS

<div class="lurus-section-head"><span class="lurus-section-head__eyebrow"><Icon name="database" :size="14"/> 消息与缓存</span><h2 class="lurus-section-head__title">Redis / NATS 排障</h2><p class="lurus-section-head__lede">两者同处 <code>messaging</code> namespace，均为单点、家用网络/无副本部署 — 排障前先看清拓扑与已知坑。</p></div>

<div class="lurus-callout lurus-callout--info"><span class="lurus-callout__icon"><Icon name="gauge" :size="18"/></span><div><p class="lurus-callout__title">监控</p><div class="lurus-callout__body">stream lag、磁盘占用等指标的告警接入见 <a href="/ops/observability">可观测性 Runbook（Netdata 自托管 Agent）</a>。</div></div></div>

## <Icon name="database" :size="20"/> Redis

### 拓扑

<MermaidBlock id="redis-topo" chart="graph LR
  subgraph ns[&quot;namespace: messaging&quot;]
    R[&quot;Deployment: redis<br/>redis.messaging.svc:6379&quot;]
  end
  R --- D0[&quot;db0 api（legacy lurus-hub → newapi）&quot;]
  R --- D1[&quot;db1 lucrum&quot;]
  R --- D2[&quot;db2 ratelimit 跨服务限流&quot;]
  R --- D3[&quot;db3 identity（platform）&quot;]
  R --- D4[&quot;db4 notification（platform）&quot;]
  R --- D5[&quot;db5 tally&quot;]" />

| DB | 归属 | 说明 |
|---|---|---|
| `0` | api | legacy lurus-hub，现 newapi |
| `1` | lucrum | — |
| `2` | ratelimit | 跨服务限流 |
| `3` | identity | platform |
| `4` | notification | platform |
| `5` | tally | — |

host: `redis.messaging.svc:6379`

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
| OOM | `INFO memory`，maxmemory + eviction policy |
| 慢 | `SLOWLOG GET 10`，看是否有 KEYS / 大 SMEMBERS |

```bash
# 慢查询 top 10
ssh root@100.98.57.55 "kubectl exec -n messaging deploy/redis -- redis-cli SLOWLOG GET 10"

# 客户端
ssh root@100.98.57.55 "kubectl exec -n messaging deploy/redis -- redis-cli CLIENT LIST | head -20"
```

### 已知坑

<div class="lurus-callout lurus-callout--danger"><span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18"/></span><div><p class="lurus-callout__title">无持久化、无 HA</p><div class="lurus-callout__body"><ul><li><strong>没有持久化</strong>（aof + rdb 都关）— 重启数据全丢。session/cache 类没问题，幂等 dedup 类要改。</li><li><strong>单实例无 HA</strong> — redis 挂 = 业务挂（限流 / 钱包 dedup / session）。</li><li>DB 0 历史遗留 lurus-hub 用，现 newapi 也写到 0。命名空间要梳理。</li></ul></div></div></div>

### 紧急清空某 DB（高危）

<div class="lurus-callout lurus-callout--danger"><span class="lurus-callout__icon"><Icon name="alert-circle" :size="18"/></span><div><p class="lurus-callout__title">FLUSHDB 不可逆</p><div class="lurus-callout__body">这会删该 DB 所有 key。<strong>仅在确认没幂等数据时用。</strong></div></div></div>

```bash
ssh root@100.98.57.55 "kubectl exec -n messaging deploy/redis -- redis-cli -n 2 FLUSHDB"
# 这会删该 DB 所有 key。仅在确认没幂等数据时用。
```

---

## <Icon name="git-merge" :size="20"/> NATS

### 拓扑

<MermaidBlock id="nats-topo" chart="graph TD
  N[&quot;StatefulSet: nats<br/>nats.messaging.svc:4222<br/>external 100.98.57.55:30422&quot;]
  N --> S1[&quot;LLM_EVENTS&quot;]
  N --> S2[&quot;LUCRUM_EVENTS&quot;]
  N --> S3[&quot;IDENTITY_EVENTS&quot;]
  N --> S4[&quot;PSI_EVENTS&quot;]" />

| Stream | 发布 | 消费 |
|---|---|---|
| `LLM_EVENTS` | newapi | notification |
| `LUCRUM_EVENTS` | lucrum | notification |
| `IDENTITY_EVENTS` | platform | notification |
| `PSI_EVENTS` | tally | tally / notification |

namespace `messaging`；host `nats.messaging.svc:4222`；external `100.98.57.55:30422`。

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

| 字段 | 含义 |
|---|---|
| `Stream.Messages` | stream 当前消息数 |
| `Stream.LastSeq` | 最新写入序号 |
| `Consumer.AckFloor` | 已 ack 的最小序号 |
| `Consumer.NumPending` | 待消费消息数（消费 lag） |

<div class="lurus-callout lurus-callout--warn"><span class="lurus-callout__icon"><Icon name="trending-up" :size="18"/></span><div><p class="lurus-callout__title">lag 判读</p><div class="lurus-callout__body"><code>NumPending</code> 持续增长 = 消费者跟不上。lag 告警接入见 <a href="/ops/observability">可观测性 Runbook</a>。</div></div></div>

### 紧急 purge stream

<div class="lurus-callout lurus-callout--danger"><span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18"/></span><div><p class="lurus-callout__title">purge 清空 stream</p><div class="lurus-callout__body">仅在测试 / 知道在干嘛时用。</div></div></div>

```bash
# 仅在测试 / 知道在干嘛时用
ssh root@100.98.57.55 "kubectl exec -n messaging sts/nats -- nats stream purge LUCRUM_EVENTS --force"
```

### 已知坑

<div class="lurus-callout lurus-callout--danger"><span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18"/></span><div><p class="lurus-callout__title">家用网络单点 + 无副本</p><div class="lurus-callout__body"><ul><li>NATS 跑在 <strong>office-debian-2（家用网络）</strong>，断网 = 整个 NATS 不可用。计划迁 R1 但有数据迁移成本。</li><li>JetStream 持久化在 PVC（office-debian），<strong>无副本</strong>，数据丢失风险。</li><li>消费者 <code>ack_wait</code> 太短会重复消费，太长 lag 难追上。各 consumer 默认 30s。</li><li><code>LLM_EVENTS</code> 量大（每次 chat call 一条），单个事件 KB 级，stream 长期保留要监控磁盘。</li></ul></div></div></div>

### 重启策略

<table>
<thead><tr><th>组件</th><th>命令</th><th>影响</th></tr></thead>
<tbody>
<tr><td>Redis（无副本）</td><td><code>kubectl rollout restart deployment/redis -n messaging</code></td><td>重启 = 内存数据全丢</td></tr>
<tr><td>NATS（StatefulSet，PVC 保留）</td><td><code>kubectl rollout restart sts/nats -n messaging</code></td><td>30s 不可用窗口</td></tr>
</tbody>
</table>

```bash
# Redis（无副本）
ssh root@100.98.57.55 "kubectl rollout restart deployment/redis -n messaging"
# 重启 = 内存数据全丢

# NATS（StatefulSet，PVC 保留）
ssh root@100.98.57.55 "kubectl rollout restart sts/nats -n messaging"
# 重启会有 30s 不可用窗口
```
