---
title: 内容行业方案
description: Creator + Lurus API — 批量内容生产、多平台分发、版权与合规。
---

<div class="content-page">

# 内容行业方案

<MetricStats :items="[
  { label: '定制平台', value: '6 个', hint: '一次生成' },
  { label: '视频源站点', value: '1000+', hint: 'yt-dlp' },
  { label: '10 分钟视频转脚本', value: '90 秒' },
  { label: '主题转长文', value: '2 分钟' },
]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="users" :size="14" /> 适用对象</span>
  <h2 class="lurus-section-head__title">谁在用</h2>
</div>

<div class="lurus-cards lurus-cards--2 lurus-cards--compact">
  <div class="lurus-card lurus-card--creator">
    <span class="lurus-card__icon"><Icon name="video" :size="20" /></span>
    <div class="lurus-card__title">MCN / 个人 IP</div>
    <p class="lurus-card__body">机构与个人 IP 运营。</p>
  </div>
  <div class="lurus-card lurus-card--creator">
    <span class="lurus-card__icon"><Icon name="briefcase" :size="20" /></span>
    <div class="lurus-card__title">企业新媒体中心</div>
    <p class="lurus-card__body">多账号矩阵化运营。</p>
  </div>
  <div class="lurus-card lurus-card--creator">
    <span class="lurus-card__icon"><Icon name="share-2" :size="20" /></span>
    <div class="lurus-card__title">跨境电商内容团队</div>
    <p class="lurus-card__body">多平台多语言分发。</p>
  </div>
  <div class="lurus-card lurus-card--creator">
    <span class="lurus-card__icon"><Icon name="graduation-cap" :size="20" /></span>
    <div class="lurus-card__title">教育 / 知识付费</div>
    <p class="lurus-card__body">课程内容批量改写。</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14" /> 核心组件</span>
  <h2 class="lurus-section-head__title">产品组合</h2>
</div>

<div class="action-grid">
  <ActionCard product-id="creator" :actions="[{label:'了解 Creator', href:'/creator/', primary:true}]" />
  <ActionCard product-id="lurus-api" :actions="[{label:'模型目录', href:'/guide/models', primary:true}]" />
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="workflow" :size="14" /> 流水线</span>
  <h2 class="lurus-section-head__title">从素材到多平台分发</h2>
  <p class="lurus-section-head__lede">素材源 → LLM 改写 → 多平台发布，公众号 / 抖音 / 小红书经 chromedp 自动发布。</p>
</div>

<ArchitectureDiagram title="内容生产流水线" chart="graph LR; Src[素材源<br/>YouTube · B 站 · 本地视频 · 图文] --> Rewrite[LLM 改写<br/>公众号长文 · 抖音脚本 · 小红书笔记 · Shorts · TikTok · Reels]; Rewrite --> Auto[自动发布<br/>公众号 / 抖音 / 小红书 chromedp]; Rewrite --> Manual[其余手动导出]" />

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="sparkles" :size="14" /> 特色</span>
  <h2 class="lurus-section-head__title">特色能力</h2>
</div>

<div class="lurus-cards lurus-cards--2">
  <div class="lurus-card lurus-card--creator">
    <span class="lurus-card__icon"><Icon name="video" :size="20" /></span>
    <div class="lurus-card__title">Whisper 转写</div>
    <p class="lurus-card__body">1000+ 站点视频源通过 yt-dlp 下载后本地转写。</p>
  </div>
  <div class="lurus-card lurus-card--creator">
    <span class="lurus-card__icon"><Icon name="sparkles" :size="20" /></span>
    <div class="lurus-card__title">风格切换</div>
    <p class="lurus-card__body">同一素材可生成"严肃 / 调侃 / 悬念"三套脚本。</p>
  </div>
  <div class="lurus-card lurus-card--creator">
    <span class="lurus-card__icon"><Icon name="shield-check" :size="20" /></span>
    <div class="lurus-card__title">版权守则</div>
    <p class="lurus-card__body">自动检测可能的版权风险词并提示。</p>
  </div>
  <div class="lurus-card lurus-card--creator">
    <span class="lurus-card__icon"><Icon name="user-check" :size="20" /></span>
    <div class="lurus-card__title">多账号</div>
    <p class="lurus-card__body">同一设备管理多个公众号 / 抖音账号。</p>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="bar-chart-3" :size="14" /> 产能</span>
  <h2 class="lurus-section-head__title">案例产能</h2>
</div>

| 场景 | 人工耗时 | Creator 耗时 |
|------|---------|--------------|
| 10 分钟视频 → B 站口播脚本 | 1-2 小时 | **90 秒** |
| 主题 → 2000 字公众号 | 3-4 小时 | **2 分钟** |
| 1 张图 + 槽点 → 小红书 | 20 分钟 | **30 秒** |

## 下一步

<NextSteps :steps="[
  { text: 'Creator 使用案例', link: '/creator/use-cases', primary: true },
  { text: 'Lurus API 模型目录', link: '/guide/models' },
  { text: '联系商务', link: 'mailto:business@lurus.cn', external: true },
]" />

</div>
