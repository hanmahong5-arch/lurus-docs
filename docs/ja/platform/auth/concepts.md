---
title: コアコンセプト | Zitadel ID 認証
description: Instance / Organization / Project / Application / User / Grant / Administrator など Zitadel オブジェクトモデルの詳細解説。Lurus の実際のデプロイ構成に即して説明します。
---

<div class="auth-concepts">

# コアコンセプト

Lurus は [Zitadel](https://zitadel.com) を統一 OIDC ID プロバイダー（IdP）として利用しており、公開エンドポイントは `auth.lurus.cn` です。本ページではオブジェクトモデルの階層構造を整理します。

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> モデル</span>
  <h2 class="lurus-section-head__title">オブジェクトモデル一覧</h2>
  <p class="lurus-section-head__lede">6 種類のオブジェクトと一方向の包含関係——この図を理解すれば、以降の各節はその展開にすぎません。</p>
</div>

<ArchitectureDiagram
  title="Zitadel オブジェクトモデル階層"
  chart="graph TD; Instance[Instance · lurus-prod] --> Org[Organization · lurus.cn]; Org --> User[User · 従業員 / 顧客 / Service Account]; Org --> Project[Project · lurus-api / lucrum / switch …]; Org --> OrgGrant[Grant · Project を他の Org に付与]; Project --> App[Application · Web / SPA / Native / API / SAML]; Project --> Role[Role · 例 lucrum:admin]; User -. User Grant .-> Role"
/>

包含関係は**厳密に一方向**です：Instance ⊃ Organization ⊃ Project ⊃ (Application, Role)。User は Organization に属し、User Grant を通じて Project Role に紐づきます。

---

## Instance インスタンス

データ階層の**最上位の抽象**であり、独立した ID 発行者（issuer）に相当します。すべての token の `iss` はこの Instance のドメインを指します。

| 属性 | 説明 |
|------|------|
| 役割 | システムレベルのデフォルト設定コンテナ（Branding、Login/Password Policy など） |
| マルチテナント | 1 つのインスタンスが複数の Organization を収容し、テナント分離を実現 |
| 管理者 | Instance 管理者はすべての Organization を横断でき、権限が最も高い |
| 仮想インスタンス | System API により複数の仮想インスタンスを作成可能。SaaS のマルチテナント配信に適する |

::: tip Lurus におけるコンテキスト
本番環境にはインスタンスが 1 つだけ **`lurus-prod`**（`auth.lurus.cn`）存在します。仮想インスタンスは不要で、すべてのプロダクトラインが同一の issuer を共有します。
:::

---

## Organization 組織

**テナント単位**であり、ディレクトリサービスにおける OU に似ています。1 つの Instance 内に複数存在でき、ユーザーデータは互いに分離されます。所有物：User & Service Account（専用ユーザープール）、Project（プロダクトの分類およびアプリケーション・ロール）、Domain（1 つ以上、うち 1 つが主ドメイン）、Policy（インスタンスのデフォルトセキュリティポリシーを上書き可能）。**権限委譲**をサポートします：自身の Project の管理権限を別の Organization に付与し、B2B のセルフサービス IAM を実現します。

::: tip Lurus におけるコンテキスト
現在の主組織は **`lurus.cn`** で、社内従業員アカウントと各プロダクトの Project を収容しています。企業顧客を受け入れる際は、企業ごとに独立した補助 Organization を作成し、Project Grant を通じて特定のプロダクト権限を開放できます。
:::

---

## Project プロジェクト

**論理的なプロダクト分類**であり、各 Project は 1 つのソフトウェア製品またはサービス境界に対応します。同一 Project 配下のすべての Application は同一の Role 定義を共有します。構成要素：Application（ログインクライアント）、Role（`admin`/`viewer` などのロール文字列）、User Grant（ロールを User に付与）、Granted Organization（Project 全体を他の Org に付与）。Project レベルの設定には次が含まれます：ログイン時にロールクレーム（`urn:zitadel:iam:org:project:roles`）を含めることを要求するか、外部 IdP でのログインを許可するか、など。

::: tip Lurus におけるコンテキスト
各プロダクトラインが独立した Project に対応します。命名は `lurus.yaml` `capabilities:` レジストリを参照してください。ロールの規約は各プロダクトチームが定義します。
:::

---

## Application アプリケーション

**具体的なログインクライアント**であり、実際に認証リクエストを発行するプログラムエンティティです。それぞれ独立した `client_id` を持ち、認証方式に応じて `client_secret` または PKCE 設定を備えます。

| タイプ | 典型的なシナリオ | 認証方式 |
|------|---------|---------|
| **Web** | サーバーサイドレンダリング（Spring、Phoenix、Django） | Authorization Code + PKCE または Client Secret |
| **SPA** | フロントエンドのみのシングルページ（React、Vue） | Authorization Code + **PKCE**（必須） |
| **Native** | デスクトップ/モバイル（Switch、Lutu APP） | Authorization Code + PKCE + Custom Scheme |
| **API** | バックエンドのみ / M2M | Client Credentials（JWT または Basic Auth）/ Private Key JWT |
| **SAML** | SAML 2.0 互換のエンタープライズアプリ | SAML 2.0 アサーション |

::: warning PKCE について
ユーザー操作を伴うアプリケーション（Web/SPA/Native）はデフォルトで **PKCE** を使用します。フロントエンドアプリで Implicit Flow を使用することは禁止です。
:::

**主要な設定**：`client_id`（全タイプ共通、アプリケーションを識別）；`client_secret`（シークレットを安全に保管できるサーバーサイドアプリのみ。SPA/Native は PKCE で代替）；Redirect URI（完全一致を厳密に検証。開発モードでは緩和可能）；開発モード（非 HTTPS とワイルドカード URI を許可。ローカル開発専用で、本番では必ず無効化する）。

---

## User ユーザー

実在する人物の **Human User** と、自動化システムの **Machine User** に分かれます。

- **Human User**：Password、MFA（TOTP/SMS）、Passkey（FIDO2/WebAuthn）、外部 IdP（Google/GitHub など）をサポート。フィールドにはログイン名、氏名、メールアドレス、電話番号、言語設定、カスタム Metadata（キー・バリューのペア）が含まれます。
- **Machine User / Service Account**：バックエンドサービス、CI/CD、定期実行タスク。認証方式は **PAT**（長期の無記名 token、シンプル）または **JWT Profile**（秘密鍵で署名した JWT で token と交換、より安全）。

**ユーザー状態**：`active`（ログイン可）/ `inactive`（無効化）/ `locked`（失敗回数超過によるロック）/ `deleted`（論理削除、監査のため保持）。

::: tip 重要な制約
各 User は**唯一の Organization** に厳密に属します。組織をまたぐ場合は Organization Grant の仕組みを利用する必要があり、アカウントを組織間で直接共有することはできません。
:::

---

## Grant と Role

RBAC を基盤とし、中核は Project Role、User Grant、Project Grant です。

- **Project Role**：Project 内のロール文字列で、3 つのフィールドからなります。Key（コード識別子、例 `admin`）、Display Name（コンソール表示、例「管理者」）、Group（任意のグループ、例 `management`）。同一 Project 配下のすべての Application で共有されます。
- **User Grant** = `User + Project + Role[]`：ログイン後、access token の `urn:zitadel:iam:org:project:roles` クレームに、対象 Project でユーザーに付与されたすべてのロールが含まれます。バックエンドはこのクレームを解析して認可を行い、追加で API を呼び出す必要はありません。
- **Project Grant** = `Project（提供元 Org）→ Organization（対象 Org）`：Project 全体の管理権限を別の Organization に付与します。B2B マルチテナントの中核です：Lurus は顧客の従業員のためにアカウントを作成する必要がなく、顧客が自身の Organization 内でユーザーと権限を自己管理します。

---

## Administrator 管理者

4 つの階層があり、最小権限の原則に従います：

| 階層 | スコープ | 典型的なロール |
|------|--------|---------|
| **IAM / Instance** | インスタンス全体（すべての Organization を横断） | `IAM_OWNER` |
| **Organization** | 単一組織内のすべてのリソース | `ORG_OWNER`、`ORG_USER_MANAGER` |
| **Project** | 単一 Project 内のアプリケーション、ロール、付与 | `PROJECT_OWNER` |
| **Project Grant** | 付与された Project のユーザーロール管理 | `PROJECT_GRANT_OWNER` |

**よく使われるロール文字列**：`IAM_OWNER`（インスタンスレベルで最高権限。すべての組織/ポリシー/仮想インスタンスを管理）、`ORG_OWNER`（組織内のユーザー/Project/ドメイン/ポリシーを管理）、`ORG_USER_MANAGER`（ユーザーとロール割り当てのみを管理し、Project 構造は変更しない）、`ORG_USER_PERMISSION_EDITOR`（User Grant の編集のみ）、`PROJECT_OWNER`（Project 内の Application/Role/Grant を管理）、`PROJECT_GRANT_OWNER`（付与された Project 内における自組織のユーザーロールを管理）。

::: warning 組織をまたぐ可視性
組織をまたいで閲覧・管理できるのは `IAM_OWNER` のみです。`ORG_OWNER` は自組織に厳密に限定され、他組織のデータにはアクセスできません。
:::

---

## Policy ポリシー

Instance 層でデフォルト値を定義し、Organization 層で必要に応じて上書きします。

| ポリシータイプ | 説明 |
|---------|------|
| **Login Policy** | どの認証方式を許可するか（Password/Passkey/外部 IdP/登録の可否） |
| **Password Policy** | パスワードの複雑さ、最小長、過去のパスワードを禁止するか |
| **Lockout Policy** | ログイン失敗回数のしきい値、ロック時間 |
| **MFA Policy** | MFA を強制するか、どの方式を許可するか |
| **Privacy Policy** | プライバシーポリシー URL、ToS URL |
| **Branding** | ログインページの Logo、配色、カスタム CSS（Organization レベルで個別にカスタマイズ可能） |

主組織 `lurus.cn` の具体的なポリシーはプラットフォーム運用チームが Zitadel Console で管理しており、ここではハードコードしません。

---

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Lurus の実際のデプロイ構成に合わせる</p>
    <div class="lurus-callout__body"><ul><li><strong>Project の命名</strong>：各プロダクトが 1 つの Project に対応します（<code>lurus-api</code>、<code>lucrum</code>、<code>switch</code>、<code>lutu</code>、<code>admin</code>、<code>forge</code>）。Zitadel Console を正とします。</li><li><strong>ロールの規約</strong>：ロール文字列はサービスレベルの CLAUDE.md または <code>lurus.yaml</code> <code>capabilities:</code> レジストリで定義され、ここではハードコードしません。</li><li><strong>Machine User のシナリオ</strong>：M2M 呼び出しは一律に Machine User + JWT Profile を使用し、人間のアカウントの共有を避けます。</li><li><strong>PAT のシナリオ</strong>：CI/CD やスクリプトには PAT を使用できますが、最短の有効期限を設定し、定期的にローテーションする必要があります。</li><li><strong>完全な設定リファレンス</strong>：<code>lurus.yaml</code> <code>capabilities:</code> セクションがアーキテクチャ変更の唯一の入口です。</li></ul></div>
  </div>
</div>

</div>

<style scoped>
.auth-concepts .lurus-section-head { margin-top: 8px; }
</style>
