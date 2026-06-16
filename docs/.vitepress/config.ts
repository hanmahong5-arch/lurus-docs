import { defineConfig } from 'vitepress'
import llmstxt from 'vitepress-plugin-llms'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { localeLabels } from './i18n-labels'

// ── i18n ────────────────────────────────────────────────────────────────
// Default (source) locale is zh-CN at the site root. Translated locales live
// under /<id>/ (docs/<id>/...). A locale is only ENABLED once its core pages
// are translated — otherwise its switcher entry would 404. To turn one on,
// finish its docs/<id>/ pages (docs-i18n workflow) then uncomment it here.
const ENABLED_LOCALES = [
  { id: 'en', label: 'English', lang: 'en' },
  // Pending full translation — labels ready in i18n-labels.ts, uncomment when
  // docs/<id>/ is complete (49 core pages):
  // { id: 'ja', label: '日本語', lang: 'ja' },
  // { id: 'ko', label: '한국어', lang: 'ko' },
  // { id: 'es', label: 'Español', lang: 'es' },
  // { id: 'fr', label: 'Français', lang: 'fr' },
]

// Route paths (normalized: no trailing slash except root) that have a
// translated page in every enabled locale. Only these get the /<locale> prefix
// when localizing nav/sidebar links; everything else stays root (zh fallback,
// which always exists → no dead links).
const IN_SET = new Set<string>([
  '/',
  '/guide/introduction', '/guide/quickstart', '/guide/get-api-key', '/guide/faq', '/guide/troubleshooting',
  '/guide/clients/cherry-studio', '/guide/clients/lobe-chat', '/guide/clients/opencat', '/guide/clients/others',
  '/api/overview', '/api/authentication', '/api/chat-completions', '/api/schemas', '/api/errors',
  '/kova', '/kova/quickstart', '/kova/concepts', '/kova/api',
  '/memx', '/memx/quickstart', '/memx/concepts', '/memx/architecture', '/memx/faq',
  '/lumen', '/lumen/quickstart', '/lumen/python-sdk', '/lumen/cli', '/lumen/integration',
  '/lucrum', '/lucrum/quickstart', '/lucrum/strategies', '/lucrum/faq',
  '/switch', '/switch/install', '/switch/configuration', '/switch/usage', '/switch/cost-monitoring', '/switch/mcp-servers', '/switch/team-config',
  '/platform', '/platform/billing', '/platform/faq',
  '/platform/auth', '/platform/auth/concepts', '/platform/auth/login', '/platform/auth/oidc', '/platform/auth/api-auth', '/platform/auth/console',
])

const normPath = (p: string) => (p === '/' ? '/' : p.replace(/\/$/, ''))

function prefixLink(link: string, prefix: string): string {
  if (!link || link[0] !== '/') return link // external / relative / hash-only
  const [path, hash] = link.split('#')
  if (!IN_SET.has(normPath(path))) return link // out-of-set → keep zh fallback
  const np = '/' + prefix + path
  return hash ? `${np}#${hash}` : np
}

const tr = (text: string, dict: Record<string, string>) => (text && dict[text]) || text

function localizeNav(items: any[], dict: Record<string, string>, prefix: string): any[] {
  return items.map((it) => {
    const o: any = { ...it }
    if (o.text) o.text = tr(o.text, dict)
    if (o.link) o.link = prefixLink(o.link, prefix)
    if (o.items) o.items = localizeNav(o.items, dict, prefix)
    return o
  })
}

function localizeSidebar(sb: Record<string, any[]>, dict: Record<string, string>, prefix: string) {
  const out: Record<string, any[]> = {}
  for (const key of Object.keys(sb)) out['/' + prefix + key] = localizeNav(sb[key], dict, prefix)
  return out
}

function buildLocales() {
  const locales: Record<string, any> = {
    root: { label: '简体中文', lang: 'zh-CN' },
  }
  for (const L of ENABLED_LOCALES) {
    const dict = localeLabels[L.id] || {}
    locales[L.id] = {
      label: L.label,
      lang: L.lang,
      link: `/${L.id}/`,
      themeConfig: {
        nav: localizeNav(navZh, dict, L.id),
        sidebar: localizeSidebar(sidebarZh, dict, L.id),
        editLink: {
          pattern: 'https://github.com/hanmahong5-arch/lurus-docs/edit/main/docs/:path',
          text: tr('在 GitHub 上编辑此页', dict),
        },
        outline: { level: [2, 3], label: tr('页面导航', dict) },
        lastUpdated: {
          text: tr('最后更新于', dict),
          formatOptions: { dateStyle: 'short', timeStyle: 'short' },
        },
      },
    }
  }
  return locales
}

