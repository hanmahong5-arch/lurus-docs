---
layout: page
title: LurusTech Docs — AI インフラとプロダクトプラットフォーム
description: LurusTech プラットフォームドキュメント — API Reference · Quickstart · Integration Guide
---

<div class="vp-doc lurus-home">

<Hero />

<nav class="persona-jump" aria-label="按角色快速跳转">
  <a href="#newbie" class="persona-jump__chip">
    <span class="persona-jump__icon"><Icon name="rocket" :size="14" /></span>
    <span class="persona-jump__label">初心者</span>
    <span class="persona-jump__hint">3 分で導入</span>
  </a>
  <a href="#player" class="persona-jump__chip">
    <span class="persona-jump__icon"><Icon name="gamepad-2" :size="14" /></span>
    <span class="persona-jump__label">プレイヤー</span>
    <span class="persona-jump__hint">既製ツール</span>
  </a>
  <a href="#decider" class="persona-jump__chip">
    <span class="persona-jump__icon"><Icon name="briefcase" :size="14" /></span>
    <span class="persona-jump__label">意思決定者</span>
    <span class="persona-jump__hint">エンタープライズ評価</span>
  </a>
  <a href="#dev" class="persona-jump__chip">
    <span class="persona-jump__icon"><Icon name="code" :size="14" /></span>
    <span class="persona-jump__label">開発者</span>
    <span class="persona-jump__hint">システム構築</span>
  </a>
</nav>

<div class="topic-grid-head"><Icon name="compass" :size="16" /> <strong>トピックで探す</strong> —— 探しているものが決まっていますか？該当トピックへ直接どうぞ。</div>

<div class="lurus-cards lurus-cards--compact">
  <a class="lurus-card lurus-card--api" href="/ja/guide/introduction"><span class="lurus-card__icon"><Icon name="plug-zap" :size="20" /></span><div class="lurus-card__title">ゲートウェイ接続</div><p class="lurus-card__body">1 つの Key で 50+ モデルに接続、OpenAI SDK 互換。</p></a>
  <a class="lurus-card lurus-card--kova" href="/ja/kova/"><span class="lurus-card__icon"><Icon name="bot" :size="20" /></span><div class="lurus-card__title">Agent 実行</div><p class="lurus-card__body">Kova WAL-First エンジン、クラッシュから自動復旧。</p></a>
  <a class="lurus-card lurus-card--memx" href="/ja/memx/"><span class="lurus-card__icon"><Icon name="brain" :size="20" /></span><div class="lurus-card__title">スマートメモリ</div><p class="lurus-card__body">MemX 適応型メモリ、LLM コストゼロの蒸留。</p></a>
  <a class="lurus-card lurus-card--lumen" href="/ja/lumen/"><span class="lurus-card__icon"><Icon name="zap" :size="20" /></span><div class="lurus-card__title">オブザーバビリティ</div><p class="lurus-card__body">Lumen Replay + クラッシュ復旧 + コスト追跡。</p></a>
  <a class="lurus-card lurus-card--lucrum" href="/ja/lucrum/"><span class="lurus-card__icon"><Icon name="trending-up" :size="20" /></span><div class="lurus-card__title">クオンツ取引</div><p class="lurus-card__body">Lucrum は自然言語で vnpy 戦略を生成しバックテスト。</p></a>
  <a class="lurus-card lurus-card--switch" href="/ja/switch/"><span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span><div class="lurus-card__title">デスクトップツール</div><p class="lurus-card__body">Switch で複数の AI CLI・MCP・コストを一元管理。</p></a>
  <a class="lurus-card lurus-card--api" href="/integrations/"><span class="lurus-card__icon"><Icon name="puzzle" :size="20" /></span><div class="lurus-card__title">統合と MCP</div><p class="lurus-card__body">プロダクト MCP、Switch 内蔵サーバー、クライアントカタログ。</p></a>
  <a class="lurus-card lurus-card--api" href="/ja/guide/troubleshooting"><span class="lurus-card__icon"><Icon name="life-buoy" :size="20" /></span><div class="lurus-card__title">トラブルシューティング</div><p class="lurus-card__body">401 / クォータ / タイムアウトなど頻出問題を 1 ページで特定。</p></a>
