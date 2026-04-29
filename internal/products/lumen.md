---
title: Lumen
id: lumen
group: kova
priority: P1
status: beta
owner: marvin (+ AI assist)
lastReviewed: 2026-04-28
sourcePath: 2c-cli-lumen
---

# Lumen 内部手册

> 仅限内部员工查阅。包含运维细节、决策档案、未公开问题。

## 一句话定位

Lumen 是面向 AI 应用开发者的可靠性与可观测性工具，解决三个核心痛点：**Agent 执行轨迹可回放**（零 LLM 费用）、**每笔 token 消费可审计**、**进程崩溃后可断点续跑**。对外品牌完全独立（PyPI `lumen-ai` / crates.io `lumen-cli`），用户不需要知道 Kova 或 Lurus 的存在。归属 Kova P1 产品组，是 Kova 生态的开发者入口工具。

## 速查

| 项 | 值 |
|---|---|
| 仓库 | github.com/hanmahong5-arch/lumen（独立 repo） |
| PyPI 包 | `lumen-ai` (v0.2.0) |
| Crates.io | `lumen-cli` (v0.1.0) |
| 域名 | 无（CLI 工具 + PyPI 包，非服务） |
| 部署目标 | 本地 / 开发者机器 / Kova Agent 宿主（`/data/kova/lumen/`） |
| 数据存储 | 本地文件系统：`./traces/*.json`（trace）、`./checkpoints/*.json`（checkpoint） |
| 关键上游 | `kova-types` crate（`AgentTrace`, `TraceStep`, `TraceStepType`, `TraceStatus`） |
| 下游 / 消费者 | AI 开发者（LangGraph / OpenAI / Anthropic SDK 用户），未来接 Kova engine |
| Rust 版本 | 1.93 (Edition 2024) |
| Python 版本 | ≥3.10 |

## 架构图

```mermaid
flowchart TD
    subgraph "开发者代码 (Python)"
        DEV[用户 Python 脚本]
        LGI[LangGraph graph.invoke]
        OAI[openai.chat.completions]
        ANT[anthropic.messages.create]
    end

    subgraph "Lumen Python SDK (lumen-ai)"
        INST[instrument / trace / atrace / traced_fn]
        TRACER[LumenTracer\nLangChain Callback]
        CHECKER[LumenCheckpointer\nBaseCheckpointSaver]
        BUDGET[BudgetTracker\n预算强制]
        ANOMALY[AnomalyDetector\n滑动窗口异常]
        EVTBUS[EventBus\nTraceCompleted / BudgetAlert / CostAnomaly]
        WRITER[FileTraceWriter / BatchTraceWriter]
        REDACT[RedactionEngine\n敏感数据过滤]
    end

    subgraph "Lumen Core (Rust, lumen-core)"
        REPLAY[ReplayEngine\n确定性回放]
        COST[CostTracker\n成本聚合]
        PRICING[Pricing Table\n30+ 模型]
        TRACE[TraceStore\n索引 + 摘要]
        READER[trace_reader\nJSON 反序列化]
    end

    subgraph "Lumen CLI (lumen-cli)"
        CLI_REPLAY[lumen replay]
        CLI_COST[lumen cost]
        CLI_TRACES[lumen traces]
        CLI_DASH[lumen dashboard]
    end

    subgraph "Kova 类型层 (kova-types)"
        KTYPES[AgentTrace / TraceStep\nTraceStepType / TraceStatus]
    end

    subgraph "存储"
        TDIR[./traces/*.json\nAgentTrace JSON]
        CDIR[./checkpoints/*.json\n线程检查点]
    end

    subgraph "可观测性后端（可选）"
        OTLP[OTLP Endpoint\ne.g. Grafana / Datadog]
        GRAF[Grafana]
    end

    DEV --> INST
    LGI --> TRACER
    LGI --> CHECKER
    OAI --> INST
    ANT --> INST
    INST --> BUDGET
    INST --> ANOMALY
    INST --> EVTBUS
    INST --> WRITER
    INST --> REDACT
    TRACER --> WRITER
    CHECKER --> CDIR
    WRITER --> TDIR
    TDIR --> READER
    READER --> KTYPES
    READER --> REPLAY
    READER --> COST
    READER --> TRACE
    COST --> PRICING
    CLI_REPLAY --> REPLAY
    CLI_COST --> COST
    CLI_TRACES --> TRACE
    INST -.->|LUMEN_OTLP_ENABLED| OTLP
    OTLP --> GRAF
```