// ── Source-locale (zh) nav + sidebar — also the base for localization ─────
const navZh = [
  { text: '首页', link: '/' },
  { text: '快速开始', link: '/guide/quickstart' },
  {
    text: '开始使用',
    items: [
      { text: '获取 API Key', link: '/guide/get-api-key' },
      { text: '常见问题', link: '/guide/faq' },
      { text: '故障排查', link: '/guide/troubleshooting' },
      { text: '术语表', link: '/guide/glossary' },
      { text: '跨产品教程', link: '/tutorials/' },
      { text: '迁移指南', link: '/migrations/' },
    ]
  },
  {
    text: '开发者',
    items: [
      { text: 'API 参考', link: '/api/overview' },
      { text: '集成与 MCP 目录', link: '/integrations/' },
      { text: 'Kova — Agent 执行引擎', link: '/kova/' },
      { text: 'MemX — AI 智能记忆', link: '/memx/' },
      { text: 'Lumen — Agent 可观测', link: '/lumen/' },
      { text: '系统架构', link: '/developer/architecture' },
      { text: '认证 (PAT/JWT)', link: '/platform/auth/api-auth' },
    ]
  },
  {
    text: '企业方案',
    items: [
      { text: '方案总览', link: '/solutions/' },
      { text: '为什么选择 Lurus', link: '/solutions/why-lurus' },
      { text: '企业部署形态', link: '/solutions/enterprise-deploy' },
      { text: '金融行业', link: '/solutions/industry-finance' },
      { text: '内容行业', link: '/solutions/industry-content' },
      { text: '开发工具行业', link: '/solutions/industry-devtools' },
      { text: '企业 AI 中台', link: '/solutions/ai-midware' },
    ]
  },
  {
    text: '产品',
    items: [
      {
        text: 'AI 服务',
        items: [
          { text: 'Lurus API', link: '/guide/introduction' },
          { text: 'Kova', link: '/kova/' },
          { text: 'MemX', link: '/memx/' },
          { text: 'Lucrum', link: '/lucrum/' },
          { text: 'Lumen', link: '/lumen/' },
          { text: 'Forge', link: '/forge/' },
        ]
      },
      {
        text: '桌面 & 移动',
        items: [
          { text: 'Switch', link: '/switch/' },
          { text: 'Creator', link: '/creator/' },
          { text: 'Lutu', link: 'https://www.lurus.cn/download#lutu' },
        ]
      },
      {
        text: '平台',
        items: [
          { text: '账号与计费', link: '/platform/' },
          { text: '统一身份认证', link: '/platform/auth/' },
        ]
      },
    ]
  },
  { text: '动态', link: '/updates/' },
]

