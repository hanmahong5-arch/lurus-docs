---
title: 可观测性（Netdata 自托管）
lastReviewed: 2026-06-13
owner: marvin
---

<div class="obs-page">

# 可观测性 — Netdata 自托管 <span class="lurus-tag">2026-06-05 起</span>

自 **2026-06-05**，Lurus 监控全量切换为 **Netdata 自托管 Agent**，替代原 obs-pack 观测栈（Prometheus / Grafana / Loki / Tempo / Alertmanager / cAdvisor / node-exporter）。
决策档见 governance `doc/decisions/2026-06-05-netdata-observability-platform-facade.md` + 根 `CLAUDE.md`「可观测性 HARD RULE」。

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">:19999</span><span class="lurus-stat__label">Netdata 接入端口（R6）</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Netdata</span><span class="lurus-stat__label">唯一监控栈</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">零</span><span class="lurus-stat__label">服务侧代码改动</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Cloud 关</span><span class="lurus-stat__label">DO_NOT_TRACK=1</span></div>
</div>

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="eye" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">一句话</p>
    <div class="lurus-callout__body">换观测栈 <strong>≠</strong> 改业务代码。服务继续暴露 prometheus-format <code>/metrics</code>，Netdata 主动抓；指标名（<code>kova_*</code> / <code>lurus_gateway_*</code>）是代码契约，抓后不变，原有 PromQL / SLO 定义仍适用。</div>
  </div>
</div>

## <Icon name="plug-zap" :size="20" /> 接入点 {#access}

| 项 | 值 |
|---|---|
| 入口 | `http://100.122.83.20:19999`（R6，Tailscale 内网） |
| 鉴权 | 裸 agent，**无登录密码**（仅 Tailscale 网络层隔离） |
| Cloud | 关闭（`DO_NOT_TRACK=1`，无 Cloud claim token） |
| 规划入口 | 经 `2l-svc-platform` admin UI 反代做统一门面（**当前未实现**，仅 Tailscale 内裸访问） |

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="shield" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">访问前提</p>
    <div class="lurus-callout__body">需先接入 Tailscale（见 <a href="/onboarding/">入职指引</a>）。公网无法直达 <code>:19999</code>，这是有意为之——裸 agent 无密码，只能靠网络层闸门。</div>
  </div>
</div>

## <Icon name="network" :size="20" /> 架构（服务侧零改动） {#architecture}

<ol class="lurus-steps">
<li>

各服务**继续暴露** prometheus-format `/metrics`（Go `promhttp` / Rust kova `--features prometheus` 等）—— 不动业务代码。

</li>
<li>

Netdata `go.d` 的 `prometheus` collector **主动抓**这些 `/metrics` 端点（pull 模型，与原 Prometheus server 抓取方式一致）。

</li>
<li>

抓取后指标名不变（`kova_*` / `lurus_gateway_*` …）。这些名字是**代码契约**，原有 PromQL 查询与 SLO 定义照旧可复用。

</li>
</ol>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">别误改：prometheus-format ≠ Prometheus server</p>
    <div class="lurus-callout__body">服务暴露 <code>/metrics</code> 用的是 prometheus <strong>格式</strong>，这是对的、保留。被替换掉的是监控<strong>平台</strong>（Prometheus server / Grafana 仪表盘 / Alertmanager 等）。看到 <code>/metrics</code> 字样不要改成 Netdata。</div>
  </div>
</div>

## <Icon name="lock" :size="20" /> GPL 铁律（守边界） {#gpl}

<div class="lurus-callout lurus-callout--danger">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">禁止把 Netdata 编译进产品</p>
    <div class="lurus-callout__body">Netdata 是 GPLv3+，会传染宿主。<strong>禁 link / 编译 Netdata 进任何产品 crate / 二进制</strong>（Go / Rust 皆然）—— 它是独立守护进程，不是库。platform 门面只能走进程间 HTTP（iframe / 反代 / REST API），不碰 Netdata 源码。Cloud 关；dbengine / cache 走 <code>/data</code>（R6 磁盘铁律）；企业多节点 streaming / Cloud 须 owner opt-in 才开。</div>
  </div>
</div>

## <Icon name="code" :size="20" /> 查询 API（替代 PromQL / Grafana） {#query-api}

| 用途 | Endpoint |
|---|---|
| 取数据 | `GET /api/v1/data?chart=<chart>&after=-300&format=json` |
| 图表清单 | `GET /api/v1/charts` |
| 活跃告警 | `GET /api/v1/alarms` |
| 告警历史 | `GET /api/v1/alarm_log` |
| 节点信息 | `GET /api/v1/info` |

## <Icon name="shuffle" :size="20" /> 旧栈 → Netdata 映射 {#mapping}

