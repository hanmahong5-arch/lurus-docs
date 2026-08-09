---
title: 事故响应总则
lastReviewed: 2026-04-28
owner: marvin
---

# 事故响应总则

<div class="lurus-section-head"><span class="lurus-section-head__eyebrow"><Icon name="alert-triangle" :size="14"/> 运维总则</span><h2 class="lurus-section-head__title">事故响应总则</h2><p class="lurus-section-head__lede">bus factor = 1，事故响应只有 marvin 一个人。所有 SOP 必须一个人能在 10 分钟内执行完毕。</p></div>

<div class="lurus-stat-strip"><div class="lurus-stat"><span class="lurus-stat__value">1</span><span class="lurus-stat__label">bus factor</span></div><div class="lurus-stat"><span class="lurus-stat__value">10 分钟</span><span class="lurus-stat__label">单人执行上限</span></div><div class="lurus-stat"><span class="lurus-stat__value">48 小时</span><span class="lurus-stat__label">复盘窗口</span></div></div>

<div class="lurus-callout lurus-callout--danger"><span class="lurus-callout__icon"><Icon name="users" :size="18"/></span><div><p class="lurus-callout__title">bus factor = 1</p><div class="lurus-callout__body">事故响应只有 marvin 一个人。所有 SOP 必须<strong>一个人能在 10 分钟内执行完毕</strong>。失联兜底见本页末。</div></div></div>

## 事故分级

| 级别 | 定义 | 响应时间 | 沟通方式 |
|---|---|---|---|
| <span class="lurus-tag">S0</span> | 多个生产服务全挂 / 资金损失风险 / 数据丢失 | 即刻 | 立即处理 |
| <span class="lurus-tag">S1</span> | 单个 P0 服务全挂（platform / newapi / memx / docs） | 15 分钟 | 立即处理 |
| <span class="lurus-tag lurus-tag--muted">S2</span> | P1 服务部分挂 / 显著降级 | 1 小时 | 营业时间处理 |
| <span class="lurus-tag lurus-tag--muted">S3</span> | P2 服务挂 / 单功能挂 | 24 小时 | 排队 |

## 响应顺序（铁律）

<ol class="lurus-steps">
<li><strong>止血</strong> — 最先做</li>
<li><strong>沟通受影响方</strong> — 第二</li>
<li><strong>找根因</strong> — 第三</li>
<li><strong>修复并验证</strong> — 第四</li>
<li><strong>复盘</strong> — 第五（48 小时内）</li>
</ol>

<div class="lurus-callout lurus-callout--key"><span class="lurus-callout__icon"><Icon name="shield" :size="18"/></span><div><p class="lurus-callout__title">先止血</p><div class="lurus-callout__body">能回滚就回滚，能切流量就切；<strong>不要在生产现场调试</strong>。</div></div></div>

## 第一手命令（遇到事故先跑这些）

<div class="lurus-callout lurus-callout--info"><span class="lurus-callout__icon"><Icon name="activity" :size="18"/></span><div><p class="lurus-callout__title">配合监控</p><div class="lurus-callout__body">实时资源/服务指标看 <a href="/ops/observability">可观测性 Runbook（Netdata 自托管 Agent）</a>，与下方命令互为佐证。</div></div></div>

```bash
# 检查 K3s 集群整体状态
ssh root@100.98.57.55 "kubectl get pods -A | grep -v Running | grep -v Completed"

# 节点健康
ssh root@100.98.57.55 "kubectl get nodes -o wide"
ssh root@100.98.57.55 "kubectl top nodes"

# ArgoCD 同步状态
ssh root@100.98.57.55 "kubectl get applications -n argocd"

# 最近事件
ssh root@100.98.57.55 "kubectl get events -A --sort-by=.lastTimestamp | tail -30"

# 公网入口连通性
curl -sS -o /dev/null -w 'docs=%{http_code}\n' https://docs.lurus.cn/
curl -sS -o /dev/null -w 'identity=%{http_code}\n' https://identity.lurus.cn/healthz
curl -sS -o /dev/null -w 'newapi=%{http_code}\n' https://newapi.lurus.cn/api/status
curl -sS -o /dev/null -w 'auth=%{http_code}\n' https://identity.lurus.cn/.well-known/openid-configuration
```

## 常见症状速查

| 症状 | 第一反应 |
|---|---|
| 多个服务 502/504 | Traefik / cert / 集群 networking |
| 单服务 OOM 反复 restart | `resources.limits` 不够 / 内存泄漏 |
| ArgoCD app OutOfSync 红 | manifest 改坏 → 回滚最近一次提交 |
| pod `ImagePullBackOff` | GHCR 拉镜像问题（见下） |
| 钱包扣款异常 | platform billing schema → 立刻只读 |
| Casdoor 登录死循环 | OIDC redirect_uri / cookie domain |

### GHCR 拉镜像失败

R1 K3s 用了 containerd mirror。如果 mirror 挂或新镜像没推上：

<ol class="lurus-steps">
<li>

查 pod 事件，找 `Failed to pull image`：

```bash
ssh root@100.98.57.55 "kubectl describe pod -n <ns> <pod> | grep -A5 Events"
```

</li>
<li>

手动测试拉：

```bash
ssh root@100.98.57.55 "ctr -n k8s.io images pull ghcr.io/hanmahong5-arch/<service>:main-<sha>"
```

</li>
</ol>

## 沟通模板

S0/S1 事故对外沟通用模板（写在 admin 后台公告 / 邮件给受影响客户）：

```
事故时间: 2026-04-28 14:23 UTC+8 ~ 14:45（22 分钟）
影响范围: &lt;具体服务/功能&gt;
受影响用户: &lt;估算&gt;
当前状态: 已恢复 / 调查中 / 修复中
临时方案: &lt;如有&gt;
后续: 48 小时内提供详细复盘
```

不要写"小问题已修复" — 客户讨厌不透明。

## 复盘（48 小时内）

模板见 `internal/postmortems/_template.md`。复盘必须有：

<ol class="lurus-steps">
<li>时间线（谁/几点/做了什么 — 不裁剪自己犯错的部分）</li>
<li>根因（5 Whys）</li>
<li>修复</li>
<li>预防：3 类（监控 / 自动化 / 流程）至少各 1 条</li>
</ol>

## bus factor = 1 的兜底

<div class="lurus-callout lurus-callout--key"><span class="lurus-callout__icon"><Icon name="users" :size="18"/></span><div><p class="lurus-callout__title">"marvin 失联"应急路径</p><div class="lurus-callout__body">只有 marvin 在的当下，必须有失联兜底：<ul><li>关键凭证（Tailscale auth key / Casdoor admin / GHCR PAT / SSH key）写一份在密码管理器，配偶 / 信任的合作者掌握主密码。</li><li>三丰云 / 阿里云控制台账号有备用人员可登录。</li><li>这份 internal docs 是非 marvin 上手的入口。</li></ul></div></div></div>
