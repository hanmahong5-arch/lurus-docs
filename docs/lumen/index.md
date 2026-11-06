---
title: Lumen — Agent 失败与烧钱的黑匣子
description: 本地优先的 replay / cost / 崩溃续跑。Alpha。不是 Agent 运行时。
---

<div class="lumen-page">

<ProductHero product-id="lumen" />

<div class="lurus-callout lurus-callout--warning">
  <span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Alpha — 诚实边界</p>
    <div class="lurus-callout__body">
      <ul>
        <li><strong>不是</strong> Agent 运行时 — Lumen 不跑、不部署、不托管 Agent。</li>
        <li><strong>不是</strong> 通用观测平台 — 卖的是可转发的事故 lifecycle（钱 × 拒绝 × 续跑）。</li>
        <li>Python 导入名是 <code>lumen</code>（PyPI 名 <code>lumen-ai</code>）。禁止 <code>cargo install lumen-cli</code>（crates.io 无关第三方包）。</li>
        <li>Kova 是可选加深（Connected）。Core 仅靠本地 trace JSON 即可用。</li>
      </ul>
    </div>
  </div>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="check-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">前置条件</p>
    <div class="lurus-callout__body">
      <ul>
        <li>SDK：Python 3.10+</li>
        <li>可选 CLI：GitHub Release 二进制（无需 Rust）</li>
        <li>Core / <code>lumen demo</code> 不需要 Lurus API Key</li>
      </ul>
    </div>
  </div>
</div>

## 什么是 Lumen？

**Lumen** 是 Agent 失败与烧钱的黑匣子：打开一次运行，看哪步烧钱、哪步被拒、崩了怎么续。

交付：Python SDK（PyPI `lumen-ai`；未发布时从[源码仓](https://github.com/hanmahong5-arch/lumen)安装）+ Rust CLI/面板（`lumen`）。目前完整支持 LangGraph。

```python
from lumen.integrations.langgraph import LumenCheckpointer, LumenTracer

checkpointer = LumenCheckpointer(storage_dir="./checkpoints")
tracer = LumenTracer(trace_dir="./traces")
graph = workflow.compile(checkpointer=checkpointer)
graph.invoke(inputs, config={"callbacks": [tracer], "configurable": {"thread_id": "t1"}})
```

然后分享事故：

```bash
lumen export <trace-id>   # 自包含 lifecycle HTML
lumen cost --format md
lumen replay <trace-id>   # 零 LLM 花费
```

<DiagramFigure
  caption="两段式：你的代码照常直接调模型服务商，Python SDK 把 trace 写成磁盘 JSON；Rust CLI/core 事后读文件做重放、算成本、渲染面板。Lumen 自己从不代你调模型。"
  source="2c-cli-lumen · 与仓库 README 同一张图">
  <LumenArchitecture />
</DiagramFigure>

---

## 核心能力

| 能力 | 是什么 | 不是什么 |
|------|------|------|
| **Replay** | 从 trace JSON 重建运行 | 再调 LLM / 在线 fork |
| **Cost** | 按 run/模型美元 + outlier | 计费网关 |
| **Crash resume** | LangGraph `LumenCheckpointer` + `resume_hint` | Kova WAL（那是 Kova） |
| **Lifecycle HTML** | `lumen demo` / `export` 可转发产物 | 托管 SaaS 控制台 |
| **Dashboard** | 本地读 `./traces`；Connected 需 Kova/Netdata | 第二个 Agent 控制面 |

---

## 安装

**CLI**（推荐）：

```bash
curl -fsSL https://raw.githubusercontent.com/hanmahong5-arch/lumen/main/docs/install-cli.sh | bash
export PATH="$HOME/.local/bin:$PATH"
lumen --version
lumen demo
```

Windows：`irm https://raw.githubusercontent.com/hanmahong5-arch/lumen/main/docs/install-cli.ps1 | iex`

**Python SDK** — PyPI 已通时：

```bash
pip install "lumen-ai[langgraph]"
```

否则从源码：

```bash
git clone https://github.com/hanmahong5-arch/lumen.git && cd lumen
pip install -e "./lumen-sdk[langgraph]"
```

---

## Core vs Connected

| 层 | 需要 | 得到 |
|---|---|---|
| **Core** | 仅本地 traces | replay / cost / lifecycle / Overview |
| **Connected** | `--kova-url` 和/或 `--netdata-url` | Flow、Terminal、Governor、live Metrics |

口头一句（Triple）：**Forge 编排 · Kova 证明 · Lumen 看见。**

---

## 与 Kova 的关系

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--lumen">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">Lumen</div>
    <p class="lurus-card__body">读面 — 本地 trace → replay / cost / lifecycle HTML / dashboard。不跑 Agent 循环。</p>
  </div>
  <div class="lurus-card lurus-card--kova">
    <span class="lurus-card__icon"><Icon name="bot" :size="20" /></span>
    <div class="lurus-card__title">Kova</div>
    <p class="lurus-card__body">持久执行引擎 — WAL、恢复深度、REST。Connected 代理 Kova，不替代它。</p>
  </div>
</div>

---

## 相关页面

<NextSteps
  :steps="[
    { text: '快速开始', link: '/lumen/quickstart', primary: true },
    { text: 'Python SDK', link: '/lumen/python-sdk' },
    { text: 'CLI 手册', link: '/lumen/cli' },
    { text: '集成', link: '/lumen/integration' },
  ]"
  title="下一步"
/>

<RelatedProducts product-id="lumen" />

</div>
