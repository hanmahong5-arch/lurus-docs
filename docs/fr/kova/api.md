---
title: Référence de l’API Kova
description: API REST du moteur d’exécution Agent Kova, plus de 35 points de terminaison, construite sur Axum.
---

<div class="kova-api">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="code" :size="14" /> Référence de l’API</span>
  <h1 class="lurus-section-head__title">Référence de l’API Kova</h1>
  <p class="lurus-section-head__lede">API REST complète construite sur Axum, plus de 35 points de terminaison, format JSON unifié — couvrant Agent, tâches, Workflow, Swarm, WAL et administration système.</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">35+</span><span class="lurus-stat__label">Points de terminaison REST</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">Axum</span><span class="lurus-stat__label">Runtime</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">JSON</span><span class="lurus-stat__label">Format unifié</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">SSE</span><span class="lurus-stat__label">Flux d’événements en temps réel</span></div>
</div>

## <Term t="Base URL">Base URL</Term>

```
http://localhost:3000/api/v1
```

## Authentification

Toutes les requêtes transmettent la clé API via l’en-tête `X-API-Key` <span class="lurus-tag">obligatoire</span> :

```
X-API-Key: sk-kova-<64位十六进制>
```

Format de la clé : `^sk-kova-[a-f0-9]{64}$`, générée par `create-tester.sh`, stockée dans `testers/<NAME>/.env` (chmod 600).

## Limitation de débit

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="timer" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Fenêtre d’idempotence</p>
    <div class="lurus-callout__body"><code>POST /agents/:id/run</code> renvoie <code>409 Conflict</code> en cas de soumission répétée du même agent dans un délai de 15 s.</div>
  </div>
</div>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="gauge" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Limite de contre-pression</p>
    <div class="lurus-callout__body">Lorsque la file dispatch est remplie à 80 %, renvoie <code>429 Too Many Requests</code> (avec <code>Retry-After: 5</code>).</div>
  </div>
</div>

---

## Gestion des Agents

<ApiEndpoint method="POST" path="/api/v1/agents" description="Créer un Agent" />
<ApiEndpoint method="GET" path="/api/v1/agents" description="Lister les Agents (prend en charge status / limit / offset)" />
<ApiEndpoint method="GET" path="/api/v1/agents/:id" description="Obtenir les détails d’un Agent" />
<ApiEndpoint method="PUT" path="/api/v1/agents/:id" description="Mettre à jour un Agent" />
<ApiEndpoint method="DELETE" path="/api/v1/agents/:id" description="Supprimer un Agent" />

Corps de la requête de création :
```json
{ "name": "researcher", "system_prompt": "你是一个专业的研究员...", "model": "deepseek-chat",
  "tools": ["web_search", "file_write"],
  "config": { "max_tokens": 4096, "temperature": 0.7, "max_iterations": 20 } }
```
Réponse (201) : `{ "id": "agt_a1b2c3d4", "name": "researcher", "status": "idle", "created_at": "2026-03-17T10:00:00Z" }`

Lors du listage, les paramètres de requête disponibles sont `GET /api/v1/agents?status=idle&limit=20&offset=0`.

::: warning
Seuls les Agents à l’état `idle` ou `completed` peuvent être supprimés. Ceux en cours d’exécution doivent d’abord être arrêtés.
:::

---

## Exécution des tâches

<ApiEndpoint method="POST" path="/api/v1/agents/:id/run" description="Déclencher l’exécution d’une tâche par l’Agent" />
<ApiEndpoint method="GET" path="/api/v1/events" description="Flux d’événements SSE (diffusion en temps réel de tous les événements d’agents)" />
<ApiEndpoint method="POST" path="/api/v1/tasks/:id/stop" description="Arrêter une tâche" />
<ApiEndpoint method="GET" path="/api/v1/tasks" description="Lister les tâches (prend en charge agent_id / status / limit)" />

Corps de la requête de déclenchement d’exécution :
```json
{ "message": "研究 WebAssembly 在服务端的最新发展",
  "context": { "output_format": "markdown", "max_length": 2000 } }
```
Réponse (200) : `{ "task_id": "tsk_e5f6g7h8", "status": "running", "agent_id": "agt_a1b2c3d4" }`

::: tip Idempotence
Une soumission répétée pour le même agent dans un délai de 15 s renvoie `409 Conflict` ; lorsque la file dispatch atteint ≥ 80 %, renvoie `429 Too Many Requests` (avec `Retry-After: 5`).
:::

### Flux d’événements en temps réel (SSE)