</div>

## <Icon name="rocket" :size="22" /> 初心者の方 — 3 分で最初の呼び出しを実行 {#newbie}

モデル選びのミスは、コードのミスより 10 倍高くつきます。まずはゲートウェイで一度試してから、移行するか判断しましょう。

<div class="action-grid">
  <ActionCard
    product-id="lurus-api"
    :actions="[
      { label: 'クイックスタート', href: '/ja/guide/quickstart', primary: true },
      { label: 'API Key を取得', href: '/ja/guide/get-api-key' },
      { label: '対応モデル', href: '/guide/models' },
      { label: 'コンソール', href: 'https://api.lurus.cn', external: true },
    ]"
  />
  <ActionCard
    product-id="platform"
    :actions="[
      { label: 'プラットフォーム概要', href: '/ja/platform/', primary: true },
      { label: '料金の詳細', href: '/ja/platform/billing' },
      { label: 'よくある質問', href: '/ja/platform/faq' },
    ]"
  />
</div>

---

## <Icon name="gamepad-2" :size="22" /> プレイヤーの方 — 既製の AI ツールが欲しい {#player}

コードはもう用意してあります。ダウンロードして実行するだけ、設定は一行も書きません。

<div class="action-grid">
  <ActionCard
    product-id="lucrum"
    :actions="[
      { label: 'クイックスタート', href: '/ja/lucrum/quickstart', primary: true },
      { label: '戦略マーケット', href: '/ja/lucrum/strategies' },
      { label: '取引プラットフォーム', href: 'https://lucrum.lurus.cn', external: true },
    ]"
  />
  <ActionCard
    product-id="switch"
    :actions="[
      { label: 'インストールガイド', href: '/ja/switch/install', primary: true },
      { label: '設定の説明', href: '/ja/switch/configuration' },
    ]"
  />
  <ActionCard
    product-id="creator"
    :actions="[
      { label: 'インストールガイド', href: '/creator/install', primary: true },
      { label: 'ユースケース', href: '/creator/use-cases' },
    ]"
  />
  <ActionCard
    name="Lutu — モバイルクライアント"
    tagline="路途 APP · モバイル向け AI アシスタント＆家計簿"
    icon="smartphone"
    color="var(--lurus-color-creator)"
    status="beta"
    :actions="[
      { label: 'Lutu をダウンロード', href: 'https://www.lurus.cn/download#lutu', primary: true, external: true },
    ]"
  />
</div>

---

## <Icon name="briefcase" :size="22" /> 意思決定者の方 — エンタープライズ導入を評価する {#decider}

ツールの調達ではなく、インフラの置き換えです。まず TCO とコンプライアンスの境界を確認し、それから機能を見てください。

<div class="action-grid">
  <ActionCard
    name="なぜ Lurus を選ぶのか"
    tagline="4 つのコア能力 vs 自社構築 — TCO・性能・コンプライアンスを 1 枚の表で"
    icon="award"
    color="var(--lurus-brand-500)"
    :actions="[
      { label: 'エンタープライズソリューション', href: '/solutions/', primary: true },
      { label: 'Why Lurus', href: '/solutions/why-lurus' },
    ]"
  />
  <ActionCard
    name="エンタープライズ展開形態"
    tagline="SaaS · オンプレミス · ハイブリッドクラウド · コンプライアンス境界を一度に説明"
    icon="server"
    color="var(--lurus-color-platform)"
    :actions="[
      { label: 'デプロイマトリクス', href: '/solutions/enterprise-deploy', primary: true },
    ]"
  />
  <ActionCard
    product-id="auth"
    :actions="[
      { label: '概要と接続点', href: '/ja/platform/auth/', primary: true },
      { label: 'エンタープライズ SSO フェデレーション', href: '/ja/platform/auth/oidc' },
      { label: '認証コンソール', href: 'https://auth.lurus.cn', external: true },
    ]"
  />
  <ActionCard
    name="ビジネス窓口へ問い合わせ"
    tagline="オンプレミス展開 · ライセンス · カスタマイズ · 提携相談"
    icon="mail"
    color="var(--lurus-color-auth)"
    :actions="[
      { label: 'business@lurus.cn', href: 'mailto:business@lurus.cn', primary: true, external: true },
    ]"
  />
