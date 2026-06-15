---
adr: 0007
title: 路途 Lutu 吸收 lucrum-app（RN Expo）
status: accepted
date: 2026-03
---

# ADR-0007: 路途 Lutu 吸收 lucrum-app（RN Expo）

## 背景

公司原本有两个移动 app：
- `lutu`（Flutter）：Platform dogfood 客户端
- `lucrum-app`（React Native + Expo）：Lucrum 量化交易移动端

两个 app 同时维护对单人公司过重。两套技术栈（Flutter / RN）、两份原生构建、两份 OIDC PKCE 适配。

## 备选方案

| 方案 | 拒绝原因 |
|---|---|
| 保留两个 app 各自迭代 | 维护成本 2x，bus factor 1 |
| 砍掉一个，留一个 | 方向 |
| **lutu 吸收 lucrum-app**（接受） | Flutter 生态对长期更看好；lucrum 功能可作为 lutu 的一个 module |

## 决定

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="layers" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">决定 · accepted 2026-03 · live</p>
    <div class="lurus-callout__body"><code>2c-app-lutu/</code>（Flutter）吸收 lucrum 功能 module（行情 / advisor / 简化策略）；<code>2c-app-lucrum-mobile/</code>（RN Expo 仓库）归档 + 删除。单一移动栈。</div>
  </div>
</div>

- `2c-app-lutu/` 增加 lucrum 相关功能 module（行情 / advisor / 简化策略）
- `2c-app-lucrum-mobile/`（RN Expo 仓库）归档 + 删除
- Lutu 三阶段战略明确：

<div class="lurus-stat-strip">
  <div class="lurus-stat"><span class="lurus-stat__value">①</span><span class="lurus-stat__label">internal-tool</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">②</span><span class="lurus-stat__label">enterprise-demo</span></div>
  <div class="lurus-stat"><span class="lurus-stat__value">③</span><span class="lurus-stat__label">consumer</span></div>
</div>

## 后果

正面：
- 单一移动栈，单一签名 / 证书 / 推送 / 升级流程
- lucrum 功能可借 lutu 扩量（Platform 的总入口）
- 技术债减少

负面：
- lucrum 移动用户体验短期会降级（Flutter 实现需重写）
- RN 生态的特定能力（Hermes / Reanimated）无法直接迁移
- 已有 RN 用户迁移成本

## 参考

- `lurus.yaml` `services.lurus-lutu.absorbs: lucrum-app`
- [internal/products/lutu.md](../products/lutu) 三阶段战略章节
