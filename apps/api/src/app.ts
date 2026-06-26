import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { cors } from 'hono/cors'

import { routes } from './routes.js'
import { apiErrorHandler } from './shared/http/error-handler.js'
import { openApiConfig } from './shared/http/openapi.js'
import { validationHook } from './shared/http/validation-hook.js'

export const createApp = () => {
  const app = new OpenAPIHono({ defaultHook: validationHook })

  app.use('*', cors())
  app.onError(apiErrorHandler)
  app.route('/', routes)
  app.doc31('/openapi.json', openApiConfig)

  if (process.env['NODE_ENV'] !== 'production') {
    app.get('/docs', swaggerUI({ url: '/openapi.json' }))
  }

  return app
}
