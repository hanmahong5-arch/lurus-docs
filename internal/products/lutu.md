---
id: lutu
group: platform
priority: P2
status: dev
lastReviewed: 2026-05-28
sourcePath: 2c-app-lutu
---

# 路途 Lutu — 内部员工手册

<div class="lurus-callout lurus-callout--info"><span class="lurus-callout__icon"><Icon name="package" :size="18"/></span><div><p class="lurus-callout__title">版本 0.2.3+4 · 最后更新 2026-04-28</p><div class="lurus-callout__body">Flutter 3.35+ / Dart 3.9+ · 仅 Android（Windows 手机号降级）。Lurus 平台唯一移动端入口。</div></div></div>

<p><span class="lurus-tag">P2</span> <span class="lurus-tag lurus-tag--muted">dev · Phase 1 internal-tool</span></p>

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">0.2.3+4</span><span class="lurus-stat__label">version</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">15</span><span class="lurus-stat__label">ChangeNotifier</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">1135</span><span class="lurus-stat__label">单元/Widget PASS</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">24.2 MB</span><span class="lurus-stat__label">arm64 APK</span></div>
</div>

## Dev 速查

| 项 | 值 |
|---|---|
| gRPC 后端（内部） | `platform-core.lurus-platform.svc:18105`（Dart gRPC stub，`lurus_proto/identity/v1/identity.pbgrpc.dart`） |
| 关键 Flutter 依赖版本 | `flutter_appauth ^8.0.1` · `flutter_secure_storage ^9.2.4` · `sqflite ^2.4.1` · `sentry_flutter ^9.19.0` · `go_router ^14.8.1` |
| Sentry DSN 注入 | `--dart-define=SENTRY_DSN=<dsn>` 编译时传入；空值时完全静默，不产生任何网络请求 |
| Release APK | `flutter build apk --release --obfuscate --split-per-abi --dart-define=SENTRY_DSN=<dsn>` |
| 真源端口 | lurus.yaml line 567 (`grpc_port: 18105`) |

---

## 1. 产品定位与三阶段战略

路途（Lutu）是 Lurus 平台唯一移动端入口，由两条历史线合并而来：

- **lutu**（原 Flutter 账户/计费客户端）
- **lucrum-app**（原 Expo React Native 量化 APP，已废弃并入）

当前在 `lurus.yaml` 中标注 `phase: internal-tool`，战略路线三阶段清晰：

| 阶段 | 标识 | 当前状态 | 目标用户 |
|------|------|--------|--------|
| **Phase 1** | internal-tool | **正在进行** | Lurus 内部员工，dogfooding 验证 |
| **Phase 2** | enterprise-demo | 待 Lucrum DNS / OIDC client 就位 | 企业客户演示与 POC |
| **Phase 3** | consumer | 待 iOS 证书 + 计费合规 | C 端消费者公开上线 |

三阶段共享同一代码库，通过功能开关（build-time defines）和后端部署环境区分，不分支。

---

## 2. 架构总览

### 2.1 Flutter 应用层次图

```mermaid
graph TB
    subgraph Lutu["Lutu APP (Flutter 3.35+)"]
        direction TB
        UI["5-Tab Shell\nHome / Chat / Lucrum / Discover / Profile"]
        PM["Provider Layer (15 ChangeNotifiers)\nAuthProvider · WalletProvider · ChatProvider\nMarketProvider · AdvisorProvider · StrategyProvider\nNotificationProvider · UsageProvider · ..."]
        SVC["Service Layer\nApiClient(Dio) · ChatService(SSE) · WsClient\nAuthService · BootstrapService · LucrumApi\nLocalDb(sqflite) · LocalCache · TokenStore"]
        DL["Deep Link Service\nlurus:// scheme receiver\nbuffered cold-start URIs"]
    end

    subgraph Backends["后端三路"]
        P["Platform\nidentity.lurus.cn\n(account · billing · wallet · subscription\n notification WS)"]
        G["LLM Gateway\ntest-router.lurus.cn → newapi.lurus.cn\n(Portkey AI Gateway + newapi)\nREST + SSE"]
        L["Lucrum\nlucrum.lurus.cn\n(market · kline · advisor · strategy)"]
        A["Zitadel OIDC\nauth.lurus.cn"]
    end

    UI --> PM
    PM --> SVC
    SVC --> P
    SVC --> G
    SVC --> L
    SVC -.->|PKCE authorize| A
    DL -.->|URI dispatch| UI
```

### 2.2 数据流：登录（OIDC PKCE）

```mermaid
sequenceDiagram
    actor User
    participant App as Lutu APP
    participant AppAuth as flutter_appauth
    participant Zitadel as auth.lurus.cn (Zitadel)
    participant Platform as identity.lurus.cn

    User->>App: 点击「企业 SSO 登录」
    App->>AppAuth: authorizeAndExchangeCode(clientId, redirectUrl, scopes)
    AppAuth->>Zitadel: /oauth/v2/authorize?response_type=code&code_challenge=...
    Zitadel-->>User: 浏览器登录页
    User->>Zitadel: 输入凭证
    Zitadel-->>AppAuth: 302 cn.lurus.lutu://callback?code=xxx
    AppAuth->>Zitadel: POST /oauth/v2/token (PKCE code_verifier)
    Zitadel-->>AppAuth: access_token + refresh_token + id_token
    AppAuth-->>App: AuthorizationTokenResponse
    App->>App: TokenStore.saveTokens() (flutter_secure_storage)
    App->>Platform: GET /api/v1/account/me (Bearer access_token)
    Platform-->>App: Account 对象
    App->>App: BootstrapService: 并发预取 wallet/subs/notifications/checkin
    App-->>User: 跳转 /home
```

### 2.3 数据流：AI 对话（SSE 流式）

