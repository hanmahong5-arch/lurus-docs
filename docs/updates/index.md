---
layout: page
title: 产品动态
description: Lurus 产品矩阵最新动态与里程碑
---

# 产品动态

追踪 Lurus 全产品线的最新变更、功能发布和技术里程碑。

---

## 2026 年 5 月

### Platform — identity.lurus.cn 账号控制台全量上线 <StatusBadge status="live" />

- 统一账号控制台在 `identity.lurus.cn` 全量上线（R1 生产环境，服务运行正常）
- 自助页面：账户与安全 [/account](https://identity.lurus.cn/account) · 鹿贝钱包 [/wallet](https://identity.lurus.cn/wallet) · 订阅计划 [/subscriptions](https://identity.lurus.cn/subscriptions) · 充值 [/topup](https://identity.lurus.cn/topup) · 兑换码 [/redeem](https://identity.lurus.cn/redeem)

### 账号入口统一收敛到 identity.lurus.cn <StatusBadge status="live" />

- 所有账号 / 计费 / 订阅的自助操作统一收敛到 `identity.lurus.cn` 控制台；**原 `admin.lurus.cn` 入口已退役**，请改用下列新路径：
  - 管理账号 / 改密码 / 安全设置 → [identity.lurus.cn/account](https://identity.lurus.cn/account)
  - 忘记密码 → [identity.lurus.cn/forgot-password](https://identity.lurus.cn/forgot-password)
  - 钱包余额 / 收支记录 → [identity.lurus.cn/wallet](https://identity.lurus.cn/wallet)
  - 订阅 / 变更套餐 / 定价 → [identity.lurus.cn/subscriptions](https://identity.lurus.cn/subscriptions)
- 企业组织的成员 / 权限 / 审计经 [auth.lurus.cn](https://auth.lurus.cn)（Zitadel）组织控制台管理

### Lucrum — 定价页上线 <StatusBadge status="live" />

- Lucrum 定价页 [lucrum.lurus.cn/pricing](https://lucrum.lurus.cn/pricing) 上线，订阅层级与配额一目了然（产品当前处于公测 / beta 阶段）

### LLM 网关 — 向多租户 Hub 演进 <StatusBadge status="dev" />

- LLM 网关正从 `newapi.lurus.cn` 向多租户 Hub（`hub.lurus.cn`）演进，强化统一计费与租户隔离；**当前调用方式与地址不变**，迁移完成后会提供更细的用量与配额视图

---

## 2026 年 4 月

### 文档站 — 全站文档准确性审计 <StatusBadge status="live" />

- 对齐所有产品线真实现状（代码基准 vs 宣传文案）
- Kova：LoC 从 15.2 万更新为 17.8 万（21 个 workspace crate），协议修正为 SDK/gRPC/REST/MCP 四种
- Lucrum：测试口径从"680+ 单元测试"调整为"3000+ Vitest 测试用例"
- Switch / Creator：明确支持的具体工具与平台边界
- Forge：正式标注内测阶段，功能描述与代码实现对齐
- 清理 gushen/ 遗留目录（Lucrum 品牌切换残留）

---

## 2026 年 3 月

### Kova — 崩溃恢复可靠性冲刺 <StatusBadge status="dev" />

- WAL `AgentDirectivePayload` 支持 `assistant_content` 序列化，崩溃后不重新调用 LLM
- 增量 checkpoint hash 校验不一致时自动回退到最近全量 checkpoint
- `hash_messages()` 改用长度前缀字段，防止边界混淆碰撞
- 新增 7 个 UAT 崩溃恢复测试 (UAT-001 ~ 007)，全部通过
- **kova-memory** crate 发布 — 通过 `MemoryProvider` trait 桥接 Kova Agent 与 MemX 记忆引擎

### Lurus API — 契约优先架构升级 <StatusBadge status="live" />

- `lurus.yaml` 新增 `capabilities:` 注册表 — 7 大能力（identity, billing, llm-inference, memory, agent-execution, notification, auth）
- `lurus-proto-go` 独立为 standalone Go module，解耦 API 与 Platform 的 go.mod 依赖
- Platform OpenAPI 规范发布 (`api/openapi.yaml`，1000+ 行，50+ endpoints)
- MemX OpenAPI 规范发布 (7 endpoints, X-API-Key auth)

### Lucrum — 7 个 Epic 全部完成 <StatusBadge status="live" />

- AI 策略生成器：自然语言描述 → vnpy CtaTemplate 策略代码
- 回测引擎 Decimal.js 全精度重写，3000+ 前端测试用例（Vitest）
- 11 个 AI 投资顾问 Agent 上线（巴菲特/彼得林奇/利弗莫尔/西蒙斯 4 大师视角）
- 批量多股并行回测 + PDF 专业报告导出
- WCAG 2.1 AA 无障碍审计通过

### Platform — 全栈可观测性上线 <StatusBadge status="live" />

- OTel Collector DaemonSet 4 节点部署，traces→Jaeger + metrics→Prometheus + logs→Loki
- SLO 仪表盘上线 (`slo-lurus-api` + `slo-platform`)
- 全平台 CI 流水线集成 Trivy 容器安全扫描

---

## 2026 年 2 月

### Switch — BMAD 完整规划完成 <StatusBadge status="dev" />

- PRD、Epics、Architecture 规划文档完成
- 32 个 Go 后端模块 + 20+ 前端页面开发完成
- 支持 Claude Code / Codex / Gemini CLI / PicoClaw / NullClaw 5 种 AI 工具配置管理

### Creator — 合并重写完成 <StatusBadge status="dev" />

- 三个项目 (lurus-bilinote + lurus-content + lurus-creator) 合并为一
- Content Pipeline (yt-dlp → Whisper → LLM) 完成
- Publisher 重写 (chromedp 替代 Python Playwright) 完成
- 多平台视频 URL 正则校验（B 站/YouTube/TikTok/抖音 等）

### Lutu — Flutter 客户端代码完成 <StatusBadge status="dev" />

- 12 个 Model + 10 个 Provider + 14 个 Screen 实现
- ProxyProvider 链式状态管理 + AuthAwareProvider mixin
- 双拦截器 Dio 架构（Auth + Retry）
- `flutter analyze` 零 issue，`flutter build apk --debug` 通过

---

## 基础设施

### 集群与部署

- K8s 5 节点混合云集群稳定运行
- ArgoCD GitOps 自动同步全服务
- Kyverno 策略引擎 + NetworkPolicy 命名空间隔离
- ResourceQuota + LimitRange 资源配额管理

### 安全

- Zitadel OIDC 统一身份认证
- 全站 TLS 1.3 + 通配符证书自动续期
- Trivy 容器扫描集成到所有 CI 流水线
- SM4-GCM 国密加密支持 (Kova)
