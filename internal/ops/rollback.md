---
title: 回滚 SOP
lastReviewed: 2026-04-28
owner: marvin
---

# 回滚 SOP

<div class="lurus-section-head"><span class="lurus-section-head__eyebrow"><Icon name="history" :size="14"/> 运维 · 应急</span><h2 class="lurus-section-head__title">回滚 SOP</h2><p class="lurus-section-head__lede">部署出问题先回滚再修，不要在生产现场调试。</p></div>

<div class="lurus-callout lurus-callout--key"><span class="lurus-callout__icon"><Icon name="timer" :size="18"/></span><div><p class="lurus-callout__title">回滚时间 &lt; 5 分钟</p><div class="lurus-callout__body">生产事故影响时间 = MTTR。先回滚止血，再回 git 永久修复。监控状态见 <a href="/ops/observability">可观测性 SOP</a>。</div></div></div>

## R1（K3s + ArgoCD）

### 方式 1：ArgoCD History rollback（最快，30 秒）

```bash
ssh root@100.98.57.55
argocd login argocd.lurus.cn  # 如未登录
argocd app history <app-name>
argocd app rollback <app-name> <revision-id>
```

<div class="lurus-callout lurus-callout--warn"><span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18"/></span><div><p class="lurus-callout__title">这只是临时指针</p><div class="lurus-callout__body">改的是 ArgoCD 内部 desired state 指针，<strong>git 还是新代码</strong>——下次 sync 又会回到坏版本。用了立即回 git 改 manifest 永久修复（方式 2）。</div></div></div>

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

<div class="lurus-callout lurus-callout--danger"><span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18"/></span><div><p class="lurus-callout__title">仅事故止血</p><div class="lurus-callout__body"><strong>立即</strong>在 git 改 manifest，否则 ArgoCD self-heal 会把它改回坏版本。</div></div></div>

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

<div class="lurus-callout lurus-callout--danger"><span class="lurus-callout__icon"><Icon name="database-backup" :size="18"/></span><div><p class="lurus-callout__title">先评估能否前滚</p><div class="lurus-callout__body">优先考虑<strong>前滚</strong>（写补丁修数据）。确实不行才走下方数据回滚。</div></div></div>

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

<ol class="lurus-steps">
<li>

写事故复盘到 `internal/postmortems/`，1 周内完成

</li>
<li>

改对应产品的"已知坑"和"决策档案"

</li>
<li>

加测试覆盖出问题的 path

</li>
<li>

如果是镜像 tag 错配 → 加 CI 校验

</li>
</ol>

## 反例（不要这么做）

<div class="lurus-callout lurus-callout--danger"><span class="lurus-callout__icon"><Icon name="alert-circle" :size="18"/></span><div><p class="lurus-callout__title">这些都不是回滚</p><div class="lurus-callout__body"><ul><li>在生产 pod 内 <code>vim</code> 改文件 — pod 重启就没了，下次部署也没改</li><li><code>kubectl scale --replicas=0</code> 当回滚 — 这是停机，不是回滚</li><li>ssh 进 pod 删数据 — 用迁移脚本走标准流程</li><li>回滚后不修代码 — 坏代码还在 main，下次再部署就再炸</li></ul></div></div></div>