```mermaid
sequenceDiagram
    actor User
    participant Chat as ChatScreen
    participant Router as ModelRouter (本地)
    participant CS as ChatService
    participant GW as test-router.lurus.cn (Portkey)
    participant NA as newapi.lurus.cn
    participant DB as LocalDb (sqflite)

    User->>Chat: 输入消息
    Chat->>Router: ModelRouter.resolve(prompt, requested, available)
    Router-->>Chat: effectiveModel (e.g. deepseek-chat / deepseek-reasoner)
    Chat->>CS: sendMessage(conversation, content, history, modelOverride)
    CS->>DB: insertMessage(userMsg)
    CS->>GW: POST /v1/chat/completions\n{model, messages, stream:true}\nx-portkey-provider: openai\nx-portkey-custom-host: newapi.lurus.cn/v1\nAuthorization: Bearer sk-xxx (gatewaySharedKey)
    GW->>NA: 透传 OpenAI-compatible 请求
    NA-->>GW: SSE data chunks
    GW-->>CS: SSE stream (delta content)
    loop 每个 delta
        CS-->>Chat: onToken(delta)
        Chat-->>User: 实时渲染 Markdown
    end
    CS->>DB: insertMessage(assistantMsg, tokenCount)
    CS-->>Chat: ChatMessage (complete)
    Chat->>Chat: WalletProvider.fetchWallet() (余额刷新)
```

---

## 3. 技术栈速查

| 层 | 选型 | 版本 / 说明 |
|----|------|------------|
| 运行时 | Flutter | 3.35+ |
| 语言 | Dart | 3.9+ (sdk ^3.9.2) |
| 状态管理 | Provider + ChangeNotifier | `^6.1.2`，ProxyProvider 实现 auth-aware 自动清空 |
| 路由 | go_router | `^14.8.1`，含认证守卫 redirect |
| HTTP | Dio | `^5.7.0`，AuthInterceptor + RetryInterceptor(指数退避+jitter) |
| 流式 | SSEClient (自实现) | 基于 Dio，1 次重试 2s 延迟 |
| 实时 | WsClient (自实现) | 基于 web_socket_channel，指数退避，最多 5 次重连，30s 心跳 |
| 认证 | flutter_appauth | `^8.0.1`，OIDC PKCE；Windows 降级为手机号 |
| 安全存储 | flutter_secure_storage | `^9.2.4`，tokens 加密存储 |
| 本地 DB | sqflite | `^2.4.1`，聊天历史持久化 |
| 图表 | fl_chart | `^0.70.2`，K 线 / 饼图 / 用量折线 |
| Markdown | flutter_markdown | `^0.7.6` |
| QR | mobile_scanner + qr_flutter | `^6.0.0` / `^4.1.0` |
| 崩溃上报 | sentry_flutter | `^9.19.0`，build-time `SENTRY_DSN` 控制，空时 no-op |
| 模型路由 | ModelRouter (本地, `lib/services/model_router.dart`) | 规则路由 4 tier，Phase 2 切 Portkey server-side |

---

## 4. 目录结构

```
2c-app-lutu/
├── lib/
│   ├── main.dart               # 启动入口：DI、Router、ErrorReporting
│   ├── constants.dart          # API URLs、OIDC config、VIP tiers、WS config
│   ├── core/
│   │   ├── auth_aware_mixin.dart   # ProxyProvider auto-clear on logout
│   │   ├── error_reporting.dart    # Sentry init + FlutterError.onError
│   │   ├── exceptions.dart         # AppError 类型体系 (Network/Auth/Server/Business)
│   │   ├── result.dart             # sealed Result<T, E>
│   │   ├── theme/
│   │   │   ├── tokens.dart
│   │   │   └── semantic_colors.dart  # ThemeExtension: context.semantic.*
│   │   └── l10n.dart               # 字符串常量 S.*
│   ├── models/                 # json_serializable 数据类 (build_runner 生成)
│   ├── providers/              # 15 ChangeNotifier (AuthProvider 为根)
│   ├── services/
│   │   ├── api_client.dart         # Dio 封装 + RetryInterceptor
│   │   ├── auth_service.dart       # OIDC / Direct / Phone 三路登录
│   │   ├── auth_interceptor.dart   # Bearer 注入 + token 刷新
│   │   ├── bootstrap_service.dart  # 启动时并发预取 4 接口
│   │   ├── chat_service.dart       # SSE 聊天 + sqflite 持久化
│   │   ├── gateway_api.dart        # GatewayApi (tokens/logs/usage)
│   │   ├── lucrum_api.dart         # LucrumApi (market/kline/advisor/strategy)
│   │   ├── model_router.dart       # 本地 4-tier prompt 分类路由
│   │   ├── notification_service.dart  # WS 连接管理
│   │   ├── platform_api.dart       # PlatformApi (account/wallet/sub/billing)
│   │   ├── sse_client.dart         # SSE 解析 + auto-retry
│   │   ├── token_store.dart        # flutter_secure_storage 封装
│   │   ├── credentials_store.dart
│   │   ├── connectivity_service.dart
│   │   ├── local_cache.dart        # 内存 5min 缓存
│   │   ├── local_db.dart           # sqflite schema + CRUD
│   │   ├── payment_service.dart
│   │   ├── deep_link_service.dart  # lurus:// 冷启动缓冲
│   │   └── streak_service.dart
│   ├── screens/
│   │   ├── home/                   # 仪表盘 + 快捷入口 4×2
│   │   ├── chat/                   # AI Chat (SSE, 历史, 设置)
│   │   ├── lucrum/                 # 市场 / K线 / 顾问 / 策略市场
│   │   ├── discover/               # Prompt / Strategy marketplace
│   │   ├── profile/                # 账户 / 通知 / 订阅 / 安全
│   │   ├── wallet/                 # 充值 / VIP / 用量分析 / 交易记录
│   │   ├── scanner/                # QR 扫描 (lurus:// deep link)
│   │   └── legal/                  # 用户协议 / 隐私政策
│   └── widgets/
│       ├── chat/                   # message_bubble, animated_message_item
│       ├── lucrum/                 # kline_chart, stock_card, index_card
│       ├── common/                 # shimmer_loading, streak_badge, section_header
│       └── offline_badge.dart
├── test/
│   └── contract/               # lucrum_contract_test + platform_contract_test
│                               # --tags contract，CI anti-drift
├── android/
├── ios/
├── pubspec.yaml                # version 0.2.3+4
└── CLAUDE.md
```

---

## 5. 后端三路详解

| 后端 | 域名 | 协议 | 主要用途 | 认证方式 |
|------|------|------|---------|---------|
| Platform | `identity.lurus.cn` | REST + WebSocket | 账户、钱包、计费、订阅、通知 | Bearer JWT (platform JWT) |
| LLM Gateway | `test-router.lurus.cn` (Stage) | REST + SSE | LLM 聊天、模型列表、用量统计 | Bearer `gatewaySharedKey` (sk-xxx) |
| Lucrum | `lucrum.lurus.cn` | REST + SSE | 市场数据、K线、11 AI 顾问、策略市场 | Bearer JWT |
| Zitadel OIDC | `auth.lurus.cn` | OIDC/OAuth2 | SSO 企业登录 PKCE 流程 | PKCE code_verifier |
| Notification WS | `wss://identity.lurus.cn/api/v1/notifications/ws` | WebSocket | 实时推送（未读计数、通知事件） | `?token=<access_token>` |