</div>

---

## <Icon name="code" :size="22" /> 開発者の方 — AI システムを構築する {#dev}

LLM アプリケーションの 4 つの基盤コンポーネント：実行 · メモリ · ゲートウェイ · CLI。単体でも使え、組み合わせればさらに強力です。

<div class="action-grid">
  <ActionCard
    product-id="kova"
    :actions="[
      { label: 'クイックスタート', href: '/ja/kova/quickstart', primary: true },
      { label: 'コアコンセプト', href: '/ja/kova/concepts' },
      { label: 'API リファレンス', href: '/ja/kova/api' },
    ]"
  />
  <ActionCard
    product-id="memx"
    :actions="[
      { label: 'クイックスタート', href: '/ja/memx/quickstart', primary: true },
      { label: 'コアコンセプト', href: '/ja/memx/concepts' },
      { label: 'アーキテクチャ設計', href: '/ja/memx/architecture' },
    ]"
  />
  <ActionCard
    product-id="lumen"
    :actions="[
      { label: 'クイックスタート', href: '/ja/lumen/quickstart', primary: true },
      { label: 'Python SDK', href: '/ja/lumen/python-sdk' },
      { label: 'CLI マニュアル', href: '/ja/lumen/cli' },
    ]"
  />
  <ActionCard
    product-id="api-ref"
    :actions="[
      { label: 'API 概要', href: '/ja/api/overview', primary: true },
      { label: '認証', href: '/ja/api/authentication' },
      { label: 'Chat Completions', href: '/ja/api/chat-completions' },
    ]"
  />
  <ActionCard
    product-id="arch"
    :actions="[
      { label: 'アーキテクチャを見る', href: '/developer/architecture', primary: true },
    ]"
  />
  <ActionCard
    product-id="forge"
    :actions="[
      { label: 'プロダクト哲学', href: '/forge/', primary: true },
      { label: 'Ontology', href: '/forge/ontology' },
    ]"
  />
</div>

---

## クロスプロダクトチュートリアル · 移行ガイド

<div class="action-grid action-grid--compact">
  <ActionCard
    name="チュートリアルセンター"
    tagline="MemX + Kova · Lumen + LangGraph · Lucrum エンドツーエンド"
    icon="graduation-cap"
    color="var(--lurus-color-kova)"
    :actions="[
      { label: 'クロスプロダクトチュートリアル', href: '/tutorials/', primary: true },
    ]"
  />
  <ActionCard
    name="移行ガイド"
    tagline="OpenAI · LangGraph · 自社構築 OIDC → 5 分で引っ越し"
    icon="import"
    color="var(--lurus-color-lurus-api)"
    :actions="[
      { label: '移行センター', href: '/migrations/', primary: true },
    ]"
  />
  <ActionCard
    name="用語集"
    tagline="47+ の技術用語をトピック別にグループ化、クロスプロダクトで素早く参照"
    icon="book-a"
    color="var(--lurus-color-memx)"
    :actions="[
      { label: '用語の全リスト', href: '/guide/glossary', primary: true },
    ]"
  />
</div>

---

## なぜ Lurus を選ぶのか？

4 つの判断ポイント — もう一つのツールではなく、一度きりのインフラ置き換えです。

