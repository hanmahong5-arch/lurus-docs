---
title: API Key の取得
description: Lurus アカウントを登録し、API Key を取得するための完全な手順。
---

<div class="getkey-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="key-round" :size="14" /> API Key の取得</span>
  <h1 class="lurus-section-head__title">アカウントを登録して、最初の Key を作成しよう</h1>
  <p class="lurus-section-head__lede">3 分で使える API Key を取得。</p>
</div>

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">OIDC / OAuth 連携</p>
    <div class="lurus-callout__body">エンドユーザーが Lurus アカウントで自社アプリにログインしたり、バックエンドが Service User + JWT Profile で呼び出したりする場合は、統一 ID 認証に切り替えられます：<a href="/ja/platform/auth/oidc">OIDC / OAuth2 連携</a> · <a href="/ja/platform/auth/api-auth">API 認証（PAT/JWT）</a>。API Key と OIDC Token は併存でき、どちらも有効です。</div>
  </div>
</div>

## 登録と Key の作成

<ol class="lurus-steps">
<li>

[Lurus コンソール](https://api.lurus.cn) にアクセス →「登録」→ メールアドレスとパスワードを入力 → メール認証を完了。

</li>
<li>

ログイン → 左側の「トークン管理」→「新しいトークンを作成」→ トークン名（識別しやすいもの）を入力 → 確認。

</li>
</ol>

<div class="lurus-callout lurus-callout--warn">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">一度だけ表示されます</p>
    <div class="lurus-callout__body">作成後はすぐに API Key をコピーして保存してください。<strong>一度だけ表示されます</strong>！</div>
  </div>
</div>

## API Key の形式

`sk-` で始まる 48 桁のランダム文字列：`sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`。

## API Key の管理

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="bar-chart-3" :size="22" /></span>
    <div class="lurus-card__title">使用量の確認</div>
    <p class="lurus-card__body">「トークン管理」ページで、各 Key の使用済み額度・残り額度・最近の呼び出し時刻を表示します。</p>
  </div>
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="lock" :size="22" /></span>
    <div class="lurus-card__title">無効化 / 削除</div>
    <p class="lurus-card__body">無効化 = 利用権限の一時停止（復元可能）；削除 = 永久削除（復元不可）。</p>
  </div>
  <div class="lurus-card lurus-card--api">
    <span class="lurus-card__icon"><Icon name="filter" :size="22" /></span>
    <div class="lurus-card__title">モデル権限の設定</div>
    <p class="lurus-card__body">Key の横の「編集」→「利用可能なモデル」で許可するモデルを選択 → 保存。</p>
  </div>
</div>

## セキュリティ推奨事項

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Key はパスワードとして管理する</p>
    <div class="lurus-callout__body">漏洩させない（公開リポジトリにコミットしない）；90 日ごとに Key をローテーションする；最小権限（必要なモデルのみ付与）；呼び出しログを定期的に確認し、異常を早期に検知して対応する。</div>
  </div>
</div>

## よくある質問

<details class="lurus-faq-item">
<summary>Key を忘れてしまったら？</summary>

復元できないため、新しい Key を作成してください。

</details>

<details class="lurus-faq-item">
<summary>Key が盗用された？</summary>

直ちにその Key を無効化または削除し、新しい Key を作成してください。

</details>

<details class="lurus-faq-item">
<summary>額度を使い切った？</summary>

セルフチャージまたはプランのアップグレードを行います——まず [課金詳細](/ja/platform/billing) で各ティア（Free / Basic / Pro）を確認し、次に [コンソール](https://api.lurus.cn) でチャージまたはアップグレードしてください。

</details>

<NextSteps
  title="次のステップ"
  :steps="[
    { text: 'クイックスタート', link: '/ja/guide/quickstart', primary: true },
    { text: '対応モデル', link: '/guide/models' },
    { text: '課金詳細', link: '/ja/platform/billing' },
  ]"
/>

</div>