## 核心数据流

### 数据流 1：Tracer 上报 Trace（LangGraph 路径）

```mermaid
sequenceDiagram
    participant APP as Python App
    participant TRC as LumenTracer
    participant TDIR as ./traces/
    participant CLI as lumen CLI
    participant RUST as lumen-core (Rust)

    APP->>TRC: graph.invoke(..., config={"callbacks": [tracer]})
    Note over TRC: on_chat_model_start → _llm_start_ms = now()
    APP->>TRC: LLM call begins (chain depth +1)
    TRC->>TRC: on_llm_end: 提取 tokens, model, finish_reason
    TRC->>TRC: estimate_cost(model, prompt, completion)
    TRC->>TRC: 追加步骤到 self._steps
    APP->>TRC: on_tool_start → _tool_start_ms = now()
    APP->>TRC: on_tool_end → 追加 ToolCall 步骤
    APP->>TRC: on_chain_end (chain depth 0)
    TRC->>TRC: _status = "Completed"
    TRC->>TRC: _write_trace(): 组装 AgentTrace JSON
    TRC->>TDIR: 原子写入 .{trace_id}.json.tmp → rename
    Note over TDIR: {trace_id}.json 落盘
    CLI->>RUST: lumen replay <trace_id>
    RUST->>TDIR: load_traces(dir) → serde_json::from_slice
    RUST->>RUST: build_replay_steps: LlmCall + ToolCall → ReplayStep
    RUST->>CLI: ReplayTrace { steps, original_cost_usd, ... }
    CLI->>APP: 终端打印逐步回放
```

### 数据流 2：Checkpoint 写入 + Replay（崩溃恢复）

```mermaid
sequenceDiagram
    participant APP as Python App
    participant LG as LangGraph Runtime
    participant CKER as LumenCheckpointer
    participant DISK as ./checkpoints/
    participant APP2 as 重启后的 App

    APP->>LG: graph.invoke(input, config={thread_id:"t1"})
    LG->>CKER: put(config, checkpoint, metadata, new_versions)
    Note over CKER: 序列化 channel_values 为 blobs (base64)
    CKER->>CKER: _save_thread("t1") — 原子写入 t1.json.tmp → rename
    CKER->>DISK: t1.json 落盘 (checkpoints + metadata + blobs + writes)

    Note over APP: 进程崩溃 ★

    APP2->>LG: graph.invoke(input, config={thread_id:"t1"})
    LG->>CKER: get_tuple({thread_id:"t1"})
    CKER->>DISK: _load_from_disk() → 读取 t1.json
    CKER->>LG: CheckpointTuple{checkpoint, metadata, parent_config, pending_writes}
    LG->>APP2: 从最后 checkpoint 继续执行，跳过已完成步骤
```

## 代码地图

### Rust Workspace

| 路径 | 职责 |
|---|---|
| `Cargo.toml` | workspace root；Edition 2024；`unwrap_used / expect_used / panic = deny` |
| `lumen-core/src/lib.rs` | 公开 5 个模块：cost, error, pricing, replay, trace |
| `lumen-core/src/replay.rs` | `ReplayEngine::replay()` — 从 `AgentTrace` 构建 `ReplayStep` 序列 |
| `lumen-core/src/cost.rs` | `CostTracker::report(since_ms)` — 聚合 + 异常检测（>2x 均值） |
| `lumen-core/src/pricing.rs` | 30+ 模型定价表，前缀模糊匹配，fallback $1.00/$3.00 per 1K |
| `lumen-core/src/trace.rs` | `TraceStore::list()` — 返回 `TraceSummary`，按时间倒序 |
| `lumen-core/src/trace_reader.rs` | `load_traces(dir)` — 读目录 `.json`，跳过点开头文件和非 trace JSON |
| `lumen-core/src/error.rs` | `LumenError`：Wal / TraceNotFound / Agent / CostLimitExceeded / Json / Io |
| `lumen-core/tests/integration.rs` | 11 个集成测试，用临时目录写 mock trace JSON |
| `lumen-cli/src/main.rs` | `clap` 四子命令：replay / cost / traces / dashboard；`parse_duration("24h" \| "7d")` |

