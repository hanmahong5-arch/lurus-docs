---
title: "Migrate from OpenAI to the Lurus API"
description: "Switch your OpenAI calls to the Lurus API in 5 minutes with zero disruption, keeping your existing SDK usage."
---

<div class="mig-openai-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="import" :size="14" /> Migrate from OpenAI</span>
  <h1 class="lurus-section-head__title">Migrate from OpenAI to the Lurus API</h1>
  <p class="lurus-section-head__lede">Change a single <code>base_url</code> and all your existing OpenAI SDK calls connect through — no need to rewrite business logic.</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">5 minutes</span><span class="lurus-stat__label">Estimated time</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">1 change</span><span class="lurus-stat__label">Code edit</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">0 restarts</span><span class="lurus-stat__label">Restarts</span></div>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Prerequisites</p>
    <div class="lurus-callout__body"><p>You already have a Lurus <Term t="API Key">API Key</Term> (<a href="/en/guide/get-api-key">how to get one</a>).</p></div>
  </div>
</div>

## <Icon name="repeat" :size="20" /> One change

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

That's all. Every `client.chat.completions.create(...)` call works unchanged.

## <Icon name="layers" :size="20" /> Model name mapping

| OpenAI model | Recommended Lurus equivalent |
|-------------|----------------|
| gpt-5 | `gpt-5` (passthrough) or `deepseek-chat` / `claude-sonnet-4` |
| gpt-4o-mini | `deepseek-chat` / `qwen-turbo` |
| gpt-4o | `claude-sonnet-4` / `gemini-3-pro` |
| o1 | `deepseek-reasoner` |
| text-embedding-3-small | `bge-m3` (local) / `text-embedding-3-small` |

See the full list under [Supported models](/en/guide/models).

## <Icon name="workflow" :size="20" /> Rollout steps

<ol class="lurus-steps">
<li>

**Verify connectivity** — run it once; success means you receive a reply.

```python
resp = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "你好"}],
)
print(resp.choices[0].message.content)
```

</li>
<li>

**Canary rollout** — shift traffic from OpenAI to Lurus by ratio, ramping gradually from `0.1` → `0.5` → `1.0`.

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

**Rollback** — remove `base_url` to revert to OpenAI calls. **No restart needed** (takes effect per request).

</li>
</ol>

## <Icon name="life-buoy" :size="20" /> FAQ

<details class="lurus-faq-item">
<summary>Can't find a model name?</summary>

Search the [model catalog](/en/guide/models), or open an Issue.

</details>

<details class="lurus-faq-item">
<summary>Are function calling / JSON mode supported?</summary>

Lurus is fully compatible with OpenAI function calling / JSON Schema.

</details>

<details class="lurus-faq-item">
<summary>Do I need an organization ID?</summary>

Lurus does not require the `organization` field; supplying it does not cause an error.

</details>

## Next steps

<NextSteps :steps="[
  { text: 'Model catalog', link: '/en/guide/models', primary: true },
  { text: 'API reference', link: '/en/api/overview' },
  { text: 'Lubei billing', link: '/en/platform/billing' },
]" />

</div>
