import { defineConfig } from 'vitepress'
import llmstxt from 'vitepress-plugin-llms'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

export default defineConfig({
  title: 'Lurus Docs',
  description: 'Lurus Platform Documentation — API Gateway, GuShen, Webmail, Switch, MemX',
  lang: 'zh-CN',

  cleanUrls: true,

  sitemap: {
    hostname: 'https://docs.lurus.cn'
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Lurus Docs — 一站式产品文档' }],
    ['meta', { property: 'og:description', content: 'Lurus API · GuShen · Webmail · Switch · MemX — 所有产品的完整文档' }],
    ['meta', { property: 'og:image', content: 'https://docs.lurus.cn/hero-image.svg' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Lurus Docs' }],
    ['meta', { name: 'twitter:description', content: 'Lurus Platform 产品文档中心' }],
  ],

  vite: {
    plugins: [
      llmstxt(),
    ]
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
        text: 'Lurus API',
        items: [
          { text: '简介', link: '/guide/introduction' },
          { text: '快速开始', link: '/guide/quickstart' },
          { text: '支持的模型', link: '/guide/models' },
          { text: 'API 参考', link: '/api/overview' },
          { text: '控制台', link: 'https://api.lurus.cn' },
        ]
      },
      {
        text: 'GuShen',
        items: [
          { text: '简介', link: '/gushen/' },
          { text: '快速开始', link: '/gushen/quickstart' },
          { text: '策略指南', link: '/gushen/strategy' },
          { text: 'API 参考', link: '/gushen/api' },
          { text: '进入平台', link: 'https://gushen.lurus.cn' },
        ]
      },
      {
        text: 'Webmail',
        items: [
          { text: '简介', link: '/webmail/' },
          { text: '快速开始', link: '/webmail/quickstart' },
          { text: '客户端配置', link: '/webmail/client-setup' },
          { text: '常见问题', link: '/webmail/faq' },
          { text: '进入邮箱', link: 'https://mail.lurus.cn' },
        ]
      },
      {
        text: 'Switch',
        items: [
          { text: '简介', link: '/switch/' },
          { text: '安装指南', link: '/switch/install' },
          { text: '配置说明', link: '/switch/configuration' },
          { text: '使用手册', link: '/switch/usage' },
        ]
      },
      {
        text: 'MemX',
        items: [
          { text: '简介', link: '/memx/' },
          { text: '快速开始', link: '/memx/quickstart' },
          { text: '核心概念', link: '/memx/concepts' },
          { text: '架构设计', link: '/memx/architecture' },
          { text: '常见问题', link: '/memx/faq' },
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
          text: 'GuShen 文档',
          items: [
            { text: '简介', link: '/gushen/' },
            { text: '快速开始', link: '/gushen/quickstart' },
            { text: '策略编写指南', link: '/gushen/strategy' },
            { text: 'API 参考', link: '/gushen/api' },
          ]
        }
      ],
      '/webmail/': [
        {
          text: 'Webmail 文档',
          items: [
            { text: '简介', link: '/webmail/' },
            { text: '快速开始', link: '/webmail/quickstart' },
            { text: '邮件客户端配置', link: '/webmail/client-setup' },
            { text: '常见问题', link: '/webmail/faq' },
          ]
        }
      ],
      '/switch/': [
        {
          text: 'Switch 文档',
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
          text: 'MemX 文档',
          items: [
            { text: '简介', link: '/memx/' },
            { text: '快速开始', link: '/memx/quickstart' },
            { text: '核心概念', link: '/memx/concepts' },
            { text: '架构设计', link: '/memx/architecture' },
            { text: '常见问题', link: '/memx/faq' },
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
      copyright: 'Copyright © 2024-present Lurus'
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