### Python SDK

| 路径 | 职责 |
|---|---|
| `lumen-sdk/lumen/__init__.py` | 所有公开符号的单一入口，v0.4.0 |
| `lumen-sdk/lumen/instrument.py` | `instrument()` — 自动探测并 monkey-patch OpenAI/Anthropic；`trace()` / `atrace()` / `traced_fn()` |
| `lumen-sdk/lumen/config.py` | `LumenConfig` — 4 层加载（~/.lumen/config.toml → lumen.toml → LUMEN_* env）；`ConfigBuilder` 流式 API |
| `lumen-sdk/lumen/integrations/langgraph.py` | `LumenCheckpointer` — `BaseCheckpointSaver` 实现，原子写盘，3μs 写入 |
| `lumen-sdk/lumen/integrations/langgraph_tracer.py` | `LumenTracer` — `BaseCallbackHandler` 实现，跟踪 chain 深度，outermost chain_end 触发 `_write_trace()` |
| `lumen-sdk/lumen/integrations/openai_tracer.py` | `patch_openai()` — monkey-patch 同步/异步 Completions.create，支持 streaming 包装 |
| `lumen-sdk/lumen/integrations/anthropic_tracer.py` | `patch_anthropic()` — 同上，针对 Anthropic SDK |
| `lumen-sdk/lumen/_budget.py` | `BudgetTracker` — 线程安全，全局预算 + 单次 run 上限，`BudgetExceededError` |
| `lumen-sdk/lumen/_anomaly.py` | `AnomalyDetector` — 滑动窗口（默认 100 条），≥5 样本后启用，`multiplier * mean` 阈值 |
| `lumen-sdk/lumen/_batch_writer.py` | `BatchTraceWriter` — buffer_size + flush_interval_ms，后台刷盘 |
| `lumen-sdk/lumen/_metrics.py` | `RuntimeMetrics` — 实时 p50/p99 latency / cost，每模型 + 每 agent 分段窗口 |
| `lumen-sdk/lumen/_context.py` | `TraceSession` — 单次 trace 的状态机；`get_active_session()` / `set_active_session()` |
| `lumen-sdk/lumen/_redaction.py` | `RedactionEngine` — 正则替换敏感字段为 `[REDACTED]` |
| `lumen-sdk/lumen/pricing.py` | Python 侧定价表，与 Rust `pricing.rs` 保持一致，支持 `register_custom_pricing()` |
| `lumen-sdk/lumen/replay.py` | Python 封装的 `ReplayEngine`，直接读 trace JSON（无 PyO3，Phase 1）|
| `lumen-sdk/lumen/cost.py` | Python 封装的 `CostTracker`，`CostReport` dataclass |
| `lumen-sdk/lumen/agent.py` | `Agent` 类骨架，`run()` 抛 `NotImplementedError`（v0.2 补全）|
| `lumen-sdk/lumen/query.py` | `TraceQuery` — 链式 filter API：`.agent().since().execute()` |

## 三件套详解

### LumenTracer

LangChain `BaseCallbackHandler` 子类，挂在 `graph.invoke(config={"callbacks": [tracer]})` 上。

**关键机制**：
- `_chain_depth` 计数器跟踪嵌套 chain 层级。只有 `chain_depth <= 0` 时（最外层 chain 结束）才触发 `_write_trace()`，避免子链提前落盘。
- 每个 `LumenTracer` 实例是单 trace 对象。多次 `graph.invoke` 需要复用同一实例时，`_write_trace()` 末尾会重置 `_trace_id = ""`，下次调用自动初始化新 trace。
- 原子写盘：先写 `.{trace_id}.json.tmp`，再 `os.replace()` 原子重命名，防止读到半写文件。

