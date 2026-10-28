---
title: Forge × Kova × Lumen 联测
description: 三仓单一入口与带日期的实测账本。融资门可全绿（mock LLM）；真供应商轨迹另记。
---

# Forge × Kova × Lumen 联测

**口头一句**：Forge 编排 · Kova 证明 · Lumen 看见。

钉子句：在不能出错、不能出境、必须举证的场景里，Agent 跑过的每一步都能被第三方离线核验——且可部署在你自己的机器上。

本页是**公开可读的联测账本入口**。操作命令在产品仓：`bash scripts/triple.sh`（权威说明见仓内 `docs/kova/TRIPLE.md`）。典型应用故事见仓内客户页 `docs/customer/SCENARIO-OPS-HITL.zh-CN.md`（受托运维写操作闸；Switch 仅故事轻挂）。

<div class="lurus-callout lurus-callout--key">
  <div>
    <p class="lurus-callout__title">最近实测 · 2026-10-28（融资门，含稳定签发钥再跑）</p>
    <div class="lurus-callout__body">
      <strong>全绿</strong>（<code>JOINT_MOCK_LLM=1</code>）：24 PASS，含 LEG7 kill-9 + LEG8 钉钥 <code>Signature: VERIFIED</code>。<br/>
      签发公钥稳定复用（仓内 <code>docs/customer/joint-fundraise.pub</code>；私钥仅本机 artifacts）。<br/>
      Demo Day 翻页胶片：产品仓 <code>docs/customer/demo-reel/joint-day.html</code>。<br/>
      <strong>诚实边界</strong>：mock ≠ 付费模型；去掉 mock 且未充值时仍会 402（同日 a/b 红账本保留）。
    </div>
  </div>
</div>

## 三层各干什么

| 层 | 角色 | 联测断言 |
|----|------|---------|
| **Forge** | 编排与租户面 | JWT + API Key 代理 `GET/POST /api/kova/...` |
| **Kova** | 持久执行与证明 | agent run、WAL、崩溃恢复、`evidence` 签名包 |
| **Lumen** | 看见 | 离线 lifecycle HTML（**≠** 证据包） |

## 操作员入口（单一）

```bash
# 在 2b-svc-kova 仓根（WSL 优先）
bash scripts/triple.sh status              # git · OpenAPI · 二进制 · env · 活体 · last-run · NEXT
bash scripts/triple.sh check               # 静态；无 Forge 仓 → 77
JOINT_MOCK_LLM=1 bash scripts/triple.sh run  # 融资门 / Demo（不依赖供应商余额）
bash scripts/triple.sh run                 # 真 LLM（需余额）
```

Forge 仓等价：`bash tests/joint/forge-kova-lumen-fundraise.sh`（证据钥默认复用 `artifacts/issuer`）。  
Lumen 仓：读 [Connected 路径](/lumen/integration) 后回指 `TRIPLE.md`。  
客户验签卡（目录包）：产品仓 `docs/customer/JOINT-VERIFY-CARD.zh-CN.md`。

## 2026-10-28c 腿表（摘要）

| 腿 | 结果 |
|----|------|
| OpenAPI 逐字节 / 入口互指 | PASS |
| Kova `/status` `/health` | PASS |
| Forge alembic + `/docs` | PASS |
| 独立租户 JWT + `GET /agents` | PASS |
| 直建 agent + Forge enqueue | PASS |
| 等到终态（mock LLM） | PASS |
| Lumen lifecycle HTML | present |
| evidence pack + 钉钥验签 | VERIFIED |

完整技术账本在产品仓：`docs/kova/runs/2026-10-28c-triple-joint.md`；客户摘要：`docs/customer/TRIPLE-VERIFY.zh-CN.md`。同日 402 红账本保留为 a/b。

## 诚实边界

- **HTML ≠ 证据包**：Lumen 是可读轨迹；可验证证据包走 Kova `evidence` CLI（Ed25519；可选锚点另见证据文档）。
- **mock ≠ 真模型**：融资门全绿证明链路；不证明供应商付费回答。
- **at-least-once**：崩溃窗口可能重做一步；写操作需调用方幂等。
- **SKIP ≠ PASS**：外部依赖不可达时报 77，从不粉饰。

## 相关

- [Kova 简介](/kova/) · [快速开始](/kova/quickstart) · [API](/kova/api)
- [Forge](/forge/) · [Lumen](/lumen/) · [教程：Lumen × LangGraph × Kova](/tutorials/lumen-kova-langgraph)