<div class="diff-grid">
  <article class="diff-card diff-card--brand">
    <header class="diff-card__head">
      <span class="diff-card__icon"><Icon name="layers" :size="20" /></span>
      <h3 class="diff-card__title">フルスタック自社開発</h3>
    </header>
    <p class="diff-card__lede">Rust 実行エンジンから Flutter モバイル端末まで、すべて自社開発。アカウント / 課金 / メモリ / ゲートウェイを共用。</p>
    <ul class="diff-card__points">
      <li>問題が起きても 3 社のベンダーが互いに責任を押し付け合うのを待つ必要なし</li>
      <li>使うほど価値が増す——メモリ・課金・モデルが 1 つのプールで複利的に効く</li>
    </ul>
  </article>

  <article class="diff-card diff-card--accent-kova">
    <header class="diff-card__head">
      <span class="diff-card__icon"><Icon name="zap" :size="20" /></span>
      <h3 class="diff-card__title">エンジンレベルの性能</h3>
    </header>
    <p class="diff-card__lede">Kova スケジューリング <strong>3μs</strong>（Criterion ベンチマーク）· 315K ops/s のスループット。</p>
    <ul class="diff-card__points">
      <li>私たちは実行エンジンそのものを書いた、Temporal をもう一層ラップしたのではない</li>
      <li>MemX は LLM を呼ばずとも蒸留できる · Lucrum は浮動小数点ドリフトのない完全精度</li>
    </ul>
  </article>

  <article class="diff-card diff-card--accent-platform">
    <header class="diff-card__head">
      <span class="diff-card__icon"><Icon name="shield-check" :size="20" /></span>
      <h3 class="diff-card__title">データ主権</h3>
    </header>
    <p class="diff-card__lede">一度デプロイすれば、どのクラウドベンダーにも「課税」されません。国家暗号 SM4-GCM で全工程を暗号化。</p>
    <ul class="diff-card__points">
      <li>1 セットの SSO / Passkey / MFA で、既存の IdP に接続</li>
      <li>OpenAI SDK 互換 · 移りたければいつでもデータを持って出られる</li>
    </ul>
  </article>

  <article class="diff-card diff-card--accent-memx">
    <header class="diff-card__head">
      <span class="diff-card__icon"><Icon name="receipt" :size="20" /></span>
      <h3 class="diff-card__title">TCO の透明性</h3>
    </header>
    <p class="diff-card__lede">鹿贝ユニットで統一課金 — 50+ モデルを 1 枚の請求書で。</p>
    <ul class="diff-card__points">
      <li>照合作業が 1 日から 5 分に</li>
      <li>いつでも移出可能、退出コストゼロ</li>
    </ul>
  </article>
</div>

<details class="diff-table">
  <summary>完全な対照表を展開（8 つの次元 × 自社構築との比較）</summary>

| 次元 | Lurus の優位性 | 自社構築との対照 |
|------|-------------|---------|
| **フルスタック自社開発** | Rust 実行エンジンから Flutter モバイル端末まで、コア技術を完全に自主管理可能 | マルチベンダーの寄せ集め、バージョンロックインのリスク |
| **エンジンレベルの性能** | Kova 3μs のスケジューリング遅延、315K ops/s（Criterion ベンチマーク）、外部依存ゼロ | 自社構築の Temporal/LangGraph はオーダーが遅め |
| **データ主権** | オンプレミス展開、データは企業境界の外に出ない、国家暗号 SM4-GCM 対応 | パブリッククラウドはコンプライアンスと監査の難度が高い |
| **統一 ID** | すべてのプロダクトが SSO、Passkey、MFA を共有、企業 IdP フェデレーションに接続 | Keycloak / Auth0 を自前運用 |
| **エコシステム連携** | 12 のプロダクトがアカウント/課金/メモリ/LLM ゲートウェイを共有、使うほど価値が増す | ツールスタックの断片化 |
| **経済的に高効率** | MemX は LLM コストゼロの蒸留；Lucrum は Decimal.js で完全精度・誤差ゼロ | メモリ / 精度の問題に追加投資が必要 |
| **TCO の透明性** | 鹿贝ユニットで統一課金、従量課金 + 無料枠 | 複数社の請求書照合が煩雑 |
| **オープンで移出可能** | OpenAI SDK 互換、PAT/JWT 標準認証、エクスポートにロックインなし | ベンダーロックインで退出コストが高い |

</details>

---

## 準備はできましたか？

<div class="finalcta">
  <div class="finalcta__text">
    <h3>5 行のコードでゲートウェイを切り替え、OpenAI SDK 互換</h3>
    <p>base_url を 1 つ変えるだけで、既存の呼び出しがすべてつながります。1 つの Key で 50+ モデルに接続、登録すれば無料枠を進呈。</p>
  </div>
  <div class="finalcta__actions">
    <a href="/ja/guide/quickstart" class="finalcta__btn finalcta__btn--primary">3 分で導入 →</a>
    <a href="https://api.lurus.cn" target="_blank" rel="noopener noreferrer" class="finalcta__btn finalcta__btn--alt">コンソールへ ↗</a>
    <a href="mailto:business@lurus.cn" class="finalcta__btn finalcta__btn--ghost">エンタープライズ相談</a>
  </div>
