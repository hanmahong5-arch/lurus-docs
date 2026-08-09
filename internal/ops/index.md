---
title: 运维 SOP 索引
lastReviewed: 2026-04-28
owner: marvin
---

# 运维 SOP

> 运维知识衰减极快。每条 SOP 写完都标 `lastReviewed`，超过 90 天首页飘黄。
> 改完即跑一次"按手册操作"演练，命令对不上立即修文档。

## 部署 / 回滚

- [部署到 R1（生产）](./deploy-r1)
- [部署到 R6（staging / 多租户）](./deploy-r6)
- [回滚（ArgoCD / 手工 image tag）](./rollback)

## 数据 / 存储

- [PostgreSQL 备份与恢复](./db-backup)
- [Postgres 操作（CNPG / 容灾 / 切主）](./postgres)
- [Redis / NATS 排障](./redis-nats)
- [MinIO 对象存储](./minio)

## 安全 / 配置

- [密钥轮换](./key-rotation)
- [证书管理（`lurus-cn-wildcard-tls`）](./cert)
- [DNS 管理（三丰云 + 阿里云 + Cloudflare）](./dns)

## 可观测性

- [可观测性（Netdata 自托管）](./observability) — 2026-06-05 起替代 Prometheus/Grafana/Alertmanager 观测栈

## 应急

- [事故响应总则](./incident-response)

## 检查表（每月例行）

- [ ] R1 / R6 磁盘 < 80%（`df -h`）
- [ ] 证书剩余有效期 > 30 天
- [ ] PG 备份最近一次成功（MinIO `pg-backups-v2`）
- [ ] Casdoor 服务正常（identity.lurus.cn）
- [ ] ICP 备案有效性
- [ ] 三丰云 / 阿里云余额 > 30 天
- [ ] 各产品 lastReviewed < 90 天
