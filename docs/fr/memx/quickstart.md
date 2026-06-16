---
title: Démarrage rapide MemX
description: Découvrez les fonctionnalités essentielles du moteur de mémoire adaptative MemX AI en 5 minutes.
---

<div class="memx-qs">

# Démarrage rapide

Découvrez les fonctionnalités essentielles de MemX en 5 minutes : installation → initialisation → écriture → recherche → consultation de l’état.

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Prérequis</p>
    <div class="lurus-callout__body"><p>Python 3.9+ · pip · une <Term t="API Key">API Key</Term> Lurus (<a href="/fr/guide/get-api-key">comment l’obtenir</a>, utilisée pour l’affinage LLM en mode hybrid). Durée estimée : 5 minutes.</p></div>
  </div>
</div>

## Choisir un mode d’intégration

MemX propose trois formes d’intégration : **Python SDK / REST / MCP**. Ci-dessous, une démonstration « écriture + recherche » ; choisissez la méthode qui vous convient (les paramètres sont alignés entre les trois) :

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

MemX expose les opérations de mémoire sous forme d’outils d’agent via un serveur MCP, exploitables par des clients MCP comme Claude / Codex (paramètres alignés sur REST) :

- `memory_add` — écrire une connaissance (`content`, `user_id`)
- `memory_search` — recherche sémantique (`query`, `limit`, `user_id`)
- `memory_delete` — supprimer une entrée (`memory_id`)
:::

Le tutoriel pas à pas ci-dessous utilise le Python SDK comme exemple ; REST / MCP fonctionnent de la même manière.

<ol class="lurus-steps">

<li>

**Installation**

```bash
pip install git+https://github.com/UU114/memx.git
# 完整安装：pip install "git+https://github.com/UU114/memx.git#egg=memx[all]"
```

Nécessite Python 3.9+. Au premier lancement, le modèle d’embedding local (environ 90 Mo) est téléchargé automatiquement dans `~/.memx/models/`.

</li>

<li>

**Initialisation**

```python
from memx import Memory
m = Memory(config={"ace_enabled": True})   # 开启 ACE 引擎（核心功能）
```

Une fois ACE activé, toutes les écritures et recherches passent par le pipeline intelligent ; la configuration par défaut suffit dans la plupart des cas.

</li>

<li>

**Écrire une connaissance**

Extraire et apprendre automatiquement des connaissances à partir d’une conversation :

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

Vous pouvez aussi injecter une connaissance manuellement :

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

**Rechercher une connaissance**

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

La recherche fusionne automatiquement les résultats de quatre niveaux de recherche (exact + flou + métadonnées + sémantique), en tenant compte de la décroissance temporelle et de la correspondance de portée.

</li>

<li>

**Consulter l’état de la base de connaissances**

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

## Découverte rapide via la CLI

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

## Mode de compatibilité mem0 pur

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="git-merge" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Migration transparente depuis mem0</p>
    <div class="lurus-callout__body"><p>Lorsque vous n’avez besoin que des fonctions de mémoire de base, désactivez ACE : le comportement est alors identique à 100 % à celui de mem0 (passage transparent sans surcoût quand ACE est désactivé ; vous pouvez d’abord migrer puis l’activer progressivement).</p></div>
  </div>
</div>

```python
m = Memory()  # ace_enabled 默认 False
m.add("some knowledge", user_id="user1")
results = m.search("query", user_id="user1")
```

## Étapes suivantes

<NextSteps
  :steps="[
    { text: 'Concepts essentiels — plongée dans les quatre modules clés du moteur ACE', link: '/fr/memx/concepts', primary: true },
    { text: 'Conception de l\'architecture — architecture complète du pipeline et flux de données', link: '/fr/memx/architecture' },
    { text: 'Questions fréquentes — un problème lors de l\'utilisation ?', link: '/fr/memx/faq' },
  ]"
/>

</div>