| 旧 obs-pack 组件 | 现在用 |
|---|---|
| Prometheus server（抓取 + 存储） | Netdata Agent + `go.d` prometheus collector |
| Grafana 仪表盘 | Netdata 内置 dashboard + `/api/v1/data` |
| Alertmanager | Netdata 告警 + `/api/v1/alarms` |
| cAdvisor / node-exporter | Netdata 内置 system / cgroup / container 采集 |
| Loki / Tempo（日志 / trace） | **范围外**（本次切换不含日志 / trace 平台） |

## <Icon name="package" :size="20" /> obs-pack 框架其余部分（未停） {#obs-pack-rest}

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">勿误删</p>
    <div class="lurus-callout__body">CLAUDE.md「旧栈」仅指<strong>观测组件</strong>。obs-pack 框架的 backup / prober / status-page / kova-tester 管理<strong>仍在用</strong>（<code>/opt/obs-pack/</code>、<code>/data/obs-pack/runtime/</code>）。清理观测组件时不要连这些一起删。</div>
  </div>
</div>

## <Icon name="hard-drive" :size="20" /> 部署与配置 {#deploy}

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="check-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">实测核实 · 2026-06-13</p>
    <div class="lurus-callout__body">以下为 SSH 直连 R6（<code>100.122.83.20</code>）核实的实际部署，非推测。</div>
  </div>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">Docker</span><span class="lurus-stat__label">运行方式（非 systemd）</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">unless-stopped</span><span class="lurus-stat__label">重启策略 → 开机自起</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">/data</span><span class="lurus-stat__label">配置 + dbengine 全在此</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Cloud 关</span><span class="lurus-stat__label">DO_NOT_TRACK=1</span></div>
</div>

| 项 | 实测值 |
|---|---|
| 容器 | `obs-netdata`（镜像 `netdata/netdata` 官方，`restart: unless-stopped`，healthy） |
| 编排 | obs-pack docker-compose：`/data/obs-pack/runtime/compose.yml` |
| 配置根 | `/data/obs-pack/runtime/netdata/config/` → 容器 `/etc/netdata/` |
| 主配置 | `…/config/netdata.conf`（`mode = dbengine`） |
| 抓取配置 | `…/config/go.d/prometheus.conf`（静态 job 清单，非自动发现） |
| dbengine / cache | `/data/obs-pack/runtime/netdata/cache` → 容器 `/var/cache/netdata`（守 R6 /data 铁律） |
| lib | `/data/obs-pack/runtime/netdata/lib` → `/var/lib/netdata` |
| retention | Netdata 默认 dbengine tier（自管）；`/data` 余量变动时按 `dbengine tier N retention size` 调 |
| Cloud | `DO_NOT_TRACK=1`，claim token 空（无 Cloud） |

### <Icon name="radar" :size="18" /> 抓取目标（go.d `prometheus` job） {#scrape-targets}

| Job | Target |
|---|---|
| `platform-core` | `http://localhost:30104/metrics` |
| `newhub` | `http://localhost:30850/metrics` |
| `lucrum_web` | `http://10.43.197.40:3000/api/metrics` |
| `kova-rest` testers ×8 | `http://localhost:3010–3018/metrics`（baseline / partitioned / operability-dx / r1-timers / kill9-demo / competitor-suite / stress-phase0-verify / hanmahong） |
| `obs-textfile-exporter` | `http://localhost:9105/metrics` |

加新服务监控：在 `…/config/go.d/prometheus.conf` 追加 `- name: <svc>` + `url:` 指向其 prometheus-format `/metrics`，重启 `obs-netdata` 容器即可（服务本身不改代码）。

### <Icon name="alert-triangle" :size="18" /> 健康告警 {#alarms}

per-service 健康告警配置在 `…/config/health.d/`（即 `/data/obs-pack/runtime/netdata/config/health.d/`）：`platform.conf` / `newhub.conf` / `kova.conf` / `kova-testers.conf` / `lucrum.conf`；通知模板 `health_alarm_notify.conf`。告警在 dashboard **Alerts** 面板可见；**对外 notification 通道（Slack/邮件等）待接入**。

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">旧栈并存现状（2026-06-13）</p>
    <div class="lurus-callout__body">R6 K8s 的 kube-prometheus 旧栈（monitoring ns：prometheus / grafana / alertmanager / loki / tempo / node-exporter…）已于 2026-06-13 删除并回收 ~11G（快照存 <code>/data/_cleanup-backup/monitoring-ns-snapshot-2026-06-13.yaml</code>，无 helm/ArgoCD 托管不会重建）。但 obs-pack 的 <strong>docker</strong> obs-* 容器（obs-prometheus / obs-grafana / obs-loki / obs-tempo / obs-alertmanager）当前仍与 <code>obs-netdata</code> <strong>并存</strong>于同一 compose —— 是否随 ADR 一并退役属 obs-pack 设计决策（infra-ops 范围），待 owner 定，未擅动。</div>
  </div>
</div>

---

**相关**：[运维 SOP 索引](/ops/) · [部署到 R6](/ops/deploy-r6) · [事故响应](/ops/incident-response) · [服务器拓扑（驾驶舱）](/)

</div>
