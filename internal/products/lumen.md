---
title: Lumen
id: lumen
group: kova
priority: P1
status: dev
owner: marvin (+ AI assist)
lastReviewed: 2026-05-28
sourcePath: 2c-cli-lumen
---

# Lumen 内部手册

> 🟡 **2026-05-28 状态更新**：alpha 阶段（早于 beta）。

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

---

## 多视角速览

### 用户视角（AI 应用开发者）

Lumen 是一个 CLI + Python SDK，帮助开发者在本地命令行操控 agent 的完整生命周期：

- `lumen init` — 初始化项目配置（生成 `lumen.toml`）
- `lumen agent dev` — 启动开发模式监听，实时打印 trace 摘要
- `lumen agent list / inspect <trace_id>` — 查看历史执行记录
- `lumen replay <trace_id>` — 零成本回放某次执行，逐步还原每个 LLM 调用
- `lumen cost --last 7d` — 统计近期 token 消耗与费用
- `lumen deploy` — 将 agent 打包推送到 Kova engine 托管执行
- `lumen doctor` — 一键体检本地环境（依赖、配置、连通性）
- `lumen workflow` — 管理多步 agent 工作流的声明式编排
- `lumen mcp` — 管理本地 MCP server 注册与生命周期

面向人群：用 LangGraph / OpenAI SDK / Anthropic SDK 写 agent 的 Python 开发者；无需了解 Kova 或 Lurus 内部架构。

### 开发者视角（Lumen 贡献者）

Lumen 采用 **Rust + Python 双层架构**：

- **lumen-core**（Rust，`Edition 2024`）：核心引擎，提供 `replay`、`cost`、`trace`、`pricing` 四大模块；`#![forbid(unsafe_code)]`，`unwrap_used / expect_used / panic = deny`。
- **lumen-cli**（Rust，`clap` 4.x）：终端子命令入口，所有子命令通过 `lumen-core` 完成计算。
- **lumen-sdk**（Python）：`pip install lumen-ai[langgraph,openai,anthropic]`；通过 monkey-patch 实现零侵入 instrument；`LumenCheckpointer` 替换 `SqliteSaver`；`LumenTracer` 实现 `BaseCallbackHandler`。

关键子命令对应代码路径：

| 命令 | Rust 入口 | 核心模块 |
|---|---|---|
| `lumen agent` | `lumen-cli/src/cmd/agent.rs` | lumen-core trace + replay |
| `lumen mcp` | `lumen-cli/src/cmd/mcp.rs` | 本地进程管理 |
| `lumen workflow` | `lumen-cli/src/cmd/workflow.rs` | YAML 工作流解析 |
| `lumen deploy` | `lumen-cli/src/cmd/deploy.rs` | Kova HTTP API |
| `lumen doctor` | `lumen-cli/src/cmd/doctor.rs` | 环境探测 |
| `lumen init` | `lumen-cli/src/cmd/init.rs` | 模板生成 |

### 运维视角

Lumen 在运维层面承担两个角色：

1. **Kova Checkpointer**：Kova engine 托管的 agent 在执行时，通过 `LumenCheckpointer` 将每个 LangGraph checkpoint 写入本地文件（开发环境）或 PostgreSQL（生产环境，`lurus-pg-rw.database.svc:5432`）。进程崩溃后 Kova 可调用 `get_tuple` 从最后 checkpoint 续跑，实现断点恢复，无需重跑已完成步骤。

2. **OTel Exporter**：配置 `LUMEN_OTLP_ENABLED=true` + `LUMEN_OTLP_ENDPOINT` 后，每次 `TraceSession.finalize()` 向 Grafana Alloy（`grafana-alloy:4317`）推送 OpenTelemetry span，包含 `lumen.cost_usd`、`lumen.iterations`、`lumen.model` 等自定义 attribute。Grafana Tempo 接收后可按 agent 名称、模型、成本等维度聚合查询。⚠ 当前 Phase 1 OTLP 实现待完成，仅配置已就绪。

