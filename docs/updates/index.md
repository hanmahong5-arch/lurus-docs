---
layout: page
title: 产品动态
description: Lurus 产品矩阵最新动态与里程碑
---

# 产品动态

追踪 Lurus 全产品线的最新变更、功能发布和技术里程碑。

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
- 回测引擎 Decimal.js 全精度重写，680+ 单元测试
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
- 8 大视频平台 URL 正则校验

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
