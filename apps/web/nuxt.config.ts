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
