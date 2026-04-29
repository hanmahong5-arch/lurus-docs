---
title: DNS 管理
lastReviewed: 2026-04-28
owner: marvin
---

# DNS 管理（lurus.cn）

## 拓扑

```
权威 DNS: Cloudflare
└─ A *.lurus.cn        → 43.226.46.164  （三丰云 R1 / 50Mbps）
   A www.lurus.cn      → 123.57.143.63  （阿里云 / 3Mbps / ICP 备案）
   A lurus.cn          → 123.57.143.63  （根域）
   A mail.lurus.cn     → 43.226.46.164
   MX lurus.cn         → mail.lurus.cn (priority 10)
   TXT lurus.cn        → "v=spf1 ip4:43.226.46.164 include:sendcloud.net -all"
   TXT _dmarc          → "v=DMARC1; p=quarantine; rua=mailto:postmaster@lurus.cn"
   TXT dkim._domainkey → (从 stalwart 控制台取)
```

## 为什么 www 要拆出去 → ICP 备案

中国大陆 IDC 入站 80/443 必须 ICP 备案的域名才能正常解析对应 IP。  
`*.lurus.cn` 通配在三丰云（已 ICP 备案）跑没问题；但 `www.lurus.cn / lurus.cn` 是 ICP 主域名，按规要求**主域名必须落国内 IDC**，所以单独指阿里云的 ICP 入口。

阿里云 cloud-ali-4 跑 nginx stream proxy（80/443 转发到 R1 Traefik NodePort）+ K3s agent（仅 lurus-www pod）。

## 常见任务

### 加新子域

```bash
# 1. 决定指向（默认 R1：43.226.46.164）
# 2. Cloudflare API
TOKEN=<cloudflare-api-token>
ZONE_ID=&lt;lurus.cn zone id&gt;
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"type":"A","name":"new-sub","content":"43.226.46.164","ttl":300,"proxied":false}'

# 3. 加对应 K8s IngressRoute（Traefik）
ssh root@100.98.57.55 "kubectl apply -f -" <<EOF
apiVersion: traefik.io/v1alpha1
kind: IngressRoute
metadata:
  name: <name>
  namespace: <ns>
spec:
  entryPoints: [websecure]
  routes:
  - match: Host(\`new-sub.lurus.cn\`)
    kind: Rule
    services:
    - name: <svc>
      port: <port>
  tls:
    secretName: lurus-cn-wildcard-tls
EOF

# 4. 验证
dig +short new-sub.lurus.cn
curl -sS -o /dev/null -w '%{http_code}\n' https://new-sub.lurus.cn/
```

### 改主域 / www（涉及 ICP）

⚠️ **改 lurus.cn / www.lurus.cn 必须保证仍指向 ICP 备案 IP**。  
当前 ICP 备案在阿里云 `123.57.143.63`。改到其它 IP 之前必须先在阿里云控制台变更备案，否则会被运营商**拦截**。

切勿"测试一下指三丰云" — 即使是 5 分钟也可能触发 GFW/运营商拦截，且记录会缓存。

### Cloudflare proxy 模式

不要开启橙云（proxied=true）。  
原因：开了橙云 = 流量走 Cloudflare 反代，但 Cloudflare 在大陆访问慢/不稳；且 ICP 入口要求是真实国内 IP，橙云会暴露 Cloudflare CDN IP，不符合 ICP 政策。

`proxied: false` 永远。

### 紧急切流量（R1 → R6）

```
1. Cloudflare 控制台 / API 改 A *.lurus.cn → 43.226.38.244
2. R6 Traefik / nginx 配置承接（IngressRoute / nginx.conf）
3. TLS cert 同步（lurus-cn-wildcard-tls 在 R1，要 export → import 到 R6 cert-manager）
4. DNS TTL 已配 300s（5 分钟），全网更新完成
```

> 这条路径**没演练过**。计划 2026 Q3 做一次切换演练。

## 紧急联系

| 资源 | 控制台 | 备注 |
|---|---|---|
| Cloudflare DNS | dash.cloudflare.com | API token 见密码管理器 |
| 三丰云 (R1/R6) | sf-express.com | console + 工单 |
| 阿里云 (cloud-ali-4) | console.aliyun.com | RAM 子账号 + MFA |
| ICP 备案 | beian.miit.gov.cn / 阿里云备案 | 备案号见 footer |

## 已知坑

- 三丰云 50Mbps 公网，对外 https 单点。带宽爆掉时所有 *.lurus.cn 卡顿。监控未接 Prometheus，目前靠 Pingdom 外部探测。
- 阿里云 cloud-ali-4 仅 3Mbps，承载 www.lurus.cn 主页 + ICP 入口，访问量上来要么换大带宽要么 CDN 缓存（CDN 又跟 ICP 政策打架）。
- DNS TTL 300s 切流量快，但缓存污染恢复也慢。改重要记录前预设回滚。
