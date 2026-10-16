---
title: 小智 ESP32 配置
description: 给小智 ESP32 语音硬件换上 Lurus API 做大脑：改 xiaozhi-server 配置里的几行，设备端不用动。
---

# 小智 ESP32 配置

[小智 ESP32](https://github.com/78/xiaozhi-esp32) 是开源的 AI 语音硬件，大模型调用发生在服务端 [xiaozhi-esp32-server](https://github.com/xinnan-tech/xiaozhi-esp32-server)。服务端的 `type: openai` 适配器支持任何 OpenAI 兼容服务，所以换成 Lurus API 只改服务端配置，**设备固件不用重刷**。

<div class="lurus-callout lurus-callout--info">
<span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
<div>
<p class="lurus-callout__title">开始前</p>
<div class="lurus-callout__body">准备一个 Lurus <Term t="API Key">API Key</Term>（格式 <code>sk-xxx</code>）。还没有？前往 <a href="/guide/get-api-key">获取 API Key</a>。一台设备或一个家庭建一个令牌，方便看每台设备花了多少。</div>
</div>
</div>

## 1. 加一个 LLM 配置

打开 `xiaozhi-server/data/.config.yaml`（没有就从 `config.yaml` 复制一份），在 `LLM:` 下面加：

```yaml
LLM:
  LurusLLM:
    type: openai
    base_url: https://hub.lurus.cn/v1
    model_name: deepseek-chat
    api_key: sk-xxx
```

## 2. 选中它

```yaml
selected_module:
  LLM: LurusLLM
```

## 3. 重启服务端

Docker 部署的在 compose 目录下执行：

```bash
docker compose restart
```

对设备说一句话，能正常回答就接好了。如果用的是智控台（manager-web），在「模型配置 → 大语言模型」里新增一个 OpenAI 类型的模型，填同样的接口地址、模型名和 Key 即可。

## 选型建议

语音对话最在意的是**首字延迟**，推理模型会先想再说，体验上会卡一下。

| 场景 | 推荐模型 | 原因 |
|------|---------|------|
| 日常闲聊、问答 | `deepseek-chat` | 快、便宜、中文自然 |
| 孩子学习、讲故事 | `deepseek-chat` | 同上，可在提示词里限定风格 |
| 需要看图（VLLM） | `gemini-3-flash-preview` | 多模态 |

## 常见问题

**回答很慢**：别选 `deepseek-reasoner` 这类推理模型做语音对话。

**设备说"服务异常"**：先在服务端机器上 `curl https://hub.lurus.cn/v1/models -H "Authorization: Bearer sk-xxx"`，能返回列表说明 Key 和网络都没问题，再查 `model_name` 是否拼对。