运维关注点：
- trace 文件落在 `/data/kova/lumen/traces/`（R6）；注意磁盘水位，`df -h /data`。
- checkpoint 文件落在 `/data/kova/lumen/checkpoints/`；定期 `ls -lt` 确认无 `.tmp` 残留。
- `lumen doctor` 可输出 JSON，接入 Prometheus pushgateway 做健康基线。

### 决策者视角

Lumen 为内部 AI 项目解决两个长期成本问题：

| 痛点 | 现有方案 | Lumen 替换方案 |
|---|---|---|
| LangGraph checkpoint 持久化 | SQLite（本地脆弱）/ PostgreSQL（配置复杂） | `LumenCheckpointer`：dev 用文件 3μs / prod 用 PG，统一 API 无缝切换 |
| Agent 执行 trace 可观测 | 自建 `print` / LangSmith（SaaS，外部数据） | `LumenTracer` + `lumen replay`：本地文件，零 API 成本，数据不出境 |
| Token 成本审计 | 无系统性统计 | `lumen cost` + BudgetTracker：按项目、模型、时间段聚合 |
| 执行异常发现 | 人工检查 | `AnomalyDetector` 滑动窗口自动报警，阈值可调 |

替代关系：**`LumenCheckpointer` 替代 LangGraph `SqliteSaver` + 自建 PG checkpoint 表；`LumenTracer` + `lumen cost` 替代 LangSmith trace + 自建成本统计。** 商业 SaaS 替代品（LangSmith Pro）价格约 $200/月起，Lumen 自托管成本趋近于零。

---

## 决策树：什么时候装 Lumen

```mermaid
graph TD
    A[我在开发 AI Agent] --> B{使用 LangGraph / OpenAI SDK\n / Anthropic SDK?}
    B -- 否 --> Z1[暂不需要 Lumen\n其他框架支持 roadmap 中]
    B -- 是 --> C{需要本地 replay\n还原执行过程?}
    C -- 是 --> D[✓ 安装 lumen-ai\n用 LumenTracer 采集 trace\n用 lumen replay 回放]
    C -- 否 --> E{需要 checkpoint\n断点续跑?}
    E -- 是 --> F[✓ 安装 lumen-ai\n用 LumenCheckpointer\n替换 SqliteSaver]
    E -- 否 --> G{需要统计\ntoken 成本?}
    G -- 是 --> H[✓ 安装 lumen-ai\nlumen cost --last 7d]
    G -- 否 --> I{需要部署 agent\n到 Kova 托管执行?}
    I -- 是 --> J[✓ 安装 lumen-cli\nlumen deploy]
    I -- 否 --> K{想做本地 MCP\nserver 管理?}
    K -- 是 --> L[✓ 安装 lumen-cli\nlumen mcp manage]
    K -- 否 --> M[✓ 仍建议安装\nlumen doctor 可体检本地 AI 环境\n零配置，pip install lumen-ai 即用]

    style D fill:#d4edda
    style F fill:#d4edda
    style H fill:#d4edda
    style J fill:#d4edda
    style L fill:#d4edda
    style M fill:#d4edda
    style Z1 fill:#f8d7da
```

---

## 典型时序图

