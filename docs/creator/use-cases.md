---
title: Creator 使用案例
description: B 站视频解说 / 公众号长文 / 小红书笔记三类典型场景的完整流水线。
---

<div class="creator-page">

# Creator 使用案例 <StatusBadge status="dev" />

三个真实流水线案例，覆盖从视频、长文到社交短内容。

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="video" :size="14" /> 案例一</span>
  <h2 class="lurus-section-head__title">B 站视频解说</h2>
  <p class="lurus-section-head__lede">一条 B 站视频链接 → 口播脚本 + 封面文案。</p>
</div>

| 阶段 | 工具 | 产出 |
|------|------|------|
| 输入 | 粘贴视频链接 | 原视频 URL |
| 下载 | yt-dlp | mp4 文件 |
| 转写 | Whisper large-v3 | 带时间戳的中文字幕 |
| 精炼 | LLM（DeepSeek-Chat） | 分段摘要 + 亮点 |
| 改写 | LLM（Claude Sonnet） | 3 版口播脚本（严肃 / 调侃 / 悬念） |
| 封面 | LLM | 3 个封面标题候选 |
| 输出 | Creator 编辑器 | 可直接粘贴到 B 站后台 |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="gauge" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">典型耗时</p>
    <div class="lurus-callout__body">10 分钟视频 → 90 秒全流程。</div>
  </div>
</div>

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="book-open" :size="14" /> 案例二</span>
  <h2 class="lurus-section-head__title">公众号长文</h2>
  <p class="lurus-section-head__lede">一个主题 → 公众号 2000 字深度文。</p>
</div>

<ArchitectureDiagram
  title="主题 → 公众号长文"
  chart='graph TD
    TOPIC["主题输入：复盘 WAL 在 AI Agent 持久化中的应用"] --> SEARCH[资料检索<br/>Lurus API + web_search Tool]
    SEARCH --> OUTLINE[大纲生成<br/>LLM 列 5 个 H2]
    OUTLINE --> WRITE[逐段写作<br/>按大纲分块生成]
    WRITE --> FIG[配图建议<br/>LLM 建议 3 张示意图位置]
    FIG --> MD[Markdown 输出到 Creator 编辑器]'
/>

**适配点**：

- 公众号不支持 H4，自动降级
- 自动生成"推荐阅读"互链（基于关键词匹配）
- 支持"口语化 / 学术化 / 商业化"三档风格切换

<div class="lurus-section-head">
  <span class="lurus-section-head__eyebrow"><Icon name="share-2" :size="14" /> 案例三</span>
  <h2 class="lurus-section-head__title">小红书笔记</h2>
  <p class="lurus-section-head__lede">一张图片 + 一句槽点 → 完整种草笔记。</p>
</div>

**输入**：产品图 + "续航真的顶"

**输出**：

```
┌─────────────────────────────┐
│ 🌙 终于找到通勤救星！       │
│                              │
│ 用了一周真的爱上了...（100 字）│
│                              │
│ ✅ 续航 28 小时              │
│ ✅ 重量只有 180 克           │
│ ✅ 降噪 -35dB                │
│                              │
│ #数码好物 #通勤 #降噪耳机   │
└─────────────────────────────┘
```

自动生成 6-10 个话题标签，避开违禁词。

---

## 共用流水线对比

| 场景 | 视频解说 | 公众号长文 | 小红书 |
|------|---------|-----------|--------|
| 输入形态 | URL | 主题词 | 图+短句 |
| 核心模型 | Whisper + LLM | LLM | LLM |
| 产物长度 | 300-500 字脚本 | 2000 字 | 80-150 字 |
| 发布支持 | 复制导出 | chromedp 自动发布 | chromedp 自动发布 |
| 典型耗时 | 90 秒 | 2 分钟 | 30 秒 |

## 下一步

<NextSteps :steps="[
  { text: '回到简介', link: '/creator/', primary: true },
  { text: '安装指南', link: '/creator/install' },
  { text: '使用手册', link: '/creator/usage' },
]" />

</div>
