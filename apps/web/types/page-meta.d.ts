declare module '#app' {
  interface PageMeta {
    screenId?: `SCR-${string}`
    authMode?: 'public' | 'authenticated'
    requiredPermissions?: readonly string[]
  }
}

export {}
