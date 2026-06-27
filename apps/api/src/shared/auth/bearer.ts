import { createRemoteJWKSet, jwtVerify } from 'jose'
import type { JWTPayload } from 'jose'
import type { MiddlewareHandler } from 'hono'

import { ApiError } from '../http/errors.js'
import type { AuthEnv, AuthPrincipal } from './types.js'

const issuer = process.env['COGNITO_ISSUER']
const clientId = process.env['COGNITO_CLIENT_ID']
const jwksUri = process.env['COGNITO_JWKS_URI'] ?? (issuer ? `${issuer}/.well-known/jwks.json` : undefined)
const jwks = jwksUri ? createRemoteJWKSet(new URL(jwksUri)) : undefined

type CognitoPayload = JWTPayload & {
  token_use?: string
  client_id?: string
  scope?: string
  'cognito:groups'?: string[]
}

const disabledPrincipal = (): AuthPrincipal => ({
  id: 'local-development-user',
  tokenUse: 'access',
  clientId: 'local-development-client',
  scopes: process.env['AUTH_DISABLED_SCOPES']?.split(' ').filter(Boolean) ?? ['*'],
  groups: [],
})

const bearerToken = (authorization: string | undefined) => {
  const [scheme, token] = authorization?.split(' ', 2) ?? []
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Bearerトークンが必要です')
  }
  return token
}

const principalFromPayload = (payload: CognitoPayload): AuthPrincipal => {
  const principal: AuthPrincipal = {
    id: payload.sub ?? 'unknown-principal',
    tokenUse: payload.token_use ?? 'unknown',
    scopes: payload.scope?.split(' ').filter(Boolean) ?? [],
    groups: payload['cognito:groups'] ?? [],
  }
  if (payload.client_id) principal.clientId = payload.client_id
  return principal
}

const verifyAccessTokenClaims = (payload: CognitoPayload) => {
  if (payload.token_use !== 'access') {
    throw new ApiError(401, 'INVALID_TOKEN_USE', 'Access tokenを指定してください')
  }
  if (clientId && payload.client_id !== clientId) {
    throw new ApiError(401, 'INVALID_TOKEN_CLIENT', 'Bearerトークンのクライアントを検証できません')
  }
}

const verifyBearerToken = async (token: string) => {
  if (!jwks || !issuer || !clientId) {
    throw new ApiError(500, 'AUTH_CONFIGURATION_ERROR', 'JWT検証設定が不足しています')
  }
  const { payload } = await jwtVerify(token, jwks, { issuer })
  verifyAccessTokenClaims(payload)
  return principalFromPayload(payload)
}

export const requireBearerAuth: MiddlewareHandler<AuthEnv> = async (c, next) => {
  const token = bearerToken(c.req.header('authorization'))

  if (process.env['AUTH_DISABLED'] === 'true' && process.env['NODE_ENV'] !== 'production') {
    c.set('principal', disabledPrincipal())
    await next()
    return
  }

  try {
    c.set('principal', await verifyBearerToken(token))
    await next()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(401, 'INVALID_TOKEN', 'Bearerトークンを検証できません')
  }
}
