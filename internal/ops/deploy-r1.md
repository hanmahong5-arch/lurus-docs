---
title: 部署到 R1（生产）
lastReviewed: 2026-04-28
owner: marvin
---

# 部署到 R1（生产）

> R1 = `cloud-ubuntu-1-16c32g`（三丰云 / 公网 `43.226.46.164` / Tailscale `100.98.57.55`）。
> 只放**已交付客户的商业服务**。新服务默认上 R6，达标 30+ 天再视情迁过来。

## 标准路径（GitOps，推荐）

```
git push main
  └→ GHA reusable-{go|frontend|...}.yaml
      └→ 构建镜像 ghcr.io/hanmahong5-arch/<service>:main-<sha7>
          └→ 推 GHCR
              └→ ArgoCD ApplicationSet 检测到 manifest 改动，自动同步
                  └→ R1 K3s 拉镜像、滚动更新
```

**改的是镜像 tag** — 不要 `kubectl set image` 或 `kubectl patch`，会被 ArgoCD self-heal 覆盖。

```bash
# 进对应服务仓库
cd <service-dir>
# 改 deploy/k8s.yaml 的 image: 行
sed -i "s|image: ghcr.io/.*|image: ghcr.io/hanmahong5-arch/<service>:main-<sha7>|" deploy/k8s.yaml
git add deploy/k8s.yaml && git commit -m "deploy: <service> -> main-<sha7>" && git push
# 等 ArgoCD 同步（通常 30s-3min）
ssh root@100.98.57.55 "kubectl rollout status deployment/<name> -n <namespace>"
```

## 紧急路径（仅生产事故 + 暂时绕开 GitOps）

```bash
ssh root@100.98.57.55
# 临时改某个 deployment 镜像
kubectl set image -n <namespace> deployment/<name> <container>=ghcr.io/.../<service>:main-<sha7>
# 但这会被 ArgoCD self-heal 覆盖。事故后立即把 manifest 改回去 push。
```

## 强制规则

1. **不用 `kubectl patch` 永久改东西** — ArgoCD 会覆盖。
2. **校验镜像 tag** — `main-<sha7>` 严格 7 位 sha；`latest` / `main` 是 staging 用的，绝不上 R1。
3. **不要删 env** — patch deployment 时只增不删，所有已有 env 保留。
4. **不要 `kubectl create -f`** — 所有 K8s 资源走 git → ArgoCD。
5. **新 NetworkPolicy / RBAC 改动**先在 R6 试 1 周。

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
