---
layout: page
title: 产品动态
description: Lurus 产品矩阵最新动态与里程碑
---

<script setup>
import { changelog } from '../.vitepress/data/changelog'
</script>

<div class="vp-doc updates-page">

# 产品动态

追踪 Lurus 全产品线的最新变更、功能发布和技术里程碑。<a href="/feed.xml"><Icon name="activity" :size="14" /> 订阅 RSS</a>

<ClientOnly>
  <div class="updates-list">
    <UpdateCard v-for="e in changelog" :key="e.id" v-bind="e" />
  </div>
</ClientOnly>

## 基础设施

### 集群与部署

- K8s 5 节点混合云集群稳定运行
- ArgoCD GitOps 自动同步全服务
- Kyverno 策略引擎 + NetworkPolicy 命名空间隔离
- ResourceQuota + LimitRange 资源配额管理

### 安全

- Casdoor OIDC 统一身份认证
- 全站 TLS 1.3 + 通配符证书自动续期
- Trivy 容器扫描集成到所有 CI 流水线
- SM4-GCM 国密加密支持 (Kova)

</div>

<style scoped>
.updates-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
}
</style>
