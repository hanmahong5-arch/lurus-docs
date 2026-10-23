---
title: 課金の詳細
description: Lurus の現在の課金方式、残高不足時の扱い、請求書と返金。
---

<div class="billing-page">

# 課金の詳細

このページでは課金方式のみを説明し、具体的な価格は記載しません。価格と利用枠はコンソールおよび契約を基準とします。

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="package-2" :size="14" /> 方式</span>
  <h2 class="lurus-section-head__title">課金方式</h2>
</div>

- **法人契約**：プライベートデプロイとマネージド提供は、契約で定めた範囲に基づいて精算し、銀行振込で支払い、請求書を発行します。プライベートデプロイやデータセンターの指定が必要な場合は [business@lurus.cn](mailto:business@lurus.cn) までご連絡ください。
- **個人サブスクリプション**：[identity.lurus.cn](https://identity.lurus.cn) のサブスクリプション管理ページで利用可能なプランと価格を確認できます。サブスクリプション枠を超えた利用分は[アカウントウォレット](/ja/platform/#wallet)の残高から課金されます。
- **テナント利用枠**：[Lurus Hub](/hub/) では、テナント管理者が組織・チーム・下流顧客ごとに利用枠を管理し、利用量を確認できます。

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="gauge" :size="14" /> 利用枠</span>
  <h2 class="lurus-section-head__title">利用枠または残高の不足</h2>
</div>

各呼び出しはモデルと Token 使用量に応じて消費量が換算されます。利用枠と残高がどちらも不足している場合、リクエストは拒否され、利用枠不足のエラーが返されます。対処手順は [トラブルシューティング · クォータ / 残高不足](/ja/guide/troubleshooting#insufficient-quota) を参照してください。

---

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="receipt" :size="14" /> 請求</span>
  <h2 class="lurus-section-head__title">請求明細・請求書・返金</h2>
</div>

- **請求明細の確認**：[identity.lurus.cn](https://identity.lurus.cn) にログインし、取引明細と利用統計を確認できます。
- **請求書**：法人契約は契約に基づいて発行します。その他の場合は [support@lurus.cn](mailto:support@lurus.cn) までご連絡ください。
- **返金**：[support@lurus.cn](mailto:support@lurus.cn) までご連絡ください。消費済みの分は返金対象外です。

<NextSteps
  title="次のステップ"
  :steps="[
    { text: 'プラットフォーム概要', link: '/ja/platform/', primary: true },
    { text: 'よくある質問', link: '/ja/platform/faq' },
    { text: 'API Key の取得', link: '/ja/guide/get-api-key' },
  ]"
/>

</div>