</div>

## お問い合わせ

<div class="contact-grid">
  <a href="mailto:support@lurus.cn" class="contact-card">
    <span class="contact-card__icon"><Icon name="life-buoy" :size="22" /></span>
    <span class="contact-card__name">テクニカルサポート</span>
    <span class="contact-card__addr">support@lurus.cn</span>
  </a>
  <a href="mailto:business@lurus.cn" class="contact-card contact-card--accent">
    <span class="contact-card__icon"><Icon name="briefcase" :size="22" /></span>
    <span class="contact-card__name">ビジネス提携</span>
    <span class="contact-card__addr">business@lurus.cn</span>
  </a>
  <a href="https://github.com/hanmahong5-arch" target="_blank" rel="noopener noreferrer" class="contact-card">
    <span class="contact-card__icon"><Icon name="github" :size="22" /></span>
    <span class="contact-card__name">GitHub</span>
    <span class="contact-card__addr">hanmahong5-arch ↗</span>
  </a>
</div>

</div>

<style>
.lurus-home { max-width: 1152px; margin: 0 auto; padding: 24px; }
.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 20px 0 28px;
}
.action-grid--compact {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}
.lurus-home h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--lurus-fs-xl);
  font-weight: 700;
  margin-top: 44px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--vp-c-divider);
  background:
    linear-gradient(to right,
      var(--vp-c-brand-1),
      color-mix(in srgb, var(--vp-c-brand-1) 35%, transparent) 60%,
      transparent 100%)
    bottom left / 36% 1px no-repeat;
  scroll-margin-top: 88px;
}
.lurus-home h2 .lurus-icon { color: var(--vp-c-brand-1); }
.lurus-home hr {
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--vp-c-brand-soft), transparent);
  margin: 40px 0;
}
@media (max-width: 640px) {
  .lurus-home { padding: 16px; }
}

/* ============================================================
 * Persona jump chips — sits under Hero, anchors into 4 personas
 * ============================================================ */
.persona-jump {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: -8px 0 4px;
  padding: 6px 4px;
  background: transparent;
  border: none;
  align-items: center;
  justify-content: center;
}
.persona-jump__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--lurus-radius-pill);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--vp-c-text-2) !important;
  text-decoration: none !important;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  transition: transform var(--lurus-dur-fast) var(--lurus-ease-out),
              border-color var(--lurus-dur-fast),
              color var(--lurus-dur-fast);
}
.persona-jump__chip:hover {
  transform: var(--lurus-hover-rise);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1) !important;
}
.persona-jump__icon {
  display: inline-flex;
  color: var(--vp-c-brand-1);
}
.persona-jump__hint {
  color: var(--vp-c-text-3);
  font-weight: 400;
  font-size: 0.74rem;
}
.persona-jump__chip:hover .persona-jump__hint { color: inherit; opacity: 0.85; }
@media (max-width: 640px) {
  .persona-jump__hint { display: none; }
}

/* anchored personas: leave room for VitePress sticky nav (~64px) + breathing space */
#newbie, #player, #decider, #dev { scroll-margin-top: 88px; }

/* ============================================================
 * Differentiators — 4 cards replacing the 8-row why-Lurus table
 * ============================================================ */