```mermaid
sequenceDiagram
    participant DEV as 开发者本地机
    participant LCLI as lumen CLI
    participant SDK as lumen-ai (Python SDK)
    participant NEWAPI as Lurus NewAPI\nnewapi.lurus.cn
    participant DISK as 本地磁盘\n./traces/ & ./checkpoints/
    participant CORE as lumen-core (Rust)

    DEV->>LCLI: lumen init
    LCLI->>DEV: 生成 lumen.toml (trace_dir, budget, model...)

    DEV->>SDK: from lumen import instrument, LumenCheckpointer, LumenTracer
    DEV->>SDK: instrument()  # 自动 patch OpenAI / Anthropic
    DEV->>SDK: checkpointer = LumenCheckpointer("./checkpoints")
    DEV->>SDK: tracer = LumenTracer()

    DEV->>SDK: graph.invoke(input, config={"callbacks":[tracer],\n  "configurable":{"thread_id":"t1"}})

    SDK->>SDK: on_chain_start → _chain_depth++
    SDK->>NEWAPI: POST /v1/chat/completions (Bearer OPENAI_KEY)
    NEWAPI-->>SDK: {choices, usage:{prompt_tokens, completion_tokens}}

    SDK->>SDK: on_llm_end → estimate_cost(model, tokens)
    SDK->>SDK: on_tool_start → _tool_start_ms = now()
    SDK->>SDK: on_tool_end → 追加 ToolCall 步骤
    SDK->>SDK: on_chain_end (depth→0) → _write_trace()
    SDK->>DISK: 原子写 .{trace_id}.json.tmp → rename → {trace_id}.json
    SDK->>DISK: put() → 原子写 checkpoints/t1.json

    Note over DEV: 开发者想复盘执行过程

    DEV->>LCLI: lumen replay <trace_id>
    LCLI->>CORE: load_traces("./traces") → serde_json::from_slice
    CORE->>CORE: build_replay_steps: LlmCall + ToolCall → ReplayStep 序列
    CORE-->>LCLI: ReplayTrace {steps, original_cost_usd, total_tokens}
    LCLI->>DEV: 终端逐步打印：Step 1 [LLM] gpt-4o ... $0.0012\nStep 2 [Tool] search_web ...

    Note over DEV: 进程崩溃后重启

    DEV->>SDK: graph.invoke(input, config={"configurable":{"thread_id":"t1"}})
    SDK->>DISK: get_tuple("t1") → 读 checkpoints/t1.json
    SDK->>SDK: 从最后 checkpoint 恢复，跳过已完成步骤
    SDK-->>DEV: agent 继续执行，无需重跑前序步骤
```

---

## 端到端完整例子

以下示例展示从零开始，用 Lumen 替换 LangGraph `SqliteSaver`，采集 trace，并通过 `lumen replay` 还原执行过程。

### 第一步：初始化项目

```bash
# 安装 Lumen（包含 LangGraph 集成）
pip install "lumen-ai[langgraph,openai]"

# 初始化配置
lumen init
# 生成 lumen.toml：
# [tracing] trace_dir="./traces"
# [cost] budget_usd=10.0
# [agent] default_model="gpt-4o-mini"
```

### 第二步：编写 LangGraph Agent（原始版本，使用 SqliteSaver）

```python
# agent_original.py — 演示替换前的写法
from langgraph.checkpoint.sqlite import SqliteSaver
from langgraph.graph import StateGraph, MessagesState

def call_model(state):
    # ... LLM 调用
    pass

builder = StateGraph(MessagesState)
builder.add_node("agent", call_model)
builder.set_entry_point("agent")
builder.set_finish_point("agent")

# 旧写法：SqliteSaver，无 trace，无成本统计
with SqliteSaver.from_conn_string("checkpoints.db") as memory:
    graph = builder.compile(checkpointer=memory)
    result = graph.invoke({"messages": [{"role":"user","content":"hello"}]},
                          config={"configurable":{"thread_id":"t1"}})
```

### 第三步：用 LumenCheckpointer 替换 SqliteSaver，并加入 LumenTracer

```python
# agent_lumen.py — 替换后
from lumen import instrument, LumenTracer
from lumen.integrations.langgraph import LumenCheckpointer
from langgraph.graph import StateGraph, MessagesState
from openai import OpenAI

# 1. 开启全局 instrument（自动 patch OpenAI）
instrument()

client = OpenAI()

def call_model(state):
    messages = state["messages"]
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": m["role"], "content": m["content"]} for m in messages],
    )
    return {"messages": [{"role": "assistant",
                          "content": response.choices[0].message.content}]}

builder = StateGraph(MessagesState)
builder.add_node("agent", call_model)
builder.set_entry_point("agent")
builder.set_finish_point("agent")

# 2. 替换 checkpointer（一行改动）
checkpointer = LumenCheckpointer("./checkpoints")  # 替换 SqliteSaver
tracer = LumenTracer()                             # 新增 trace 采集

graph = builder.compile(checkpointer=checkpointer)

result = graph.invoke(
    {"messages": [{"role": "user", "content": "用一句话解释什么是 RAG"}]},
    config={
        "callbacks": [tracer],                      # 新增
        "configurable": {"thread_id": "demo-001"}
    }
)
print(result["messages"][-1]["content"])
```

