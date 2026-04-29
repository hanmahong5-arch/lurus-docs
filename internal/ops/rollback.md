---
title: 回滚 SOP
lastReviewed: 2026-04-28
owner: marvin
---

# 回滚 SOP

> 部署出问题先回滚再修，不要在生产现场调试。生产事故影响时间 = MTTR，回滚时间应 < 5 分钟。

## R1（K3s + ArgoCD）

### 方式 1：ArgoCD History rollback（最快，30 秒）

```bash
ssh root@100.98.57.55
argocd login argocd.lurus.cn  # 如未登录
argocd app history <app-name>
argocd app rollback <app-name> <revision-id>
```

> 这只是改 ArgoCD 内部 desired state 指针。**git 还是新代码**——下次 sync 又会回到坏版本。
> 用了立即回 git 改 manifest 永久修复。

### 方式 2：改 manifest 镜像 tag → push（永久，正路）

```bash
# 找上一个稳定的 sha
gh api /repos/hanmahong5-arch/<service>/commits | jq -r '.[].sha[:7]' | head -10

# 在服务目录改 deploy/k8s.yaml
cd <service-dir>
sed -i "s|image: ghcr.io/.*|image: ghcr.io/hanmahong5-arch/<service>:main-<good-sha>|" deploy/k8s.yaml
git add deploy/k8s.yaml
git commit -m "rollback: <service> -> main-<good-sha>"
git push

# ArgoCD auto-sync 接管（30s-3min）
ssh root@100.98.57.55 "kubectl rollout status deployment/<name> -n <namespace>"
```

### 方式 3：紧急止血（绕 ArgoCD，仅事故）

```bash
ssh root@100.98.57.55
kubectl set image -n <namespace> deployment/<name> <container>=ghcr.io/.../<service>:main-<good-sha>
# !!! 立即在 git 改 manifest 否则 ArgoCD self-heal 会把它改回坏版本
```

## R6（docker-compose）

```bash
ssh root@100.122.83.20
cd /data/lurus-infra/<service>/deploy

# 改 docker-compose 的 image 标签（如果用 image:tag）
# 或回滚 git 然后 rebuild
git -C /data/lurus-infra/<service> log --oneline -10
git -C /data/lurus-infra/<service> checkout <good-sha>

# 重起
sudo -u lurus-infra docker compose -f docker-compose.staging.yml up -d --build
docker ps --filter name=<service>
```

## 数据回滚（高危，最后手段）

> 先评估**可不可以前滚**（写补丁修数据）。如果不行：

### Postgres（CNPG cluster）

```bash
ssh root@100.98.57.55
# 找最近一个 backup
kubectl get backups -n database -o wide | tail -10

# 列 PITR 可恢复时间窗
kubectl exec -n database lurus-pg-1 -- psql -c "SELECT now() - pg_last_wal_receive_lsn()::pg_lsn"

# Recovery（创新 cluster 从 backup 恢复，不要原地恢复）
# 详见 db-backup SOP
```

### MinIO

MinIO buckets（`pg-backups-v2` / `lucrum-data` / `user-uploads`）有版本控制 — 误删可恢复。

```bash
mc alias set lurus minio.lurus.cn:9000 <access-key> <secret>
mc ls --versions lurus/<bucket>/<path>
mc cp --version-id <vid> lurus/<bucket>/<path> /tmp/recovered
```

## 回滚后必做

1. 写事故复盘到 `internal/postmortems/`，1 周内完成
2. 改对应产品的"已知坑"和"决策档案"
3. 加测试覆盖出问题的 path
4. 如果是镜像 tag 错配 → 加 CI 校验

## 反例（不要这么做）

- ❌ 在生产 pod 内 `vim` 改文件 — pod 重启就没了，下次部署也没改
- ❌ `kubectl scale --replicas=0` 当回滚 — 这是停机，不是回滚
- ❌ ssh 进 pod 删数据 — 用迁移脚本走标准流程
- ❌ 回滚后不修代码 — 坏代码还在 main，下次再部署就再炸