.diff-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
  margin: 18px 0 14px;
}
.diff-card {
  --accent: var(--vp-c-brand-1);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--lurus-radius-lg);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  transition: transform var(--lurus-dur-base) var(--lurus-ease-out),
              border-color var(--lurus-dur-base),
              box-shadow var(--lurus-dur-base);
}
.diff-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent);
}
.diff-card:hover {
  transform: var(--lurus-hover-rise);
  border-color: var(--accent);
  box-shadow: var(--lurus-shadow-3);
}
.diff-card--brand            { --accent: var(--vp-c-brand-1); }
.diff-card--accent-kova      { --accent: var(--lurus-color-kova); }
.diff-card--accent-platform  { --accent: var(--lurus-color-platform); }
.diff-card--accent-memx      { --accent: var(--lurus-color-memx); }
.diff-card__head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.diff-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--lurus-radius-md);
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  color: var(--accent);
  flex-shrink: 0;
}
.diff-card__title {
  margin: 0;
  font-size: 1.02rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  border: none !important;
  padding: 0 !important;
}
.diff-card__lede {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}
.diff-card__lede strong {
  color: var(--accent);
  font-feature-settings: 'tnum';
}
.diff-card__points {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.diff-card__points li {
  position: relative;
  padding-left: 16px;
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
.diff-card__points li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.65;
}

.diff-table {
  margin: 12px 0 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--lurus-radius-md);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}
.diff-table > summary {
  cursor: pointer;
  padding: 12px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  user-select: none;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background var(--lurus-dur-fast);
}
.diff-table > summary::-webkit-details-marker { display: none; }
.diff-table > summary::before {
  content: '▸';
  display: inline-block;
  transition: transform var(--lurus-dur-fast);
  color: var(--vp-c-brand-1);
}
.diff-table[open] > summary::before { transform: rotate(90deg); }
.diff-table > summary:hover { background: var(--vp-c-bg-mute); }
.diff-table table { margin: 0 18px 18px; }

/* ============================================================
 * Final CTA — bottom strip "ready?"
 * ============================================================ */
.finalcta {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 24px;
  align-items: center;
  margin: 24px 0 16px;
  padding: 28px 32px;
  border-radius: var(--lurus-radius-xl);
  background:
    radial-gradient(120% 140% at 0% 0%, color-mix(in srgb, var(--vp-c-brand-1) 14%, transparent), transparent 60%),
    radial-gradient(120% 140% at 100% 100%, color-mix(in srgb, var(--lurus-color-kova) 12%, transparent), transparent 55%),
    var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}
.finalcta__text h3 {
  margin: 0 0 6px;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  border: none !important;
  padding: 0 !important;
}
.finalcta__text p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
.finalcta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
}
.finalcta__btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: var(--lurus-radius-pill);
  text-decoration: none !important;
  transition: transform var(--lurus-dur-fast),
              filter var(--lurus-dur-fast),
              border-color var(--lurus-dur-fast),
              color var(--lurus-dur-fast);
}
.finalcta__btn:hover { transform: var(--lurus-hover-rise); }
.finalcta__btn--primary {
  background: var(--vp-c-brand-1);
  color: #fff !important;
}
.finalcta__btn--primary:hover { filter: brightness(1.08); }
.finalcta__btn--alt {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1) !important;
  border: 1px solid var(--vp-c-divider);
}
.finalcta__btn--alt:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1) !important;
}
.finalcta__btn--ghost {
  color: var(--vp-c-text-2) !important;
}
.finalcta__btn--ghost:hover { color: var(--vp-c-brand-1) !important; }

@media (max-width: 720px) {
  .finalcta {
    grid-template-columns: 1fr;
    padding: 22px 20px;
  }
  .finalcta__actions { justify-content: flex-start; }
}

/* ============================================================
 * Contact card grid
 * ============================================================ */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin: 16px 0 8px;
}
.contact-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 18px 20px;
  border-radius: var(--lurus-radius-lg);
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  text-decoration: none !important;
  color: var(--vp-c-text-1) !important;
  transition: transform var(--lurus-dur-base),
              border-color var(--lurus-dur-base),
              box-shadow var(--lurus-dur-base);
}
.contact-card:hover {
  transform: var(--lurus-hover-rise);
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--lurus-shadow-2);
}
.contact-card--accent { border-color: color-mix(in srgb, var(--vp-c-brand-1) 30%, var(--vp-c-divider)); }
.contact-card__icon {
  color: var(--vp-c-brand-1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: var(--lurus-radius-md);
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
}
.contact-card__name {
  font-weight: 700;
  font-size: 0.95rem;
}
.contact-card__addr {
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  font-family: var(--lurus-font-mono);
}
</style>