### 第四步：查看 trace 并统计成本

```bash
# 列出所有 trace
lumen traces
# 输出示例：
# trace_id                              agent         status     cost      steps  time
# a3f8c12d-...                          unknown       Completed  $0.0008   3      2026-04-29 10:23

# 查看成本汇总
lumen cost --last 24h
# 输出：Total: $0.0008 | Models: gpt-4o-mini | Traces: 1

# 检查是否有预算异常
lumen cost --last 7d --anomaly
```

### 第五步：用 lumen replay 还原执行

```bash
lumen replay a3f8c12d-...
# 输出：
# Replaying trace a3f8c12d (3 steps, original cost: $0.0008)
# ─────────────────────────────────────────────────────────
# Step 1 [LangChain/Chain] RunnableSequence
#   Duration: 1243ms
# Step 2 [LLM] gpt-4o-mini
#   Prompt tokens: 52 | Completion tokens: 38
#   Cost: $0.0008 | Finish: stop
# Step 3 [LangChain/Chain] RunnableSequence (end)
# ─────────────────────────────────────────────────────────
# Replay complete. Total cost: $0.0008 | Steps: 3
```

### 第六步：模拟进程崩溃后断点续跑

```bash
# 假设 agent 在第 N 步崩溃，重启后直接 invoke 相同 thread_id
python agent_lumen.py
# LumenCheckpointer 从 ./checkpoints/demo-001.json 恢复
# LangGraph 跳过已完成节点，从断点继续
```

### 第七步：体检环境

```bash
lumen doctor
# 输出：
# ✓ lumen-ai 0.2.0 installed
# ✓ lumen-cli 0.1.0 installed
# ✓ LUMEN_TRACE_DIR: ./traces (writable)
# ✓ LUMEN_BUDGET_USD: 10.0
# ⚠ LUMEN_OTLP_ENABLED: true but endpoint unreachable (grafana-alloy:4317)
# ✓ langgraph-checkpoint: 3.x (compatible)
# ✓ openai: 1.x (patched)
```

---

## 最佳实践 ✓/✗

| # | ✓ 推荐做法 | ✗ 反模式 |
|---|---|---|
| 1 | ✓ 本地开发用 `LumenTracer` + `lumen cost` 自带成本统计，trace 落本地文件，零额外费用 | ✗ 自己在代码里 `print(f"tokens: {usage.total_tokens}")` 分散、不聚合、不可查询 |
| 2 | ✓ checkpoint store 开发期用文件（`LumenCheckpointer("./checkpoints")`，3μs 写入，零配置），生产切 PostgreSQL（同一 API） | ✗ 永远用 SQLite (`SqliteSaver`)，生产环境并发写入冲突，崩溃恢复不可靠 |
| 3 | ✓ `lumen deploy` 将 agent 打包推送到 Kova engine，统一生命周期管理，可监控 | ✗ 手工 `docker build && docker push`，镜像 tag 随意，无版本追踪，Kova 侧不可见 |
| 4 | ✓ 首次上线或修改配置后跑 `lumen doctor`，提前发现依赖版本冲突 / 目录不可写 / OTel 连通失败 | ✗ 出了问题再排查，尤其 `langgraph-checkpoint` 接口漂移导致的 `TypeError` 难定位 |
| 5 | ✓ 用 `lumen mcp manage` 集中注册和启停本地 MCP server，配置统一存 `lumen.toml` | ✗ 各项目目录各自散落 `mcp_config.json`，版本不一，端口冲突无人知晓 |
| 6 | ✓ 开启 `LUMEN_OTLP_ENABLED=true` 接 Lurus Grafana（`grafana.lurus.cn` Tempo），生产 agent 有全链路 trace | ✗ 没有任何监控，成本飙升 / 失败率上升只能靠人工发现 |
| 7 | ✓ 生产环境设 `sampling_rate = 0.3`（`lumen.toml`），减少存储压力；关键 agent 设 `1.0` | ✗ 全量采样不分场景，高频 agent 磁盘迅速耗尽（参见 R5 根盘 90% 教训） |
| 8 | ✓ `BudgetTracker` 设 `kill_on_budget_exceeded = true`（测试环境），阻止失控 agent 烧光预算 | ✗ 无预算上限，agent 进入死循环或 tool call 失控时无任何止损机制 |

