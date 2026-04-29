import { defineConfig } from 'vitepress'

// Lurus Internal — 仅限内部员工的产品手册 / SOP / ADR / Onboarding
// 与 docs/ 公网站完全独立：独立 srcDir / 独立 dist / 不被搜索引擎索引 / 边缘 OIDC 双闸门
export default defineConfig({
  title: 'Lurus Internal',
  titleTemplate: ':title · Lurus Internal',
  description: 'Lurus 员工内部知识库：产品手册 / 运维 SOP / ADR / 复盘 / 入职 / 路线图',
  lang: 'zh-CN',
  base: '/',
  outDir: '../dist-internal',
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['meta', { name: 'robots', content: 'noindex, nofollow, noarchive' }],
    ['meta', { name: 'googlebot', content: 'noindex, nofollow' }],
    ['meta', { name: 'baiduspider', content: 'noindex, nofollow' }],
    ['meta', { name: 'referrer', content: 'no-referrer' }],
  ],

  themeConfig: {
    siteTitle: 'Lurus Internal',

    nav: [
      { text: '驾驶舱', link: '/' },
      {
        text: '产品手册',
        items: [
          { text: 'Platform 组', items: [
            { text: 'Lurus Platform', link: '/products/platform' },
            { text: 'Newapi', link: '/products/newapi' },
            { text: 'MemX / Memorus', link: '/products/memx' },
            { text: 'Tally', link: '/products/tally' },
            { text: '路途 Lutu', link: '/products/lutu' },
            { text: 'Admin', link: '/products/admin' },
          ]},
          { text: 'Kova 组', items: [
            { text: 'Kova', link: '/products/kova' },
            { text: 'Forge', link: '/products/forge' },
            { text: 'Lumen', link: '/products/lumen' },
          ]},
          { text: 'Lucrum 组', items: [
            { text: 'Lucrum', link: '/products/lucrum' },
          ]},
          { text: 'Desktop 组', items: [
            { text: 'Switch', link: '/products/switch' },
            { text: 'Creator', link: '/products/creator' },
          ]},
          { text: 'Web 组', items: [
            { text: 'WWW + Webgame', link: '/products/web' },
          ]},
          { text: '工具链', items: [
            { text: 'MCP Servers', link: '/products/mcp' },
          ]},
        ]
      },
      { text: '运维 SOP', link: '/ops/' },
      { text: 'ADR', link: '/adr/' },
      { text: '复盘', link: '/postmortems/' },
      { text: '入职', link: '/onboarding/' },
      { text: '组织', link: '/org/' },
      { text: '路线', link: '/roadmap/' },
      { text: '↗ 公网 docs', link: 'https://docs.lurus.cn' },
    ],

    sidebar: {
      '/products/': [
        {
          text: 'Platform 组（P0）',
          collapsed: false,
          items: [
            { text: 'Lurus Platform', link: '/products/platform' },
            { text: 'Newapi (LLM 网关)', link: '/products/newapi' },
            { text: 'MemX / Memorus', link: '/products/memx' },
            { text: 'Tally (进销存)', link: '/products/tally' },
            { text: '路途 Lutu', link: '/products/lutu' },
            { text: 'Admin (运营后台)', link: '/products/admin' },
          ]
        },
        {
          text: 'Kova 组（P1）',
          collapsed: false,
          items: [
            { text: 'Kova (Agent 引擎)', link: '/products/kova' },
            { text: 'Forge (Workbench)', link: '/products/forge' },
            { text: 'Lumen (CLI / SDK)', link: '/products/lumen' },
          ]
        },
        {
          text: 'Lucrum 组（P1）',
          collapsed: false,
          items: [
            { text: 'Lucrum (AI 量化)', link: '/products/lucrum' },
          ]
        },
        {
          text: 'Desktop 组（P2）',
          collapsed: false,
          items: [
            { text: 'Switch', link: '/products/switch' },
            { text: 'Creator', link: '/products/creator' },
          ]
        },
        {
          text: 'Web 组（P2）',
          collapsed: false,
          items: [
            { text: 'WWW + Webgame', link: '/products/web' },
          ]
        },
        {
          text: '工具链',
          collapsed: false,
          items: [
            { text: 'MCP Servers (×3)', link: '/products/mcp' },
          ]
        },
      ],

      '/ops/': [
        { text: '运维 SOP', items: [
          { text: '索引', link: '/ops/' },
        ]}
      ],
      '/adr/': [
        { text: '架构决策', items: [
          { text: '索引', link: '/adr/' },
        ]}
      ],
      '/postmortems/': [
        { text: '事故复盘', items: [
          { text: '索引', link: '/postmortems/' },
        ]}
      ],
      '/onboarding/': [
        { text: '入职指引', items: [
          { text: '索引', link: '/onboarding/' },
        ]}
      ],
      '/org/': [
        { text: '组织 / Bus Factor', items: [
          { text: '索引', link: '/org/' },
        ]}
      ],
      '/roadmap/': [
        { text: '路线图', items: [
          { text: '索引', link: '/roadmap/' },
        ]}
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/hanmahong5-arch' },
    ],

    footer: {
      message: '⚠️ 仅限 Lurus 内部员工。包含未公开运维细节与决策档案，请勿外传。',
      copyright: '© 2026 Lurus Technologies — Internal Knowledge Base',
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索', buttonAriaLabel: '搜索内部知识库' },
              modal: {
                noResultsText: '未找到相关内容',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                }
              }
            }
          }
        }
      }
    },

    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdatedText: '最后更新',
    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
  },

  markdown: {
    lineNumbers: false,
    theme: { light: 'github-light', dark: 'github-dark' },
  },

  vite: {
    server: {
      port: 5174,
      strictPort: false,
    },
  },
})
