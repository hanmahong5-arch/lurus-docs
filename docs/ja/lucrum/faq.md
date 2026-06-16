---
title: Lucrum よくある質問
description: Lucrum AI クオンツ取引プラットフォームのよくある質問と回答。
---

<div class="lucrum-page">

# よくある質問

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="user-check" :size="14" /> アカウントと入門</span>
  <h2 class="lurus-section-head__title">登録、課金、対応市場</h2>
</div>

<details class="lurus-faq-item">
<summary>登録方法は？</summary>

[lucrum.lurus.cn](https://lucrum.lurus.cn) に Lurus 統一アカウントでログインします（すべての製品で同一アカウントを共有）。

</details>

<details class="lurus-faq-item">
<summary>有料ですか？</summary>

無料 / 有料の 2 種類があり、無料枠を超えた分は [鹿貝ウォレット](/ja/platform/billing#wallet) から課金されます。

| 機能 | 無料 | 有料 |
|------|------|------|
| AI 取引アシスタント | 1 日あたりの対話回数に制限あり | 無制限 |
| 戦略マーケット閲覧 / 無料戦略 | すべて閲覧可 / 利用可 | すべて閲覧可 / 利用可 |
| 有料戦略のサブスクリプション | 利用不可 | サブスクリプション可 |
| 戦略開発 | 基本バックテスト | 全機能 |

</details>

<details class="lurus-faq-item">
<summary>どの市場に対応していますか？</summary>

現在は A 株（上海・深圳両市場）。香港株 / 米国株 / 暗号資産は接続準備中です。

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bot" :size="14" /> AI アシスタント</span>
  <h2 class="lurus-section-head__title">正確性、記憶、コード生成</h2>
</div>

<details class="lurus-faq-item">
<summary>分析は正確ですか？</summary>

LLM + テクニカル分析に基づく参考情報を提供しますが、**投資助言を構成するものではありません**。テクニカル指標 / ローソク足の読み解き、市場ロジックの整理、戦略構想とコードの補助は得意ですが、短期的な値動きの予測は不得意です。意思決定の参考にとどめ、根拠とはしないでください。

</details>

<details class="lurus-faq-item">
<summary>対話を記憶しますか？</summary>

記憶します。[MemX 記憶エンジン](/ja/memx/) を統合し、好み / 注目セクター / 過去の対話を記憶します。ユーザーごとに分離され、漏洩することはありません。

</details>

<details class="lurus-faq-item">
<summary>AI で戦略コードを書けますか？</summary>

書けます。アイデアを説明すると AI が Python コードのフレームワークを生成し、戦略ワークベンチでそのままバックテスト検証できます。

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bar-chart-3" :size="14" /> 戦略について</span>
  <h2 class="lurus-section-head__title">バックテストの信頼性、出金、コード保護</h2>
</div>

<details class="lurus-faq-item">
<summary>バックテストのデータは信頼できますか？</summary>

実際の過去相場を使用しますが、マーケットインパクトコストやスリッページは考慮されず（大口資金では差が生じます）、過度な最適化は過学習を招きやすく、過去は将来を保証しません。バックテスト後はまずシミュレーション取引で検証することをおすすめします。

</details>

<details class="lurus-faq-item">
<summary>戦略収益はどう出金しますか？</summary>

収益は鹿貝としてウォレットに入ります → [identity.lurus.cn](https://identity.lurus.cn) にログイン →「ウォレット」→「出金」→ 金額と銀行口座を入力 → 通常 1〜3 営業日で着金します。

</details>

<details class="lurus-faq-item">
<summary>戦略コードは漏洩しますか？</summary>

漏洩しません。サーバー側で暗号化して保存され、利用者には説明 / 指標 / バックテストレポートのみが表示され、ソースコードを閲覧することはできません。

</details>

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="code" :size="14" /> 技術的な問題</span>
  <h2 class="lurus-section-head__title">レート制限、レイテンシ、戦略言語</h2>
</div>

<details class="lurus-faq-item">
<summary>API が 429 を返します</summary>

リクエスト頻度の上限（プランによって異なる）を超えています。頻度を下げるか、プランをアップグレードしてください。

</details>

<details class="lurus-faq-item">
<summary>戦略の実行レイテンシが高いです</summary>

ネットワークの安定性を確認してください。戦略の複雑な計算は事前計算してキャッシュすることをおすすめします。寄り付き / 引けの高並行時間帯は避けてください。

</details>

<details class="lurus-faq-item">
<summary>戦略はどの言語で書けますか？</summary>

現在は Python です。戦略 SDK がテクニカル指標ライブラリと取引実行インターフェースを提供します。

</details>

---

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="mail" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">答えが見つかりませんか？</p>
    <div class="lurus-callout__body"><a href="mailto:support@lurus.cn">support@lurus.cn</a> までご連絡ください。</div>
  </div>
</div>

<NextSteps
  :steps="[
    { text: 'クイックスタート', link: '/ja/lucrum/quickstart', primary: true },
    { text: '戦略マーケット', link: '/ja/lucrum/strategies' },
    { text: '製品概要', link: '/ja/lucrum/' },
  ]"
  title="次のステップ"
/>

</div>
