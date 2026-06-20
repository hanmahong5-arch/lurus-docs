---
title: "Forge Getting Started"
description: "Run your first Forge AI Agent workflow in 5 minutes — register → view the seed → run the workflow → approve → check the eval score."
---

<div class="forge-gs-page">

# Forge Getting Started <StatusBadge status="beta" />

Run your first AI Agent workflow in 5 minutes. This guide pairs with the Beta invite — registering grants you a sample dataset / rubric / workflow, so following these 5 steps gives you a feel for what Forge looks like.

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="users" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Beta Scope</p>
    <div class="lurus-callout__body">This is currently an invite-only private beta with 10-15 early users. For trial feedback, see <a href="#§5-遇到问题怎么办">§5 What to Do When You Hit a Problem</a> at the end of this guide.</div>
  </div>
</div>

---

## §1 Meet Forge in 30 Seconds

The AI Agent workbench: **draw / run / evaluate** Agent workflows in your browser, with **automatic crash resume that never re-spends LLM tokens**.

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="history" :size="20" /></span>
    <div class="lurus-card__title">WAL-first durable execution</div>
    <p class="lurus-card__body">Powered by <a href="/en/kova/">Kova</a> (the Rust durable execution engine, crash recovery — not checkpointing, every LLM Directive is persisted to disk).</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="package" :size="20" /></span>
    <div class="lurus-card__title">Zero external dependencies</div>
    <p class="lurus-card__body">A single runtime binary + a single WAL file, no Kafka / Redis / Cassandra required.</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="shuffle" :size="20" /></span>
    <div class="lurus-card__title">OpenAI-compatible gateway</div>
    <p class="lurus-card__body">LLMs go through the <a href="https://newapi.lurus.cn">newapi gateway</a>, switchable across OpenAI / Anthropic / DeepSeek / Tongyi / GLM.</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">Every step auditable</div>
    <p class="lurus-card__body">Every step and human approval signature is persisted to disk, meeting EU AI Act + GB/T compliance requirements.</p>
  </div>
</div>

---

## §2 Run Your First Workflow

::: tip Prerequisites
You have received a Beta invite and completed registration and login at `forge.lurus.cn`.
:::

<ol class="lurus-steps">
<li>

Open [`/workflows/runs`](https://forge.lurus.cn/workflows/runs) and click **"Start New Run"**.

</li>
<li>

Choose the seed `classify_then_route_v1`, type Chinese into the input box (e.g. `今天上海天气怎么样`), and click **Start**.

</li>
<li>

The page redirects to `/workflows/runs/[id]`, and the timeline cards refresh in real time (`passthrough → llm_call → branch → leaf`, four steps). **Expect &lt; 30 seconds** (when newapi.lurus.cn is online).

</li>
</ol>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">LLM slow / failed</p>
    <div class="lurus-callout__body">When the LLM times out / fails, the run status changes to <code>failed</code> and shows the error — this is Kova WAL crash recovery at work, and you can later resume without re-running the earlier steps.</div>
  </div>
</div>

---

## §3 Mid-Workflow Approval Node (HITL)

When a workflow contains an `await_input` step (such as the "request approval before high-risk operations" template):

<ol class="lurus-steps">
<li>

It pauses when it reaches that step, and the status changes to `AwaitingInput`.

</li>
<li>

[`/approvals`](https://forge.lurus.cn/approvals) shows a pending row (the title is that step's prompt).

</li>
<li>

Click **"Review"**, choose Approve / Reject / Edit and submit, and the workflow resumes automatically.

</li>
</ol>

The approval decision is written into the WAL and is **permanently traceable**; refreshing / closing the tab does not lose state.

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

## §4 Score (Eval) a Run

<ol class="lurus-steps">
<li>

Open [`/eval`](https://forge.lurus.cn/eval) → the **Rubrics** tab, and choose the seed `Sample rubric (PII)` or build your own.

</li>
<li>

Switch to **Runs** and associate the `workflow_id` you just finished running.

</li>
<li>

Click **Score**; the scorer runs in the background, and you see each criterion's score + explanation.

</li>
</ol>

**Available scorer types**

| Type | Purpose | Configuration |
|---|---|---|
| `pii_regex` | Detect whether the LLM output leaks ID numbers / phone numbers / emails | Write a regex pattern |
| `json_schema` | Check the output conforms to a JSON schema (structured generation scenarios) | Paste a JSON schema |
| `llm_as_judge` | Have another LLM score the main LLM's output | Write a judge prompt + pick a model + temperature |
| `semantic_similarity` | (WIP, not yet available — the embedding service is still being built) | — |

---

## §5 What to Do When You Hit a Problem

<details class="lurus-faq-item">
<summary>The workflow stays Running and never moves?</summary>

It's most likely an LLM gateway timeout (30 s). Check the last step on the `/workflows/runs/[id]` timeline cards; if it's `llm_call`, wait or cancel the run and retry.

</details>

<details class="lurus-faq-item">
<summary>403 You do not have permission?</summary>

You are trying to act on someone else's approval. Only the originator themselves or someone in the same `tenant_id` can decide — find the originator.

</details>

<details class="lurus-faq-item">
<summary>404 Approval not found?</summary>

The approval has been canceled or is in a terminal state. Confirm with the originator; terminal states cannot be changed.

</details>

<details class="lurus-faq-item">
<summary><code>/workflows/runs</code> keeps loading?</summary>

`kova_proxy` can't reach kova-rest. Check [`/api/health`](https://forge.lurus.cn/api/health) and see whether the second segment, `kova_rest`, is ok.

</details>

<details class="lurus-faq-item">
<summary>Chinese shows as garbled text / not translated?</summary>

An i18n key is missing. Send feedback + a screenshot (see [§6 Feedback](#§6-反馈)).

</details>

---

## §6 Feedback {#§6-反馈}

Found a bug, want a new feature, or want a 30-minute chat with us about your use case:

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="pen-tool" :size="20" /></span>
    <div class="lurus-card__title">Typeform form</div>
    <p class="lurus-card__body">Embedded at the bottom of the <code>/settings</code> page — fills out in 30 seconds, fastest for external users.</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="messages-square" :size="20" /></span>
    <div class="lurus-card__title">Discord</div>
    <p class="lurus-card__body">Invite link is in the footer, the first choice for developer-facing users.</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="mail" :size="20" /></span>
    <div class="lurus-card__title">Email</div>
    <p class="lurus-card__body"><code>forge-beta@lurus.cn</code>, with a reply SLA within 24h.</p>
  </div>
</div>

During the Beta, all feedback goes straight into the roadmap. We look forward to your use.

---

<NextSteps
  title="Next Steps"
  :steps="[
    { text: 'Forge intro page — its place within the Lurus platform', link: '/en/forge/', primary: true },
    { text: 'Kova engine docs — details of the underlying durable execution engine', link: '/en/kova/' },
    { text: 'Forge Roadmap — what we are building next', link: '/en/forge/roadmap' },
  ]"
/>

---

*Last updated: 2026-05-12 | Companion Beta invite playbook: `2b-bs-forge/docs/beta-invite-playbook.md`*

</div>
