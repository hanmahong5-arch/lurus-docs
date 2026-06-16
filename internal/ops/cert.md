---
title: TLS 证书管理
lastReviewed: 2026-04-28
owner: marvin
---

# TLS 证书管理

<div class="lurus-section-head"><span class="lurus-section-head__eyebrow"><Icon name="shield-check" :size="14"/> 安全运维</span><h2 class="lurus-section-head__title">TLS 证书管理</h2><p class="lurus-section-head__lede">cert-manager 自动续 K8s 内通配符证书；阿里云 nginx 与 Stalwart 的副本仍需<strong>人工同步</strong>。</p></div>

## 拓扑

| 名称 | 用途 | 类型 | 颁发 | 续期 |
|---|---|---|---|---|
| `lurus-cn-wildcard-tls` | `*.lurus.cn` + `lurus.cn` | 通配 | Let's Encrypt（DNS-01 via Cloudflare） | cert-manager 自动 |
| 阿里云 ICP 入口 | nginx stream（前置） | 通配（同上） | 同 | 手工同步 |
| Stalwart 邮件 | smtps/imaps | 通配（同上） | 同 | 手工同步 |

## cert-manager 状态查

```bash
ssh root@100.98.57.55

kubectl get certificate -A
# NAME                        READY   SECRET                       AGE
# lurus-cn-wildcard-tls       True    lurus-cn-wildcard-tls        43d

kubectl describe certificate lurus-cn-wildcard-tls -n traefik
# 看 Status.Renewal / Status.NotAfter
```

<div class="lurus-callout lurus-callout--warn"><span class="lurus-callout__icon"><Icon name="timer" :size="18"/></span><div><p class="lurus-callout__title">续期阈值</p><div class="lurus-callout__body">剩余有效期 &lt; 30 天就该警觉。到期/续期失败告警接入见 <a href="/ops/observability">可观测性 Runbook</a>。</div></div></div>

## 强制续期（紧急）

```bash
ssh root@100.98.57.55
kubectl annotate certificate lurus-cn-wildcard-tls -n traefik \
  cert-manager.io/issue-temporary-certificate=true --overwrite

# 或删 secret 让 cert-manager 重新签
kubectl delete secret lurus-cn-wildcard-tls -n traefik
# cert-manager 检测到 secret 缺失，立即重签
kubectl get certificaterequest -A | tail
```

## 同步到阿里云 nginx + Stalwart

cert-manager 只管 K8s secret 内的证书。用作 nginx 配置和 Stalwart 的副本要手工同步。

<ol class="lurus-steps">
<li>

取最新 cert/key：

```bash
ssh root@100.98.57.55 "kubectl get secret lurus-cn-wildcard-tls -n traefik -o json" \
  | jq -r '.data["tls.crt"]' | base64 -d > /tmp/lurus.crt
ssh root@100.98.57.55 "kubectl get secret lurus-cn-wildcard-tls -n traefik -o json" \
  | jq -r '.data["tls.key"]' | base64 -d > /tmp/lurus.key
```

</li>
<li>

同步到阿里云 cloud-ali-4：

```bash
scp /tmp/lurus.{crt,key} root@100.112.185.45:/etc/nginx/ssl/
ssh root@100.112.185.45 "nginx -t && nginx -s reload"
```

</li>
<li>

同步到 Stalwart：

```bash
scp /tmp/lurus.{crt,key} root@100.98.57.55:/tmp/
ssh root@100.98.57.55 "kubectl create secret tls stalwart-tls \
  --cert=/tmp/lurus.crt --key=/tmp/lurus.key -n mail \
  --dry-run=client -o yaml | kubectl apply -f -"
ssh root@100.98.57.55 "kubectl rollout restart statefulset stalwart -n mail"
```

</li>
</ol>

## 自动同步脚本（应该写但还没写）

> TODO: 写一个 cron 在 cert-manager 续期后自动同步到 nginx/stalwart。当前是人工。

## 验证

```bash
echo | openssl s_client -servername docs.lurus.cn -connect docs.lurus.cn:443 2>/dev/null \
  | openssl x509 -noout -dates -subject -issuer

# 阿里云入口
echo | openssl s_client -servername www.lurus.cn -connect www.lurus.cn:443 2>/dev/null \
  | openssl x509 -noout -dates -subject

# 邮件
echo | openssl s_client -servername mail.lurus.cn -connect mail.lurus.cn:465 -starttls smtp 2>/dev/null \
  | openssl x509 -noout -dates -subject
```

## 已知坑

<div class="lurus-callout lurus-callout--warn"><span class="lurus-callout__icon"><Icon name="alert-triangle" :size="18"/></span><div><p class="lurus-callout__title">续期后无自动重载、无告警</p><div class="lurus-callout__body"><ul><li>cert-manager 续期后 nginx / Stalwart <strong>不会自动重载</strong> — 必须人工跑同步脚本。监控告警接入待办（见 <a href="/ops/observability">可观测性 Runbook</a>）。</li><li>DNS-01 challenge 依赖 Cloudflare API token，token 失效会续期失败，<strong>无明显告警</strong>。</li><li>通配符不覆盖二级通配（<code>*.sub.lurus.cn</code> 不被 <code>*.lurus.cn</code> 覆盖）— 当前没用到二级通配。</li></ul></div></div></div>
