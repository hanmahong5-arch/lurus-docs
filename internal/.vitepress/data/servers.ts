/**
 * Server inventory — physical/virtual nodes Lurus runs on.
 * Synthesized from lurus.yaml cluster.nodes + environments sections.
 */

export interface Server {
  id: string
  name: string
  role: string
  publicIp?: string
  tailscaleIp: string
  specs: string
  provider: string
  k3s: 'master' | 'agent' | 'none' | 'embedded'
  workloads: string[]
  /** human-readable utilization estimate — manual; TODO wire to Netdata /api/v1/data (R6 :19999) */
  cpuPct?: number
  memPct?: number
  diskPct?: number
  notes?: string
}

export const servers: Server[] = [
  {
    id: 'r1',
    name: 'cloud-ubuntu-1 (R1)',
    role: 'PROD k3s master + 主流量入口',
    publicIp: '43.226.46.164',
    tailscaleIp: '100.98.57.55',
    specs: '16C / 32G / 三丰云 / 50Mbps',
    provider: '三丰云',
    k3s: 'master',
    workloads: ['lurus-www', 'lurus-docs', 'lurus-admin', 'lurus-webgame', 'lurus-tally', 'lurus-memorus', 'mail/stalwart', 'minio', 'lurus-pg', 'miaoda-oa'],
    cpuPct: 45,
    memPct: 70,
    diskPct: 50,
    notes: '所有已交付客户的商业服务都在这里。R1 容量按 70% 控；超过即考虑迁 R6 或扩容',
  },
  {
    id: 'r6',
    name: 'cloud-ubuntu-6 (R6)',
    role: 'STAGE k3s + 多租户主机',
    publicIp: '43.226.38.244',
    tailscaleIp: '100.122.83.20',
    specs: '32C / 32G / 300G SSD / 三丰云',
    provider: '三丰云',
    k3s: 'none',
    workloads: ['lurus-platform/platform-core', 'lurus-platform/zitadel', 'lucrum/lucrum-web', 'lurus-pg(local)', 'redis(local)', 'zhongtie-oa', 'kova-registry', 'lurus-docs-staging'],
    cpuPct: 30,
    memPct: 40,
    diskPct: 25,
    notes: '非 K3s 节点。docker-compose + cgroup slice 隔离多租户。lurus-infra slice 限 4C/5G',
  },
  {
    id: 'r2',
    name: 'cloud-ubuntu-2 (R2)',
    role: 'database',
    tailscaleIp: '100.94.177.10',
    specs: '4C / 8G',
    provider: '阿里云',
    k3s: 'agent',
    workloads: ['lurus-pg standby (CNPG)'],
    notes: 'PG 从节点，主在 R1 集群内 StatefulSet',
  },
  {
    id: 'r3',
    name: 'cloud-ubuntu-3 (R3)',
    role: 'DEV worker',
    tailscaleIp: '100.113.79.77',
    specs: '2C / 2G',
    provider: '阿里云',
    k3s: 'agent',
    workloads: ['env=dev nodeSelector workloads (active feature dev)'],
    notes: 'env=dev tainted node — active development workloads only',
  },
  {
    id: 'office-debian',
    name: 'office-debian-2',
    role: 'messaging',
    tailscaleIp: '100.120.110.73',
    specs: '?',
    provider: 'office (homelab)',
    k3s: 'agent',
    workloads: ['nats', 'redis (messaging)'],
    notes: '办公室内网，Tailscale 接入。NATS streams: LLM/IDENTITY/LUCRUM/PSI _EVENTS',
  },
  {
    id: 'aliyun-www',
    name: 'cloud-ali-4-2c2g',
    role: 'ICP 备案入口 (www-gateway)',
    publicIp: '123.57.143.63',
    tailscaleIp: '100.112.185.45',
    specs: '2C / 2G / 3Mbps',
    provider: '阿里云',
    k3s: 'agent',
    workloads: ['nginx-stream-proxy', 'lurus-www pod'],
    cpuPct: 15,
    memPct: 60,
    diskPct: 20,
    notes: 'ICP 备案要求只放 www.lurus.cn / lurus.cn。3Mbps 是瓶颈，监控带宽',
  },
  {
    id: 'office-win',
    name: 'office-win-1',
    role: 'storage',
    tailscaleIp: '100.79.24.40',
    specs: 'Windows + 大磁盘',
    provider: 'office',
    k3s: 'none',
    workloads: ['MinIO :9000 / console :9001'],
    notes: '物理机；MinIO buckets: pg-backups-v2 / lucrum-data / user-uploads',
  },
]

export function buildTopologyMermaid(): string {
  return `graph TB
  subgraph "公网入口"
    INET[Internet]
    DNS[DNS lurus.cn]
  end
  subgraph "ICP 入口（阿里云 3Mbps）"
    ALI["cloud-ali-4 / 123.57.143.63<br/>nginx stream + k3s agent<br/>www.lurus.cn 专用"]
  end
  subgraph "PROD（三丰云 50Mbps）"
    R1["R1 / 43.226.46.164 / 100.98.57.55<br/>16C 32G · k3s master<br/>www/docs/admin/webgame/tally/memorus/mail/minio/pg"]
  end
  subgraph "STAGE（三丰云）"
    R6["R6 / 43.226.38.244 / 100.122.83.20<br/>32C 32G 300G · 多租户 cgroup<br/>platform/zitadel/lucrum/zhongtie-oa/docs-staging"]
  end
  subgraph "agents"
    R2["R2 / 100.94.177.10<br/>db standby"]
    R3["R3 / 100.113.79.77<br/>env=dev"]
    OD["office-debian / 100.120.110.73<br/>nats + redis"]
    OW["office-win / 100.79.24.40<br/>MinIO storage"]
  end
  INET --> DNS
  DNS -->|www.lurus.cn| ALI
  DNS -->|其它子域| R1
  ALI -.k3s agent.-> R1
  R1 -.k3s.-> R2
  R1 -.k3s.-> R3
  R1 -.k3s.-> OD
  R1 -.k3s.-> OW
  classDef prod fill:#fef0e8,stroke:#C67B5C,stroke-width:2px
  classDef stage fill:#fbf3e8,stroke:#D4A373,stroke-width:2px
  classDef agent fill:#eef3ec,stroke:#7C9885
  classDef edge fill:#f3eff5,stroke:#9C8AA5
  class R1 prod
  class R6 stage
  class R2,R3,OD,OW agent
  class ALI edge`
}
