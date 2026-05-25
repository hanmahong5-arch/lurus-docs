# internal.lurus.cn → Lurus Identity (Zitadel) OIDC

把内部站从 BasicAuth 切到 Zitadel OIDC SSO。

## 架构

```
Browser
  │ 1. GET internal.lurus.cn/anything
  ▼
Traefik (R1)
  │ 2. ForwardAuth → oauth2-proxy:4180/oauth2/auth
  ▼ (401 if no cookie)
oauth2-proxy
  │ 3. 302 → auth.lurus.cn/oauth/v2/authorize
  ▼
Zitadel (auth.lurus.cn)
  │ 4. login → 302 → internal.lurus.cn/oauth2/callback
  ▼
oauth2-proxy
  │ 5. 设 cookie domain=.lurus.cn → 302 → 原始 URL
  ▼
Traefik
  │ 6. ForwardAuth 通过 → 上游 r6-internal-docs:8881 (R6 Tailscale)
```

Break-glass：`internal-fallback.lurus.cn`（不挂 DNS，仅 /etc/hosts 覆盖访问），保留 BasicAuth，
万一 Zitadel 挂了能进去。

## 你需要做的（一次性，~3 分钟）

### 1. 在 Zitadel 控制台创建 OIDC 客户端

打开 https://auth.lurus.cn/ui/console，登录账号：

- 用户名：`admin@lurus.cn`
- 密码：`Lurus@ops`

(首次登录可能要你改密码，改完再回来)

然后：

```
Console
└─ 顶部下拉切到 org "Lurus"
└─ Projects → "+ New" 建项目（或选已有）
   名称: lurus-internal
└─ 进入项目 → Applications → "+ New"
   名称: internal-docs
   Type: Web
   Authentication Method: Code (PKCE)
└─ Redirect URIs:
   https://internal.lurus.cn/oauth2/callback
└─ Post Logout URIs:
   https://internal.lurus.cn/
└─ 创建后展示 ClientID + ClientSecret —— 复制下来给我
```

### 2. 把 ClientID / ClientSecret 给我

我会用它们填 `oauth2-proxy-internal` 这个 Secret，然后 apply 整套清单。

## 我做的事（拿到 client 后）

```bash
# 1. 创建 oauth2-proxy 凭证 secret
ssh root@43.226.46.164 "kubectl create secret generic oauth2-proxy-internal -n lurus-system \
  --from-literal=client-id='<paste>' \
  --from-literal=client-secret='<paste>' \
  --from-literal=cookie-secret='qicMEYmTaMuhGdZ8GQ0-T2-5JaeDjxggYYj0TqeaizY' \
  --dry-run=client -o yaml | kubectl apply -f -"

# 2. 部署 oauth2-proxy
kubectl apply -f oauth2-proxy.yaml

# 3. 创建 ForwardAuth middleware
kubectl apply -f middleware.yaml

# 4. 替换 IngressRoute（含 break-glass fallback）
kubectl apply -f ingressroute.yaml
```

## 验证

```bash
# 应该 302 到 auth.lurus.cn 而不是 401
curl -sk -I https://internal.lurus.cn/

# break-glass 仍是 BasicAuth
curl -sk -H 'Host: internal-fallback.lurus.cn' \
  --resolve internal-fallback.lurus.cn:443:43.226.46.164 \
  -u 'lurus:Lurus@ops' https://internal-fallback.lurus.cn/
```

## 回滚

```bash
kubectl apply -f /path/to/old/lurus-internal-docs-route.yaml  # 旧的 BasicAuth route
kubectl delete -f oauth2-proxy.yaml middleware.yaml
```

## 测出来的可靠性维度

- Discovery / JWKS 公网可达性
- Auth code + PKCE flow 端到端延迟
- Refresh token 寿命（90d 配置 vs 实际）
- backchannel logout 传播（Zitadel 撤销 → oauth2-proxy 失效 cookie）
- CN 浏览器（QQ/UC/360）的 cookie SameSite=Lax 兼容性
- lurus-pg 在 zitadel 低频读下的稳定性

## 已知约束

- Zitadel **System API 服务账号当前不可用**（`zitadel-machinekey` secret 仅有公钥 PEM，对应私钥未挂载到 pod；建议后续修复 bootstrap，把完整 SA JSON 通过环境变量或 init container 拉到 `/machinekey/`）。
- 所以 OIDC client 注册只能走控制台 UI。
- 如果将来要全自动化（IaC），先修上面这条。