**Token 提取优先级**：
1. `response.llm_output.token_usage`（OpenAI 格式）
2. `gen.message.usage_metadata.input_tokens / output_tokens`（Anthropic 格式）
3. 均未取到时 tokens 为 0，成本估算依赖 pricing 表 fallback

### LumenCheckpointer

替代 LangGraph 自带的 `SqliteSaver`（磁盘 I/O 约 100μs）和 `PostgresSaver`（网络 1ms+）。文件写盘实测约 3μs。

**内存结构**（镜像 LangGraph `InMemorySaver` 三层设计）：
- `_checkpoints[(thread_id, ns, checkpoint_id)]` → 序列化后的 checkpoint bytes（base64）
- `_blobs[(thread_id, ns, channel, version)]` → channel_values 分离存储
- `_metadata / _writes` → 元信息和 pending writes

**持久化**：每次 `put()` / `put_writes()` 调用后触发 `_save_thread(thread_id)`，仅写该 thread 的文件（`{safe_tid}.json`）。进程启动时 `_load_from_disk()` 全量恢复。

**已知限制**：无 async 接口（`aget_tuple` 等未实现），LangGraph async graph 需用同步版本或实现 async 包装。

### CostTracker

两个实现：Rust `lumen-core/src/cost.rs`（CLI 用）和 Python `lumen-sdk/lumen/cost.py`（SDK 用）。行为一致。

**成本估算优先级**：
1. `trace.total_cost_usd > 0` → 直接用（如 provider 在响应中返回成本）
2. 逐步从 `LlmCall` 步骤提取 tokens + pricing 表估算
3. fallback 用 `trace.total_tokens` 合计 + `"unknown"` 模型定价

**异常检测**：`cost > avg * 2.0 AND cost > $0.01`，阈值可通过 `LumenConfig` 的 `anomaly_multiplier` / `anomaly_min_usd` 调整。

## 配置参考

### lumen.toml（推荐放项目根目录）

```toml
[project]
name = "my-agent"
environment = "production"

[tracing]
enabled = true
trace_dir = "./traces"
sampling_rate = 1.0          # 0.0~1.0，生产可设 0.3 降低存储压力
content_capture = "full"     # full | metadata_only | off
buffer_size = 100            # >1 启用 BatchTraceWriter
flush_interval_ms = 5000

[tracing.redaction]
enabled = true
patterns = ["sk-[A-Za-z0-9]+", "Bearer [A-Za-z0-9._-]+"]

[cost]
budget_usd = 100.0
budget_period = "monthly"
alert_threshold_pct = 80
kill_on_budget_exceeded = false   # true 时超预算抛 BudgetExceededError
anomaly_multiplier = 2.0

[agent]
default_model = "claude-sonnet-4-6"
max_iterations = 25
max_cost_per_run_usd = 5.0
tool_timeout_secs = 120

[export.otlp]
enabled = true
endpoint = "http://grafana-alloy:4317"   # 接 Lurus Grafana stack
headers = { "x-lumen-project" = "my-agent" }
```

### 环境变量速查

| 变量 | 对应配置 | 说明 |
|---|---|---|
| `LUMEN_ENABLED` | `tracing.enabled` | `false` 关闭所有 trace |
| `LUMEN_TRACE_DIR` | `tracing.trace_dir` | trace 文件目录 |
| `LUMEN_SAMPLING_RATE` | `tracing.sampling_rate` | 采样率 |
| `LUMEN_BUDGET_USD` | `cost.budget_usd` | 全局预算 |
| `LUMEN_KILL_ON_BUDGET` | `cost.kill_on_budget_exceeded` | 超预算是否强杀 |
| `LUMEN_MAX_COST_PER_RUN` | `agent.max_cost_per_run_usd` | 单次 run 上限 |
| `LUMEN_OTLP_ENABLED` | `export.otlp_enabled` | 开启 OTLP 上报 |
| `LUMEN_OTLP_ENDPOINT` | `export.otlp_endpoint` | OTLP 接收端 |

