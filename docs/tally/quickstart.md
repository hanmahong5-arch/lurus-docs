---
title: "Tally 快速开始"
description: "三步上手 Lurus Tally：注册开通 → 建商品 SKU → 建采购单入库。最快 5 分钟跑通第一笔库存。"
---

<div class="tally-page">

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="rocket" :size="14" /> 快速开始</span>
  <h1 class="lurus-section-head__title">三步跑通第一笔库存</h1>
  <p class="lurus-section-head__lede">注册开通 → 建商品 SKU → 建采购单入库。零售场景最快 5 分钟、跨境场景约 10 分钟即可开出第一单。</p>
</div>

## 第一步 · 注册并开通

1. 打开 <a href="https://tally.lurus.cn" target="_blank" rel="noopener noreferrer">tally.lurus.cn</a>，用你的 Lurus 账号登录（统一身份认证，没有账号会引导你注册）。
2. 首次进入时选择**行业 Profile**：
   - **跨境贸易（cross_border）**：多币种、报关辅助、补货 Agent。
   - **本地零售（retail）**：万级长尾 SKU、散装称重、熟客记忆。
   - **混营（hybrid）**：两者能力并集。
3. 系统自动为你开通**免费试用**租户，无需信用卡。

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="info" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Profile 选错了也不怕</p>
    <div class="lurus-callout__body">租户创建后 90 天内可免费切换一次 Profile，切换不会删除任何数据。</div>
  </div>
</div>

## 第二步 · 建商品 SKU

进入后按 <kbd>⌘</kbd> + <kbd>K</kbd> 打开命令面板，输入「新建商品」，或在商品页点击「新建」。填写：

| 字段 | 说明 |
|------|------|
| 商品名称 | 如「不锈钢内六角螺丝 M4×20」 |
| SKU 编码 | 唯一编码，如 `SS-M4-20`（留空可自动生成） |
| 计量策略 | `individual` 标准件 / `weight` 散装称重 / `length` 按长度 / `batch` 批次效期 / `serial` 序列号 |
| 多单位换算 | 如散装螺丝：基本单位「克」，附加单位「千克（×1000）」「百粒（×1530）」 |
| 成本价 / 销售价 | 全程高精度计算，无浮点误差 |

保存后，这个 SKU 的实时库存快照（在手 / 可用 / 预占）即被创建，初始为 0。

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="camera" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">嫌一个个录太慢？</p>
    <div class="lurus-callout__body">支持 CSV 批量导入，或直接 <strong>AI 拍照入库</strong>——拍下供货单，AI 自动识别商品并建档。</div>
  </div>
</div>

## 第三步 · 建采购单入库

1. 按 <kbd>⌘</kbd> + <kbd>K</kbd> 输入「新建采购单」，或在采购页点击「新建」。
2. 选择**供应商**，添加第二步建好的 **SKU**，填写采购**数量**与**单价**。
3. 保存为草稿后点击**确认入库**：Tally 在一个事务内更新库存快照（在手数量增加）、生成应付账期、并写入审计日志。
4. 库存变动会触发事件——若某 SKU 低于安全库存，补货 Agent 会在每日建议里提醒你。

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="shield-check" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">改错了怎么办</p>
    <div class="lurus-callout__body">单据确认后不直接改库存，统一走「红冲」（反冲单据）保证账实一致与可审计。</div>
  </div>
</div>

完成这三步，你已经跑通「商品 → 采购 → 库存」的最小闭环。接下来可以试试销售开单、AI 拍照入库和自然语言查账。

<NextSteps
  title="下一步"
  :steps="[
    { text: '了解 Tally 全部能力', link: '/tally/', primary: true },
    { text: '打开 Tally 控制台', link: 'https://tally.lurus.cn', external: true },
    { text: '账号与计费', link: '/platform/' },
  ]"
/>

</div>