const sidebarZh = {
  '/guide/': [
    {
      text: '入门指南',
      collapsed: false,
      items: [
        { text: '简介', link: '/guide/introduction' },
        { text: '快速开始', link: '/guide/quickstart' },
        { text: '获取 API Key', link: '/guide/get-api-key' },
        { text: '支持的模型', link: '/guide/models' },
        { text: '常见问题', link: '/guide/faq' },
        { text: '故障排查', link: '/guide/troubleshooting' },
        { text: '术语表', link: '/guide/glossary' }
      ]
    },
    {
      text: '客户端集成',
      collapsed: true,
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
      collapsed: false,
      items: [
        { text: '概述', link: '/api/overview' },
        { text: '认证', link: '/api/authentication' },
        { text: 'Chat Completions', link: '/api/chat-completions' },
        { text: '数据结构 (Schema)', link: '/api/schemas' },
        { text: '错误处理', link: '/api/errors' }
      ]
    }
  ],
  '/integrations/': [
    {
      text: '集成目录',
      collapsed: false,
      items: [
        { text: '集成与 MCP 目录', link: '/integrations/' }
      ]
    }
  ],
  '/developer/': [
    {
      text: '开发者指南',
      collapsed: false,
      items: [
        { text: '系统架构', link: '/developer/architecture' }
      ]
    }
  ],
  '/lucrum/': [
    {
      text: 'Lucrum 量化交易',
      collapsed: false,
      items: [
        { text: '简介', link: '/lucrum/' },
        { text: '快速开始', link: '/lucrum/quickstart' },
        { text: '策略市场', link: '/lucrum/strategies' },
        { text: '常见问题', link: '/lucrum/faq' },
      ]
    }
  ],
  '/kova/': [
    {
      text: 'Kova 执行引擎',
      collapsed: false,
      items: [
        { text: '简介', link: '/kova/' },
        { text: '快速开始', link: '/kova/quickstart' },
        { text: '核心概念', link: '/kova/concepts' },
        { text: 'API 参考', link: '/kova/api' },
      ]
    }
  ],
  '/platform/': [
    {
      text: '平台文档',
      collapsed: false,
      items: [
        { text: '概述', link: '/platform/' },
        { text: '计费详解', link: '/platform/billing' },
        { text: '常见问题', link: '/platform/faq' },
      ]
    },
    {
      text: '统一身份认证',
      collapsed: false,
      items: [
        { text: '概述与接入点', link: '/platform/auth/' },
        { text: '核心概念', link: '/platform/auth/concepts' },
        { text: '登录与 MFA', link: '/platform/auth/login' },
        { text: 'OIDC / OAuth2 集成', link: '/platform/auth/oidc' },
        { text: 'API 认证 (PAT/JWT)', link: '/platform/auth/api-auth' },
        { text: '控制台管理', link: '/platform/auth/console' },
      ]
    }
  ],
  '/lumen/': [
    {
      text: 'Lumen 可观测性',
      collapsed: false,
      items: [
        { text: '简介', link: '/lumen/' },
        { text: '快速开始', link: '/lumen/quickstart' },
        { text: 'Python SDK', link: '/lumen/python-sdk' },
        { text: 'CLI 手册', link: '/lumen/cli' },
        { text: '生态集成', link: '/lumen/integration' },
      ]
    }
  ],
  '/forge/': [
    {
      text: 'Forge 产品工作台',
      collapsed: false,
      items: [
        { text: '简介', link: '/forge/' },
        { text: '快速入门 (Beta)', link: '/forge/getting-started' },
        { text: 'Ontology', link: '/forge/ontology' },
        { text: 'Session 工作流', link: '/forge/sessions' },
        { text: '路线图', link: '/forge/roadmap' },
      ]
    }
  ],
  '/switch/': [
    {
      text: 'Switch 工具管理',
      collapsed: false,
      items: [
        { text: '简介', link: '/switch/' },
        { text: '安装指南', link: '/switch/install' },
        { text: '配置说明', link: '/switch/configuration' },
        { text: '使用手册', link: '/switch/usage' },
        { text: '成本监控', link: '/switch/cost-monitoring' },
        { text: 'MCP 服务器', link: '/switch/mcp-servers' },
        { text: '团队同步', link: '/switch/team-config' },
      ]
    }
  ],
  '/creator/': [
    {
      text: 'Creator 内容工厂',
      collapsed: false,
      items: [
        { text: '简介', link: '/creator/' },
        { text: '安装指南', link: '/creator/install' },
        { text: '使用手册', link: '/creator/usage' },
        { text: '使用案例', link: '/creator/use-cases' },
      ]
    }
  ],
  '/tutorials/': [
    {
      text: '跨产品教程',
      collapsed: false,
      items: [
        { text: '教程中心', link: '/tutorials/' },
        { text: '记忆 Agent (MemX+Kova)', link: '/tutorials/memory-agent' },
        { text: 'Lumen × LangGraph × Kova', link: '/tutorials/lumen-kova-langgraph' },
        { text: 'Lucrum 策略完整流', link: '/tutorials/lucrum-strategy-workflow' },
        { text: '团队 AI CLI 接入 (Switch+MCP)', link: '/tutorials/switch-mcp-team' },
      ]
    }
  ],
  '/solutions/': [
    {
      text: '企业方案',
      collapsed: false,
      items: [
        { text: '方案总览', link: '/solutions/' },
        { text: '为什么选择 Lurus', link: '/solutions/why-lurus' },
        { text: '企业部署形态', link: '/solutions/enterprise-deploy' },
        { text: '企业 AI 中台', link: '/solutions/ai-midware' },
      ]
    },
    {
      text: '行业方案',
      collapsed: false,
      items: [
        { text: '金融', link: '/solutions/industry-finance' },
        { text: '内容', link: '/solutions/industry-content' },
        { text: '开发工具', link: '/solutions/industry-devtools' },
      ]
    }
  ],
  '/migrations/': [
    {
      text: '迁移指南',
      collapsed: false,
      items: [
        { text: '迁移中心', link: '/migrations/' },
        { text: '从 OpenAI', link: '/migrations/from-openai' },
        { text: '从 LangGraph', link: '/migrations/from-langgraph' },
        { text: '从自建 OIDC', link: '/migrations/from-self-oidc' },
      ]
    }
  ],
  '/memx/': [
    {
      text: 'MemX 智能记忆',
      collapsed: false,
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
      collapsed: false,
      items: [
        { text: '全部更新', link: '/updates/' },
      ]
    }
  ],
  '/admin/': [
    {
      text: 'Admin',
      collapsed: false,
      items: [
        { text: 'Dashboard', link: '/admin/' },
        { text: 'Updates', link: '/admin/updates' },
        { text: 'Products', link: '/admin/products' },
      ]
    }
  ],
}

export default defineConfig({
  title: 'LurusTech Docs',
  description: 'LurusTech 平台文档 — API Reference · Quickstart · Integration Guide',
  lang: 'zh-CN',

  cleanUrls: true,

  // Locale pages (/en/... etc.) can link to not-yet-translated pages; tolerate
  // those without failing the build. The zh root stays strictly checked.
  ignoreDeadLinks: [/^\/(en|ja|ko|es|fr)\//],

  locales: buildLocales(),

  sitemap: {
    hostname: 'https://docs.lurus.cn'
  },

  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+SC:wght@400;500&display=swap', rel: 'stylesheet' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: 'Lurus 产品动态', href: '/feed.xml' }],
    // Self-hosted variable fonts — served from /public/fonts/ when present,
    // otherwise the system stack in tokens/_typography.css takes over.
    ['link', { rel: 'preload', href: '/fonts/InterVariable.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }],
    ['link', { rel: 'preload', href: '/fonts/JetBrainsMono-Variable.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }],
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
    lineNumbers: true,
    codeCopyButtonTitle: 'Copy',
    config(md) {
      tabsMarkdownPlugin(md)
    }
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: false,

    nav: navZh,

    sidebar: sidebarZh,

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
