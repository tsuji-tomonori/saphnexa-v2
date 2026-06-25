export default defineNuxtConfig({
  compatibilityDate: '2026-06-25',
  devtools: { enabled: true },
  typescript: {
    typeCheck: true,
    strict: true
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? 'http://localhost:8787'
    }
  }
})
