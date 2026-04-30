# 用户旅程 — 4 类用户的全流程

我们把用户分成 4 类，把他们从**第一次接触 Lurus** 到**续费/流失**的全流程画出来。
每条旅程标出涉及的产品、关键卡点、目前已经做好的部分、还差什么。

> 用法：销售/客户成功带客户走流程时，对照旅程图找差距。

## 4 类用户速览

| 用户 | 典型画像 | 主入口 | 次要触点 | 主要价值产品 |
|---|---|---|---|---|
| **A. 玩家 / 个人开发者** | 想用 AI 做点东西的程序员 | Switch / Newapi | docs / Creator | Newapi + Switch |
| **B. 企业客户** | 中小公司 IT/业务负责人 | www / Tally / Lucrum | 销售 + Admin | Platform + Tally / Lucrum |
| **C. 内部员工** | Lurus 公司员工 | Admin / Switch + MCP | docs / 内部站 | 内部全套 |
| **D. 集成开发商** | 把 Lurus 嵌进自己产品 | docs / API | Newapi / Platform | Newapi + Platform API |

## A. 玩家 / 个人开发者旅程

```mermaid
journey
  title 玩家：从听说到深度用
  section 发现
    刷到 / 朋友推荐: 3: 玩家
    访问 www.lurus.cn: 4: 玩家
    看 docs.lurus.cn: 5: 玩家
  section 试用
    注册 + 拿 newapi token: 5: 玩家, Platform
    OpenAI SDK 改 base_url: 5: 玩家, Newapi
    第一次成功调用: 5: 玩家
  section 深用
    装 Switch 桌面: 4: 玩家, Switch
    配多模型路由: 3: 玩家, Switch
    加 MCP server: 3: 玩家, Switch
  section 留存
    用满 free tier: 3: 玩家
    充值 ¥ / 看账单: 4: 玩家, Platform
    推荐给同事: 5: 玩家
```

### 全流程图

```mermaid
graph LR
  A1[听说 / 推荐] --> A2[访问 www.lurus.cn]
  A2 --> A3[读 docs / quickstart]
  A3 --> A4[zitadel 注册账户]
  A4 -->|Platform| A5[拿到 newapi token]
  A5 -->|Newapi| A6[OpenAI SDK 改 base_url 跑通]
  A6 --> A7{满意吗}
  A7 -->|是| A8[装 Switch 桌面]
  A7 -->|否| A99[流失]
  A8 -->|Switch| A9[配多模型路由]
  A9 --> A10[加 MCP server]
  A10 --> A11[免费额度耗尽]
  A11 -->|Platform 钱包| A12[充值]
  A12 --> A13[活跃用户]

  classDef p0 fill:#fef0e8,stroke:#C67B5C
  classDef p2 fill:#fbf3e8,stroke:#D4A373
  classDef bad fill:#fdecea,stroke:#a3392b
  class A4,A5,A11,A12 p0
  class A8,A9,A10 p2
  class A99 bad
```

### 关键卡点 + 现状

| 阶段 | 卡点 | 现在能给什么 | 缺什么 |
|---|---|---|---|
| 注册 | OIDC 跳转流不熟 | zitadel + PKCE quickstart | 中文上手视频 |
| 拿 token | 不知道哪个 model 选 | docs/api/overview 列了 50+ | 模型推荐表（按场景） |
| 跑通调用 | 限流 429 | newapi 默认 group + 限流 | 友好的限流报错文案 |
| 装 Switch | Win 杀软误报 | 暂无 | 代码签名 |
| 充值 | 不知道单价 | Platform 计费透明 | 一键预估对话费用 |

## B. 企业客户旅程

```mermaid
journey
  title 企业：从 PoC 到续约
  section 接触
    销售线索: 3: 企业
    访问 www: 4: 企业
    看案例 / TCO: 4: 企业
  section PoC
    试用账号: 4: 企业, Platform
    跑垂直场景: 3: 企业, Lucrum/Tally
    数据私有化讨论: 2: 企业
  section 签约
    商务谈判: 3: 企业
    合同 / 私有化部署: 3: 企业, Admin
    SSO 联邦对接: 2: 企业
  section 上线
    数据迁移: 3: 企业
    员工培训: 4: 企业
    监控告警接通: 4: 企业
  section 续约
    用量报告: 5: 企业
    新需求转 PRD: 4: 企业
    续费: 5: 企业
```

### 全流程图

```mermaid
graph TD
  B1[销售线索 / 招标]
  B2[访问 www.lurus.cn]
  B3{评估方向}
  B4[Lucrum 量化]
  B5[Tally 进销存]
  B6[私有化中台]
  B7[PoC 账号]
  B8[Platform: 创建租户]
  B9[OIDC 联邦 / SCIM]
  B10[业务系统接 Newapi]
  B11[MemX 知识库导入]
  B12[Admin 后台 SSO]
  B13[上线 / 培训]
  B14[每月用量月报]
  B15{续约决策}
  B16[续约 + 加项]
  B17[流失]

  B1 --> B2 --> B3
  B3 --> B4 & B5 & B6
  B4 & B5 & B6 --> B7
  B7 --> B8 --> B9 --> B10 --> B11 --> B12 --> B13 --> B14 --> B15
  B15 -->|满意| B16
  B15 -->|不满意| B17

  classDef p0 fill:#fef0e8,stroke:#C67B5C
  classDef p1 fill:#eef3ec,stroke:#7C9885
  classDef bad fill:#fdecea,stroke:#a3392b
  class B8,B9,B10,B11,B12 p0
  class B4,B5 p1
  class B17 bad
```

