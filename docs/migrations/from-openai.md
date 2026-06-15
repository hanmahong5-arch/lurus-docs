---
title: 从 OpenAI 迁移到 Lurus API
description: 5 分钟把 OpenAI 调用无感切换到 Lurus API，保留 SDK 使用方式。
---

<div class="mig-openai-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="import" :size="14" /> 从 OpenAI 迁移</span>
  <h1 class="lurus-section-head__title">从 OpenAI 迁移到 Lurus API</h1>
  <p class="lurus-section-head__lede">改一行 <code>base_url</code>，原有 OpenAI SDK 调用全部接通——无需重写业务逻辑。</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">5 分钟</span><span class="lurus-stat__label">预计耗时</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">1 处</span><span class="lurus-stat__label">代码改动</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">0 次</span><span class="lurus-stat__label">重启</span></div>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">前置条件</p>
    <div class="lurus-callout__body"><p>已有一个 Lurus <Term t="API Key">API Key</Term>（<a href="/guide/get-api-key">获取方式</a>）。</p></div>
  </div>
</div>

## <Icon name="repeat" :size="20" /> 一处修改

```diff
- from openai import OpenAI
-
- client = OpenAI(api_key="sk-openai-...")
+ from openai import OpenAI
+
+ client = OpenAI(
+     api_key="sk-lurus-...",
+     base_url="https://api.lurus.cn/v1",
+ )
```

仅此而已。所有 `client.chat.completions.create(...)` 调用无需改动。

## <Icon name="layers" :size="20" /> 模型名映射

| OpenAI 模型 | Lurus 推荐平替 |
|-------------|----------------|
| gpt-5 | `gpt-5` (直通) 或 `deepseek-chat` / `claude-sonnet-4` |
| gpt-4o-mini | `deepseek-chat` / `qwen-turbo` |
| gpt-4o | `claude-sonnet-4` / `gemini-3-pro` |
| o1 | `deepseek-reasoner` |
| text-embedding-3-small | `bge-m3` (本地) / `text-embedding-3-small` |

完整列表见 [支持的模型](/guide/models)。

## <Icon name="workflow" :size="20" /> 上线步骤

<ol class="lurus-steps">
<li>

**验证连通** — 跑一次确认能收到中文回复即成功。

```python
resp = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "你好"}],
)
print(resp.choices[0].message.content)
```

</li>
<li>

**灰度切流** — 按比例把流量从 OpenAI 切到 Lurus，逐步从 `0.1` → `0.5` → `1.0`。

```python
import os, random

def get_client():
    if random.random() < float(os.getenv("LURUS_TRAFFIC", "0.1")):
        return OpenAI(api_key=os.getenv("LURUS_API_KEY"),
                      base_url="https://api.lurus.cn/v1")
    return OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
```

</li>
<li>

**回滚** — 删除 `base_url` 即回到 OpenAI 调用。**不需要重启**（按请求生效）。

</li>
</ol>

## <Icon name="life-buoy" :size="20" /> 常见问题

<details class="lurus-faq-item">
<summary>模型名找不到？</summary>

去 [模型目录](/guide/models) 搜，或提 Issue。

</details>

<details class="lurus-faq-item">
<summary>函数调用 / JSON 模式支持吗？</summary>

Lurus 全量兼容 OpenAI 函数调用 / JSON Schema。

</details>

<details class="lurus-faq-item">
<summary>需要组织 ID 吗？</summary>

Lurus 不需要 `organization` 字段，多余不报错。

</details>

## 下一步

<NextSteps :steps="[
  { text: '模型目录', link: '/guide/models', primary: true },
  { text: 'API 参考', link: '/api/overview' },
  { text: '鹿贝计费', link: '/platform/billing' },
]" />

</div>
