---
title: MemX 常见问题
description: MemX AI 记忆引擎的常见问题与解答。
---

# 常见问题

## 基础问题

- **MemX 和 mem0 关系**：MemX 是 [mem0](https://github.com/mem0ai/mem0) 的增强版（超集），新增 ACE 智能记忆管理层。`ace_enabled=False` 时与 mem0 行为完全一致零开销。
- **需要 GPU 吗**：不需要。本地嵌入模型 all-MiniLM-L6-v2 经 ONNX Runtime 在 CPU 上运行（< 5ms/条）；Reflector 规则预筛不依赖 GPU，hybrid 的 LLM 精炼走远程 API。
- **额外 LLM Token**：默认 `hybrid` 仅对有价值候选项调 LLM，比 mem0 全量调用减少 90%+；LLM 不可用自动降级纯规则零成本。显式关闭设 `reflector.mode="rules"`。
- **支持哪些向量数据库**：继承 mem0 全部（Qdrant、Chroma、Pinecone、Weaviate、Milvus 等），默认内存存储适合开发测试。

## 使用问题

- **从 mem0 迁移**：① `pip install git+https://github.com/UU114/memx.git` ② `from mem0 import Memory` 改为 `from memx import Memory` ③ 现有代码无需改动（ACE 默认关闭）④ 准备好后加 `config={"ace_enabled": True}` 开启智能功能。
- **数据存哪里**：取决于配置的向量数据库后端，默认内存（重启丢失），生产建议 Qdrant/Chroma 持久化。本地嵌入模型缓存 `~/.memx/models/`。
- **控制衰减速度**：

| 参数 | 效果 |
|------|------|
| `decay.half_life_days` | 增大 → 衰减更慢（默认 30 天） |
| `decay.boost_factor` | 增大 → 召回增强更明显（默认 0.1） |
| `decay.permanent_threshold` | 减小 → 更易成永久记忆（默认 15 次） |

- **处理误判知识**：`memx list --scope project:my-app`（查看）→ `memx forget <memory-id>`（删除）→ `memx learn "correct knowledge"`（手动添加）。
- **多人/多 Agent 共享**：启用守护进程模式，多 Agent 经 IPC Socket 共享同一知识库（IDE 插件、团队协作），用 `scope` 区分项目/工作区。

## 隐私问题

- **可关闭过滤吗**：**不可以**。12 条内置敏感信息过滤规则是不可禁用的安全底线，只能通过 `privacy_custom_patterns` 添加额外规则。

- **支持哪些敏感信息类型的过滤**：

| 类型 | 示例 |
|---------|------|
| PEM 私钥 | `-----BEGIN RSA PRIVATE KEY-----` |
| Bearer / JWT Token | `Bearer eyJhbG...` |
| Anthropic API Key | `sk-ant-api03-*` |
| OpenAI API Key | `sk-proj-*` |
| GitHub Token | `ghp_*`, `github_pat_*` |
| AWS Access Key | `AKIA*` |
| AWS Secret Key | 40 字符 base64 |
| 数据库连接串 | `postgres://user:pass@host/db` |
| 操作系统路径 | `/home/user/.ssh/id_rsa` |
| 自定义规则 | 通过 `privacy_custom_patterns` 添加 |

::: info
这 12 条规则聚焦于**密钥与本地路径**类的敏感信息（secrets + user paths），并非传统意义的 PII（邮箱 / 电话 / 身份证等）。如需 PII 过滤，请通过 `privacy_custom_patterns` 自行扩展。
:::

- **过滤后去哪了**：替换为占位符（如 `[REDACTED:api_key]`），原始值不存储任何地方。过滤在写入管道最前端执行。

## 性能问题

- **能存多少条记忆**：取决于向量数据库后端容量，MemX 本身无硬限制；衰减引擎自动归档保持活跃规模合理。
- **RecallReinforcer 影响搜索性能吗**：不会。异步后台线程，返回结果后才更新 `recall_count`，不阻塞搜索。
- **检索延迟**（< 10,000 条记忆）：

| 操作 | 延迟 |
|------|------|
| 四层混合搜索 | 10-50ms |
| 纯关键词搜索（L4 降级） | 5-20ms |
| 本地嵌入计算 | < 5ms |
| 写入（含 Reflector + Curator） | 20-100ms |