## 部署与发布

### 本地开发（Kova 宿主机）

```bash
# R6 上的路径
cd /data/kova/lumen

# Rust 构建
cargo build -q 2>&1
cargo test -p lumen-core -p lumen-cli -q 2>&1

# Python SDK 安装
cd lumen-sdk && pip install -e ".[langgraph,openai,anthropic,dev]"

# 验证
lumen --version
python -c "import lumen; print(lumen.__version__)"
```

### PyPI 发布（手动，CI 暂未自动化）

```bash
cd 2c-cli-lumen/lumen-sdk
python -m build
twine check dist/*
twine upload dist/*   # 需要 PyPI token
```

### Crates.io 发布

```bash
cd 2c-cli-lumen
cargo publish -p lumen-core -q 2>&1
cargo publish -p lumen-cli -q 2>&1
```

### CI/CD 现状

目前**无 GHA 自动发布流水线**。PyPI 和 crates.io 均为手动发布。Python SDK 有完整测试套（`lumen-sdk/tests/`），Rust 有 11 个集成测试。发布前必须：
1. `cargo test -p lumen-core -p lumen-cli -- --nocapture` 全绿
2. `cargo clippy -p lumen-core -p lumen-cli -- -D warnings` 零警告
3. `cd lumen-sdk && python -m pytest` 全绿

## OTel 集成

当前状态：`LumenConfig.export.otlp_enabled` 字段和配置路径已就绪，但 OTLP span 导出**尚未实现**（配置解析完毕，实际导出代码待写）。

计划方案：Python SDK 通过 `opentelemetry-sdk` 在每次 `TraceSession.finalize()` 时创建 OTel span，附加以下 attributes：

```
lumen.trace_id        = <uuid>
lumen.agent_name      = <str>
lumen.model           = <str>
lumen.prompt_tokens   = <int>
lumen.completion_tokens = <int>
lumen.cost_usd        = <float>
lumen.iterations      = <int>
lumen.status          = Completed | Failed
```

上报目标：Lurus Grafana stack（`grafana.lurus.cn`）上已有 Tempo（trace）+ Prometheus（metrics）+ Loki（logs）。接入路径为 Grafana Alloy → Tempo。

## 已知坑（内部专属）

1. **跨语言定价表双写**：`lumen-core/src/pricing.rs` 和 `lumen-sdk/lumen/pricing.py` 是两份独立拷贝。新模型上线需手动同步两处，已有 1 次漏更。计划 Phase 2 通过 PyO3 统一到 Rust 实现。

2. **LumenCheckpointer 无 async 接口**：LangGraph async graph（`ainvoke`）在某些版本会调用 `aget_tuple`，Lumen 的同步实现会触发 `RuntimeError: coroutine never awaited`。临时方案：LangGraph 回退同步 `invoke`，或手动实现 async 委托。

3. **LangGraph checkpoint API 版本漂移**：`BaseCheckpointSaver` 接口在 `langgraph-checkpoint` 2.x → 3.x → 4.x 多次变化（`put_writes` 签名、`task_path` 参数）。当前 `pyproject.toml` 的范围 `>=2.0,<5.0` 较宽，遇到接口不兼容时会在 `get_tuple` 内部抛 `TypeError`。

4. **Python GIL 与 BatchTraceWriter**：`BatchTraceWriter` 后台线程受 GIL 限制，高频 trace（>500 calls/s）时 flush 可能滞后。CPU 密集型 agent 建议关闭 buffer（`buffer_size=1`）或用 `ProcessPoolExecutor` 隔离 LLM 调用。

5. **CLI 跨平台编译**：`lumen-cli` 面向开发者分发，需要为 `x86_64-unknown-linux-gnu` / `x86_64-apple-darwin` / `aarch64-apple-darwin` / `x86_64-pc-windows-msvc` 四个 target 交叉编译。目前尚无 GHA matrix build，只能在各平台手动编译。

