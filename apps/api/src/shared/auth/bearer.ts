import { createRemoteJWKSet, jwtVerify } from 'jose'
import type { MiddlewareHandler } from 'hono'

import { ApiError } from '../http/errors.js'

const issuer = process.env['COGNITO_ISSUER']
const audience = process.env['COGNITO_CLIENT_ID']
const jwksUri = process.env['COGNITO_JWKS_URI'] ?? (issuer ? `${issuer}/.well-known/jwks.json` : undefined)
const jwks = jwksUri ? createRemoteJWKSet(new URL(jwksUri)) : undefined

export const requireBearerAuth: MiddlewareHandler = async (c, next) => {
  const authorization = c.req.header('authorization')
  const [scheme, token] = authorization?.split(' ', 2) ?? []
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Bearerトークンが必要です')
  }

  if (process.env['AUTH_DISABLED'] === 'true' && process.env['NODE_ENV'] !== 'production') {
    await next()
    return
  }

  if (!jwks || !issuer || !audience) {
    throw new ApiError(500, 'AUTH_CONFIGURATION_ERROR', 'JWT検証設定が不足しています')
  }

  try {
    await jwtVerify(token, jwks, { issuer, audience })
    await next()
  } catch {
    throw new ApiError(401, 'INVALID_TOKEN', 'Bearerトークンを検証できません')
  }
}
