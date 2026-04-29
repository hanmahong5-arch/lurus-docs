---
title: 事故响应总则
lastReviewed: 2026-04-28
owner: marvin
---

# 事故响应总则

> 当前 bus factor = 1，事故响应只有 marvin 一个人。
> 所有 SOP 必须**一个人能在 10 分钟内执行完毕**。

## 事故分级

| 级别 | 定义 | 响应时间 | 沟通方式 |
|---|---|---|---|
| **S0** | 多个生产服务全挂 / 资金损失风险 / 数据丢失 | 即刻 | 立即处理 |
| **S1** | 单个 P0 服务全挂（platform / newapi / memx / docs） | 15 分钟 | 立即处理 |
| **S2** | P1 服务部分挂 / 显著降级 | 1 小时 | 营业时间处理 |
| **S3** | P2 服务挂 / 单功能挂 | 24 小时 | 排队 |

## 响应顺序（铁律）

```
1. 止血        ← 最先做
2. 沟通受影响方  ← 第二
3. 找根因      ← 第三
4. 修复并验证   ← 第四
5. 复盘        ← 第五（48 小时内）
```

**先止血**：能回滚就回滚，能切流量就切；不要在生产现场调试。

## 第一手命令（遇到事故先跑这些）

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
curl -sS -o /dev/null -w 'auth=%{http_code}\n' https://auth.lurus.cn/.well-known/openid-configuration
```

## 常见症状速查

| 症状 | 第一反应 |
|---|---|
| 多个服务 502/504 | Traefik / cert / 集群 networking |
| 单服务 OOM 反复 restart | resources.limits 不够 / 内存泄漏 |
| ArgoCD app OutOfSync 红 | manifest 改坏 → 回滚最近一次提交 |
| pod ImagePullBackOff | GHCR 拉镜像问题（见下） |
| 钱包扣款异常 | platform billing schema → 立刻只读 |
| Zitadel 登录死循环 | OIDC redirect_uri / cookie domain |

### GHCR 拉镜像失败

R1 K3s 用了 containerd mirror。如果 mirror 挂或新镜像没推上：

```bash
ssh root@100.98.57.55 "kubectl describe pod -n <ns> <pod> | grep -A5 Events"
# 找 "Failed to pull image"

# 手动测试拉
ssh root@100.98.57.55 "ctr -n k8s.io images pull ghcr.io/hanmahong5-arch/<service>:main-<sha>"
```

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

模板见 `internal/postmortems/_template.md`。

复盘必须有：
1. 时间线（谁/几点/做了什么 — 不裁剪自己犯错的部分）
2. 根因（5 Whys）
3. 修复
4. 预防：3 类（监控 / 自动化 / 流程）至少各 1 条

## bus factor = 1 的兜底

只有 marvin 在的当下，必须有"marvin 失联"应急路径：

- 关键凭证（Tailscale auth key / Zitadel admin / GHCR PAT / SSH key）写一份在密码管理器，配偶 / 信任的合作者掌握主密码
- 三丰云 / 阿里云控制台账号有备用人员可登录
- 这份 internal docs 是非 marvin 上手的入口
