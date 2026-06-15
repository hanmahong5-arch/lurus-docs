---
title: Forge 快速入门
description: 5 分钟跑通 Forge 第一个 AI Agent workflow — register → 看 seed → 跑 workflow → 审批 → 看 eval 评分。
---

<div class="forge-gs-page">

# Forge 快速入门 <StatusBadge status="beta" />

5 分钟跑通你的第一个 AI Agent workflow。本文配合 Beta 邀请使用 —— 注册即送示例 dataset / rubric / workflow，跟着 5 步走完一遍就知道 Forge 长什么样。

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="users" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Beta 范围</p>
    <div class="lurus-callout__body">当前是受邀内测，10-15 个早期用户。试用反馈请见本文末 <a href="#§5-遇到问题怎么办">§5 遇到问题怎么办</a>。</div>
  </div>
</div>

---

## §1 30 秒认识 Forge

AI Agent 工作台：浏览器里**画 / 跑 / 评估** Agent 工作流，**崩溃自动续跑，不重复花 LLM token**。

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="history" :size="20" /></span>
    <div class="lurus-card__title">WAL-first 持久执行</div>
    <p class="lurus-card__body">底层 <a href="/kova/">Kova</a>（Rust 持久执行引擎，崩溃恢复——不是 checkpoint，每个 LLM Directive 都落盘）。</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="package" :size="20" /></span>
    <div class="lurus-card__title">零外部依赖</div>
    <p class="lurus-card__body">运行时单二进制 + 单 WAL 文件，无需 Kafka / Redis / Cassandra。</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="shuffle" :size="20" /></span>
    <div class="lurus-card__title">OpenAI 兼容网关</div>
    <p class="lurus-card__body">LLM 经 <a href="https://newapi.lurus.cn">newapi 网关</a>，可切 OpenAI / Anthropic / DeepSeek / 通义 / GLM。</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">每步可审计</div>
    <p class="lurus-card__body">每次步骤和人工审批签名落盘，满足 EU AI Act + GB/T 信创。</p>
  </div>
</div>

---

## §2 跑第一个 workflow

::: tip 前置条件
已收到 Beta 邀请并在 `forge.lurus.cn` 完成注册登录。
:::

<ol class="lurus-steps">
<li>