---

## 跨产品集成场景

### 场景 ① — Lumen + Kova（开发到生产的全流程）

Lumen 是 Kova 生态的**开发者入口**，两者形成 dev → prod 闭环：

1. **本地开发阶段**：开发者用 `pip install lumen-ai` + `LumenCheckpointer` + `LumenTracer` 在本地迭代 agent，所有状态落文件，`lumen replay` 本地调试。
2. **测试验证阶段**：`lumen cost` 统计 token 消耗，`lumen doctor` 体检，确认 agent 行为符合预期。
3. **部署阶段**：`lumen deploy` 将 agent 配置（`lumen.toml` + agent 代码）打包，通过 Kova HTTP API 推送到 Kova engine（`kova.lurus.cn`）托管执行。
4. **生产监控阶段**：Kova engine 内部调用 `LumenCheckpointer`（指向生产 PG `lurus-pg-rw.database.svc:5432`）持久化 checkpoint，同时通过 OTLP 推送 span 到 Grafana Tempo；运维在 `grafana.lurus.cn` 按 `lumen.agent_name` 筛选查看。

关键数据流：
```
本地 ./checkpoints/*.json  ──lumen deploy──>  Kova engine
                                                  │
                                         LumenCheckpointer
                                                  │
                                         lurus-pg / lumen schema
```

⚠ 当前状态：`lumen deploy` 命令骨架已在 roadmap，Kova engine 深度集成在 Phase 2（P3）。

### 场景 ② — Lumen + LangGraph（一行替换 checkpointer）

LangGraph 默认提供 `MemorySaver`（进程内，重启丢失）、`SqliteSaver`（单机文件 DB）、`PostgresSaver`（需建表，配置复杂）三种 checkpointer。Lumen 提供第四选项，适配开发与生产两种场景：

| Checkpointer | 写延迟 | 外部依赖 | 持久化 | 推荐场景 |
|---|---|---|---|---|
| `MemorySaver` | ~1μs | 无 | ✗ | 单元测试 |
| `SqliteSaver` | ~100μs | sqlite3 | ✓ | 简单本地开发 |
| `LumenCheckpointer` (文件) | ~3μs | 无 | ✓ | 本地开发 / CI |
| `LumenCheckpointer` (PG) | ~1ms | PostgreSQL | ✓ | 生产 |
| `PostgresSaver` | ~1ms | PostgreSQL | ✓ | 生产（无 Lumen trace） |

迁移步骤（两行代码）：

```python
# 替换前
from langgraph.checkpoint.sqlite import SqliteSaver
memory = SqliteSaver.from_conn_string("ckpts.db")

# 替换后（开发环境）
from lumen.integrations.langgraph import LumenCheckpointer
memory = LumenCheckpointer("./checkpoints")

# 替换后（生产环境，指向 lurus PG）
memory = LumenCheckpointer(
    backend="postgres",
    dsn="postgresql://lurus:***@lurus-pg-rw.database.svc:5432/lurus?options=-csearch_path=lumen"
)
```

迁移后立即获得：checkpoint 原子写盘、`lumen traces` 可查、`lumen replay` 可回放、`lumen cost` 可统计。

---

## 运维常见问题

