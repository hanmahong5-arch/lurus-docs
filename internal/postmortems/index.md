---
title: 事故复盘
lastReviewed: 2026-04-28
owner: marvin
---

# 事故复盘

<div class="lurus-callout lurus-callout--key"><span class="lurus-callout__icon"><Icon name="shield" :size="18"/></span><div><p class="lurus-callout__title">复盘的目的</p><div class="lurus-callout__body">复盘是为了<strong>预防同类事故</strong>，不是责备。即使是单人公司，也要写——给未来的自己（或未来的同事）。</div></div></div>

## <Icon name="history" :size="20" /> 索引

| 日期 | 事故 | 严重度 | 复盘 |
|---|---|---|---|
| — | （第一次复盘待发生） | — | — |

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">0</span><span class="lurus-stat__label">当前复盘条目</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">48h</span><span class="lurus-stat__label">初稿窗口</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">5</span><span class="lurus-stat__label">Whys 根因</span></div>
</div>

<div class="lurus-callout lurus-callout--info"><span class="lurus-callout__icon"><Icon name="alert-circle" :size="18"/></span><div><p class="lurus-callout__title">0 条不等于没事故</p><div class="lurus-callout__body">当前复盘条目数：<strong>0</strong>。这不代表没事故，代表我们之前没养成"事故必复盘"的习惯。从 2026 年 5 月起补完。</div></div></div>

## <Icon name="alert-triangle" :size="20" /> 触发复盘的标准

满足任一条 → 必复盘：

- 任何 S0 / S1 事故
- 客户感知 > 5 分钟
- 资金 / 数据丢失（无论金额）
- 任何"差点出大事"（near miss）

## <Icon name="package" :size="20" /> 模板

新复盘从 `_template.md` 复制，命名格式 `YYYY-MM-DD-<short-slug>.md`。

```bash
cp internal/postmortems/_template.md internal/postmortems/2026-05-01-newapi-key-pool-exhausted.md
```

## <Icon name="check-circle" :size="20" /> 写复盘的纪律

<ol class="lurus-steps">
<li>

**48 小时内**写完初稿；事情记忆最清晰的窗口。

</li>
<li>

**诚实**：不为"好看"裁剪自己的失误；事故不是道德错误。

</li>
<li>

**5 Whys**：根因往往不在最表层。

</li>
<li>

**行动项可执行**：不是"以后小心"，而是"加这个监控 / 写这个 lint / 改这条流程"。

</li>
<li>

**行动项绑定 issue**：每条 action item 必须能跟踪（GitHub issue / TODO 文件）。

</li>
</ol>

## <Icon name="search" :size="20" /> 反例

<div class="lurus-callout lurus-callout--danger"><span class="lurus-callout__icon"><Icon name="alert-circle" :size="18"/></span><div><p class="lurus-callout__title">表象，不是根因</p><div class="lurus-callout__body">❌ "因为 marvin 当时手忙，所以漏看了告警"<br>✅ "告警同时发了 7 条，单人无法判断哪条最紧急。需引入告警优先级分级 + 静默重复"</div></div></div>

<div class="lurus-callout lurus-callout--danger"><span class="lurus-callout__icon"><Icon name="alert-circle" :size="18"/></span><div><p class="lurus-callout__title">不是 action item</p><div class="lurus-callout__body">❌ "以后我会更注意"<br>✅ "为 platform billing 在 PR 中强制要求 e2e 测试覆盖（CI 检查）"</div></div></div>

<div class="lurus-callout lurus-callout--danger"><span class="lurus-callout__icon"><Icon name="alert-circle" :size="18"/></span><div><p class="lurus-callout__title">借口，不是结论</p><div class="lurus-callout__body">❌ "上游服务不稳定，无法控制"<br>✅ "上游 X 不稳定 → 我们这边加超时 5s + 熔断 + 缓存兜底，事故时降级"</div></div></div>