### 关键卡点 + 现状

| 阶段 | 卡点 | 现在能给 | 缺什么 |
|---|---|---|---|
| 评估 | 客户问"你们对比 X 怎么样" | 销售有 [能力矩阵](/cross/capability-matrix) | TCO 计算器 |
| PoC | 数据导入费力 | 各产品手册有"端到端例子" | 数据迁移工具集 |
| 私有化 | 部署文档分散 | [ops/deploy-r6](/ops/deploy-r6) | 一键私有化脚本 |
| SSO 联邦 | zitadel 配联邦门槛高 | [adr/0002-zitadel-as-oidc](/adr/0002-zitadel-as-oidc) | 演示视频 + 模板 |
| 续约 | 无月用量报告自动化 | Platform 后台手查 | 自动月报推送 |

## C. 内部员工旅程

```mermaid
journey
  title 员工：从入职到熟练
  section 第一天
    收到账号: 5: 员工
    SSO 登录 docs: 5: 员工
    读 onboarding: 5: 员工
  section 第一周
    走完 7 天计划: 4: 员工
    选 1 个产品深入: 4: 员工
    写第一个 PR: 3: 员工
  section 第一月
    熟悉 ops / adr: 4: 员工
    参与 sprint 评审: 4: 员工
    单产品独立交付: 5: 员工
  section 季度
    跨产品协作: 4: 员工
    review 别人 PR: 4: 员工
    带新人: 5: 员工
```

### 全流程图

```mermaid
graph LR
  C1[入职 day-0] --> C2[zitadel 账号 + Tailscale]
  C2 --> C3[访问 internal.lurus.cn]
  C3 --> C4[7 天 onboarding]
  C4 --> C5{选 1 产品}
  C5 --> C6[读单产品手册]
  C6 --> C7[本地起服务]
  C7 --> C8[第一 PR]
  C8 --> C9[ops SOP 学习]
  C9 --> C10[sprint 评审参与]
  C10 --> C11[独立交付]
  C11 --> C12[跨产品协作]

  classDef milestone fill:#eef3ec,stroke:#7C9885
  class C4,C8,C11,C12 milestone
```

### 关键卡点 + 现状

| 阶段 | 卡点 | 现在能给 | 缺什么 |
|---|---|---|---|
| Day-0 | 账号开通慢 | 手动 zitadel + Tailscale 邀请 | 自助开通流 |
| 7 天 | 不知道先看什么 | [/onboarding/](/onboarding/) 7 天计划 | 视频版 |
| 第一周 | 本地起服务卡 | 各产品 README + ops SOP | 一键 dev container |
| ops 学习 | SOP 散落 | [/ops/](/ops/) 12 篇集中 | 演练脚本 |

## D. 集成开发商旅程

```mermaid
graph LR
  D1[GitHub / 找 Lurus API] --> D2[访问 docs.lurus.cn]
  D2 --> D3[读 api/overview]
  D3 --> D4[zitadel 注册 + 拿 PAT]
  D4 -->|Platform| D5[内嵌登录走 OIDC]
  D5 --> D6[业务调 Newapi]
  D6 --> D7[Webhook 接 NATS 事件]
  D7 -->|Platform/notification| D8[告警 / 通知]
  D8 --> D9[上 prod]
  D9 --> D10[月度对账]

  classDef p0 fill:#fef0e8,stroke:#C67B5C
  class D4,D5,D8,D10 p0
```

| 阶段 | 卡点 | 现在能给 | 缺什么 |
|---|---|---|---|
| 找 API | 看不懂三套 token（zitadel / PAT / newapi token）的区别 | docs/api/authentication 有图 | 速查决策树 |
| 内嵌 OIDC | redirect_uri 配置错 | zitadel 客户端模板 | OAuth playground |
| Webhook | NATS 接入文档薄 | adr/0004-temporal | NATS 接入 quickstart |

## 横向对比：4 类用户的差异

```mermaid
graph TD
  Diff[4 类用户最大差异在哪]

  Diff --> D1[A 玩家<br/>个人决策<br/>自助为主<br/>关心 ¥ 单价]
  Diff --> D2[B 企业<br/>多人决策<br/>销售+CS<br/>关心 SLA + 私有化]
  Diff --> D3[C 员工<br/>无决策<br/>自助 + 同事<br/>关心熟练度]
  Diff --> D4[D 集成商<br/>开发者决策<br/>纯文档<br/>关心 API 稳定]

  D1 --> R1[投放 docs / Switch / 自助]
  D2 --> R2[投销售 + 案例 + TCO]
  D3 --> R3[投 onboarding + ops SOP]
  D4 --> R4[投 API ref + sandbox + Webhook]

  classDef u fill:#fbf3e8,stroke:#D4A373
  classDef r fill:#eef3ec,stroke:#7C9885
  class D1,D2,D3,D4 u
  class R1,R2,R3,R4 r
```

## 怎么用这页

- **销售**：跟客户讲方案前 5 分钟看 B 路径，自检是否有 PoC 卡点。
- **CS**：客户报问题，先定位它在路径哪一环，再决定升级到 PM/工程。
- **新员工**：照 C 路径走一遍。
- **集成开发商**：D 路径整段贴给客户。
