---
title: MemX クイックスタート
description: 5 分で MemX AI アダプティブメモリエンジンのコア機能を体験。
---

<div class="memx-qs">

# クイックスタート

5 分で MemX のコア機能を体験：インストール → 初期化 → 書き込み → 検索 → ステータス確認。

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">前提条件</p>
    <div class="lurus-callout__body"><p>Python 3.9+ · pip · Lurus <Term t="API Key">API Key</Term>（<a href="/ja/guide/get-api-key">取得方法</a>、hybrid モードでは LLM 精錬に使用）。所要時間は約 5 分。</p></div>
  </div>
</div>

## 接続方式を選ぶ

MemX は **Python SDK / REST / MCP** の 3 種類の接続形態を提供します。以下では「書き込み + 検索」で説明します。使い慣れた方式を選んでください（パラメータは 3 者で統一されています）：

:::tabs
== Python SDK

```python
from memx import Memory

m = Memory(config={"ace_enabled": True})

# 从一段对话中学习
m.add([
    {"role": "user", "content": "pytest 超时怎么办？"},
    {"role": "assistant", "content": "用 pytest -x --timeout=30 逐个排查"},
], user_id="dev1", scope="project:backend")

# 检索
results = m.search("pytest 调试", user_id="dev1")
```

== REST

```bash
# 写入（POST /v1/memories）
curl -X POST https://memx.lurus.cn/v1/memories \
  -H "Authorization: Bearer $MEMX_KEY" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"pytest 超时怎么办？"}],"user_id":"dev1"}'

# 检索（GET /v1/memories/search）
curl "https://memx.lurus.cn/v1/memories/search?query=pytest+调试&user_id=dev1&limit=5" \
  -H "Authorization: Bearer $MEMX_KEY"
```

== MCP

MemX は MCP server の形態でメモリ操作を agent ツールとして公開し、Claude / Codex などの MCP クライアントから呼び出せます（パラメータは REST と統一）：

- `memory_add` — 知識を書き込む（`content`、`user_id`）
- `memory_search` — セマンティック検索（`query`、`limit`、`user_id`）
- `memory_delete` — エントリを削除（`memory_id`）
:::

以下のステップ別チュートリアルは Python SDK を例にしますが、REST / MCP も同様です。

<ol class="lurus-steps">

<li>

**インストール**

```bash
pip install git+https://github.com/UU114/memx.git
# 完整安装：pip install "git+https://github.com/UU114/memx.git#egg=memx[all]"
```

Python 3.9+ が必要です。初回実行時にローカル埋め込みモデル（約 90MB）が自動で `~/.memx/models/` にダウンロードされます。

</li>

<li>

**初期化**

```python
from memx import Memory
m = Memory(config={"ace_enabled": True})   # 开启 ACE 引擎（核心功能）
```

ACE を有効にすると、すべての書き込みと検索がインテリジェントパイプラインで処理されます。デフォルト設定でほとんどのシナリオに対応できます。

</li>

<li>

**知識を書き込む**

対話から知識を自動的に抽出・学習します：

```python
# 从一段对话中学习
result = m.add(
    [
        {"role": "user", "content": "pytest 总是超时怎么办？"},
        {"role": "assistant", "content": "试试 pytest -x --timeout=30，逐个测试跑可以定位慢的用例"}
    ],
    user_id="developer_1",
    scope="project:my-backend"
)

print(result)
# {
#   "ace_ingest": {
#     "bullets_added": 1,
#     "bullets_merged": 0,
#     "bullets_skipped": 0,
#     "privacy_filtered": 0
#   }
# }
```

知識を手動で注入することもできます：

```python
# 手动添加一条经验
m.add(
    "部署前必须运行 go test -race ./... 检查竞态条件",
    user_id="developer_1",
    scope="project:my-backend",
    metadata={"knowledge_type": "method", "section": "workflow"}
)
```

</li>

<li>

**知識を検索する**

```python
results = m.search(
    "pytest 调试技巧",
    user_id="developer_1",
    scope="project:my-backend"
)

for item in results["results"]:
    print(f"[{item['score']:.2f}] {item['memory']}")
# [0.87] pytest 超时问题：使用 -x --timeout=30 逐个运行定位慢用例
```

検索は 4 層の検索結果（厳密一致 + あいまい一致 + メタデータ + セマンティック）を自動的に統合し、時間減衰とスコープのマッチングも考慮します。

</li>

<li>

**ナレッジベースのステータスを確認する**

```python
status = m.status(user_id="developer_1")
print(status)
# {
#   "total_memories": 42,
#   "by_section": {"debugging": 12, "workflow": 8, "tools": 6, ...},
#   "avg_decay_weight": 0.73,
#   "permanent_count": 5,
#   "archive_candidates": 2
# }
```

</li>

</ol>

## CLI クイック体験

```bash
memx status                              # 知识库统计
memx search "pytest 调试"                # 搜索
memx learn "always use -v flag ..."      # 手动添加
memx list --scope project:my-backend     # 列出指定作用域
memx forget <memory-id>                  # 删除
memx sweep                               # 手动触发衰减计算
memx conflicts                           # 检测矛盾知识
memx export --format json > knowledge.json   # 导出
memx import knowledge.json                   # 导入
```

## 純粋な mem0 互換モード

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="git-merge" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">mem0 からシームレスに移行可能</p>
    <div class="lurus-callout__body"><p>基本的なメモリ機能のみが必要な場合は ACE を無効にすると、動作が mem0 と 100% 一致します（ACE 無効時はゼロオーバーヘッドでパススルーするため、先に移行してから段階的に有効化できます）。</p></div>
  </div>
</div>

```python
m = Memory()  # ace_enabled 默认 False
m.add("some knowledge", user_id="user1")
results = m.search("query", user_id="user1")
```

## 次のステップ

<NextSteps
  :steps="[
    { text: 'コアコンセプト — ACE エンジンの 4 大コアモジュールを深掘り', link: '/ja/memx/concepts', primary: true },
    { text: 'アーキテクチャ設計 — 完全なパイプラインアーキテクチャとデータフロー', link: '/ja/memx/architecture' },
    { text: 'よくある質問 — 利用中に問題が発生した？', link: '/ja/memx/faq' },
  ]"
/>

</div>
