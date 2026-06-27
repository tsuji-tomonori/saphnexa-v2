import type { MiddlewareHandler } from 'hono'

import { ApiError } from '../http/errors.js'
import type { AuthEnv } from './types.js'

export const requirePermission = (permissions: readonly string[]): MiddlewareHandler<AuthEnv> => {
  return async (c, next) => {
    if (permissions.length === 0) {
      await next()
      return
    }

    const principal = c.get('principal')
    const granted = new Set([...principal.scopes, ...principal.groups])
    const allowed = permissions.every((permission) => granted.has(permission) || granted.has('*'))
    if (!allowed) throw new ApiError(403, 'FORBIDDEN', 'APIを実行する権限がありません')

    await next()
  }
}
