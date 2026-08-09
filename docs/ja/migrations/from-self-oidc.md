---
title: "自前構築の Keycloak / Auth0 から Lurus Auth へ移行する"
description: "SCIM ユーザー移行、SSO フェデレーション、段階的切り替えの完全ガイド。"
---

<div class="mig-oidc-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> 自前構築 OIDC からの移行</span>
  <h1 class="lurus-section-head__title">自前構築 OIDC から Lurus Auth へ移行する</h1>
  <p class="lurus-section-head__lede">企業がすでに IdP（Keycloak / Auth0 / Okta / Azure AD）を保有しており、従業員には引き続き会社アカウントでログインしてもらいつつ、ID レイヤーを Lurus に委ねたい場合に対応します。</p>
</div>

## <Icon name="git-branch" :size="20" /> 2 つの戦略

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="building-2" :size="20" /></span>
    <div class="lurus-card__title">戦略 A：Lurus Auth を二次 IdP として利用（推奨）</div>
    <p class="lurus-card__body">企業 IdP のユーザーライフサイクルだけを管理し、Lurus 製品は OIDC フェデレーションで ID を読み取ります。</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="import" :size="20" /></span>
    <div class="lurus-card__title">戦略 B：完全に移行する</div>
    <p class="lurus-card__body">既存の Keycloak/Auth0 を SCIM で Lurus Auth（Casdoor）へエクスポートし、唯一の真実の源とします。</p>
  </div>
</div>

### 戦略 A — フェデレーション構成

<ArchitectureDiagram title="策略 A：联邦" chart="graph LR
  IDP[企業 IdP 既存] -->|OIDC フェデレーション| LA[Lurus Auth]
  LA --> P[すべての Lurus 製品]" />

### 戦略 B — 移行構成

<ArchitectureDiagram title="策略 B：搬家" chart="graph LR
  KC[既存 Keycloak/Auth0] -->|SCIM エクスポート| LA[Lurus Auth · Casdoor]
  LA --> D[すべての下流]" />

## <Icon name="building-2" :size="20" /> 戦略 A の手順（推奨）

<ol class="lurus-steps">
<li>

**Lurus コンソールでフェデレーション接続を作成する** — `identity.lurus.cn` にアクセス → 企業設定 → ID プロバイダー → 新規作成 → OIDC を選択。企業 IdP の以下を入力します：

- Issuer URL
- Client ID
- Client Secret
- コールバック URL（Lurus が提示）

</li>
<li>

**Claim マッピング** — 企業 IdP の属性を Lurus ユーザーにマッピングします。

```yaml
# 将企业 IdP 的属性映射到 Lurus 用户
email:       email
display:     name
department:  department   # custom claim
```

</li>
<li>

**段階的展開** — 企業 IdP 側でまず 5% の従業員に Lurus ログインボタンの使用を許可します。1 週間検証 → 全従業員へ開放します。

</li>
</ol>

## <Icon name="import" :size="20" /> 戦略 B の手順

<ol class="lurus-steps">
<li>

**SCIM をエクスポートする** — Keycloak からユーザーを JSON でエクスポートします：

```bash
./kcadm.sh get users -r myrealm --fields username,email,firstName,lastName -f json > users.json
```

</li>
<li>

**Lurus へ一括インポートする**

<ApiEndpoint method="POST" path="/admin/v1/scim/users:batchImport" description="ユーザーを一括インポート（identity.lurus.cn）" />

```bash
curl -X POST https://identity.lurus.cn/admin/v1/scim/users:batchImport \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d @users.json
```

</li>
<li>

**パスワードポリシー** — Lurus はデフォルトでパスワードを移行しません（ハッシュ非互換）。初回ログイン時に「パスワードを忘れた」フローを強制します。SSO フェデレーションを利用する場合はパスワード移行は不要です。

</li>
</ol>

## <Icon name="shield-check" :size="20" /> SSO フェデレーションのメリット

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="building-2" :size="20" /></span>
    <div class="lurus-card__title">企業コンプライアンス</div>
    <p class="lurus-card__body">アカウントのライフサイクルは完全に企業側にあります。</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="user-check" :size="20" /></span>
    <div class="lurus-card__title">退職時の即時遮断</div>
    <p class="lurus-card__body">企業 IdP で無効化 → Lurus も即座にログイン不可になります。</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="history" :size="20" /></span>
    <div class="lurus-card__title">監査の一元化</div>
    <p class="lurus-card__body">ログインログは企業 IdP 側に集約されます。</p>
  </div>
  <div class="lurus-card lurus-card--auth">
    <span class="lurus-card__icon"><Icon name="shield" :size="20" /></span>
    <div class="lurus-card__title">MFA の再利用</div>
    <p class="lurus-card__body">企業の既存 MFA ポリシーがそのまま適用されます。</p>
  </div>
</div>

## <Icon name="life-buoy" :size="20" /> よくある質問

<details class="lurus-faq-item">
<summary>セッションは競合しますか？</summary>

Lurus は独立した session cookie を使用するため、既存システムには影響しません。

</details>

<details class="lurus-faq-item">
<summary>PAT / JWT は保持できますか？</summary>

できます。API レベルの Token は SSO 移行の影響を受けません。

</details>

<details class="lurus-faq-item">
<summary>監査ログはどうエクスポートしますか？</summary>

すべての ID イベントは、以下のエンドポイントから一括エクスポートできます：

<ApiEndpoint method="POST" path="/admin/v1/audit:export" description="ID イベントを一括エクスポート" />

</details>

## 次のステップ

<NextSteps :steps="[
  { text: 'Lurus Auth 概要', link: '/ja/platform/auth/', primary: true },
  { text: 'OIDC / OAuth2', link: '/ja/platform/auth/oidc' },
  { text: 'エンタープライズ展開形態', link: '/ja/solutions/enterprise-deploy' },
]" />

</div>
