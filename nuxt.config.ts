const umamiHost = process.env.NUXT_UMAMI_HOST || process.env.NUXT_PUBLIC_UMAMI_HOST || ''
const umamiId = process.env.NUXT_UMAMI_ID || process.env.NUXT_PUBLIC_UMAMI_ID || ''
const umamiTag = process.env.NUXT_UMAMI_TAG || process.env.NUXT_PUBLIC_UMAMI_TAG || ''
const hasUmamiConfig = Boolean(umamiHost && umamiId)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    'nuxt-og-image',
    'nuxt-llms',
    '@nuxtjs/mcp-toolkit',
    'nuxt-umami'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  content: {
    build: {
      markdown: {
        toc: {
          searchDepth: 1
        },
        highlight: {
          langs: ['json', 'toml', 'java', 'groovy', 'diff']
        }
      }
    }
  },

  experimental: {
    asyncContext: true
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true,
      autoSubfolderIndex: false
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  icon: {
    provider: 'iconify'
  },

  llms: {
    domain: 'https://balm.twelveiterations.com',
    title: 'Balm Documentation',
    description: 'Documentation for the Balm Multi-Loader library for Minecraft Mods.',
    full: {
      title: 'Balm Documentation',
      description: 'This is the full documentation for Balm, the Multi-Loader library for Minecraft Mods.'
    },
    sections: [
      {
        title: 'Getting Started',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/getting-started%' }
        ]
      },
      {
        title: 'Content Guides',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/content%' }
        ]
      },
      {
        title: 'Utilities',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/utilities%' }
        ]
      },
      {
        title: 'Advanced',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/advanced%' }
        ]
      },
      {
        title: 'Migration',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/migration%' }
        ]
      }
    ]
  },

  mcp: {
    name: 'Balm Documentation'
  },

  umami: {
    enabled: hasUmamiConfig,
    host: umamiHost || 'https://umami.invalid',
    id: umamiId || 'disabled',
    tag: umamiTag || null,
    ignoreLocalhost: true
  }
})
