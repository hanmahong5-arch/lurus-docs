<script setup>
import { data } from '../.vitepress/data/models.data'
</script>

# 支持的模型

Lurus API 支持主流 AI 供应商的各类模型，本页面由 `data/models.yaml` 自动渲染，模型列表始终与数据文件保持同步。

> 添加新模型只需编辑 `lurus-docs/data/models.yaml`，推送后 CI 自动构建更新。

## 模型列表

<ModelTable
  v-for="v in data.vendors"
  :key="v.name"
  :vendor="v.name"
  :tagline="v.tagline"
  :models="v.models"
/>

## 模型选择指南

### 按任务选择

| 场景 | 推荐模型 |
|------|---------|
| 日常对话 | `deepseek-chat`（性价比最高） |
| 代码生成 | `deepseek-reasoner` / `gpt-4o` |
| 数学推理 | `deepseek-reasoner` / `claude-3-opus` |
| 长文档分析 | `gemini-3-pro-preview`（1M 上下文） |
| 创意写作 | `claude-3-5-sonnet` |
| 英文任务 | `gpt-4o` / `claude-3-5-sonnet` |
| 中文任务 | `deepseek-chat` |
| 图像理解 | `gemini-3-pro-image-preview` / `gpt-4o` |
| 图像生成 | `dall-e-3` / `midjourney` |

### 按预算选择

| 预算区间 | 推荐模型 |
|---------|---------|
| 低（< ¥5/M tokens） | `deepseek-chat`、`gpt-3.5-turbo`、`gemini-3-flash-preview` |
| 中（¥5–20/M tokens） | `claude-3-sonnet`、`gemini-3-pro-preview`、`gpt-4o-mini` |
| 高（> ¥20/M tokens） | `gpt-4o`、`claude-3-opus` |

## 切换模型

所有模型共享相同的 API 格式，只需更换 `model` 字段：

```python
# 使用 DeepSeek
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "Hello"}]
)

# 切换到 Gemini，代码完全相同
response = client.chat.completions.create(
    model="gemini-3-pro-preview",
    messages=[{"role": "user", "content": "Hello"}]
)
```

## 注意事项

1. **模型可用性**：状态标记为 `Beta` 的模型为预览版本，接口可能调整
2. **配额限制**：不同 API Key 可能有不同的模型访问权限
3. **价格变动**：定价可能随供应商调整，以控制台显示为准
4. **上下文限制**：超出模型上下文长度的请求会被截断或返回错误
