---
title: "Forge — ロードマップとクローズドベータ申請"
description: "現在の beta 機能、計画中の Dependency Guardian / Agent 可視化 / ナレッジベース、およびクローズドベータの申請方法。"
---

<div class="forge-rm-page">

# Forge ロードマップ <StatusBadge status="beta" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="check-circle" :size="14" /> リリース済み</span>
  <h2 class="lurus-section-head__title">現在の Beta 機能</h2>
</div>

| 機能 | ステータス | 概要 |
|------|------|------|
| Ontology 可視化ツリー | <StatusBadge status="beta" /> | 折りたたみ可能なツリー + ノードカード |
| PM/Architect/Code Session | <StatusBadge status="beta" /> | 3 種類の Agent による対話協調 |
| WAL 決定の遡及 | <StatusBadge status="beta" /> | Kova エンジンに依存 |
| PR 自動化 | <StatusBadge status="dev" /> | Code Agent が直接 PR を作成 |

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="compass" :size="14" /> 計画中</span>
  <h2 class="lurus-section-head__title">これから取り組むこと</h2>
</div>

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="git-merge" :size="20" /></span>
    <div class="lurus-card__title">Dependency Guardian <StatusBadge status="plan" /></div>
    <p class="lurus-card__body">Epic / Story をまたぐインターフェース変更の検出：一つの API 契約を変更すると、影響を受けるすべての Session と PR を自動的に特定します。</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="workflow" :size="20" /></span>
    <div class="lurus-card__title">Agent 可視化 <StatusBadge status="plan" /></div>
    <p class="lurus-card__body">Session 内の Agent の思考プロセス、ツール呼び出し、中間結果を<strong>可視化タイムライン</strong>で表示し、純粋なテキスト log にとどめません。</p>
  </div>
  <div class="lurus-card lurus-card--forge">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">ナレッジベース <StatusBadge status="plan" /></div>
    <p class="lurus-card__body"><a href="/ja/memx/">MemX</a> を Forge に統合し、Agent が Session 内で過去の決定 / 規約 / 落とし穴の記録を検索するための長期記憶層として機能させます。</p>
  </div>
</div>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="history" :size="14" /> タイムライン</span>
  <h2 class="lurus-section-head__title">直近のマイルストーン</h2>
</div>

<ol class="lurus-steps">
<li>

**2026 Q2** — PR 自動化 GA

</li>
<li>

**2026 Q3** — Dependency Guardian beta

</li>
<li>

**2026 Q4** — Agent 可視化 beta

</li>
<li>

**2027 Q1** — ナレッジベース beta（MemX 深度統合）

</li>
</ol>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="mail" :size="14" /> クローズドベータ申請</span>
  <h2 class="lurus-section-head__title">招待制クローズドベータ枠</h2>
</div>

Forge は現在 Lurus の**社内 R&D ツール**として位置づけられており、**対外販売する商用製品ではありません**。

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="mail" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">申請方法</p>
    <div class="lurus-callout__body">メール <code>business@lurus.cn</code>（件名に「Forge クローズドベータ申請」と明記）にて、チーム規模、現在お使いの要件管理ツール、解決したい課題をお知らせください。</div>
  </div>
</div>

---

## 関連製品

<RelatedProducts product-id="forge" />

</div>
