---
title: 从 OpenAI 迁移到 Lurus API
description: 5 分钟把 OpenAI 调用无感切换到 Lurus API，保留 SDK 使用方式。
---

# 从 OpenAI 迁移到 Lurus API

**预计耗时**：5 分钟。
**前置条件**：已有一个 Lurus <Term t="API Key">API Key</Term>（[获取方式](/guide/get-api-key)）。

## 一处修改

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

## 模型名映射

| OpenAI 模型 | Lurus 推荐平替 |
|-------------|----------------|
| gpt-5 | `gpt-5` (直通) 或 `deepseek-chat` / `claude-sonnet-4` |
| gpt-4o-mini | `deepseek-chat` / `qwen-turbo` |
| gpt-4o | `claude-sonnet-4` / `gemini-3-pro` |
| o1 | `deepseek-reasoner` |
| text-embedding-3-small | `bge-m3` (本地) / `text-embedding-3-small` |

完整列表见 [支持的模型](/guide/models)。

## 验证

```python
resp = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "你好"}],
)
print(resp.choices[0].message.content)
```

能收到中文回复即成功。

## 灰度策略

```python
import os, random

def get_client():
    if random.random() < float(os.getenv("LURUS_TRAFFIC", "0.1")):
        return OpenAI(api_key=os.getenv("LURUS_API_KEY"),
                      base_url="https://api.lurus.cn/v1")
    return OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
```

逐步从 `0.1` → `0.5` → `1.0`。

## 回滚

删除 `base_url` 即回到 OpenAI 调用。**不需要重启**（按请求生效）。

## 常见问题

- **模型名找不到？** → 去 [模型目录](/guide/models) 搜，或提 Issue。
- **函数调用 / JSON 模式？** → Lurus 全量兼容 OpenAI 函数调用 / JSON Schema。
- **组织 ID？** → Lurus 不需要 `organization` 字段，多余不报错。

## 下一步

<NextSteps :steps="[
  { text: '模型目录', link: '/guide/models', primary: true },
  { text: 'API 参考', link: '/api/overview' },
  { text: '鹿贝计费', link: '/platform/billing' },
]" />