打开 [`/workflows/runs`](https://forge.lurus.cn/workflows/runs)，点 **"启动新 run"**。

</li>
<li>

选 seed 的 `classify_then_route_v1`，输入框填中文（如 `今天上海天气怎么样`），点 **Start**。

</li>
<li>

页面跳转 `/workflows/runs/[id]`，timeline 卡片实时刷新（`passthrough → llm_call → branch → leaf` 四步）。**预期 &lt; 30 秒**（newapi.lurus.cn 在线时）。

</li>
</ol>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">LLM 慢 / 失败</p>
    <div class="lurus-callout__body">LLM 超时 / 失败时 run 状态变 <code>failed</code> 并显示错误——这是 Kova WAL 崩溃恢复在工作，后续可 resume 不重跑前面步骤。</div>
  </div>
</div>

---

## §3 中间审批节点（HITL）

workflow 含 `await_input` step（如"高风险操作前请审批"模板）时：

<ol class="lurus-steps">
<li>

跑到该步暂停，状态变 `AwaitingInput`。

</li>
<li>

[`/approvals`](https://forge.lurus.cn/approvals) 看到一行待审（标题是该 step 的 prompt）。

</li>
<li>

点 **"Review"**，选 Approve / Reject / Edit 提交，workflow 自动续跑。

</li>
</ol>

审批决策写进 WAL **永久可追溯**，刷新 / 关 tab 不丢状态。

```mermaid
sequenceDiagram
    participant U as 你 (操作员)
    participant F as Forge UI
    participant K as Kova 引擎
    participant W as WAL 文件

    U->>F: 启动 workflow
    F->>K: POST /workflows/start
    K->>W: 写 WorkflowStart (event=37)
    loop 每步
        K->>W: 写 StepCheckpoint
    end
    K->>W: 写 WorkflowAwaitInput (event=38)
    K-->>F: 状态 = AwaitingInput
    F-->>U: /approvals 出现一行待审
    U->>F: 点 Approve
    F->>K: POST /workflows/:id/resume
    K->>W: 写 WorkflowInputReceived (event=39)
    K->>W: 继续 StepCheckpoint
    K-->>F: 状态 = Completed
```

---

## §4 评分（Eval）一个 run

<ol class="lurus-steps">
<li>

打开 [`/eval`](https://forge.lurus.cn/eval) → **Rubrics** tab，选 seed 的 `Sample rubric (PII)` 或自建。

</li>
<li>

切到 **Runs**，关联刚跑完的 `workflow_id`。

</li>
<li>

点 **Score**，后台跑 scorer，看每条 criterion 的分数 + 解释。

</li>
</ol>

**可用的 scorer 类型**

| 类型 | 用途 | 配置 |
|---|---|---|
| `pii_regex` | 检测 LLM 输出里有没有泄露身份证 / 手机号 / 邮箱 | 写正则 pattern |
| `json_schema` | 检查输出符合 JSON schema（结构化生成场景） | 贴 JSON schema |
| `llm_as_judge` | 让另一个 LLM 给主 LLM 输出打分 | 写 judge prompt + 选 model + temperature |
| `semantic_similarity` | （WIP，暂不可用 —— embedding service 还在搭） | — |

---

## §5 遇到问题怎么办

<details class="lurus-faq-item">
<summary>workflow 一直 Running 不动？</summary>

多半是 LLM 网关超时（30 s）。看 `/workflows/runs/[id]` timeline 卡片最后一步是什么；如果是 `llm_call`，等或者 cancel run 后重试。

</details>

<details class="lurus-faq-item">
<summary>403 You do not have permission？</summary>

你在试图操作别人的 approval。只有发起人本人或同 `tenant_id` 才能决策 —— 找发起人。

</details>

<details class="lurus-faq-item">
<summary>404 Approval not found？</summary>

approval 已被 cancel 或终态。找发起人确认；终态不可改。

</details>

<details class="lurus-faq-item">
<summary><code>/workflows/runs</code> 一直 loading？</summary>

`kova_proxy` 连不上 kova-rest。检查 [`/api/health`](https://forge.lurus.cn/api/health)，看第二段 `kova_rest` 是否 ok。

</details>

<details class="lurus-faq-item">
<summary>中文显示乱码 / 没翻译？</summary>

i18n key 缺。反馈 + 截图（见 [§6 反馈](#§6-反馈)）。

</details>

---

## §6 反馈 {#§6-反馈}

发现 bug、想要新功能、想跟我们 30 分钟聊聊使用场景：

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="pen-tool" :size="20" /></span>
    <div class="lurus-card__title">Typeform 表单</div>
    <p class="lurus-card__body">嵌入在 <code>/settings</code> 页底——30 秒填完，对外部用户最快。</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
    <div class="lurus-card__title">Discord</div>
    <p class="lurus-card__body">邀请链接见 footer，开发者向用户首选。</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="mail" :size="20" /></span>
    <div class="lurus-card__title">邮件</div>
    <p class="lurus-card__body"><code>forge-beta@lurus.cn</code>，24h 内回复 SLA。</p>
  </div>
</div>

Beta 期间所有反馈直接进 roadmap。期待你的使用。

---

<NextSteps
  title="接下来"
  :steps="[
    { text: 'Forge 介绍页 — 在 Lurus 平台中的定位', link: '/forge/', primary: true },
    { text: 'Kova 引擎文档 — 底层持久执行引擎细节', link: '/kova/' },
    { text: 'Forge Roadmap — 接下来要做的事', link: '/forge/roadmap' },
  ]"
/>

---

*最后更新: 2026-05-12 | 配套 Beta 邀请 playbook: `2b-bs-forge/docs/beta-invite-playbook.md`*

</div>
