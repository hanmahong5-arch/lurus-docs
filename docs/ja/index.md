---
layout: page
title: LurusTech ドキュメント
description: "顧客自身の環境で動く AI システムを、状態は検証でき、データは復元でき、変更は記録に残るものに。Witness・Kova・MemX・ゲートウェイ・プラットフォーム基盤のドキュメント入口です。"
---

<div class="vp-doc lurus-home">

<Hero />

<section class="home-block" aria-labelledby="home-parts">

## 構成要素からドキュメントへ {#home-parts}

<ul class="home-parts">
  <li>
    <a class="home-parts__name" href="/witness/">Lurus Witness</a><Badge type="warning" text="早期パイロット" />
    <p>読み取り専用の収集、外部からのプローブ、毎月の実復元演習、月次のエビデンスレポート。すべての読み値にエビデンスの強さを明記します。ドキュメントは中国語です。</p>
  </li>
  <li>
    <a class="home-parts__name" href="/ja/kova/">Kova</a><Badge type="warning" text="早期パイロット" />
    <p>組み込み型の永続実行エンジン：先行書き込みログによるクラッシュ復旧、実行記録、リプレイ。</p>
  </li>
  <li>
    <a class="home-parts__name" href="/ja/memx/">MemX</a><Badge type="warning" text="早期パイロット" />
    <p>AI メモリエンジン：抽出・重複排除・減衰・ハイブリッド検索。CLI / REST / MCP で接続。</p>
  </li>
  <li>
    <a class="home-parts__name" href="/ja/guide/quickstart">ゲートウェイと API</a><Badge type="tip" text="社内本番で使用中" />
    <p>プライベートにデプロイするマルチテナント LLM ゲートウェイ。オープンソースの New API（AGPLv3）がベースです。インターフェースの詳細は <a href="/ja/api/overview">API リファレンス</a> を参照。</p>
  </li>
  <li>
    <a class="home-parts__name" href="/ja/platform/">プラットフォーム基盤</a><Badge type="tip" text="社内本番で使用中" />
    <p>各構成要素が共用するアカウントとログイン。基盤であり、単体では提供しません。</p>
  </li>
</ul>

</section>

<section class="home-block" aria-labelledby="home-start">

## どこから始めるか {#home-start}

<dl class="home-start">
  <dt>Witness をデプロイする運用担当</dt>
  <dd>まず <a href="/witness/deploy">デプロイ（中国語）</a>、次に <a href="/witness/evidence">コアコンセプト（中国語）</a> を読み、各読み値の出どころと確かさを把握してください。</dd>
  <dt>ゲートウェイを接続する開発者</dt>
  <dd><a href="/ja/guide/quickstart">クイックスタート</a> で一度呼び出しを通し、フィールドとエラーコードは <a href="/ja/api/overview">API リファレンス</a> で確認してください。</dd>
  <dt>評価する意思決定者</dt>
  <dd><a href="/witness/">Witness の概要（中国語）</a> の「それが何でないか」と「現在の到達点」を読み、続いて <a href="/witness/drills">復元演習と月次レポート（中国語）</a> を見てください。</dd>
</dl>

</section>

<section class="home-block" aria-labelledby="home-bounds">

## 境界 {#home-bounds}

<p class="home-bounds">データセンターや計算資源の再販は行わず、証明できない数字は約束しません。成熟度は 4 段階のみ（早期パイロット・社内本番で使用中・オープンソース・設計中）で、迷ったときはより保守的な方を付けます。</p>

</section>

</div>

<style>
.lurus-home { max-width: 1152px; margin: 0 auto; padding: 24px; }
.lurus-home .home-block { max-width: 44rem; margin: 40px 0 0; }
.lurus-home .home-block h2 {
  font-size: var(--lurus-fs-lg);
  font-weight: 600;
  margin: 0 0 12px;
  padding: 0 0 8px;
  border-top: none;
  border-bottom: 1px solid var(--vp-c-divider);
}
.home-parts { list-style: none; padding: 0 !important; margin: 0; }
.home-parts li {
  margin: 0 !important;
  padding: 14px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}
.home-parts__name { font-weight: 600; text-decoration: none !important; }
.home-parts p { margin: 4px 0 0 !important; color: var(--vp-c-text-2); line-height: 1.6; }
.home-start { margin: 0; }
.home-start dt { font-weight: 600; margin-top: 14px; }
.home-start dd { margin: 4px 0 0; color: var(--vp-c-text-2); line-height: 1.6; }
.home-bounds { color: var(--vp-c-text-2); line-height: 1.7; }
@media (max-width: 640px) {
  .lurus-home { padding: 16px; }
}
</style>
