---
title: 部署到 R1（生产）
lastReviewed: 2026-04-28
owner: marvin
---

# 部署到 R1（生产）

<div class="lurus-section-head"><span class="lurus-section-head__eyebrow"><Icon name="rocket" :size="14"/> 部署 · 生产</span><h2 class="lurus-section-head__title">部署到 R1（生产）</h2><p class="lurus-section-head__lede">只放已交付客户的商业服务；新服务默认上 R6，达标 30+ 天再视情迁过来。</p></div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">43.226.46.164</span><span class="lurus-stat__label">公网 IP</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">100.98.57.55</span><span class="lurus-stat__label">Tailscale</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">16c / 32G</span><span class="lurus-stat__label">cloud-ubuntu-1</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">30+ 天</span><span class="lurus-stat__label">R6 准入门槛</span></div>
</div>

<div class="lurus-callout lurus-callout--info"><span class="lurus-callout__icon"><Icon name="server" :size="18"/></span><div><p class="lurus-callout__title">R1 = <code>cloud-ubuntu-1-16c32g</code>（三丰云）</p><div class="lurus-callout__body">公网 <code>43.226.46.164</code> / Tailscale <code>100.98.57.55</code>。仅承载<strong>已交付客户的商业服务</strong>。监控接入见 <a href="/ops/observability">可观测性 SOP</a>。</div></div></div>

## 标准路径（GitOps，推荐）

```
git push main
  └→ GHA reusable-{go|frontend|...}.yaml
      └→ 构建镜像 ghcr.io/hanmahong5-arch/<service>:main-<sha7>
          └→ 推 GHCR
              └→ ArgoCD ApplicationSet 检测到 manifest 改动，自动同步
                  └→ R1 K3s 拉镜像、滚动更新
```

<div class="lurus-callout lurus-callout--warn"><span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18"/></span><div><p class="lurus-callout__title">改的是镜像 tag</p><div class="lurus-callout__body">不要 <code>kubectl set image</code> 或 <code>kubectl patch</code>，会被 ArgoCD self-heal 覆盖。</div></div></div>

<ol class="lurus-steps">
<li>

进对应服务仓库，改 `deploy/k8s.yaml` 的 `image:` 行

```bash
cd <service-dir>
sed -i "s|image: ghcr.io/.*|image: ghcr.io/hanmahong5-arch/<service>:main-<sha7>|" deploy/k8s.yaml
```

</li>
<li>

提交并推送 — 这一步触发 ArgoCD

```bash
git add deploy/k8s.yaml && git commit -m "deploy: <service> -> main-<sha7>" && git push
```

</li>
<li>

等 ArgoCD 同步（通常 30s-3min），观察滚动状态

```bash
ssh root@100.98.57.55 "kubectl rollout status deployment/<name> -n <namespace>"
```

</li>
</ol>

## 紧急路径（仅生产事故 + 暂时绕开 GitOps）

<div class="lurus-callout lurus-callout--danger"><span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18"/></span><div><p class="lurus-callout__title">仅限生产事故止血</p><div class="lurus-callout__body">下方命令会被 ArgoCD self-heal 覆盖。事故后<strong>立即</strong>把 manifest 改回去 push。</div></div></div>

```bash
ssh root@100.98.57.55
# 临时改某个 deployment 镜像
kubectl set image -n <namespace> deployment/<name> <container>=ghcr.io/.../<service>:main-<sha7>
# 但这会被 ArgoCD self-heal 覆盖。事故后立即把 manifest 改回去 push。
```

## 强制规则

<div class="lurus-callout lurus-callout--key"><span class="lurus-callout__icon"><Icon name="shield-check" :size="18"/></span><div><p class="lurus-callout__title">五条铁律</p><div class="lurus-callout__body"><ul><li><strong>不用 <code>kubectl patch</code> 永久改东西</strong> — ArgoCD 会覆盖。</li><li><strong>校验镜像 tag</strong> — <code>main-&lt;sha7&gt;</code> 严格 7 位 sha；<code>latest</code> / <code>main</code> 是 staging 用的，绝不上 R1。</li><li><strong>不要删 env</strong> — patch deployment 时只增不删，所有已有 env 保留。</li><li><strong>不要 <code>kubectl create -f</code></strong> — 所有 K8s 资源走 git → ArgoCD。</li><li><strong>新 NetworkPolicy / RBAC 改动</strong>先在 R6 试 1 周。</li></ul></div></div></div>

## 准入门槛（新服务能上 R1 吗？）

| 条件 | 必须 |
|---|---|
| CI 全绿 | ✅ |
| 生产级 manifest（resources / probes / PDB） | ✅ |
| README + 内部手册（在 internal/products/ 下） | ✅ |
| 无 mock，连真实依赖（PG / Redis / Zitadel） | ✅ |
| R6 跑过 ≥ 30 天稳定 | ✅ |
| 0 数据事故 | ✅ |
| 已对外商业交付（有真实客户） | ✅ |

任何一条不满足 → 默认建议 R6。

## 验证

```bash
# Pod 状态
ssh root@100.98.57.55 "kubectl get pods -n <ns> -l app=<name>"
# 滚动状态
ssh root@100.98.57.55 "kubectl rollout status deployment/<name> -n <ns>"
# 应用日志
ssh root@100.98.57.55 "kubectl logs -n <ns> deploy/<name> --tail=200"
# 健康检查
ssh root@100.98.57.55 "kubectl exec -n <ns> deploy/<name> -- curl -s localhost:<port>/healthz"
# 公网验证
curl -sS -o /dev/null -w 'status=%{http_code}\n' https://<domain>/healthz
```

<div class="lurus-callout lurus-callout--tip"><span class="lurus-callout__icon"><Icon name="activity" :size="18"/></span><div><p class="lurus-callout__title">运行后看指标</p><div class="lurus-callout__body">部署完成后到 <a href="/ops/observability">可观测性 SOP</a> 确认服务指标正常（Netdata 自托管 Agent）。</div></div></div>

## 附：常用 namespace ↔ 服务映射

| namespace | 关键服务 |
|---|---|
| `lurus-system` | docs / newapi / memorus |
| `lurus-platform` | platform-core / zitadel / notification |
| `lurus-www` | www |
| `lurus-webgame` | webgame |
| `lurus-admin` | admin |
| `lurus-tally` | tally |
| `lucrum` | lucrum-web |
| `mail` | stalwart / roundcube |
| `database` | lurus-pg |
| `messaging` | redis / nats |