```mermaid
flowchart TD
    START([运维告警 / 开发遇到问题]) --> Q1{问题类型?}

    Q1 --> A1[lumen init 失败]
    Q1 --> A2[checkpointer 写失败]
    Q1 --> A3[replay 数据不一致]
    Q1 --> A4[OTel 连不上 Grafana]
    Q1 --> A5[mcp server 启动失败]
    Q1 --> A6[成本数字为 0 / 偏低]
    Q1 --> A7[checkpoint 无法恢复]

    A1 --> B1{原因?}
    B1 --> B1A[目录无写权限] --> C1A[chmod 755 ./traces ./checkpoints\n或改 trace_dir 到可写目录]
    B1 --> B1B[lumen-cli 未安装] --> C1B[pip install lumen-ai\n或 cargo install lumen-cli]
    B1 --> B1C[lumen.toml 格式错误] --> C1C[lumen doctor 输出 parse error\n检查 TOML 语法]

    A2 --> B2{磁盘空间?}
    B2 -- df -h /data 不足 --> C2A[清理旧 trace 文件\nfind ./traces -mtime +30 -delete]
    B2 -- 空间足够 --> C2B[检查 .tmp 残留文件\n说明上次进程异常退出\nrm ./checkpoints/*.tmp]

    A3 --> B3{原因?}
    B3 --> B3A[replay 版本 ≠ 执行版本] --> C3A[lumen replay 显示的是原始 trace 快照\n不重新执行 LLM，属正常行为]
    B3 --> B3B[trace 文件被截断] --> C3B[python -c 'import json;json.load(open(f))'\n损坏则 rm 后重新执行]
    B3 --> B3C[tool_name 全是 unknown_tool] --> C3C[升级 langchain-core>=0.3.20\n或检查 on_tool_end kwargs 传递]

    A4 --> B4{配置检查}
    B4 --> B4A[LUMEN_OTLP_ENABLED=false\n或未设] --> C4A[设置环境变量或 lumen.toml\nexport.otlp_enabled=true]
    B4 --> B4B[OTel 实现未完成] --> C4B[⚠ Phase 1：OTLP 导出代码未实现\n临时用 lumen cost --format json\n手动 push 到 Loki]
    B4 --> B4C[grafana-alloy 不可达] --> C4C[curl -v grafana-alloy:4317\n检查 K8s service 与 network policy]

    A5 --> B5{mcp server 状态}
    B5 --> B5A[端口冲突] --> C5A[lumen mcp list 查看已注册 server\n修改 port 配置后 lumen mcp restart]
    B5 --> B5B[二进制不存在] --> C5B[lumen mcp manage --check\n按提示安装对应 MCP server]
    B5 --> B5C[配置文件损坏] --> C5C[~/.lumen/mcp.toml 格式检查\nlumen doctor 会报出 parse error]

    A6 --> B6[见 应急 Runbook\n成本报告异常 章节]

    A7 --> B7{checkpoint 文件状态}
    B7 --> B7A[文件不存在] --> C7A[thread_id 首次运行，正常\n检查 checkpoint_dir 路径是否一致]
    B7 --> B7B[JSON 损坏] --> C7B[备份后 rm ./checkpoints/tid.json\n丢失该 thread 状态，重新执行]
    B7 --> B7C[async 接口报错] --> C7C[LumenCheckpointer 无 async 实现\n用同步 graph.invoke 替代 ainvoke]

    style C1A fill:#d4edda
    style C1B fill:#d4edda
    style C1C fill:#d4edda
    style C2A fill:#d4edda
    style C2B fill:#d4edda
    style C3A fill:#fff3cd
    style C3B fill:#d4edda
    style C3C fill:#d4edda
    style C4B fill:#f8d7da
    style C4C fill:#d4edda
    style C5A fill:#d4edda
    style C5B fill:#d4edda
    style C5C fill:#d4edda
    style C7A fill:#fff3cd
    style C7B fill:#d4edda
    style C7C fill:#f8d7da
```

appended 291 lines, 4 mermaid charts to lumen.md
