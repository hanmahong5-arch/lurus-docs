<div class="lurus-section-head"><span class="lurus-section-head__eyebrow"><Icon name="layers" :size="14"/> 横向视角</span><h2 class="lurus-section-head__title">跨产品速查</h2><p class="lurus-section-head__lede">单产品手册回答 "这个产品怎么用"；这一组横向页面回答 "14 个产品凑一起怎么用"。</p></div>

<div class="lurus-callout lurus-callout--info"><span class="lurus-callout__icon"><Icon name="search" :size="18"/></span><div><p class="lurus-callout__title">找单产品手册</p><div class="lurus-callout__body">单产品手册 → <code>/products/&lt;id&gt;</code>，索引在导航栏 <strong>产品手册</strong>。</div></div></div>

## 四张总览

| 页面 | 适合谁 | 一句话 |
|---|---|---|
| <Icon name="layers" :size="15"/> [能力矩阵](/cross/capability-matrix) | 决策者 / PM | 14 产品 × 12 能力的勾选表，找重合与缺口 |
| <Icon name="users" :size="15"/> [用户旅程](/cross/user-journeys) | 客户成功 / 销售 / 决策者 | 4 类用户从注册到续费的全流程图 |
| <Icon name="workflow" :size="15"/> [集成配方](/cross/integration-recipes) | 开发者 / 架构师 | 真实跨产品组合的可复用 recipe |
| <Icon name="git-branch" :size="15"/> [决策路由](/cross/decision-router) | 任何人 | "我有 X 需求，该用 Lurus 哪个产品？" 决策树 |

## 系统全貌（一图速览）

```mermaid
graph TB
  subgraph user["用户世界"]
    U1[终端用户]
    U2[企业客户]
    U3[内部员工]
    U4[开发者集成方]
  end

  subgraph p2["P2 桌面 / 入口"]
    SW[Switch 桌面]
    CR[Creator 桌面]
    LU[Lutu 移动]
    WWW[www 门面]
  end

  subgraph p1["P1 业务"]
    LC[Lucrum 量化]
    KV[Kova Agent]
    LM[Lumen CLI]
    FG[Forge 工作台]
    TL[Tally 进销存]
  end

  subgraph p0["P0 平台底座"]
    PF[Platform 账户·钱包·订阅]
    NA[Newapi LLM 网关]
    MX[MemX 记忆]
    AD[Admin 后台]
  end

  subgraph mcp["MCP 内部工具"]
    M1[casdoor-mcp]
    M2[k8s-mcp]
    M3[platform-mcp]
  end

  U1 --> SW
  U1 --> CR
  U1 --> LU
  U2 --> WWW
  U2 --> LC
  U2 --> TL
  U3 --> AD
  U3 --> SW
  U4 --> NA
  U4 --> KV

  SW --> NA
  CR --> NA
  CR --> MX
  LC --> NA
  LC --> MX
  LU --> PF
  KV --> NA
  KV --> MX
  KV --> LM
  FG --> KV
  TL --> PF
  TL --> NA
  AD --> PF

  SW -.调用.-> M1
  SW -.调用.-> M2
  SW -.调用.-> M3
  M1 -.读写.-> PF
  M3 -.读写.-> PF

  classDef p0 fill:#fef0e8,stroke:#C67B5C,stroke-width:2px
  classDef p1 fill:#eef3ec,stroke:#7C9885
  classDef p2 fill:#fbf3e8,stroke:#D4A373
  classDef mcp fill:#f3eff5,stroke:#9C8AA5
  classDef user fill:#f7f3ee,stroke:#A89B8A
  class PF,NA,MX,AD p0
  class LC,KV,LM,FG,TL p1
  class SW,CR,LU,WWW p2
  class M1,M2,M3 mcp
  class U1,U2,U3,U4 user
```

<div class="lurus-callout lurus-callout--tip"><span class="lurus-callout__icon"><Icon name="eye" :size="18"/></span><div><p class="lurus-callout__title">怎么读这张图</p><div class="lurus-callout__body">从你是谁（用户世界）出发，看你会进入哪个入口（P2），那个入口背后调用哪些业务（P1），所有业务最终都接平台底座（P0）。MCP 是把后台直接桌面化，让员工 chat 操作。</div></div></div>

> 一句话产品速记见 [决策路由](/cross/decision-router) 的一句话索引表。

## 四类典型问题怎么找答案

```mermaid
graph TD
  Q[我要解决什么问题]
  Q --> Q1{1. 我要用 Lurus 做事}
  Q --> Q2{2. 我要把 X 接到 Lurus}
  Q --> Q3{3. Lurus 哪个产品适合我的客户}
  Q --> Q4{4. 我要排查 / 部署}

  Q1 --> R1[决策路由<br/>cross/decision-router]
  Q2 --> R2[集成配方<br/>cross/integration-recipes]
  Q3 --> R3[用户旅程 + 能力矩阵<br/>cross/user-journeys + capability-matrix]
  Q4 --> R4[运维 SOP<br/>ops/]

  R1 --> P[再看具体产品手册<br/>products/&lt;id&gt;]
  R2 --> P
  R3 --> P
  R4 --> P

  classDef ans fill:#eef3ec,stroke:#7C9885
  class R1,R2,R3,R4 ans
```

## 阅读顺序建议

<div class="lurus-grid--products">
<div class="lurus-card"><strong><Icon name="users" :size="16"/> 新员工</strong><p>先看 <a href="/onboarding/">七天入职 onboarding</a>，再读这页 → <a href="/cross/capability-matrix">能力矩阵</a>，挑 1 个产品深入。</p></div>
<div class="lurus-card"><strong><Icon name="trending-up" :size="16"/> 新销售</strong><p><a href="/cross/user-journeys">用户旅程</a> → <a href="/cross/decision-router">决策路由</a>（学着回答客户"我该用哪个"）。</p></div>
<div class="lurus-card"><strong><Icon name="check-circle" :size="16"/> 新客户成功 / PM</strong><p><a href="/cross/capability-matrix">能力矩阵</a> → <a href="/cross/user-journeys">用户旅程</a> → 读你负责产品的手册。</p></div>
<div class="lurus-card"><strong><Icon name="hammer" :size="16"/> 新工程师</strong><p><a href="/cross/integration-recipes">集成配方</a> → 读你接手产品的手册 → <a href="/ops/">运维 SOP</a>。</p></div>
</div>
