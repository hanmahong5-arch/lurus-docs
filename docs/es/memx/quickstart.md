---
title: Primeros pasos con MemX
description: Experimenta las funciones principales del motor de memoria adaptativa por IA de MemX en 5 minutos.
---

<div class="memx-qs">

# Primeros pasos

Experimenta las funciones principales de MemX en 5 minutos: instalar → inicializar → escribir → recuperar → ver el estado.

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Requisitos previos</p>
    <div class="lurus-callout__body"><p>Python 3.9+ · pip · Lurus <Term t="API Key">API Key</Term> (<a href="/es/guide/get-api-key">cómo obtenerla</a>, se usa para el refinamiento por LLM en modo hybrid). Tiempo estimado: 5 minutos.</p></div>
  </div>
</div>

## Elige el método de integración

MemX ofrece tres formas de integración: **Python SDK / REST / MCP**. A continuación lo demostramos con «escribir + recuperar»; elige el método que prefieras (los parámetros son equivalentes entre los tres):

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

MemX expone las operaciones de memoria como herramientas de agente con el formato de un servidor MCP, para que clientes MCP como Claude / Codex puedan invocarlas (los parámetros coinciden con REST):

- `memory_add` — escribir conocimiento (`content`, `user_id`)
- `memory_search` — recuperación semántica (`query`, `limit`, `user_id`)
- `memory_delete` — eliminar una entrada (`memory_id`)
:::

El tutorial paso a paso que sigue usa el Python SDK como ejemplo; REST / MCP funcionan de forma análoga.

<ol class="lurus-steps">

<li>

**Instalación**

```bash
pip install git+https://github.com/UU114/memx.git
# 完整安装：pip install "git+https://github.com/UU114/memx.git#egg=memx[all]"
```

Requiere Python 3.9+. En la primera ejecución se descarga automáticamente el modelo de embeddings local (unos 90 MB) en `~/.memx/models/`.

</li>

<li>

**Inicialización**

```python
from memx import Memory
m = Memory(config={"ace_enabled": True})   # 开启 ACE 引擎（核心功能）
```

Una vez activado ACE, todas las escrituras y recuperaciones pasan por la canalización inteligente; la configuración por defecto basta para la mayoría de los escenarios.

</li>

<li>

**Escribir conocimiento**

Extrae y aprende conocimiento de las conversaciones automáticamente:

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

También puedes inyectar conocimiento manualmente:

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

**Recuperar conocimiento**

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

La recuperación fusiona automáticamente los resultados de las cuatro capas de búsqueda (exacta + difusa + metadatos + semántica) y tiene en cuenta el decaimiento temporal y la coincidencia de ámbito.

</li>

<li>

**Ver el estado de la base de conocimiento**

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

## Prueba rápida desde la CLI

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

## Modo de compatibilidad puro con mem0

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="git-merge" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Migración sin fricción desde mem0</p>
    <div class="lurus-callout__body"><p>Cuando solo necesites las funciones básicas de memoria, desactiva ACE: el comportamiento es 100 % idéntico al de mem0 (con ACE desactivado, el paso a través tiene coste cero, así que puedes migrar primero y activarlo de forma gradual después).</p></div>
  </div>
</div>

```python
m = Memory()  # ace_enabled 默认 False
m.add("some knowledge", user_id="user1")
results = m.search("query", user_id="user1")
```

## Siguientes pasos

<NextSteps
  :steps="[
    { text: 'Conceptos clave — profundiza en los cuatro módulos principales del motor ACE', link: '/es/memx/concepts', primary: true },
    { text: 'Diseño de la arquitectura — la arquitectura completa de la canalización y el flujo de datos', link: '/es/memx/architecture' },
    { text: 'Preguntas frecuentes — ¿problemas durante el uso?', link: '/es/memx/faq' },
  ]"
/>

</div>
