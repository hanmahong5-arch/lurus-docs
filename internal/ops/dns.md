---
title: DNS 管理
lastReviewed: 2026-04-28
owner: marvin
---

# DNS 管理（lurus.cn）

<div class="lurus-section-head"><span class="lurus-section-head__eyebrow"><Icon name="network" :size="14"/> 网络运维</span><h2 class="lurus-section-head__title">DNS 管理（lurus.cn）</h2><p class="lurus-section-head__lede">权威 DNS 在 Cloudflare；主域 / www 因 ICP 备案单独指向阿里云，<strong>改动前务必读 ICP 章节</strong>。</p></div>

## 拓扑

权威 DNS: **Cloudflare**

| 记录 | 值 | 备注 |
|---|---|---|
| `A *.lurus.cn` | `43.226.46.164` | 三丰云 R1 / 50Mbps |
| `A www.lurus.cn` | `123.57.143.63` | 阿里云 / 3Mbps / ICP 备案 |
| `A lurus.cn` | `123.57.143.63` | 根域 |
| `A mail.lurus.cn` | `43.226.46.164` | — |
| `MX lurus.cn` | `mail.lurus.cn` | priority 10 |
| `TXT lurus.cn` | `"v=spf1 ip4:43.226.46.164 include:sendcloud.net -all"` | SPF |
| `TXT _dmarc` | `"v=DMARC1; p=quarantine; rua=mailto:postmaster@lurus.cn"` | DMARC |
| `TXT dkim._domainkey` | （从 stalwart 控制台取） | DKIM |

## 为什么 www 要拆出去 → ICP 备案

中国大陆 IDC 入站 80/443 必须 ICP 备案的域名才能正常解析对应 IP。  
`*.lurus.cn` 通配在三丰云（已 ICP 备案）跑没问题；但 `www.lurus.cn / lurus.cn` 是 ICP 主域名，按规要求**主域名必须落国内 IDC**，所以单独指阿里云的 ICP 入口。

阿里云 cloud-ali-4 跑 nginx stream proxy（80/443 转发到 R1 Traefik NodePort）+ K3s agent（仅 lurus-www pod）。

## 常见任务

### 加新子域

<ol class="lurus-steps">
<li>决定指向（默认 R1：<code>43.226.46.164</code>）。</li>
<li>

Cloudflare API 加 A 记录：

```bash
TOKEN=<cloudflare-api-token>
ZONE_ID=<lurus.cn zone id>
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"type":"A","name":"new-sub","content":"43.226.46.164","ttl":300,"proxied":false}'
```

</li>
<li>

加对应 K8s IngressRoute（Traefik）：

```bash
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
```

</li>
<li>

验证：

```bash
dig +short new-sub.lurus.cn
curl -sS -o /dev/null -w '%{http_code}\n' https://new-sub.lurus.cn/
```

</li>
</ol>

### 改主域 / www（涉及 ICP）

<div class="lurus-callout lurus-callout--danger"><span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18"/></span><div><p class="lurus-callout__title">改 lurus.cn / www.lurus.cn 必须仍指向 ICP 备案 IP</p><div class="lurus-callout__body">当前 ICP 备案在阿里云 <code>123.57.143.63</code>。改到其它 IP 之前必须先在阿里云控制台变更备案，否则会被运营商<strong>拦截</strong>。切勿"测试一下指三丰云" — 即使是 5 分钟也可能触发 GFW/运营商拦截，且记录会缓存。</div></div></div>

### Cloudflare proxy 模式

<div class="lurus-callout lurus-callout--danger"><span class="lurus-callout__icon"><Icon name="cloud" :size="18"/></span><div><p class="lurus-callout__title">不要开启橙云（proxied=true）</p><div class="lurus-callout__body">开了橙云 = 流量走 Cloudflare 反代，但 Cloudflare 在大陆访问慢/不稳；且 ICP 入口要求是真实国内 IP，橙云会暴露 Cloudflare CDN IP，不符合 ICP 政策。<strong><code>proxied: false</code> 永远。</strong></div></div></div>

### 紧急切流量（R1 → R6）

<ol class="lurus-steps">
<li>Cloudflare 控制台 / API 改 <code>A *.lurus.cn → 43.226.38.244</code>。</li>
<li>R6 Traefik / nginx 配置承接（IngressRoute / nginx.conf）。</li>
<li>TLS cert 同步（<code>lurus-cn-wildcard-tls</code> 在 R1，要 export → import 到 R6 cert-manager）。</li>
<li>DNS TTL 已配 300s（5 分钟），全网更新完成。</li>
</ol>

<div class="lurus-callout lurus-callout--warn"><span class="lurus-callout__icon"><Icon name="alert-circle" :size="18"/></span><div><p class="lurus-callout__title">未演练</p><div class="lurus-callout__body">这条路径<strong>没演练过</strong>。计划 2026 Q3 做一次切换演练。</div></div></div>

## 紧急联系

| 资源 | 控制台 | 备注 |
|---|---|---|
| Cloudflare DNS | dash.cloudflare.com | API token 见密码管理器 |
| 三丰云 (R1/R6) | sf-express.com | console + 工单 |
| 阿里云 (cloud-ali-4) | console.aliyun.com | RAM 子账号 + MFA |
| ICP 备案 | beian.miit.gov.cn / 阿里云备案 | 备案号见 footer |

## 已知坑

<div class="lurus-callout lurus-callout--warn"><span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18"/></span><div><p class="lurus-callout__title">带宽单点 + 缓存污染</p><div class="lurus-callout__body"><ul><li>三丰云 50Mbps 公网，对外 https 单点。带宽爆掉时所有 <code>*.lurus.cn</code> 卡顿。目前靠 Pingdom 外部探测；服务侧指标采集见 <a href="/ops/observability">可观测性 Runbook</a>。</li><li>阿里云 cloud-ali-4 仅 3Mbps，承载 <code>www.lurus.cn</code> 主页 + ICP 入口，访问量上来要么换大带宽要么 CDN 缓存（CDN 又跟 ICP 政策打架）。</li><li>DNS TTL 300s 切流量快，但缓存污染恢复也慢。改重要记录前预设回滚。</li></ul></div></div></div>