<div class="lurus-callout lurus-callout--warn"><span class="lurus-callout__icon"><Icon name="key-round" :size="18"/></span><div><p class="lurus-callout__title">LLM 鉴权现状（临时方案）</p><div class="lurus-callout__body">当前所有用户共享一个 newapi sk-xxx 令牌（<code>ApiConfig.gatewaySharedKey</code>，newapi user_id=1 root 账户）。原因：platform-core JWT 无法直接传入 newapi <code>/v1/*</code> 接口，SSO bridge 尚未实现。轮换与长期方案见下。</div></div></div>

**重要：LLM 鉴权现状（临时方案）**

当前所有用户共享一个 newapi sk-xxx 令牌（`ApiConfig.gatewaySharedKey`，newapi user_id=1 root 账户）。这是因为 platform-core JWT 无法直接传入 newapi `/v1/*` 接口，SSO bridge 尚未实现。

- 轮换方式：登录 newapi (root / Lurus@ops) → Tokens → 撤销并重建 "lutu-app-shared" → 更新 `constants.dart::gatewaySharedKey` → 重新打包发布
- 长期方案：platform-core 新增 `/api/v1/account/llm-key` 端点，按用户 mint newapi token，计费绑定

---

## 6. 本地模型路由（ModelRouter）

`lib/services/model_router.dart` 在客户端本地执行 prompt 复杂度分类，对话请求前决策使用哪个具体 LLM，无需服务端往返。

**分类 4 个 Tier：**

| Tier | 触发条件 | 默认候选（首个命中 catalog 的） |
|------|---------|---------------------------|
| `fast` | 短 prompt，无代码/推理标记 | deepseek-chat → deepseek-v3 → gemini-2.5-flash |
| `balanced` | 中等长度(>1500 chars) 或单个推理词 | qwen/qwen3-32b → llama-3.3-70b → deepseek-chat |
| `code` | 含 ``` 代码块、栈帧形状、代码关键词 | deepseek-coder → qwen-coder-32b → deepseek-chat |
| `heavy` | >8000 chars 或 2+ 推理词 | deepseek-reasoner → deepseek-r1 → glm-4-plus |

用户在 Model Picker 中选择 `lurus-auto` 伪模型时，触发自动路由；选择具体模型时直接使用。

**Phase 2 迁移路径**：当 `router.lurus.cn` (Portkey server-side gateway) 上线后，APP 直接发送 `model: "lurus-auto"`，Portkey 条件路由接管，本地 ModelRouter 退化为 offline/gateway 不可达时的降级备用。

---

## 7. Provider 状态机与 Auth 依赖链

所有 15 个 Provider 均通过 `ChangeNotifierProxyProvider` 挂载，依赖 `AuthProvider` 作为根节点。`AuthAwareMixin` 确保登出时自动清空本地状态，防止用户切换时数据泄漏。

```
AuthProvider (root)
├── AccountProvider    → PlatformApi
├── WalletProvider     → PlatformApi (ChatProvider 消息发送后刷新余额)
├── SubscriptionProvider → PlatformApi
├── ProductProvider    → PlatformApi
├── CheckinProvider    → PlatformApi
├── NotificationProvider → PlatformApi + NotificationService(WS)
├── UsageProvider      → GatewayApi
├── TokenProvider      → GatewayApi
├── ChatProvider       → ChatService(SSE) + WalletProvider.fetchWallet()
├── ChatHistoryProvider → ChatService
├── MarketProvider     → LucrumApi (后台自动刷新，App 前台恢复时 force=true)
├── AdvisorProvider    → LucrumApi
└── StrategyProvider   → LucrumApi
```

关键设计点：
- **加载保护**：所有 Provider 设 `_loading` 标志，防止重复 in-flight 请求
- **离线降级**：MarketProvider / StrategyProvider 持有 5min 内存缓存，断网时 OfflineBadge 显示
- **App 生命周期**：`MainShell` 注册 `WidgetsBindingObserver`，App 切入后台停止 MarketProvider 自动刷新，恢复前台强制刷新

---

## 8. QR 与 Deep Link

应用注册 `lurus://` custom scheme，支持以下 URI：

| URI 模式 | 用途 | 实现路由 |
|---------|------|---------|
| `lurus://qr-login/<sessionId>` | QR 码扫描登录确认 (v1) | `/scanner/confirm-login/:sessionId` |
| `lurus://qr?v=1&id=<hex>&a=<action>&h=<sig>` | QR v2 通用动作确认 | `/scanner/confirm-qr/:id` |
| `lurus://redeem/<code>` | 礼品码自动填充 | `/redeem` |

**冷启动处理**：`DeepLinkService` 在 `main()` 最早处初始化，缓冲冷启动 URI；待 `GoRouter` 就绪后 `attachRouter()` 触发派发，确保进程启动前的 URI 不丢失。

---

## 9. 构建与发布

### 9.1 环境准备

```bash
export PATH="/d/flutter/bin:$PATH"
flutter pub get
# 首次 / model 类变更时：
flutter pub run build_runner build --delete-conflicting-outputs
```

### 9.2 日常命令

```bash
# 静态分析 (CI gate: must be 0 issues)
flutter analyze --fatal-infos

# 单元 + Widget 测试 (当前 1135 PASS)
flutter test

# Contract 测试 (需 R6 stage 后端可达)
flutter test --tags contract

# Debug APK
flutter build apk --debug

# Release APK (多 ABI，混淆，split symbols)
flutter build apk --release \
  --obfuscate \
  --split-debug-info=build/symbols \
  --split-per-abi \
  --dart-define=SENTRY_DSN=<dsn> \
  --dart-define=APP_ENV=prod \
  --dart-define=APP_VERSION=0.2.3+4
```

Release APK 尺寸（arm64 24.2 MB / armeabi-v7a 20.2 MB / x86_64 26.3 MB）。

### 9.3 CI/CD

| 触发 | 动作 |
|------|------|
| 每次 push | analyze + test (exclude contract) + debug APK |
| `v*` tag | Release APK (arm64/v7a/x86_64，混淆，上传 build symbols，Sentry release) |
| 每夜 | Contract drift 测试（对 live R6 stage 后端） |

**Android 签名**：Release APK 目前未配置签名 keystore（Known Blocker #4）。发布 Play Store 前必须完成 `android/key.properties` + gradle signing config。

### 9.4 Sentry 崩溃上报

- 编译时传入 `--dart-define=SENTRY_DSN=...` 激活
- DSN 为空时完全静默，不产生网络请求，不影响启动时间
- GitHub Actions Release job 通过 `secrets.SENTRY_DSN` 注入
- 只上报 errors（`tracesSampleRate=0.0`），不发送 PII

---

## 10. 已知坑与注意事项

### 10.1 当前 Known Blockers

<div class="lurus-callout lurus-callout--warn"><span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18"/></span><div><p class="lurus-callout__title">6 项 Known Blocker</p><div class="lurus-callout__body">上线前必须清除：<code>lucrum.lurus.cn</code> DNS/cert（KB-1）、Android release 签名（KB-4）、Zitadel OIDC clientId（KB-3）等。详见下表。</div></div></div>

| 编号 | 问题 | 影响范围 | 解决路径 |
|------|------|---------|---------|
| KB-1 | `lucrum.lurus.cn` DNS / IngressRoute + cert pending | Lucrum Tab 暂用 mock 数据 | 配置 K8s IngressRoute + 申请 wildcard cert |
| KB-2 | `flutter_appauth` 不支持 Windows desktop | Windows 上 OIDC 登录不可用 | Windows 仅用手机号登录，不修复（非优先平台） |
| KB-3 | Lutu Zitadel OIDC clientId 未创建 | OIDC 登录流程无法真实测试 | 在 Zitadel admin 控制台创建 `cn.lurus.lutu` Native OIDC App，填入 `constants.dart::OidcConfig.clientId` |
| KB-4 | Android release 签名未配置 | 无法上传 Play Store / 企业分发 | 生成 keystore，配置 `android/key.properties` |
| KB-5 | gatewaySharedKey 硬编码共享 | 所有用户共享单一 sk-xxx 额度，计费不透明 | platform-core 实现 `/api/v1/account/llm-key` 端点 |
| KB-6 | Security Screen OAuth binding 管理 TODO | Profile > Security 有 `// TODO: OAuth binding management` | 实现第三方 OAuth 绑定/解绑 UI |

### 10.2 iOS 构建

- 当前无 iOS provisioning profile / distribution certificate
- `ios/` 目录存在，基础 Flutter 配置完整，但未测试
- 上线前需：Apple Developer 账号 + App ID `cn.lurus.lutu` + provisioning profile
- `flutter_appauth` iOS 需在 `Info.plist` 配置 `CFBundleURLTypes`（redirect scheme）

### 10.3 FCM 推送

- 当前通知完全通过 **WebSocket** (`wss://identity.lurus.cn/.../ws`) 实现
- FCM / APNs 推送**未集成**（已移除 `flutter_local_notifications`）
- App 切入后台后 WS 连接会断开（OS 资源回收），后台消息推送能力为零
- Phase 2 / 3 需接入 FCM：补充 `google-services.json`、重新添加 `firebase_messaging` 依赖、在 platform-core 通知模块增加 FCM dispatch path

### 10.4 VIP 体系

| Tier | 中文名 | 最低消费 | 折扣 |
|------|-------|---------|------|
| none | 无 | 0 | 无折扣 |
| silver | 白银 | ¥100 | 5% |
| gold | 黄金 | ¥500 | 10% |
| diamond | 钻石 | ¥2000 | 15% |

LB (Lubi) 积分规则：注册赠 5、首充赠 10、首订赠 30，续费月返 5%（上限 6 个月）。

---

## 11. 已知坑：详细说明

### iOS 证书问题

**症状**：`flutter build ios` 报 `No signing certificate` 或 `Provisioning profile doesn't include...`

**根因**：未配置 Xcode automatic signing / 未在 Apple Developer Portal 创建 App ID `cn.lurus.lutu`

**处置步骤**：
1. 在 Apple Developer Portal 创建 Bundle ID `cn.lurus.lutu`
2. 生成 Distribution Certificate（或使用 Automatic Signing with Team ID）
3. `ios/Runner.xcodeproj` 中设置 `DEVELOPMENT_TEAM`
4. 测试设备需添加到 Ad Hoc profile

### Android 签名

**症状**：Release APK 报 `jarsigner: key ... not found` 或 Play Store 拒绝未签名包

**处置步骤**：
```bash
# 生成 keystore（一次性操作，保存在安全位置）
keytool -genkey -v -keystore lutu-release.jks \
  -alias lutu -keyalg RSA -keysize 2048 -validity 10000

# android/key.properties
storePassword=<password>
keyPassword=<password>
keyAlias=lutu
storeFile=../../lutu-release.jks
```

在 `android/app/build.gradle` 中引入 `key.properties`（参考 Flutter 官方文档）。

### FCM Token 失效

**背景**：当前未集成 FCM，以下为 Phase 2 接入后的预期问题。

**症状**：推送送达率低，后台通知不达

**根因**：FCM token 在 App 重装或清除数据后更换，platform-core 持有的旧 token 失效

**处置**：
- App 每次启动后向 `identity.lurus.cn/api/v1/account/push-token` 上报最新 FCM token
- 平台侧收到 `messaging/registration-token-not-registered` 错误时自动清除过期 token

### OIDC PKCE 适配

**背景**：Zitadel clientId `364750761252358023` 已在 `constants.dart` 中，但 Zitadel 控制台尚未创建对应 Native App。

**症状**：`flutter_appauth` 报 `invalid_client` 或 `redirect_uri_mismatch`

**处置**：
1. 登录 `https://auth.lurus.cn` Zitadel admin
2. Projects → 创建 Native App，Bundle ID 填 `cn.lurus.lutu`
3. Redirect URI 填 `cn.lurus.lutu://callback`
4. Post-Logout URI 填 `cn.lurus.lutu://logout`
5. 启用 PKCE，禁用 client_secret（Native App）
6. 将生成的 Client ID 更新到 `lib/constants.dart::OidcConfig.clientId`

---

## 12. 应急 Runbook

### 12.1 App 启动崩溃

<div class="lurus-callout lurus-callout--warn"><span class="lurus-callout__icon"><Icon name="alert-circle" :size="18"/></span><div><p class="lurus-callout__title">症状</p><div class="lurus-callout__body">安装后立即闪退，无任何界面。</div></div></div>

**排查步骤**：

<ol class="lurus-steps">
<li>连接设备，<code>flutter logs</code> 或 <code>adb logcat | grep -i lutu</code> 查看栈帧</li>
<li>若为 <code>MissingPluginException</code>：<code>flutter clean &amp;&amp; flutter pub get &amp;&amp; flutter run</code>（plugin native 代码未重建）</li>
<li>若为 <code>FlutterError: Unable to load assets</code>：检查 <code>pubspec.yaml</code> assets 声明与 <code>assets/images/</code> 文件是否一致</li>
<li>若为 Dart 初始化异常：检查 <code>ErrorReporting.run()</code> 中 <code>WidgetsFlutterBinding.ensureInitialized()</code> 是否在 <code>runApp</code> 前执行（main.dart 已正确实现）</li>
<li>若 Sentry 已集成，查看 Sentry 控制台对应 DSN 的 Issues</li>
</ol>

### 12.2 后端 503 / 所有接口失败

**症状**：登录成功但 Home 页数据全部加载失败，或直接登录报错

**排查步骤**：
```bash
# 检查 Platform
curl -s https://identity.lurus.cn/healthz

# 检查 Gateway
curl -s https://test-router.lurus.cn/health

# 检查 Lucrum
curl -s https://lucrum.lurus.cn/api/health

# 检查 K3s Pod 状态（在服务器上）
ssh root@100.98.57.55 "kubectl get pods -A | grep -E 'platform|newapi|lucrum'"

# 查看 platform-core 日志
ssh root@100.98.57.55 "kubectl logs -n lurus-platform deploy/platform-core --tail=50"
```

**处置**：
- 若 platform Pod CrashLoopBackOff → `kubectl describe pod` 查 OOM / 配置错误
- 若 Gateway 503 → 检查 `test-router.lurus.cn` Portkey deployment 在 R6；`docker ps | grep portkey`（R6 compose 部署）
- 若 DNS 解析失败 → 检查阿里云 DNS，`lucrum.lurus.cn` A 记录指向 R6 公网 IP

### 12.3 推送收不到

**当前状态**：推送仅通过 WebSocket，App 在**前台**时有效。后台推送目前**不支持**。

**前台推送排查**：
1. 检查 `NotificationProvider` 的 `isConnected` 状态（Profile 页 debug 模式可见）
2. `adb logcat | grep "\[WS\]"` 查看 WS 连接日志
3. WS 断开原因常见：token 过期（AuthInterceptor 刷新失败后跳 login）、后端重启、网络切换
4. 手动触发重连：重新进入前台（WidgetsBindingObserver resume 不会重连 WS，需检查 NotificationProvider 的 reconnect 逻辑）

**后台推送（Phase 2 Todo）**：接入 FCM 后，当 WS 不可达时 platform-core notification 模块通过 FCM dispatch。

### 12.4 Token 认证循环（登录死循环）

**症状**：App 反复跳转到登录页，登录后立即再次跳转

**根因**：
- `TokenStore` 中存储的 access_token 已过期且 refresh 失败（OIDC clientId 未配置时 refresh 必然失败）
- `AuthInterceptor` 调用 `onTokenExpired` → `router.go('/login')` → 用户重新登录后 token 写入成功，但某个 Provider 的 in-flight 请求未被取消仍触发 expired 回调

**处置**：
1. 强制清除 Token：`adb shell pm clear cn.lurus.lutu`（清除 App 数据）或调试菜单 Profile > Settings > 退出登录
2. 若 OIDC refresh 失败（Windows 平台 / clientId 未配置），手机号登录不依赖 OIDC refresh，建议切换

---

## 附录：关键文件路径速查

| 内容 | 路径 |
|------|------|
| API URLs / OIDC / VIP config | `lib/constants.dart` |
| 启动序列 / DI | `lib/main.dart` |
| 登录三路实现 | `lib/services/auth_service.dart` |
| LLM 聊天 + SSE + sqflite | `lib/services/chat_service.dart` |
| 本地模型路由 4-tier | `lib/services/model_router.dart` |
| Lucrum 市场 + Advisor SSE | `lib/services/lucrum_api.dart` |
| Platform REST client | `lib/services/platform_api.dart` |
| Gateway REST client | `lib/services/gateway_api.dart` |
| WS 实时通知 | `lib/services/ws_client.dart` + `notification_service.dart` |
| 崩溃上报 Sentry | `lib/core/error_reporting.dart` |
| 5-Tab Shell + 生命周期 | `lib/screens/main_shell.dart` |
| Contract anti-drift 测试 | `test/contract/` |
| BMAD PRD | `./_bmad-output/planning-artifacts/prd.md` |
| Sprint Status | `./_bmad-output/implementation-artifacts/sprint-status.yaml` |

---

## 多视角速览

### 用户视角

路途是用户触达 Lurus 全栈的唯一移动入口。安装一个 App，即可完成：账户注册与登录（Zitadel SSO / 手机号）、钱包充值与余额查看、AI 对话（接入全部模型，含 deepseek / qwen / gemini）、Lucrum 实时行情与 AI 顾问、Creator 内容浏览。无需多 App 切换，数据在单一会话下打通——对话用量直接扣减钱包余额，行情变动触发 App 内通知，VIP 权益全局生效。

### 开发者视角

技术栈：**Flutter 3.35+ / Dart 3.9+**，状态管理用 `Provider + ChangeNotifier`（15 个 ChangeNotifier，以 `AuthProvider` 为根节点，`AuthAwareMixin` 保证登出时自动清空），路由用 `go_router`，HTTP 用 `Dio + RetryInterceptor`。

认证路径：`flutter_appauth` 实现 **OIDC PKCE**，对接 `auth.lurus.cn`（Zitadel），token 写入 `flutter_secure_storage`，后续请求由 `AuthInterceptor` 自动注入 Bearer 并处理 refresh。gRPC 接入通过 `platform-core.lurus-platform.svc:18105`（内部）或 `identity.lurus.cn`（外部），使用生成的 Dart gRPC stub。

关键依赖版本：`flutter_appauth ^8.0.1`、`flutter_secure_storage ^9.2.4`、`sqflite ^2.4.1`、`sentry_flutter ^9.19.0`、`go_router ^14.8.1`。构建产物走 `flutter build apk --release --split-per-abi --obfuscate`，arm64 约 24 MB。

### 运维视角

Lutu 是**纯移动端客户端**，无服务端组件，运维关注点在发布管道与后端依赖健康：

- **构建**：GitHub Actions 触发，push 走 analyze + test + debug APK，`v*` tag 触发 Release APK（arm64/armeabi-v7a/x86_64），符号文件上传至 Sentry。
- **发布**：Android → Google Play（需先完成 KB-4 签名配置）；iOS → App Store（需先完成 Apple Developer 证书 + provisioning profile）。长期方案接入 **fastlane** 自动化双端发布流程（`fastlane supply` for Play / `fastlane deliver` for App Store）。
- **监控**：崩溃接 **Sentry**（`--dart-define=SENTRY_DSN=...` 注入，空值 no-op），contract 测试每夜对 R6 stage 后端跑 anti-drift 检测。
- **后端依赖**：Platform (`identity.lurus.cn`)、LLM Gateway (`test-router.lurus.cn`)、Lucrum (`lucrum.lurus.cn`)、Zitadel (`auth.lurus.cn`)。任一 503 会导致对应功能模块降级，Health 检查见§12.2。

### 决策者视角

**单移动栈 vs 之前 Flutter + React Native 双栈**

历史上存在两条独立移动端代码库：`2c-app-lutu`（Flutter，账户/计费）和已废弃的 `lucrum-app`（Expo React Native，量化行情）。双栈造成以下问题：两套 UI 语言（Dart / JavaScript）维护成本加倍、技术 bus factor 极高（各栈只有 1 名熟悉开发者）、无法共享登录态与钱包余额、iOS / Android 发布需维护两套证书与签名流程。

**ADR-0007 决策**：废弃 `lucrum-app`，将其所有功能（行情列表、K 线图、AI 顾问 SSE、策略市场）全量移植进 `2c-app-lutu`，以 Flutter 作为唯一移动栈。收益：bus factor 从 2 降为 1 支撑、再升为 2 人熟悉同一栈；一次登录打通全部功能；单一构建产物覆盖所有 Phase 1–3 场景。代价：Dart 学习曲线（原 RN 开发者需转型）。

---

## 决策树：什么功能该入 Lutu

```mermaid
graph TD
    A[新功能需求] --> B{所有用户都会用到吗？}
    B -- 否 --> C{是企业 demo 专属场景？}
    C -- 是 --> D[加到 Lutu enterprise-demo build flavor\n通过 build-time define 控制]
    C -- 否 --> E{仅影响某个子产品？\n如仅 Lucrum / 仅 Creator}
    E -- 是 --> F[在对应 Tab 模块内实现\n不作为全局入口]
    E -- 否 --> G[暂缓，需进一步明确目标用户]
    B -- 是 --> H{需要离线访问或离线降级？}
    H -- 是 --> I[必须实现本地缓存\nsqflite 或 local_cache 5min 层\n不可全程依赖网络]
    H -- 否 --> J{涉及账户 / 钱包 / 计费？}
    J -- 是 --> K[接 platform-core REST\nidentity.lurus.cn /v1/...\n或 gRPC :18105]
    J -- 否 --> L{涉及实时行情或 AI 顾问？}
    L -- 是 --> M[接 lucrum.lurus.cn\nREST + SSE\nMarketProvider / AdvisorProvider]
    L -- 否 --> N{需要推送通知？}
    N -- 是 --> O[Phase 1: WS wss://identity.lurus.cn/.../ws\nPhase 2+: platform/notification → FCM]
    N -- 否 --> P[评估放入 Discover Tab\n或 Profile 设置区]
```

---

## 典型时序图

### 场景 A：OIDC PKCE 登录 → 查询钱包余额

```mermaid
sequenceDiagram
    actor User
    participant App as Lutu Flutter App
    participant AppAuth as flutter_appauth
    participant Zitadel as auth.lurus.cn
    participant TokenStore as flutter_secure_storage
    participant Platform as identity.lurus.cn

    User->>App: 点击「企业 SSO 登录」
    App->>AppAuth: authorizeAndExchangeCode(\n  clientId, redirectUrl,\n  scopes: [openid, profile, email])
    AppAuth->>Zitadel: GET /oauth/v2/authorize\n?code_challenge=S256&code_challenge_method=S256
    Zitadel-->>User: 浏览器登录页
    User->>Zitadel: 输入凭证
    Zitadel-->>AppAuth: 302 cn.lurus.lutu://callback?code=xxx
    AppAuth->>Zitadel: POST /oauth/v2/token\n{code, code_verifier, grant_type=authorization_code}
    Zitadel-->>AppAuth: {access_token, refresh_token, id_token}
    AppAuth-->>App: AuthorizationTokenResponse
    App->>TokenStore: saveTokens(accessToken, refreshToken)
    App->>Platform: GET /api/v1/wallet\nAuthorization: Bearer <access_token>
    Platform-->>App: {balance: 128.50, currency: "CNY", ...}
    App-->>User: 首页显示钱包余额 ¥128.50
```

### 场景 B：Lucrum 行情订阅

```mermaid
sequenceDiagram
    actor User
    participant App as Lutu Flutter App
    participant MP as MarketProvider
    participant LA as lucrum_api.dart
    participant Lucrum as lucrum.lurus.cn

    User->>App: 切换到 Lucrum Tab
    App->>MP: 触发 fetchMarketList()
    MP->>LA: LucrumApi.getMarketList()
    LA->>Lucrum: GET /api/v1/market/list\nAuthorization: Bearer <access_token>
    Lucrum-->>LA: [{symbol, price, change, ...}, ...]
    LA-->>MP: List<MarketItem>
    MP-->>App: notifyListeners()
    App-->>User: 显示行情列表

    User->>App: 点击某支股票
    App->>LA: LucrumApi.subscribeAdvisor(symbol, onToken)
    LA->>Lucrum: POST /api/v1/advisor/analyze\n{symbol, context}\nAccept: text/event-stream
    loop SSE delta
        Lucrum-->>LA: data: {"delta": "..."}
        LA-->>App: onToken(delta)
        App-->>User: 实时渲染 AI 顾问分析
    end
```

---

## 端到端完整例子

**场景**：Lutu 冷启动 → OIDC 登录 → 查 Lucrum 行情 → 下模拟订单 → 查看钱包余额扣减

### 1. OIDC 登录（Flutter Dart）

```dart
// lib/services/auth_service.dart（简化）
import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:lutu/constants.dart';
import 'package:lutu/services/token_store.dart';

class AuthService {
  final FlutterAppAuth _appAuth = const FlutterAppAuth();
  final TokenStore _tokenStore;

  AuthService(this._tokenStore);

  Future<void> loginWithOidc() async {
    final result = await _appAuth.authorizeAndExchangeCode(
      AuthorizationTokenRequest(
        OidcConfig.clientId,                  // 'cn.lurus.lutu' native app client
        OidcConfig.redirectUrl,               // 'cn.lurus.lutu://callback'
        issuer: OidcConfig.issuer,            // 'https://auth.lurus.cn'
        scopes: ['openid', 'profile', 'email', 'offline_access'],
        promptValues: ['login'],
      ),
    );
    if (result == null) throw AppError.auth('OIDC flow cancelled');
    await _tokenStore.saveTokens(
      accessToken: result.accessToken!,
      refreshToken: result.refreshToken!,
      idToken: result.idToken,
      expiresAt: result.accessTokenExpirationDateTime,
    );
  }
}
```

### 2. 查询 Lucrum 行情（REST）

```dart
// lib/services/lucrum_api.dart（简化）
import 'package:dio/dio.dart';
import 'package:lutu/models/market_item.dart';

class LucrumApi {
  final Dio _dio;  // 已注入 AuthInterceptor，自动 Bearer

  LucrumApi(this._dio);

  Future<List<MarketItem>> getMarketList() async {
    final resp = await _dio.get(
      'https://lucrum.lurus.cn/api/v1/market/list',
    );
    return (resp.data['items'] as List)
        .map((e) => MarketItem.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  /// 下模拟订单（不涉及真实资金）
  Future<SimOrder> placeSimOrder({
    required String symbol,
    required String direction, // 'buy' | 'sell'
    required double quantity,
  }) async {
    final resp = await _dio.post(
      'https://lucrum.lurus.cn/api/v1/sim/order',
      data: {
        'symbol': symbol,
        'direction': direction,
        'quantity': quantity,
        'type': 'market',
      },
    );
    return SimOrder.fromJson(resp.data as Map<String, dynamic>);
  }
}
```

### 3. 查询钱包余额（platform-core REST）

```dart
// lib/services/platform_api.dart（简化）
import 'package:dio/dio.dart';
import 'package:lutu/models/wallet.dart';

class PlatformApi {
  final Dio _dio;

  PlatformApi(this._dio);

  /// platform-core REST: identity.lurus.cn /api/v1/wallet
  Future<Wallet> getWallet() async {
    final resp = await _dio.get('https://identity.lurus.cn/api/v1/wallet');
    return Wallet.fromJson(resp.data as Map<String, dynamic>);
  }
}
```

### 4. gRPC 接入示例（platform-core :18105 内部，对外走 HTTPS）

```dart
// 对外（App 直接用），通过 REST；内部 gRPC 用于服务间
// 如需在调试环境直接使用 gRPC（如集成测试），示例如下：
import 'package:grpc/grpc.dart';
import 'package:lurus_proto/identity/v1/identity.pbgrpc.dart';

Future<AccountInfo> fetchAccountGrpc(String accessToken) async {
  final channel = ClientChannel(
    'identity.lurus.cn',
    port: 443,
    options: const ChannelOptions(
      credentials: ChannelCredentials.secure(),
    ),
  );
  final stub = IdentityServiceClient(
    channel,
    options: CallOptions(
      metadata: {'authorization': 'Bearer $accessToken'},
    ),
  );
  try {
    return await stub.getAccount(GetAccountRequest());
  } finally {
    await channel.shutdown();
  }
}
```

### 5. 典型输出

```
# flutter run --release (arm64 物理设备)

I/flutter: [Bootstrap] Starting parallel prefetch...
I/flutter: [Bootstrap] wallet OK  (128ms)
I/flutter: [Bootstrap] subscription OK  (134ms)
I/flutter: [Bootstrap] notifications OK  (156ms)
I/flutter: [Bootstrap] checkin OK  (201ms)
I/flutter: [Bootstrap] All prefetch completed in 201ms

# 查询行情（MarketProvider）
I/flutter: [LucrumApi] GET /api/v1/market/list → 200, 42 items, 89ms

# 下模拟订单
I/flutter: [LucrumApi] POST /api/v1/sim/order {symbol: BTC-USD, direction: buy, qty: 0.01}
I/flutter: [LucrumApi] → 201 {orderId: "sim-20260429-0001", filled: 0.01, price: 94321.50}

# 钱包余额刷新（下单后 WalletProvider.fetchWallet()）
I/flutter: [PlatformApi] GET /api/v1/wallet → 200
I/flutter: [WalletProvider] balance: 128.50 → 127.96 CNY (sim deduct 0.54)
```

---

## 最佳实践 ✓/✗

| # | ✓ 推荐做法 | ✗ 反模式 |
|---|-----------|---------|
| 1 | ✓ OIDC token 存入 `flutter_secure_storage`（Android Keystore / iOS Keychain 加密） | ✗ 存入 `SharedPreferences` 明文，任何有 root / backup 权限的进程可读取 |
| 2 | ✓ 离线时读 `LocalCache`（5 min 内存层）或 `sqflite` 持久层，并显示 `OfflineBadge` | ✗ 所有数据全程依赖网络，断网即白屏，用户体验崩溃 |
| 3 | ✓ 渐进升级：`force_update_min_build` 阈值控制，低于阈值才强制跳 Store，否则只弹可关闭横幅 | ✗ 每次启动强制弹更新弹窗；或完全不做版本检测，旧 API 契约 break 时用户闪退 |
| 4 | ✓ 用不同 build flavor（`internal` / `staging` / `prod`），通过 `--dart-define=APP_ENV=...` 区分，各 flavor 指向不同后端 | ✗ 同一 binary 内通过运行时开关切环境，容易因误操作导致 internal 用户访问 prod 数据 |
| 5 | ✓ 推送走 `platform/notification → FCM`（Phase 2+），platform-core 统一管理 FCM token 生命周期 | ✗ 在 App 内自建 WebSocket 长连推送后台消息（OS 会杀掉后台 socket，Android Doze / iOS Background App Refresh 均限制） |
| 6 | ✓ 崩溃全部接 Sentry（`--dart-define=SENTRY_DSN=...`），自动采集 Dart 异常 + Flutter framework 错误，含符号化 stack trace | ✗ 只靠 `adb logcat` 或用户截图反馈崩溃，生产问题定位周期以天计 |
| 7 | ✓ Contract 测试（`flutter test --tags contract`）每夜对 R6 stage 后端跑，保障 API 契约不 drift | ✗ 只做单元测试，后端 API 悄悄改字段导致生产 JSON 解析异常 |
| 8 | ✓ `AuthInterceptor` 统一处理 token refresh，业务层不感知 token 过期 | ✗ 每个 Provider 各自处理 401，刷新逻辑散落各处，容易产生并发重复 refresh |

---

## 跨产品集成场景

### 场景一：Lutu + Platform（账户/钱包）

Lutu 通过 `PlatformApi`（`lib/services/platform_api.dart`）对接 `identity.lurus.cn`，覆盖以下核心流程：

- **账户**：`GET /api/v1/account/me` — 获取用户基本信息（uid / display_name / vip_tier / avatar）
- **钱包**：`GET /api/v1/wallet` — 余额、LB 积分、历史交易；`POST /api/v1/wallet/topup` — 充值（跳转支付页或内购）
- **订阅**：`GET /api/v1/subscription` — 当前套餐与到期时间；`POST /api/v1/subscription/purchase` — 购买/续费
- **通知**：`GET /api/v1/notifications` — 未读列表；`WebSocket wss://identity.lurus.cn/api/v1/notifications/ws?token=<access_token>` — 实时推送

所有请求由 `AuthInterceptor` 注入 Bearer JWT，`RetryInterceptor` 指数退避重试（最多 3 次，含 jitter）。`BootstrapService` 在登录后并发预取上述 4 个接口，Home 页无感加载。

### 场景二：Lutu + Lucrum（吸收的移动端）

`lucrum-app`（Expo React Native）已通过 ADR-0007 废弃并入，功能映射关系：

| 原 lucrum-app 功能 | 映射到 Lutu 模块 | 实现文件 |
|-------------------|-----------------|---------| 
| 行情列表 | `screens/lucrum/market_screen.dart` | `LucrumApi.getMarketList()` |
| K 线图 | `screens/lucrum/kline_screen.dart` | `fl_chart` KLineChart widget |
| AI 顾问 SSE | `screens/lucrum/advisor_screen.dart` | `LucrumApi.subscribeAdvisor()` → SSE |
| 策略市场 | `screens/lucrum/strategy_market_screen.dart` | `StrategyProvider` |
| 登录（独立账户体系）| 统一 Zitadel OIDC / 手机号 | `AuthService` |

⚠ **当前阻断**：`lucrum.lurus.cn` IngressRoute + TLS 证书尚未完成（KB-1），Lucrum Tab 暂显示 mock 数据，`LucrumApi` 已实现但后端不可达。

---

## 运维常见问题

```mermaid
flowchart TD
    START([运维问题入口]) --> Q1{问题类型}

    Q1 --> IOS[iOS 审核被拒]
    Q1 --> ANDROID[Android 64位崩溃]
    Q1 --> PUSH[推送收不到]
    Q1 --> OAUTH[OAuth 回调失败]
    Q1 --> CRASH[升级后闪退]

    IOS --> IOS1{拒绝原因}
    IOS1 -- 缺隐私说明 --> IOS2[在 Info.plist 补全\nNSPhotoLibraryUsageDescription\nNSCameraUsageDescription 等\n提交 App Privacy Nutrition Label]
    IOS1 -- 加密声明 --> IOS3[勾选 Uses Encryption=YES\n+ 填 ERN 豁免（标准 HTTPS 算法）]
    IOS1 -- 内购合规 --> IOS4[Phase 3 前必须接 StoreKit\n不得绕过 IAP 引导外部支付]

    ANDROID --> ANDROID1{崩溃堆栈}
    ANDROID1 -- UnsatisfiedLinkError --> ANDROID2[检查 .so ABI 覆盖\n必须包含 arm64-v8a\n使用 --split-per-abi 分包或 fat APK]
    ANDROID1 -- 64位 JNI 问题 --> ANDROID3[flutter_secure_storage / sqflite\n升级到最新版，清 build 重编]
    ANDROID1 -- Proguard 混淆 --> ANDROID4[检查 -keep rules\njson_serializable 生成类需加白名单]

    PUSH --> PUSH1{推送路径}
    PUSH1 -- Phase 1 前台WS --> PUSH2[检查 WsClient 连接状态\nadb logcat grep WS\nToken 过期会导致 WS 连接被踢]
    PUSH1 -- Phase 2+ FCM --> PUSH3[检查 FCM token 上报\nGET /api/v1/account/me 看 push_token 字段\n查 platform-core notification 模块日志]
    PUSH3 --> PUSH4{FCM 返回码}
    PUSH4 -- registration-token-not-registered --> PUSH5[App 重装导致 token 变更\n下次启动自动上报新 token\n平台侧清除旧 token]
    PUSH4 -- SENDER_ID_MISMATCH --> PUSH6[google-services.json 与\nFirebase 控制台项目不匹配\n重新下载 json 重新构建]

    OAUTH --> OAUTH1{错误码}
    OAUTH1 -- invalid_client --> OAUTH2[Zitadel 控制台检查\nclientId 是否存在\nNative App 类型是否正确]
    OAUTH1 -- redirect_uri_mismatch --> OAUTH3[Zitadel 控制台对应 App\n添加 cn.lurus.lutu://callback\nInfo.plist CFBundleURLTypes 也要配]
    OAUTH1 -- 回调无法唤起App --> OAUTH4[Android: AndroidManifest.xml\nintent-filter scheme 检查\niOS: Info.plist CFBundleURLSchemes]

    CRASH --> CRASH1{闪退时机}
    CRASH1 -- 升级后立即闪退 --> CRASH2[sqflite schema 版本未迁移\n检查 local_db.dart onUpgrade\n清除 App 数据临时验证]
    CRASH1 -- 启动时白屏 --> CRASH3[flutter clean && pub get\nMissingPluginException 常见于\nnative plugin 未重建]
    CRASH1 -- 特定操作崩溃 --> CRASH4[查 Sentry Issues\n按 build number 过滤\n下载符号文件 symbolicate]
```

---

appended 360 lines, 5 mermaid charts to lutu.md
