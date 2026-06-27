export type AuthPrincipal = {
  id: string
  tokenUse: string
  clientId?: string
  scopes: readonly string[]
  groups: readonly string[]
}

export type AuthVariables = {
  principal: AuthPrincipal
}

export type AuthEnv = {
  Variables: AuthVariables
}
