---
title: Forge × Kova × Lumen 联测
description: 三仓单一入口与带日期的实测账本。编排腿可复现；全链路证据依赖 LLM 余额。
---

# Forge × Kova × Lumen 联测

**口头一句**：Forge 编排 · Kova 证明 · Lumen 看见。

钉子句：在不能出错、不能出境、必须举证的场景里，Agent 跑过的每一步都能被第三方离线核验——且可部署在你自己的机器上。

本页是**公开可读的联测账本入口**。操作命令在产品仓：`bash scripts/triple.sh`（权威说明见仓内 `docs/kova/TRIPLE.md`）。典型应用故事见仓内客户页 `docs/customer/SCENARIO-OPS-HITL.zh-CN.md`（受托运维写操作闸；Switch 仅故事轻挂）。

<div class="lurus-callout lurus-callout--key">
  <div>
    <p class="lurus-callout__title">最近实测 · 2026-10-28（UTC，两次；第二次 08:26Z）</p>
    <div class="lurus-callout__body">
      编排腿两次复现绿；举证腿仍红。<br/>
      <strong>已绿</strong>：静态契约门 · Forge→Kova 鉴权 · agent 列表 · run enqueue。<br/>
      <strong>未完成</strong>：真 LLM 轨迹（newapi <code>402 Insufficient Balance</code>）→ Lumen / 签名证据包顺延。<br/>
      失败不粉饰：无 <code>trace_id</code> 时脚本响亮停止；<code>SKIP=77</code> 永不报 PASS。受托运维场景故事见仓内 <code>SCENARIO-OPS-HITL.zh-CN.md</code>。
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
bash scripts/triple.sh status    # git · OpenAPI · 二进制 · env · 活体 · last-run · NEXT
bash scripts/triple.sh check     # 静态；无 Forge 仓 → 77
bash scripts/triple.sh sync      # OpenAPI drift 时唯一合法修法
bash scripts/triple.sh run       # Demo Day joint；写 last-run 标记
```

Forge 仓等价：`bash tests/joint/forge-kova-lumen-fundraise.sh`。  
Lumen 仓：读 [Connected 路径](/lumen/integration) 后回指 `TRIPLE.md`。

## 2026-10-28 腿表（摘要）

| 腿 | 结果 |
|----|------|
| OpenAPI 逐字节 / 入口互指 | PASS |
| Kova `/status` `/health` | PASS |
| Forge alembic + `/docs`（含孤儿端口清理） | PASS |
| 独立租户 JWT + `GET /agents` 真列表 | PASS |
| 直建 agent + Forge enqueue | PASS |
| 等到终态 | `failed` / `trace_id=unknown`（402） |
| Forge 读回 / Lumen / evidence | 未跑（硬停） |

完整技术账本在产品仓：`docs/kova/runs/2026-10-28-triple-joint.md`；客户摘要：`docs/customer/TRIPLE-VERIFY.zh-CN.md`。

## 诚实边界

- **HTML ≠ 证据包**：Lumen 是可读轨迹；可验证证据包走 Kova `evidence` CLI（Ed25519；可选锚点另见证据文档）。
- **at-least-once**：崩溃窗口可能重做一步；写操作需调用方幂等。
- 本页在 LLM 余额恢复并**重跑成功**前，不得改写成「全链路已绿」。

## 相关

- [Kova 简介](/kova/) · [快速开始](/kova/quickstart) · [API](/kova/api)
- [Forge](/forge/) · [Lumen](/lumen/) · [教程：Lumen × LangGraph × Kova](/tutorials/lumen-kova-langgraph)
