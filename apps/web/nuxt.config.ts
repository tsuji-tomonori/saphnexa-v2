const strictCompilerOptions = {
  noUncheckedIndexedAccess: true,
  exactOptionalPropertyTypes: true,
  noImplicitOverride: true,
  noImplicitReturns: true,
  noFallthroughCasesInSwitch: true,
  noPropertyAccessFromIndexSignature: true,
  useUnknownInCatchVariables: true,
  allowUnreachableCode: false,
  allowUnusedLabels: false,
  isolatedModules: true,
  verbatimModuleSyntax: true,
} as const

export default defineNuxtConfig({
  compatibilityDate: '2026-06-25',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/ui', '@comark/nuxt'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700&family=JetBrains+Mono:wght@400;500;600&display=swap',
        },
      ],
    },
  },
  components: [{ path: '~/components', pathPrefix: false }],
  typescript: {
    typeCheck: false,
    strict: true,
    tsConfig: {
      compilerOptions: strictCompilerOptions,
    },
  },
  eslint: {
    checker: false,
    config: {
      stylistic: false,
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env['NUXT_PUBLIC_API_BASE'] ?? 'http://localhost:8787',
    },
  },
})
