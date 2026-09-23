---
title: MemX 常见问题
description: MemX AI 记忆引擎的常见问题与解答。
---

<div class="memx-faq">

# 常见问题

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="brain" :size="14" /> 基础</span>
  <h2 class="lurus-section-head__title">基础问题</h2>
</div>

<details class="lurus-faq-item"><summary>MemX 现在成熟到什么程度？</summary>

早期试点。当前版本在预发与演示环境运行，未承载客户生产流量，尚未替换正在服务线上流量的上一代实现。未发布到公共包仓库，部署包与源码随交付提供。

</details>

<details class="lurus-faq-item"><summary>用什么语言实现？和 MemX、memorus 这两个名字是什么关系？</summary>

引擎是 Rust 实现的原创工作区，不是任何上游项目的分支或移植。MemX 是本站对该产品的称呼；工程名为 memorus，命令行（`memorus-r`）与服务（`memorus-server`）的二进制沿用工程名。Python、Node.js 绑定与 C FFI 调用的是同一套 Rust 引擎。

</details>

<details class="lurus-faq-item"><summary>默认会调用外部模型吗？</summary>

不会。抽取默认使用 `rules` 模式，完全本地；`hybrid` 与 `llm` 模式需要显式开启并配置模型服务。

</details>

<details class="lurus-faq-item"><summary>需要 GPU 吗？</summary>

默认配置不需要：规则抽取与关键词检索都在 CPU 上完成。要做语义检索，需要配置嵌入服务，或以 `onnx-embedding` 构建选项开启本地嵌入。

</details>

<details class="lurus-faq-item"><summary>数据存在哪里？</summary>

服务端默认构建只链接 SQLite 存储。客户环境部署包里，所有持久数据落在一个命名卷上，不依赖外部数据库、缓存或消息队列。其他向量库后端需在构建时显式开启。

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> 使用</span>
  <h2 class="lurus-section-head__title">使用问题</h2>
</div>

<details class="lurus-faq-item"><summary>如何控制衰减速度？</summary>

| 参数（`[ace.decay]`） | 效果 |
|------|------|
| `half_life` | 增大 → 衰减更慢（默认 30 天） |
| `boost_factor` | 增大 → 每次召回回升更多（默认 0.1） |
| `protection_days` | 新记忆保持满权重的天数（默认 7 天） |
| `permanent_threshold` | 减小 → 更容易成为不再衰减的记忆（默认 15 次） |

衰减清理由 `memorus-r sweep` 或 MCP 工具 `run_decay_sweep` 触发。

</details>

<details class="lurus-faq-item"><summary>记错了的内容怎么处理？</summary>

<ol class="lurus-steps">
<li>

`memorus-r list` 或 `memorus-r conflicts` — 找到它

</li>
<li>

`memorus-r forget <memory-id>` — 删除

</li>
<li>

`memorus-r learn "正确的内容"` — 手动写入

</li>
</ol>

同一事实出现新值时，引擎会把旧记忆标记为已被取代，检索时排在后面；每条记忆的变更历史可以通过 `GET /api/v1/memories/{id}/history` 查询。

</details>

<details class="lurus-faq-item"><summary>记忆指向的代码改了怎么办？</summary>

锚定到源文件的记忆在检索时会重新核对，标为已核验、陈旧或无法核验。对陈旧记忆默认只标注；可配置 `[ace.verification] policy` 为 `demote`（降权）或 `drop`（剔除）。也可以用 `memorus-r verify` 批量核对。

</details>

<details class="lurus-faq-item"><summary>多个用户或 Agent 如何隔离？</summary>

每条记忆带用户、Agent 标识与作用域（全局、项目、团队）。服务端可选按 API 密钥区分租户（默认关闭）。服务端 MCP 端点目前仅支持单租户部署。

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> 隐私</span>
  <h2 class="lurus-section-head__title">隐私问题</h2>
</div>

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">内置规则不能单独关闭</p>
    <div class="lurus-callout__body"><p>13 层内置脱敏规则不能单独关闭或移除，只能通过 <code>[privacy] redaction_patterns</code> 追加规则。脱敏属于 ACE 处理管线，管线默认开启；关闭 ACE 时写入不经脱敏。</p></div>
  </div>
</div>

<details class="lurus-faq-item"><summary>内置规则覆盖哪些类型？</summary>

按从具体到一般的顺序依次应用：

| 类型 | 替换为 |
|---------|------|
| API 密钥（常见服务商前缀、代码仓库平台令牌） | `[REDACTED:API_KEY]` |
| OAuth 令牌 | `[REDACTED:OAUTH_TOKEN]` |
| JWT | `[REDACTED:JWT]` |
| `api_key=` / `access_token=` 等参数 | `[REDACTED:API_KEY_PARAM]` |
| 云访问凭证 | `[REDACTED:AWS_CREDENTIALS]` |
| 邮箱 | `[REDACTED:EMAIL]` |
| 电话 | `[REDACTED:PHONE]` |
| 银行卡号 | `[REDACTED:CREDIT_CARD]` |
| 社会保障号 | `[REDACTED:SSN]` |
| 私钥块 | `[REDACTED:PRIVATE_KEY]` |
| 数据库连接串 | `[REDACTED:DB_CONNECTION]` |
| 密码、令牌等通用密钥字段 | `[REDACTED:SECRET]` |
| 本地用户路径 | `[USER_PATH]` |

</details>

<details class="lurus-faq-item"><summary>脱敏失败会怎样？</summary>

写入时先脱敏再处理。脱敏这一步失败时，这次写入整条不落库，不会把原文存进去。配置里的自定义正则无法编译时，服务直接报错，不会静默跳过。

</details>

<details class="lurus-faq-item"><summary>能按用户删除数据吗？</summary>

可以。REST 提供 `POST /api/v1/users/{user_id}/erase`，删除该用户的记忆。

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> 性能</span>
  <h2 class="lurus-section-head__title">性能问题</h2>
</div>

<details class="lurus-faq-item"><summary>检索延迟、容量有多大？</summary>

目前没有可复现的基准数字，所以这里不写数字。

</details>

## 下一步

<NextSteps
  :steps="[
    { text: '快速开始', link: '/memx/quickstart', primary: true },
    { text: '核心概念', link: '/memx/concepts' },
    { text: '架构设计', link: '/memx/architecture' },
  ]"
/>

</div>
