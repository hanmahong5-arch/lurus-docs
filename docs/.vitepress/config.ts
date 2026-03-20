import { defineConfig } from 'vitepress'
import llmstxt from 'vitepress-plugin-llms'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

export default defineConfig({
  title: 'Lurus',
  description: 'Lurus AI 基础设施与产品平台 — LLM 网关、Agent 执行引擎、智能记忆、量化交易、桌面工具',
  lang: 'zh-CN',

  cleanUrls: true,

  sitemap: {
    hostname: 'https://docs.lurus.cn'
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Lurus — AI 基础设施与产品平台' }],
    ['meta', { property: 'og:description', content: 'LLM 统一网关 · Agent 执行引擎 · 智能记忆 · 量化交易 · 桌面工具 — 覆盖 AI 全栈的产品文档' }],
    ['meta', { property: 'og:image', content: 'https://docs.lurus.cn/hero-image.svg' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Lurus — AI 基础设施与产品平台' }],
    ['meta', { name: 'twitter:description', content: '从执行引擎到量化交易，覆盖 AI 全栈的产品平台' }],
  ],

  vite: {
    plugins: [
      llmstxt(),
    ],
    server: {
      proxy: {
        '/api': 'http://localhost:3000',
      },
    },
  },

  markdown: {
    config(md) {
      tabsMarkdownPlugin(md)
    }
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: false,

    nav: [
      { text: '首页', link: '/' },
      {
        text: 'AI 服务',
        items: [
          { text: 'Lurus API — LLM 统一网关', link: '/guide/introduction' },
          { text: 'Kova — Agent 执行引擎', link: '/kova/' },
          { text: 'MemX — AI 智能记忆', link: '/memx/' },
          { text: 'Lucrum — AI 量化交易', link: '/gushen/' },
          { text: 'Forge — AI 产品工作台', link: '/forge/' },
        ]
      },
      {
        text: '桌面 & 移动',
        items: [
          { text: 'Switch — AI 工具管理', link: '/switch/' },
          { text: 'Creator — 内容工厂', link: '/creator/' },
          { text: 'Lumen — 开发者 CLI', link: '/lumen/' },
          { text: 'Lutu — 移动客户端', link: 'https://www.lurus.cn/download#lutu' },
        ]
      },
      {
        text: '平台',
        items: [
          { text: '账号与计费', link: '/platform/' },
          { text: 'API 参考', link: '/api/overview' },
          { text: '产品动态', link: '/updates/' },
        ]
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '入门指南',
          items: [
            { text: '简介', link: '/guide/introduction' },
            { text: '快速开始', link: '/guide/quickstart' },
            { text: '获取 API Key', link: '/guide/get-api-key' },
            { text: '支持的模型', link: '/guide/models' },
            { text: '常见问题', link: '/guide/faq' }
          ]
        },
        {
          text: '客户端集成',
          items: [
            { text: 'Cherry Studio', link: '/guide/clients/cherry-studio' },
            { text: 'Lobe Chat', link: '/guide/clients/lobe-chat' },
            { text: 'OpenCat', link: '/guide/clients/opencat' },
            { text: '其他客户端', link: '/guide/clients/others' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '概述', link: '/api/overview' },
            { text: '认证', link: '/api/authentication' },
            { text: 'Chat Completions', link: '/api/chat-completions' },
            { text: '错误处理', link: '/api/errors' }
          ]
        }
      ],
      '/developer/': [
        {
          text: '开发者指南',
          items: [
            { text: '系统架构', link: '/developer/architecture' }
          ]
        }
      ],
      '/gushen/': [
        {
          text: 'Lucrum 量化交易',
          items: [
            { text: '简介', link: '/gushen/' },
            { text: '快速开始', link: '/gushen/quickstart' },
            { text: '策略市场', link: '/gushen/strategies' },
            { text: '常见问题', link: '/gushen/faq' },
          ]
        }
      ],
      '/kova/': [
        {
          text: 'Kova 执行引擎',
          items: [
            { text: '简介', link: '/kova/' },
            { text: '快速开始', link: '/kova/quickstart' },
            { text: '核心概念', link: '/kova/concepts' },
            { text: 'API 参考', link: '/kova/api' },
          ]
        }
      ],
      '/creator/': [
        {
          text: 'Creator 内容工厂',
          items: [
            { text: '简介', link: '/creator/' },
            { text: '安装指南', link: '/creator/install' },
            { text: '使用手册', link: '/creator/usage' },
          ]
        }
      ],
      '/platform/': [
        {
          text: '平台文档',
          items: [
            { text: '概述', link: '/platform/' },
            { text: '计费详解', link: '/platform/billing' },
            { text: '常见问题', link: '/platform/faq' },
          ]
        }
      ],
      '/lumen/': [
        {
          text: 'Lumen 开发者工具',
          items: [
            { text: '简介与安装', link: '/lumen/' },
          ]
        }
      ],
      '/forge/': [
        {
          text: 'Forge 产品工作台',
          items: [
            { text: '简介', link: '/forge/' },
          ]
        }
      ],
      '/switch/': [
        {
          text: 'Switch 工具管理',
          items: [
            { text: '简介', link: '/switch/' },
            { text: '安装指南', link: '/switch/install' },
            { text: '配置说明', link: '/switch/configuration' },
            { text: '使用手册', link: '/switch/usage' },
          ]
        }
      ],
      '/memx/': [
        {
          text: 'MemX 智能记忆',
          items: [
            { text: '简介', link: '/memx/' },
            { text: '快速开始', link: '/memx/quickstart' },
            { text: '核心概念', link: '/memx/concepts' },
            { text: '架构设计', link: '/memx/architecture' },
            { text: '常见问题', link: '/memx/faq' },
          ]
        }
      ],
      '/updates/': [
        {
          text: '产品动态',
          items: [
            { text: '全部更新', link: '/updates/' },
          ]
        }
      ],
      '/admin/': [
        {
          text: 'Admin',
          items: [
            { text: 'Dashboard', link: '/admin/' },
            { text: 'Updates', link: '/admin/updates' },
            { text: 'Products', link: '/admin/products' },
          ]
        }
      ],
    },

    editLink: {
      pattern: 'https://github.com/hanmahong5-arch/lurus-docs/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/hanmahong5-arch' }
    ],

    footer: {
      message: 'Powered by Lurus Technologies',
      copyright: 'Copyright &copy; 2024-2026 Lurus'
    },

    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 3],
      label: '页面导航'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    }
  }
})
