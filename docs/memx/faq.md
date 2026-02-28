# 常见问题

## 基础问题

### MemX 和 mem0 是什么关系？

MemX 是在 [mem0](https://github.com/mem0ai/mem0) 基础上构建的增强版本，新增了 ACE（Adaptive Context Engine）智能记忆管理层。当 `ace_enabled=False` 时，MemX 与 mem0 的行为完全一致，零额外开销。你可以将 MemX 视为 mem0 的"超集"。

### 需要 GPU 吗？

不需要。MemX 的本地嵌入模型（all-MiniLM-L6-v2）通过 ONNX Runtime 在 CPU 上运行，推理速度 < 5ms/条。知识提取（Reflector）使用纯规则引擎，同样不依赖 GPU。

### 会消耗额外的 LLM Token 吗？

默认不会。Reflector 引擎在 `mode: "rules"`（默认）模式下完全基于规则运行，零 LLM 调用。只有将 `reflector_mode` 显式切换为 `"llm"` 时才会调用 LLM。

### 支持哪些向量数据库？

MemX 继承 mem0 的全部向量数据库支持，包括：Qdrant、Chroma、Pinecone、Weaviate、Milvus 等。默认使用内存向量存储，适合开发和测试。

## 使用问题

### 如何从 mem0 迁移到 MemX？

1. 安装 MemX：`pip install memx`
2. 将 `from mem0 import Memory` 改为 `from memx import Memory`
3. 现有代码无需任何改动（ACE 默认关闭）
4. 准备好后，添加 `config={"ace_enabled": True}` 开启智能功能

### 知识库数据存在哪里？

取决于你配置的向量数据库后端。默认使用内存存储（重启后丢失）。生产环境建议使用 Qdrant 或 Chroma 等持久化后端。本地嵌入模型缓存在 `~/.memx/models/`。

### 如何控制知识的衰减速度？

调整以下参数：

| 参数 | 效果 |
|------|------|
| `decay_half_life` | 增大 → 衰减更慢（默认 30 天） |
| `decay_boost_factor` | 增大 → 召回增强更明显（默认 0.15） |
| `decay_permanent_threshold` | 减小 → 更容易成为永久记忆（默认 15 次） |

### 如何处理误判的知识？

```bash
# 查看所有知识
memx list --scope project:my-app

# 删除错误的知识
memx forget <memory-id>

# 手动添加正确的知识
memx learn "correct knowledge here"
```

### 多人/多 Agent 如何共享知识？

启用守护进程模式，多个 Agent 通过 IPC Socket 共享同一个知识库。适用于 IDE 插件、团队协作等场景。注意使用 `scope` 区分不同项目或工作区的知识。

## 隐私问题

### 隐私过滤可以关闭吗？

**不可以**。12 种内置的 PII 过滤规则是不可禁用的安全底线。你只能通过 `privacy_custom_patterns` 添加额外的过滤规则。

### 支持哪些 PII 类型的过滤？

| PII 类型 | 示例 |
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

### 过滤后的敏感信息去哪了？

敏感信息被替换为占位符（如 `[REDACTED:api_key]`），原始值不会被存储到任何地方。过滤在写入管道的最前端执行，确保敏感信息不会进入后续处理流程。

## 性能问题

### 知识库能存多少条记忆？

取决于向量数据库后端的容量。MemX 本身没有硬性限制。配合衰减引擎的自动归档机制，知识库会保持在合理的活跃规模。

### 检索延迟是多少？

典型场景（< 10,000 条记忆）：

| 操作 | 延迟 |
|------|------|
| 四层混合搜索 | 10-50ms |
| 纯关键词搜索（L4 降级） | 5-20ms |
| 本地嵌入计算 | < 5ms |
| 写入（含 Reflector + Curator） | 20-100ms |

### RecallReinforcer 会影响搜索性能吗？

不会。RecallReinforcer 在异步后台线程中运行，在返回搜索结果后才更新 `recall_count`，不阻塞搜索响应。
