---
title: MemX よくある質問
description: MemX AI メモリーエンジンのよくある質問と回答。
---

<div class="memx-faq">

# よくある質問

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="brain" :size="14" /> 基礎</span>
  <h2 class="lurus-section-head__title">基礎的な質問</h2>
</div>

<details class="lurus-faq-item"><summary>MemX と mem0 はどのような関係ですか？</summary>

MemX は [mem0](https://github.com/mem0ai/mem0) の強化版（スーパーセット）であり、ACE インテリジェントメモリー管理レイヤーが追加されています。`ace_enabled=False` の場合は mem0 とまったく同じ動作で、オーバーヘッドはゼロです。

</details>

<details class="lurus-faq-item"><summary>GPU は必要ですか？</summary>

必要ありません。ローカル埋め込みモデル all-MiniLM-L6-v2 は ONNX Runtime を介して CPU 上で動作します（&lt; 5ms/件）。Reflector のルール事前フィルタは GPU に依存せず、hybrid の LLM 精錬はリモート API を利用します。

</details>

<details class="lurus-faq-item"><summary>追加の LLM トークン消費が発生しますか？</summary>

デフォルトの `hybrid` では価値のある候補に対してのみ LLM を呼び出すため、mem0 の全量呼び出しと比べて 90%+ 削減されます。LLM が利用できない場合は自動的に純粋なルールへ降格し、コストはゼロです。明示的に無効化するには `reflector.mode="rules"` を設定します。

</details>

<details class="lurus-faq-item"><summary>どのベクトルデータベースに対応していますか？</summary>

mem0 のすべて（Qdrant、Chroma、Pinecone、Weaviate、Milvus など）を継承しています。デフォルトのメモリーストレージは開発・テストに適しています。

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> 利用</span>
  <h2 class="lurus-section-head__title">利用に関する質問</h2>
</div>

<details class="lurus-faq-item"><summary>mem0 からどう移行すればよいですか？</summary>

<ol class="lurus-steps">
<li>

`pip install git+https://github.com/UU114/memx.git`

</li>
<li>

`from mem0 import Memory` を `from memx import Memory` に変更します

</li>
<li>

既存のコードを変更する必要はありません（ACE はデフォルトで無効）。

</li>
<li>

準備ができたら `config={"ace_enabled": True}` を追加してインテリジェント機能を有効化します。

</li>
</ol>

</details>

<details class="lurus-faq-item"><summary>データはどこに保存されますか？</summary>

設定したベクトルデータベースのバックエンドに依存します。デフォルトはメモリー（再起動で消失）で、本番環境では Qdrant/Chroma による永続化を推奨します。ローカル埋め込みモデルは `~/.memx/models/` にキャッシュされます。

</details>

<details class="lurus-faq-item"><summary>減衰速度はどう制御しますか？</summary>

| パラメータ | 効果 |
|------|------|
| `decay.half_life_days` | 大きくする → 減衰がより緩やか（デフォルト 30 日） |
| `decay.boost_factor` | 大きくする → 想起時の強化がより顕著（デフォルト 0.1） |
| `decay.permanent_threshold` | 小さくする → 永続メモリーになりやすい（デフォルト 15 回） |

</details>

<details class="lurus-faq-item"><summary>誤判定された知識はどう処理しますか？</summary>

<ol class="lurus-steps">
<li>

`memx list --scope project:my-app` — 確認する

</li>
<li>

`memx forget <memory-id>` — 削除する

</li>
<li>

`memx learn "correct knowledge"` — 手動で追加する

</li>
</ol>

</details>

<details class="lurus-faq-item"><summary>複数人 / 複数 Agent でメモリーを共有するには？</summary>

デーモンプロセスモードを有効にすると、複数の Agent が IPC Socket を介して同一のナレッジベースを共有できます（IDE プラグイン、チーム協働）。`scope` を使ってプロジェクト/ワークスペースを区別します。

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14" /> プライバシー</span>
  <h2 class="lurus-section-head__title">プライバシーに関する質問</h2>
</div>

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="lock" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">フィルタは無効化できません</p>
    <div class="lurus-callout__body"><p>12 件の組み込み機密情報フィルタルールは無効化できないセキュリティの最低ラインであり、<code>privacy_custom_patterns</code> を通じて追加ルールを足すことのみ可能です。</p></div>
  </div>
</div>

<details class="lurus-faq-item"><summary>どのような種類の機密情報フィルタに対応していますか？</summary>

| 種類 | 例 |
|---------|------|
| PEM 秘密鍵 | `-----BEGIN RSA PRIVATE KEY-----` |
| Bearer / JWT Token | `Bearer eyJhbG...` |
| Anthropic API Key | `sk-ant-api03-*` |
| OpenAI API Key | `sk-proj-*` |
| GitHub Token | `ghp_*`, `github_pat_*` |
| AWS Access Key | `AKIA*` |
| AWS Secret Key | 40 文字の base64 |
| データベース接続文字列 | `postgres://user:pass@host/db` |
| オペレーティングシステムのパス | `/home/user/.ssh/id_rsa` |
| カスタムルール | `privacy_custom_patterns` を通じて追加 |

::: info
これら 12 件のルールは**鍵とローカルパス**系の機密情報（secrets + user paths）に焦点を当てており、従来の意味での PII（メールアドレス / 電話番号 / 身分証など）ではありません。PII フィルタが必要な場合は、`privacy_custom_patterns` を通じて自分で拡張してください。
:::

</details>

<details class="lurus-faq-item"><summary>フィルタされた元の値はどこへ行きますか？</summary>

プレースホルダ（例 `[REDACTED:api_key]`）に置き換えられ、元の値はどこにも保存されません。フィルタは書き込みパイプラインの最前段で実行されます。

</details>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> パフォーマンス</span>
  <h2 class="lurus-section-head__title">パフォーマンスに関する質問</h2>
</div>

<details class="lurus-faq-item"><summary>メモリーは何件まで保存できますか？</summary>

ベクトルデータベースのバックエンド容量に依存し、MemX 自体にハードな上限はありません。減衰エンジンが自動的にアーカイブし、アクティブな規模を妥当に保ちます。

</details>

<details class="lurus-faq-item"><summary>RecallReinforcer は検索パフォーマンスに影響しますか？</summary>

影響しません。非同期のバックグラウンドスレッドで、結果を返してから `recall_count` を更新するため、検索をブロックしません。

</details>

<details class="lurus-faq-item"><summary>検索のレイテンシはどのくらいですか？（&lt; 10,000 件のメモリー）</summary>

| 操作 | レイテンシ |
|------|------|
| 4 層ハイブリッド検索 | 10-50ms |
| 純粋なキーワード検索（L4 降格） | 5-20ms |
| ローカル埋め込み計算 | &lt; 5ms |
| 書き込み（Reflector + Curator を含む） | 20-100ms |

</details>

## 次のステップ

<NextSteps
  :steps="[
    { text: 'クイックスタート — 5 分でコア機能を体験', link: '/ja/memx/quickstart', primary: true },
    { text: 'コアコンセプト — ACE エンジンを深掘り', link: '/ja/memx/concepts' },
    { text: 'アーキテクチャ設計 — 完全なシステムアーキテクチャ', link: '/ja/memx/architecture' },
  ]"
/>

</div>