6. **trace_reader 静默跳过损坏文件**：`load_traces()` 对 JSON 解析失败的文件仅 `tracing::debug` 跳过，不向调用方报错。如果 trace 文件因磁盘满或系统崩溃中途被截断，CLI 会静默忽略这些 trace 而不给出任何警告。

7. **on_tool_end 的 tool_name 依赖 kwargs**：`LumenTracer.on_tool_end()` 通过 `kwargs.get("name", "unknown_tool")` 获取工具名，这是 LangChain callback 协议的非 positional 参数。不同版本的 LangGraph 传递方式有差异，部分版本会导致 `tool_name="unknown_tool"` 记录。

8. **ReplayEngine Phase 1 局限**：当前回放仅从 trace JSON 重建步骤序列，不重新执行 LLM 调用，因此回放内容为原始执行的摘要而非完整输出。`finish_reason = "end_turn"` 时 final answer 显示为 `"Agent completed (end_turn)"` 而非实际文本内容。

## 决策档案

| 时间 | 决策 | 理由 |
|---|---|---|
| 2026-Q1 | Python-first 对外，Rust 作隐藏引擎 | 目标用户（LangGraph 开发者）只关心 `pip install`，Rust 提供性能保障无需暴露 |
| 2026-Q1 | 独立品牌（lumen，非 lurus-lumen） | 2C 开发者工具需要中立身份，避免与 B2B Lurus 品牌混淆 |
| 2026-Q1 | 文件存储而非 SQLite/PG | 零外部依赖，3μs 写入，开发者本地直接用，不需要数据库配置 |
| 2026-Q1 | Replay 为核心杀手功能 | 竞品（Langsmith、Arize）做观测，Lumen 做确定性回放，差异化明确 |
| 2026-Q1 | `kova-types` 零 tokio 依赖 | lumen-core 不引入 async runtime，保持纯同步，避免 tokio 版本冲突 |
| 2026-Q2 | Phase 1 回放从 JSON 而非 WAL | WAL 级别回放需要 kova engine 深度集成，Phase 1 先交付价值再做深度集成 |

## Roadmap

- [x] P0: LangGraph CheckpointSaver（已完成）
- [x] P1: Cost 聚合 + Replay engine（已完成，lumen-core）
- [x] P1: Python SDK instrument() auto-patch（OpenAI + Anthropic + LangGraph）
- [x] P1: BudgetTracker / AnomalyDetector / EventBus（已完成）
- [ ] P2: Python SDK → lumen-core PyO3 wiring（统一定价表，性能提升）
- [ ] P2: OTel OTLP span 导出实现（接 Grafana Tempo）
- [ ] P2: Web dashboard（`lumen dashboard`，port 9700）
- [ ] P2: GHA CI matrix（4 平台交叉编译 + PyPI 自动发布）
- [ ] P2: LumenCheckpointer async 接口（`aget_tuple` / `aput` / `aput_writes`）
- [ ] P3: `Agent.run()` 直接执行（v0.2，接 Kova WAL engine）
- [ ] P3: CrewAI / AutoGen 集成
- [ ] P3: 定价表统一服务（从 Lurus NewAPI 拉取最新价格，不再手动双写）

## 应急 Runbook

### Trace 丢失 / 找不到 trace

```bash
# 1. 确认 trace_dir 路径是否正确（默认 ./traces，可被 lumen.toml 覆盖）
ls -la ./traces/

# 2. 确认文件是否存在（注意：临时文件以 . 开头，已完成的应无 .tmp 后缀）
ls -la ./traces/*.json

# 3. 手动验证 JSON 格式
python -c "import json; json.load(open('./traces/<trace_id>.json'))"

# 4. 检查磁盘空间（BatchTraceWriter 在磁盘满时静默跳过写盘）
df -h .

# 5. 确认 instrument() 或 LumenTracer 是否正确初始化
python -c "from lumen import instrument; r = instrument(); print(r)"
# 期望: {'openai': True, 'anthropic': True, 'langgraph': True}

# 6. 若使用 BatchTraceWriter，检查 flush 是否发生
# 调用 uninstrument() 会触发强制 flush
python -c "from lumen import uninstrument; uninstrument()"
```

### Replay 失败

