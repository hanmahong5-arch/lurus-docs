---
title: "クロスプロダクトチュートリアルセンター"
description: "複数の Lurus プロダクトを連携させるエンドツーエンドのチュートリアルを、ロール別にまとめています。"
---

<div class="tut-hub">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="graduation-cap" :size="14" /> クロスプロダクトチュートリアル</span>
  <h1 class="lurus-section-head__title">クロスプロダクトチュートリアルセンター</h1>
  <p class="lurus-section-head__lede">単一プロダクトのクイックスタートはそれぞれのドキュメントにあります。ここでは<strong>複数プロダクトを組み合わせた事例</strong>を扱います——MemX + Kova + API、Lumen + LangGraph などを組み合わせ、実際のエンジニアリング課題を解決します。</p>
</div>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">4</span><span class="lurus-stat__label">エンドツーエンドチュートリアル</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">5+</span><span class="lurus-stat__label">連携プロダクト</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">2</span><span class="lurus-stat__label">ロール別ルート</span></div>
</div>

## <Icon name="users" :size="20" /> ロール別

<div class="action-grid">
  <ActionCard
    name="Agent 開発者"
    tagline="Agent にメモリを追加 · クラッシュ復旧 · Replay デバッグ"
    icon="bot"
    color="var(--lurus-color-kova)"
    :actions="[
      { label: 'メモリ Agent', href: '/ja/tutorials/memory-agent', primary: true },
      { label: 'Lumen × LangGraph × Kova', href: '/ja/tutorials/lumen-kova-langgraph' },
    ]"
  />
  <ActionCard
    name="クオンツ取引"
    tagline="自然言語による戦略から戦略マーケットへの公開までの完全なループ"
    icon="trending-up"
    color="var(--lurus-color-lucrum)"
    :actions="[
      { label: 'Lucrum 戦略の完全フロー', href: '/ja/tutorials/lucrum-strategy-workflow', primary: true },
    ]"
  />
</div>

## <Icon name="layers" :size="20" /> テーマ別

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--memx" href="/ja/tutorials/memory-agent">
    <span class="lurus-card__icon"><Icon name="brain" :size="20" /></span>
    <div class="lurus-card__title">メモリ + Agent</div>
    <p class="lurus-card__body">MemX の長期メモリ + Kova のクラッシュ復旧 + Lurus API 呼び出しで、ユーザーを記憶できるカスタマーサポートを構築します。</p>
  </a>
  <a class="lurus-card lurus-card--lumen" href="/ja/tutorials/lumen-kova-langgraph">
    <span class="lurus-card__icon"><Icon name="zap" :size="20" /></span>
    <div class="lurus-card__title">可観測性</div>
    <p class="lurus-card__body">Lumen で LangGraph のデフォルト Checkpointer を置き換え、Kova にデプロイして、クラッシュ復旧の効果を比較します。</p>
  </a>
  <a class="lurus-card lurus-card--lucrum" href="/ja/tutorials/lucrum-strategy-workflow">
    <span class="lurus-card__icon"><Icon name="trending-up" :size="20" /></span>
    <div class="lurus-card__title">クオンツのループ</div>
    <p class="lurus-card__body">自然言語で戦略を記述 → AI が vnpy コードを生成 → バックテスト → 最適化 → 戦略マーケットへ公開。</p>
  </a>
  <a class="lurus-card lurus-card--switch" href="/ja/tutorials/switch-mcp-team">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">チームツールの統一</div>
    <p class="lurus-card__body">Switch でチームの AI CLI の MCP 設定、モデル Key、コストダッシュボードを 1 つの中央設定に集約します。</p>
  </a>
</div>

## <Icon name="workflow" :size="20" /> 推奨パス

<ol class="lurus-steps">
<li>

まず各単一プロダクトのクイックスタートを確認します（[Lurus API](/ja/guide/quickstart) から始めましょう）

</li>
<li>

次に本セクションから、業務に近いクロスプロダクトチュートリアルを 1 つ見ます

</li>
<li>

最後に [移行ガイド](/ja/migrations/) に沿って、既存のスタックを置き換えます

</li>
</ol>

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">組み合わせは複利となる</p>
    <div class="lurus-callout__body"><p>各チュートリアルは、各プロダクトのドキュメントに既にある機能のみを参照しています。まず単一プロダクトで動作確認し、その後チュートリアルに沿って連携させます——アカウント、課金、モデルは同じプールにあるため、重複して接続する必要はありません。</p></div>
  </div>
</div>

## 次のステップ

<NextSteps :steps="[
  { text: 'メモリ Agent', link: '/ja/tutorials/memory-agent', primary: true },
  { text: '移行ガイド', link: '/ja/migrations/' },
  { text: 'エンタープライズ向けソリューション', link: '/ja/solutions/' },
]" />

</div>
