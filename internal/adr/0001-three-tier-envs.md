---
adr: 0001
title: PROD / STAGE / DEV 三层环境划分
status: accepted
date: 2026-04-24
---

# ADR-0001: PROD / STAGE / DEV 三层环境划分

## 背景

2026 年 4 月，R1（cloud-ubuntu-1, 16C/32G）已经承担：
- 已交付客户的商业服务（miaoda-oa、tally）
- 还在迭代但被外部使用的服务（newapi、memorus、www、docs）
- 仍在测试的服务（platform、zitadel、lucrum、lutu）

混在一台机器上的后果：
- 一次重启 PG → 所有客户感知
- 一次 lucrum 内存泄漏 → 把 R1 内存吃光，docs 也 502
- 资源容量预测不可能（生产 + 实验混在一起）

R1 内存利用率长期 70%+，没缓冲。

## 备选方案

### A. 把所有 R1 上跑的也都迁到 R6 一起
- 优势：成本低、单机管理简单
- 劣势：R6 是 32C/32G/三丰云，公网 50Mbps，但运维心智仍是单点故障 + 无环境分级
- 拒绝：解决不了"测试服务 OOM 影响生产服务"的根本问题

### B. 引入第三台云机做 STAGE
- 优势：标准做法
- 劣势：成本翻倍；当前阶段（公司规模 2-5 人）不值得
- 拒绝：成本/收益不平衡

### C. 三层划分但复用现有机器
- 优势：用 R1 + R6 + 已有 R3（小机器）三层逻辑分离
- 劣势：增加部署心智复杂度
- 接受：与公司当前规模匹配

## 决定

引入 **PROD / STAGE / DEV** 三层模型：

| 层 | 机器 | 准入 |
|---|---|---|
| PROD | R1 (43.226.46.164, 16C/32G) | 已对外商业交付 |
| STAGE | R6 (43.226.38.244, 32C/32G) | 达测试标准但未交付客户 |
| DEV | R3 (100.113.79.77) + 任意 | 活跃 feature 开发 |

不变量：
- PROD 只放"客户面向的 + 完全在生产的公司工作负载"
- 非稳定服务（Lutu、Lucrum、newapi 重写、Tally pre-GA）住 STAGE
- 活跃 feature 开发用 PROD 集群中的 DEV 节点（nodeSelector 隔离）

## 理由

1. **成本零增加** — 复用已有机器，不开新云
2. **失败隔离** — STAGE 服务挂掉不再波及 PROD（不同 IP / 不同 Tailscale 段 / 不同 K3s 集群）
3. **明确准入门槛** — 新服务上 PROD 要先在 STAGE 跑 30 天，0 数据事故，5+ 真实用户验证
4. **跟上司汇报清晰** — 容量分析按层做（PROD 70% 触发扩容，STAGE 80% 触发清理）

## 后果

正面：
- 客户感知稳定性显著提高
- 测试可以更激进（不怕在 STAGE 故意搞坏）

负面：
- 跨层迁移流程要写清楚（见 [deploy-r1.md](../ops/deploy-r1) / [deploy-r6.md](../ops/deploy-r6)）
- DNS 切流量在事故时是 R1 → R6，路径未演练
- 三层让"DevOps as one-person job"更难

后续重评估触发：
- 公司 ≥ 5 人 → 考虑 RDS / 云 K8s / 标准 SaaS
- 客户支付总额 > 30 万/月 → 考虑专用云资源池

## 参考

- `lurus.yaml` `environments:` 节
- `doc/decisions/three-tier-envs.md`（本 ADR 在公司治理 repo 的镜像）
- 触发本决策的事故：2026-04-23 lucrum 内存泄漏导致 docs.lurus.cn 502 7 分钟