```bash
# 错误: "trace not found: <trace_id>"
# → trace_dir 不匹配，用 --trace-dir 显式指定
lumen replay <trace_id> --trace-dir /path/to/traces

# 错误: "JSON error: ..."
# → trace 文件损坏，检查文件内容
python -c "
import json, sys
with open('./traces/<trace_id>.json') as f:
    try:
        d = json.load(f)
        print('OK:', d['trace_id'], d['status'])
    except Exception as e:
        print('CORRUPT:', e)
"

# 错误: 步骤数量不对 / 工具名全是 unknown_tool
# → 使用了旧版 LangGraph，tool_name 通过 kwargs 传递失败
# → 升级 langchain-core >= 0.3.20 或检查 on_tool_end 的 kwargs
```

### Checkpoint 损坏 / 无法恢复

```bash
# 1. 列出所有 checkpoint 文件
ls -la ./checkpoints/

# 2. 验证 checkpoint 文件结构
python -c "
import json
data = json.load(open('./checkpoints/<thread_id>.json'))
print('checkpoints:', len(data.get('checkpoints', {})))
print('blobs:', len(data.get('blobs', {})))
print('metadata:', len(data.get('metadata', {})))
"

# 3. 如果文件损坏（JSON 无效），删除后重新运行（丢失该 thread 状态）
rm ./checkpoints/<thread_id>.json

# 4. 如果多个 checkpoint 版本导致 get_tuple 返回错误版本
# → 在 config 中显式指定 checkpoint_id
graph.invoke(input, config={
    "configurable": {"thread_id": "t1", "checkpoint_id": "<known_good_id>"}
})
```

### SDK 版本不匹配（langgraph-checkpoint 接口变更）

```bash
# 症状: TypeError in get_tuple / put / put_writes
# 检查当前版本
pip show langgraph-checkpoint langchain-core lumen-ai

# 已验证兼容版本组合（2026-04）
# lumen-ai==0.2.0 + langgraph-checkpoint==2.x / 3.x + langchain-core==0.3.x

# 降级到已知兼容版本
pip install "langgraph-checkpoint>=2.0,<3.0" "langchain-core>=0.3,<0.4" "lumen-ai==0.2.0"

# 若使用 lumen-ai[all]，确认所有可选依赖同步更新
pip install "lumen-ai[all]==0.2.0"
```

### 成本报告异常（数字为 0 或偏低）

```bash
# 原因 1: LLM provider 未返回 token 数，需要手动启用 usage 上报
# OpenAI: 确认请求中 stream_options.include_usage=true（streaming 时）
# Anthropic: 默认返回 usage，检查 anthropic-sdk >= 0.40

# 原因 2: model 名称无法匹配定价表，fallback 到 unknown ($1.00/$3.00 per 1K)
python -c "
from lumen.pricing import estimate_cost
print(estimate_cost('your-model-name-here', 1000, 200))
# 如果结果是 (1000*1.0 + 200*3.0)/1000 = 1.6，说明走了 fallback
"

# 解决: 在 lumen.toml 中注册自定义定价
# [cost.custom_pricing]
# "your-model" = { prompt = 2.0, completion = 8.0 }

# 或通过 SDK
from lumen.pricing import register_custom_pricing
register_custom_pricing({"your-model": (2.0, 8.0)})
```

### OTel trace 未出现在 Grafana

```bash
# 1. 确认 OTLP 配置
python -c "
from lumen import LumenConfig
c = LumenConfig.auto()
print('otlp_enabled:', c.export.otlp_enabled)
print('otlp_endpoint:', c.export.otlp_endpoint)
"

# 2. 注意：当前 OTel span 导出尚未实现（Phase 2），
# 即使配置正确也不会有数据推送到 Grafana Tempo。
# 状态: 待实现。

# 临时方案: 用 lumen cost --format json 导出数据，
# 通过 Grafana HTTP API 手动 push 到 Loki 作为日志
lumen cost --last 7d --format json | \
  curl -s -X POST http://loki.lurus.cn/loki/api/v1/push \
  -H "Content-Type: application/json" -d @-
```
