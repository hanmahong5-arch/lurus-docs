---
title: Switch 配置说明
description: Switch 的 AI 工具配置、MCP 服务器管理和成本监控设置。
---

<div class="switch-page">

# Switch 配置说明

## 打开配置界面

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">菜单栏图标</div>
    <p class="lurus-card__body">macOS / Linux：点击菜单栏图标 →「配置」。</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">系统托盘</div>
    <p class="lurus-card__body">Windows：托盘图标右键 →「打开配置」。</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="key-round" :size="20" /></span>
    <div class="lurus-card__title">快捷键</div>
    <p class="lurus-card__body"><span class="lurus-kbd">Ctrl+Shift+S</span>（Win/Linux）/ <span class="lurus-kbd">Cmd+Shift+S</span>（macOS）。</p>
  </div>
</div>

---

## 添加模型提供商

「**<Term t="Provider">提供商</Term>**」选项卡 →「**添加提供商**」，填提供商名称 + API Base URL + API Key：

| 提供商 | API Base URL | API Key |
|------|------|------|
| **Lurus API** <span class="lurus-tag">推荐</span> | `https://api.lurus.cn/v1` | Lurus Key（`sk-` 开头）；模型点「自动检测」 |
| **OpenAI** | `https://api.openai.com/v1` | `sk-...`（官方） |
| **Anthropic** | `https://api.anthropic.com/v1` | `sk-ant-...` |
| **Ollama**（本地） | `http://localhost:11434/v1` | （留空） |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shuffle" :size="14" /> 路由</span>
  <h2 class="lurus-section-head__title">配置路由规则</h2>
  <p class="lurus-section-head__lede">定义哪个请求走哪个提供商，未匹配的请求走默认提供商（默认 → Lurus API）。</p>
</div>

**按模型名称路由**：`gpt-*` → OpenAI；`claude-*` → Anthropic；`deepseek-*` / `*`（其他）→ Lurus API；`llama*` → Ollama。JSON：

```json
{ "rules": [
    { "pattern": "gpt-*", "provider": "OpenAI" },
    { "pattern": "claude-*", "provider": "Anthropic" },
    { "pattern": "llama*", "provider": "Ollama" },
    { "pattern": "*", "provider": "Lurus API" }
  ] }
```

**按应用路由（高级）**：为不同本地应用设置不同路由：

```json
{
  "app_rules": [
    {
      "app": "cursor",
      "default_provider": "Lurus API",
      "model_override": "deepseek-reasoner"
    },
    {
      "app": "continue",
      "default_provider": "Ollama"
    }
  ]
}
```

---

## 代理端口配置

「**通用**」→「**监听端口**」，默认 `11434`。端口冲突（如与 Ollama）时改为其他端口（如 `11435`），应用侧相应修改 `base_url=http://localhost:11435/v1`（`api_key` 随意填，Switch 用配置的 provider key）。

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">端口冲突</p>
    <div class="lurus-callout__body">默认端口 <code>11434</code> 与 Ollama 的默认端口相同。两者同机运行时，把 Switch 改到其它端口（如 <code>11435</code>），并同步更新应用侧的 <code>base_url</code>。</div>
  </div>
</div>

---

## 完整配置文件

Switch 配置保存在：

| 平台 | 路径 |
|------|------|
| Windows | `%APPDATA%\LurusSwitch\config.json` |
| macOS | `~/Library/Application Support/LurusSwitch/config.json` |
| Linux | `~/.config/LurusSwitch/config.json` |

完整 `config.json` 示例：

```json
{
  "listen_port": 11434,
  "log_requests": true,
  "start_on_login": true,
  "providers": [
    {
      "name": "Lurus API",
      "base_url": "https://api.lurus.cn/v1",
      "api_key": "sk-your-lurus-key",
      "enabled": true
    },
    {
      "name": "Ollama",
      "base_url": "http://localhost:11434/v1",
      "api_key": "",
      "enabled": true
    }
  ],
  "routing": {
    "default_provider": "Lurus API",
    "rules": [
      { "pattern": "llama*",  "provider": "Ollama" },
      { "pattern": "qwen*",   "provider": "Ollama" },
      { "pattern": "*",       "provider": "Lurus API" }
    ]
  }
}
```

---

## 验证配置

「**状态**」选项卡显示：各提供商连接状态（绿=正常，红=失败）、当前激活路由规则、最近请求日志。命令行验证（返回正常 JSON 即成功）：

```bash
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"ping"}]}'
```

---

## 下一步

<NextSteps :steps="[
  { text: '成本监控', link: '/switch/cost-monitoring', primary: true },
  { text: 'MCP 服务器', link: '/switch/mcp-servers' },
  { text: '团队配置', link: '/switch/team-config' },
]" title="" />

</div>

<style>
.switch-page .lurus-section-head { margin-top: 8px; }
</style>