`GET /api/v1/events` diffuse tous les événements d’agents, avec les paramètres de requête optionnels `?workflow_id=<id>&tenant=<slug>`. En-têtes de la requête :
```
Accept: text/event-stream
X-API-Key: sk-kova-<64位十六进制>
```

Exemple de trame SSE :
```json
{"type": "thinking", "content": "正在分析搜索结果..."}
{"type": "tool_call", "tool": "web_search", "input": {"query": "WASM server-side 2026"}}
{"type": "tool_result", "tool": "web_search", "output": "..."}
{"type": "output", "content": "根据搜索结果..."}
{"type": "completed", "task_id": "tsk_e5f6g7h8"}
```

Pour lister les tâches, les paramètres de requête disponibles sont `GET /api/v1/tasks?agent_id=agt_a1b2c3d4&status=completed&limit=20`.

---

## Gestion des Workflows

<ApiEndpoint method="POST" path="/api/v1/workflows" description="Créer un workflow" />
<ApiEndpoint method="POST" path="/api/v1/workflows/:name/run" description="Exécuter un workflow" />
<ApiEndpoint method="GET" path="/api/v1/workflows/:name/runs/:run_id" description="Consulter l’état d’exécution" />
<ApiEndpoint method="GET" path="/api/v1/workflows" description="Lister les workflows" />

Corps de la requête de création :
```json
{ "name": "content-pipeline", "description": "内容创作管道",
  "steps": [
    { "name": "research", "agent": "researcher", "prompt": "调研主题：{{input.topic}}" },
    { "name": "write", "agent": "writer", "prompt": "基于研究结果撰写文章：\n{{steps.research.output}}",
      "error_policy": "retry", "max_retries": 2 }
  ] }
```

Lors de l’exécution, le corps de la requête est `{ "input": { "topic": "边缘计算趋势" } }`.

---

## Gestion des Swarms

<ApiEndpoint method="POST" path="/api/v1/swarms" description="Créer un Swarm" />
<ApiEndpoint method="POST" path="/api/v1/swarms/:name/tasks" description="Envoyer une tâche à un Swarm" />

Corps de la requête de création :
```json
{ "name": "dev-team", "coordinator": "project-manager", "agents": ["researcher", "coder", "tester"],
  "config": { "max_rounds": 10, "consensus_required": false } }
```

---

## Gestion du WAL

<ApiEndpoint method="GET" path="/api/v1/wal/status" description="Interroger l’état du WAL" />
<ApiEndpoint method="POST" path="/api/v1/wal/compact" description="Déclencher la compaction du WAL" />

Exemple de réponse d’état :
```json
{ "total_entries": 1024, "pending_entries": 0, "corrupted_entries": 0, "buffer_usage": 0.35, "last_compaction": "2026-03-17T08:00:00Z" }
```

---

## Administration système

<ApiEndpoint method="GET" path="/api/v1/health" description="Contrôle de santé" />
<ApiEndpoint method="GET" path="/api/v1/metrics" description="Métriques système (format Prometheus)" />

---

## Réponses d’erreur

Format unifié : `{ "error": { "code": "agent_not_found", "message": "Agent with id 'agt_xxx' not found", "details": null } }`

| HTTP | Code d’erreur | Description |
|------|--------|------|
| 400 | `invalid_request` | Paramètres de requête incorrects |
| 401 | `unauthorized` | `X-API-Key` manquante ou invalide |
| 404 | `agent_not_found` | L’Agent n’existe pas |
| 409 | `agent_busy` | Soumission répétée dans la fenêtre d’idempotence de 15 s |
| 422 | `workflow_invalid` | Définition de workflow erronée |
| 429 | `queue_full` | File dispatch ≥ 80 %, déclenche la limitation par contre-pression |
| 500 | `internal_error` | Erreur interne |
| 503 | `wal_error` | Anomalie du système WAL |

---

## Étapes suivantes

<NextSteps title="Étapes suivantes" :steps="[
  { text: 'Démarrage rapide — Lancer votre premier Agent en 5 minutes', link: '/fr/kova/quickstart', primary: true },
  { text: 'Concepts clés — Conception de WAL / Workflow / Swarm', link: '/fr/kova/concepts' },
]" />

<RelatedProducts product-id="kova" />

</div>

<style scoped>
.kova-api .lurus-stat-strip {
  margin: 1.5rem 0 2rem;
}
.kova-api .lurus-callout + .lurus-callout {
  margin-top: 0.75rem;
}
</style>
