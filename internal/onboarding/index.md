---
title: 入职 7 天指引
lastReviewed: 2026-04-28
owner: marvin
---

# Lurus 入职 7 天指引

> 给新员工的 onboarding。前 7 天目标：能登录所有内部系统、看懂全局架构、跑通一次小改动从本地到 STAGE。

## Day 0（入职前一天）

由现有员工准备：

- [ ] Zitadel 加用户到 `lurus-staff` 组
- [ ] Tailscale 邀请到 `lurus.cn` 网络
- [ ] GitHub 加到 `hanmahong5-arch` org（read 权限）
- [ ] 邮箱 `<name>@lurus.cn`（自动 provision via Stalwart）
- [ ] Cloudflare DNS / 三丰云 / 阿里云控制台 — 视职责给只读 IAM
- [ ] 1 Password / Bitwarden 共享 vault 邀请

## Day 1：环境就绪

目标：能进所有公司基础设施。

### 检查清单

- [ ] 公司邮箱可收发（`<name>@lurus.cn`）
- [ ] Zitadel 登录通：访问 `auth.lurus.cn` 应能用公司邮箱登录
- [ ] 用 Zitadel 单点登录 `admin.lurus.cn` / `forge.lurus.cn` / `internal.lurus.cn`（本站）
- [ ] Tailscale 装好：`100.122.83.20`（R6）和 `100.98.57.55`（R1 master，read 权限可 ping）能访问
- [ ] GitHub 二次验证 + SSH key 已绑定
- [ ] 本地装好 Bun（**禁用 npm/yarn**）、Go 1.25、Rust stable、Python 3.12

### 装机

```bash
# Windows / WSL2 / macOS / Linux 通用
# 1. Bun
curl -fsSL https://bun.sh/install | bash

# 2. Go
# 直接下 go1.25 安装包

# 3. Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 4. 装 git client + GitHub CLI (gh)
gh auth login

# 5. 克隆 governance repo（不是单个 service）
mkdir -p ~/lurus && cd ~/lurus
git clone git@github.com:hanmahong5-arch/lurus.git .

# governance repo 的 .gitignore 把所有 service 都排除了
# service 各自独立 clone：
git clone git@github.com:hanmahong5-arch/lurus-platform.git 2l-svc-platform
git clone git@github.com:hanmahong5-arch/lurus-newapi.git 2b-svc-newapi
# ... 按职责再 clone 其他
```

### 第一手阅读

按顺序读完（6-8 小时）：

1. `~/lurus/CLAUDE.md` — 公司治理 / 命名 / 架构总则
2. `~/lurus/lurus.yaml` — 整个公司架构在一个 YAML 里
3. `internal.lurus.cn`（本站）"驾驶舱" — 一屏看完产品 / 服务器 / 风险
4. `internal.lurus.cn/products/&lt;你负责的&gt;` — 你的产品手册

## Day 2：读代码

目标：能看懂分配给你的产品的代码组织。

- [ ] 进对应 service 目录，读 `CLAUDE.md` + `README.md`
- [ ] 读入口文件 + 路由 + 主要业务模块（按本站对应产品手册的"代码地图"逐文件浏览）
- [ ] 跑通本地：`bun run dev` / `go run ./cmd/...` / `cargo run`
- [ ] 找 1 个 README 里没说但你疑惑的事 → 写下来，问 marvin

## Day 3：跑通本地 → STAGE

目标：把"只改一个标点的 PR"从本地推到 R6。

### 任务

1. 在你负责的 service 改一个无关紧要的字符串（README typo / 文案 / log 一句话）
2. 本地跑通 lint + build + test
3. push 到 main（小改 + 你 review 自己 + 直接 push；大改才走 PR）
4. CI 全绿（GHA workflow）
5. 镜像出现在 GHCR
6. ArgoCD 同步到 R1（如果是 PROD 服务）/ docker compose redeploy 到 R6（如果是 STAGE 服务）
7. 浏览器 / curl 验证生效

如果第 6 步卡住：读 [ops/deploy-r1.md](../ops/deploy-r1) / [ops/deploy-r6.md](../ops/deploy-r6)，跑 `kubectl get pods` 自己排障。**不要直接问 marvin**，先排障再问。

## Day 4：跨产品认知

目标：理解产品间依赖。

- [ ] 看本站 "产品依赖图谱"（首页）
- [ ] 重点理解：identity / billing / llm-inference / memory 4 大 capability 怎么实现
- [ ] 读 `lurus.yaml capabilities` 节
- [ ] 至少读完 platform / newapi 两个产品的内部手册（即使不是你负责的）

## Day 5：运维基础

- [ ] 读完 [ops/](../ops/) 所有 SOP（重点：incident-response / deploy / rollback）
- [ ] 跑通：`ssh root@100.98.57.55 "kubectl get pods -A"`
- [ ] 跑通：`ssh root@100.122.83.20 "docker ps"`
- [ ] 看一次 grafana.lurus.cn 监控
- [ ] 看一次 argocd.lurus.cn

## Day 6：值班 shadow

- [ ] 当天与 marvin 值班一起，处理任何线上事件 / 维护操作 / 客户反馈
- [ ] 不主动操作生产，**观察**为主
- [ ] 学习"先沟通再动手"的节奏

## Day 7：你的第一个 issue

- [ ] 在你负责的产品挑一个"已知坑"（产品手册里有列）
- [ ] 写设计草稿（写在 `<service>/_bmad-output/` 或 PR description）
- [ ] marvin review 后开始动手

## 入职后 30 天

- 期望产出：1 个完整功能 / 1 次 PR review / 1 个 SOP 改进
- 检查：你的产品手册能不能加你的名字进 owner？bus factor 能否提到 2？

## 离职 checklist

为防止有一天用得上：

- [ ] 移交对应产品的 owner
- [ ] 文档里你的名字替换为新 owner
- [ ] Zitadel 移除 `lurus-staff` 组
- [ ] GitHub 移除 org
- [ ] Tailscale 移除节点 + 自动注销 device
- [ ] 邮箱保留 30 天 forwarding 后归档
- [ ] 所有共享凭证（vault / cloud console）revoke 你的访问

## 求助

- 阻塞 > 30 分钟 → marvin
- 深夜事故 → marvin
- 文档说错 → 改本站，PR 自己提
